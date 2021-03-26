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

import {submitGuestSignUp} from "../../reducers/actions/loginActions";

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
import { ThemeProvider } from "react-bootstrap";

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
      ambassadorCode: "",
      validCode: true,
      name: "",
      number: "",
      month: "",
      year: "",
      cvv: "",
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      instructions: "",
      street: "",
      city: "",
      state: "",
      cardZip: "",
      addressZip: "",
      unit: "",
      latitude: 37.2270928,
      longitude: -121.8866517,
      customerUid: "",
      customerPassword: "",
    };
  }

  componentDidMount() {
    //console.log("customer uid: " + this.state.customerId);
    //console.log("PaymentDetails selected plan: " + JSON.stringify(this.props.selectedPlan));
    if (
      document.cookie
        .split(";")
        .some(item => item.trim().startsWith("customer_uid="))
    ) {
      let customerUid = document.cookie
        .split("; ")
        .find(item => item.startsWith("customer_uid="))
        .split("=")[1];
      console.log("customer uid: " + customerUid);
      this.setState({
        mounted: true,
        customerUid: customerUid
      });
      this.props.fetchProfileInformation(customerUid);
      console.log("payment details props: " + JSON.stringify(this.props));
      //console.log("(logged in) customerUid: " + this.state.customerUid);
    } else {
      // Reroute to log in page
      console.log("Payment-details NOT LOGGED IN");
      this.setState({
        mounted: true,
        customerUid: "NULL"
      });
      //console.log("(not logged in) customerUid: " + this.state.customerUid);
      //this.props.history.push("/");
    }
      
    this.setState({
      street: this.props.address.street,
      city: this.props.address.city,
      state: this.props.address.state,
      addressZip: this.props.address.zip,
      unit: this.props.address.unit,
      instructions: this.props.instructions,
      firstName: this.props.addressInfo.firstName,
      lastName: this.props.addressInfo.lastName,
      email: this.props.email,
      phone: this.props.addressInfo.phoneNumber,
      name: this.props.creditCard.name,
      number: this.props.creditCard.number,
      cvv: this.props.creditCard.cvv,
      month: this.props.creditCard.month,
      year: this.props.creditCard.year,
      cardZip: this.props.creditCard.zip
    });
    
    /*https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/categoricalOptions/-121.8866517,37.2270928*/
    // Get payment summary details
    axios
      .get(`${API_URL}categoricalOptions/${this.state.longitude},${this.state.latitude}`)
      .then((response) => {
        //console.log("categorical options data: " + JSON.stringify(response));
        this.setState({
          serviceFee: response.data.result[1].service_fee,
          deliveryFee: response.data.result[1].delivery_fee,
          taxRate: response.data.result[1].tax_rate
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
  }
    
  saveDeliveryDetails() {
    if(this.state.customerUid !== "NULL"){
      console.log("Saving delivery details...");

      console.log("address street: " + this.state.street);
      console.log("address city: " + this.state.city);
      console.log("address state: " + this.state.state);
      console.log("address zip: " + this.state.addressZip);
      
      let object = {
        uid: this.state.customerUid,
        first_name: this.props.addressInfo.firstName,
        last_name: this.props.addressInfo.lastName,
        phone: this.props.addressInfo.phoneNumber,
        email: this.props.email,
        address: this.state.street,
        unit: this.state.unit,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.addressZip,
        noti: "false"
      };
                  
      console.log("(delivery details) update profile URL:" + API_URL + 'UpdateProfile');
      console.log(JSON.stringify(object));
      
      axios
        .post(API_URL + 'UpdateProfile', object)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
          if (err.response) {
            console.log("error: " + JSON.stringify(err.response));
          }
        });
      
      this.props.changeDeliveryDetails({
        street: this.state.street,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.addressZip,
        unit: this.state.unit,
        instructions: this.state.instructions
      });
    } else {
      console.log("Could not save delivery details: not signed in");
    }
  }
    
  saveContactDetails() {
    console.log("Saving contact details...");
    console.log("firstName: " + this.props.addressInfo.firstName);
    console.log("lastName: " + this.props.addressInfo.lastName);
    console.log("email: " + this.props.email);
    console.log("phone: " + this.props.addressInfo.phone);
      
    let object = {
      uid: this.state.customerUid,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      phone: this.state.phone,
      email: this.props.email,
      address: this.props.street,
      unit: this.props.address.unit,
      city: this.props.address.city,
      state: this.props.address.state,
      zip: this.props.address.zip,
      noti: "false"
    };
                  
    console.log("(contact details) update profile URL:" + API_URL + 'UpdateProfile');
    console.log(JSON.stringify(object));
      
    axios
      .post(API_URL + 'UpdateProfile', object)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
        if (err.response) {
          console.log("error: " + JSON.stringify(err.response));
        }
      });
      
    this.props.changeContactDetails({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phone: this.state.phone
    });
  }
    
  savePaymentDetails() {
    console.log("Saving payment details...");
    this.props.changePaymentDetails({
      name: this.state.name,
      number: this.state.number,
      cvv: this.state.cvv,
      month: this.state.month,
      year: this.state.year,
      zip: this.state.cardZip
    });
  }
    
  handleGuestCheckout = (guestInfo) => {
    //this.props.history.push("/login");
    console.log("Guest sign up successful!");
    console.log("New guest info: " + JSON.stringify(guestInfo));

    axios
    .get(API_URL + 'Profile/' + guestInfo.customer_uid)
    .then(res => {
        //console.log("new guest profile fetch info: " + JSON.stringify(res));

        let profileInfo = res.data.result[0];

        console.log("Guest profileInfo: " + JSON.stringify(profileInfo));

        let purchasedItem = [
          {
            qty: (this.props.selectedPlan.num_deliveries).toString(),
            name: this.props.selectedPlan.item_name,
            price: (this.props.selectedPlan.item_price*this.props.selectedPlan.num_deliveries*(1-(this.props.selectedPlan.delivery_discount*0.01))).toFixed(2),
            item_uid: this.props.selectedPlan.item_uid,
            itm_business_uid: '200-000002',
          },
        ];

        let checkoutInfo = {
          customer_uid: profileInfo.customer_uid,
          salt: profileInfo.password_hashed,
          business_uid: '200-000002',
          delivery_first_name: profileInfo.customer_first_name,
          delivery_last_name: profileInfo.customer_last_name,
          delivery_email: profileInfo.customer_email,
          delivery_phone: profileInfo.customer_phone_num,
          delivery_address: profileInfo.customer_address,
          delivery_unit: profileInfo.customer_unit,
          delivery_city: profileInfo.customer_city,
          delivery_state: profileInfo.customer_state,
          delivery_zip: profileInfo.customer_zip,
          delivery_instructions: this.state.instructions,
          delivery_longitude: profileInfo.customer_long,
          delivery_latitude: profileInfo.customer_lat,
          items: purchasedItem,
          amount_due: (this.props.selectedPlan.item_price*this.props.selectedPlan.num_deliveries*(1-(this.props.selectedPlan.delivery_discount*0.01))).toFixed(2),
          amount_discount: '0',
          amount_paid: '0',
          cc_num: this.state.number,
          cc_exp_month: this.state.month,
          cc_exp_year: this.state.year,
          cc_cvv: this.state.cvv,
          cc_zip: this.state.cardZip
        };
        console.log("guest checkoutInfo: " + JSON.stringify(checkoutInfo));
        axios
          .post(API_URL + 'checkout', checkoutInfo)
          .then(res2 => {
            console.log(res2);
            this.props.history.push("/congrats");
          })
          .catch(err2 => {
            console.log(err2);
            if (err2.response) {
              console.log(err2.response);
            }
          });

    })
    .catch(err => {
      if (err.response) {
        console.log(err.response);
      } else {
        console.log(err.toString());
      }
    });
  };

  handleCheckout() {
    console.log("Processing payment...");
      
    console.log("customerUid: " + this.state.customerUid);
      
    console.log("item(s) to be purchased: " + JSON.stringify(this.props.selectedPlan));
      
    /*
    createAccount w/ info from guest
    => response gives customerUid
    => call profile endpoint w/ new customerUid
    => response gives hashed_password
    => use hashed_password as salt in checkout JSON object
    */
      
    if(this.state.customerUid === "NULL") {

      let streetNum = this.state.street.substring(0,this.state.street.indexOf(" "));

      console.log("=== GUEST PASSWORD ===");
      console.log("street: " + this.state.street);
      console.log("name: " + this.state.firstName);
      console.log("street #: " + streetNum);

      let guestPassword = this.state.firstName + streetNum;

      console.log("password: '" + guestPassword + "'");

      this.props.submitGuestSignUp(
        this.state.email,
        guestPassword,
        this.state.firstName,
        this.state.lastName,
        this.state.phone,
        this.state.street,
        this.state.unit,
        this.state.city,
        this.state.state,
        this.state.addressZip,
        this.handleGuestCheckout
      );
      
    } else {
      this.props.submitPayment(
        this.props.email,
        this.state.customerUid,
        this.props.socialMedia,
        this.state.customerPassword,
        this.state.firstName,
        this.state.lastName,
        this.state.phone,
        this.state.street,
        this.state.unit,
        this.state.city,
        this.state.state,
        this.state.addressZip,
        this.state.instructions,
        this.props.selectedPlan,
        this.state.number,
        this.state.month,
        this.state.year,
        this.state.cvv,
        this.state.addressZip,
        () => {
          this.props.history.push("/congrats");
        }
      );
    }
  }
    
  applyAmbassadorCode() {
    console.log("Applying ambassador code...");
      
    axios
      .post(API_URL + 'brandAmbassador/generate_coupon',
        {
          amb_email: this.state.ambassadorCode,
          cust_email: this.props.email
        }
      )
      .then(res => {
        let items = res.data.result[0];
        console.log("ambassador code response: " + JSON.stringify(items));
        if(items.valid === "TRUE") {
          this.setState({
            validCode: true,
            ambassadorDiscount: (
              items.discount_amount +
              items.discount_shipping
            )
          });
        } else {
          this.setState({
            validCode: false
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    // if (!this.state.mounted) {
    //   return null;
    // }
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
            <div style = {{display: 'inline-block', width: '80%', height: '350px'}}>
              <input
                type='text'
                placeholder='Search for an Address'
                className={styles.input}
                value={this.state.street}
                onChange={e => {
                  this.setState({
                    street: e.target.value
                  });
                  //console.log("new address line 1: " + this.state.deliveryAddress1);
                }}
              />
              <input
                type='text'
                placeholder='Address Line 2 (Apartment number, Suite, Building, Floor, etc.)'
                className={styles.input}
                value={this.state.unit}
                onChange={e => {
                  this.setState({
                    unit: e.target.value
                  });
                  //console.log("new address line 2: " + this.state.deliveryAddress2);
                }}
              />
              <input
                type='text'
                placeholder='City'
                className={styles.input}
                value={this.state.city}
                onChange={e => {
                  this.setState({
                    city: e.target.value
                  });
                }}
              />
              <input
                type='text'
                placeholder='State'
                className={styles.input}
                value={this.state.state}
                onChange={e => {
                  this.setState({
                    state: e.target.value
                  });
                }}
              />
              <input
                type='text'
                placeholder='Zipcode'
                className={styles.input}
                value={this.state.addressZip}
                onChange={e => {
                  this.setState({
                    addressZip: e.target.value
                  });
                }}
              />
              <input
                type='text'
                placeholder='Delivery Instructions (Gate code, Ring bell, Call on arrival, etc.)'
                className={styles.input}
                value={this.state.instructions}
                onChange={e => {
                  this.setState({
                    instructions: e.target.value
                  });
                  //console.log("new instructions: " + this.state.deliveryInstructions);
                }}
              />
            </div>
              
            <div style = {{width: '20%', textAlign: 'right', paddingRight: '10px', height: '350px'}}>
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
                value={this.state.firstName}
                onChange={e => {
                  this.setState({
                    firstName: e.target.value
                  });
                }}
              />
              <input
                type='text'
                placeholder='Phone Number'
                className={styles.inputContactLeft}
                value={this.state.phone}
                onChange={e => {
                  this.setState({
                    phone: e.target.value
                  });
                }}
              />
            </div>
              
            <div style = {{display: 'inline-block', width: '42%', height: '150px'}}>
              <input
                type='text'
                placeholder='Last Name'
                className={styles.inputContactRight}
                value={this.state.lastName}
                onChange={e => {
                  this.setState({
                    lastName: e.target.value
                  });
                }}
              />
              {/*<input
                type='text'
                placeholder='Email'
                className={styles.inputContactRight}
                value={this.props.email}
                onChange={e => {
                }}
              />*/}
              {(() => {
                  if (this.state.customerUid === "NULL") {
                    return (
                      <input
                        type='text'
                        placeholder='Email'
                        className={styles.inputContactRight}
                        value={this.state.email}
                        onChange={e => {
                          this.setState({
                            email: e.target.value
                          })
                        }}
                      />
                    );
                  } else {
                    return (
                      <input
                        type='text'
                        placeholder='Email'
                        className={styles.inputContactRight}
                        value={this.props.email}
                        onChange={e => {
                    
                        }}
                      />
                    );
                  }
                })()} 
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
                onChange={e => {
                  this.setState({
                    ambassadorCode: e.target.value
                  });
                  console.log("ambassador code: " + this.state.ambassadorCode);
                }}
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
                ${(-1)*this.state.ambassadorDiscount}
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
                  (-1)*this.state.ambassadorDiscount
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
                value={this.state.name}
                onChange={e => {
                  this.setState({
                    name: e.target.value
                  });
                }}
              />
              <input
                type='text'
                placeholder='Credit Card Number'
                className={styles.input}
                value={this.state.number}
                onChange={e => {
                  this.setState({
                    number: e.target.value
                  });
                }}
              />
              <input
                type='text'
                placeholder='Enter Password'
                className={styles.input}
                value={this.state.customerPassword}
                onChange={e => {
                  this.setState({
                    customerPassword: e.target.value
                  });
                }}
              />
            <div style = {{display: 'inline-flex', height: '100px', width: '125%'}}>
              <input
                type='text'
                placeholder='MM'
                className={styles.monthInput}
                value={this.state.month}
                onChange={e => {
                  this.setState({
                    month: e.target.value
                  });
                }}
              />
              <div className={styles.dateSlash}>/</div>
              <input
                type='text'
                placeholder='YEAR'
                className={styles.yearInput}
                value={this.state.year}
                onChange={e => {
                  this.setState({
                    year: e.target.value
                  });
                }}
              />
              <input
                type='text'
                placeholder='CVV'
                className={styles.cvvInput}
                value={this.state.cvv}
                onChange={e => {
                  this.setState({
                    cvv: e.target.value
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
  submitGuestSignUp: PropTypes.func.isRequired,
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
  address: state.subscribe.address,
  addressInfo: state.subscribe.addressInfo,
  creditCard: state.subscribe.creditCard
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
  submitPayment,
  submitGuestSignUp
};

export default connect(
  mapStateToProps,
  functionList
)(withRouter(PaymentDetails));
