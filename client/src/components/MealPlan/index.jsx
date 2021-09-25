import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  fetchProfileInformation,
  fetchSubscribed,
  fetchPlans,
  setCurrentMeal,
  setSelectedPlan,
  chooseMealsDelivery,
  choosePaymentOption,
  setUserInfo,
  setCurrentPurchase,
} from "../../reducers/actions/subscriptionActions";
import { withRouter } from "react-router";
import { fetchOrderHistory } from "../../reducers/actions/profileActions";
import { WebNavBar } from "../NavBar";
import styles from "./mealplan.module.css";
import axios from "axios";
import { API_URL } from "../../reducers/constants";

import { FootLink } from "../Home/homeButtons";

import m4me_logo from "../../images/LOGO_NoBG_MealsForMe.png";

const MealPlan = (props) => {

  const [customerId, setCustomerId] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [dropdownButtons, setDropdownButtons] = useState([]);
  const [showDropdown, toggleShowDropdown] = useState(false);

  const [billingInfo, setBillingInfo] = useState(null);

  const [subHistory, setSubHistory] = useState([]);

  const [uniquePlans, setUniquePlans] = useState(null);

  //check for logged in user
  //let customerId = null;
  if (
    document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("customer_uid=")) &&
    customerId === null
  ) {
    setCustomerId(
      document.cookie
        .split("; ")
        .find((item) => item.startsWith("customer_uid="))
        .split("=")[1]
    );
  }

  // (1) Fetch profile info and subscription history info
  useEffect(() => {
    if (!customerId) {
      props.history.push("/");
    } else {
      try {
        props.fetchProfileInformation(customerId);

        // console.log("useEffect customerId: " + customerId);

        axios
          .get(API_URL + "subscription_history/" + customerId)
          .then((res) => {
            // console.log("(sh) res: ", res.data.result);

            setSubHistory(res.data.result);
            setBillingInfo(res.data.result);
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
            }
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  // (3) Set default plan and associated dropdowns
  useEffect(() => {
    // console.log("(UE currentPlan) current plan set: ", currentPlan);
    // console.log("(UE currentPlan) unique plans: ", uniquePlans);
  }, [currentPlan, uniquePlans]);

  // (2) Set default plan
  useEffect(() => {

    let tempDropdownButtons = [];
    let uniquePlansFetched = 0;
    let defaultSub = false;
    let tempUniquePlans = [];
    let dropdownIndex = 0;

    subHistory.forEach((sub) => {
      let elIndex = tempUniquePlans.findIndex(
        (element) => element.id === sub.purchase_id
      );

      if (elIndex === -1) {

        let tempUniquePlan = {
          id: sub.purchase_id,
          history: [],
        };

        tempUniquePlans.push(tempUniquePlan);

        elIndex = tempUniquePlans.findIndex(
          (element) => element.id === sub.purchase_id
        );

        let historyTab = {
          date: sub.payment_time_stamp,
          show_dropdown: false,
          deliveries: [],
        };
        tempUniquePlans[elIndex].history.push(historyTab);
        tempUniquePlans[elIndex].history[0].deliveries.push(sub);

        uniquePlansFetched++;

        // Parse meals, deliveries, and id for each plan
        let parsedItems = JSON.parse(sub.items)[0];
        let parsedMeals = parsedItems.name.substring(
          0,
          parsedItems.name.indexOf(" ")
        );
        let parsedDeliveries = parsedItems.qty;
        let parsedId = sub.purchase_id.substring(
          sub.purchase_id.indexOf("-") + 1,
          sub.purchase_id.length
        );
        let parsedPlan = { ...sub };

        parsedPlan["meals"] = parsedMeals;
        parsedPlan["deliveries"] = parsedDeliveries;
        parsedPlan["id"] = parsedId;

        if (defaultSub === false) {
          defaultSub = true;
          setCurrentPlan(parsedPlan);
        }

        // Push buttons into top dropdown menu
        tempDropdownButtons.push(
          <div
            className={styles.menuButton}
            key={dropdownIndex + " : " + sub.purchase_id}
            onClick={() => {
              setCurrentPlan(parsedPlan);
              toggleShowDropdown(false);
            }}
            tabIndex="0"
            aria-label={
              "Click to select the following meal: " +
              parsedPlan.meals +
              " Meals, " +
              parsedPlan.deliveries +
              " Deliveries : " +
              parsedPlan.id
            }
            title={
              "Click to select the following meal: " +
              parsedPlan.meals +
              " Meals, " +
              parsedPlan.deliveries +
              " Deliveries : " +
              parsedPlan.id
            }
          >
            {parsedPlan.meals} Meals, {parsedPlan.deliveries} Deliveries :{" "}
            {parsedPlan.id}
          </div>
        );

        dropdownIndex++;
      } else {
        let dateIndex = tempUniquePlans[elIndex].history.findIndex(
          (element) => element.date === sub.payment_time_stamp
        );
        if (dateIndex === -1) {
          let historyTab = {
            date: sub.payment_time_stamp,
            show_dropdown: false,
            deliveries: [],
          };
          tempUniquePlans[elIndex].history.push(historyTab);
          tempUniquePlans[elIndex].history[
            tempUniquePlans[elIndex].history.length - 1
          ].deliveries.push(sub);
        } else {
          tempUniquePlans[elIndex].history[dateIndex].deliveries.push(sub);
        }
      }

    });

    setUniquePlans(tempUniquePlans);

    let dropdownTopMargin = [
      <div
        key={"space"}
        style={{
          height: "25px",
          backgroundColor: "#f26522",
        }}
      />,
    ];

    tempDropdownButtons = dropdownTopMargin.concat(tempDropdownButtons);

    // Set dropdown menu buttons
    setDropdownButtons(
      <>
        <div
          style={{
            height: "20px",
            zIndex: "1",
          }}
        />
        <div
          style={{
            backgroundColor: "#f26522",
            width: "40%",
            minWidth: "300px",
            height: 40 + uniquePlansFetched * 42,
            position: "absolute",
            zIndex: "1",
            boxShadow: "0px 5px 10px gray",
            borderRadius: "15px",
          }}
        >
          {tempDropdownButtons}
        </div>
      </>
    );

  }, [subHistory]);

  const formatDate = (rawDate) => {
    let dateElements = rawDate.split(" ");
    let yyyy_mm_dd = dateElements[0].split("-");
    let month;

    // Parse month
    switch (yyyy_mm_dd[1]) {
      case "01":
        month = "January";
        break;
      case "02":
        month = "February";
        break;
      case "03":
        month = "March";
        break;
      case "04":
        month = "April";
        break;
      case "05":
        month = "May";
        break;
      case "06":
        month = "June";
        break;
      case "07":
        month = "July";
        break;
      case "08":
        month = "August";
        break;
      case "09":
        month = "September";
        break;
      case "10":
        month = "October";
        break;
      case "11":
        month = "November";
        break;
      case "12":
        month = "December";
        break;
      default:
        month = "";
    }

    let dateString = month + " " + yyyy_mm_dd[2] + ", " + yyyy_mm_dd[0];

    return dateString;
  };

  const showMealsForDelivery = (totalMeals) => {
    let mealsForDelivery = [];
    for (var i = 0; i < totalMeals; i++) {
      mealsForDelivery.push(
        <div style={{ display: "inline-flex", width: "100%", height: "110px" }}>
          <div
            style={{
              // border: 'inset',
              width: "8%",
              fontSize: "40px",
              fontWeight: "600",
              paddingTop: "15px",
            }}
          >
            3
          </div>
          <div
            style={{
              // border: 'inset',
              width: "92%",
              fontWeight: "600",
              paddingTop: "33px",
            }}
          >
            Chicken Teriyaki Bowl
          </div>
          <div
            style={{
              display: "flex",
              // border: 'inset',
              width: "0%",
              minWidth: "100px",
              textAlign: "right",
              float: "right",
              fontWeight: "600",
            }}
          >
            <div
              style={{
                border: "dashed",
                width: "100px",
                height: "100px",
                marginTop: "5px",
              }}
            >
              {"<image goes here>"}
            </div>
          </div>
        </div>
      );
    }
    return mealsForDelivery;
  };

  const displayMealInfo = (data) => {
    let mealsForDelivery = [];
    if (data.meal_uid !== null) {
      mealsForDelivery.push(
        <div
          style={{ display: "inline-flex", width: "100%", height: "110px" }}
          tabIndex="0"
          aria-label={
            formatDate(data.sel_menu_date) +
            ". " +
            data.meal_qty +
            " " +
            data.meal_name +
            "s"
          }
          title={
            formatDate(data.sel_menu_date) +
            ". " +
            data.meal_qty +
            " " +
            data.meal_name +
            "s"
          }
        >
          <div
            style={{
              // border: 'inset',
              width: "8%",
              fontSize: "40px",
              fontWeight: "600",
              paddingTop: "15px",
            }}
          >
            {data.meal_qty}
          </div>
          <div
            style={{
              // border: 'inset',
              width: "92%",
              fontWeight: "600",
              paddingTop: "33px",
            }}
          >
            {data.meal_name}
          </div>
          <div
            style={{
              display: "flex",
              // border: 'inset',
              width: "0%",
              minWidth: "100px",
              textAlign: "right",
              float: "right",
              fontWeight: "600",
            }}
          >
            <div
              style={{
                // border: 'dashed',
                width: "100px",
                height: "100px",
                marginTop: "5px",
                backgroundImage: `url(${data.meal_photo_URL})`,
                backgroundSize: "cover",
              }}
            />
          </div>
        </div>
      );
    } else if (data.meal_desc === "SURPRISE") {
      mealsForDelivery.push(
        <div
          style={{ display: "inline-flex", width: "100%", height: "110px" }}
          tabIndex="0"
          aria-label={
            formatDate(data.sel_menu_date) +
            ". " +
            currentPlan.meals +
            "surprises"
          }
          title={
            formatDate(data.sel_menu_date) +
            ". " +
            currentPlan.meals +
            "surprises"
          }
        >
          <div
            style={{
              // border: 'inset',
              width: "8%",
              fontSize: "40px",
              fontWeight: "600",
              paddingTop: "15px",
            }}
          >
            {currentPlan.meals}
          </div>
          <div
            style={{
              // border: 'inset',
              width: "92%",
              fontWeight: "600",
              paddingTop: "33px",
            }}
          >
            {"Surprises"}
          </div>
          <div
            style={{
              display: "flex",
              // border: 'inset',
              width: "0%",
              minWidth: "100px",
              textAlign: "right",
              float: "right",
              fontWeight: "600",
            }}
          >
            <div
              style={{
                border: "dashed",
                width: "100px",
                height: "100px",
                marginTop: "5px",
                borderWidth: "2px",
                // backgroundColor: 'whitesmoke',
                fontSize: "50px",
                paddingRight: "33px",
                paddingTop: "10px",
              }}
            >
              ?
            </div>
          </div>
        </div>
      );
    } else if (data.meal_desc === "SKIP") {
      mealsForDelivery.push(
        <div
          style={{ display: "inline-flex", width: "100%", height: "110px" }}
          tabIndex="0"
          aria-label={formatDate(data.sel_menu_date) + ". skip"}
          title={formatDate(data.sel_menu_date) + ". skip"}
        >
          <div
            style={{
              // border: 'inset',
              width: "8%",
              fontSize: "40px",
              fontWeight: "600",
              paddingTop: "15px",
            }}
          >
            0
          </div>
          <div
            style={{
              // border: 'inset',
              width: "92%",
              fontWeight: "600",
              paddingTop: "33px",
            }}
          >
            {"(Skip)"}
          </div>
        </div>
      );
    }
    return mealsForDelivery;
  };

  const showMealsDelivered = () => {
    return (
      <div
        style={{
          display: "flex"
        }}
      >
        <div style={{ display: "inline-block", width: "100%" }}>
          <div style={{ display: "inline-flex", width: "100%" }}>
            <div
              style={{
                width: "50%",
                fontWeight: "600",
              }}
            >
              Meals Delivered
            </div>
            <div
              style={{
                width: "50%",
                textAlign: "right",
                fontWeight: "600",
              }}
            >
              May 31, 2028
            </div>
          </div>

          {showMealsForDelivery(2)}
        </div>
      </div>
    );
  };

  const isFutureCycle = (rawDate, billDate) => {

    let dateElements = rawDate.split(" ");
    let billDateElements = billDate.split(" ");

    let parsedDate = Date.parse(dateElements[0]);
    let parsedBillDate = Date.parse(billDateElements[0]);

    if (parsedDate > parsedBillDate) {
      return true;
    } else {
      return false;
    }
  };

  const isFutureDate = (rawDate) => {
    let dateElements = rawDate.split(" ");

    if (Date.parse(dateElements[0]) > Date.now()) {
      return true;
    } else {
      return false;
    }
  };

  const showPastMeals = (data) => {

    let uniqueDates = [];

    let mealsDisplay = [];

    data.deliveries.forEach((del) => {
      if (
        !isFutureCycle(
          del.sel_menu_date,
          nextBillingDate(currentPlan.purchase_id)
        )
      ) {
        if (uniqueDates.includes(del.sel_menu_date)) {
          mealsDisplay.push(
            <div
              style={{
                display: "flex",
              }}
            >
              <div style={{ display: "inline-block", width: "100%" }}>
                {displayMealInfo(del)}
              </div>
            </div>
          );
        } else {
          uniqueDates.push(del.sel_menu_date);
          mealsDisplay.push(
            <div
              style={{
                display: "flex",
                marginTop: "15px",
              }}
            >
              <div style={{ display: "inline-block", width: "100%" }}>
                <div style={{ display: "inline-flex", width: "100%" }}>
                  <div
                    style={{
                      // border: 'inset',
                      width: "50%",
                      fontWeight: "600",
                    }}
                  >
                    {isFutureDate(del.sel_menu_date)
                      ? "Meals Delivered (Future)"
                      : "Meals Delivered"}
                  </div>
                  <div
                    style={{
                      // border: 'inset',
                      width: "50%",
                      textAlign: "right",
                      fontWeight: "600",
                    }}
                  >
                    {formatDate(del.sel_menu_date)}
                  </div>
                </div>

                {displayMealInfo(del)}
              </div>
            </div>
          );
        }
      }
    });

    return <div>{mealsDisplay}</div>;
  };

  const nextBillingDate = (id) => {
    let billInfo = billingInfo.find((plan) => {
      return plan.purchase_id === id;
    });
    return billInfo.next_billing_date;
  };

  const showHistory = () => {

    // Process data into divs for rendering
    let deliveryDropdowns = [];

    let planHistory = uniquePlans.find((plan) => {
      return plan.id === currentPlan.purchase_id;
    });

    let historyTabs = [];

    planHistory.history.forEach((sel) => {
      historyTabs.push(
        <div key={sel.date} style={{ marginTop: "50px", marginBottom: "50px" }}>
          <div style={{ display: "inline-flex", width: "100%" }}>
            <div className={styles.orangeHeaderLeft}>Billing Date</div>
            <div className={styles.orangeHeaderRight}>
              {formatDate(sel.date)}
            </div>
          </div>
          <div
            onClick={() => {

              let uniquePlanCopy = [...uniquePlans];

              let index1 = uniquePlans.findIndex((plan) => {
                return plan.id === currentPlan.purchase_id;
              });

              let index2 = uniquePlanCopy[index1].history.findIndex((tab) => {
                return tab.date === sel.date;
              });

              uniquePlanCopy[index1].history[index2].show_dropdown =
                !uniquePlanCopy[index1].history[index2].show_dropdown;

              setUniquePlans(uniquePlanCopy);

            }}
            style={{ display: "inline-flex", width: "100%", cursor: "pointer" }}
          >
            <div className={styles.orangeHeaderLeft}>Meal Plan</div>
            <div className={styles.orangeHeaderRightArrow}>
              {currentPlan.meals} Meals, {currentPlan.deliveries} Deliveries
            </div>
            <div
              style={{
                width: "1%",
                borderTop: "solid",
                borderWidth: "1px",
                borderColor: "#f26522",
              }}
            />
            <div
              style={{
                width: "3%",
                minWidth: "24px",
                borderTop: "solid",
                borderWidth: "1px",
                borderColor: "#f26522",
                paddingTop: "12px",
              }}
            >
              {sel.show_dropdown ? (
                <div className={styles.orangeArrowUp} />
              ) : (
                <div className={styles.orangeArrowDown} />
              )}
            </div>
          </div>
          {sel.show_dropdown ? <>{showPastMeals(sel)}</> : null}
        </div>
      );
    });

    return <div>{historyTabs.reverse()}</div>;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "space-between",
      }}
    >
      <WebNavBar />

      <div className={styles.sectionHeader}>Subscription History</div>

      {/* {infoLoaded === false */}
      {/* {currentPlan === null || historyDropdowns === null */}
      {currentPlan === null || uniquePlans === null || billingInfo === null ? (
        // <div
        //   style={{
        //     fontSize: '40px',
        //     fontWeight: 'bold',
        //     marginLeft: '8%',
        //     marginBottom: '100px',
        //     marginRight: '8%'
        //   }}
        // >
        //   LOADING YOUR SUBSCRIPTION HISTORY...
        // </div>
        <div
          style={{
            color: "red",
            zIndex: "99",
            height: "100vh",
            width: "100vw",
            // height: '50vh',
            // width: '50vw',
            // border: 'inset',
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
          <div className={styles.container}>
            <div className={styles.box2}>
              <div
                style={{
                  // border: 'inset',
                  position: "relative",
                  height: showDropdown
                    ? 60 + props.subscribedPlans.length * 42
                    : 60,
                }}
              >
                <div
                  className={styles.dropdownSelection}
                  onClick={() => {
                    // console.log("set show dropdown menu to: ", !showDropdown);
                    toggleShowDropdown(!showDropdown);
                  }}
                  tabIndex="0"
                  aria-label="Click here to choose the subscription you want to view"
                  title="Click here to choose the subscription you want to view"
                >
                  <div
                    style={{
                      // border: 'solid',
                      // borderWidth: '1px',
                      width: "80%",
                      marginLeft: "5%",
                      textOverflow: "ellipsis",
                      display: "block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {/* [placeholder default meal plan] */}
                    {currentPlan === null
                      ? "No Active Plans"
                      : currentPlan.meals +
                        " Meals, " +
                        currentPlan.deliveries +
                        " Deliveries : " +
                        currentPlan.id}
                  </div>
                  <div
                    style={{
                      width: "10%",
                      minWidth: "24px",
                      marginRight: "5%",
                    }}
                  >
                    {currentPlan === null ? null : (
                      <div className={styles.whiteArrowDown} />
                    )}
                    {/* <div className={styles.whiteArrowDown} />  */}
                  </div>
                </div>

                {showDropdown ? dropdownButtons : null}
              </div>

              {/* {console.log("current plan (before bill date): ", currentPlan)} */}
              <div
                style={{
                  marginTop: "50px",
                  marginBottom: "50px" /*border: 'solid'*/,
                }}
              >
                <div style={{ display: "inline-flex", width: "100%" }}>
                  <div className={styles.orangeHeaderLeft}>
                    Next Billing Date
                  </div>
                  <div className={styles.orangeHeaderRight}>
                    {formatDate(nextBillingDate(currentPlan.purchase_id))}
                  </div>
                </div>

                <div style={{ display: "inline-flex", width: "100%" }}>
                  <div className={styles.orangeHeaderLeft}>Meal Plan</div>
                  <div className={styles.orangeHeaderRightUL}>
                    {currentPlan === null
                      ? "No Active Plans"
                      : currentPlan.meals +
                        " Meals, " +
                        currentPlan.deliveries +
                        " Deliveries"}
                  </div>
                </div>
              </div>

              {showHistory()}
            </div>
          </div>
        </>
      )}

      <div style={{ flex: "1" }}></div>

      <FootLink />
    </div>
  );
};

const mapStateToProps = (state) => ({
  subscribe: state.subscribe,
  customerId: state.subscribe.profile.customerId,
  subscribedPlans: state.subscribe.subscribedPlans,
  orderHistory: state.profile.orderHistory,
  errors: state.subscribe.errors,
  meals: state.subscribe.meals,
  plans: state.subscribe.plans,
  firstName: state.login.userInfo.firstName,
  lastName: state.login.userInfo.lastName,
  socialMedia: state.subscribe.profile.socialMedia,
});

export default connect(mapStateToProps, {
  fetchProfileInformation,
  fetchSubscribed,
  fetchOrderHistory,
  fetchPlans,
  setCurrentMeal,
  setSelectedPlan,
  chooseMealsDelivery,
  choosePaymentOption,
  setUserInfo,
  setCurrentPurchase,
})(withRouter(MealPlan));
