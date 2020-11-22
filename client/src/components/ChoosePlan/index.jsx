import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
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
  submitPayment
} from "../../reducers/actions/subscriptionActions";

import axios from "axios";
import {API_URL} from "../../reducers/constants";
import {Link} from "react-router-dom";
import {withRouter} from "react-router";
import styles from "./choosePlan.module.css";
import menuStyles from "../Menu/menu.module.css";
import {WebNavBar, BottomNavBar} from "../NavBar";
import Menu from "../Menu";
import takeaway from "./static/take-away.svg";
import chooseMeals from "./static/choose_meals.svg";
import prepay from "./static/prepay.png";
import delivery from "./static/delivery.png";
import one from "./static/one.svg";
import two from "./static/two.svg";
import three from "./static/three.svg";

import paymentOption1 from "./Group 2029.svg";
import paymentOption2 from "./Group 2016.svg";
import paymentOption3 from "./Group 2030.svg";

class ChoosePlan extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false
    };
  }

  componentDidMount() {
    let queryString = this.props.location.search;
    let urlParams = new URLSearchParams(queryString);
    // Clear Query parameters
    window.history.pushState({}, document.title, window.location.pathname);
    // Logged in from Apple
    if (urlParams.has("customer_uid")) {
      let customer_uid = urlParams.get("customer_uid");
      document.cookie = "customer_uid=" + customer_uid;
      axios
        .get(API_URL + "customer_lplp", {
          params: {
            customer_uid: customer_uid
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.result !== undefined) {
            // this.props.history.push("/select-meal");
            this.props.fetchProfileInformation(customer_uid);
          }
          this.props.fetchPlans();
          this.setState({
            mounted: true
          });
        })
        .catch(err => {
          console.log(err);
          if (err.response) {
            console.log(err.response);
          }
        });
    }
    // Check for logged in
    else if (
      document.cookie
        .split(";")
        .some(item => item.trim().startsWith("customer_uid="))
    ) {
      let customer_uid = document.cookie
        .split("; ")
        .find(item => item.startsWith("customer_uid="))
        .split("=")[1];
      this.props.fetchProfileInformation(customer_uid);
      this.props.fetchPlans();
      this.setState({
        mounted: true
      });
    } else {
      // Reroute to log in page
      this.props.history.push("/");
    }
  }

  mealsDelivery = () => {
    let deselectedMealButton = styles.mealButton;
    let selectedMealButton =
      styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];
    for (const plan of this.props.numItems) {
      let planStr = plan.toString();
      mealButtons.push(
        <button
          key={planStr}
          className={
            this.props.meals === planStr
              ? selectedMealButton
              : deselectedMealButton
          }
          onClick={() =>
            this.props.chooseMealsDelivery(
              planStr,
              this.props.paymentOption,
              this.props.plans
            )
          }
        >
          {planStr} MEALS
        </button>
      );
    }
    return mealButtons;
  };

  paymentFrequency = () => {
    let myArr = [paymentOption1, paymentOption2, paymentOption3];
    let deselectedPaymentOption = styles.paymentButton;
    let selectedPaymentOption =
      styles.paymentButton + " " + styles.paymentButtonSelected;
    let paymentOptionButtons = [];
    for (const [i, option] of this.props.paymentFrequency.entries()) {
      let optionStr = option.toString();
      paymentOptionButtons.push(
        <img
          src={myArr[i]}
          key={optionStr}
          className={
            this.props.paymentOption === optionStr
              ? selectedPaymentOption
              : deselectedPaymentOption
          }
          onClick={() =>
            this.props.choosePaymentOption(
              optionStr,
              this.props.meals,
              this.props.plans
            )
          }
        >
          {/* {optionStr} */}
        </img>
      );
    }
    return paymentOptionButtons;
  };
  paymentFrequency2 = () => {
    let myArr = [
      {image: paymentOption1, desc: "WEEKLY"},
      {image: paymentOption2, desc: "FOR 2 WEEKS"},
      {image: paymentOption3, desc: "FOR 4 WEEKS"}
    ];
    let deselectedPaymentOption = styles.box2;
    let selectedPaymentOption = styles.box2 + " " + styles.ButtonSelected;
    let paymentOptionButtons = [];

    for (const [i, option] of this.props.paymentFrequency.entries()) {
      let active = false;
      let optionStr = option.toString();
      if (this.props.meals === "") {
        active = true;
      } else {
        active = false;
      }
      paymentOptionButtons.push(
        <div className={styles.sameLine} key={i}>
          <button
            disabled={active}
            className={
              (this.props.paymentOption === optionStr
                ? selectedPaymentOption
                : deselectedPaymentOption) +
              " " +
              (active && styles.disabledBtn)
            }
            onClick={() =>
              this.props.choosePaymentOption(
                optionStr,
                this.props.meals,
                this.props.plans
              )
            }
          >
            <img src={myArr[i].image} />
            <p>{myArr[i].desc}</p>
          </button>
        </div>
      );
    }
    return paymentOptionButtons;
  };

  render() {
    if (!this.state.mounted) {
      return null;
    }
    let message = (
      <div className={menuStyles.logo}>
        <img src={takeaway} alt='Logo' />
        <p style={{color: "black"}}>
          {" "}
          MEALS DELIVERIES ARE
          <span style={{color: "#FF9E19"}}> MONDAY,WEDNESDAY,FRIDAY</span>
        </p>
      </div>
    );
    return (
      /*for mobile's screen*/
      <>
        <div className={styles.mobile}>
          <div className={styles.root}>
            <div className={styles.mealHeader}>
              <p
                style={{
                  flex: "6",
                  textAlign: "center",
                  fontSize: "22px",
                  color: "black",
                  fontWeight: "bold",
                  paddingLeft: "50px"
                }}
              >
                CHOOSE MEAL PLAN
              </p>

              {/* <p id={styles.local}>LOCAL. ORGANIC. RESPONSIBLE.</p> */}
              <div className={styles.avatar}></div>
            </div>
            <div
              style={{
                alignSelf: "center",
                marginTop: "1rem",
                paddingBottom: "6rem",
                margin: "2rem",
                borderRadius: "15px",
                boxShadow: "1px 1px 1px 2px #d3d3d3 "
              }}
            >
              <div className={styles.mealSelectMenu}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "1rem",
                    padding: "10px"
                  }}
                >
                  <img
                    style={{height: "50px", width: "50px"}}
                    src={takeaway}
                    alt='React Logo'
                  />
                  <div style={{display: "flex", flexDirection: "column"}}>
                    <h6 style={{margin: "0px 2px"}}>MEALS DELIVERIES ARE</h6>
                    <h6 style={{margin: "0px 2px", color: "#FF9E19"}}>
                      MONDAY,WEDNESDAY,FRIDAY
                    </h6>
                  </div>
                </div>
                <div style={{textAlign: "center"}}>
                  <h6 className={styles.subTitle}>
                    NUMBER OF MEALS PER DELIVERY
                  </h6>
                </div>
                <div className={styles.mealNumber}>
                  <div className={styles.buttonWrapper}>
                    {this.mealsDelivery()}
                  </div>
                </div>
                <hr style={{color: "#FFBA00"}} />
                <p
                  style={{
                    color: "black",
                    fontSize: "1.3rem",
                    fontWeight: "600",
                    margin: "0rem",
                    paddingLeft: "0.7rem"
                  }}
                >
                  PRE PAY OPTIONS
                </p>
                <div className={styles.paymentWrapper}>
                  {this.paymentFrequency2()}
                </div>
                <div className={styles.amount}>
                  <p
                    style={{
                      padding: "11px 0px 0px 0px",
                      height: "40px",
                      textAlign: "center",
                      backgroundColor: "#FFF0C6",
                      fontSize: "large",
                      fontWeight: "600",
                      color: "black"
                    }}
                    className={styles.amountItem}
                  >
                    {" "}
                    $$ TOTAL {this.props.selectedPlan.item_price}{" "}
                  </p>
                  <Link to='/payment-details'>
                    <button
                      style={{
                        textAlign: "center",
                        backgroundColor: "#FF9E19",
                        fontSize: "large",
                        fontWeight: "400",
                        color: "white"
                      }}
                      className={styles.amountItem}
                    >
                      PROCEED
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <BottomNavBar />
          </div>
        </div>
        {/* For Full Screen */}
        <div className={styles.full_screen}>
          <WebNavBar login={true} logOut={this.logOut} />
          <div className={styles.container}>
            <Menu show={true} message={message} />
            <div className={styles.box}>
              <div className={styles.box1}>
                <h5>
                  GET SUBSCRIBE BY SELECTING YOUR MEAL PLAN AND PAYMENT OPTIONS
                </h5>

                <div className='row'>
                  <div className='col'>
                    <div className='row'>
                      <div className='col'>
                        <img
                          src={chooseMeals}
                          alt='Choose Meals'
                          className={styles.center}
                        />
                      </div>
                      <div className='col'>
                        <img
                          src={prepay}
                          alt='Prepay'
                          className={styles.center}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='col pl-5'>
                    <img src={delivery} alt='delivery' />
                  </div>
                </div>

                <div className='row'>
                  <div className='col'>
                    <div className='row'>
                      <div className='col'>
                        <div className='row'>
                          <div className={styles.center}>
                            <img src={one} alt='one' className={styles.forty} />
                            <span className={styles.bold}>
                              CHOOSE MEAL PLANS
                            </span>
                          </div>
                        </div>
                        <div className={"row " + styles.center}>
                          <div className={styles.mealNumber}>
                            <div className={styles.buttonWrapper}>
                              {this.mealsDelivery()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col'>
                        <div className='row'>
                          <div className={styles.center}>
                            <img src={two} alt='two' className={styles.forty} />
                            <span className={styles.bold}>PREPAY OPTIONS</span>
                          </div>
                        </div>
                        <div className='row'>{this.paymentFrequency2()}</div>
                      </div>
                    </div>
                  </div>
                  <div className='col pl-5'>
                    <div className={"row"}>
                      {/* <div className={styles.center}> */}
                      <img src={three} alt='three' className={styles.forty} />
                      <span className={styles.bold}>DELIVERY INFORMATION</span>
                      {/* </div> */}
                    </div>
                    <div className={"row " + styles.center}>
                      <form>
                        <div className='row'>
                          <div className='col'>
                            <div className='row'>
                              <div className='col px-1'>
                                <input
                                  type='text'
                                  name='firstName'
                                  value={this.props.firstName}
                                  className={styles.inputBox}
                                  placeholder='First Name'
                                  onChange={e =>
                                    this.props.changeAddressFirstName(
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className='col px-1'>
                                <input
                                  type='text'
                                  value={this.props.lastName}
                                  className={styles.inputBox}
                                  placeholder='Last Name'
                                  onChange={e =>
                                    this.props.changeAddressLastName(
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col px-1'>
                                <input
                                  type='email'
                                  value={this.props.email}
                                  className={styles.inputBox}
                                  placeholder='Email'
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col px-1'>
                                <input
                                  type='text'
                                  value={this.props.street}
                                  className={styles.inputBox}
                                  placeholder='Street'
                                  onChange={e =>
                                    this.props.changeAddressStreet(
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col px-1'>
                                <input
                                  type='text'
                                  className={styles.inputBox}
                                  placeholder='Unit'
                                  value={this.props.unit}
                                  onChange={e =>
                                    this.props.changeAddressUnit(e.target.value)
                                  }
                                />
                              </div>
                              <div className='col px-1'>
                                <input
                                  type='text'
                                  className={styles.inputBox}
                                  placeholder='City'
                                  value={this.props.city}
                                  onChange={e =>
                                    this.props.changeAddressCity(e.target.value)
                                  }
                                />
                              </div>
                              <div className='col px-1'>
                                <input
                                  type='text'
                                  className={styles.inputBox}
                                  placeholder='State'
                                  value={this.props.state}
                                  onChange={e =>
                                    this.props.changeAddressState(
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-4 px-1'>
                                <input
                                  type='text'
                                  className={styles.inputBox}
                                  placeholder='Zip'
                                  value={this.props.zip}
                                  onChange={e =>
                                    this.props.changeAddressZip(e.target.value)
                                  }
                                />
                              </div>
                              <div className='col px-1'>
                                <input
                                  type='text'
                                  className={styles.inputBox}
                                  placeholder='Phone Number'
                                  value={this.props.phone}
                                  onChange={e =>
                                    this.props.changeAddressPhone(
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col px-1'>
                                <textarea
                                  className={styles.inputBox}
                                  style={{
                                    borderRadius: "7px",
                                    padding: "0px",
                                    fontSize: "12px",
                                    minHeight: "100px"
                                  }}
                                  placeholder='Delivery Instruction'
                                  value={this.props.instructions}
                                  onChange={e =>
                                    this.props.changeDeliveryInstructions(
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className='col'>
                            <div className='row'>
                              <div className='col px-1'>
                                <input
                                  className={styles.inputBox}
                                  placeholder='Credit Card Number'
                                  value={this.props.cc_num}
                                  onChange={e =>
                                    this.props.changeCardNumber(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col px-1'>
                                <input
                                  className={styles.inputBox}
                                  placeholder='CVC/CVV'
                                  value={this.props.cc_cvv}
                                  onChange={e =>
                                    this.props.changeCardCvv(e.target.value)
                                  }
                                />
                              </div>
                              <div className='col px-1'>
                                <input
                                  className={styles.inputBox}
                                  placeholder='Zip'
                                  value={this.props.cc_zip}
                                  onChange={e =>
                                    this.props.changeCardZip(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col px-1'>
                                <input
                                  className={styles.inputBox}
                                  placeholder='Month'
                                  value={this.props.cc_month}
                                  onChange={e =>
                                    this.props.changeCardMonth(e.target.value)
                                  }
                                />
                              </div>
                              <div className='col px-1'>
                                <input
                                  className={styles.inputBox}
                                  placeholder='Year'
                                  value={this.props.cc_year}
                                  onChange={e =>
                                    this.props.changeCardYear(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            {this.props.socialMedia === "NULL" && (
                              <div className='row'>
                                <input
                                  type='password'
                                  className={styles.inputBox}
                                  placeholder='password'
                                  value={this.props.password}
                                  onChange={e =>
                                    this.props.changePaymentPassword(
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <p className={styles.totalBtn}>
                    $ {this.props.selectedPlan.item_price}
                  </p>
                  <button
                    className={styles.finishBtn}
                    onClick={() =>
                      this.props.submitPayment(
                        this.props.email,
                        this.props.customerId,
                        this.props.socialMedia,
                        this.props.password,
                        this.props.firstName,
                        this.props.lastName,
                        this.props.phone,
                        this.props.street,
                        this.props.unit,
                        this.props.city,
                        this.props.state,
                        this.props.zip,
                        this.props.instructions,
                        this.props.selectedPlan,
                        () => {
                          this.props.history.push("/meal-plan");
                        }
                      )
                    }
                  >
                    {" "}
                    FINISH{" "}
                  </button>
                </div>
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
  selectedPlan: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
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
  password: state.subscribe.paymentPassword
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
  submitPayment
})(withRouter(ChoosePlan));
