import React, { useMemo, useContext, useState, useEffect } from 'react';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useHistory } from "react-router";

import withStyles from '@material-ui/styles/withStyles';
import TextField from '@material-ui/core/TextField';

import styles from "./paymentDetails.module.css";

import PropTypes from "prop-types";
import {connect} from "react-redux";

import {
  submitPayment
} from "../../reducers/actions/subscriptionActions";

import { API_URL } from '../../reducers/constants';

import checkoutItems from '../../utils/CheckoutItems';

const CHECKOUT_ERROR = 1;

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
  console.log("StripeCheckout props: ", props);

  const elements = useElements();
  const stripe = useStripe();
  const options = useOptions();
  const history = useHistory();

  const [cardholderName, setCardholderName] = useState(null);
  const [loadingState, changeLoadingState] = useState(false);

  const [termsAccepted, checkTerms] = useState(false);

  var orderData = {
    currency: "usd"
  };

  const changeCardholderName = (name) => {
    setCardholderName(name);
  }

  // Change state of new credit card checkbox (not currently used)
  const handleCheck = (cb) => {
    console.log("clicked checkbox: ", cb);
    checkTerms(!termsAccepted);
  }

  var pay = async function() {

    changeLoadingState(true);

    console.log("=== pay()");
    console.log("cardholderName from state: " + cardholderName);
    var data = {
      billing_details: {}
    };
  
    if (cardholderName !== null) {
      data["billing_details"]["name"] = cardholderName;
    }
  
    const cardElement = await elements.getElement(CardElement);
  
    // console.log("stripe: ", stripe);
    // console.log("cardElement: ", cardElement);
    // console.log("data: ", data);

    orderData.customer_uid = props.customerUid;
    orderData.business_code = props.deliveryInstructions;
    orderData.currency = "usd";
    orderData.item_uid = props.selectedPlan.item_uid;
    orderData.num_items = props.selectedPlan.num_items;
    orderData.num_deliveries = props.selectedPlan.num_deliveries;
    orderData.delivery_discount = props.selectedPlan.delivery_discount;
    orderData.payment_summary = props.paymentSummary;

    console.log("==> payment_summary: ", props.paymentSummary);

    // Possibly solve ambassador change/cancel problem?
    orderData.payment_summary.subtotal = props.paymentSummary.mealSubPrice;

    //console.log("orderData before createPaymentIntent: ", orderData);

    var clientSecret;

    console.log("===> orderData: ", JSON.stringify(orderData));

    await axios.post("https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createPaymentIntent", orderData)
    .then(function(result) {
      console.log("createPaymentIntent result: " + JSON.stringify(result));
      console.log("clientSecret from createPaymentIntent: " + result.data);
      clientSecret = result.data;

      console.log("calling createPaymentMethod...");

      const paymentMethod = stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: data.billingDetails
      })
      .then(function(res) {

        console.log("createPaymentMethod res: ", res);

        if(res.hasOwnProperty('error')){
          console.log("createPaymentMethod error: ", res.error);

          props.displayError(
            CHECKOUT_ERROR, ('CHECKOUT ERROR: ' + res.error.message)
          );

          changeLoadingState(false);

        } else {

          console.log("calling confirmedCardPayment...");

          try{
            
            const confirmedCardPayment = stripe.confirmCardPayment(clientSecret, {
              payment_method: res.paymentMethod.id, setup_future_usage: 'off_session'
              // payment_method: 'testid', setup_future_usage: 'off_session'
            })
            .then(function(result) {
              console.log("confirmedCardPayment result: ", result);

              if(res.hasOwnProperty('error')){
                console.log("confirmedCardPayment error: ", res.error);
      
                props.displayError(
                  CHECKOUT_ERROR, ('CHECKOUT ERROR: ' + res.error.message)
                );
      
                changeLoadingState(false);

              } else {

                const items = [{
                  qty: props.selectedPlan.num_deliveries.toString(),
                  name: props.selectedPlan.item_name,
                  price: props.selectedPlan.item_price.toString(),
                  item_uid: props.selectedPlan.item_uid,
                  itm_business_uid: props.selectedPlan.itm_business_uid
                }];

                console.log("customerUid before checkout: ", props.customerUid);

                // if(props.customerUid !== 'GUEST') {
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
                    charge_id: result.paymentIntent.id,
                    payment_type: 'STRIPE',
                    service_fee: props.paymentSummary.serviceFee,
                    delivery_fee: props.paymentSummary.deliveryFee,
                    tip: props.paymentSummary.tip,
                    tax: props.paymentSummary.taxAmount,
                    subtotal: props.paymentSummary.mealSubPrice,
                    amb: props.paymentSummary.ambassadorDiscount
                  },
                  (res, checkout_success) => {

                    console.log("(SC) checkout items response: ", res);

                    if(!checkout_success) {
                      props.displayError(
                        CHECKOUT_ERROR, ('CHECKOUT ERROR: ' + res)
                      );
                      changeLoadingState(false);
                    } else {
                      history.push({
                        pathname: '/congrats',
                        delivery_address: props.address.street,
                        delivery_city: props.city,
                        delivery_state: props.state,
                        delivery_zip: props.zip,
                        delivery_date: res.data['start delievery date']
                      });
                    }

                  }
                );

              }

            })
            .catch(err => {
              console.log("confirmedCardPayment error: ", err);

              props.displayError(
                CHECKOUT_ERROR, ('CHECKOUT ERROR: ' + err)
              );

              if (err.response) {
                console.log("error: " + JSON.stringify(err.response));
              }
              changeLoadingState(false);
            });

          } catch (e) {
            console.log("error trying to pay: ", e);

            props.displayError(
              CHECKOUT_ERROR, ('CHECKOUT ERROR: ' + e)
            );

            changeLoadingState(false);
          }

        }

      })
      .catch(err => {
        console.log("error trying to pay: ", err);

        props.displayError(
          CHECKOUT_ERROR, ('CHECKOUT ERROR: ' + err)
        );

        changeLoadingState(false);
      });

    })
    .catch(err => {
      console.log(err);
      if (err.response) {
        console.log("error: " + JSON.stringify(err.response));

        props.displayError(
          CHECKOUT_ERROR, ('CHECKOUT ERROR: ' + err)
        );

        changeLoadingState(false);
      }
    });

  };

  return (
    <>
      <input
        className={styles.input}
        variant="outlined" 
        size="small" 
        placeholder="Cardholder Name"
        fullWidth 
        onChange={e => {
          changeCardholderName(e.target.value);
        }}
        aria-label="Enter the name of the cardholder"
        title="Enter the name of the cardholder"
      />

      <div className={styles.label}>
        <CardElement
          elementRef={(c) => (this._element = c)}
          className={styles.element}
          options={options}
        />
      </div>

      <div style={{display: 'flex'}}>
      <div className={styles.checkboxContainer}>
        {/* <input
          className={styles.checkbox}
          type="checkbox"
          checked={termsAccepted}
          onChange={handleCheck}
        />
        <label className={styles.checkboxLabel}>
          I've read and accept the terms and conditions
        </label> */}
        <div
          style={{
            // border: 'dashed',
            width: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={termsAccepted}
            onChange={handleCheck}
          />
        </div>
        <span
          style={{
            // border: 'inset',
            // width: 'fit-content'
            // width: '50px'
            // flexGrow: '1'
            display: 'flex',
            whiteSpace: 'nowrap'
          }}
        >
          I've read and accept the&nbsp;<a href='/terms-and-conditions'>Terms and Conditions</a>
        </span>
      </div>
      </div>

      <button 
        className={styles.orangeBtn2}
        disabled={(props.fetchingFees || loadingState || props.recalculatingPrice || !termsAccepted)}
        onClick={() => pay()}
        aria-label={"Click to complete your payment"}
        title={"Click to complete your payment"}
      >
        Complete Payment
      </button>

      <div
        style={{
          // border: 'solid',
          textAlign: 'left',
          marginBottom: '50px'
        }}
      >
        Your plan will automatically renew after 
        you've received your chosen number of deliveries. 
        Your subscription will renew at the price of 
        ${props.paymentSummary.total + " "}
        unless you cancel before <strong>4PM PST </strong>
        the day before your next delivery.
      </div>
    </>
  );
}


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
