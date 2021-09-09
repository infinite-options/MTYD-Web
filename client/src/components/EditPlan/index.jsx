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
  const [updatedPlan, setUpdatedPlan] = useState({
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

  // const [subscriptionsLoaded, setSubscriptionsLoaded] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [plans, setPlans] = useState(null);
  const [deliveryDiscounts, setDeliveryDiscounts] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);

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
          payment_summary: {
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
          setUpdatedPlan(parsedSub);
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
            setUpdatedPlan(sub);
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
                updatedPlan.meals === mealIndex
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
              updatedPlan.deliveries === deliveryIndex
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
              border: '1px dashed',
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
                    // let chargeOrRefund = this.state.differenceSummary.total;
                    let chargeOrRefund = 0.0;
                    if (parseFloat(chargeOrRefund) >= 0) {
                      return (
                        <>
                          <div className={styles_admin.chargeText}>
                            {"Additional Charges "}
                          </div>
                          <div className={styles_admin.chargeAmount}>
                            {/* ${this.state.differenceSummary.total} */}
                            ${"<null>"}
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
                            ${"<null>"}
                            {/* {(-1 * this.state.differenceSummary.total).toFixed(
                              2
                            )} */}
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
                // let chargeOrRefund = this.state.differenceSummary.total;
                let chargeOrRefund = 0.0;
                if (parseFloat(chargeOrRefund) >= 0) {
                  return (
                    <>
                      <div className={styles_admin.chargeText}>
                        {"Additional Charges "}
                      </div>
                      <div className={styles_admin.chargeAmount}>
                        {/* ${this.state.differenceSummary.total} */}
                        ${"<null>"}
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
                        {/* ${(-1 * this.state.differenceSummary.total).toFixed(2)} */}
                        ${"<null>"}
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
      ) : (<>

      {login_seen ? (
        <PopLogin toggle={togglePopLogin} />
      ) : null}
      {signUpSeen ? (
        <Popsignup toggle={togglePopSignup} />
      ) : null}

      <div className={styles.sectionHeaderScroll}>Select Meal Plan</div>
      {/* <div 
        className={styles.sectionHeaderScroll}
        style={{
          marginTop: '500px',
          marginBottom: '500px'
        }}
      >{result}</div> */}

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
      </>)}

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
