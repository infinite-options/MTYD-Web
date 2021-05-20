import axios from 'axios';
import {history} from '../../App';
import {
  LOGOUT_SUBSCRIPTION,
  FETCH_PLAN_INFO,
  CHOOSE_MEALS_EACH_DELIVERY,
  CHOOSE_PAYMENT_OPTION,
  GET_TOTAL_PAYMENT,
  CHANGE_DELIVERY_DETAILS,
  CHANGE_PAYMENT_DETAILS,
  CHANGE_CONTACT_DETAILS,
  CHANGE_ADDRESS_FIRST_NAME,
  CHANGE_ADDRESS_LAST_NAME,
  CHANGE_ADDRESS_EMAIL,
  CHANGE_ADDRESS_STREET,
  FETCH_PROFILE_INFO,
  CHANGE_ADDRESS_UNIT,
  CHANGE_ADDRESS_CITY,
  CHANGE_ADDRESS_STATE,
  CHANGE_ADDRESS_ZIP,
  CHANGE_ADDRESS_PHONE,
  CHANGE_DELIVERY_INSTRUCTIONS,
  CHANGE_PAYMENT_PASSWORD,
  SUBMIT_PAYMENT,
  CHANGE_CARD_NUMBER,
  CHANGE_CARD_CVV,
  CHANGE_CARD_MONTH,
  CHANGE_CARD_YEAR,
  CHANGE_CARD_ZIP,
  FETCH_SUBSCRIBED_INFO,
  ADD_ERROR,
  SET_CURRENT_MEAL,
  SET_MEALS,
  SET_PAYMENT_OPTIONS,
  SET_SELECTED_PLAN,
  RESET_USER_INFO,
  SET_CURRENT_PURCHASE,
} from '../actions/subscriptionTypes';
import {LOAD_USER_INFO} from '../actions/loginTypes';

import {API_URL, BING_LOCATION_API_URL} from '../constants';

export const resetSubscription = () => dispatch => {
  dispatch({
    type: LOGOUT_SUBSCRIPTION,
  });
};

export const fetchPlans = () => dispatch => {
  let plans = null;
  axios
    .get(API_URL + 'plans', {
      params: {
        business_uid: '200-000002',
      },
    })
    .then(res => {
      let items = res.data.result;
      let itemsReturn = {};
      for (let item of items) {
        if (item.num_items in itemsReturn) {
          itemsReturn[item.num_items][item.num_deliveries] = item;
        } else {
          itemsReturn[item.num_items] = {[item.num_deliveries]: item};
        }
      }

      let numItems = items.map(curValue => curValue.num_items);
      let distinctNumItems = numItems.filter(
        (elt, index) => numItems.indexOf(elt) === index
      );
      distinctNumItems.sort((a, b) => a - b);
      let paymentFrequency = items.map(curValue => curValue.num_deliveries);
      let distinctPaymentFrequency = paymentFrequency.filter(
        (elt, index) => paymentFrequency.indexOf(elt) === index
      );
      distinctPaymentFrequency.sort((a, b) => a - b);
      plans = itemsReturn;
      dispatch({
        type: FETCH_PLAN_INFO,
        payload: {
          items: itemsReturn,
          numItems: distinctNumItems,
          paymentFrequency: distinctPaymentFrequency,
        },
      });
    })
    .catch(err => {
      console.log(err);
    });
    
  return plans;
};

export const chooseMealsDelivery = (
  newMeal,
  paymentOption,
  plans
) => dispatch => {
  calculateTotalPayment(dispatch, plans, newMeal, paymentOption);
  dispatch({
    type: CHOOSE_MEALS_EACH_DELIVERY,
    payload: newMeal,
  });
};

export const choosePaymentOption = (
  newPaymentOption,
  meal,
  plans
) => dispatch => {
  calculateTotalPayment(dispatch, plans, meal, newPaymentOption);
  dispatch({
    type: CHOOSE_PAYMENT_OPTION,
    payload: newPaymentOption,
  });
};

const calculateTotalPayment = (dispatch, plans, meal, options) => {
  if (meal !== '' && options !== '') {
    let mealNum = Number(meal);
    let optionsNum = Number(options);
    let selectedPlan = Object.values(plans[meal]).filter(
      elt => elt.num_items === mealNum && elt.num_deliveries === optionsNum
    );
    if (selectedPlan.length !== 0) {
      let selectedItem = selectedPlan[0];
      dispatch({
        type: GET_TOTAL_PAYMENT,
        payload: selectedItem,
      });
    } else {
      dispatch({
        type: GET_TOTAL_PAYMENT,
        payload: {},
      });
    }
  }
};

export const fetchProfileInformation = customerId => dispatch => {
  console.log("fetching profile information...");
  axios
    .get(API_URL + 'Profile/' + customerId)
    .then(res => {
      if (
        !res.data.result ||
        !res.data.result.length ||
        res.data.code !== 200
      ) {
        history.push('/select-meal');
        dispatch({
          type: ADD_ERROR,
          payload: 'Cannot get Profile Info.',
        });
      } else {
        let customerInfo = res.data.result[0];
        let email = customerInfo.customer_email;
        let socialMedia =
          customerInfo.user_social_media !== null
            ? customerInfo.user_social_media
            : 'NULL';
        console.log("dispatching: ", {
          customerId: customerId,
          email: email,
          socialMedia: socialMedia,
        });
        dispatch({
          type: FETCH_PROFILE_INFO,
          payload: {
            customerId: customerId,
            email: email,
            socialMedia: socialMedia,
          },
        });
      }
    })
    .catch(err => {
      if (err.response) {
        console.log(err.response);
      } else {
        console.log(err.toString());
      }
    });
};

export const changeAddressEmail = newEmail => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_EMAIL,
    payload: newEmail,
  });
};

export const changeDeliveryDetails = newDeliveryDetails => dispatch => {
  dispatch({
    type: CHANGE_DELIVERY_DETAILS,
    payload: newDeliveryDetails,
  });
};

export const changePaymentDetails = newPaymentDetails => dispatch => {
  dispatch({
    type: CHANGE_PAYMENT_DETAILS,
    payload: newPaymentDetails,
  });
};

export const changeContactDetails = newContactDetails => dispatch => {
  dispatch({
    type: CHANGE_CONTACT_DETAILS,
    payload: newContactDetails,
  });
};

export const changeAddressFirstName = newFirstName => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_FIRST_NAME,
    payload: newFirstName,
  });
};

export const changeAddressLastName = newLastName => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_LAST_NAME,
    payload: newLastName,
  });
};

export const changeAddressStreet = newStreet => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_STREET,
    payload: newStreet,
  });
};

export const changeAddressUnit = newUnit => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_UNIT,
    payload: newUnit,
  });
};

export const changeAddressCity = newCity => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_CITY,
    payload: newCity,
  });
};

export const changeAddressState = newState => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_STATE,
    payload: newState,
  });
};

export const changeAddressZip = newZip => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_ZIP,
    payload: newZip,
  });
};

export const changeAddressPhone = newPhoneNum => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_PHONE,
    payload: newPhoneNum,
  });
};

export const changeDeliveryInstructions = newInstructions => dispatch => {
  dispatch({
    type: CHANGE_DELIVERY_INSTRUCTIONS,
    payload: newInstructions,
  });
};

export const changePaymentPassword = (newPassword, callback) => dispatch => {
  dispatch({
    type: CHANGE_PAYMENT_PASSWORD,
    payload: newPassword,
  });
  if (typeof callback !== 'undefined') {
    callback();
  }
};

export const changeCardNumber = number => dispatch => {
  dispatch({
    type: CHANGE_CARD_NUMBER,
    payload: number,
  });
};

export const changeCardZip = zip => dispatch => {
  dispatch({
    type: CHANGE_CARD_ZIP,
    payload: zip,
  });
};

export const changeCardCvv = cvv => dispatch => {
  dispatch({
    type: CHANGE_CARD_CVV,
    payload: cvv,
  });
};

export const changeCardMonth = month => dispatch => {
  dispatch({
    type: CHANGE_CARD_MONTH,
    payload: month,
  });
};

export const changeCardYear = year => dispatch => {
  dispatch({
    type: CHANGE_CARD_YEAR,
    payload: year,
  });
};

export const submitPayment = (
  customerEmail,
  customerUid,
  loginMethod,
  customerPassword,
  deliveryFirstName,
  deliveryLastName,
  deliveryPhone,
  deliveryAddress,
  deliveryUnit,
  deliveryCity,
  deliveryState,
  deliveryZip,
  deliveryInstructions,
  selectedPlan,
  cardNumber,
  cardMonth,
  cardYear,
  cardCvv,
  cardZip,
  callback
) => dispatch => {
  console.log(customerEmail, customerUid, loginMethod);
  if (loginMethod === 'NULL') {
    // Prepare to login
    axios
      .post(API_URL + 'accountsalt', {
        email: customerEmail,
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
          let saltedPassword = customerPassword + salt;
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
            axios
              .get(BING_LOCATION_API_URL, {
                params: {
                  CountryRegion: 'US',
                  adminDistrict: deliveryState,
                  locality: deliveryCity,
                  postalCode: deliveryZip,
                  addressLine: deliveryAddress,
                  key: process.env.REACT_APP_BING_LOCATION_KEY,
                },
              })
              .then(res => {
                let locationApiResult = res.data;
                if (locationApiResult.statusCode === 200) {
                  let locations = locationApiResult.resourceSets[0].resources;
                  /* Possible improvement: choose better location in case first one not desired
                   */
                  let location = locations[0];
                  let lat = location.geocodePoints[0].coordinates[0];
                  let long = location.geocodePoints[0].coordinates[1];
                  if (location.geocodePoints.length === 2) {
                    lat = location.geocodePoints[1].coordinates[0];
                    long = location.geocodePoints[1].coordinates[1];
                  }
                  console.log(selectedPlan);
                  let purchasedItem = [
                    {
                      qty: (selectedPlan.num_deliveries).toString(),
                      name: selectedPlan.item_name,
                      price: (selectedPlan.item_price*selectedPlan.num_deliveries*(1-(selectedPlan.delivery_discount*0.01))).toFixed(2),
                      item_uid: selectedPlan.item_uid,
                      itm_business_uid: '200-000002',
                    },
                  ];
                  console.log("purchased item: " + JSON.stringify(purchasedItem));
                  let object = {
                    customer_uid: customerUid,
                    salt: hashedPassword,
                    business_uid: '200-000002',
                    delivery_first_name: deliveryFirstName,
                    delivery_last_name: deliveryLastName,
                    delivery_email: customerEmail,
                    delivery_phone: deliveryPhone,
                    delivery_address: deliveryAddress,
                    delivery_unit: deliveryUnit,
                    delivery_city: deliveryCity,
                    delivery_state: deliveryState,
                    delivery_zip: deliveryZip,
                    delivery_instructions: deliveryInstructions,
                    delivery_longitude: long.toString(),
                    delivery_latitude: lat.toString(),
                    items: purchasedItem,
                    amount_due: (selectedPlan.item_price*selectedPlan.num_deliveries*(1-(selectedPlan.delivery_discount*0.01))).toFixed(2),
                    amount_discount: '0',
                    amount_paid: '0',
                    cc_num: cardNumber,
                    cc_exp_month: cardMonth,
                    cc_exp_year: cardYear,
                    cc_cvv: cardCvv,
                    cc_zip: cardZip
                  };
                  console.log("password checkoutInfo: " + JSON.stringify(object));
                  axios
                    .post(API_URL + 'checkout', object)
                    .then(res => {
                      console.log("checkout successful!");
                      //console.log("checkout response: " + JSON.stringify(res));
                      dispatch({
                        type: SUBMIT_PAYMENT,
                      });
                      callback(res);
                    })
                    .catch(err => {
                      //console.log("Error attempting to complete purchase");
                      console.log("Error: " + err);
                      if (err.response) {
                        console.log("error.response: " + JSON.stringify(err.response));
                        callback(err.response);
                      }
                    });
                }
              })
              .catch(err => {
                console.log(err);
                if (err.response) {
                  console.log(err.response);
                  callback(err.response);
                }
              });
          });
        }
      });
  } else {
    // Skip sign in part
    axios
      .get(BING_LOCATION_API_URL, {
        params: {
          CountryRegion: 'US',
          adminDistrict: deliveryState,
          locality: deliveryCity,
          postalCode: deliveryZip,
          addressLine: deliveryAddress,
          key: process.env.REACT_APP_BING_LOCATION_KEY,
        },
      })
      .then(res => {
        let locationApiResult = res.data;
        if (locationApiResult.statusCode === 200) {
          let locations = locationApiResult.resourceSets[0].resources;
          /* Possible improvement: choose better location in case first one not desired
           */
          let location = locations[0];
          let lat = location.geocodePoints[0].coordinates[0];
          let long = location.geocodePoints[0].coordinates[1];
          if (location.geocodePoints.length === 2) {
            lat = location.geocodePoints[1].coordinates[0];
            long = location.geocodePoints[1].coordinates[1];
          }
          console.log(selectedPlan);
          let purchasedItem = [
            {
              qty: (selectedPlan.num_deliveries).toString(),
              name: selectedPlan.item_name,
              price: (selectedPlan.item_price*selectedPlan.num_deliveries*(1-(selectedPlan.delivery_discount*0.01))).toFixed(2),
              item_uid: selectedPlan.item_uid,
              itm_business_uid: '200-000002',
            },
          ];
          console.log("purchased item: " + JSON.stringify(purchasedItem));
          let object = {
            customer_uid: customerUid,
            business_uid: '200-000002',
            delivery_first_name: deliveryFirstName,
            delivery_last_name: deliveryLastName,
            delivery_email: customerEmail,
            delivery_phone: deliveryPhone,
            delivery_address: deliveryAddress,
            delivery_unit: deliveryUnit,
            delivery_city: deliveryCity,
            delivery_state: deliveryState,
            delivery_zip: deliveryZip,
            delivery_instructions: deliveryInstructions,
            delivery_longitude: long.toString(),
            delivery_latitude: lat.toString(),
            items: purchasedItem,
            amount_due: (selectedPlan.item_price*selectedPlan.num_deliveries*(1-(selectedPlan.delivery_discount*0.01))).toFixed(2),
            amount_discount: '0',
            amount_paid: '0',
            cc_num: cardNumber,
            cc_exp_month: cardMonth,
            cc_exp_year: cardYear,
            cc_cvv: cardCvv,
            cc_zip: cardZip
          };
          console.log(JSON.stringify(object));
          axios
            .post(API_URL + 'checkout', object)
            .then(res => {
              console.log(res);
              dispatch({
                type: SUBMIT_PAYMENT,
              });
              callback();
            })
            .catch(err => {
              console.log(err);
              if (err.response) {
                console.log(err.response);
              }
            });
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response) {
          console.log(err.response);
        }
      });
  }
};

export const fetchSubscribed = customerId => async dispatch => {
  //fetch  data from server
  let purchaseIds = [];
  try {
    const res = await axios.get(`${API_URL}customer_lplp`, {
      params: {customer_uid: customerId},
    });
    if (res.status !== 200) {
      dispatch({
        type: ADD_ERROR,
        payload: 'Cannot Get Subscription Info',
      });
    } else {
      let filtered = [];
      try {
        filtered = res.data.result.filter(
          item => JSON.parse(item?.items)[0]?.itm_business_uid === '200-000002'
        );
      } catch(e) {
        let errMessage = '';
        if (e.response) {
          errMessage = e.response;
        } else {
          errMessage = e.toString();
        }
      }
      dispatch({
        type: FETCH_SUBSCRIBED_INFO,
        payload: filtered,
      });
      for (let items of res.data.result) {
        purchaseIds.push(items.purchase_id);
      }
    }
  } catch (err) {
    let message = '';
    if (err.response) {
      message = err.response;
    } else {
      message = err.toString();
    }
    dispatch({
      type: ADD_ERROR,
      payload: message,
    });
  }
  return purchaseIds;
};

export const setCurrentMeal = meal => dispatch =>
  dispatch({
    type: SET_CURRENT_MEAL,
    payload: meal,
  });
export const setSelectedPlan = meal => dispatch =>
  dispatch({type: SET_SELECTED_PLAN, payload: meal});
export const setMeals = meal => dispatch =>
  dispatch({type: SET_MEALS, payload: meal});
export const setPaymentOption = option => dispatch =>
  dispatch({
    type: SET_PAYMENT_OPTIONS,
    payload: option,
  });

export const setUserInfo = info => dispatch => {
  if (Object.keys(info).length === 0) {
    dispatch({type: RESET_USER_INFO});
  } else {
    // set Address => change name and phone number
    if (info?.delivery_first_name && info.delivery_first_name !== 'NULL')
      dispatch({
        type: CHANGE_ADDRESS_FIRST_NAME,
        payload: info.delivery_first_name,
      });
    if (info?.delivery_last_name && info.delivery_last_name !== 'NULL')
      dispatch({
        type: CHANGE_ADDRESS_LAST_NAME,
        payload: info.delivery_last_name,
      });
    if (
      info?.delivery_email &&
      info.delivery_email !== 'NULL' &&
      info.delivery_email !== null
    )
      dispatch({type: CHANGE_ADDRESS_EMAIL, payload: info.delivery_email});
    if (info?.delivery_phone_num && info.delivery_phone_num !== 'NULL')
      dispatch({type: CHANGE_ADDRESS_PHONE, payload: info.delivery_phone_num});
    //set Address Info or delivery info
    if (info?.delivery_address && info.delivery_address !== 'NULL')
      dispatch({type: CHANGE_ADDRESS_STREET, payload: info.delivery_address});
    if (info?.delivery_unit && info.delivery_unit !== 'NULL')
      dispatch({type: CHANGE_ADDRESS_UNIT, payload: info.delivery_unit});
    if (info?.delivery_city && info.delivery_city !== 'NULL')
      dispatch({type: CHANGE_ADDRESS_CITY, payload: info.delivery_city});
    if (info?.delivery_state && info.delivery_state !== 'NULL')
      dispatch({type: CHANGE_ADDRESS_STATE, payload: info.delivery_state});
    if (info?.delivery_zip && info.delivery_zip !== 'NULL')
      dispatch({type: CHANGE_ADDRESS_ZIP, payload: info.delivery_zip});
    //set creditCard
    if (info?.cc_num && info.cc_num !== 'NULL')
      dispatch({type: CHANGE_CARD_NUMBER, payload: info.cc_num});
    if (info?.month && info.month !== 'NULL' && info.month != null)
      dispatch({
        type: CHANGE_CARD_MONTH,
        payload: info.month,
      });
    if (info?.year && info.year !== 'NULL' && info.year !== null)
      dispatch({
        type: CHANGE_CARD_YEAR,
        payload: info.year,
      });
    if (info?.cc_cvv && info.cc_cvv !== 'NULL' && info.cc_cvv !== null)
      dispatch({type: CHANGE_CARD_CVV, payload: info.cc_cvv});
    if (info?.cc_zip && info.cc_zip !== 'NULL' && info.cc_zip !== null)
      dispatch({type: CHANGE_CARD_ZIP, payload: info.cc_zip});
  }
};
export const setCurrentPurchase = id => dispatch =>
  dispatch({type: SET_CURRENT_PURCHASE, payload: id});
