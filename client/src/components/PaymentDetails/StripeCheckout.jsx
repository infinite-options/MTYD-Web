import React, { useMemo, useContext, useState, useEffect, createContext } from 'react';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import Stripe from 'stripe';
//Stripe = require("https://js.stripe.com/v3/");
import { loadStripe } from "@stripe/stripe-js";
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
  //const card = await elements.getElement(CardElement);
  //const cardElement = await elements.getElement(CardElement);

  const [cardholderName, setCardholderName] = useState(null);

  console.log("In StripeCheckout.js");

  console.log("StripeCheckout props: " + JSON.stringify(props));

  var orderData = {
    currency: "usd"
  };

  console.log("orderData: " + JSON.stringify(orderData));

  /*var handleAction = function(clientSecret) {
    console.log("=== handleAction");
    // Show the authentication modal if the PaymentIntent has a status of "requires_action"
    stripe.handleCardAction(clientSecret).then(function(data) {
      if (data.error) {
        //showError("Your card was not authenticated, please try again");
      } else if (data.paymentIntent.status === "requires_confirmation") {
        // Card was properly authenticated, we can attempt to confirm the payment again with the same PaymentIntent
        fetch("/pay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            paymentIntentId: data.paymentIntent.id
          })
        })
          .then(function(result) {
            return result.json();
          })
          .then(function(json) {
            if (json.error) {
              //showError(json.error);
            } else {
              orderComplete(clientSecret);
            }
          });
      }
    });
  };*/

  // var pay = function() {
  //   console.log("=== pay()");
  //   //var cardholderName = document.querySelector("#name").value;
  //   var cardholderName = "Brandon M. Huss";
  //   var data = {
  //     billing_details: {}
  //   };

  const changeCardholderName = (name) => {
    console.log("Name changes: " + name);
    setCardholderName(name);
  }

  var pay = async function(stripe) {
    console.log("=== pay()");
    //var cardholderName = document.querySelector("#name").value;
    console.log("cardholderName from state: " + cardholderName);
    //var cardholderName = "Brandon Huss";
    var data = {
      billing_details: {}
    };
  
    if (cardholderName !== null) {
      console.log("cardholderName is not null");
      data["billing_details"]["name"] = cardholderName;
      /*data["billing_details"]["email"] = props.email;
      data["billing_details"]["address"] = props.email;
      data["billing_details"]["phone"] = props.email;*/
      //data["billing_details"]["creditCard"] = props.cardInfo;
      //data["billing_details"]["selectedPlan"] = props.selectedPlan;
    } else {
      console.log("cardholderName is null");
    }
  
    const cardElement = await elements.getElement(CardElement);
  

    /*const cardElement = await elements.getElement(CardElement);

    const paymentMethod = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
    });*/

    // const cardElement = elements.getElement(CardElement);
    console.log("stripe: ", stripe);
    console.log("cardElement: ", cardElement);
    console.log("data: ", data);
  
    //changeLoadingState(true);

    console.log("calling createPaymentMethod...");
    // Collect card details
    stripe
      .createPaymentMethod("card", cardElement, data)
      .then(function(result) {
        console.log("result: ", result);
        if (result.error) {
          console.log("(1) createPaymentMethod error");
          //showError(result.error.message);
        } else {
          console.log("(2) createPaymentMethod success");
          orderData.paymentMethodId = result.paymentMethod.id;
          //orderData.isSavingCard = document.querySelector("#save-card").checked;
          orderData.isSavingCard = true;
          
          // New stuff added by Brandon
          orderData.customerUid = props.customerUid;
          orderData.email = props.email;
          orderData.paymentSummary = props.paymentSummary;
          orderData.selectedPlan = props.selectedPlan;
  
          console.log("data to be sent to pay: " + JSON.stringify(orderData));
          console.log("calling /pay...");
          //return fetch("http://localhost:4242/pay", {
          /*fetch("/stripe-key")*/
          //fetch("https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2stripe-key")
          let data = {
            body: JSON.stringify(orderData)
          };
          console.log("data before pay: " + JSON.stringify(data));
          console.log("orderData before pay: " + JSON.stringify(orderData));
          return axios.post("https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/pay", orderData)
          .catch(err => {
            console.log(err);
            if (err.response) {
              console.log("error: " + JSON.stringify(err.response));
            }
          });
          //https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/
          // return axios.post("https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/pay", {
          //   mode: "no-cors",
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json"
          //   },
          //   body: JSON.stringify(orderData)
          // });
        }
      })
      .then(function(result) {
        console.log("createPaymentMethod result: ", result);
        return result.json();
      }).catch(err => {
        console.log(err);
        if (err.response) {
          console.log("error: " + JSON.stringify(err.response));
        }
      });
      // .then(function(paymentData) {
      //   console.log("second then of createPaymentMethod");
      //   /*if (paymentData.requiresAction) {
      //     // Request authentication
      //     handleAction(paymentData.clientSecret);
      //   } else if (paymentData.error) {
      //     showError(paymentData.error);
      //   } else {
      //     orderComplete(paymentData.clientSecret);
      //   }*/
      // });
  };

  /* ------- Post-payment helpers ------- */

  /* Shows a success / error message when the payment is complete */
  /*var orderComplete = function(clientSecret) {
    console.log("=== orderComplete()");
    console.log("clientSecret: " + clientSecret);
    stripe.retrievePaymentIntent(clientSecret).then(function(result) {
      var paymentIntent = result.paymentIntent;
      var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);
      document.querySelectorAll(".payment-view").forEach(function(view) {
        view.classList.add("hidden");
      });
      document.querySelectorAll(".completed-view").forEach(function(view) {
        view.classList.remove("hidden");
      });
      document.querySelector(".status").textContent =
        paymentIntent.status === "succeeded" ? "succeeded" : "failed";
      document.querySelector("pre").textContent = paymentIntentJson;
    });
  };*/

  /*var showError = function(errorMsgText) {
    console.log("=== showError()");
    changeLoadingState(false);
    var errorMsg = document.querySelector(".sr-field-error");
    errorMsg.textContent = errorMsgText;
    setTimeout(function() {
      errorMsg.textContent = "";
    }, 4000);
  };*/

  // Show a spinner on payment submission
  /*var changeLoadingState = function(isLoading) {
    console.log("=== changeLoadingState()");
    if (isLoading) {
      document.querySelector("button").disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("button").disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
  };*/

  return (
    <>
      <label className={props.classes.label}>
        Enter Cardholder Name Below:
      </label>
      <Box mt={1}>
        <CssTextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          onChange={e => {
            changeCardholderName(e.target.value);
          }}
        />
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
        //onClick={() => pay(stripe, card, clientSecret)}
        onClick={() => {
          console.log("PAY BUTTON CLICKED");
          pay(stripe);
        }}
        // onClick={pay(stripe, card, clientSecret)}
        /*onClick={() => this.saveDeliveryDetails()}*/
        /*disabled={processing}*/
      >
        Pay With Stripe
      </Button>
    </>
  );
}

/*const StripeCheckout = (props) => {

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
};*/

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
