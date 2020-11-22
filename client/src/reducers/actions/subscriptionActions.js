import axios from "axios";
import {history} from "../../App";
import {
  LOGOUT_SUBSCRIPTION,
  FETCH_PLAN_INFO,
  CHOOSE_MEALS_EACH_DELIVERY,
  CHOOSE_PAYMENT_OPTION,
  GET_TOTAL_PAYMENT,
  CHANGE_ADDRESS_FIRST_NAME,
  CHANGE_ADDRESS_LAST_NAME,
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
  ADD_ERROR
} from "../actions/subscriptionTypes";
import {LOAD_USER_INFO} from "../actions/loginTypes";

import {API_URL, BING_LCOATION_API_URL} from "../constants";

export const resetSubscription = () => dispatch => {
  dispatch({
    type: LOGOUT_SUBSCRIPTION
  });
};

export const fetchPlans = () => dispatch => {
  let plans = null;
  axios
    .get(API_URL + "plans", {
      params: {
        business_uid: "200-000001"
      }
    })
    .then(res => {
      let items = res.data.result;
      let itemsReturn = {};
      for (let item of items) {
        if (item.num_items in itemsReturn) {
          itemsReturn[item.num_items][item.item_uid] = item;
        } else {
          itemsReturn[item.num_items] = {[item.item_uid]: item};
        }
      }

      let numItems = items.map(curValue => curValue.num_items);
      let distinctNumItems = numItems.filter(
        (elt, index) => numItems.indexOf(elt) === index
      );
      distinctNumItems.sort((a, b) => a - b);
      let paymentFrequency = items.map(curValue => curValue.payment_frequency);
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
          paymentFrequency: distinctPaymentFrequency
        }
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
    payload: newMeal
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
    payload: newPaymentOption
  });
};

const calculateTotalPayment = (dispatch, plans, meal, options) => {
  if (meal !== "" && options !== "") {
    let mealNum = Number(meal);
    let optionsNum = Number(options);
    let selectedPlan = Object.values(plans[meal]).filter(
      elt => elt.num_items === mealNum && elt.payment_frequency === optionsNum
    );
    if (selectedPlan.length !== 0) {
      let selectedItem = selectedPlan[0];
      dispatch({
        type: GET_TOTAL_PAYMENT,
        payload: selectedItem
      });
    } else {
      dispatch({
        type: GET_TOTAL_PAYMENT,
        payload: {}
      });
    }
  }
};

export const fetchProfileInformation = customerId => dispatch => {
  axios
    .get(API_URL + "Profile/" + customerId)
    .then(res => {
      if (
        !res.data.result ||
        !res.data.result.length ||
        res.data.code !== 200
      ) {
        history.push("/choose-plan");
        dispatch({
          type: ADD_ERROR,
          payload: "Cannot get Profile Info."
        });
      } else {
        let customerInfo = res.data.result[0];
        let email = customerInfo.customer_email;
        let socialMedia =
          customerInfo.user_social_media !== null
            ? customerInfo.user_social_media
            : "NULL";

        dispatch({
          type: FETCH_PROFILE_INFO,
          payload: {
            customerId: customerId,
            email: email,
            socialMedia: socialMedia
          }
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

export const changeAddressFirstName = newFirstName => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_FIRST_NAME,
    payload: newFirstName
  });
};

export const changeAddressLastName = newLastName => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_LAST_NAME,
    payload: newLastName
  });
};

export const changeAddressStreet = newStreet => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_STREET,
    payload: newStreet
  });
};

export const changeAddressUnit = newUnit => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_UNIT,
    payload: newUnit
  });
};

export const changeAddressCity = newCity => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_CITY,
    payload: newCity
  });
};

export const changeAddressState = newState => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_STATE,
    payload: newState
  });
};

export const changeAddressZip = newZip => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_ZIP,
    payload: newZip
  });
};

export const changeAddressPhone = newPhoneNum => dispatch => {
  dispatch({
    type: CHANGE_ADDRESS_PHONE,
    payload: newPhoneNum
  });
};

export const changeDeliveryInstructions = newInstructions => dispatch => {
  dispatch({
    type: CHANGE_DELIVERY_INSTRUCTIONS,
    payload: newInstructions
  });
};

export const changePaymentPassword = (newPassword, callback) => dispatch => {
  dispatch({
    type: CHANGE_PAYMENT_PASSWORD,
    payload: newPassword
  });
  if (typeof callback !== "undefined") {
    callback();
  }
};

export const changeCardNumber = number => dispatch => {
  dispatch({
    type: CHANGE_CARD_NUMBER,
    payload: number
  });
};

export const changeCardZip = zip => dispatch => {
  dispatch({
    type: CHANGE_CARD_ZIP,
    payload: zip
  });
};

export const changeCardCvv = cvv => dispatch => {
  dispatch({
    type: CHANGE_CARD_CVV,
    payload: cvv
  });
};

export const changeCardMonth = month => dispatch => {
  dispatch({
    type: CHANGE_CARD_MONTH,
    payload: month
  });
};

export const changeCardYear = year => dispatch => {
  dispatch({
    type: CHANGE_CARD_YEAR,
    payload: year
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
  callback
) => dispatch => {
  console.log(customerEmail, customerUid, loginMethod);
  if (loginMethod === "NULL") {
    // Prepare to login
    axios
      .post(API_URL + "accountsalt", {
        email: customerEmail
      })
      .then(res => {
        let saltObject = res;
        if (saltObject.status === 200) {
          let hashAlg = saltObject.data.result[0].password_algorithm;
          let salt = saltObject.data.result[0].password_salt;
          //Get hash algorithm
          switch (hashAlg) {
            case "SHA512":
              hashAlg = "SHA-512";
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
              .map(byte => byte.toString(16).padStart(2, "0"))
              .join("");
            axios
              .get(BING_LCOATION_API_URL, {
                params: {
                  CountryRegion: "US",
                  adminDistrict: deliveryState,
                  locality: deliveryCity,
                  postalCode: deliveryZip,
                  addressLine: deliveryAddress,
                  key: process.env.REACT_APP_BING_LOCATION_KEY
                }
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
                      qty: "1",
                      name: selectedPlan.item_name,
                      price: selectedPlan.item_price,
                      item_uid: selectedPlan.item_uid,
                      itm_business_uid: "200-000001"
                    }
                  ];
                  console.log(purchasedItem);
                  let object = {
                    customer_uid: customerUid,
                    salt: hashedPassword,
                    business_uid: "200-000001",
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
                    amount_due: selectedPlan.item_price.toString(),
                    amount_discount: "0",
                    amount_paid: "0",
                    cc_num: "4242424242424242",
                    cc_exp_month: "04",
                    cc_exp_year: "2024",
                    cc_cvv: "424",
                    cc_zip: "95120"
                  };
                  console.log(JSON.stringify(object));
                  axios
                    .post(API_URL + "checkout", object)
                    .then(res => {
                      console.log(res);
                      dispatch({
                        type: SUBMIT_PAYMENT
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
          });
        }
      });
  } else {
    // Skip sign in part
    axios
      .get(BING_LCOATION_API_URL, {
        params: {
          CountryRegion: "US",
          adminDistrict: deliveryState,
          locality: deliveryCity,
          postalCode: deliveryZip,
          addressLine: deliveryAddress,
          key: process.env.REACT_APP_BING_LOCATION_KEY
        }
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
              qty: "1",
              name: selectedPlan.item_name,
              price: selectedPlan.item_price,
              item_uid: selectedPlan.item_uid,
              itm_business_uid: "200-000001"
            }
          ];
          console.log(purchasedItem);
          let object = {
            customer_uid: customerUid,
            business_uid: "200-000001",
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
            amount_due: selectedPlan.item_price.toString(),
            amount_discount: "0",
            amount_paid: "0",
            cc_num: "4242424242424242",
            cc_exp_month: "04",
            cc_exp_year: "2024",
            cc_cvv: "424",
            cc_zip: "95120"
          };
          console.log(JSON.stringify(object));
          axios
            .post(API_URL + "checkout", object)
            .then(res => {
              console.log(res);
              dispatch({
                type: SUBMIT_PAYMENT
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
      params: {customer_uid: customerId}
    });
    if (res.status !== 200) {
      dispatch({
        type: ADD_ERROR,
        payload: "Cannot Get Subscription Info"
      });
    } else {
      dispatch({
        type: FETCH_SUBSCRIBED_INFO,
        payload: res.data.result
      });
      for (let items of res.data.result) {
        purchaseIds.push(items.purchase_id);
      }
    }
  } catch (err) {
    let message = "";
    if (err.response) {
      message = err.response;
    } else {
      message = err.toString();
    }
    dispatch({
      type: ADD_ERROR,
      payload: message
    });
  }
  return purchaseIds;
};
