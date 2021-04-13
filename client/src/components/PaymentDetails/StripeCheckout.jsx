import React, { useMemo, useContext, useState, useEffect, createContext } from 'react';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import Stripe from 'stripe';
import { useHistory } from "react-router";

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/styles/withStyles';
import TextField from '@material-ui/core/TextField';

import PropTypes from "prop-types";
import {connect} from "react-redux";

import {
  submitPayment
} from "../../reducers/actions/subscriptionActions";

import checkoutItems from '../../utils/CheckoutItems';
import createGuestAccount from '../../utils/CreateGuestAccount';

const appColors = {
  primary: '#e88330',
  secondary: '#397d87',
  paragraphText: '#7d7d7d',
  componentBg: '#f1f4f4',
  checkoutSectionBorder: '#e2e5e5',
  border: '#d1d1d1',
  buttonText: 'white',
};

const CssTextField = withStyles({
  root: {
    backgroundColor: '#fcfcfb',
    '& label.Mui-focused': {
      color: appColors.secondary,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: appColors.secondary,
      },
    },
    '&:hover': {
      backgroundColor: '#fff',
    },
    '&focused': {
      backgroundColor: '#fff',
    },
  },
})(TextField);

function useResponsiveFontSize() {
  const getFontSize = () => (window.innerWidth < 450 ? '16px' : '18px');
  const [fontSize, setFontSize] = useState(getFontSize);

  useEffect(() => {
    const onResize = () => {
      setFontSize(getFontSize());
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return fontSize;
}

const ConfirmationServiceContext = React.createContext(Promise.reject);

export const useConfirmation = () => useContext(ConfirmationServiceContext);

const useOptions = () => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: appColors.paragraphText,
          letterSpacing: '0.025em',
          fontFamily: 'Source Code Pro, monospace',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    }),
    [fontSize]
  );

  return options;
};

const StripeCheckout = (props) => {

  const elements = useElements();
  const stripe = useStripe();
  const options = useOptions();
  const history = useHistory();

  const [processing, setProcessing] = useState(false);

  console.log("StripeCheckout price: " + JSON.stringify(props.paymentSummary));

  const onPay = async (event) => {

    console.log("StripeCheckout onPay: " + JSON.stringify(props.paymentSummary));
    console.log("StripeCheckout tax: " + props.paymentSummary.taxAmount);

    event.preventDefault();

    const billingDetails = {
      name: props.firstName + ' ' + props.lastName,
      email: props.email,
      address: {
        city: props.city,
        line1: props.address.street,
        state: props.state,
        postal_code: props.zip,
      },
    };

    console.log("billing details: " + JSON.stringify(billingDetails));
    
    setProcessing(true);

    console.log("STRIPE props.paymentSummary.total: " + props.paymentSummary.total);

    let formSending = new FormData();
    formSending.append('amount', props.paymentSummary.total);
    formSending.append('note', props.instructions);

    console.log("formSending (1): " + JSON.stringify(formSending));

    try {
      console.log("formSending (2): " + JSON.stringify(formSending));
      let stripeIntentResponse;
      await axios.post(
        'https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/Stripe_Intent',
        formSending,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      ).then(res => {
        console.log("Stripe_Intent response: " + JSON.stringify(res));
        stripeIntentResponse = res;
      })
      .catch(err => {
        console.log(err);
        if (err.response) {
          console.log("error: " + JSON.stringify(err.response));
        }
      });
      let client_secret = stripeIntentResponse.data.client_secret;
      let charge_id = stripeIntentResponse.data.id;

      const items = [{
        qty: props.selectedPlan.num_deliveries.toString(),
        name: props.selectedPlan.item_name,
        price: props.selectedPlan.item_price.toString(),
        item_uid: props.selectedPlan.item_uid,
        itm_business_uid: props.selectedPlan.itm_business_uid
      }];

      console.log("checkout items: " + JSON.stringify(items));

      const cardElement = await elements.getElement(CardElement);

      const paymentMethod = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      const confirmed = await stripe.confirmCardPayment(client_secret, {
        payment_method: paymentMethod.paymentMethod.id,
      });

      if(props.customerUid !== 'GUEST') {
        console.log("STRIPE CHECKOUT (1) -- not a guest");
        console.log("STRIPE CHECKOUT (1) -- amount_due: " + props.paymentSummary.total);

        checkoutItems(
          {
            customer_uid: props.customerUid,
            business_uid: 'WEB',
            items,
            salt: "",
            order_instructions: 'fast',
            delivery_instructions: props.deliveryInstructions,
            delivery_first_name: props.firstName,
            delivery_last_name: props.lastName,
            delivery_phone: props.phone,
            delivery_email: props.email,
            delivery_address: props.address.street,
            delivery_unit: props.unit,
            delivery_city: props.city,
            delivery_state: props.state,
            delivery_zip: props.zip,
            delivery_latitude: props.latitude,
            delivery_longitude: props.longitude,
            purchase_notes: 'purchase_notes',
            amount_due: props.paymentSummary.total,
            amount_discount: props.paymentSummary.discountAmount,
            amount_paid: '0.00',
            cc_num: 'NULL',
            cc_exp_year: 'NULL',
            cc_exp_month: 'NULL',
            cc_cvv: 'NULL',
            cc_zip: 'NULL',
            charge_id: charge_id,
            payment_type: 'STRIPE',
            service_fee: props.paymentSummary.serviceFee,
            delivery_fee: props.paymentSummary.deliveryFee,
            tip: props.paymentSummary.tip,
            tax: props.paymentSummary.taxAmount,
            subtotal: props.paymentSummary.mealSubPrice,
            amb: props.paymentSummary.ambassadorDiscount
          },
          () => {
            history.push("/congrats")
          }
        );

      } else if (props.customerUid === 'GUEST') {
        console.log("STRIPE CHECKOUT (2) -- guest");
        console.log("STRIPE CHECKOUT (2) -- amount_due: " + props.paymentSummary.total);

        createGuestAccount(
          {
            email: props.email,
            first_name: props.firstName,
            last_name: props.lastName,
            phone_number: props.phone,
            address: props.street,
            unit: props.unit,
            city: props.city,
            state: props.state,
            zip_code: props.zip,
            latitude: props.latitude,
            longitude: props.longitude,
            referral_source: "WEB",
            role: "CUSTOMER",
            social: "FALSE",
            social_id: "NULL",
            user_access_token: "FALSE",
            user_refresh_token: "FALSE",
            mobile_access_token: "FALSE",
            mobile_refresh_token: "FALSE"
          },
          () => {
            checkoutItems(
              {
                customer_uid: props.customerUid,
                business_uid: 'WEB',
                items,
                salt: "",
                order_instructions: 'fast',
                delivery_instructions: props.deliveryInstructions,
                delivery_first_name: props.firstName,
                delivery_last_name: props.lastName,
                delivery_phone: props.phone,
                delivery_email: props.email,
                delivery_address: props.address.street,
                delivery_unit: props.unit,
                delivery_city: props.city,
                delivery_state: props.state,
                delivery_zip: props.zip,
                delivery_latitude: props.latitude,
                delivery_longitude: props.longitude,
                purchase_notes: 'purchase_notes',
                amount_due: props.paymentSummary.total,
                amount_discount: props.paymentSummary.discountAmount,
                amount_paid: '0.00',
                cc_num: 'NULL',
                cc_exp_year: 'NULL',
                cc_exp_month: 'NULL',
                cc_cvv: 'NULL',
                cc_zip: 'NULL',
                charge_id: charge_id,
                payment_type: 'STRIPE',
                service_fee: props.paymentSummary.serviceFee,
                delivery_fee: props.paymentSummary.deliveryFee,
                tip: props.paymentSummary.tip,
                tax: props.paymentSummary.taxAmount,
                subtotal: props.paymentSummary.mealSubPrice,
                amb: props.paymentSummary.ambassadorDiscount
              },
              () => {
                history.push("/congrats")
              }
            );
          }
        );

      } else {
        console.log("STRIPE CHECKOUT (3) -- error; wrong data");
      }
    
    } catch (err) {
      setProcessing(false);
      console.log('error happened while posting to Stripe_Intent api', err);
    }
  };

  return (
    <>
      <label className={props.classes.label}>
        Enter Cardholder Name Below:
      </label>
      <Box mt={1}>
        <CssTextField variant="outlined" size="small" fullWidth />
      </Box>
      <Box mt={1}>
        <label className={props.classes.label}>
          Enter Card Details Below:
          <CardElement
            elementRef={(c) => (this._element = c)}
            className={props.classes.element}
            options={options}
          />
        </label>
      </Box>

      <Button
        className={props.classes.button}
        variant="outlined"
        size="small"
        color="paragraphText"
        onClick={onPay}
        disabled={processing}
      >
        Pay With Stripe
      </Button>
    </>
  );
};

StripeCheckout.propTypes = {
  submitPayment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  subscribeInfo: state.subscribe,
  socialMedia: state.subscribe.profile.socialMedia,
  firstName: state.subscribe.addressInfo.firstName,
  lastName: state.subscribe.addressInfo.lastName,
  street: state.subscribe.address.street,
  unit: state.subscribe.address.unit,
  city: state.subscribe.address.city,
  state: state.subscribe.address.state,
  zip: state.subscribe.address.zip,
  phone: state.subscribe.addressInfo.phoneNumber,
  instructions: state.subscribe.deliveryInstructions,
  selectedPlan: state.subscribe.selectedPlan,
  address: state.subscribe.address,
  addressInfo: state.subscribe.addressInfo,
  creditCard: state.subscribe.creditCard
});

const functionList = {
  submitPayment
};

//export default StripeCheckout;
export default connect(
  mapStateToProps,
  functionList
)(StripeCheckout);
