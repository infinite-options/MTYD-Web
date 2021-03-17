import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
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
  submitPayment
} from "../../reducers/actions/subscriptionActions";

import {withRouter} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faShareAlt,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import {WebNavBar, BottomNavBar} from "../NavBar";

import styles from "./paymentDetails.module.css";

class PaymentDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
      tip: 0
    };
  }

  componentDidMount() {
    console.log("PaymentDetails selected plan: " + JSON.stringify(this.props.selectedPlan));
    if (
      document.cookie
        .split(";")
        .some(item => item.trim().startsWith("customer_uid="))
    ) {
      let customerUid = document.cookie
        .split("; ")
        .find(item => item.startsWith("customer_uid="))
        .split("=")[1];
      this.setState({
        mounted: true
      });
      this.props.fetchProfileInformation(customerUid);
    } else {
      // Reroute to log in page
      this.props.history.push("/");
    }
  }

  render() {
    if (!this.state.mounted) {
      return null;
    }
    let loggedInByPassword = false;
    if (this.props.socialMedia === "NULL") {
      loggedInByPassword = true;
    }
    return (
      <div>
        <WebNavBar />
        <div
          style={{
            alignSelf: "center",
            marginTop: "1rem",
            paddingBottom: "15px",
            margin: "2rem",
            borderRadius: "15px",
            boxShadow: "1px 1px 1px 2px #d3d3d3 "
          }}
        >
            {/*<div className={styles.topHeading}>
            <h6 className={styles.subHeading}> DELIVERY ADDRESS </h6>
          </div>
            
          <div className={styles.inputContainer}>
            <div className={styles.inputItem}>
              <input
                type='text'
                placeholder='Address*'
                className={styles.input}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
            </div>

            <div className={styles.inputItem}>
              <input
                type='text'
                placeholder='Unit*'
                className={styles.input}
                value={this.props.unit}
                onChange={e => {
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
                onChange={e => {
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
                onChange={e => {
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
                onChange={e => {
                  this.props.changeAddressZip(e.target.value);
                }}
              />
            </div>
          </div>
            
          <div className={styles.topHeading}>
            <h6 className={styles.subHeading}>CONTACT  INFO</h6>
          </div>*/}
            
          {/* <h6 className={styles.subHeading}> Address Details </h6> */}
            {/*<div className={styles.inputContainer}>
            <div className={styles.inputItem}>
              <input
                type='text'
                placeholder='First Name*'
                className={styles.input}
                value={this.props.firstName}
                onChange={e => {
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
                onChange={e => {
                  this.props.changeAddressLastName(e.target.value);
                }}
              />
            </div>
            <div style={{flexBasis: "100%"}} className={styles.inputItem}>
              <input
                type='email'
                placeholder='Email**'
                className={styles.input}
                // value={this.props.street}
              />
            </div>
            <div className={styles.inputItem}>
              <input
                type='text'
                placeholder='Phone Number*'
                className={styles.input}
                value={this.props.phone}
                onChange={e => {
                  this.props.changeAddressPhone(e.target.value);
                }}
              />
            </div>
          </div>
            
          <div style = {{margin: '30px 0 20px 20px', fontWeight: 'bold'}}>
              Terms and Conditions
          </div>*/}
            
 {/****************************************/}
          <div className={styles.topHeading}>
            <h6 className={styles.subHeading}> DELIVERY ADDRESS </h6>
          </div>
            
          <div style={{display: 'flex'}}>
            <div style = {{display: 'inline-block', width: '80%', height: '200px'}}>
              <input
                type='text'
                placeholder='Search for an Address'
                className={styles.input}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
              <input
                type='text'
                placeholder='Address Line 2 (Apartment number, Suite, Building, Floor, etc.)'
                className={styles.input}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
              <input
                type='text'
                placeholder='Delivery Instructions (Gate code, Ring bell, Call on arrival, etc.)'
                className={styles.input}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
            </div>
              
            <div style = {{width: '20%', textAlign: 'right', paddingRight: '10px', height: '200px'}}>
              <button className={styles.saveButton}>
                Save
              </button>
            </div>
          </div>

            
          <div style = {{display: 'inline-block', width: '80%', height: '200px'}}>
            <div className = {styles.googleMap}>
              Google Map
            </div>
          </div>
            
            
          <div className={styles.topHeading}>
            <h6 className={styles.subHeading}> CONTACT INFO </h6>
          </div>
            
          <div style={{display: 'flex'}}>
            <div style = {{display: 'inline-block', width: '40%', height: '150px'}}>
              <input
                type='text'
                placeholder='First Name'
                className={styles.input}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
              <input
                type='text'
                placeholder='Phone Number'
                className={styles.input}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
            </div>
              
            <div style = {{display: 'inline-block', width: '40%', height: '150px'}}>
              <input
                type='text'
                placeholder='Last Name'
                className={styles.input}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
              <input
                type='text'
                placeholder='Email'
                className={styles.input}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
            </div>
              
            <div style = {{width: '20%', textAlign: 'right', paddingRight: '10px', height: '150px'}}>
                <button className={styles.saveButton}>
                  Save
                </button>
            </div>
          </div>
            
          <div style = {{margin: '30px 0 10px 20px'}}>
              Terms and Conditions
          </div>
            
          <div className={styles.paymentContainer}>
            <div className={styles.topHeading}>
              <h6 className={styles.subHeading}>PAYMENT SUMMARY</h6>
            </div>
       
            </div>
            
          <div style={{display: 'flex'}}>
              
            <div style = {{display: 'inline-block', width: '80%', height: '480px'}}>
              <div className={styles.summaryLeft}>
                Meal Subscription ({
                  this.props.selectedPlan.num_items
                } Meals for {
                  this.props.selectedPlan.num_deliveries
                } Deliveries):
              </div>
              <div className={styles.summaryLeft}>
                Add-Ons:
              </div>
              <div className={styles.summaryLeft}>
                Total Delivery Fee For All {
                  this.props.selectedPlan.num_deliveries
                } Deliveries:
              </div>
              <div className={styles.summaryLeft}>
                Service Fee:
              </div>
              <div className={styles.summaryLeft}>
                Taxes:
              </div>
              <div className={styles.summaryLeft}>
                Chef and Driver Tip:
              </div>
                  
              <div className={styles.summaryLeft}>
                <button className={styles.tipButton}>
                  No Tip
                </button>
                <button className={styles.tipButton}>
                  $2
                </button>
                <button className={styles.tipButton}>
                  $3
                </button>
                <button className={styles.tipButton}>
                  $5
                </button>
              </div>
                
              <input
                type='text'
                placeholder='Enter Ambassador Code'
                className={styles.inputAmbassador}
              />
            </div>
            
            <div style = {{display: 'inline-block', width: '20%', height: '480px'}}>
              <div className={styles.summaryRight}>
                ${(
                  this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries
                )}
              </div>
              <div className={styles.summaryRight}>
                ${(
                  this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries
                )}
              </div>
              <div className={styles.summaryRight}>
                ${(
                  this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries
                )}
              </div>
              <div className={styles.summaryRight}>
                ${(
                  this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries
                )}
              </div>
              <div className={styles.summaryRight}>
                ${(
                  this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries
                )}
              </div>
              <div className={styles.summaryRight}>
                ${(
                  this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries
                )}
              </div>
              <div className={styles.summaryRight2}>
                ${(
                  this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries
                )}
              </div>
              <div className={styles.summaryRight2}>
                ${(
                  this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries
                )}
              </div>
              <hr className={styles.sumLine}></hr>
              <div className={styles.summaryRight2}>
                ${(
                  this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries
                )}
              </div>
            </div>
          </div>
            
          <div className={styles.topHeading}>
            <h6 className={styles.subHeading}>PAYMENT OPTIONS</h6>
          </div>
            
          <div style={{display: 'flex'}}>
            <div style = {{display: 'inline-block', width: '80%', height: '280px'}}>
            <div className={styles.buttonContainer}>
                <button className={styles.button}>
              STRIPE
            </button>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.button}>
              PAYPAL
            </button>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.button}>
              VENMO
            </button>
            </div>
          </div>
          <div style = {{width: '20%', textAlign: 'right', paddingRight: '10px', height: '270px'}}>
                <button className={styles.saveButton}>
                  Save
                </button>
            </div>
          </div>
            
          <div style={{display: 'flex'}}>
            <div style = {{display: 'inline-block', width: '80%', height: '200px'}}>
              <input
                type='text'
                placeholder='Card Holder Name'
                className={styles.input}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
              <input
                type='text'
                placeholder='Credit Card Number'
                className={styles.input}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
            <div style = {{display: 'inline-flex', height: '100px', width: '125%'}}>
              <input
                type='text'
                placeholder='MM'
                className={styles.monthInput}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
              <div className={styles.dateSlash}>/</div>
              <input
                type='text'
                placeholder='YEAR'
                className={styles.yearInput}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
              <input
                type='text'
                placeholder='CVV'
                className={styles.cvvInput}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
              <input
                type='text'
                placeholder='ZIPCODE'
                className={styles.zipInput}
                value={this.props.street}
                onChange={e => {
                  this.props.changeAddressStreet(e.target.value);
                }}
              />
                          <button
              className={styles.finishButton}
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
                    this.props.history.push("/select-meal");
                  }
                );
              }}
            >
              FINISH
            </button>
                </div>
            </div>
              
          </div>
            
            
            {/*<div className={styles.inputContainer}>
            <div style={{flexBasis: "100%"}} className={styles.inputItem}>
              <input
                type='text'
                placeholder='Credit Card Number'
                className={styles.input}
              />
            </div>
            <div style={{flexBasis: "25%"}} className={styles.inputItem}>
              <input
                type='text'
                placeholder='CVC/CVV'
                className={styles.input}
              />
            </div>
            <div style={{flexBasis: "25%"}} className={styles.inputItem}>
              <input type='text' placeholder='Zip' className={styles.input} />
            </div>
            <div style={{flexBasis: "40%"}} className={styles.inputItem}>
              <select className={styles.input}>
                {" "}
                <option>Month </option>
              </select>
            </div>
            <div style={{flexBasis: "40%"}} className={styles.inputItem}>
              <select className={styles.input}>
                {" "}
                <option>Year </option>
              </select>
            </div>
          </div>*/}
        </div>
      </div>
    );
  }
}

PaymentDetails.propTypes = {
  changeAddressFirstName: PropTypes.func.isRequired,
  changeAddressLastName: PropTypes.func.isRequired,
  changeAddressStreet: PropTypes.func.isRequired,
  changeAddressUnit: PropTypes.func.isRequired,
  changeAddressState: PropTypes.func.isRequired,
  changeAddressZip: PropTypes.func.isRequired,
  changeAddressPhone: PropTypes.func.isRequired,
  changeDeliveryInstructions: PropTypes.func.isRequired,
  changePaymentPassword: PropTypes.func.isRequired,
  submitPayment: PropTypes.func.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  street: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  zip: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  instructions: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
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
  selectedPlan: state.subscribe.selectedPlan,
  password: state.subscribe.paymentPassword
});

const functionList = {
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
  submitPayment
};

export default connect(
  mapStateToProps,
  functionList
)(withRouter(PaymentDetails));
