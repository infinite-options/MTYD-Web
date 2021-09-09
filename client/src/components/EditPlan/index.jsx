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

  // const [subscriptionsLoaded, setSubscriptionsLoaded] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [plans, setPlans] = useState(null);
  const [deliveryDiscounts, setDeliveryDiscounts] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
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
    axios
      .get(API_URL + "predict_next_billing_date/" + customer_uid)
      .then((res) => {
        console.log("(PNBD) res: ", res);

        setSubscriptions(res.data.result);
        // res.data.result.forEach((sub, index) => {

        //   console.log("(PNBD) sub: ", sub);
        //   // console.log("(PNBD) deliveryDiscounts: ", deliveryDiscounts);

        //   let subDiscount = deliveryDiscounts.find((element) => {
        //     return element.deliveries === sub.num_deliveries
        //   });

        //   let parsedItems = JSON.parse(sub.items)[0];
        //   let parsedMeals = parsedItems.name.substring(
        //     0,
        //     parsedItems.name.indexOf(" ")
        //   );

        //   let parsedSub = {
        //     purchase_uid: sub.purchase_uid,
        //     index,
        //     payment_summary: {
        //       base_amount: sub.subtotal.toFixed(2),
        //       taxes: sub.taxes.toFixed(2),
        //       delivery_fee: sub.delivery_fee.toFixed(2),
        //       service_fee: sub.service_fee.toFixed(2),
        //       driver_tip: sub.driver_tip.toFixed(2),
        //       discount_amount: sub.amount_discount.toFixed(2),
        //       discount_rate: subDiscount.discount,
        //       ambassador_discount: sub.ambassador_code.toFixed(2),
        //       subtotal: (sub.amount_due + sub.ambassador_code).toFixed(2),
        //       total: sub.amount_due.toFixed(2)
        //     },
        //     meals: parsedMeals,
        //     deliveries: sub.num_deliveries,
        //     order_history: null,
        //     load_order: null,
        //     discount: null,
        //     next_billing_date: null,
        //     rawData: sub
        //   }

        //   // if(){

        //   // }
        // });

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

        // setPlans(res.data.result);

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
        // dispatch({
        //   type: FETCH_PLAN_INFO,
        //   payload: {
        //     items: itemsReturn,
        //     numItems: distinctNumItems,
        //     paymentFrequency: distinctPaymentFrequency,
        //   },
        // });

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

    // let how_much = (Math.random()*1000).toFixed(2);
    // let person1 = {
    //   name: 'Thuya',
    //   age: 22,
    //   color: 'rgb(0,0,0)',
    //   should_give_money: true,
    //   should_get_money: false
    // }
    // let person2 = {
    //   name: 'Brandon',
    //   age: 23,
    //   color: undefined,
    //   should_give_money: false,
    //   should_get_money: true
    // }
    // if(person1.should_give_money && person2.should_get_money){
    //   let res = (
    //     person1.name + " should venmo " + 
    //     person2.name + " $" + how_much
    //   );
    //   setResult(res);
    // }
    
  }, []);

  // STEP 2: once all data has been fetched, load into page
  useEffect(() => {
    if(dataFetched === true){
      console.log("(UE2) plans: ", plans);

      let parsedSubs = [];

      subscriptions.forEach((sub, index) => {
        // console.log("(PNBD) sub: ", sub);
        // console.log("(PNBD) deliveryDiscounts: ", deliveryDiscounts);

        let subDiscount = deliveryDiscounts.find((element) => {
          return element.deliveries === sub.num_deliveries
        });

        let parsedUid = sub.purchase_uid.substring(
          sub.purchase_id.indexOf("-") + 1,
          sub.purchase_id.length
        );

        let parsedItems = JSON.parse(sub.items)[0];
        let parsedMeals = parsedItems.name.substring(
          0,
          parsedItems.name.indexOf(" ")
        );

        let nextBillingAmount =
          sub.subtotal +
          sub.taxes +
          sub.delivery_fee +
          sub.service_fee +
          sub.driver_tip -
          subDiscount.discount * 0.01 * sub.subtotal -
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
            discount_rate: subDiscount.discount,
            ambassador_discount: sub.ambassador_code.toFixed(2),
            subtotal: (sub.amount_due + sub.ambassador_code).toFixed(2),
            total: sub.amount_due.toFixed(2)
          },
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
          setCurrentPlan(parsedSub);
          setNewPlan(parsedSub);
        }

        parsedSubs.push(parsedSub);
      });
      // let defaultPlan = subscriptions[0];
      // console.log("(UE2) defaultPlan: ", defaultPlan);
      // console.log("(UE2) deliveryDiscounts: ", deliveryDiscounts);

      // // get discount for default plan
      // let defaultPlanDiscount = deliveryDiscounts.find((element) => {
      //   return element.deliveries === defaultPlan.num_deliveries
      // });

      // console.log("(UE2) defaultPlanDiscount: ", defaultPlanDiscount);

      // // parse items
      // let parsedItems = JSON.parse(defaultPlan.items)[0];
      // let parsedMeals = parsedItems.name.substring(
      //   0,
      //   parsedItems.name.indexOf(" ")
      // );

      // set current/default plan
      // setCurrentPlan({
      //   purchase_uid: defaultPlan.purchase_uid,
      //   payment_summary: {
      //     base_amount: defaultPlan.subtotal.toFixed(2),
      //     taxes: defaultPlan.taxes.toFixed(2),
      //     delivery_fee: defaultPlan.delivery_fee.toFixed(2),
      //     service_fee: defaultPlan.service_fee.toFixed(2),
      //     driver_tip: defaultPlan.driver_tip.toFixed(2),
      //     discount_amount: defaultPlan.amount_discount.toFixed(2),
      //     discount_rate: defaultPlanDiscount.discount,
      //     ambassador_discount: defaultPlan.ambassador_code.toFixed(2),
      //     subtotal: (defaultPlan.amount_due + defaultPlan.ambassador_code).toFixed(2),
      //     total: defaultPlan.amount_due.toFixed(2)
      //   },
      //   meals: parsedMeals,
      //   deliveries: defaultPlan.num_deliveries,
      //   order_history: null,
      //   load_order: null,
      //   discount: null,
      //   next_billing_date: null,
      //   rawData: defaultPlan
      // });

      setSubscriptions(parsedSubs);

      setDataLoaded(true);
    }
  }, [dataFetched]);

  // Used to render menu at top showing all current meals plans
  const showSubscribedMeals = () => {
    let deselectedMealButton = styles.mealButton;
    let selectedMealButton = styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];

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
            // console.log("(SSM) new current plan: ", sub);
            console.log("(SSM) current plan: ", currentPlan);
            console.log("(SSM) clicked plan: ", sub);

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
              className={
                newPlan.meals === mealIndex
                  ? selectedPlateButton
                  : deselectedPlateButton
              }
              onClick={() => {
                console.log("(MD) clicked: ", mealIndex, " ; ", mealData);
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
            className={
              newPlan.deliveries === deliveryIndex
                ? selectedPaymentOption
                : deselectedPaymentOption
            }
            onClick={() => {
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
                        {/* {"<null>"} */}
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
                        {paymentFrequency()}
                        {/* {"<null>"} */}
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
                    // let chargeOrRefund = 0.0;
                    if (parseFloat(chargeOrRefund) >= 0) {
                      return (
                        <>
                          <div className={styles_admin.chargeText}>
                            {"Additional Charges "}
                          </div>
                          <div className={styles_admin.chargeAmount}>
                            ${billingDifference.total}
                            {/* ${"<null>"} */}
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
                            {/* ${"<null>"} */}
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
                      {paymentFrequency()}
                    </div>
                  );
                }
              })()}
            </div>

            <div className={styles_admin.chargeContainer} tabIndex="0">
              {(() => {
                let chargeOrRefund = billingDifference.total;
                // let chargeOrRefund = 0.0;
                if (parseFloat(chargeOrRefund) >= 0) {
                  return (
                    <>
                      <div className={styles_admin.chargeText}>
                        {"Additional Charges "}
                      </div>
                      <div className={styles_admin.chargeAmount}>
                        ${billingDifference.total}
                        {/* ${"<null>"} */}
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
                        {/* ${"<null>"} */}
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

  // const showDeliveryDetails = () => {
  //   return (

  //   );
  // }

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
      ) : (
        <>
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
                {showSubscribedMeals()}
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
                    value={deliveryInfo.first_name}
                    onChange={(e) => {
                      // this.setState((prevState) => ({
                      //   deliveryInfo: {
                      //     ...prevState.deliveryInfo,
                      //     first_name: e.target.value,
                      //   },
                      // }));
                    }}
                    aria-label="Confirm your first name"
                    title="Confirm your first name"
                  />

                  <input
                    type="text"
                    placeholder="Last Name"
                    className={styles.inputContactRight}
                    value={deliveryInfo.last_name}
                    onChange={(e) => {
                      // this.setState((prevState) => ({
                      //   deliveryInfo: {
                      //     ...prevState.deliveryInfo,
                      //     last_name: e.target.value,
                      //   },
                      // }));
                    }}
                    aria-label="Confirm your last name"
                    title="Confirm your last name"
                  />
                </div>

                  <input
                    type="text"
                    placeholder="Email"
                    className={styles.input}
                    // value={this.props.email}
                    aria-label="Confirn your email"
                    title="Confirn your email"
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    className={styles.input}
                    value={deliveryInfo.phone}
                    onChange={(e) => {
                      // this.setState((prevState) => ({
                      //   deliveryInfo: {
                      //     ...prevState.deliveryInfo,
                      //     phone: e.target.value,
                      //   },
                      // }));
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
                      value={deliveryInfo.unit}
                      onChange={(e) => {
                        // this.setState((prevState) => ({
                        //   deliveryInfo: {
                        //     ...prevState.deliveryInfo,
                        //     unit: e.target.value,
                        //   },
                        // }));
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
                    value={deliveryInfo.instructions}
                    onChange={(e) => {
                      // this.setState((prevState) => ({
                      //   deliveryInfo: {
                      //     ...prevState.deliveryInfo,
                      //     instructions: e.target.value,
                      //   },
                      // }));
                    }}
                    aria-label="Confirm your delivery instructions"
                    title="Confirm your delivery instructions"
                  />

                  {/* <div className={styles.googleMap} id="map" /> */}

                  <div style={{ textAlign: "center" }}>
                    <button
                      className={styles.orangeBtn}
                      // disabled={!this.state.subscriptionsLoaded}
                      // onClick={() => this.saveEdits()}
                      aria-label="Click to save delivery changes"
                      title="Click to save delivery changes"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* {narrowView ? ( */}
                {dimensions.width < 800 ? (
                  <>
                    <div style={{ marginTop: "20px" }} />
                    <div className={styles.sectionHeader}>Payment Summary</div>
                  </>
                ) : null}

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
                      {console.log("error newPlan: ", newPlan)}
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
                    {(() => {
                      if (
                        newPlan.billing.driver_tip === "0.00"
                      ) {
                        return (
                          <button
                            className={styles.tipButtonSelected}
                            // onClick={() => this.changeTip("0.00")}
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
                        );
                      } else {
                        return (
                          <button
                            className={styles.tipButton}
                            // onClick={() => this.changeTip("0.00")}
                            aria-label={
                              "Current tip is: $" +
                              newPlan.billing.driver_tip +
                              ". Click here to remove tip."
                            }
                            title={
                              "Current tip is: $" +
                              newPlan.billing.driver_tip +
                              ". Click here to remove tip."
                            }
                          >
                            No Tip
                          </button>
                        );
                      }
                    })()}
                    {(() => {
                      if (
                        newPlan.billing.driver_tip === "2.00"
                      ) {
                        return (
                          <button
                            className={styles.tipButtonSelected}
                            // onClick={() => this.changeTip("2.00")}
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
                        );
                      } else {
                        return (
                          <button
                            className={styles.tipButton}
                            // onClick={() => this.changeTip("2.00")}
                            aria-label={
                              "Current tip is: $" +
                              newPlan.billing.driver_tip +
                              ". Click here change tip to $2."
                            }
                            title={
                              "Current tip is: $" +
                              newPlan.billing.driver_tip +
                              ". Click here to change tip to $2."
                            }
                          >
                            $2
                          </button>
                        );
                      }
                    })()}
                    {(() => {
                      if (
                        newPlan.billing.driver_tip === "3.00"
                      ) {
                        return (
                          <button
                            className={styles.tipButtonSelected}
                            // onClick={() => this.changeTip("3.00")}
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
                        );
                      } else {
                        return (
                          <button
                            className={styles.tipButton}
                            // onClick={() => this.changeTip("3.00")}
                            aria-label={
                              "Current tip is: $" +
                              newPlan.billing.driver_tip +
                              ". Click here to change tip to $3."
                            }
                            title={
                              "Current tip is: $" +
                              newPlan.billing.driver_tip +
                              ". Click here to change tip to $3."
                            }
                          >
                            $3
                          </button>
                        );
                      }
                    })()}
                    {(() => {
                      if (
                        newPlan.billing.driver_tip === "5.00"
                      ) {
                        return (
                          <button
                            className={styles.tipButtonSelected}
                            // onClick={() => this.changeTip("5.00")}
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
                        );
                      } else {
                        return (
                          <button
                            className={styles.tipButton}
                            // onClick={() => this.changeTip("5.00")}
                            aria-label={
                              "Current tip is: $" +
                              newPlan.billing.driver_tip +
                              ". Click here to change tip to $5."
                            }
                            title={
                              "Current tip is: $" +
                              newPlan.billing.driver_tip +
                              ". Click here to change tip to $5."
                            }
                          >
                            $5
                          </button>
                        );
                      }
                    })()}
                  </div>

                  <div style={{ display: "flex", borderBottom: "1px solid" }}>
                    <input
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
                    </button>
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
                      -${newPlan.billing.ambassador_discount}
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
            </div>
          </div>

        </>
      )}

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
