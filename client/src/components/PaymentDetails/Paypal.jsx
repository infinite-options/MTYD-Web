import React, { useRef, useState, useContext, useEffect } from 'react';
import axios from 'axios';
//import Cookies from 'universal-cookie';
import { PayPalButton } from 'react-paypal-button-v2';

import PropTypes from "prop-types";
import {connect} from "react-redux";

import {
  submitPayment
} from "../../reducers/actions/subscriptionActions";

//import { useConfirmation } from '../../../services/ConfirmationService';
//import { onPurchaseComplete } from './onPurchaseComplete';
/*import checkoutContext from '../CheckoutContext';
import storeContext from '../../storeContext';
import { AuthContext } from 'auth/AuthContext';*/

//const cookies = new Cookies();

const PayPal = (props, { value, deliveryInstructions }) => {

  console.log("value: " + value);
  console.log("typeof(value): " + typeof(value));

  /*const store = useContext(storeContext);
  const checkout = useContext(checkoutContext);
  const auth = useContext(AuthContext);*/
  //const confirm = useConfirmation();

  //const [loaded, setLoaded] = useState(false);
  //const { paymentDetails, chosenCoupon } = useContext(checkoutContext);
  //const { profile, startDeliveryDate, cartItems } = useContext(storeContext);
  //let paypalRef = useRef();
  //[{"qty": "3", "name": "Opo Gourd", "price": "0.5", "item_uid": "310-000087", "itm_business_uid": "200-000005"}]

  // DONE: Add unit (bunch), desc (cOrganic)
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
  const items = [{
    qty: props.selectedPlan.num_deliveries.toString(),
    name: props.selectedPlan.item_name,
    price: props.selectedPlan.item_price.toString(),
    item_uid: props.selectedPlan.item_uid,
    itm_business_uid: props.selectedPlan.itm_business_uid,
  }];

  /*      
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
  */

  //REACT_APP_PAYPAL_CLIENT_ID_TESTING = ATnaX-KW9jaomOfSgQqmVbQNt2s8IsnhikKOIiMw47YzB--uWlLZgWoPuxoRuHPqhgZFXnmrGCu4jmVr
  //REACT_APP_PAYPAL_CLIENT_ID_LIVE = AXhkFKdvsXMoQ5gHgwBM03cKUumitEDI779oyWp5VidFf9jSbW8ls5yZxVxebaA1JVdRhfEzwRYLg3P1

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

  console.log("PayPal customerUid: " + props.customerId);
  const dataSendingCopy = {
    pur_customer_uid: props.customerId,
    pur_business_uid: 'WEB',
    items,
    order_instructions: 'fast',
    delivery_instructions: props.deliveryInstructions,
    order_type: 'produce',
    delivery_first_name: props.firstName,
    delivery_last_name: props.lastName,
    delivery_phone_num: props.phone,
    delivery_email: props.email,
    delivery_address: props.address.street,
    delivery_unit: props.unit,
    delivery_city: props.city,
    delivery_state: props.state,
    delivery_zip: props.zip,
    delivery_latitude: '37.2270928',
    delivery_longitude: '-121.8866517',
    purchase_notes: 'purchase_notes',
    start_delivery_date: '2021-04-03 03:38:39',
    pay_coupon_id: 'test_coupon',
    amount_due: '1000',
    amount_discount: '0',
    amount_paid: '1000',
    info_is_Addon: 'FALSE',
    cc_num: 'NULL',
    cc_exp_date: 'NULL',
    cc_cvv: 'NULL',
    cc_zip: 'NULL',
    charge_id: 'NULL',
    payment_type: 'PAYPAL',
    subtotal: '1',
    service_fee: '2',
    delivery_fee: '3',
    driver_tip: '4',
    taxes: '5',
  };

  console.log("dataSendingCopy: " + JSON.stringify(dataSendingCopy));
  console.log("phone: " + props.phone);

  //TODO: PayPal cart doesn't clear
  return (
    <div>
      {console.log("PayPalButton rendering...")}
      {console.log("delivery instructions: " + props.deliveryInstructions)}
      <PayPalButton
        amount={"0.01"}
        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
        onSuccess={(details, data) => {
          console.log("onSuccess executing...");
          /*const dataSending = {
            pur_customer_uid: props.customerId,
            pur_business_uid: 'WEB',
            items,
            order_instructions: 'fast',
            delivery_instructions: props.deliveryInstructions,
            order_type: 'produce',
            delivery_first_name: props.firstName,
            delivery_last_name: props.lastName,
            delivery_phone_num: props.phone,
            delivery_email: props.email,
            delivery_address: props.address.street,
            delivery_unit: props.unit,
            delivery_city: props.city,
            delivery_state: props.state,
            delivery_zip: props.zip,
            delivery_latitude: '37.2270928',
            delivery_longitude: '-121.8866517',
            purchase_notes: 'purchase_notes',
            start_delivery_date: '2021-04-03 03:38:39',
            pay_coupon_id: 'test_coupon',
            amount_due: '1000',
            amount_discount: '0',
            amount_paid: '1000',
            info_is_Addon: 'FALSE',
            cc_num: 'NULL',
            cc_exp_date: 'NULL',
            cc_cvv: 'NULL',
            cc_zip: 'NULL',
            charge_id: 'NULL',
            payment_type: 'PAYPAL',
            subtotal: '1',
            service_fee: '2',
            delivery_fee: '3',
            driver_tip: '4',
            taxes: '5',
          };*/

          /*if (loginMethod === 'NULL') {
            axios
            .post(process.env.REACT_APP_SERVER_BASE_URI + 'accountsalt', {
              email: props.email,
            })
            .then(res => {
              let saltObject = res;
              if (saltObject.status === 200) {
                let hashAlg = saltObject.data.result[0].password_algorithm;
                let salt = saltObject.data.result[0].password_salt;
                //Get hash algorithm
                switch (hashAlg) {
                  case 'SHA512':
                    hashAlg = 'SHA-512';
                    break;
      
                  default:
                    break;
                }
                let saltedPassword = props.password + salt;
                console.log("email: " + props.email);
                console.log("customerUid: " + props.customerId);
                console.log("saltedPW: " + saltedPassword);
                console.log("customerPW: " + props.password);
                console.log("salt: " + salt);
                // Encode salted password to prepare for hashing
                const encoder = new TextEncoder();
                const data = encoder.encode(saltedPassword);
                // Hash salted password
                crypto.subtle.digest(hashAlg, data).then(res => {
                  // Decode hash with hex digest
                  let hash = res;
                  let hashArray = Array.from(new Uint8Array(hash));
                  let hashedPassword = hashArray
                    .map(byte => byte.toString(16).padStart(2, '0'))
                    .join('');
                  console.log("hashed password: " + hashedPassword);

                  const dataSending = {
                    customer_uid: props.customerId,
                    business_uid: '200-000001',
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
                    amount_due: '1',
                    amount_discount: '0',
                    amount_paid: '1',
                    cc_num: 'NULL',
                    cc_exp_year: 'NULL',
                    cc_exp_month: 'NULL',
                    cc_cvv: 'NULL',
                    cc_zip: 'NULL',
                    charge_id: 'testRun',
                    payment_type: 'PAYPAL',
                    service_fee: '2',
                    delivery_fee: '3',
                    tip: '4',
                    tax: '5',
                    subtotal: '2'
                  };
                  console.log('data sending: ', dataSending);

                  axios
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
                    });

                      });
                    }
                  });

          } else {*/

            console.log("not signed in");

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
              amount_due: '1',
              amount_discount: '0',
              amount_paid: '1',
              cc_num: 'NULL',
              cc_exp_year: 'NULL',
              cc_exp_month: 'NULL',
              cc_cvv: 'NULL',
              cc_zip: 'NULL',
              charge_id: 'testRun',
              payment_type: 'PAYPAL',
              service_fee: '2',
              delivery_fee: '3',
              tip: '4',
              tax: '5',
              subtotal: '2'
            };
            console.log('data sending: ', dataSending);

            axios
              .post(
                process.env.REACT_APP_SERVER_BASE_URI + 'checkout',
                dataSending
              )
              .then(() => {
                /*onPurchaseComplete({
                  store: store,
                  checkout: checkout,
                  confirm: confirm,
                });*/
                console.log("PayPal purchase complete");
              }).catch((err) => {
                console.log(
                  'error happened while posting to checkoutapi',
                  err
                );
                if(err.response){
                  console.log("err.response: " + JSON.stringify(err.response));
                }
              });

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
