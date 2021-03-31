import React, { useMemo, useContext, useState, useEffect, createContext } from 'react';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
//import Cookies from 'universal-cookie';
import Stripe from 'stripe';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/styles/withStyles';
import TextField from '@material-ui/core/TextField';


// Address info
/*const billingDetails = {
  name: profile.firstName + ' ' + profile.lastName,
  email: profile.email,
  address: {
    line1: profile.address,
    city: profile.city,
    state: profile.state,
    postal_code: profile.zip,
  },
};*/

//import { useConfirmation } from '../../../services/ConfirmationService';
//import { AuthContext } from '../../../auth/AuthContext';
//import storeContext from '../../storeContext';
//import checkoutContext from '../CheckoutContext';

import PropTypes from "prop-types";
import {connect} from "react-redux";

const storeContext = createContext();
const AuthContext = createContext();
const checkoutContext = createContext();

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

function onPurchaseComplete(props) {
  props.store.setCartItems({});
  props.store.setCartTotal(0);
  props.store.setDayClicked('');
  props.store.setStartDeliveryDate('');
  props.store.setFarmsClicked(new Set());
  props.checkout.setPurchaseMade(props.checkout.purchaseMade + 1);
  localStorage.removeItem('selectedDay');
  localStorage.removeItem('cartTotal');
  localStorage.removeItem('cartItems');
  localStorage.removeItem('startDeliveryDate');

  props
    .confirm({
      variant: 'info',
      title: 'Purchase Completed',
      description:
        'Thank you! Your order should arrive by ' +
        props.store.expectedDelivery +
        '.',
    })
    .then(() => {
      props.store.setExpectedDelivery('');
    })
    .catch(() => {});
}

const ConfirmationServiceContext = React.createContext(Promise.reject);

export const useConfirmation = () => useContext(ConfirmationServiceContext);

//const cookies = new Cookies();
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

/*const billingDetails = {
  name: profile.firstName + ' ' + profile.lastName,
  email: profile.email,
  address: {
    line1: profile.address,
    city: profile.city,
    state: profile.state,
    postal_code: profile.zip,
  },
};*/

const StripeCheckout = (props) => {
  //console.log("StripeCheckout.jsx selectedPlan: " + JSON.stringify(props.selectedPlan));
  //console.log("StripeCheckout.jsx subscribe info: " + JSON.stringify(props.subscribeInfo));

  const auth = useContext(AuthContext);

  const store = useContext(storeContext);
  const checkout = useContext(checkoutContext);
  const confirm = useConfirmation();

  const elements = useElements();
  const stripe = useStripe();
  const options = useOptions();

  const [processing, setProcessing] = useState(false);

  /*const {
    profile,
    setProfile,
    cartItems,
    setCartItems,
    startDeliveryDate,
    setCartTotal,
  } = useContext(storeContext);*/

  /*const { paymentDetails, setPaymentProcessing, chosenCoupon } = useContext(
    checkoutContext
  );*/
  console.log("just above on pay");

  /*const billingDetails = {
    name: props.firstName + ' ' + props.lastName,
    email: props.email,
    address: {
      line1: props.address,
      city: props.city,
      state: props.state,
      postal_code: props.zip,
    },
  };
  console.log("**********************************");
  console.log("billing details: " + JSON.stringify(billingDetails));*/

  const onPay = async (event) => {
    console.log("1.8");
    event.preventDefault();
    console.log("1.9");

    setProcessing(true);
    console.log("2.0");

    /*const billingDetails = {
      name: profile.firstName + ' ' + profile.lastName,
      email: profile.email,
      address: {
        line1: profile.address,
        city: profile.city,
        state: profile.state,
        postal_code: profile.zip,
      },
    };*/
    const billingDetails = {
      name: props.firstName + ' ' + props.lastName,
      email: props.email,
      address: {
        line1: props.address,
        city: props.city,
        state: props.state,
        postal_code: props.zip,
      },
    };

    console.log("**********************************");
    console.log("billing details: " + JSON.stringify(billingDetails));

    
    let formSending = new FormData();
    formSending.append('amount', 1000);
    formSending.append('note', props.instructions);

    console.log("form sending: " + JSON.stringify(formSending));

    /*const items = {
      qty: props.selectedPlan.num_deliveries,
      name: props.selectedPlan.item_name,
      unit: "delivery",
      price: props.selectedPlan.item_price,
      business_price: "business_price",
      item_uid: props.selectedPlan.item_uid,
      itm_business_uid: props.selectedPlan.itm_business_uid,
      description: props.selectedPlan.item_desc,
      img: props.selectedPlan.item_photo,
    };
    console.log("items: " + JSON.stringify(items));*/


    try {
      /*const {
        data: { client_secret },
      } = await axios.post(
        'https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/Stripe_Intent',
       // process.env.REACT_APP_SERVER_BASE_URI + 'Stripe_Intent',
        formSending,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      ).then(res => {
        console.log("Stripe_Intent response: " + JSON.stringify(res));
      })
      .catch(err => {
        console.log(err);
        if (err.response) {
          console.log("error: " + JSON.stringify(err.response));
        }
      });*/

      let stripeIntentResponse;
      await axios.post(
        'https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/Stripe_Intent',
       // process.env.REACT_APP_SERVER_BASE_URI + 'Stripe_Intent',
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

      /*const items = Object.values(cartItems).map((item) => {
        return {
          qty: item.count,
          name: item.name,
          unit: item.unit,
          price: item.price,
          business_price: item.businessPrice,
          item_uid: item.id,
          itm_business_uid: item.business_uid,
          description: item.desc,
          img: item.img,
        };
      });*/
      const items = {
        qty: props.selectedPlan.num_deliveries,
        name: props.selectedPlan.item_name,
        unit: "delivery",
        price: props.selectedPlan.item_price,
        business_price: "business_price",
        item_uid: props.selectedPlan.item_uid,
        itm_business_uid: props.selectedPlan.itm_business_uid,
        description: props.selectedPlan.item_desc,
        img: props.selectedPlan.item_photo,
      };
      console.log("items: " + JSON.stringify(items));

      console.log("CardElement: " + CardElement);
      const cardElement = await elements.getElement(CardElement);

      // const IntentStripe = Stripe(
      //   process.env.NODE_ENV === 'production' &&
      //     props.deliveryInstructions !== 'SFTEST'
      //     ? process.env.REACT_APP_STRIPE_PRIVATE_KEY_LIVE
      //     : process.env.REACT_APP_STRIPE_PRIVATE_KEY
      // );

      // const centsAmount = parseInt(parseFloat(paymentDetails.amountDue) * 100);
      // const centsType = typeof centsAmount;
      // const paymentIntent = await IntentStripe.paymentIntents.create({
      //   amount: centsAmount,
      //   currency: 'usd',
      // });

      // const IntentStripe = Stripe('sk_test_fe99fW2owhFEGTACgW3qaykd006gHUwj1j');

      // const paymentIntent = await IntentStripe.paymentIntents.create({
      //   amount: 1099,
      //   currency: 'usd',
      //   payment_method_types: ['card'],
      // });


      //console.log("cardElement: " + cardElement);
      console.log("billingDetails: " + JSON.stringify(billingDetails));
      console.log("just before payment method");
      console.log("1 client_secret: " + client_secret);
      //console.log("id: " + paymentMethod.paymentMethod.id);
      const paymentMethod = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });
      console.log("whole paymentMethod: " + JSON.stringify(paymentMethod));

      console.log("just before confirmed");
      console.log("2 client_secret: " + client_secret);
      console.log("id: " + paymentMethod.paymentMethod.id);
      const confirmed = await stripe.confirmCardPayment(client_secret, {
        payment_method: paymentMethod.paymentMethod.id,
      });
      //gathering data to send back our server
      //set start_delivery_date

      // DONE: for Guest, put 'guest' in uid
      // TODO: Add Pay coupon ID
      const data = {
        // pur_customer_uid: profile.customer_uid,
        //pur_customer_uid: auth.isAuth ? customerUid : 'GUEST',
        pur_customer_uid: auth.isAuth ? props.customerId : 'GUEST',
        pur_business_uid: 'WEB',
        items,
        order_instructions: '',
        delivery_instructions: props.instructions,
        order_type: 'produce',
        delivery_first_name: props.firstName,
        delivery_last_name: props.lastName,
        delivery_phone_num: props.phoneNum,
        delivery_email: props.email,
        delivery_address: props.address,
        delivery_unit: props.unit,
        delivery_city: props.city,
        delivery_state: props.state,
        delivery_zip: props.zip,
        //delivery_latitude: props.latitude,
        //delivery_longitude: props.longitude,
        delivery_latitude: 37.2270928,
        delivery_longitude: -121.8866517,
        purchase_notes: 'purchase_notes',
        //start_delivery_date: startDeliveryDate,
        start_delivery_date: '2021-04-03 03:38:39',
        //pay_coupon_id: chosenCoupon,
        pay_coupon_id: 'test_coupon',
        //amount_due: paymentDetails.amountDue.toString(),
        //amount_discount: paymentDetails.discount.toString(),
        //amount_paid: paymentDetails.amountDue.toString(),
        amount_due: '1000',
        amount_discount: '0',
        amount_paid: '1000',
        info_is_Addon: 'FALSE',
        cc_num: paymentMethod.paymentMethod.card.last4,
        cc_exp_date:
          paymentMethod.paymentMethod.card.exp_year +
          '-' +
          paymentMethod.paymentMethod.card.exp_month +
          '-01 00:00:00',
        cc_cvv: 'NULL',
        cc_zip: 'NULL',
        charge_id: confirmed.paymentIntent.id,
        payment_type: 'STRIPE',
        delivery_status: 'FALSE',
        //subtotal: paymentDetails.subtotal.toString(),
        //service_fee: paymentDetails.serviceFee.toString(),
        //delivery_fee: paymentDetails.deliveryFee.toString(),
        //driver_tip: paymentDetails.driverTip.toString(),
        //taxes: paymentDetails.taxes.toString(),
        subtotal: '1',
        service_fee: '2',
        delivery_fee: '3',
        driver_tip: '4',
        taxes: '5',
      };

      let res = axios
        .post(
         // process.env.REACT_APP_SERVER_BASE_URI + 'purchase_Data_SF',
         'https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkout',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          cardElement.clear();
          setProcessing(false);
          //setPaymentProcessing(false);
          onPurchaseComplete({
            store: store,
            checkout: checkout,
            confirm: confirm,
          });
        })
        .catch((err) => {
          setProcessing(false);
          //setPaymentProcessing(false);
          console.log(
            'error happened while posting to purchase_Data_SF api',
            err
          );
        });
    
    } catch (err) {
      setProcessing(false);
      //setPaymentProcessing(false);
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
          Enter Card details Below:
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

/*const billingDetails = {
  name: props.firstName + ' ' + props.lastName,
  email: props.email,
  address: {
    line1: props.address,
    city: props.city,
    state: props.state,
    postal_code: props.zip,
  },
};*/

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

//export default StripeCheckout;
export default connect(mapStateToProps)(StripeCheckout);
