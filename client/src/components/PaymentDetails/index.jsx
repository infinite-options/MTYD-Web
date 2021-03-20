import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
  fetchProfileInformation,
  changeAddressEmail,
  changeDeliveryDetails,
  changeContactDetails,
  changePaymentDetails,
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
  changeCardMonth,
  changeCardYear,
  changeCardZip,
  changeCardCvv,
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
import {WrappedMap} from "../Map"
import axios from 'axios';
import { API_URL } from '../../reducers/constants';

import styles from "./paymentDetails.module.css";

class PaymentDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
      addOns: 0,
      tip: 2,
      serviceFee: 0,
      deliveryFee: 0,
      taxRate: 0,
      ambassadorDiscount: 0,
      validCode: true,
      cardName: "",
      cardNumber: "",
      cardMonth: "",
      cardYear: "",
      cardCvv: "",
      cardZip: "",
      contactEmail: "",
      contactFirstName: "",
      contactLastName: "",
      contactPhone: "",
      deliveryInstructions: "",
      deliveryAddress1: "",
      deliveryAddress2: "",
      deliveryLatitude: 37.2270928,
      deliveryLongitude: -121.8866517,
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
      
    console.log("delivery details: " + JSON.stringify(this.props.deliveryDetails));
    this.setState({
      deliveryAddress1: this.props.deliveryDetails.deliveryAddress1,
      deliveryAddress2: this.props.deliveryDetails.deliveryAddress2,
      deliveryInstructions: this.props.deliveryDetails.deliveryInstructions,
      contactFirstName: this.props.contactDetails.contactFirstName,
      contactLastName: this.props.contactDetails.contactLastName,
      contactEmail: this.props.contactDetails.contactEmail,
      contactPhone: this.props.contactDetails.contactPhone,
      cardName: this.props.paymentDetails.cardName,
      cardNumber: this.props.paymentDetails.cardNumber,
      cardCvv: this.props.paymentDetails.cardCvv,
      cardMonth: this.props.paymentDetails.cardMonth,
      cardYear: this.props.paymentDetails.cardYear,
      cardZip: this.props.paymentDetails.cardZip
    });
    
    /*https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/categoricalOptions/-121.8866517,37.2270928*/
    // Get payment summary details
    axios
      .get(`${API_URL}categoricalOptions/${this.state.deliveryLongitude},${this.state.deliveryLatitude}`)
      .then((response) => {
        //console.log("categorical options data: " + JSON.stringify(response));
        this.setState({
          serviceFee: response.data.result[1].service_fee,
          deliveryFee: response.data.result[1].delivery_fee
        });
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  }
    
  changeTip(newTip) {
    this.setState({
      tip: newTip
    });
    //console.log("new tip: " + this.state.tip);
  }
    
  saveDeliveryDetails() {
    console.log("Saving delivery details...");
    this.props.changeDeliveryDetails({
      deliveryAddress1: this.state.deliveryAddress1,
      deliveryAddress2: this.state.deliveryAddress2,
      deliveryInstructions: this.state.deliveryInstructions
    });
    //this.props.changeAddressFirstName(e.target.value);
  }
    
  saveContactDetails() {
    console.log("Saving contact details...");
    this.props.changeContactDetails({
      contactFirstName: this.state.contactFirstName,
      contactLastName: this.state.contactLastName,
      contactEmail: this.state.contactEmail,
      contactPhone: this.state.contactPhone
    });
  }
    
  savePaymentDetails() {
    console.log("Saving payment details...");
    this.props.changePaymentDetails({
      cardName: this.state.cardName,
      cardNumber: this.state.cardNumber,
      cardCvv: this.state.cardCvv,
      cardMonth: this.state.cardMonth,
      cardYear: this.state.cardYear,
      cardZip: this.state.cardZip
    });
  }
    
  handleCheckout() {
    console.log("Processing payment...");
    /*if() {
       
    } else {
       
    }*/
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
                    this.props.history.push("/congratulations");
                  }
                );
  }
    
  applyAmbassadorCode() {
    console.log("Applying ambassador code...");
    /*axios
      .get(API_URL + 'brandAmbassador', {
        params: {
          business_uid: '200-000002',
        }
      })
      .then(res => {
        let items = res.data.result;
      })
      .catch(err => {
        console.log(err);
      });
    */
    this.setState({
      validCode: false
    });
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
          <div className={styles.topHeading}>
            <h6 className={styles.subHeading}> DELIVERY ADDRESS </h6>
          </div>
            
          <div style={{display: 'flex'}}>
            <div style = {{display: 'inline-block', width: '80%', height: '200px'}}>
              <input
                type='text'
                placeholder='Search for an Address'
                className={styles.input}
                value={this.state.deliveryAddress1}
                onChange={e => {
                  this.setState({
                    deliveryAddress1: e.target.value
                  });
                  //console.log("new address line 1: " + this.state.deliveryAddress1);
                }}
              />
              <input
                type='text'
                placeholder='Address Line 2 (Apartment number, Suite, Building, Floor, etc.)'
                className={styles.input}
                value={this.state.deliveryAddress2}
                onChange={e => {
                  this.setState({
                    deliveryAddress2: e.target.value
                  });
                  //console.log("new address line 2: " + this.state.deliveryAddress2);
                }}
              />
              <input
                type='text'
                placeholder='Delivery Instructions (Gate code, Ring bell, Call on arrival, etc.)'
                className={styles.input}
                value={this.state.deliveryInstructions}
                onChange={e => {
                  this.setState({
                    deliveryInstructions: e.target.value
                  });
                  //console.log("new instructions: " + this.state.deliveryInstructions);
                }}
              />
            </div>
              
            <div style = {{width: '20%', textAlign: 'right', paddingRight: '10px', height: '200px'}}>
              <button 
                className={styles.saveButton}
                onClick={() => this.saveDeliveryDetails()}
              >
                SAVE
              </button>
            </div>
          </div>

            
          <div style = {{display: 'inline-block', width: '80%', height: '300px'}}>
            {/*<div className = {styles.googleMap}>
              Google Map
            </div>*/}
            <div className = {styles.googleMap}>
              <WrappedMap 
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places`} 
                loadingElement={<div style={{ height: "100%" }} />}
                containerElement={<div style={{ height: "100%" }} />}
                mapElement={<div style={{ height: "100%" }} />}
              />
            </div>
          </div>
            
            
          <div className={styles.topHeading}>
            <h6 className={styles.subHeading}> CONTACT INFO </h6>
          </div>
            
          <div style={{display: 'flex'}}>
            <div style = {{display: 'inline-block', width: '38%', height: '150px'}}>
              <input
                type='text'
                placeholder='First Name'
                className={styles.inputContactLeft}
                value={this.state.contactFirstName}
                onChange={e => {
                  this.setState({
                    contactFirstName: e.target.value
                  });
                }}
              />
              <input
                type='text'
                placeholder='Phone Number'
                className={styles.inputContactLeft}
                value={this.state.contactPhone}
                onChange={e => {
                  this.setState({
                    contactPhone: e.target.value
                  });
                }}
              />
            </div>
              
            <div style = {{display: 'inline-block', width: '42%', height: '150px'}}>
              <input
                type='text'
                placeholder='Last Name'
                className={styles.inputContactRight}
                value={this.state.contactLastName}
                onChange={e => {
                  this.setState({
                    contactLastName: e.target.value
                  });
                }}
              />
              <input
                type='text'
                placeholder='Email'
                className={styles.inputContactRight}
                value={this.state.contactEmail}
                onChange={e => {
                  this.setState({
                    contactEmail: e.target.value
                  });
                }}
              />
            </div>
              
            <div style = {{width: '20%', textAlign: 'right', paddingRight: '10px', height: '150px'}}>
                <button 
                  className={styles.saveButton}
                  onClick={() => this.saveContactDetails()}
                >
                  SAVE
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
                {(() => {
                  if (this.state.tip === 0) {
                    return (
                      <button className={styles.tipButtonSelected} onClick={() => this.changeTip(0)}>
                        No Tip
                      </button>
                    );
                  } else {
                    return (
                      <button className={styles.tipButton} onClick={() => this.changeTip(0)}>
                        No Tip
                      </button>
                    );
                  }
                })()} 
                {(() => {
                  if (this.state.tip === 2) {
                    return (
                      <button className={styles.tipButtonSelected} onClick={() => this.changeTip(2)}>
                        $2
                      </button>
                    );
                  } else {
                    return (
                      <button className={styles.tipButton} onClick={() => this.changeTip(2)}>
                        $2
                      </button>
                    );
                  }
                })()} 
                {(() => {
                  if (this.state.tip === 3) {
                    return (
                      <button className={styles.tipButtonSelected} onClick={() => this.changeTip(3)}>
                        $3
                      </button>
                    );
                  } else {
                    return (
                      <button className={styles.tipButton} onClick={() => this.changeTip(3)}>
                        $3
                      </button>
                    );
                  }
                })()} 
                {(() => {
                  if (this.state.tip === 5) {
                    return (
                      <button className={styles.tipButtonSelected} onClick={() => this.changeTip(5)}>
                        $5
                      </button>
                    );
                  } else {
                    return (
                      <button className={styles.tipButton} onClick={() => this.changeTip(5)}>
                        $5
                      </button>
                    );
                  }
                })()}
              </div>
                
              <input
                type='text'
                placeholder='Enter Ambassador Code'
                className={styles.inputAmbassador}
              />
                
              <button 
                className={styles.codeButton}
                onClick={() => this.applyAmbassadorCode()}
              >
                APPLY CODE
              </button>
                
              {(() => {
                if (this.state.validCode === false) {
                  return (
                    <text style={{marginLeft: '15px', color: 'red'}}>
                      Invalid code
                    </text>
                  );
                }
              })()} 
            </div>
            
            <div style = {{display: 'inline-block', width: '20%', height: '480px'}}>
              <div className={styles.summaryRight}>
                ${(
                  this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries
                )}
              </div>
              <div className={styles.summaryRight}>
                ${this.state.addOns}
              </div>
              <div className={styles.summaryRight}>
                ${this.state.deliveryFee}
              </div>
              <div className={styles.summaryRight}>
                ${this.state.serviceFee}
              </div>
              <div className={styles.summaryRight}>
                ${(
                  this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries *
                  this.state.taxRate * 0.01
                )}
              </div>
              <div className={styles.summaryRight}>
                ${this.state.tip}
              </div>
              <div className={styles.summaryRight2}>
                ${(
                  (this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries) +
                  this.state.addOns + 
                  this.state.deliveryFee +
                  this.state.serviceFee + 
                  (this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries *
                  this.state.taxRate * 0.01) + 
                  this.state.tip
                )}
              </div>
              <div className={styles.summaryRight2}>
                ${this.state.ambassadorDiscount}
              </div>
              <hr className={styles.sumLine}></hr>
              <div className={styles.summaryRight2}>
                ${(
                  (this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries) +
                  this.state.addOns + 
                  this.state.deliveryFee +
                  this.state.serviceFee + 
                  (this.props.selectedPlan.item_price *
                  this.props.selectedPlan.num_deliveries *
                  this.state.taxRate * 0.01) + 
                  this.state.tip +
                  this.state.ambassadorDiscount
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
                <button 
                  className={styles.saveButton}
                  onClick={() => this.savePaymentDetails()}
                >
                  SAVE
                </button>
            </div>
          </div>
            
          <div style={{display: 'flex'}}>
            <div style = {{display: 'inline-block', width: '80%', height: '200px'}}>
              <input
                type='text'
                placeholder='Card Holder Name'
                className={styles.input}
                value={this.state.cardName}
                onChange={e => {
                  this.setState({
                    cardName: e.target.value
                  });
                }}
              />
              <input
                type='text'
                placeholder='Credit Card Number'
                className={styles.input}
                value={this.state.cardNumber}
                onChange={e => {
                  this.setState({
                    cardNumber: e.target.value
                  });
                }}
              />
            <div style = {{display: 'inline-flex', height: '100px', width: '125%'}}>
              <input
                type='text'
                placeholder='MM'
                className={styles.monthInput}
                value={this.state.cardMonth}
                onChange={e => {
                  this.setState({
                    cardMonth: e.target.value
                  });
                }}
              />
              <div className={styles.dateSlash}>/</div>
              <input
                type='text'
                placeholder='YEAR'
                className={styles.yearInput}
                value={this.state.cardYear}
                onChange={e => {
                  this.setState({
                    cardYear: e.target.value
                  });
                }}
              />
              <input
                type='text'
                placeholder='CVV'
                className={styles.cvvInput}
                value={this.state.cardCvv}
                onChange={e => {
                  this.setState({
                    cardCvv: e.target.value
                  });
                }}
              />
              <input
                type='text'
                placeholder='ZIPCODE'
                className={styles.zipInput}
                value={this.state.cardZip}
                onChange={e => {
                  this.setState({
                    cardZip: e.target.value
                  });
                }}
              />
            <button
              className={styles.finishButton}
              onClick={() => {
                this.handleCheckout();
                /*console.log("this.props.email: " + this.props.email);
                console.log("this.props.customerId: " + this.props.customerId);
                console.log("this.props.socialMedia: " + this.props.socialMedia);
                console.log("this.props.password: " + this.props.email);
                console.log("this.props.email: " + this.props.email);
                console.log("this.props.email: " + this.props.email);*/
                /*this.props.submitPayment(
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
                    this.props.history.push("/congratulations");
                  }
                );*/
              }}
            >
              FINISH
            </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PaymentDetails.propTypes = {
  changeAddressEmail: PropTypes.func.isRequired,
  changeDeliveryDetails: PropTypes.func.isRequired,
  changeContactDetails: PropTypes.func.isRequired,
  changePaymentDetails: PropTypes.func.isRequired,
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
  password: state.subscribe.paymentPassword,
  deliveryDetails: state.subscribe.savedDeliveryDetails,
  contactDetails: state.subscribe.savedContactDetails,
  paymentDetails: state.subscribe.savedPaymentDetails
});

const functionList = {
  fetchProfileInformation,
  changeAddressEmail,
  changeDeliveryDetails,
  changeContactDetails,
  changePaymentDetails,
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
  changeCardMonth,
  changeCardYear,
  changeCardZip,
  changeCardCvv,
  submitPayment
};

export default connect(
  mapStateToProps,
  functionList
)(withRouter(PaymentDetails));
