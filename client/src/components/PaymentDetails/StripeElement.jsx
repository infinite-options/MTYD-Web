import React, { useContext, useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { Elements, CardElement, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckout from './StripeCheckout';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const appColors = {
  primary: '#e88330',
  secondary: '#397d87',
  paragraphText: '#7d7d7d',
  componentBg: '#f1f4f4',
  checkoutSectionBorder: '#e2e5e5',
  border: '#d1d1d1',
  buttonText: 'white',
};

const useStyles = makeStyles({
  label: {
    color: appColors.paragraphText,
    fontWeight: 300,
    letterSpacing: '0.025em',
  },
  element: {
    display: 'block',
    margin: '10px 0 20px 0',
    padding: '10px 14px',
    fontSize: '1em',
    fontFamily: 'Source Code Pro, monospace',
    boxShadow:
      'rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px',
    border: 0,
    outline: 0,
    borderRadius: '4px',
    background: 'white',
    width: '550px',
  },
  section: {
    textAlign: 'left',
    borderBottom: '1px solid' + appColors.checkoutSectionBorder,
    marginBottom: '10px',
    paddingBottom: '10px',
  },
  info: {
    width: '400px',
  },
  delivInstr: {
    width: '100%',
    minHeight: '40px',
    maxHeight: '150px',
    backgroundColor: 'white',
    color: 'black',
    fontSize: '15px',
    border: '1px solid ' + appColors.paragraphText,
    outline: appColors.secondary + ' !important',
    borderRadius: '10px',
    textAlign: 'left',
    fontFamily: 'Arial',
    resize: 'vertical',
  },
  button: {
    color: appColors.primary,
    width: '300px',
    marginBottom: '20px'
  },
  showButton: {
    color: 'white',
  },
  notify: {
    fontSize: '18px',
    color: '#fc6f03',
    fontWeight: 'bold',
  },
});

export default function StripeElement(props) {

//console.log("Stripe Element setpaymentType: " + props.setPaymentType);

  // Wpn't work because not wrapped in elements provider
  /*const stripeExample = useStripe();
  console.log("stripeExample: ", stripeExample);*/

  // Get stripe-key from env file
  const classes = useStyles();
  const stripePromise = loadStripe(
    process.env.NODE_ENV === 'production' &&
      props.deliveryInstructions !== 'M4METEST'
      ? process.env.REACT_APP_STRIPE_PUBLIC_KEY_LIVE
      : process.env.REACT_APP_STRIPE_PUBLIC_KEY
  );

  // ALTERNATIVE: Get stripe-key from remote server
  /*let stripePromise;
  axios.get("https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/stripe-key")
    .then(function(result) {
      console.log("Stripe-key then result (1): ", result);
      //console.log("Stripe-key then result (json): ", result.json());
      return result.json();
    })
    .then(function(data) {
      console.log("Stripe-key then data (2): ", data);
      stripePromise = loadStripe(data.publicKey);
    })
    .catch(err => {
      console.log(err);
      if (err.response) {
        console.log("error: " + JSON.stringify(err.response));
      }
    });*/

  console.log("stripePromise: " + JSON.stringify(stripePromise));

  return (
    <Elements stripe={stripePromise}>
      <StripeCheckout
        customerPassword={props.customerPassword}
        deliveryInstructions={props.deliveryInstructions}
        setPaymentType={props.setPaymentType}
        paymentSummary={props.paymentSummary}
        loggedInByPassword={props.loggedInByPassword}
        latitude={props.latitude}
        longitude={props.longitude}
        email={props.email}
        customerUid={props.customerUid}
        classes={classes}
        cardInfo={props.cardInfo}
      />
    </Elements>
  );
}
