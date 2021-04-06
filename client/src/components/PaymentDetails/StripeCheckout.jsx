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

//import checkoutItems from '../../utils/CheckoutItems';
import hashPassword from '../../utils/HashPassword';
import checkoutItems from '../../utils/CheckoutItems';

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

  const onPay = async (event) => {

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
    
    setProcessing(true);

    let formSending = new FormData();
    formSending.append('amount', props.paymentSummary.total);
    formSending.append('note', props.instructions);

    try {
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

      const cardElement = await elements.getElement(CardElement);

      const paymentMethod = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      const confirmed = await stripe.confirmCardPayment(client_secret, {
        payment_method: paymentMethod.paymentMethod.id,
      });

      console.log("payment_method: " + JSON.stringify(confirmed));
      console.log("confirmed: " + JSON.stringify(paymentMethod));
      console.log("id from intent: " + charge_id);

      hashPassword(
        props.customerPassword, 
        props.email,
        (hashedPassword) => {
          console.log("(StripeCheckout) hashed password: " + hashedPassword);
          checkoutItems(
            {
              customer_uid: props.customerId,
              business_uid: 'WEB',
              items,
              salt: hashedPassword,
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
              delivery_latitude: '37.2270928',
              delivery_longitude: '-121.8866517',
              purchase_notes: 'purchase_notes',
              amount_due: props.paymentSummary.total,
              amount_discount: props.paymentSummary.discountAmount,
              amount_paid: props.paymentSummary.total,
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
              subtotal: props.paymentSummary.mealSubPrice
            },
            () => {
              history.push("/congrats")
            }
          );
        }
      );

      /*const dataSending = {
        customer_uid: props.customerId,
        business_uid: '200-000001',
        items,
        salt: saltedPassword,
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
        delivery_latitude: '37.2270928',
        delivery_longitude: '-121.8866517',
        purchase_notes: 'purchase_notes',
        amount_due: props.paymentSummary.total,
        amount_discount: props.paymentSummary.discountAmount,
        amount_paid: props.paymentSummary.total,
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
        subtotal: props.paymentSummary.mealSubPrice
      };
      console.log('data sending: ', JSON.stringify(dataSending));

      axios
        .post(
          process.env.REACT_APP_SERVER_BASE_URI + 'checkout',
          dataSending
        )
        .then((res) => {
          console.log("Response: " + JSON.stringify(res));
          console.log("Stripe purchase complete");
        }).catch((err) => {
          console.log(
            'error happened while posting to checkoutapi',
            err
          );
          if(err.response){
            console.log("err.response: " + JSON.stringify(err.response));
          }
        });*/

      /*props.submitPayment(
        props.email,
        props.customerId,
        props.socialMedia,
        props.customerPassword,
        props.firstName,
        props.lastName,
        props.phone,
        props.street,
        props.unit,
        props.city,
        props.state,
        props.addressZip,
        props.instructions,
        props.selectedPlan,
        props.creditCard.number,
        props.creditCard.month,
        props.creditCard.year,
        props.creditCard.cvv,
        props.creditCard.zip,
        (response) => {
          console.log("RESPONSE FROM CHECKOUT: " + JSON.stringify(response));
          if (response.status >= 200 && response.status <= 299) {
            console.log("Payment submission success!");
            props.history.push("/congrats");
          } else {
            console.log("Payment submission failure! Error code: " + response.status);
          }
        });*/

    
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
  customerId: state.subscribe.profile.customerId,
  socialMedia: state.subscribe.profile.socialMedia,
  email: state.subscribe.profile.email,
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
  loginPassword: state.login.password,
  userInfo: state.login.newUserInfo,
  password: state.subscribe.paymentPassword,
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
