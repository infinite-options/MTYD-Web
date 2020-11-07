import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  fetchPlans,
  chooseMealsDelivery,
  choosePaymentOption,
  changeAddressCity,
  changeAddressFirstName,
  changeAddressLastName,
  changeAddressEmail,
  changeAddressPhone,
  changeAddressState,
  changeAddressStreet,
  changeAddressUnit,
  changeAddressZip,
  changeDeliveryInstructions,
  changePaymentPassword,
  submitPayment,
  fetchProfileInformation,
  resetSubsription
} from "../../../reducers/actions/subscriptionActions";

import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import styles from "./SelectPlanWeb.module.css";
import takeaway from './take-away.svg';
import choose_meal_plan from '../../../images/choose_meal_plan/Group 1907.svg';
import credit_card_image from '../../../images/Credit-card/Credit-card@2x.png';
import delivery_guy_image from '../../../images/delivery_guy/3333449@2x.png';
import first_step_icon from '../../../images/first_step.svg';
import second_step_icon from '../../../images/second_step.svg';
import third_step_icon from '../../../images/third_step.svg';
import paymentOption1 from './Group 2016.svg';
import paymentOption2 from './Group 2029.svg';
import paymentOption3 from './Group 2030.svg';

class SelectPlanWeb extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
    };
  }

  componentDidMount() {
    let queryString = this.props.location.search;
    let urlParams = new URLSearchParams(queryString);
    // Clear Query parameters
    window.history.pushState({}, document.title, window.location.pathname);
    // Logged in from Apple
    if (urlParams.has("customer_uid")) {
      let customer_uid = urlParams.get("customer_uid")
      document.cookie = 'customer_uid=' + customer_uid;
      axios
      .get(API_URL+'customer_lplp',{
          params: {
              customer_uid: customer_uid,
          }
      })
      .then((res) => {
          console.log(res);
          if(res.data.result !== undefined) {
            this.props.history.push("/select-meal-web")
          }
          this.props.fetchPlans();
          this.setState({
            mounted: true,
          });
      })
      .catch((err) => {
          console.log(err);
          if(err.response) {
              console.log(err.response);
          }
      })
    } else
    // Check for logged in
    if (
      document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("customer_uid="))
    ) {
      const cookieValue = document.cookie
      .split("; ")
      .find(item => item.startsWith('customer_uid='))
      .split('=')[1];
      console.log('CUSTOMER_UID = ', cookieValue);
      this.props.fetchProfileInformation(cookieValue);
      this.props.fetchPlans();
      this.setState({
        mounted: true,
      });
    } else {
      // Reroute to log in page
      this.props.history.push("/login-web");
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
    let myArr = [paymentOption1, paymentOption2, paymentOption3 ]
    let deselectedPaymentOption = styles.paymentButton;
    let selectedPaymentOption =
      styles.paymentButton + " " + styles.paymentButtonSelected;
    let paymentOptionButtons = [];
    for (const [i,option] of this.props.paymentFrequency.entries()) {
      
      let optionStr = option.toString();
      paymentOptionButtons.push(
        <img src={myArr[i]}
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

  render() {
    if (!this.state.mounted) {
      return null;
    }
    return (
      <div className={styles.root}>
        <div className={styles.mealHeader}>
          <Link to="/login-web">
            <button className={styles.mealheaderButton}>HOME</button>
          </Link>
          <button className={styles.mealheaderButton}>ABOUT US</button>
          <Link to="/login-web">
            <button className={styles.mealheaderButton}>SIGN IN</button>
          </Link>
        </div>
        <div style={{display:"flex", flexDirection:"row", marginTop:"1rem", padding:"10px"}}>
            <img style={{height:"50px", width:"50px"}} src={takeaway} alt="React Logo" />
            <div style={{display:"flex", flexDirection:"column"}}>
              <h6 style={{margin:"0px 2px"}}>
                MEALS DELIVERIES ARE <span style={{margin:"0px 2px", color:"#FF9E19"}}>MONDAY,WEDNESDAY,FRIDAY</span>
              </h6>
            </div>
        </div>
        <div style={{ alignSelf:"center", marginTop:"1rem", paddingBottom:"6rem", margin:"2rem", borderRadius:"15px", boxShadow: "0px 3px 6px #00000029"}}>
        <div className={styles.mealSelectMenu}>
          <div>
          <img style={{height:"217px", width:"200px"}} src={choose_meal_plan} alt="Choose meal plan" />
          </div>
          <div style={{textAlign:"left"}}>
          <img style={{height:"69px", width:"69px"}} src={first_step_icon} alt="First step" />
          <h6 className={styles.subTitle}>CHOOSE MEAL PLAN</h6>

          </div>
          <div className={styles.mealNumber}>
            <div className={styles.buttonWrapper}>{this.mealsDelivery()}</div>
          </div>
          
          <img style={{height:"223px", width:"223px"}} src={credit_card_image} alt="credit card image" />
          <img style={{height:"69px", width:"69px"}} src={second_step_icon} alt="Second step" />
          <p style={{color:"black", fontSize:"1.3rem",fontWeight:"600", margin:"0rem", paddingLeft:"0.7rem"}} >PRE PAY OPTIONS</p>
          <div className={styles.paymentWrapper}>{this.paymentFrequency()}</div>
          <img style={{height:"274px", width:"183px"}} src={delivery_guy_image} alt="credit card image" />
          <img style={{height:"69px", width:"69px"}} src={third_step_icon} alt="Third step" />
          <h6 className={styles.subTitle}>DELIVERY INFORMATION</h6>
          {/* Delivery info*/}
          <div className={styles.inputContainer}>
            <div className={styles.inputItem}>
              <input
                type='text'
                placeholder='First Name*'
                className={styles.input}
                value={this.props.firstName}
                onChange={(e) => {
                  this.props.changeAddressFirstName(e.target.value);
                }}
              />
            </div>
            <div className={styles.inputItem}>
              <input
                type='text'
                placeholder='Last Name*'
                className={styles.input}
                value={this.props.lastName}
                onChange={(e) => {
                  this.props.changeAddressLastName(e.target.value);
                }}
              />
            </div>
            <div className={styles.inputItem}>
              <input
                type='text'
                placeholder='Address*'
                className={styles.input}
                value={this.props.street}
                onChange={(e) => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
            </div>
            <div style={{flexBasis:"100%"}} className={styles.inputItem}>
              <input
                type='email'
                placeholder='Email*'
                className={styles.input}
                value={this.props.email}
                onChange={(e) => {
                  this.props.changeAddressEmail(e.target.value);
                }}
               
              />
            </div>
            {/*TODO: REMOVE PAYMENT PASSWORD FOR WEB */}
            <div className={styles.inputItem}>
                <input
                  type='password'
                  placeholder='Password'
                  className={styles.input}
                  value={this.props.password}
                  onChange={(e) => {
                    this.props.changePaymentPassword(e.target.value);
                  }}
                />
            </div>
            
            <div className={styles.inputItem}>
              <input
                type='text'
                placeholder='Unit*'
                className={styles.input}
                value={this.props.unit}
                onChange={(e) => {
                  this.props.changeAddressUnit(e.target.value);
                }}
              />
            </div>
            <div className={styles.inputItem}>
              <input
                type='text'
                placeholder='City*'
                className={styles.input}
                value={this.props.city}
                onChange={(e) => {
                  this.props.changeAddressCity(e.target.value);
                }}
              />
            </div>
            <div className={styles.inputItem}>
              <input
                type='text'
                placeholder='State*'
                className={styles.input}
                value={this.props.state}
                onChange={(e) => {
                  this.props.changeAddressState(e.target.value);
                }}
              />
            </div>
            <div className={styles.inputItem}>
              <input
                type='text'
                placeholder='Zip*'
                className={styles.input}
                value={this.props.zip}
                onChange={(e) => {
                  this.props.changeAddressZip(e.target.value);
                }}
              />
            </div>
            <div className={styles.inputItem}>
              <input
                type='text'
                placeholder='Phone Number*'
                className={styles.input}
                value={this.props.phone}
                onChange={(e) => {
                  this.props.changeAddressPhone(e.target.value);
                }}
              />
            </div>
            <div className={styles.inputItem}>
              <textarea rows="7" cols="42"
                placeholder='Delivery Instructions'
                style={{border: "none",
                borderRadius: "18px", backgroundColor: "#FFFFFFD0",
                boxShadow: "0px 3px 6px #00000029",}}
                value={this.props.instructions}
                onChange={(e) => {
                  this.props.changeDeliveryInstructions(e.target.value);
                }}
              />
            </div>
          </div>
          <div style={{width:"inherit", height:"50px"}}>
                
          </div>
          {/* Billing info*/}
          <div className={styles.inputContainer}>
            <div style={{flexBasis:"100%"}} className={styles.inputItem}>
              <input
                type='text'
                placeholder='Credit Card Number'
                className={styles.input}
              />
            </div>
            <div style={{flexBasis:"25%"}} className={styles.inputItem}>
              <input
                type='text'
                placeholder='CVC/CVV'
                className={styles.input}
              />
            </div>
            <div style={{flexBasis:"25%"}} className={styles.inputItem}>
              <input
                type='text'
                placeholder='Zip'
                className={styles.input}
              />
            </div>
            <div style={{flexBasis:"40%"}} className={styles.inputItem}>
              <select 
                className={styles.input}
              > <option>Month </option></select>
            </div>
            <div style={{flexBasis:"40%"}} className={styles.inputItem}>
            <select 
                className={styles.input}
              > <option>Year </option></select>
            </div>
          </div>

          <div className={styles.amount}>
              <p style={{padding:"11px 0px 0px 0px", height:"40px" ,textAlign:"center", backgroundColor:"#FFF0C6", fontSize:"large", fontWeight:"600", color:"black"}} className={styles.amountItem}> $ TOTAL {this.props.selectedPlan.item_price} </p>
              
                <button style={{textAlign:"center", backgroundColor:"#FF9E19", fontSize:"large", fontWeight:"400", color:"white"}} className={styles.amountItem}
                 onClick={() => {
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
                        this.props.history.push("/select-meal-web");
                      }
                    );
                  }
                }
                >
                SAVE
                </button>
              
          </div>
        </div>
        </div>
      </div>
    );
  }
}

SelectPlanWeb.propTypes = {
  fetchPlans: PropTypes.func.isRequired,
  fetchProfileInformation: PropTypes.func.isRequired,
  resetSubsription: PropTypes.func.isRequired,
  chooseMealsDelivery: PropTypes.func.isRequired,
  choosePaymentOption: PropTypes.func.isRequired,
  numItems: PropTypes.array.isRequired,
  paymentFrequency: PropTypes.array.isRequired,
  meals: PropTypes.string.isRequired,
  paymentOption: PropTypes.string.isRequired,
  selectedPlan: PropTypes.object.isRequired,
  changeAddressCity: PropTypes.func.isRequired,
  changeAddressEmail: PropTypes.func.isRequired,
  changeAddressFirstName: PropTypes.func.isRequired,
  changeAddressLastName: PropTypes.func.isRequired,
  changeAddressPhone: PropTypes.func.isRequired,
  changeAddressState: PropTypes.func.isRequired,
  changeAddressStreet: PropTypes.func.isRequired,
  changeAddressUnit: PropTypes.func.isRequired,
  changeAddressZip: PropTypes.func.isRequired,
  changeDeliveryInstructions: PropTypes.func.isRequired,
  submitPayment: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  street: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  zip: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  customerId: PropTypes.string.isRequired,
  socialMedia: PropTypes.string.isRequired,
  instructions: PropTypes.string.isRequired,
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
  phone: state.subscribe.addressInfo.phoneNumber,
  instructions: state.subscribe.deliveryInstructions,
  password: state.subscribe.paymentPassword,
});

export default connect(mapStateToProps, {
  fetchPlans,
  fetchProfileInformation,
  resetSubsription,
  chooseMealsDelivery,
  choosePaymentOption,
  changeAddressCity,
  changeAddressEmail,
  changeAddressFirstName,
  changeAddressLastName,
  changeAddressPhone,
  changeAddressState,
  changeAddressStreet,
  changeAddressUnit,
  changeAddressZip,
  changeDeliveryInstructions,
  changePaymentPassword,
  submitPayment,
})(withRouter(SelectPlanWeb));


