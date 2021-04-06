import React, { useRef, useState, useContext, useEffect } from 'react';
import axios from 'axios';
//import Cookies from 'universal-cookie';
import { PayPalButton } from 'react-paypal-button-v2';
import { useHistory } from "react-router";

import PropTypes from "prop-types";
import {connect} from "react-redux";

import {
  submitPayment
} from "../../reducers/actions/subscriptionActions";

import hashPassword from '../../utils/HashPassword';
import checkoutItems from '../../utils/CheckoutItems';

const PayPal = (props, { value, deliveryInstructions }) => {

  const history = useHistory();

  console.log("PayPal props: " + JSON.stringify(props.paymentSummary));

  const items = [{
    qty: props.selectedPlan.num_deliveries.toString(),
    name: props.selectedPlan.item_name,
    price: props.selectedPlan.item_price.toString(),
    item_uid: props.selectedPlan.item_uid,
    itm_business_uid: props.selectedPlan.itm_business_uid
  }];
  
  const CLIENT = {
    sandbox: process.env.REACT_APP_PAYPAL_CLIENT_ID_TESTING,
    production: process.env.REACT_APP_PAYPAL_CLIENT_ID_LIVE,
  };

  const [CLIENT_ID, setCLIENT_ID] = useState(
    process.env.NODE_ENV === 'production' ? CLIENT.production : CLIENT.sandbox
  );

  useEffect(() => {
    console.log("CLIENT_ID: " + CLIENT_ID);
    if (props.deliveryInstructions === 'M4METEST') {
      if (CLIENT_ID !== CLIENT.sandbox) {
        setCLIENT_ID(CLIENT.sandbox);
      }
    } else if (
      CLIENT_ID !== CLIENT.production &&
      process.env.NODE_ENV === 'production'
    ) {
      setCLIENT_ID(CLIENT.production);
    }
  }, [deliveryInstructions]);


  //TODO: PayPal cart doesn't clear
  return (
    <div>
      {console.log("PayPalButton rendering...")}
      {console.log("delivery instructions: " + props.deliveryInstructions)}
      <PayPalButton
        amount={props.paymentSummary.total}
        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
        onSuccess={(details, data) => {

          console.log("PayPal details: " + JSON.stringify(details));
          console.log("PayPal data: " + JSON.stringify(data));

          let chargeId = details
            .purchase_units[0]
            .payments
            .captures[0]
            .id;

          hashPassword(
            props.customerPassword, 
            props.email,
            (hashedPassword) => {
              console.log("(PayPal) hashed password: " + hashedPassword);
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
                  charge_id: chargeId,
                  payment_type: 'PAYPAL',
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

            /*console.log("mealsubprice (Paypal): " + props.paymentSummary.mealSubPrice);
            const dataSending = {
              customer_uid: props.customerId,
              business_uid: '200-000001',
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
              charge_id: 'testRun',
              payment_type: 'PAYPAL',
              service_fee: props.paymentSummary.serviceFee,
              delivery_fee: props.paymentSummary.deliveryFee,
              tip: props.paymentSummary.tip,
              tax: props.paymentSummary.taxAmount,
              subtotal: props.paymentSummary.mealSubPrice
            };
            console.log('PayPal data sending: ', JSON.stringify(dataSending));

            axios
              .post(
                process.env.REACT_APP_SERVER_BASE_URI + 'checkout',
                dataSending
              )
              .then(() => {
                console.log("PayPal purchase complete");
              }).catch((err) => {
                console.log(
                  'error happened while posting to checkoutapi',
                  err
                );
                if(err.response){
                  console.log("err.response: " + JSON.stringify(err.response));
                }
              });*/

          //}

          /*axios
            .post(
              process.env.REACT_APP_SERVER_BASE_URI + 'checkout',
              dataSending
            )
            .then(() => {
              onPurchaseComplete({
                store: store,
                checkout: checkout,
                confirm: confirm,
              });
              console.log("PayPal purchase complete");
            }).catch((err) => {
              console.log(
                'error happened while posting to checkoutapi',
                err
              );
              if(err.response){
                console.log("err.response: " + JSON.stringify(err.response));
              }
            });*/
        }}
        options={{
          clientId: CLIENT_ID,
        }}
      />
    </div>
  );
};

//export default PayPal;

PayPal.propTypes = {
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
)(PayPal);
