import { useState, useEffect } from 'react';
import { useHistory } from "react-router";
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
  const history = useHistory();

  const [prevState, setPrevState] = useState({
    currentPlan: null,
    numDeliveriesSelected: null,
    numMealsSelected: null,
    tipAmount: null,
    ambassadorCoupon: null
  });

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
      delivery_unit: "",
      delivery_zip: ""
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
      delivery_unit: "",
      delivery_zip: ""
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
  const [ambassadorCode, setAmbassadorCode] = useState('');
  const [ambassadorCoupon, setAmbassadorCoupon] = useState(null);

  const applyAmbassadorCode = () => {
    setRecalculating(true);
    // axios
    //   .post(API_URL + "brandAmbassador/discount_checker", {
      let itemized = itemize(numMealsSelected, numDeliveriesSelected);
    axios
      .post('http://localhost:2000/api/v2/brandAmbassador/discount_checker', {
        code: ambassadorCode,
        info: profileInfo.customer_email,
        IsGuest: "False",
        purchase_data: {
          items: itemized,
          customer_lat: latitude,
          customer_long: longitude,
          driver_tip: tipAmount
        }
      })
      .then((res) => {
        console.log("(CUST) ambassador code response: ", res);

        if (res.data.code !== 200) {
          console.log("(CUST) Invalid code");

          // displayErrorModal(
          //   "Hmm...",
          //   res.data.message,
          //   "Go Back",
          //   "back"
          // );

        } else {
          console.log("(CUST) Valid code");

          console.log("(CUST) ambassador code response 2: ", res.data.new_billing);

          console.log("(before CB) 1");
          // calculateBilling({
          //   amb_coupon: res.data.sub
          // });
          setAmbassadorCoupon(res.data.sub);

        }

      })
      .catch((err) => {
        console.log("Ambassador code error: ", err);
      });
  }

  // Calculate values for difference column of payment summary.
  // Call whenever current or updated plan are changed.
  const calculateDifference = () => {
    setBillingDifference({
        base_amount: (
          parseFloat(newPlan.billing.base_amount) -
          parseFloat(currentPlan.billing.base_amount)
        ).toFixed(2),
        taxes: (
          parseFloat(newPlan.billing.taxes) -
          parseFloat(currentPlan.billing.taxes)
        ).toFixed(2),
        delivery_fee: (
          parseFloat(newPlan.billing.delivery_fee) -
          parseFloat(currentPlan.billing.delivery_fee)
        ).toFixed(2),
        service_fee: (
          parseFloat(newPlan.billing.service_fee) -
          parseFloat(currentPlan.billing.service_fee)
        ).toFixed(2),
        driver_tip: (
          parseFloat(newPlan.billing.driver_tip) -
          parseFloat(currentPlan.billing.driver_tip)
        ).toFixed(2),
        discount_amount: (
          parseFloat(newPlan.billing.discount_amount) -
          parseFloat(currentPlan.billing.discount_amount)
        ).toFixed(2),
        discount_rate:
          newPlan.billing.discount_rate -
          currentPlan.billing.discount_rate,
        ambassador_discount: (
          parseFloat(
            newPlan.billing.ambassador_discount
          ) -
          parseFloat(currentPlan.billing.ambassador_discount)
        ).toFixed(2),
        subtotal: (
          parseFloat(newPlan.billing.subtotal) -
          parseFloat(currentPlan.billing.subtotal)
        ).toFixed(2),
        total: (
          parseFloat(newPlan.billing.total) -
          parseFloat(currentPlan.billing.total)
        ).toFixed(2),
    });
  };

  const [dataFetched, setDataFetched] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [plans, setPlans] = useState(null);
  const [deliveryDiscounts, setDeliveryDiscounts] = useState(null);
  const [pnbd_data, set_pnbd_data] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const [profileEmail, setProfileEmail] = useState('');

  const [recalculating, setRecalculating] = useState(true);
  const [recalculatingBilling, setRecalculatingBilling] = useState(false);

  // const [tipSelected, selectTip] = useState('2.00');
  // const [trigger_recalc_by_tip, set_trigger_recalc_by_tip] = useState()
  // const [tipAmount, setTipAmount] = useState(null);
  const [tipAmount, selectTip] = useState(null);
  const [numMealsSelected, selectNumMeals] = useState(null);
  const [numDeliveriesSelected, selectNumDeliveries] = useState(null);

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

  // // State for pop up modal
  // const [showErrorModal, setShowErrorModal] = useState(false);
  // const [errorModal, setErrorModal] = useState(null);
  // const [errorHeader, setErrorHeader] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  // const [errorLink, setErrorLink] = useState('');
  // const [errorLinkText, setErrorLinkText] = useState('');
  // const [showConfirmModal, setShowConfirmModal] = useState(false);
  // const [confirmModal, setConfirmModal] = useState(null);
  // const [deletingPurchase, setDeletingPurchase] = useState(false);
  // const [deleteSuccess, setDeleteSuccess] = useState(null);
  // const [refundAmount, setRefundAmount] = useState(0);
  // const [refundError, setRefundError] = useState("Error attempting to refund subscription");

  // // Display pop up message
  // const displayErrorModal = (header, message, linkText, link) => {
  //   if (showErrorModal === false) {
  //     setErrorModal(styles.errorModalPopUpShow);
  //     setShowErrorModal(true);
  //     setErrorMessage(message);
  //     setErrorLinkText(linkText);
  //     setErrorLink(link);
  //     setErrorHeader(header);
  //     console.log("\nerror pop up toggled to true");
  //   } else {
  //     setErrorModal(styles.errorModalPopUpHide);
  //     setShowErrorModal(false);
  //     console.log("\nerror pop up toggled to false");
  //   }
  // };

  // const displayPopUp = () => {
  //   if (showErrorModal === true) {
  //     return (
  //       <div className={errorModal}>
  //         <div className={styles.errorModalContainer}>
  //           <div className={styles.errorContainer}>
  //             <div className={styles.errorHeader}>
  //               {errorHeader}
  //             </div>

  //             <div className={styles.errorText}>
  //               {errorMessage}
  //             </div>

  //             <br />

  //             <button
  //               className={styles.chargeBtn}
  //               onClick={() => {
  //                 if (errorLink === "back") {
  //                   displayErrorModal();
  //                 } else {
  //                   history.push(errorLink);
  //                 }
  //               }}
  //             >
  //               {errorLinkText}
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (showConfirmModal === true) {
  //     return (
  //       <div className={styles.errorModalPopUpShow}>
  //         <div className={styles.confirmModalContainer}>
  //           <div className={styles.confirmContainer}>
  //             <div className={styles.confirmHeader}>
  //               Confirm Cancellation
  //             </div>

  //             <div className={styles.errorText}>
  //               Are you sure you want to delete
  //               <br />
  //               the following meal plan:
  //               <br />
  //               <strong>
  //                 {" " + this.state.currentPlan.meals} meals,
  //                 {" " + this.state.currentPlan.deliveries} deliveries
  //                 (ID: {this.state.currentPlan.id})
  //               </strong>
  //               ?
  //             </div>

  //             <br />

  //             <div
  //               style={{
  //                 // border: 'solid',
  //                 display: "flex",
  //                 justifyContent: "center",
  //               }}
  //             >
  //               <button
  //                 className={styles.confirmBtn}
  //                 onClick={() => {
  //                   console.log("deleting purchase...");
  //                   this.setState(
  //                     {
  //                       deletingPurchase: true,
  //                       showConfirmModal: false,
  //                       // confirmModal: styles.errorModalPopUpHide
  //                     },
  //                     () => {
  //                       this.deletePurchase();
  //                     }
  //                   );
  //                 }}
  //               >
  //                 Yes
  //               </button>

  //               <button
  //                 className={styles.confirmBtn}
  //                 onClick={() => {
  //                   this.displayConfirmation();
  //                 }}
  //               >
  //                 No
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (deletingPurchase === true) {
  //     return (
  //       <div className={styles.errorModalPopUpShow}>
  //         <div className={styles.confirmModalContainer}>
  //           <div className={styles.deletingContainer}>
  //             <div className={styles.deletingHeader}>
  //               Deleting Purchase
  //             </div>

  //             <div className={styles.errorText}>Please wait...</div>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (deleteSuccess === true) {
  //     return (
  //       <div className={styles.errorModalPopUpShow}>
  //         <div className={styles.confirmModalContainer}>
  //           <div className={styles.confirmContainer}>
  //             <div className={styles.cancelledHeader}>
  //               Cancellation Success!
  //             </div>

  //             <div className={styles.errorText}>
  //               You have been refunded ${this.state.refundAmount}.
  //             </div>

  //             <button
  //               className={styles.cancelledBtn}
  //               onClick={() => {
  //                 this.setState({
  //                   deleteSuccess: null,
  //                   confirmModal: styles.errorModalPopUpHide,
  //                 });
  //               }}
  //             >
  //               OK
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   } else if (deleteSuccess === false) {
  //     return (
  //       <div className={styles.errorModalPopUpShow}>
  //         <div className={styles.confirmModalContainer}>
  //           <div className={styles.confirmContainer}>
  //             <div className={styles.cancelledHeader}>
  //               Cancellation Error
  //             </div>

  //             <div className={styles.errorText}>
  //               {refundError}
  //             </div>

  //             <button
  //               className={styles.cancelledBtn}
  //               onClick={() => {
  //                 this.setState({
  //                   deleteSuccess: null,
  //                   confirmModal: styles.errorModalPopUpHide,
  //                 });
  //               }}
  //             >
  //               OK
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }
  // }

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

    if (
      document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("customer_uid="))
    ) {

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

          if(res.data.result.length === 0) {
            // displayErrorModal(
            //   "Hmm...",
            //   `
            //     Please purchase a subscription. Once you have a subscription, you can manage it from here.
            //   `,
            //   "Choose a Plan",
            //   "/choose-plan"
            // );
          } else {
            fetched++;
          }

          // check if all remote data fetched
          // fetched++;
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

    } else {
      // this.displayErrorModal(
      //   "Hmm...",
      //   `
      //     Please log in to edit your meals.
      //   `,
      //   "Go Home",
      //   "/home"
      // );
    }
    
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
        // console.log("(UE2) subDiscount: ", subDiscount);

        let parsedUid = sub.purchase_uid.substring(
          sub.purchase_id.indexOf("-") + 1,
          sub.purchase_id.length
        );

        let parsedItems = JSON.parse(sub.items)[0];
        let parsedMeals = parsedItems.name.substring(
          0,
          parsedItems.name.indexOf(" ")
        );
        // console.log("(UE2) parsedMeals: ", parsedMeals);
        // console.log("(UE2) name: ", parsedItems.name);

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
            delivery_unit: sub.delivery_unit,
            delivery_zip: sub.delivery_zip
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

        if(index === 39){
          // selectNumMeals(parsedSub.meals);
          // selectNumDeliveries(parsedSub.deliveries);

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

              // set default plans
              console.log("\n(UE2) setting default plans: ", parsedSub, "\n");
              setCurrentPlan(parsedSub);
              // console.log("(0915) setNewPlan 1");
              // setNewPlan(parsedSub);
            }
          );
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

  // useEffect(() => {
  //   console.log("(UE newPlan) newPlan: ", newPlan);
  //   selectNumMeals(newPlan.meals);
  //   selectNumDeliveries(newPlan.deliveries);
  //   calculateDifference();
  //   // console.log("done recalculating 1");
  //   if(dataLoaded) {
  //     // console.log("set recalculating false 1");
  //     setRecalculating(false);
  //   }
  // }, [newPlan]);
  // useEffect(() => {
  //   console.log("(UE newPlan) newPlan: ", newPlan);
  //   selectNumMeals(newPlan.meals);
  //   selectNumDeliveries(newPlan.deliveries);
  //   // calculateDifference();
  //   // console.log("done recalculating 1");
  //   if(dataLoaded) {
  //     // console.log("set recalculating false 1");
  //     setRecalculating(false);
  //   }
  // }, [newPlan.purchase_uid]);
  // useEffect(() => {
  //   if(dataLoaded) {
  //     calculateBilling({});
  //     calculateDifference();
  //   }
  // }, [newPlan])
  useEffect(() => {
    console.log(" ");
    console.log("=========================| START |=========================");
    console.log("(UE4) currentPlan: ", currentPlan);
    console.log("(UE4) numMealsSelected: ", numMealsSelected);
    console.log("(UE4) numDeliveriesSelected: ", numDeliveriesSelected);
    console.log("(UE4) tipAmount: ", tipAmount);
    console.log(" ");
    console.log("(UE4) prevState: ", prevState);

    // values that will be passed to make_purchase for calculation
    let mp_currentPlan = prevState.currentPlan;
    let mp_numMealsSelected = prevState.numMealsSelected;
    let mp_numDeliveriesSelected = prevState.numDeliveriesSelected;
    let mp_tipAmount = prevState.tipAmount;
    let mp_ambassadorCoupon = prevState.ambassadorCoupon;

    // default everything to current plan if it was selected/changed
    if(currentPlan.purchase_uid !== null && currentPlan !== prevState.currentPlan){
      console.log("(UE 4 -- currentPlan) setting defaults...");
      selectNumDeliveries(currentPlan.deliveries);
      selectNumMeals(currentPlan.meals);
      selectTip(currentPlan.rawData.driver_tip);
      // mp_numMealsSelected = currentPlan.meals;
      // mp_numDeliveriesSelected = currentPlan.deliveries;
      // mp_tipAmount = currentPlan.rawData.driver_tip;
    } else {
      console.log("(UE 4) about to run calculations...");

      if (numMealsSelected !== prevState.numMealsSelected) {
        console.log("(UE 4 -- 1) NMS");
        mp_numMealsSelected = numMealsSelected;
      }
      if (numDeliveriesSelected !== prevState.numDeliveriesSelected) {
        console.log("(UE 4 -- 2) NDS");
        mp_numDeliveriesSelected = numDeliveriesSelected;
      }
      if (tipAmount !== prevState.tipAmount) {
        console.log("(UE 4 -- 3) TA");
        mp_tipAmount = tipAmount;
      }
      if (ambassadorCoupon !== prevState.ambassadorCoupon) {
        console.log("(UE 4 -- 4) AC");
        mp_ambassadorCoupon = ambassadorCoupon;
      }

      if(
        currentPlan.purchase_uid !== null &&
        mp_numMealsSelected !== null &&
        mp_numDeliveriesSelected !== null &&
        mp_tipAmount !== null &&
        latitude !== null &&
        longitude !== null
      ){
        setRecalculatingBilling(true);
        calculateBilling(
          currentPlan, 
          numMealsSelected, 
          numDeliveriesSelected, 
          tipAmount, 
          ambassadorCode, 
          latitude, 
          longitude
        );
      }

    }

    setPrevState({
      currentPlan,
      numMealsSelected,
      numDeliveriesSelected,
      tipAmount,
      ambassadorCoupon
    });

    console.log("=========================|  END  |=========================");
    console.log(" ");
  }, [currentPlan, numMealsSelected, numDeliveriesSelected, tipAmount, ambassadorCode, latitude, longitude]);

  // runs anytime an existing subscription is selected to edit
  useEffect(() => {
    console.log("(UE currentPlan) currentPlan: ", currentPlan);
    if(dataLoaded) {
      // console.log("set recalculating true 1");
      setRecalculating(true);
      // console.log("(UE currentPlan) currentPlan: ", currentPlan);

      // console.log("(UE currentPlan) numMealsSelected: ", typeof numMealsSelected);
      // console.log("(UE currentPlan) numDeliveriesSelected: ", typeof numDeliveriesSelected);
      // console.log("(UE currentPlan) currentPlan.meals: ", typeof currentPlan.meals);
      // console.log("(UE currentPlan) currentPlan.deliveries: ", typeof currentPlan.deliveries);
      // selectNumMeals(currentPlan.meals);
      // selectNumDeliveries(currentPlan.deliveries);

      // selectTip(currentPlan.billing.driver_tip);

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
          // console.log("(fetchAddressCoordinates) Fetched coordinates: ", coords);

          setLatitude(coords.latitude);
          setLongitude(coords.longitude);

          const temp_position = {
            lat: parseFloat(coords.latitude),
            lng: parseFloat(coords.longitude),
          };

          // console.log("(fetchAddressCoordinates) temp_position: ", temp_position);

          map.setCenter(temp_position);

          // console.log("(fetchAddressCoordinates) after center");

          if (coords.latitude !== "") {
            map.setZoom(17);
            new google.maps.Marker({
              position: temp_position,
              map,
            });
          }
          // console.log("done recalculating 2");
          // console.log("set recalculating false 2");
          setRecalculating(false);
        }
      );

      // default to current plan since no edits have been made yet
      // console.log("(0915) setNewPlan 2");
      // setNewPlan(currentPlan);
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
          // console.log("(RS) sub: ", sub);

          let subDiscount = getDeliveryDiscount(sub.num_deliveries);
          // console.log("(RS) subDiscount: ", subDiscount);

          let parsedUid = sub.purchase_uid.substring(
            sub.purchase_id.indexOf("-") + 1,
            sub.purchase_id.length
          );

          let parsedItems = JSON.parse(sub.items)[0];
          let parsedMeals = parsedItems.name.substring(
            0,
            parsedItems.name.indexOf(" ")
          );
          // console.log("(RS) parsedMeals: ", parsedMeals);
          // console.log("(RS) name: ", parsedItems.name);

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
              delivery_unit: sub.delivery_unit,
              delivery_zip: sub.delivery_zip
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
            next_billing_amount: sub.amount_due.toFixed(2),
            rawData: sub
          }

          if(index === 0){
            // selectNumMeals(parsedSub.meals);
            // selectNumDeliveries(parsedSub.deliveries);

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
            // console.log("(0915) setNewPlan 3");
            // setNewPlan(parsedSub);
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

  // const selectTip = (tip_amount, recalculate_billing) => {
  //   console.log("set recalculating true 2");
  //   setRecalculating(true);
  //   if(recalculate_billing === true){
  //     console.log("(before CB) 2");
  //     calculateBilling({
  //       tip: tip_amount
  //     });
  //   }
  //   setTipAmount(tip_amount);
  // }

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
      purchase_uid: currentPlan.rawData.purchase_uid,
      phone: object.phone,
      address,
      unit: object.unit,
      city,
      state,
      zip,
      email: profileInfo.customer_email,
    };
    // console.log("(SDD) post_object: ", post_object);
    // console.log("(SDD) currentPlan: ", currentPlan);

    axios
      .post(API_URL + "Update_Delivery_Info_Address", post_object)
      .then((res) => {
        // console.log("(SDD) update delivery info res: ", res);

        refreshSubscriptions();
      })
      .catch((err) => {
        console.log("error happened while updating delivery info", err);
        if (err.response) {
          console.log("err.response: " + JSON.stringify(err.response));
        }
      });
  }

  // // recalculate billing on meals/deliveries change
  // useEffect(() => {
  //   console.log("(nds) recalculate billing on meals/deliveries change 1");
  //   if(dataLoaded){
  //     // console.log("(nds) recalculate billing on meals/deliveries change 2");
  //     console.log("(before CB) 3");
  //     calculateBilling({});
  //   }
  // }, [numDeliveriesSelected]);
  // useEffect(() => {
  //   console.log("(nms) recalculate billing on meals/deliveries change 1");
  //   if(dataLoaded){
  //     // console.log("(nms) recalculate billing on meals/deliveries change 2");
  //     console.log("(before CB) 4");
  //     calculateBilling({});
  //   }
  // }, [numMealsSelected]);

  // Used to render menu at top showing all current meals plans
  const showSubscribedMeals = () => {
    let deselectedMealButton = styles.mealButton;
    let selectedMealButton = styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];

    // console.log("(SSM) dataLoaded: ", dataLoaded);
    // console.log("(SSM) subscriptions: ", subscriptions);
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
            // console.log("(SSM) setting currentPlan: ", sub);
            setCurrentPlan(sub);
            // console.log("(0915) setNewPlan 4");
            // setNewPlan(sub); 
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

  const showMealsButtons = () => {
    let deselectedPlateButton = styles_admin.plateButton;
    // let selectedPlateButton =
    //   styles_admin.plateButton + " " + styles_admin.plateButtonSelected;
    let selectedPlateButton = styles_admin.plateButtonSelected;
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
              disabled={recalculating || recalculatingBilling}
              onClick={() => {
                if(numMealsSelected !== mealIndex) {
                  // console.log("set recalculating true 3");
                  setRecalculating(true);
                  // console.log("(MD) CALL calculateBilling here");

                  // console.log("(change) plan before: ", newPlan);
                  // console.log("(change) new data -- mealIndex: ", mealIndex);

                  selectNumMeals(mealIndex);
                }
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

  const showDeliveryButtons = () => {
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
            className={
              numDeliveriesSelected === deliveryIndex
                ? selectedPaymentOption
                : deselectedPaymentOption
            }
            disabled={recalculating || recalculatingBilling}
            onClick={() => {
              if(numDeliveriesSelected !== deliveryIndex){
                // console.log("set recalculating true 4");
                setRecalculating(true);
                // console.log("(PF) CALL calculateBilling here");

                // console.log("(change) plan before: ", newPlan);
                // console.log("(change) new data -- deliveryIndex: ", deliveryIndex);

                selectNumDeliveries(deliveryIndex);
              }
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
                  <button
                    className={styles.iconTrash}
                    disabled={recalculating || recalculatingBilling}
                    onClick={() => {
                      console.log("recalculating: ", recalculating);
                      setRecalculating(true);
                      // this.confirmDelete();
                      deletePurchase();
                    }}
                    tabIndex="0"
                    aria-label="Click here to cancel this meal plan"
                    title="Click here to cancel this meal plan"
                  />
                </div>
              </div>
              {/* {recalculating ? (
                <div>
                  <span className={styles_admin.subHeader2}/>
                  <div className={styles_admin.plateButtonWrapper3}/>
                </div>
              ) : (
                <div>
                  <span className={styles_admin.subHeader2}>CANCEL</span>
                  <div className={styles_admin.plateButtonWrapper3}>
                    <div
                      className={styles.iconTrash}
                      onClick={() => {
                        // this.confirmDelete();
                        deletePurchase();
                      }}
                      tabIndex="0"
                      aria-label="Click here to cancel this meal plan"
                      title="Click here to cancel this meal plan"
                    />
                  </div>
                </div>
              )} */}
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
                        {showMealsButtons()}
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
                        {dataLoaded ? (showDeliveryButtons()) : (null)}
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
                    if (recalculating) {
                      return (
                        <div className={styles_admin.chargeText}>
                          {"Calculating, Please Wait..."}
                        </div>
                      );
                    } else if (parseFloat(chargeOrRefund) >= 0) {
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
                  <button
                    className={styles.iconTrash}
                    disabled={recalculating || recalculatingBilling}
                    onClick={() => {
                      console.log("recalculating: ", recalculating);
                      setRecalculating(true);
                      // this.confirmDelete();
                      deletePurchase();
                    }}
                    tabIndex="0"
                    aria-label="Click here to cancel this meal plan"
                    title="Click here to cancel this meal plan"
                  />
                </div>
              </div>
              {/* {recalculating ? (null) : (
                <div>
                  <span className={styles_admin.subHeader2}>CANCEL</span>
                  <div className={styles_admin.plateButtonWrapper3}>
                    <div
                      className={styles.iconTrash}
                      onClick={() => {
                        // this.confirmDelete();
                        deletePurchase();
                      }}
                      tabIndex="0"
                      aria-label="Click here to cancel this meal plan"
                      title="Click here to cancel this meal plan"
                    />
                  </div>
                </div>
              )} */}
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
                      {showMealsButtons()}
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
                      {dataLoaded ? (showDeliveryButtons()) : (null)}
                    </div>
                  );
                }
              })()}
            </div>

            <div className={styles_admin.chargeContainer} tabIndex="0">
              {(() => {
                let chargeOrRefund = billingDifference.total;
                if (recalculating) {
                  return (
                    <div className={styles_admin.chargeText}>
                      {"Calculating, Please Wait..."}
                    </div>
                  );
                } else if (parseFloat(chargeOrRefund) >= 0) {
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
    let newSummary = newPlan.billing;
    let currentSummary = currentPlan.billing;
    // console.log("(activeChanges) newSummary: ", newSummary);
    // console.log("(activeChanges) currentSummary: ", currentSummary);

    if (
      newSummary.base_amount === currentSummary.base_amount &&
      newSummary.discount_amount === currentSummary.discount_amount &&
      newSummary.delivery_fee === currentSummary.delivery_fee &&
      newSummary.service_fee === currentSummary.service_fee &&
      newSummary.driver_tip === currentSummary.driver_tip &&
      newSummary.ambassador_discount === currentSummary.ambassador_discount &&
      newSummary.subtotal === currentSummary.subtotal &&
      newSummary.total === currentSummary.total &&
      newSummary.taxes === currentSummary.taxes
    ) {
      // console.log("(activeChanges) return false");
      return false;
    }
    // console.log("(activeChanges) return true");
    console.log("\n(AC) true");
    console.log("(AC) currentSummary: ", currentSummary);
    console.log("(AC) newSummary: ", newSummary, "\n");
    return true;
  };

  const discardChanges = () => {
    console.log("(DISCARD) currentPlan: ", currentPlan);

    // selectNumMeals(currentPlan.meals);
    // selectNumDeliveries(currentPlan.deliveries);
    // setTipAmount(currentPlan.billing.driver_tip);
    // console.log("(0915) setNewPlan 5");
    // setNewPlan(currentPlan);
    // calculateBilling({current_plan: currentPlan});
    selectNumDeliveries(currentPlan.deliveries);
    selectNumMeals(currentPlan.meals);
    selectTip(currentPlan.rawData.driver_tip);
    setAmbassadorCode('');
    setAmbassadorCoupon(null);

    setDeliveryInput({
      first_name: currentPlan.delivery_details.delivery_first_name,
      last_name: currentPlan.delivery_details.delivery_last_name,
      purchase_uid: currentPlan.rawData.purchase_uid,
      phone: currentPlan.delivery_details.delivery_phone_num,
      address: currentPlan.delivery_details.delivery_address,
      unit: currentPlan.delivery_details.delivery_unit,
      city: currentPlan.delivery_details.delivery_city,
      state: currentPlan.delivery_details.delivery_state,
      zip: currentPlan.delivery_details.delivery_zip,
      cc_num: "NULL",
      cc_cvv: "NULL",
      cc_zip: "NULL",
      cc_exp_date: "NULL",
      instructions: currentPlan.delivery_details.delivery_instructions,
    });

    document.getElementById("locality").value = currentPlan.delivery_details.delivery_city;
    document.getElementById("state").value = currentPlan.delivery_details.delivery_state;
    document.getElementById("pac-input").value = currentPlan.delivery_details.delivery_address;
    document.getElementById("postcode").value = currentPlan.delivery_details.delivery_zip;

  }

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
            disabled={recalculating || recalculatingBilling}
            onClick={() => {
              saveDeliveryDetails()
              // console.log("(SDD) CALL calculateBilling here");

              // console.log("(change) plan before: ", newPlan);
              // console.log("(change) new data -- deliveryInput: ", deliveryInput);
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
            ${currentPlan.billing.base_amount}
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
            ${currentPlan.billing.delivery_fee}
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
            ${currentPlan.billing.service_fee}
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
            disabled={recalculating || recalculatingBilling}
            onClick={() => {
              // selectTip("0.00", TRIGGER_RECALCULATION);
              selectTip("0.00");
              // console.log("(tip $0.00) CALL calculateBilling here");

              // console.log("(change) plan before: ", newPlan);
              // console.log("(change) new data -- tip: $0.00");
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
            disabled={recalculating || recalculatingBilling}
            onClick={() => {
              // selectTip("2.00", TRIGGER_RECALCULATION);
              selectTip("2.00");
              // console.log("(tip $2.00) CALL calculateBilling here");

              // console.log("(change) plan before: ", newPlan);
              // console.log("(change) new data -- tip: $2.00");
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
            disabled={recalculating || recalculatingBilling}
            onClick={() => {
              // selectTip("3.00", TRIGGER_RECALCULATION);
              selectTip("3.00");
              // console.log("(tip $3.00) CALL calculateBilling here");

              // console.log("(change) plan before: ", newPlan);
              // console.log("(change) new data -- tip: $3.00");
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
            disabled={recalculating || recalculatingBilling}
            onClick={() => {
              // selectTip("5.00", TRIGGER_RECALCULATION);
              selectTip("5.00");
              // console.log("(tip $5.00) CALL calculateBilling here");

              // console.log("(change) plan before: ", newPlan);
              // console.log("(change) new data -- tip: $5.00");
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

          <input
            type="text"
            placeholder="Enter Ambassador Code"
            className={styles.inputAmbassador}
            onChange={(e) => {
              setAmbassadorCode(e.target.value);
            }}
            value={ambassadorCode}
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
            disabled={recalculating || recalculatingBilling}
            onClick={() => applyAmbassadorCode()}
            aria-label="Click here to verify your ambassador code"
            title="Click here to verify your ambassador code"
          >
            Verify
          </button>

          {/* <div
            style={{
              marginTop: '20px',
              width: '42%',
              display: 'flex',
              textAlign: 'left'
            }}
          >
            Ambassador Discount
          </div> */}

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
          disabled={recalculating || recalculatingBilling || !activeChanges()}
          onClick={() => confirmChanges()}
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
          disabled={recalculating || recalculatingBilling || !activeChanges()}
          onClick={() => discardChanges()}
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
    // console.log("(itemize) plans: ", plans);
    // console.log("(itemize) plans[n_meals]: ", plans[n_meals]);
    let planData = plans[n_meals][n_deliveries];
    // console.log("(itemize) planData: ", planData);
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

  /*const calculateBilling = (newData) => {
    console.log("\n(CB) start");
    // console.log("(CB) plans: ", plans);

    // // Get discount
    // console.log("(CB) numMealsSelected: ", numMealsSelected, typeof(numMealsSelected));
    // console.log("(CB) numDeliveriesSelected: ", numDeliveriesSelected, typeof(numDeliveriesSelected));
    let subDiscount = getDeliveryDiscount(numDeliveriesSelected);
    // console.log("(CB) subDiscount: ", subDiscount);

    // let updatedNewPlan = {...newPlan};

    // console.log("\n(CB) newPlan before change: ", newPlan);
    // console.log("(CB) newData: ", newData);

    let itemized = itemize(numMealsSelected, numDeliveriesSelected);

      let object = {
        items: itemized,
        customer_lat: newPlan.delivery_details.delivery_latitude,
        customer_long: newPlan.delivery_details.delivery_longitude,
        driver_tip: newPlan.billing.driver_tip
      };

      if(newData.hasOwnProperty('tip')) {
        // console.log("(CB) calculating with new tip...");
        object.driver_tip = newData.tip;
      }

      if(newData.hasOwnProperty('amb_coupon')) {
        // console.log("(CB) calculating with new coupon...");
        object.ambassador_coupon = newData.amb_coupon;
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

          setRecalculating(false);
          console.log("(0915) setNewPlan 6");
          setNewPlan(recalculated_plan);
          console.log("(CB) end\n");
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    // }
  }*/
  const calculateBilling = (
    mp_currentPlan, 
    mp_numMealsSelected, 
    mp_numDeliveriesSelected, 
    mp_tipAmount, 
    mp_ambassadorCoupon, 
    mp_latitude, 
    mp_longitude
  ) => {
    console.log("\n(CB) 1");

    // if(mp_longitude !== null && mp_latitude !== null) {
    //   console.log("\n(CB) 2");

      let subDiscount = getDeliveryDiscount(mp_numDeliveriesSelected);

      let itemized = itemize(mp_numMealsSelected, mp_numDeliveriesSelected);

      let object = {
        items: itemized,
        customer_lat: mp_latitude,
        customer_long: mp_longitude,
        driver_tip: mp_tipAmount
      };
      if(mp_ambassadorCoupon !== null) {
        object['ambassadorCoupon'] = mp_ambassadorCoupon;
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
            ...mp_currentPlan,
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
            meals: mp_numMealsSelected,
            deliveries: mp_numDeliveriesSelected,
            discount: subDiscount
          }

          // setRecalculating(false);
          console.log("(0915) setNewPlan 6");
          setNewPlan(recalculated_plan);

          setRecalculatingBilling(false);
          console.log("(CB) end\n");
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    // }
  }

  const getCurrentDate = () => {
    const currentDate = new Date();
    let day = currentDate.getDate();
    if (day < 10) {
      day = ["0", day].join("");
    }
    let month = currentDate.getMonth() + 1;
    if (month < 10) {
      month = ["0", month].join("");
    }
    let year = currentDate.getFullYear();
    return [[year, month, day].join("-"), "00-00-00"].join(" ");
  };

  const deletePurchase = () => {
    console.log("plan to cancel: ", newPlan);

    // axios
    //   .put(`${API_URL}cancel_purchase`, {
    axios
      .put('http://localhost:2000/api/v2/cancel_purchase', {
        //purchase_uid: this.state.updatedPlan.raw_data.purchase_uid,
        //purchase_uid: this.state.updatedPlan.raw_data.purchase_uid
        purchase_uid: newPlan.rawData.purchase_uid,
      })
      .then((response) => {
        console.log("cancel_purchase response: ", response);
        // console.log(
        //   "cancel_purchase customerUid: " + profileInfo
        // );

        refreshSubscriptions();
      })
      .catch((err) => {
        console.log("refund error: ", err);
        // setDeletingPurchase(false);
        // setDeleteSuccess(false);
        // setRefundError(
        //   err.response.data.message &&
        //   typeof err.response.data.message === "string"
        //     ? err.response.data.message
        //     : "Error attempting to refund subscription"
        // );
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });

  };

  const confirmChanges = () => {
    console.log("(CC) before change_purchase: ", newPlan);

    let object = {
      cc_cvv: deliveryInput.cc_cvv,
      cc_exp_date: deliveryInput.cc_exp_date,
      cc_num: deliveryInput.cc_num,
      cc_zip: deliveryInput.cc_zip,
      customer_email: profileInfo.customer_email,
      items: newPlan.items,
      purchase_uid: newPlan.rawData.purchase_uid,
      driver_tip: newPlan.billing.driver_tip,
      customer_lat: newPlan.delivery_details.delivery_latitude,
      customer_long: newPlan.delivery_details.delivery_longitude,
      start_delivery_date: ""
    };

    console.log("(CC) change_purchase initial object: ", object);

    // give back coupon if unused
    console.log("(CC) email: ", profileInfo.customer_email);
    console.log("(CC) currentPlan: ", currentPlan);
    console.log("(CC) old amb_code (code): ", currentPlan.rawData.amb_code);
    console.log("(CC) old ambassador_code (discount): ", currentPlan.rawData.ambassador_code);
    console.log("(CC) new ambassador code: ", ambassadorCode);

    let amb_code = currentPlan.rawData.amb_code;
    let amb_discount = currentPlan.rawData.ambassador_code;
    let amb_start_date = currentPlan.rawData.start_delivery_date;

    let currentDate = getCurrentDate();
    // console.log("(CC) current date: ", currentDate);

    let isPastStartDate = currentDate > amb_start_date;
    // console.log("(CC) is ", currentDate, " past ", amb_start_date, "? ", isPastStartDate);

    // CASE 1: a coupon has been used in the old meal plan, but no deliveries
    //         have been made, so we need to give the customer back a coupon use 
    if((amb_code !== "" || amb_code !== null) && amb_discount > 0 && !isPastStartDate) {
      console.log("(CC -- 1) coupon unused, fetching coupons...");

      // STEP 1: get existing coupons
      axios
        .get(API_URL + 'coupons')
        .then((res) => {
          console.log("(CC -- 1) coupons res: ", res);

          // STEP 2: find coupon used in old meal plan
          let coupon_used = res.data.result.find((coupon) => {
            return (
              coupon.email_id === profileInfo.customer_email &&
              coupon.notes === amb_code
            );
          });

          console.log("(CC -- 1) old coupon used: ", coupon_used);

          // STEP 3: if new meal plan uses a coupon, check if customer has used coupon in past
          //          - if used, use existing coupon referral
          //          - else, pass in the coupon itself
          let coupon_use;
          if(ambassadorCode !== '') {
            console.log("(CC -- 1) using new code: ", ambassadorCode);

            if(ambassadorCode !== 'null') {
              coupon_use = res.data.result.find((coupon) => {
                return (
                  coupon.email_id === profileInfo.customer_email &&
                  coupon.notes === ambassadorCode
                );
              });
              if(typeof(coupon_use) === 'undefined'){
                coupon_use = res.data.result.find((coupon) => {
                  return (
                    coupon.coupon_id === 'Ambassador' &&
                    coupon.email_id === ambassadorCode
                  );
                });
              }
              console.log("(CC -- 1) coupon_use: ", coupon_use);
              object['ambassador_coupon'] = coupon_use;
            }
          }

          // STEP 4: reimburse the old coupon to the customer
          axios
            .put('http://localhost:2000/api/v2/reissue_coupon/' + coupon_used.coupon_uid)
            .then((res) => {
              console.log("(CC -- 1)reissue_coupon res: ", res);

              // STEP 5: change to new meal plan
              console.log("(CC -- 1) object for change_purchase: ", object);
              axios
                .put('http://localhost:2000/api/v2/change_purchase', object)
                .then((res) => {
                  console.log("(CC -- 1) change_purchase response: ", res);
                  
                  // STEP 6: confirm change and refresh page
                  // this.displayErrorModal(
                  //   "Success!",
                  //   `
                  //     OLD MEAL PLAN: ${currentPlan.meals} meals, ${currentPlan.deliveries} deliveries
                  //     NEW MEAL PLAN: ${newPlan.meals} meals, ${newPlan.deliveries} deliveries
                  //   `,
                  //   "OK",
                  //   "back"
                  // );
                  refreshSubscriptions();
                })
                .catch((err) => {
                  console.log(err);
                  if (err.response) {
                    console.log("(CC -- 1) change_purchase error: ", err.response);
                  }
                });
            })
            .catch((err) => {
              console.log("(CC -- 1) reissue_coupons error: ", err);
            });
        })
        .catch((err) => {
          console.log("coupons error: ", err);
        });

    // CASE 2: no coupon has been used in the old delivery, or a first delivery has
    //         already been made, so the customer is not eligible for reimbursement
    } else {
      console.log("(CC -- 2) fetching coupons normally...");

      // STEP 1: get existing coupons
      axios
        .get(API_URL + 'coupons')
        .then((res) => {
          console.log("(CC -- 2) coupons res: ", res);

          // STEP 3: if new meal plan uses a coupon, check if customer has used coupon in past
          //         - if used, use existing coupon referral
          //         - else, pass in the coupon itself
          let coupon_use;
          if(ambassadorCode !== 'null') {
            coupon_use = res.data.result.find((coupon) => {
              return (
                coupon.email_id === profileInfo.customer_email &&
                coupon.notes === ambassadorCode
              );
            });
            if(typeof(coupon_use) === 'undefined'){
              coupon_use = res.data.result.find((coupon) => {
                return (
                  coupon.coupon_id === 'Ambassador' &&
                  coupon.email_id === ambassadorCode
                );
              });
            }
            console.log("(CC -- 2) coupon_use: ", coupon_use);
            object['ambassador_coupon'] = coupon_use;
          }

          // STEP 4: change to new meal plan
          console.log("(CC -- 2) object for change_purchase: ", object);
          axios
            .put('http://localhost:2000/api/v2/change_purchase', object)
            .then((res) => {
              console.log("(CC -- 2) change_purchase response: ", res);
              
              // STEP 5: confirm change and refresh page
              // this.displayErrorModal(
              //   "Success!",
              //   `
              //     OLD MEAL PLAN: ${currentPlan.meals} meals, ${currentPlan.deliveries} deliveries
              //     NEW MEAL PLAN: ${newPlan.meals} meals, ${newPlan.deliveries} deliveries
              //   `,
              //   "OK",
              //   "back"
              // );
              refreshSubscriptions();
            })
            .catch((err) => {
              console.log(err);
              if (err.response) {
                console.log("(CC -- 2) change_purchase error: ", err.response);
              }
            });

        })
        .catch((err) => {
          console.log("(CC -- 2) coupons error: ", err);
        });

    }

    // confirm change purchase
    // axios
    //   // .put(API_URL + "change_purchase", object)
    //   .put('http://localhost:2000/api/v2/change_purchase', object)
    //   .then((res) => {
    //     console.log("change_purchase response: ", res);
        
    //     refreshSubscriptions();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     if (err.response) {
    //       console.log("error: ", err.response);
    //     }
    //   });
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

      {/* {popUp !== null ? (
        displayPopUp()
      ) : (
        null
      )} */}

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
