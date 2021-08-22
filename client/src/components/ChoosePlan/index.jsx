import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  fetchPlans,
  chooseMealsDelivery,
  choosePaymentOption,
  fetchProfileInformation,
  changeAddressFirstName,
  changeAddressLastName,
  changeAddressStreet,
  changeAddressUnit,
  changeAddressCity,
  changeAddressState,
  changeAddressZip,
  changeAddressPhone,
  changeDeliveryInstructions,
  changePaymentPassword,
  changeCardNumber,
  changeCardCvv,
  changeCardMonth,
  changeCardYear,
  changeCardZip,
  submitPayment,
} from "../../reducers/actions/subscriptionActions";

import { preCallback } from "../../reducers/actions/loginActions";

import axios from "axios";
import { API_URL } from "../../reducers/constants";
import { withRouter } from "react-router";
import styles from "./choosePlan.module.css";
import { WebNavBar } from "../NavBar";

import PopLogin from "../PopLogin";
import Popsignup from "../PopSignup";

class ChoosePlan extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
      unlogin_plans: null,
      plansFetched: false,
      customerUid: "",
      loggedIn: false,
      deliveryDays: [],
      login_seen: false,
      signUpSeen: false,
      total: "0.00",
      numDeliveryDays: 0,
      profileLoaded: false,
      narrowView: false,
    };

    // this.updateView = this.updateView.bind(this);
  }

  handleResize = () =>
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });

  // updateView() {
  //   this.setState({ narrowView: window.innerWidth <= 800 },
  //   () => {
  //     console.log(
  //       "narrowView changed to: ", this.state.narrowView,
  //       " (width = " + window.innerWidth + "px)"
  //     );
  //   });
  // }

  togglePopLogin = () => {
    this.setState({
      login_seen: !this.state.login_seen,
    });

    if (!this.state.login_seen) {
      this.setState({
        signUpSeen: false,
      });
    }
  };

  togglePopSignup = () => {
    this.setState({
      signUpSeen: !this.state.signUpSeen,
    });

    if (!this.state.signUpSeen) {
      this.setState({
        login_seen: false,
      });
    }
  };

  // http://localhost:2000/api/v2/delivery_weekdays
  // https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/delivery_weekdays

  convertHexToString(hash) {
    let hex = hash.toString();
    let str = "";
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }

  componentDidMount() {
    //console.log("choose-plan props: " + JSON.stringify(this.props));
    //console.log(this.props)

    // this.updateView();
    // window.addEventListener("resize", this.updateView);

    this.handleResize();
    window.addEventListener("resize", this.handleResize);

    let queryString = this.props.location.search;
    let urlParams = new URLSearchParams(queryString);
    // Clear Query parameters
    window.history.pushState({}, document.title, window.location.pathname);

    // Logged in from Apple
    if (urlParams.has("customer_uid")) {
      // window.location.href = "/admin/order-ingredients";

      // Original Code
      // let customer_uid = urlParams.get("customer_uid");
      // document.cookie = "customer_uid=" + customer_uid;

      // New Code
      let hashed_customer_uid = urlParams.get("customer_uid");
      console.log(hashed_customer_uid);

      let customer_uid = this.convertHexToString(hashed_customer_uid);
      document.cookie = "customer_uid=" + customer_uid;
      console.log(customer_uid);

      // Old Api Calls
      axios
        .get(API_URL + "customer_lplp", {
          params: {
            customer_uid: customer_uid,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.result !== undefined) {
            // this.props.history.push("/select-meal");
            this.props.fetchProfileInformation(customer_uid);
          }
          this.props.fetchPlans();
          this.setState({
            mounted: true,
            customerUid: customer_uid,
            loggedIn: true,
          });
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            console.log(err.response);
          }
        });
      axios
        .get(API_URL + "Profile/" + customer_uid)
        .then((res) => {
          const customerInfo = res.data.result[0];
          const successLogin = (page) => {
            this.props.history.push(`/${page}`);
          };
          preCallback(customerInfo, successLogin);

          // console.log(res.data.result[0])
          // let data = res.data.result[0];
          // this.props.changeAddressFirstName(data.customer_first_name);
          // this.props.changeAddressLastName(data.customer_last_name);
          // this.props.changeAddressStreet(data.customer_address);
          // this.props.changeAddressUnit(data.customer_unit);
          // this.props.changeAddressCity(data.customer_city);
          // this.props.changeAddressState(data.customer_state);
          // this.props.changeAddressZip(data.customer_zip);
          // this.props.changeAddressPhone(data.customer_phone_num);
          //console.log("(2) choose-plan address props: " + JSON.stringify(this.props.address));

          this.setState({
            profileLoaded: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // Check for logged in
    else if (
      document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("customer_uid="))
    ) {
      let customer_uid = document.cookie
        .split("; ")
        .find((item) => item.startsWith("customer_uid="))
        .split("=")[1];
      this.props.fetchProfileInformation(customer_uid);
      this.props.fetchPlans();
      axios
        .get(API_URL + "Profile/" + customer_uid)
        .then((res) => {
          let data = res.data.result[0];
          this.props.changeAddressFirstName(data.customer_first_name);
          this.props.changeAddressLastName(data.customer_last_name);
          this.props.changeAddressStreet(data.customer_address);
          this.props.changeAddressUnit(data.customer_unit);
          this.props.changeAddressCity(data.customer_city);
          this.props.changeAddressState(data.customer_state);
          this.props.changeAddressZip(data.customer_zip);
          this.props.changeAddressPhone(data.customer_phone_num);
          //console.log("(3) choose-plan address props: " + JSON.stringify(this.props.address));

          this.setState({
            profileLoaded: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
      this.setState({
        mounted: true,
        customerUid: customer_uid,
        loggedIn: true,
      });
    } else {
      // Reroute to log in page
      //console.log("Choose-plan NOT LOGGED IN");
      this.props.fetchPlans();
      this.setState({
        mounted: true,
        customerUid: "NULL",
        loggedIn: false,
        profileLoaded: true,
      });
      //this.props.history.push("/");
    }

    // Fetch delivery days
    axios
      .get(API_URL + "delivery_weekdays")
      .then((res) => {
        // console.log(res.data.result[0])
        let resultDays = res.data.result;
        //console.log("delivery_weekdays response: " + JSON.stringify(resultDays));
        this.setState(
          {
            deliveryDays: resultDays,
          },
          () => {
            this.countDeliveryWeekdays();
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  showDeliveryDates = () => {
    let messageDays = [];

    for (const [dateKey, dateData] of Object.entries(this.state.deliveryDays)) {
      //console.log("showDeliveryDates() key: " + dateKey + ", dateData: " + JSON.stringify(dateData));
      //console.log("weekday integer: " + dateData["weekday(menu_date)"]);

      let dayInt = dateData["weekday(menu_date)"];

      //console.log("weekday int: " + dayInt);

      let dayString = "";

      switch (dayInt) {
        case 0:
          dayString = "MONDAYS";
          break;
        case 1:
          dayString = "TUESDAYS";
          break;
        case 2:
          dayString = "WEDNESDAYS";
          break;
        case 3:
          dayString = "THURSDAYS";
          break;
        case 4:
          dayString = "FRIDAYS";
          break;
        case 5:
          dayString = "SATURDAYS";
          break;
        case 6:
          dayString = "SUNDAYS";
          break;
        default:
          dayString = "";
      }

      if (messageDays.includes(dayString) === false) {
        messageDays.push(dayString);
      }
    }

    let deliveryDaysString = " ";

    for (var i = 0; i < messageDays.length; i++) {
      if (i === messageDays.length - 1) {
        deliveryDaysString = deliveryDaysString.concat(messageDays[i]);
      } else {
        deliveryDaysString = deliveryDaysString.concat(messageDays[i] + ", ");
      }
    }

    //console.log("final deliveryDaysString: " + deliveryDaysString);

    return deliveryDaysString;
  };

  countDeliveryWeekdays = () => {
    let messageDays = [];

    for (const [dateKey, dateData] of Object.entries(this.state.deliveryDays)) {
      //console.log("showDeliveryDates() key: " + dateKey + ", dateData: " + JSON.stringify(dateData));
      //console.log("weekday integer: " + dateData["weekday(menu_date)"]);

      let dayInt = dateData["weekday(menu_date)"];

      //console.log("weekday int: " + dayInt);

      let dayString = "";

      switch (dayInt) {
        case 0:
          dayString = "MONDAY";
          break;
        case 1:
          dayString = "TUESDAY";
          break;
        case 2:
          dayString = "WEDNESDAY";
          break;
        case 3:
          dayString = "THURSDAY";
          break;
        case 4:
          dayString = "FRIDAY";
          break;
        case 5:
          dayString = "SATURDAY";
          break;
        case 6:
          dayString = "SUNDAY";
          break;
        default:
          dayString = "";
      }

      if (messageDays.includes(dayString) === false) {
        messageDays.push(dayString);
        this.setState(
          (prevState) => {
            return { numDeliveryDays: prevState.numDeliveryDays + 1 };
          },
          () => {
            //console.log("new num weekdays delivered: " + this.state.numDeliveryDays);
          }
        );
      }
    }
  };

  mealsDelivery = () => {
    //console.log("(meals delivery) CHOOSE PLANS: " + JSON.stringify(this.props.plans));

    let deselectedMealButton = styles.mealButton;
    let selectedMealButton =
      styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];
    let singleMealData;

    // this.props.plans
    let mealPlans = this.props.plans;

    for (const [mealIndex, mealData] of Object.entries(mealPlans)) {
      singleMealData = mealData["1"];
      //console.log("data for single delivery of " + mealIndex + " meal plan: " + JSON.stringify(singleMealData));

      // console.log("mealData: ", mealData);
      // console.log("(key) mealIndex: " + mealIndex + " meals, " + singleMealData.num_deliveries + " deliveries");
      mealButtons.push(
        <div className={styles.mealButtonWrapper} key={mealIndex}>
          <button
            // key={mealIndex}
            className={
              this.props.meals === mealIndex
                ? selectedMealButton
                : deselectedMealButton
            }
            onClick={() => {
              this.props.chooseMealsDelivery(
                mealIndex,
                this.props.paymentOption,
                this.props.plans
              );
              // console.log("===== mealIndex: " + mealIndex);
              // console.log("===== paymentOption: " + this.props.paymentOption);
              //console.log("===== plans: " + JSON.stringify(this.props.plans));
            }}
            aria-label={
              "Click to select " +
              mealIndex +
              " meals per delivery for $" +
              singleMealData.item_price
            }
            title={
              "Click to select " +
              mealIndex +
              " meals per delivery for $" +
              singleMealData.item_price
            }
          >
            {mealIndex}
          </button>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            ${singleMealData.item_price}
          </div>
        </div>
      );
    }
    // console.log("mealButtons length: ", mealButtons.length);

    return mealButtons;
  };

  paymentFrequency2 = () => {
    let deselectedPaymentOption = styles.deliveryButton;
    let selectedPaymentOption =
      styles.deliveryButton + " " + styles.deliveryButtonSelected;
    let paymentOptionButtons = [];

    var discounts = this.props.plans[2];
    var discount = null;

    // console.log("(paymentFrequency2) === (1)");
    // console.log("(paymentFrequency2) === typeof(discounts): " + typeof(discounts));

    if (typeof discounts !== "undefined") {
      // console.log("(paymentFrequency2) === (2)");
      for (const [deliveryIndex, deliveryData] of Object.entries(discounts)) {
        let active = false;
        if (this.props.meals === "") {
          active = true;
        } else {
          active = false;
        }

        try {
          discount = discounts[deliveryIndex].delivery_discount;
          // console.log("discount: " + discount);
        } catch (e) {
          // console.log("discount UNDEFINED");
        }

        // console.log("deliveryData: ", deliveryData);
        // console.log("(key) deliveryIndex: " + deliveryIndex + " deliveries, " + deliveryData.num_items + " meals");

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
          <div className={styles.sameLine} key={deliveryIndex}>
            {(() => {
              let tempPlan = null;
              if (this.state.unlogin_plans === null) {
                tempPlan = this.props.plans;
              } else {
                tempPlan = this.state.unlogin_plans;
              }
              return (
                <div style={{ display: "inline-block" }}>
                  <button
                    disabled={active}
                    className={
                      (this.props.paymentOption === deliveryIndex
                        ? selectedPaymentOption
                        : deselectedPaymentOption) +
                      " " +
                      (active && styles.disabledBtn)
                    }
                    onClick={() => {
                      this.props.choosePaymentOption(
                        deliveryIndex,
                        this.props.meals,
                        tempPlan
                      );
                      // console.log("##### deliveryIndex: " + deliveryIndex);
                      // console.log("##### meals: " + this.props.meals);
                    }}
                    aria-label={ariaTag}
                    title={ariaTag}
                  >
                    <span style={{ fontSize: "35px" }}>{deliveryIndex}</span>
                    <br></br>
                    {(() => {
                      if (typeof discount !== "undefined" && discount > 0) {
                        return <span>(Save {discount}%)</span>;
                      }
                    })()}
                  </button>
                  {(() => {
                    if (deliveryIndex % this.state.numDeliveryDays === 0) {
                      return (
                        <div className={styles.deliverySubtext}>
                          {(() => {
                            if (
                              deliveryIndex / this.state.numDeliveryDays ===
                              1
                            ) {
                              return (
                                <>
                                  {deliveryIndex / this.state.numDeliveryDays}{" "}
                                  WEEK
                                </>
                              );
                            } else {
                              return (
                                <>
                                  {deliveryIndex / this.state.numDeliveryDays}{" "}
                                  WEEKS
                                </>
                              );
                            }
                          })()}
                        </div>
                      );
                    }
                  })()}
                </div>
              );
            })()}
          </div>
        );
      }
    }
    // console.log("paymentOptionButtons length: ", paymentOptionButtons.length);

    return paymentOptionButtons;
  };

  calculateTotal = () => {
    let calculatedTotal = (
      this.props.selectedPlan.item_price *
      this.props.selectedPlan.num_deliveries *
      (1 - this.props.selectedPlan.delivery_discount * 0.01)
    ).toFixed(2);
    return calculatedTotal;
  };

  calculateDeal = () => {
    let total = parseFloat(this.calculateTotal());

    let deal = (
      total /
      (this.props.selectedPlan.num_items *
        this.props.selectedPlan.num_deliveries)
    ).toFixed(2);

    return deal;
  };

  proceedToPayment = () => {
    this.props.history.push("/payment-details");
  };

  render() {
    if (!this.state.mounted) {
      return null;
    }
    return (
      <>
        {/* For debugging window size */}
        {/* <span 
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
          Height: {this.state.windowHeight}px
          <br />
          Width: {this.state.windowWidth}px
        </span> */}

        <WebNavBar
          poplogin={this.togglePopLogin}
          popSignup={this.togglePopSignup}
        />

        {this.state.login_seen ? (
          <PopLogin toggle={this.togglePopLogin} />
        ) : null}
        {this.state.signUpSeen ? (
          <Popsignup toggle={this.togglePopSignup} />
        ) : null}

        <div className={styles.sectionHeaderUL}>Pick a Plan</div>

        <div className={styles.container}>
          <div className={styles.box}>
            <div className={styles.box1}>
              <div className={styles.logo}>
                <p style={{ color: "black" }}>
                  {" "}
                  MEAL DELIVERIES ARE ON
                  <br></br>
                  {
                    <span style={{ fontWeight: "900" }}>
                      {this.showDeliveryDates()}
                    </span>
                  }
                </p>
              </div>

              <div className={styles.menuSection}>
                <div className={styles.center}>
                  <span className={styles.subHeader}>
                    NUMBER OF MEALS PER DELIVERY
                  </span>
                </div>
                {(() => {
                  if (JSON.stringify(this.props.plans) !== "{}") {
                    return (
                      <div className={styles.buttonWrapper}>
                        {this.mealsDelivery()}
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
                  if (JSON.stringify(this.props.plans) === "{}") {
                  } else {
                    return (
                      <div className="row" style={{ marginTop: "20px" }}>
                        {this.paymentFrequency2()}
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sectionHeader}>Subtotal</div>

        <div className={styles.container}>
          <div className={styles.box}>
            <div className={styles.box1}>
              <div className={styles.menuSection}>
                {(() => {
                  if (JSON.stringify(this.props.selectedPlan) !== "{}") {
                    let ariaTag =
                      "Your current plan includes " +
                      this.props.selectedPlan.num_items +
                      " meals for $" +
                      this.calculateTotal() +
                      ". That's only $" +
                      this.calculateDeal() +
                      " per freshly cooked meal.";
                    return (
                      // <div>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          // border: 'inset'
                        }}
                      >
                        {/* <div 
                            style={{
                              display: 'inline-block', 
                              border: 'solid', 
                              borderColor: 'red',
                              width: '100%',
                              textAlign: 'center'
                            }}
                          > */}
                        {this.state.windowWidth < 1100 ? (
                          <>
                            <div
                              style={{
                                display: "inline-block",
                                // border: 'solid',
                                // borderColor: 'red',
                                width: "100%",
                                textAlign: "center",
                                marginBottom: "50px",
                              }}
                            >
                              <div>
                                <span className={styles.priceFormula}>
                                  {this.props.selectedPlan.num_items}
                                </span>
                                <span className={styles.priceSubtext}>
                                  Meals
                                </span>
                              </div>
                              <div style={{ marginTop: "30px" }}>
                                <span className={styles.priceFormula}>
                                  {this.props.selectedPlan.num_deliveries}
                                </span>
                                <span className={styles.priceSubtext}>
                                  Deliveries
                                </span>
                              </div>
                              <div style={{ marginTop: "30px" }}>
                                <span className={styles.priceFormula}>
                                  -{this.props.selectedPlan.delivery_discount}%
                                </span>
                                <span className={styles.priceSubtext}>
                                  Discount applied
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  width: "100%",
                                  // border: 'dashed',
                                  justifyContent: "center",
                                }}
                              >
                                <div className={styles.priceTotalNarrow}>
                                  {/* <div style={{display: 'inline-flex'}}> */}
                                  <div className={styles.priceFormula}>
                                    {this.props.selectedPlan.num_items *
                                      this.props.selectedPlan.num_deliveries}
                                  </div>

                                  <div className={styles.priceFormula2narrow}>
                                    meals for
                                  </div>

                                  <br />

                                  <div className={styles.priceFormula}>
                                    ${this.calculateTotal()}
                                  </div>
                                  {/* </div> */}
                                </div>
                              </div>
                              <div className={styles.perMealDeal}>
                                That's only ${this.calculateDeal()} per freshly
                                cooked meal
                              </div>
                              <div className={styles.proceedWrapper}>
                                <button
                                  className={styles.proceedBtn}
                                  disabled={!this.state.profileLoaded}
                                  onClick={() => {
                                    this.proceedToPayment();
                                  }}
                                  aria-label={ariaTag}
                                  title={ariaTag}
                                >
                                  PROCEED
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div
                            style={{
                              display: "inline-block",
                              // border: 'solid',
                              // borderColor: 'green',
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            <div className={styles.priceCalculation}>
                              <div>
                                <span className={styles.priceFormula}>
                                  {this.props.selectedPlan.num_items}
                                </span>
                                <br></br>
                                <span className={styles.priceSubtext}>
                                  Meals
                                </span>
                              </div>
                              <div className={styles.priceSpaceSmall} />
                              <div>
                                <span className={styles.priceFormula}>
                                  {this.props.selectedPlan.num_deliveries}
                                </span>
                                <br></br>
                                <span className={styles.priceSubtext}>
                                  Deliveries
                                </span>
                              </div>
                              <div className={styles.priceSpaceSmall} />
                              <div>
                                <span className={styles.priceFormula}>
                                  -{this.props.selectedPlan.delivery_discount}%
                                </span>
                                <br></br>
                                <span className={styles.priceSubtext}>
                                  Discount applied
                                </span>
                              </div>
                              <div className={styles.priceSpaceSmall} />

                              <div style={{ display: "inline-block" }}>
                                <div className={styles.priceTotal}>
                                  <div style={{ display: "inline-flex" }}>
                                    <div className={styles.priceFormula}>
                                      {this.props.selectedPlan.num_items *
                                        this.props.selectedPlan.num_deliveries}
                                    </div>

                                    <div className={styles.priceFormula2}>
                                      meals for
                                    </div>

                                    <div className={styles.priceFormula}>
                                      ${this.calculateTotal()}
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.perMealDeal}>
                                  That's only ${this.calculateDeal()} per
                                  freshly cooked meal
                                </div>
                                <div className={styles.proceedWrapper}>
                                  <button
                                    className={styles.proceedBtn}
                                    disabled={!this.state.profileLoaded}
                                    onClick={() => {
                                      this.proceedToPayment();
                                    }}
                                    aria-label={ariaTag}
                                    title={ariaTag}
                                  >
                                    PROCEED
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div className={styles.priceWaitMessage}>
                        Select a meal plan and deliveries to see your discount.
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

ChoosePlan.propTypes = {
  fetchPlans: PropTypes.func.isRequired,
  chooseMealsDelivery: PropTypes.func.isRequired,
  choosePaymentOption: PropTypes.func.isRequired,
  numItems: PropTypes.array.isRequired,
  paymentFrequency: PropTypes.array.isRequired,
  meals: PropTypes.string.isRequired,
  paymentOption: PropTypes.string.isRequired,
  selectedPlan: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  plans: state.subscribe.plans,
  numItems: state.subscribe.numItems,
  paymentFrequency: state.subscribe.paymentFrequency,
  meals: state.subscribe.meals,
  paymentOption: state.subscribe.paymentOption,
  selectedPlan: state.subscribe.selectedPlan,
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
  cc_num: state.subscribe.creditCard.number,
  cc_cvv: state.subscribe.creditCard.cvv,
  cc_zip: state.subscribe.creditCard.zip,
  cc_month: state.subscribe.creditCard.month,
  cc_year: state.subscribe.creditCard.year,
  phone: state.subscribe.addressInfo.phoneNumber,
  instructions: state.subscribe.deliveryInstructions,
  password: state.subscribe.paymentPassword,
  address: state.subscribe.address,
});

export default connect(mapStateToProps, {
  fetchPlans,
  chooseMealsDelivery,
  choosePaymentOption,
  fetchProfileInformation,
  changeAddressFirstName,
  changeAddressLastName,
  changeAddressStreet,
  changeAddressUnit,
  changeAddressCity,
  changeAddressState,
  changeAddressZip,
  changeAddressPhone,
  changeDeliveryInstructions,
  changePaymentPassword,
  changeCardNumber,
  changeCardCvv,
  changeCardMonth,
  changeCardYear,
  changeCardZip,
  submitPayment,
})(withRouter(ChoosePlan));
