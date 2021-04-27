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
import styles from "./updatePlan.module.css";
import {WebNavBar, BottomNavBar} from "../NavBar";

import PopLogin from '../PopLogin';
import Popsignup from '../PopSignup';



class UpdatePlan extends React.Component {
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
      signUpSeen:false,
      total: '0.00',
      numDeliveryDays: 0,
      currentDiscount: 0,
      currentMeals: "",
      currentDeliveries: ""
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

  componentDidMount() {
    //console.log("choose-plan props: " + JSON.stringify(this.props));
    //console.log(this.props)

    let queryString = this.props.location.search;
    let urlParams = new URLSearchParams(queryString);
    // Clear Query parameters
    window.history.pushState({}, document.title, window.location.pathname);

    if (this.props.location.customerUid !== '' &&
        this.props.location.customerUid !== undefined &&
        JSON.stringify(this.props.location.currentMealPlan) !== '{}' &&
        JSON.stringify(this.props.location.currentMealPlan) !== undefined) {

      console.log("update-plan LOGGED IN");
      console.log("update plan props.location (logged in): ", this.props.location);

      let customerUid = this.props.location.customerUid;
      let currentMeals = this.props.location.currentMeals;
      let currentDeliveries = this.props.location.currentDeliveries;

      this.setState({
        customerUid,
        currentMeals,
        currentDeliveries,
        mounted: true
      });

    } else {
      // Reroute to log in page
      console.log("Update-plan NOT LOGGED IN");
      this.props.history.push("/meal-plan");
    }
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

      if(messageDays.includes(dayString) === false) {
        messageDays.push(dayString);
        /*this.setState(prevState => {
          return {numDeliveryDays: prevState.numDeliveryDays+1}
        });*/
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

    //console.log("final deliveryDaysString: " + deliveryDaysString);

    return deliveryDaysString;
  }

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

      if(messageDays.includes(dayString) === false) {
        messageDays.push(dayString);
        this.setState(prevState => {
          return {numDeliveryDays: prevState.numDeliveryDays+1}
        }, () => {
          console.log("new num weekdays delivered: " + this.state.numDeliveryDays);
        });
      }
    }

    /*let deliveryDaysString = " ";

    for(var i = 0; i < messageDays.length; i++) {
      if(i === messageDays.length-1){
        deliveryDaysString = deliveryDaysString.concat(messageDays[i]);
      } else {
        deliveryDaysString = deliveryDaysString.concat(messageDays[i] + ", ");
      }
      //deliveryDaysString = deliveryDaysString.concat(messageDays[i] + ", ");
    }

    //console.log("final deliveryDaysString: " + deliveryDaysString);

    return deliveryDaysString;*/
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
            this.state.currentMeals === mealIndex
              ? selectedMealButton
              : deselectedMealButton
          }
          onClick={() => {
            this.props.chooseMealsDelivery(
              mealIndex,
              this.props.paymentOption,
              this.props.plans
            );
            console.log("===== mealIndex: " + mealIndex);
            console.log("===== paymentOption: " + this.props.paymentOption);
            //console.log("===== plans: " + JSON.stringify(this.props.plans));
          }}
        >
          {mealIndex}
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
      
    var discounts = this.props.plans[2];
    var discount = null;

    console.log("(paymentFrequency2) === (1)");
    console.log("(paymentFrequency2) === typeof(discounts): " + typeof(discounts));

    if(typeof(discounts) !== "undefined"){
      console.log("(paymentFrequency2) === (2)");
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
                    /*className={
                      (this.props.paymentOption === deliveryIndex
                        ? selectedPaymentOption
                        : deselectedPaymentOption) +
                      " " + (active && styles.disabledBtn)
                    }*/
                    /*className={
                      this.props.paymentOption === deliveryIndex
                        ? selectedPaymentOption
                        : deselectedPaymentOption
                    }*/
                    className={
                      this.state.currentDeliveries === deliveryIndex
                        ? selectedPaymentOption
                        : deselectedPaymentOption
                    }
                    onClick={() => {
                      this.props.choosePaymentOption(
                        deliveryIndex,
                        this.props.meals,
                        tempPlan
                      )
                      console.log("##### deliveryIndex: " + deliveryIndex);
                      console.log("##### meals: " + this.props.meals);
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
                      if(deliveryIndex % this.state.numDeliveryDays === 0){
                        //console.log("is 3");
                        return(
                          <div className={styles.deliverySubtext}>
                            {(() => {
                              if (deliveryIndex/this.state.numDeliveryDays === 1) {
                                return (
                                  <>
                                    {deliveryIndex/this.state.numDeliveryDays} WEEK
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    {deliveryIndex/this.state.numDeliveryDays} WEEKS
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
    return paymentOptionButtons;
  };

  calculateTotal = () => {
    let calculatedTotal = (
      this.props.selectedPlan.item_price *
      this.props.selectedPlan.num_deliveries *
      (1-(this.props.selectedPlan.delivery_discount*0.01))
    ).toFixed(2);
    return calculatedTotal;
  };

  /*calculateDeal = () => {
    let total = parseFloat(this.calculateTotal());
    //console.log("total: " + total);

    let noDiscountPrice = parseFloat((
      this.props.selectedPlan.item_price *
      this.props.selectedPlan.num_deliveries
    ).toFixed(2));
    //console.log("noDiscountPrice: " + noDiscountPrice);

    let deal = total/noDiscountPrice;
    //console.log("deal: " + deal);

    return Math.ceil(deal);
  };*/
  calculateDeal = () => {
    let total = parseFloat(this.calculateTotal());

    /*let noDiscountPrice = parseFloat((
      this.props.selectedPlan.item_price *
      this.props.selectedPlan.num_deliveries
    ).toFixed(2));*/

    let deal = (total/this.props.selectedPlan.num_items).toFixed(2);

    return deal;
  };

  render() {
    if (!this.state.mounted) {
      return null;
    }
    return (
      /*for mobile's screen*/
      <>
        {/* For Full Screen */}
          <WebNavBar 
            poplogin = {this.togglePopLogin}
            popSignup = {this.togglePopSignup}
          />

          {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
          {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}

          <div className={styles.sectionHeaderUL}>
            Edit Plan
          </div>

          
          <div className={styles.container}>
            <div className={styles.box}>
              <div className={styles.box1}>

                <div className={styles.planHeader}>
                  Current Plan
                </div>

                <div className={styles.containerSplit}>
                  <div className={styles.boxRight}>

                    <div style={{textAlign: 'center'}}>
                      <div className={styles.iconMeals}>
                        {this.state.currentMeals}
                      </div>
                      <div>
                        MEALS
                      </div>
                    </div>

                    <div style={{textAlign: 'center', paddingLeft: '50px'}}>
                      <button className={styles.deliveryButtonCurrent}>
                        <span style={{fontSize: '35px'}}>
                          {this.state.currentDeliveries}
                        </span>
                        <br></br>
                        <span style={{whiteSpace: "nowrap"}}>
                          {"(Save "+this.state.currentDiscount+"%)"}
                        </span>
                      </button>
                      <div>
                        DELIVERIES
                      </div>
                    </div>

                  </div>
                </div>

                <div className={styles.planHeader}>
                  Updated Plan
                </div>
                  
                <div className={styles.menuSection}>
                  <div className={styles.center}>
                    <span className={styles.subHeader}>
                      NUMBER OF MEALS PER DELIVERY
                    </span>
                  </div>
                  {(()=>{
                    if(JSON.stringify(this.props.plans) === "{}"){
                      //console.log("(web) meals not yet fetched");
                    } else {
                      //console.log("(web) meals fetched!");
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
                    <span className={styles.subHeader}>
                      TOTAL NUMBER OF DELIVERIES
                    </span>
                  </div>
                  {(()=>{
                    if(JSON.stringify(this.props.plans) === "{}"){
                      //console.log("(web) plans not yet fetched");
                    } else {
                      //console.log("(web) plans fetched!");
                      return(
                        <div className='row' style={{marginTop: '20px'}}>
                          {this.paymentFrequency2()}
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.box}>
              <div className={styles.box1}>
                  
                <div className={styles.menuSection}>     

                        <div style={{display: 'flex'}}>
                          <div style={{display: 'inline-block'}}>
                            <div className={styles.priceCalculation}>



                            <div style={{display: 'inline-block'}}>
                              <div className={styles.priceTotal}>

                                <div style={{display: 'inline-flex'}}>

                                  <div className={styles.priceFormula2}>
                                    Additional{" "}Discount
                                  </div>
                                  
                                  <div className={styles.priceFormula}>
                                    {this.calculateTotal()}%
                                  </div>
                                </div>

                                
                              </div>
                              <div className={styles.perMealDeal}>
                                That's only ${this.calculateDeal()} per freshly cooked meal
                              </div>
                              <div className={styles.proceedWrapper}>
                                <Link className={styles.proceedBtn} to='/payment-details'>
                                  PROCEED
                                </Link>
                              </div>
                            </div>
                            </div>

                          </div>
                          </div>
                            
                </div>
                  
                </div>
                
            </div>   
          </div>
      </>
    );
  }
}

UpdatePlan.propTypes = {
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
})(withRouter(UpdatePlan));
