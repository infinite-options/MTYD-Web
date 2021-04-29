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
import {HomeLink, FootLink, AmbassadorLink, AddressLink} from "../Home/homeButtons";

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
      currentDeliveries: "",
      currentBillingAmount: "0.00",
      updatedMeals: "",
      updatedDeliveries: "",
      mealPlanDefaulted: false,
      additionalCharges: "0.00",
      showChargeModal: false,
      chargeModal: null,
      updatedMealPlan: {},
      selectedDiscount: 0,
      additionalDiscount: 0,
      sumFees: 0
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
      let currentBillingAmount = this.props.location.currentBillingAmount;
      let currentDiscount = this.props.location.currentDiscount;
      let currentMealPlan = this.props.location.currentMealPlan;
      let sumFees = this.props.location.sumFees;

      this.props.chooseMealsDelivery(
        currentMeals,
        currentDeliveries,
        this.props.plans
      );

      this.props.choosePaymentOption(
        currentDeliveries,
        currentMeals,
        this.props.plans
      )

      this.setState({
        customerUid,
        currentMeals,
        currentDeliveries,
        currentDiscount,
        currentBillingAmount,
        sumFees,
        selectedDiscount: currentDiscount,
        updatedMeals: currentMeals,
        updatedDeliveries: currentDeliveries,
        updatedMealPlan: currentMealPlan,
        mounted: true
      });

    } else {
      // Reroute to log in page
      console.log("Update-plan NOT LOGGED IN");
      this.props.history.push("/meal-plan");
    }
  }

  showDeliveryDates = () => {
    let messageDays = [];

    for (const [dateKey, dateData] of Object.entries(this.state.deliveryDays)) {

      let dayInt = dateData["weekday(menu_date)"];

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
      }
    }

    let deliveryDaysString = " ";

    for(var i = 0; i < messageDays.length; i++) {
      if(i === messageDays.length-1){
        deliveryDaysString = deliveryDaysString.concat(messageDays[i]);
      } else {
        deliveryDaysString = deliveryDaysString.concat(messageDays[i] + ", ");
      }
    }

    return deliveryDaysString;
  }

  countDeliveryWeekdays = () => {
    let messageDays = [];

    for (const [dateKey, dateData] of Object.entries(this.state.deliveryDays)) {

      let dayInt = dateData["weekday(menu_date)"];

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
  }

  mealsDelivery = () => {

    let deselectedMealButton = styles.mealButton;
    let selectedMealButton =
    styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];
    let singleMealData;

    let mealPlans = this.props.plans;
    for (const [mealIndex, mealData] of Object.entries(mealPlans)) {

      singleMealData = mealData["1"];

      mealButtons.push(
        <div className={styles.mealButtonWrapper}>
        <button
          key={mealIndex}
          className={
            this.state.updatedMeals === mealIndex
              ? selectedMealButton
              : deselectedMealButton
          }
          onClick={() => {
            this.props.chooseMealsDelivery(
              mealIndex,
              this.state.updatedDeliveries,
              this.props.plans
            );
            console.log("===== mealIndex: " + mealIndex);
            console.log("===== paymentOption: " + this.props.paymentOption);
            this.setState({
              updatedMeals: mealIndex
            });
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
    console.log("(paymentFrequency2) === typeof(discounts): ", typeof(discounts));

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
          console.log("delivery discount: " + discount);
        } catch(e) {
          console.log("delivery discount UNDEFINED");
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
                      className={
                        this.state.updatedDeliveries === deliveryIndex
                          ? selectedPaymentOption
                          : deselectedPaymentOption
                      }
                      onClick={() => {
                        this.props.choosePaymentOption(
                          deliveryIndex,
                          this.state.updatedMeals,
                          this.props.plans
                        )
                        try{
                          discount = discounts[deliveryIndex].delivery_discount;
                          console.log("delivery discount: " + discount);
                        } catch(e) {
                          console.log("delivery discount UNDEFINED");
                        }
                        this.setState({
                          updatedDeliveries: deliveryIndex,
                          selectedDiscount: discount
                        });
                        console.log("##### deliveryIndex: " + deliveryIndex);
                        console.log("##### index discount: " + discount);
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

  calculateDiscount = () => {
    let addDiscount = this.state.currentDiscount - this.state.selectedDiscount;
    console.log("current discount: ", this.state.currentDiscount);
    console.log("selected discount: ", this.state.selectedDiscount);
    console.log("additional discount: ", addDiscount);
    return -addDiscount;
  };

  calculateAdditionalCharges = () => {
    let currCharge = this.state.currentBillingAmount;
    let diffCharge = this.calculateTotal();
    let feesCharge = this.state.sumFees

    console.log("curr charge: ", currCharge);
    console.log("diff charge: ", diffCharge);
    console.log("fees charge: ", feesCharge);

    let addCharges = -(
      parseFloat(currCharge) -  
      parseFloat(diffCharge) -
      feesCharge
    );

    console.log("add charges (float): ", addCharges);
    console.log("add charges (string): ", addCharges.toFixed(2));

    return addCharges.toFixed(2);
  };

  calculateDeal = () => {
    let total = parseFloat(this.calculateTotal());
    let deal = (total/this.props.selectedPlan.num_items).toFixed(2);

    console.log("NAN? ", Number.isNaN(deal));
    console.log("typeof(deal) ", typeof(deal));

    if (deal === 'NaN') {
      console.log("Not a number");
      return 0;
    }

    return deal;
  };

  displayChargeModal= () => {
    if(this.state.showChargeModal === false) {
      this.setState({
        chargeModal: styles.chargeModalPopUpShow,
        showChargeModal: true,
      });
    }else{
      this.setState({
        chargeModal: styles.chargeModalPopUpHide,
        showChargeModal: false
      });
    }
    console.log("\ncheckout error toggled to " + this.state.showChargeModal + "\n\n");
  }

  saveChanges = () => {
    let object = {
      cc_cvv: this.state.updatedMealPlan.cc_cvv,
      cc_exp_date: this.state.updatedMealPlan.cc_cvv,
      cc_num: this.state.updatedMealPlan.cc_cvv,
      cc_zip: this.state.updatedMealPlan.cc_cvv,
      customer_email: this.props.email,
      items: [{
        qty: this.props.selectedPlan.num_deliveries.toString(), 
        name: this.props.selectedPlan.item_name, 
        price: this.props.selectedPlan.item_price.toString(), 
        item_uid: this.props.selectedPlan.item_uid, 
        itm_business_uid: this.props.selectedPlan.itm_business_uid
      }],
      new_item_id: this.props.selectedPlan.item_uid,
      purchase_id: this.state.updatedMealPlan.purchase_uid,
      start_delivery_date: this.state.updatedMealPlan.start_delivery_date
    }
    console.log("change_purchase object: " + JSON.stringify(object));
    console.log("change_purchase URL: " + API_URL + 'change_purchase/' + this.state.updatedMealPlan.purchase_uid);
    axios
      .post(API_URL + 'change_purchase/' + this.state.updatedMealPlan.purchase_uid, object)
      .then(res => {
        console.log("change_purchase response: ", res);
        this.props.history.push("/meal-plan");
      })
      .catch(err => {
        console.log(err);
        if (err.response) {
          console.log("error: " + JSON.stringify(err.response));
        }
      });
  }

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

          {(() => {
            if (this.state.showChargeModal === true) {
              {console.log("changes updatedMealPlan: ", this.state.updatedMealPlan);}
              {console.log("changes updatedMeals: ", this.state.updatedMeals);}
              {console.log("changes updatedMealDeliveris: ", this.state.updatedDeliveries);}
              {console.log("selectedPlan: ", this.props.selectedPlan);}
              return (
                <>
                <div className = {this.state.chargeModal}>
                  <div className  = {styles.chargeModalContainer}>
                      <div
                        className={styles.chargeCancelButton}
                        onClick = {() => {
                          this.displayChargeModal();
                        }} 
                      />

                      <div className={styles.chargeContainer}>

                        <div className={styles.chargeTotal}>
                          <div style={{display: 'inline-flex'}}>
                            {(() => {
                              let chargeOrRefund = this.calculateAdditionalCharges();
                              if (parseFloat(chargeOrRefund) >= 0) {
                                return (
                                  <>
                                    <div className={styles.chargeText}>
                                      {"Additional Charges "}
                                    </div>
                                    <div className={styles.chargeAmount}>
                                      ${this.calculateAdditionalCharges()}
                                    </div>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    <div className={styles.chargeText}>
                                      {"You will be refunded "}
                                    </div>
                                    <div className={styles.chargeAmount}>
                                      ${-this.calculateAdditionalCharges()}
                                    </div>
                                  </>
                                );
                              }
                            })()}
                          </div>
                        </div>

                        <br />
                        <button 
                          className={styles.chargeBtn}
                          onClick = {() => {
                            console.log("save changes clicked...");
                            this.saveChanges();
                          }}
                        >
                          Save Changes
                        </button>
                        <button 
                          className={styles.chargeBtn}
                          onClick = {() => {
                            console.log("keep existing meal plan clicked...");
                            this.displayChargeModal();
                          }}
                        >
                          Keep Existing Meal Plan
                        </button>
                      </div> 
                    </div>
                  </div>
                </>
              );
            }
          })()} 

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
                  <div style={{display: 'flex'}}>
                    <div style={{display: 'inline-block'}}>
                      <div className={styles.priceCalculation}>
                        <div style={{display: 'inline-block'}}>

                          {/*<div className={styles.priceTotal}>
                            <div style={{display: 'inline-flex'}}>
                              <div className={styles.priceFormula2}>
                                Additional{" "}Discount
                              </div>
                              <div className={styles.priceFormula}>
                                {this.calculateDiscount()}%
                              </div>
                            </div>
                          </div>

                          <div className={styles.perMealDeal}>
                            That's only ${this.calculateDeal()} per freshly cooked meal
                          </div>*/}

                          {/*<div className={styles.proceedWrapper}>
                            <button 
                              className={styles.orangeBtn}
                              onClick = {() => {
                                this.displayChargeModal();
                              }}
                            >
                              PROCEED
                            </button>
                          </div>*/}

                          <div className={styles.chargeContainer}>

                          <div className={styles.chargeTotal}>
                            <div style={{display: 'inline-flex'}}>
                              {(() => {
                                let chargeOrRefund = this.calculateAdditionalCharges();
                                if (parseFloat(chargeOrRefund) >= 0) {
                                  return (
                                    <>
                                      <div className={styles.chargeText}>
                                        {"Additional Charges "}
                                      </div>
                                      <div className={styles.chargeAmount}>
                                        ${this.calculateAdditionalCharges()}
                                      </div>
                                    </>
                                  );
                                } else {
                                  return (
                                    <>
                                      <div className={styles.chargeText}>
                                        {"You will be refunded "}
                                      </div>
                                      <div className={styles.chargeAmount}>
                                        ${-this.calculateAdditionalCharges()}
                                      </div>
                                    </>
                                  );
                                }
                              })()}
                            </div>
                          </div>

                          <br />
                          <button 
                            className={styles.chargeBtn}
                            onClick = {() => {
                              console.log("save changes clicked...");
                              this.saveChanges();
                            }}
                          >
                            Save Changes
                          </button>
                          {/*<button 
                            className={styles.chargeBtn}
                            onClick = {() => {
                              console.log("keep existing meal plan clicked...");
                              this.displayChargeModal();
                            }}
                          >
                            Keep Existing Meal Plan
                          </button>*/}

                          </div> 

                        </div>
                      </div>
                    </div>
                  </div> 

          </div>
          <div style={{marginTop: '200px'}}>
          <FootLink/>  
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
