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

import PopLogin from '../PopLogin';
import Popsignup from '../PopSignup';



class ChoosePlan extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
      unlogin_plans:null,
      plansFetched: false,
      customerUid: "",
      loggedIn: false,
      deliveryDays: [],
      login_seen:false,
      signUpSeen:false
    };
  }

  togglePopLogin = () => {
    this.setState({
     login_seen: !this.state.login_seen,
    });

    if(!this.state.login_seen){
      this.setState({
        signUpSeen:false
      })
    }

   };

   togglePopSignup = () => {
    this.setState({
     signUpSeen: !this.state.signUpSeen
    });

    if(!this.state.signUpSeen){
      this.setState({
        login_seen:false
      })
    }
   };
  

  // http://localhost:2000/api/v2/delivery_weekdays
  // https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/delivery_weekdays

  componentDidMount() {
    console.log("choose-plan props: " + JSON.stringify(this.props));
    console.log(this.props)
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
            mounted: true,
            customerUid: customer_uid,
            loggedIn: true
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
        mounted: true,
        customerUid: customer_uid,
        loggedIn: true
      });
    } else {
      // Reroute to log in page
      console.log("Choose-plan NOT LOGGED IN");
      this.props.fetchPlans();
      this.setState({
        mounted: true,
        customerUid: "NULL",
        loggedIn: false
      });
      //this.props.history.push("/");
    }

    // Fetch delivery days
    axios.get(API_URL + 'delivery_weekdays')
      .then(res => {
        // console.log(res.data.result[0])
        let resultDays = res.data.result;
        console.log("delivery_weekdays response: " + JSON.stringify(resultDays));
        this.setState({
          deliveryDays: resultDays
        });
      })
      .catch(err => {
        console.log(err)
      })
  }

  /*componentDidUpdate(plans) {
    console.log("new plans: " + JSON.stringify(plans));
    console.log("new plans[2]: " + JSON.stringify(plans[2]));
    this.setState({
      plansFetched: true
    });
  }*/

  showDeliveryDates = () => {
    let messageDays = [];

    for (const [dateKey, dateData] of Object.entries(this.state.deliveryDays)) {
      console.log("showDeliveryDates() key: " + dateKey + ", dateData: " + JSON.stringify(dateData));
      //console.log("weekday integer: " + dateData["weekday(menu_date)"]);

      let dayInt = dateData["weekday(menu_date)"];

      console.log("weekday int: " + dayInt);

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

      if(messageDays.includes(dayString) === false) {
        messageDays.push(dayString);
      }
    }

    let deliveryDaysString = " ";

    for(var i = 0; i < messageDays.length; i++) {
      if(i === messageDays.length-1){
        deliveryDaysString = deliveryDaysString.concat(messageDays[i]);
      } else {
        deliveryDaysString = deliveryDaysString.concat(messageDays[i] + ", ");
      }
      //deliveryDaysString = deliveryDaysString.concat(messageDays[i] + ", ");
    }

    console.log("final deliveryDaysString: " + deliveryDaysString);

    return deliveryDaysString;
  }

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

      mealButtons.push(
        <div className={styles.mealButtonWrapper}>
        <button
          key={mealIndex}
          className={
            this.props.meals === mealIndex
              ? selectedMealButton
              : deselectedMealButton
          }
          onClick={() =>
            this.props.chooseMealsDelivery(
              mealIndex,
              this.props.paymentOption,
              this.props.plans
            )
          }
        >
          {mealIndex} MEALS
        </button>
        <div style={{textAlign: 'center', marginTop: '10px'}}>
          ${singleMealData.item_price}
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
    console.log(this.props.plans);
    console.log(this.state.unlogin_plans);
      
    var discounts = this.props.plans[2];
    var discount = null;

    console.log("discounts: " + discounts);
    console.log("typeof(discounts) " + typeof(discounts));

    if(typeof(discounts) !== "undefined"){
    for (const [deliveryIndex, deliveryData] of Object.entries(discounts)) {
      let active = false;
      if (this.props.meals === "") {
        active = true;
      } else {
        active = false;
      }
        
      try{
        discount = discounts[deliveryIndex].delivery_discount;
        // console.log("discount: " + discount);
      } catch(e) {
        // console.log("discount UNDEFINED");
      }
        
      paymentOptionButtons.push(
        <div className={styles.sameLine} key={deliveryIndex}>
          {(() => {
              let tempPlan = null;
              if(this.state.unlogin_plans===null){
                tempPlan=this.props.plans
              }
              else{
                tempPlan = this.state.unlogin_plans
              }
              return (
                <div style={{display: 'inline-block'}}>
                  <button
                  disabled={active}
                  className={
                    (this.props.paymentOption === deliveryIndex
                      ? selectedPaymentOption
                      : deselectedPaymentOption) +
                    " " + (active && styles.disabledBtn)
                  }
                  onClick={() => {
                    this.props.choosePaymentOption(
                      deliveryIndex,
                      this.props.meals,
                      tempPlan
                    )
                  }}
                >
                  <span style={{fontSize: '35px'}}>
                    {deliveryIndex}
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
                  {(()=>{
                    if(deliveryIndex % 3 === 0){
                      console.log("is 3");
                      return(
                        <div className={styles.deliverySubtext}>
                          {(() => {
                            if (deliveryIndex/3 === 1) {
                              return (
                                <>
                                  {deliveryIndex/3} WEEK
                                </>
                              );
                            } else {
                              return (
                                <>
                                  {deliveryIndex/3} WEEKS
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
    }}
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
          {/*<span style={{color: "#FF9E19"}}> MONDAY,WEDNESDAY,FRIDAY</span>*/}
          <br></br>
          {<span style={{color: "#FF9E19"}}>{this.showDeliveryDates()}</span>}
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
                  {(()=>{
                    if(JSON.stringify(this.props.plans) === "{}"){
                      console.log("(mobile) meals not yet fetched");
                    } else {
                      console.log("(mobile) meals fetched!");
                      return(
                        <div className={styles.buttonWrapper}>
                          {this.mealsDelivery()}
                        </div>
                      );
                    }
                  })()}
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
                {(()=>{
                  if(JSON.stringify(this.props.plans) === "{}"){
                    console.log("(mobile) plans not yet fetched");
                  } else {
                    console.log("(mobile) plans fetched!");
                    return(
                      <div className='row' style={{marginTop: '20px'}}>
                        {this.paymentFrequency2()}
                      </div>
                    );
                  }
                })()}
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
          <WebNavBar 
            poplogin = {this.togglePopLogin}
            popSignup = {this.togglePopSignup}
          />
          {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
          {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}
          <div className={styles.container}>
            {/*<Menu show={this.state.loggedIn} message={message} />*/}
            {(()=>{
              if(this.state.loggedIn === true){
                console.log("Show navbuttons -- logged in");
                return(
                  <Menu show={true} message={message} />
                );
              } else {
                console.log("Hide navbuttons -- not logged in");
                return(
                  <Menu show={true} message={message} />
                );
              }
            })()}
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
                  {(()=>{
                    if(JSON.stringify(this.props.plans) === "{}"){
                      console.log("(web) meals not yet fetched");
                    } else {
                      console.log("(web) meals fetched!");
                      return(
                        <div className={styles.buttonWrapper}>
                          {this.mealsDelivery()}
                        </div>
                      );
                    }
                  })()}
                </div>
                  
                <div className={styles.menuSection}>
                  <div className={styles.center}>
                    <span className={styles.bold}>
                      NUMBER OF DELIVERIES
                    </span>
                  </div>
                  {(()=>{
                    if(JSON.stringify(this.props.plans) === "{}"){
                      console.log("(web) plans not yet fetched");
                    } else {
                      console.log("(web) plans fetched!");
                      return(
                        <div className='row' style={{marginTop: '20px'}}>
                          {this.paymentFrequency2()}
                        </div>
                      );
                    }
                  })()}
                </div>
                  
                <div className={styles.menuSection}>     
                  {(() => {
                    if (JSON.stringify(this.props.selectedPlan) !== '{}') 
                    {
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
