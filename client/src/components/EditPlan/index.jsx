import { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  fetchPlans,
  fetchSubscribed,
  chooseMealsDelivery,
  choosePaymentOption,
  fetchProfileInformation,
} from "../../reducers/actions/subscriptionActions";

import axios from "axios";
import { API_URL } from "../../reducers/constants";
import { withRouter } from "react-router";
import styles from "./editPlan.module.css";
// import styles from "../../EditPlan/editPlan.module.css";
import styles_admin from "../Admin/AdminEditModal/adminEditModal.module.css";
import { WebNavBar } from "../NavBar";
import { FootLink } from "../Home/homeButtons";

import fetchDiscounts from "../../utils/FetchDiscounts";
import fetchAddressCoordinates from "../../utils/FetchAddressCoordinates";

import PopLogin from "../PopLogin";
import Popsignup from "../PopSignup";

import m4me_logo from "../../images/LOGO_NoBG_MealsForMe.png";

const google = window.google;

var map;
var autocomplete;

const DEFAULT = 0;
const CURRENT = 1;
const UPDATED = 2;

const TRIGGER_RECALCULATION = true;
const DO_NOT_TRIGGER_RECALCULATION = false;

const EditPlan = (props) => {
  // const [result, setResult] = useState('');
  const [currentPlan, setCurrentPlan] = useState({
    purchase_uid: null,
    billing: {
      base_amount: "0.00",
      taxes: "0.00",
      delivery_fee: "0.00",
      service_fee: "0.00",
      driver_tip: "2.00",
      discount_amount: "0.00",
      discount_rate: 0,
      ambassador_discount: "0.00",
      subtotal: "0.00",
      total: "0.00",
    },
    delivery_details: {
      delivery_address: "",
      delivery_city: "",
      delivery_day: null,
      delivery_email: "",
      delivery_fee: 0,
      delivery_first_name: "",
      delivery_instructions: "",
      delivery_last_name: "",
      delivery_latitude: null,
      delivery_longitude: null,
      delivery_phone_num: "",
      delivery_state: "",
      delivery_status: "",
      delivery_unit: ""   
    },
    items: null,
    meals: null,
    deliveries: null,
    order_history: null,
    load_order: null,
    discount: null,
    next_billing_date: null,
    rawData: {}
  });
  const [newPlan, setNewPlan] = useState({
    purchase_uid: null,
    billing: {
      base_amount: "0.00",
      taxes: "0.00",
      delivery_fee: "0.00",
      service_fee: "0.00",
      driver_tip: "2.00",
      discount_amount: "0.00",
      discount_rate: 0,
      ambassador_discount: "0.00",
      subtotal: "0.00",
      total: "0.00",
    },
    delivery_details: {
      delivery_address: "",
      delivery_city: "",
      delivery_day: null,
      delivery_email: "",
      delivery_fee: 0,
      delivery_first_name: "",
      delivery_instructions: "",
      delivery_last_name: "",
      delivery_latitude: null,
      delivery_longitude: null,
      delivery_phone_num: "",
      delivery_state: "",
      delivery_status: "",
      delivery_unit: ""   
    },
    items: null,
    meals: null,
    deliveries: null,
    order_history: null,
    load_order: null,
    discount: null,
    next_billing_date: null,
    rawData: {}
  });
  const [billingDifference, setBillingDifference] = useState({
    base_amount: "0.00",
    taxes: "0.00",
    delivery_fee: "0.00",
    service_fee: "0.00",
    driver_tip: "0.00",
    discount_amount: "0.00",
    discount_rate: 0,
    ambassador_discount: "0.00",
    subtotal: "0.00",
    total: "0.00",
  });

  const [dataFetched, setDataFetched] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [plans, setPlans] = useState(null);
  const [deliveryDiscounts, setDeliveryDiscounts] = useState(null);
  const [pnbd_data, set_pnbd_data] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const [profileEmail, setProfileEmail] = useState('');
  const [recalculating, setRecalculating] = useState(false);

  // const [tipSelected, selectTip] = useState('2.00');
  // const [trigger_recalc_by_tip, set_trigger_recalc_by_tip] = useState()
  const [tipAmount, setTipAmount] = useState('2.00');
  const [numMealsSelected, selectNumMeals] = useState('2.00');
  const [numDeliveriesSelected, selectNumDeliveries] = useState('2.00');

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [deliveryInput, setDeliveryInput] = useState({
    first_name: "",
    last_name: "",
    purchase_uid: "",
    phone: "",
    address: "",
    unit: "",
    city: "",
    state: "",
    zip: "",
    cc_num: "NULL",
    cc_cvv: "NULL",
    cc_zip: "NULL",
    cc_exp_date: "NULL",
    instructions: "",
  });

  const [login_seen, setLoginSeen] = useState(false);
  const [signUpSeen, setSignUpSeen] = useState(false);

  const togglePopLogin = () => {
    setLoginSeen(login_seen);

    if (!login_seen) {
      setSignUpSeen(false);
    }
  };

  const togglePopSignup = () => {
    setSignUpSeen(signUpSeen);

    if (!signUpSeen) {
      setLoginSeen(false);
    }
  };

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);

    return (_) => {
      window.removeEventListener("resize", handleResize);
    };
  });

  // STEP 1: fetch all necessary data when page first loads
  useEffect(() => {
    console.log("(UE1) props: ", props);

    let temp_lat;
    let temp_lng;

    if (latitude == null) {
      temp_lat = 37.3382;
    } else {
      temp_lat = latitude;
    }

    if (longitude == null) {
      temp_lng = -121.893028;
    } else {
      temp_lng = longitude;
    }

    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: temp_lat, lng: temp_lng },
      zoom: 12,
    });

    let customer_uid = document.cookie
      .split("; ")
      .find((item) => item.startsWith("customer_uid="))
      .split("=")[1];

    console.log("(UE1) customerId: ", customer_uid);

    var fetched = 0;

    // fetch profile info
    axios
      .get(API_URL + "Profile/" + customer_uid)
      .then((res) => {
        console.log("(profile) res: ", res);

        setProfileInfo(res.data.result[0]);

        // check if all remote data fetched
        fetched++;
        if(fetched === 3){
          console.log("(profile) all data fetched; loading into page...");
          setDataFetched(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // fetch future billing info
    // axios
    //   .get(API_URL + "predict_next_billing_date/" + customer_uid)
    axios
      .get("http://localhost:2000/api/v2/predict_next_billing_amount/" + customer_uid)
      .then((res) => {
        console.log("(PNBD) res: ", res);

        set_pnbd_data(res.data.result);

        // check if all remote data fetched
        fetched++;
        if(fetched === 3){
          console.log("(PNBD) all data fetched; loading into page...");
          setDataFetched(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // fetch plans/discounts
    axios
      .get(API_URL + 'plans', {
        params: {
          business_uid: '200-000002',
        },
      })
      .then(res => {
        console.log("(plans) res: ", res);

        let tempPlans = null;

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
        tempPlans = itemsReturn;

        console.log("(plans) tempPlans: ", tempPlans);
        let payload = {
              items: itemsReturn,
              numItems: distinctNumItems,
              paymentFrequency: distinctPaymentFrequency,
            };
        console.log("(plans) payload: ", payload);

        setPlans(tempPlans);

        // Set discounts
        let twoMealPlans = res.data.result.filter( function(e) {
          return e.num_items === 2;
        });

        let discounts = [];

        twoMealPlans.forEach((plan) => {
          discounts.push({
            deliveries: plan.num_deliveries.toString(),
            discount: plan.delivery_discount
          });
        });

        setDeliveryDiscounts(discounts);

        // check if all remote data fetched
        fetched++;
        if(fetched === 3){
          console.log("(plans) all data fetched; loading into page...");
          setDataFetched(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
    
  }, []);

  const getDeliveryDiscount = (num_delivs) => {
    let tempDiscount = deliveryDiscounts.find((element) => {
      return element.deliveries === num_delivs
    });
    return tempDiscount.discount;
  }

  // STEP 2: once all data has been fetched, load into page
  useEffect(() => {
    if(dataFetched === true){
      console.log("(UE2) plans: ", plans);

      let parsedSubs = [];

      pnbd_data.forEach((sub, index) => {
        console.log("(UE2) sub: ", sub);

        let subDiscount = getDeliveryDiscount(sub.num_deliveries);
        console.log("(UE2) subDiscount: ", subDiscount);

        let parsedUid = sub.purchase_uid.substring(
          sub.purchase_id.indexOf("-") + 1,
          sub.purchase_id.length
        );

        let parsedItems = JSON.parse(sub.items)[0];
        let parsedMeals = parsedItems.name.substring(
          0,
          parsedItems.name.indexOf(" ")
        );
        console.log("(UE2) parsedMeals: ", parsedMeals);
        console.log("(UE2) name: ", parsedItems.name);

        // let nextBillingAmount =
        //   sub.subtotal +
        //   sub.taxes +
        //   sub.delivery_fee +
        //   sub.service_fee +
        //   sub.driver_tip -
        //   subDiscount * 0.01 * sub.subtotal -
        //   sub.ambassador_code;

        let parsedSub = {
          purchase_uid: parsedUid,
          index,
          billing: {
            base_amount: sub.subtotal.toFixed(2),
            taxes: sub.taxes.toFixed(2),
            delivery_fee: sub.delivery_fee.toFixed(2),
            service_fee: sub.service_fee.toFixed(2),
            driver_tip: sub.driver_tip.toFixed(2),
            discount_amount: sub.amount_discount.toFixed(2),
            discount_rate: subDiscount,
            ambassador_discount: sub.ambassador_code.toFixed(2),
            subtotal: (sub.amount_due + sub.ambassador_code).toFixed(2),
            total: sub.amount_due.toFixed(2)
          },
          delivery_details: {
            delivery_address: sub.delivery_address,
            delivery_city: sub.delivery_city,
            delivery_day: sub.delivery_day,
            delivery_email: sub.delivery_email,
            delivery_fee: sub.delivery_fee,
            delivery_first_name: sub.delivery_first_name,
            delivery_instructions: sub.delivery_instructions,
            delivery_last_name: sub.delivery_last_name,
            delivery_latitude: sub.delivery_latitude,
            delivery_longitude: sub.delivery_longitude,
            delivery_phone_num: sub.delivery_phone_num,
            delivery_state: sub.delivery_state,
            delivery_status: sub.delivery_status,
            delivery_unit: sub.delivery_unit
          },
          items: JSON.parse(sub.items),
          meals: parsedMeals,
          deliveries: sub.num_deliveries,
          discount: subDiscount.discount,
          next_billing_date: sub.next_billing_date.substring(
            0, sub.next_billing_date.indexOf(" ")
          ),
          next_delivery_status: sub.final_selection,
          next_delivery_date: sub.next_delivery.substring(
            0, sub.next_delivery.indexOf(" ")
          ),
          // next_billing_amount: nextBillingAmount.toFixed(2),
          next_billing_amount: sub.amount_due.toFixed(2),
          rawData: sub
        }

        if(index === 0){
          selectNumMeals(parsedSub.meals);
          selectNumDeliveries(parsedSub.deliveries);

          setDeliveryInput({
            first_name: sub.delivery_first_name,
            last_name: sub.delivery_last_name,
            purchase_uid: sub.purchase_uid,
            phone: sub.delivery_phone_num,
            address: sub.delivery_address,
            unit: sub.delivery_unit,
            city: sub.delivery_city,
            state: sub.delivery_state,
            zip: sub.delivery_zip,
            cc_num: "NULL",
            cc_cvv: "NULL",
            cc_zip: "NULL",
            cc_exp_date: "NULL",
            instructions: sub.delivery_instructions,
          });

          document.getElementById("locality").value = sub.delivery_city;
          document.getElementById("state").value = sub.delivery_state;
          document.getElementById("pac-input").value = sub.delivery_address;
          document.getElementById("postcode").value = sub.delivery_zip;

          fetchAddressCoordinates(
            sub.delivery_address,
            sub.delivery_city,
            sub.delivery_state,
            sub.delivery_zip,
            (coords) => {
              console.log("(fetchAddressCoordinates) Fetched coordinates: ", coords);
  
              // this.setState({
              //   latitude: coords.latitude,
              //   longitude: coords.longitude,
              // });
              setLatitude(coords.latitude);
              setLongitude(coords.longitude);
  
              const temp_position = {
                lat: parseFloat(coords.latitude),
                lng: parseFloat(coords.longitude),
              };
  
              console.log("(fetchAddressCoordinates) temp_position: ", temp_position);
  
              map.setCenter(temp_position);

              console.log("(fetchAddressCoordinates) after center");
  
              if (coords.latitude !== "") {
                map.setZoom(17);
                new google.maps.Marker({
                  position: temp_position,
                  map,
                });
              }
            }
          );

          // set default plans
          console.log("(UE2) setting currentPlan: ", parsedSub);
          setCurrentPlan(parsedSub);
          setNewPlan(parsedSub);
        }

        parsedSubs.push(parsedSub);
      });

      console.log("setting subscriptions...");
      setSubscriptions(parsedSubs);
    }
  }, [dataFetched]);

  // STEP 3: signal to page that data is loaded
  useEffect(() => {
    if(subscriptions !== null) {
      console.log("setting dataLoaded...");
      setDataLoaded(true);
    }
  }, [subscriptions])

  // runs anytime an existing subscription is selected to edit
  useEffect(() => {
    if(dataLoaded) {
      console.log("(UE currentPlan) currentPlan: ", currentPlan);

      // console.log("(UE currentPlan) numMealsSelected: ", typeof numMealsSelected);
      // console.log("(UE currentPlan) numDeliveriesSelected: ", typeof numDeliveriesSelected);
      // console.log("(UE currentPlan) currentPlan.meals: ", typeof currentPlan.meals);
      // console.log("(UE currentPlan) currentPlan.deliveries: ", typeof currentPlan.deliveries);
      selectNumMeals(currentPlan.meals);
      selectNumDeliveries(currentPlan.deliveries);

      selectTip(currentPlan.billing.driver_tip);

      let sub = currentPlan.delivery_details;
      setDeliveryInput({
        first_name: sub.delivery_first_name,
        last_name: sub.delivery_last_name,
        purchase_uid: sub.purchase_uid,
        phone: sub.delivery_phone_num,
        address: sub.delivery_address,
        unit: sub.delivery_unit,
        city: sub.delivery_city,
        state: sub.delivery_state,
        zip: sub.delivery_zip,
        cc_num: "NULL",
        cc_cvv: "NULL",
        cc_zip: "NULL",
        cc_exp_date: "NULL",
        instructions: sub.delivery_instructions,
      });

      document.getElementById("locality").value = sub.delivery_city;
      document.getElementById("state").value = sub.delivery_state;
      document.getElementById("pac-input").value = sub.delivery_address;
      document.getElementById("postcode").value = sub.delivery_zip;

      fetchAddressCoordinates(
        sub.delivery_address,
        sub.delivery_city,
        sub.delivery_state,
        sub.delivery_zip,
        (coords) => {
          console.log("(fetchAddressCoordinates) Fetched coordinates: ", coords);

          setLatitude(coords.latitude);
          setLongitude(coords.longitude);

          const temp_position = {
            lat: parseFloat(coords.latitude),
            lng: parseFloat(coords.longitude),
          };

          console.log("(fetchAddressCoordinates) temp_position: ", temp_position);

          map.setCenter(temp_position);

          console.log("(fetchAddressCoordinates) after center");

          if (coords.latitude !== "") {
            map.setZoom(17);
            new google.maps.Marker({
              position: temp_position,
              map,
            });
          }
        }
      );

      // default to current plan since no edits have been made yet
      setNewPlan(currentPlan);
    }
  }, [currentPlan]);

  const refreshSubscriptions = () => {
    console.log("(RS) refreshing subscriptions...");
    axios
      .get("http://localhost:2000/api/v2/predict_next_billing_amount/" + profileInfo.customer_uid)
      .then((res) => {
        console.log("(PNBD) res: ", res);

        let parsedSubs = [];

        res.data.result.forEach((sub, index) => {
          console.log("(RS) sub: ", sub);

          // let subDiscount = deliveryDiscounts.find((element) => {
          //   return element.deliveries === sub.num_deliveries
          // });
          let subDiscount = getDeliveryDiscount(sub.num_deliveries);
          console.log("(RS) subDiscount: ", subDiscount);

          let parsedUid = sub.purchase_uid.substring(
            sub.purchase_id.indexOf("-") + 1,
            sub.purchase_id.length
          );

          let parsedItems = JSON.parse(sub.items)[0];
          let parsedMeals = parsedItems.name.substring(
            0,
            parsedItems.name.indexOf(" ")
          );
          console.log("(RS) parsedMeals: ", parsedMeals);
          console.log("(RS) name: ", parsedItems.name);

          let nextBillingAmount =
            sub.subtotal +
            sub.taxes +
            sub.delivery_fee +
            sub.service_fee +
            sub.driver_tip -
            subDiscount * 0.01 * sub.subtotal -
            sub.ambassador_code;

          let parsedSub = {
            purchase_uid: parsedUid,
            index,
            billing: {
              base_amount: sub.subtotal.toFixed(2),
              taxes: sub.taxes.toFixed(2),
              delivery_fee: sub.delivery_fee.toFixed(2),
              service_fee: sub.service_fee.toFixed(2),
              driver_tip: sub.driver_tip.toFixed(2),
              discount_amount: sub.amount_discount.toFixed(2),
              discount_rate: subDiscount,
              ambassador_discount: sub.ambassador_code.toFixed(2),
              subtotal: (sub.amount_due + sub.ambassador_code).toFixed(2),
              total: sub.amount_due.toFixed(2)
            },
            delivery_details: {
              delivery_address: sub.delivery_address,
              delivery_city: sub.delivery_city,
              delivery_day: sub.delivery_day,
              delivery_email: sub.delivery_email,
              delivery_fee: sub.delivery_fee,
              delivery_first_name: sub.delivery_first_name,
              delivery_instructions: sub.delivery_instructions,
              delivery_last_name: sub.delivery_last_name,
              delivery_latitude: sub.delivery_latitude,
              delivery_longitude: sub.delivery_longitude,
              delivery_phone_num: sub.delivery_phone_num,
              delivery_state: sub.delivery_state,
              delivery_status: sub.delivery_status,
              delivery_unit: sub.delivery_unit
            },
            items: JSON.parse(sub.items),
            meals: parsedMeals,
            deliveries: sub.num_deliveries,
            discount: subDiscount.discount,
            next_billing_date: sub.next_billing_date.substring(
              0, sub.next_billing_date.indexOf(" ")
            ),
            next_delivery_status: sub.final_selection,
            next_delivery_date: sub.next_delivery.substring(
              0, sub.next_delivery.indexOf(" ")
            ),
            next_billing_amount: nextBillingAmount.toFixed(2),
            rawData: sub
          }

          if(index === 0){
            selectNumMeals(parsedSub.meals);
            selectNumDeliveries(parsedSub.deliveries);

            setDeliveryInput({
              first_name: sub.delivery_first_name,
              last_name: sub.delivery_last_name,
              purchase_uid: sub.purchase_uid,
              phone: sub.delivery_phone_num,
              address: sub.delivery_address,
              unit: sub.delivery_unit,
              city: sub.delivery_city,
              state: sub.delivery_state,
              zip: sub.delivery_zip,
              cc_num: "NULL",
              cc_cvv: "NULL",
              cc_zip: "NULL",
              cc_exp_date: "NULL",
              instructions: sub.delivery_instructions,
            });

            document.getElementById("locality").value = sub.delivery_city;
            document.getElementById("state").value = sub.delivery_state;
            document.getElementById("pac-input").value = sub.delivery_address;
            document.getElementById("postcode").value = sub.delivery_zip;

            fetchAddressCoordinates(
              sub.delivery_address,
              sub.delivery_city,
              sub.delivery_state,
              sub.delivery_zip,
              (coords) => {
                console.log("(fetchAddressCoordinates) Fetched coordinates: ", coords);
    
                setLatitude(coords.latitude);
                setLongitude(coords.longitude);
    
                const temp_position = {
                  lat: parseFloat(coords.latitude),
                  lng: parseFloat(coords.longitude),
                };
    
                console.log("(fetchAddressCoordinates) temp_position: ", temp_position);
    
                map.setCenter(temp_position);

                console.log("(fetchAddressCoordinates) after center");
    
                if (coords.latitude !== "") {
                  map.setZoom(17);
                  new google.maps.Marker({
                    position: temp_position,
                    map,
                  });
                }
              }
            );

            // set default plans
            console.log("(RS) setting currentPlan: ", parsedSub);
            setCurrentPlan(parsedSub);
            setNewPlan(parsedSub);
          }

          parsedSubs.push(parsedSub);
        });

        console.log("setting subscriptions...");
        setSubscriptions(parsedSubs);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // useEffect(() => {
  //   console.log("changed deliveryInput: ", deliveryInput);
  // }, [deliveryInput]);

  const selectTip = (tip_amount, recalculate_billing) => {
    if(recalculate_billing === true){
      calculateBilling({
        tip: tip_amount
      })
    }
    setTipAmount(tip_amount);
  }

  const saveDeliveryDetails = () => {
    // setDeliveryInput({
    //   first_name: sub.delivery_first_name,
    //   last_name: sub.delivery_last_name,
    //   purchase_uid: sub.purchase_uid,
    //   phone: sub.delivery_phone_num,
    //   address: sub.delivery_address,
    //   unit: sub.delivery_unit,
    //   city: sub.delivery_city,
    //   state: sub.delivery_state,
    //   zip: sub.delivery_zip,
    //   cc_num: "NULL",
    //   cc_cvv: "NULL",
    //   cc_zip: "NULL",
    //   cc_exp_date: "NULL",
    //   instructions: sub.delivery_instructions,
    // });

    // 1.) save delivery details to database
    let object = { ...deliveryInput };

    // Deleting since instructions field does not currently exist in endpoint
    delete object["instructions"];

    object["email"] = profileInfo.email;

    let city = document.getElementById("locality").value;
    let state = document.getElementById("state").value;
    let address = document.getElementById("pac-input").value;
    let zip = document.getElementById("postcode").value;

    let post_object = {
      first_name: object.first_name,
      last_name: object.last_name,
      purchase_uid: currentPlan.purchase_uid,
      phone: object.phone,
      address,
      unit: object.unit,
      city,
      state,
      zip,
      email: profileInfo.customer_email,
    };
    console.log("(SDD) post_object: ", post_object);
    console.log("(SDD) currentPlan: ", currentPlan);

    axios
      .post(API_URL + "Update_Delivery_Info_Address", post_object)
      .then((res) => {
        console.log("update delivery info res: ", res);

        refreshSubscriptions();
      })
      .catch((err) => {
        console.log("error happened while updating delivery info", err);
        if (err.response) {
          console.log("err.response: " + JSON.stringify(err.response));
        }
      });
  }

  // recalculate billing on meals/deliveries change
  useEffect(() => {
    if(dataLoaded){
      calculateBilling({});
    }
  }, [numMealsSelected, numDeliveriesSelected]);

  // Used to render menu at top showing all current meals plans
  const showSubscribedMeals = () => {
    let deselectedMealButton = styles.mealButton;
    let selectedMealButton = styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];

    console.log("(SSM) dataLoaded: ", dataLoaded);
    console.log("(SSM) subscriptions: ", subscriptions);
    subscriptions.forEach((sub) => {
      mealButtons.push(
        <div
          key={sub.purchase_uid}
          className={
            currentPlan.purchase_uid === sub.purchase_uid
              ? selectedMealButton
              : deselectedMealButton
          }
          onClick={() => {
            // console.log("(SSM) CALL calculateBilling here");
            console.log("(SSM) current plan: ", currentPlan);
            console.log("(SSM) clicked plan: ", sub);

            // default new plan to current plan since no edits have been made yet
            console.log("(SSM) setting currentPlan: ", sub);
            setCurrentPlan(sub);
            setNewPlan(sub); 
          }}
          tabIndex="0"
          aria-label={
            "Click to select Purchase ID: " +
            sub.purchase_uid +
            ", " +
            sub.meals +
            "Meals," +
            sub.deliveries +
            "Deliveries"
          }
          title={
            "Click to select Purchase ID: " +
            sub.purchase_uid +
            ", " +
            sub.meals +
            "Meals," +
            sub.deliveries +
            "Deliveries"
          }
        >
          <div className={styles.mealButtonEdit}></div>
          <div className={styles.mealButtonPlan}>
            {sub.meals} Meals, {sub.deliveries} Deliveries
          </div>
          <div className={styles.mealButtonPlan}>{sub.purchase_uid}</div>
          <div className={styles.mealButtonSection}>
            {sub.next_delivery_date}
          </div>
          <div className={styles.mealButtonSection}>
            {sub.next_delivery_status}
          </div>
          <div className={styles.mealButtonSection}>
            {sub.next_billing_date}
          </div>
          <div className={styles.mealButtonSection}>
            ${sub.next_billing_amount}
          </div>
        </div>
      );
    });

    return <div style={{ width: "100%" }}>{mealButtons}</div>;
  };

  // const itemize = () => {

  // }

  const mealsDelivery = () => {
    let deselectedPlateButton = styles_admin.plateButton;
    let selectedPlateButton =
      styles_admin.plateButton + " " + styles_admin.plateButtonSelected;
    let plateButtons = [];
    let singleMealData;

    // let mealPlans = this.props.plans;

    for (const [mealIndex, mealData] of Object.entries(plans)) {
      singleMealData = mealData["1"];

      plateButtons.push(
        <div>
          <div className={styles_admin.plateButtonWrapper}>
            <button
              key={mealIndex}
              // className={
              //   newPlan.meals === mealIndex
              //     ? selectedPlateButton
              //     : deselectedPlateButton
              // }
              className={
                numMealsSelected === mealIndex
                  ? selectedPlateButton
                  : deselectedPlateButton
              }
              onClick={() => {
                console.log("(MD) CALL calculateBilling here");

                console.log("(change) plan before: ", newPlan);
                console.log("(change) new data -- mealIndex: ", mealIndex);

                selectNumMeals(mealIndex);
                // calculateBilling(
                //   sub.items,
                //   {latitude, longitude},
                //   sub.billing.driver_tip
                // );

                // console.log("(MD) clicked: ", mealIndex, " ; ", mealData);
                // console.log("(MD) clicked: ", mealIndex, " ; ", this.state.updatedPlan.deliveries);
                // console.log("(MD) plans: ", this.props.plans);
                // this.props.chooseMealsDelivery(
                //   mealIndex,
                //   this.state.updatedPlan.deliveries,
                //   this.props.plans
                // );

                // this.changePlans(mealIndex, this.state.updatedPlan.deliveries);
              }}
              aria-label={
                "Click to switch to " +
                mealIndex +
                " meals per delivery for $" +
                singleMealData.item_price
              }
              title={
                "Click to switch to " +
                mealIndex +
                " meals per delivery for $" +
                singleMealData.item_price
              }
            >
              {mealIndex}
            </button>
          </div>
          <div
            style={{
              textAlign: "center",
              // marginTop: '10px',
              // border: '1px solid violet'
            }}
          >
            ${singleMealData.item_price}
          </div>
        </div>
      );
    }
    return plateButtons;
  };

  const paymentFrequency = () => {
    let deselectedPaymentOption = styles_admin.deliveryButton;
    let selectedPaymentOption =
      styles_admin.deliveryButton + " " + styles_admin.deliveryButtonSelected;
    let paymentOptionButtons = [];

    var discount = null;

    for (const [deliveryIndex, deliveryData] of Object.entries(plans[2])) {
      let discountItem = deliveryDiscounts.filter(function (e) {
        return e.deliveries === deliveryIndex;
      });

      discount = discountItem[0].discount;

      let ariaTag = "";

      if (deliveryIndex == 1) {
        ariaTag = "click here to switch to " + deliveryIndex + " delivery";
      } else {
        ariaTag =
          "click here to switch to " +
          deliveryIndex +
          " deliveries and save " +
          discount +
          "%";
      }

      paymentOptionButtons.push(
        <div className={styles_admin.sameLine} key={deliveryIndex}>
          <button
            // className={
            //   newPlan.deliveries === deliveryIndex
            //     ? selectedPaymentOption
            //     : deselectedPaymentOption
            // }
            className={
              numDeliveriesSelected === deliveryIndex
                ? selectedPaymentOption
                : deselectedPaymentOption
            }
            onClick={() => {
              console.log("(PF) CALL calculateBilling here");

              console.log("(change) plan before: ", newPlan);
              console.log("(change) new data -- deliveryIndex: ", deliveryIndex);

              selectNumDeliveries(deliveryIndex);
              // this.props.choosePaymentOption(
              //   deliveryIndex,
              //   updatedPlan.meals,
              //   this.props.plans
              // );
              // this.changePlans(this.state.updatedPlan.meals, deliveryIndex);
            }}
            aria-label={ariaTag}
            title={ariaTag}
          >
            <span style={{ fontSize: "2em" }}>{deliveryIndex}</span>
            <br />
            {(() => {
              // if (typeof discount !== "undefined" && discount > 0) {
                if (discount > 0) {
                return (
                  <span
                    style={{
                      fontSize: "0.8em",
                    }}
                  >
                    (Save {discount}%)
                  </span>
                );
              }
            })()}
          </button>
        </div>
      );
    }
    return paymentOptionButtons;
  };

  const showPlanDetails = (width) => {
    let ariaTag =
      "Your current meal plan currently contains " +
      currentPlan.meals +
      " meals per delivery and" +
      currentPlan.deliveries +
      " deliveries";
    if (width < 800) {
      return (
        // <div 
        //   style={{ 
        //     display: "flex",
        //     border: '1px dashed',
        //   }}
        // >
          <div 
            style={{
              display: "inline-block",
              // border: '1px dashed',
              width: '100%'
            }}
          >
            <div className={styles.boxPDnarrowTop}>
              <div className={styles_admin.planHeader}>Current Plan</div>

              <div style={{ paddingBottom: "50px" }}>
                <span className={styles_admin.subHeader2}>MEALS</span>
                <div className={styles_admin.plateButtonWrapper2}>
                  <button
                    className={styles_admin.plateButtonCurrent}
                  >
                    {currentPlan.meals}
                  </button>
                </div>
              </div>

              <div style={{ paddingBottom: "50px" }}>
                <span className={styles_admin.subHeader2}>DELIVERIES</span>
                <div className={styles_admin.plateButtonWrapper2}>
                  <button className={styles_admin.deliveryButtonCurrent}>
                    <span style={{ fontSize: "2em" }}>
                      {currentPlan.deliveries}
                    </span>
                    <br />
                    {(() => {
                      if (
                        currentPlan.discount !== null &&
                        currentPlan.discount > 0
                      ) {
                        return (
                          <span
                            style={{
                              fontSize: "0.8em",
                            }}
                          >
                            (Save {currentPlan.discount}%)
                          </span>
                        );
                      }
                    })()}
                  </button>
                </div>
              </div>

              <div>
                <span className={styles_admin.subHeader2}>CANCEL</span>
                <div className={styles_admin.plateButtonWrapper3}>
                  <div
                    className={styles.iconTrash}
                    onClick={() => {
                      // this.confirmDelete();
                    }}
                    tabIndex="0"
                    aria-label="Click here to cancel this meal plan"
                    title="Click here to cancel this meal plan"
                  />
                </div>
              </div>
            </div>

            <div className={styles.boxPDnarrowBottom}>
              <div className={styles_admin.planHeader}>Updated Plan</div>

              <div className={styles.menuSection}>
                <div className={styles.center}>
                  <span className={styles.subHeader}>
                    NUMBER OF MEALS PER DELIVERY
                  </span>
                </div>
                {(() => {
                  if (plans !== null) {
                    return (
                      <div className={styles_admin.buttonWrapper}>
                        {mealsDelivery()}
                      </div>
                    );
                  }
                })()}
              </div>

              <div className={styles.menuSection}>
                <div className={styles.center}>
                  <span className={styles.subHeader}>
                    TOTAL NUMBER OF DELIVERIES
                  </span>
                </div>
                {(() => {
                  if (plans !== null) {
                    return (
                      <div
                        className="row"
                        style={{
                          marginTop: "20px",
                          marginBottom: "30px",
                        }}
                      >
                        {dataLoaded ? (paymentFrequency()) : (null)}
                      </div>
                    );
                  }
                })()}
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div className={styles_admin.chargeContainer} tabIndex="0">
                  {(() => {
                    let chargeOrRefund = billingDifference.total;
                    if (parseFloat(chargeOrRefund) >= 0) {
                      return (
                        <>
                          <div className={styles_admin.chargeText}>
                            {"Additional Charges "}
                          </div>
                          <div className={styles_admin.chargeAmount}>
                            ${billingDifference.total}
                          </div>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <div className={styles_admin.chargeText}>
                            {"You will be refunded "}
                          </div>
                          <div className={styles_admin.chargeAmount}>
                            {(-1 * billingDifference.total).toFixed(
                              2
                            )}
                          </div>
                        </>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        // </div>
      );
    } else {
      return (
        <>
          <div className={styles_admin.boxPDleft}>
            <div>
              <div className={styles_admin.planHeader}>Current Plan</div>

              <div style={{ paddingBottom: "50px" }}>
                <span className={styles_admin.subHeader2}>MEALS</span>
                <div className={styles_admin.plateButtonWrapper2}>
                  <button
                    className={styles_admin.plateButtonCurrent}
                  >
                    {currentPlan.meals}
                  </button>
                </div>
              </div>

              <div style={{ paddingBottom: "50px" }}>
                <span className={styles_admin.subHeader2}>DELIVERIES</span>

                <div className={styles_admin.plateButtonWrapper2}>
                  <button className={styles_admin.deliveryButtonCurrent}>
                    <span style={{ fontSize: "2em" }}>
                      {currentPlan.deliveries}
                    </span>
                    <br />
                    {(() => {
                      if (
                        currentPlan.discount !== null &&
                        currentPlan.discount > 0
                      ) {
                        return (
                          <span
                            style={{
                              fontSize: "0.8em",
                            }}
                          >
                            (Save {currentPlan.discount}%)
                          </span>
                        );
                      }
                    })()}
                  </button>
                </div>
              </div>

              <div>
                <span className={styles_admin.subHeader2}>CANCEL</span>
                <div className={styles_admin.plateButtonWrapper3}>
                  <div
                    className={styles.iconTrash}
                    onClick={() => {
                      // this.confirmDelete();
                    }}
                    tabIndex="0"
                    aria-label="Click here to cancel this meal plan"
                    title="Click here to cancel this meal plan"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.boxPDright}>
            <div className={styles_admin.planHeader}>Updated Plan</div>

            <div className={styles_admin.menuSection}>
              <span className={styles.subHeader}>
                NUMBER OF MEALS PER DELIVERY
              </span>
              {(() => {
                if (plans !== null) {
                  return (
                    <div className={styles_admin.buttonWrapper}>
                      {mealsDelivery()}
                    </div>
                  );
                }
              })()}
            </div>

            <div className={styles.menuSection}>
              <div className={styles.center}>
                <span className={styles.subHeader}>
                  TOTAL NUMBER OF DELIVERIES
                </span>
              </div>
              {(() => {
                if (plans !== null) {
                  return (
                    <div
                      className={styles_admin.buttonWrapper}
                      style={{
                        marginBottom: "50px",
                      }}
                    >
                      {dataLoaded ? (paymentFrequency()) : (null)}
                    </div>
                  );
                }
              })()}
            </div>

            <div className={styles_admin.chargeContainer} tabIndex="0">
              {(() => {
                let chargeOrRefund = billingDifference.total;
                if (parseFloat(chargeOrRefund) >= 0) {
                  return (
                    <>
                      <div className={styles_admin.chargeText}>
                        {"Additional Charges "}
                      </div>
                      <div className={styles_admin.chargeAmount}>
                        ${billingDifference.total}
                      </div>
                    </>
                  );
                } else {
                  return (
                    <>
                      <div className={styles_admin.chargeText}>
                        {"You will be refunded "}
                      </div>
                      <div className={styles_admin.chargeAmount}>
                        ${(-1 * billingDifference.total).toFixed(2)}
                      </div>
                    </>
                  );
                }
              })()}
            </div>
          </div>
        </>
      );
    }
  };

  const activeChanges = () => {
    let updatedSummary = newPlan.billing;
    let currentSummary = newPlan.billing;
    // console.log("(activeChanges) updatedSummary: ", updatedSummary);
    // console.log("(activeChanges) currentSummary: ", currentSummary);

    if (
      updatedSummary.base_amount === currentSummary.base_amount &&
      updatedSummary.discount_amount === currentSummary.discount_amount &&
      updatedSummary.delivery_fee === currentSummary.delivery_fee &&
      updatedSummary.service_fee === currentSummary.service_fee &&
      updatedSummary.driver_tip === currentSummary.driver_tip &&
      updatedSummary.ambassador_discount ===
        currentSummary.ambassador_discount &&
      updatedSummary.subtotal === currentSummary.subtotal &&
      updatedSummary.total === currentSummary.total &&
      updatedSummary.taxes === currentSummary.taxes
    ) {
      return false;
    }
    return true;
  };

  const showDeliveryDetails = () => {
    return (
      <div style={dimensions.width < 800
        ? {display: "inline-block", marginLeft: "8%", width: "84%", marginRight: "8%"}
        : {display: "inline-block", marginLeft: "8%", width: "40%", marginRight: "2%"}}
      >
        {/* <div style={{ display: "inline-block", border: '1px solid blue'}}> */}
        <div style={{ display: "flex"}}>
          <input
            type="text"
            placeholder="First Name"
            className={styles.inputContactLeft}
            value={deliveryInput.first_name}
            onChange={(e) => {
              setDeliveryInput({
                ...deliveryInput,
                first_name: e.target.value
              });
            }}
            aria-label="Confirm your first name"
            title="Confirm your first name"
          />

          <input
            type="text"
            placeholder="Last Name"
            className={styles.inputContactRight}
            value={deliveryInput.last_name}
            onChange={(e) => {
              setDeliveryInput({
                ...deliveryInput,
                last_name: e.target.value
              });
            }}
            aria-label="Confirm your last name"
            title="Confirm your last name"
          />
        </div>

        <input
          type="text"
          placeholder="Email"
          className={styles.input}
          value={profileInfo !== null ? (profileInfo.customer_email) : ('')}
          // onChange={(e) => {
          //   let unchangedEmail = profileEmail;
          //   setProfileEmail(unchangedEmail);
          // }}
          aria-label="Confirm your email"
          title="Confirm your email"
        />

        <input
          type="text"
          placeholder="Phone Number"
          className={styles.input}
          value={deliveryInput.phone}
          onChange={(e) => {
            setDeliveryInput({
              ...deliveryInput,
              phone: e.target.value
            });
          }}
          aria-label="Confirm your phone number"
          title="Confirm your phone number"
        />

        <input
          type="text"
          placeholder={"Address 1"}
          className={styles.input}
          id="pac-input"
          name="pac-input"
          aria-label="Confirm your address"
          title="Confirm your address"
        />

        <div style={{ display: "flex" }}>
          <input
            type="text"
            placeholder={"Unit"}
            className={styles.inputContactLeft}
            value={deliveryInput.unit}
            onChange={(e) => {
              setDeliveryInput({
                ...deliveryInput,
                unit: e.target.value
              });
            }}
            aria-label="Confirm your unit"
            title="Confirm your unit"
          />

          <input
            type="text"
            placeholder={"City"}
            id="locality"
            name="locality"
            className={styles.inputContactRight}
            aria-label="Confirm your city"
            title="Confirm your city"
          />
        </div>

        <div style={{ display: "flex" }}>
          <input
            type="text"
            placeholder={"State"}
            className={styles.inputContactLeft}
            id="state"
            name="state"
            aria-label="Confirm your state"
            title="Confirm your state"
          />
          <input
            type="text"
            placeholder={"Zip Code"}
            className={styles.inputContactRight}
            id="postcode"
            name="postcode"
            aria-label="Confirm your zip code"
            title="Confirm your zip code"
          />
        </div>

        <input
          type={"text"}
          placeholder={"Delivery Instructions"}
          className={styles.input}
          value={deliveryInput.instructions}
          onChange={(e) => {
            setDeliveryInput({
              ...deliveryInput,
              instructions: e.target.value
            });
          }}
          aria-label="Confirm your delivery instructions"
          title="Confirm your delivery instructions"
        />

        <div className={styles.googleMap} id="map" />

        <div style={{ textAlign: "center" }}>
          <button
            className={styles.orangeBtn}
            // disabled={!this.state.subscriptionsLoaded}
            onClick={() => {
              saveDeliveryDetails()
              console.log("(SDD) CALL calculateBilling here");

              console.log("(change) plan before: ", newPlan);
              console.log("(change) new data -- deliveryInput: ", deliveryInput);
            }}
            aria-label="Click to save delivery changes"
            title="Click to save delivery changes"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  const showPaymentSummary = () => {
    return (
      <div
        style={
          dimensions.width < 800
            ? {
                display: "inline-block",
                marginLeft: "8%",
                width: "84%",
                marginRight: "8%"
              }
            : {
                display: "inline-block",
                marginLeft: "2%",
                width: "40%",
                marginRight: "8%"
              }
        }
      >
        <div style={{ display: "flex", borderBottom: "solid 2px black" }}>
          <div
            className={styles.summaryLeft}
            style={{ fontWeight: "bold" }}
          ></div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            {newPlan.meals} Meals,{" "}
            {newPlan.deliveries} Deliveries
          </div>

          <div className={styles.summaryRight}>Current</div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            Difference
          </div>
        </div>
        <div style={{ display: "flex", borderBottom: "1px solid" }}>
          <div className={styles.summaryLeft}>Meal Subscription</div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            {/* {console.log("error newPlan: ", newPlan)} */}
            ${newPlan.billing.base_amount}
          </div>

          <div className={styles.summaryRight}>
            ${newPlan.billing.base_amount}
          </div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            $
            {Math.abs(billingDifference.base_amount).toFixed(
              2
            )}
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid" }}>
          <div className={styles.summaryLeft}>Discount</div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            {"-$" +
              newPlan.billing.discount_amount}
            <br />
            {"(" +
              newPlan.billing.discount_rate +
              "%)"}
          </div>

          <div className={styles.summaryRight}>
            {"-$" +
              currentPlan.billing.discount_amount}
            <br />
            {"(" +
              currentPlan.billing.discount_rate +
              "%)"}
          </div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            {"$" +
              Math.abs(
                billingDifference.discount_amount
              ).toFixed(2)}
            <br />
            {"(" +
              Math.abs(billingDifference.discount_rate) +
              "%)"}
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid" }}>
          <div className={styles.summaryLeft}>Delivery Fee</div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            ${newPlan.billing.delivery_fee}
          </div>

          <div className={styles.summaryRight}>
            ${newPlan.billing.delivery_fee}
          </div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            $
            {Math.abs(billingDifference.delivery_fee).toFixed(
              2
            )}
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid" }}>
          <div className={styles.summaryLeft}>Service Fee</div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            ${newPlan.billing.service_fee}
          </div>

          <div className={styles.summaryRight}>
            ${newPlan.billing.service_fee}
          </div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            $
            {Math.abs(billingDifference.service_fee).toFixed(
              2
            )}
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid" }}>
          <div className={styles.summaryLeft}>Taxes</div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            ${newPlan.billing.taxes}
          </div>

          <div className={styles.summaryRight}>
            ${currentPlan.billing.taxes}
          </div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            ${Math.abs(billingDifference.taxes).toFixed(2)}
          </div>
        </div>

        <div style={{ display: "flex" }}>
          <div className={styles.summaryLeft}>Chef and Driver Tip</div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            ${newPlan.billing.driver_tip}
          </div>

          <div className={styles.summaryRight}>
            ${currentPlan.billing.driver_tip}
          </div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            $
            {Math.abs(billingDifference.driver_tip).toFixed(2)}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <button
            className={tipAmount === '0.00' 
              ? (styles.tipButtonSelected)
              : (styles.tipButton)
            }
            onClick={() => {
              selectTip("0.00", TRIGGER_RECALCULATION);
              console.log("(tip $0.00) CALL calculateBilling here");

              console.log("(change) plan before: ", newPlan);
              console.log("(change) new data -- tip: $0.00");
            }}
            aria-label={
              "Current tip is: $" +
              newPlan.billing.driver_tip
            }
            title={
              "Current tip is: $" +
              newPlan.billing.driver_tip
            }
          >
            No Tip
          </button>
          <button
            className={tipAmount === '2.00' 
              ? (styles.tipButtonSelected)
              : (styles.tipButton)
            }
            onClick={() => {
              selectTip("2.00", TRIGGER_RECALCULATION);
              console.log("(tip $2.00) CALL calculateBilling here");

              console.log("(change) plan before: ", newPlan);
              console.log("(change) new data -- tip: $2.00");
            }}
            aria-label={
              "Current tip is: $" +
              newPlan.billing.driver_tip
            }
            title={
              "Current tip is: $" +
              newPlan.billing.driver_tip
            }
          >
            $2
          </button>
          <button
            className={tipAmount === '3.00' 
              ? (styles.tipButtonSelected)
              : (styles.tipButton)
            }
            onClick={() => {
              selectTip("3.00", TRIGGER_RECALCULATION);
              console.log("(tip $3.00) CALL calculateBilling here");

              console.log("(change) plan before: ", newPlan);
              console.log("(change) new data -- tip: $3.00");
            }}
            aria-label={
              "Current tip is: $" +
              newPlan.billing.driver_tip
            }
            title={
              "Current tip is: $" +
              newPlan.billing.driver_tip
            }
          >
            $3
          </button>
          <button
            className={tipAmount === '5.00' 
              ? (styles.tipButtonSelected)
              : (styles.tipButton)
            }
            onClick={() => {
              selectTip("5.00", TRIGGER_RECALCULATION);
              console.log("(tip $5.00) CALL calculateBilling here");

              console.log("(change) plan before: ", newPlan);
              console.log("(change) new data -- tip: $5.00");
            }}
            aria-label={
              "Current tip is: $" +
              newPlan.billing.driver_tip
            }
            title={
              "Current tip is: $" +
              newPlan.billing.driver_tip
            }
          >
            $5
          </button>
        </div>

        <div 
          style={{ 
            display: "flex", 
            borderBottom: "1px solid" 
            // border: '1px solid blue'
          }}
        >

          {/* <input
            type="text"
            placeholder="Enter Ambassador Code"
            className={styles.inputAmbassador}
            onChange={(e) => {
              // this.setState({
              //   ambassadorCode: e.target.value,
              // });
            }}
            aria-label="Enter your ambassador code here"
            title="Enter your ambassador code here"
          />
          <button
            className={styles.codeButton}
            // disabled={
            //   this.state.refreshingPrice ||
            //   parseFloat(this.state.currentPlan.payment_summary.ambassador_discount) > 0 ||
            //   parseFloat(this.state.updatedPlan.payment_summary.ambassador_discount) > 0
            // }
            // disabled={this.state.refreshingPrice}
            // onClick={() => this.applyAmbassadorCode()}
            aria-label="Click here to verify your ambassador code"
            title="Click here to verify your ambassador code"
          >
            Verify
          </button> */}

          <div
            style={{
              marginTop: '20px',
              width: '42%',
              display: 'flex',
              textAlign: 'left'
            }}
          >
            Ambassador Discount
          </div>
          <div
            className={
              activeChanges()
                ? styles.summarySubLeft
                : styles.summarySubLeftGray
            }
          >
            -${newPlan.billing.ambassador_discount}
          </div>

          <div className={styles.summarySubtotal}>
            -${currentPlan.billing.ambassador_discount}
          </div>

          <div
            className={
              activeChanges()
                ? styles.summarySubtotal
                : styles.summarySubGray
            }
          >
            ${billingDifference.ambassador_discount}
          </div>
        </div>

        <div style={{ display: "flex", marginBottom: "50px" }}>
          <div className={styles.summaryLeft}>Total</div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            ${newPlan.billing.total}
          </div>

          <div className={styles.summaryRight}>
            ${currentPlan.billing.total}
          </div>

          <div
            className={
              activeChanges()
                ? styles.summaryRight
                : styles.summaryGray
            }
          >
            ${billingDifference.total}
          </div>
        </div>

        {/* <div className={styles.checkboxContainer}>
          <label className={styles.checkboxLabel}>
            Use Previous Credit Card
          </label>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={this.state.usePreviousCard}
            onChange={this.handleCheck}
          />
        </div> */}

        {/* { this.state.usePreviousCard ? null : this.showCardForm()} */}

        <button
          className={styles.orangeBtn2}
          // disabled={
          //   (!this.state.subscriptionsLoaded &&
          //     this.state.defaultSet === false) ||
          //   this.state.refreshingPrice === true ||
          //   !this.activeChanges() ||
          //   this.state.processingChanges
          // }
          // onClick={() => this.confirmChanges()}
          aria-label={
            "Your new plan will cost " +
            newPlan.billing.total +
            ". Click here to save your new delivery plan"
          }
          title={
            "Your new plan will cost " +
            newPlan.billing.total +
            ". Click here to save your new delivery plan"
          }
        >
          Update Meal Plan
        </button>

        <button
          className={styles.orangeBtn3}
          // disabled={
          //   (!this.state.subscriptionsLoaded &&
          //     this.state.defaultSet === false) ||
          //   this.state.refreshingPrice === true ||
          //   !this.activeChanges() ||
          //   this.state.processingChanges
          // }
          // onClick={() => this.discardChanges()}
          aria-label={
            "Your new plan will cost " +
            newPlan.billing.total +
            ". Click here to keep your previous meal plan"
          }
          title={
            "Your new plan will cost " +
            newPlan.billing.total +
            ". Click here to keep your previous meal plan"
          }
        >
          Keep Existing Meal Plan
        </button>
    </div>
    );
  }

  const itemize = (n_meals, n_deliveries) => {
    console.log("(itemize) plans: ", plans);
    console.log("(itemize) plans[n_meals]: ", plans[n_meals]);
    let planData = plans[n_meals][n_deliveries];
    console.log("(itemize) planData: ", planData);
    let newItems = [
      {
        item_uid: planData.item_uid,
        itm_business_uid: planData.itm_business_uid,
        name: planData.item_name,
        price: planData.item_price.toString(),
        qty: planData.num_deliveries.toString()
      }
    ];
    return newItems;
  }

  const calculateBilling = (newData) => {
    console.log("(CB) start");
    // setRecalculating(true);

    console.log("(CB) plans: ", plans);
    // console.log("(CB) plans (string): ", JSON.stringify(plans));

    // Get discount
    console.log("(CB) numMealsSelected: ", numMealsSelected, typeof(numMealsSelected));
    console.log("(CB) numDeliveriesSelected: ", numDeliveriesSelected, typeof(numDeliveriesSelected));
    let subDiscount = getDeliveryDiscount(numDeliveriesSelected);
    console.log("(CB) subDiscount: ", subDiscount);

    let updatedNewPlan = {...newPlan};

    console.log("\n(CB) newPlan before change: ", newPlan);
    console.log("(CB) newData: ", newData);

    // let newItems = plans[numMealsSelected][numDeliveriesSelected];
    let itemized = itemize(numMealsSelected, numDeliveriesSelected);
    // console.log("(CB) newItems: ", newItems);
    let object = {
      items: itemized,
      customer_lat: newPlan.delivery_details.delivery_latitude,
      customer_long: newPlan.delivery_details.delivery_longitude,
      driver_tip: newPlan.billing.driver_tip
    };

    if(newData.hasOwnProperty('tip')) {
      console.log("(CB) calculating with new tip...");
      object.driver_tip = newData.tip;
    }

    console.log("(CB) object for make_purchase: ", object);
    axios
      .put(
        `http://localhost:2000/api/v2/make_purchase`, 
        object
      )
      .then((res) => {
        console.log("(make_purchase) res: ", res);

        let recalculated_plan = {
          ...newPlan,
          billing: {
            base_amount: res.data.new_meal_charge.toFixed(2),
            taxes: res.data.new_tax.toFixed(2),
            delivery_fee: res.data.delivery_fee.toFixed(2),
            service_fee: res.data.service_fee.toFixed(2),
            driver_tip: res.data.new_driver_tip.toFixed(2),
            discount_amount: res.data.new_discount.toFixed(2),
            discount_rate: subDiscount,
            ambassador_discount: res.data.ambassador_discount.toFixed(2),
            subtotal: (res.data.amount_should_charge + res.data.ambassador_discount).toFixed(2),
            total: res.data.amount_should_charge.toFixed(2),
          },
          items: itemized,
          meals: numMealsSelected,
          deliveries: numDeliveriesSelected,
          discount: subDiscount
        }

        setNewPlan(recalculated_plan);

        console.log("\n");
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  }

  return (
    <>
      {/* For debugging window size */}
      <span 
        style={{
          zIndex: '101',
          position: 'fixed',
          backgroundColor: 'white',
          border: 'solid',
          borderWidth: '1px',
          borderColor: 'red',
          width: '150px'
        }}
      >
        Height: {dimensions.height}px
        <br />
        Width: {dimensions.width}px
      </span>

      <WebNavBar
        poplogin={togglePopLogin}
        popSignup={togglePopSignup}
      />

      {dataLoaded === false ? (
        <div
          style={{
            color: "red",
            zIndex: "99",
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: "0",
            backgroundColor: "#F7F4E5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={m4me_logo} />
        </div>
      ) : (null)}

      {login_seen ? (
        <PopLogin toggle={togglePopLogin} />
      ) : null}
      {signUpSeen ? (
        <Popsignup toggle={togglePopSignup} />
      ) : null}

      <div className={styles.sectionHeaderScroll}>Select Meal Plan</div>

      <div className={styles.containerSplit}>
        <div className={styles.boxScroll}>
          <div className={styles.mealButtonHeader}>
            <div className={styles.mealButtonEdit}></div>
            <div
              className={styles.mealButtonPlan}
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Meal Plans
            </div>
            <div
              className={styles.mealButtonSection}
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Purchase ID
            </div>
            <div
              className={styles.mealButtonSection}
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Next Delivery Date
            </div>
            <div
              className={styles.mealButtonSection}
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Next Delivery Status
            </div>
            <div
              className={styles.mealButtonSection}
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Next Billing Date
            </div>
            <div
              className={styles.mealButtonSection}
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Next Billing Amount
            </div>
          </div>
          <div style={{ display: "flex" }}>
            {dataLoaded ? (showSubscribedMeals()) : (null)}
          </div>
        </div>
      </div>

      <div className={styles.sectionHeaderUL}>Edit Plan</div>
      <div className={styles.containerSplit}>
        {showPlanDetails(dimensions.width)}
      </div>

      {dimensions.width < 800 ? (
        <>
          <div className={styles.sectionHeader}>Edit Delivery Details</div>
        </>
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <div className={styles.sectionHeaderLeft}>
              Edit Delivery Details
            </div>
            <div className={styles.sectionHeaderRight}>Payment Summary</div>
          </div>
        </>
      )}

      <div className={styles.containerSplit}>
        <div style={dimensions.width < 800
          ? {display: "inline-block", width: "100%"}
          : {display: "inline-flex", width: "100%"}}
        >
          {showDeliveryDetails()}

          {dimensions.width < 800 ? (
            <>
              <div style={{ marginTop: "20px" }} />
              <div className={styles.sectionHeader}>Payment Summary</div>
            </>
          ) : null}

          {showPaymentSummary()}
        </div>
      </div>

      <FootLink />
    </>
  );
}

EditPlan.propTypes = {
  fetchPlans: PropTypes.func.isRequired,
  fetchSubscribed: PropTypes.func.isRequired,
  chooseMealsDelivery: PropTypes.func.isRequired,
  choosePaymentOption: PropTypes.func.isRequired,
  meals: PropTypes.string.isRequired,
  paymentOption: PropTypes.string.isRequired,
  selectedPlan: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  plans: state.subscribe.plans,
  subscribedPlans: state.subscribe.subscribedPlans,
  meals: state.subscribe.meals,
  paymentOption: state.subscribe.paymentOption,
  selectedPlan: state.subscribe.selectedPlan,
  customerId: state.subscribe.profile.customerId,
  email: state.subscribe.profile.email,
});

export default connect(mapStateToProps, {
  fetchPlans,
  fetchSubscribed,
  chooseMealsDelivery,
  choosePaymentOption,
  fetchProfileInformation,
})(withRouter(EditPlan));
