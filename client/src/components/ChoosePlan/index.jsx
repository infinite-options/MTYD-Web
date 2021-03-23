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
import PaymentDetails from "../PaymentDetails";
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
    //console.log("choose-plan props: " + JSON.stringify(this.props));
    console.log("choose-plan address props: " + JSON.stringify(this.props.address));
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
        axios.get(API_URL + 'Profile/' + customer_uid)
        .then(res => {
          // console.log(res.data.result[0])
          let data = res.data.result[0]
          this.props.changeAddressFirstName(data.customer_first_name)
          this.props.changeAddressLastName(data.customer_last_name)
          this.props.changeAddressStreet(data.customer_address)
          this.props.changeAddressUnit(data.customer_unit)
          this.props.changeAddressCity(data.customer_city)
          this.props.changeAddressState(data.customer_state)
          this.props.changeAddressZip(data.customer_zip)
          this.props.changeAddressPhone(data.customer_phone_num)
          console.log("(2) choose-plan address props: " + JSON.stringify(this.props.address));
        })
        .catch(err => {
          console.log(err)
        })
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
      axios.get(API_URL + 'Profile/' + customer_uid)
        .then(res => {
          let data = res.data.result[0]
          this.props.changeAddressFirstName(data.customer_first_name)
          this.props.changeAddressLastName(data.customer_last_name)
          this.props.changeAddressStreet(data.customer_address)
          this.props.changeAddressUnit(data.customer_unit)
          this.props.changeAddressCity(data.customer_city)
          this.props.changeAddressState(data.customer_state)
          this.props.changeAddressZip(data.customer_zip)
          this.props.changeAddressPhone(data.customer_phone_num)
          console.log("(3) choose-plan address props: " + JSON.stringify(this.props.address));
        })
        .catch(err => {
          console.log(err)
        })
      this.setState({
        mounted: true
      });
    } else {
      // Reroute to log in page
      console.log("Choose-plan NOT LOGGED IN");
      this.setState({
        mounted: true
      });
      //this.props.history.push("/");
    }

  }

  mealsDelivery = () => {
    let deselectedMealButton = styles.mealButton;
    let selectedMealButton =
    styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];
    for (var numMeals = 2; numMeals<=6; numMeals++) {
      let planStr = numMeals.toString();
      mealButtons.push(
        <div className={styles.mealButtonWrapper}>
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
        <div style={{textAlign: 'center', marginTop: '10px'}}>
          ${numMeals * 12}
        </div>
        </div>
      );
    }
    return mealButtons;
  };
  paymentFrequency2 = () => {
    let deselectedPaymentOption = styles.deliveryButton;
    let selectedPaymentOption = styles.deliveryButton + " " + styles.deliveryButtonSelected;
    let paymentOptionButtons = [];
    //console.log("PLANS: " + JSON.stringify(this.props.plans));
      
    for (var numDeliveries = 1; numDeliveries<=10; numDeliveries++) {
      let active = false;
      let optionStr = numDeliveries.toString();
      if (this.props.meals === "") {
        active = true;
      } else {
        active = false;
      }
        
      var discounts = this.props.plans["2"];
      var discount = null;
        
      try{
        discount = discounts[numDeliveries].delivery_discount;
        //console.log("discount: " + discount);
      } catch(e) {
        console.log("discount undefined");
      }
        
      paymentOptionButtons.push(
        <div className={styles.sameLine} key={numDeliveries}>
          {(() => {
            if (numDeliveries % 3 !== 0) {
              return (
                <button
                  disabled={active}
                  className={
                    (this.props.paymentOption === optionStr
                      ? selectedPaymentOption
                      : deselectedPaymentOption) +
                    " " + (active && styles.disabledBtn)
                  }
                  onClick={() => {
                    this.props.choosePaymentOption(
                      optionStr,
                      this.props.meals,
                      this.props.plans
                    )
                  }}
                >
                  <span style={{fontSize: '35px'}}>
                    {numDeliveries}
                  </span>
                  <br></br>
                  {(() => {
                    if (typeof(discount) !== "undefined" && discount > 0) {
                      return (
                        <span>(Save {discount}%)</span>
                      );
                    }
                  })()}  
                </button>
              );
            } else if (numDeliveries % 3 === 0) {
              return (
                <div style={{display: 'inline-block'}}>
                <button
                  disabled={active}
                  className={
                    (this.props.paymentOption === optionStr
                      ? selectedPaymentOption
                      : deselectedPaymentOption) +
                    " " + (active && styles.disabledBtn)
                  }
                  onClick={() => {
                    this.props.choosePaymentOption(
                      optionStr,
                      this.props.meals,
                      this.props.plans
                    )
                  }}
                >
                  <span style={{fontSize: '35px'}}>
                    {numDeliveries}
                  </span>
                  <br></br>
                  {(() => {
                    if (typeof(discount) !== "undefined" && discount > 0) {
                      return (
                        <span>(Save {discount}%)</span>
                      );
                    }
                  })()}  
                </button>
                  <div className={styles.deliverySubtext}>
                    {(() => {
                      if (numDeliveries/3 === 1) {
                        return (
                          <>
                            {numDeliveries/3} WEEK
                          </>
                        );
                      } else {
                        return (
                          <>
                            {numDeliveries/3} WEEKS
                          </>
                        );
                      }
                    })()}
                  </div>
                </div>
              );
            }
          })()}     
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
    console.log("===== SELECTED PLAN: " + JSON.stringify(this.props.selectedPlan));
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
          <WebNavBar />
          <div className={styles.container}>
            <Menu show={true} message={message} />
            <div className={styles.box}>
              <div className={styles.box1}>

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
                  
                        <div className={styles.menuSection}>
                          <div className={styles.center}>
                            <span className={styles.bold}>
                              MEALS PER DELIVERY
                            </span>
                          </div>
                          <div className={styles.buttonWrapper}>
                            {this.mealsDelivery()}
                          </div>
                        </div>
                  
                        <div className={styles.menuSection}>
                          <div className={styles.center}>
                            <span className={styles.bold}>
                              NUMBER OF DELIVERIES
                            </span>
                          </div>
                          <div className='row' style={{marginTop: '20px'}}>
                            {this.paymentFrequency2()}
                          </div>
                        </div>
                  
                        <div className={styles.menuSection}>
                            
                                                {(() => {
                      if (JSON.stringify(this.props.selectedPlan) !== '{}') {
                        return (
                            
                            <>
                            
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
                            <div className={styles.priceSymbol}>
                              x
                            </div>
                            <div>
                              <span className={styles.priceFormula}>
                                {this.props.selectedPlan.num_deliveries} 
                              </span>
                              <br></br>
                              <span className={styles.priceSubtext}>
                                Deliveries
                              </span>
                            </div>
                            <div className={styles.priceSymbol}>
                              -
                            </div>
                            <div>
                              <span className={styles.priceFormula}>
                                {this.props.selectedPlan.delivery_discount}%
                              </span>
                              <br></br>
                              <span className={styles.priceSubtext}>
                                Discount
                              </span>
                            </div>
                            <div className={styles.priceSymbol}>
                              =
                            </div>
                            <div>
                              <span className={styles.priceFormula}>
                                ${(
                                this.props.selectedPlan.item_price *
                                this.props.selectedPlan.num_deliveries *
                                (1-(this.props.selectedPlan.delivery_discount*0.01))
                                ).toFixed(2)}
                              </span>
                              <br></br>
                              <span className={styles.priceSubtext}>
                                Total
                              </span>
                            </div>
                          </div>
                            
<div className={styles.proceedWrapper}>
                  <Link className={styles.proceedBtn} to='/payment-details'>
                    PROCEED
                  </Link>
                </div> 
                            
                            </>
                            
                        );
                      } else {
                        return (
                          <div className={styles.priceCalculation}>
                            <div className={styles.priceWaitMessage}>
                              Select a meal plan and deliveries to see your discount.
                            </div>
                          </div>
                        );
                      }
                    })()}
                            
                        </div>
                  
              </div>
                
                {/*<div className={styles.proceedWrapper}>
                  <Link className={styles.proceedBtn} to='/payment-details'>
                    PROCEED
                  </Link>
                </div> */}
                
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
  password: state.subscribe.paymentPassword,
  address: state.subscribe.address
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
