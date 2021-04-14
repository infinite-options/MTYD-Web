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
  chooseMealsDelivery,
  choosePaymentOption,
  submitPayment
} from "../../reducers/actions/subscriptionActions";
import PayPal from './Paypal';

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
import {WrappedMap} from "../Map";
import axios from 'axios';
import { API_URL } from '../../reducers/constants';

import styles from "./paymentDetails.module.css";
import { ThemeProvider } from "react-bootstrap";
import PopLogin from '../PopLogin';
import Popsignup from '../PopSignup';

import StripeElement from './StripeElement';

import fetchAddressCoordinates from '../../utils/FetchAddressCoordinates';

const google = window.google;

class PaymentDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
      showPaymentInfo: false,
      ambassadorCode: "",
      paymentSummary: {
        mealSubPrice: "0.00",
        discountAmount: "0.00",
        addOns: "0.00",
        tip: "2.00",
        serviceFee: "0.00",
        deliveryFee: "0.00",
        taxRate: 0,
        taxAmount: "0.00",
        ambassadorDiscount: "0.00",
        total: "0.00",
        subtotal: "0.00"
      },
      cardInfo: {
        name: "",
        number: "",
        month: "",
        year: "",
        cvv: "",
        cardZip: ""
      },
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
      latitude: "",
      longitude: "",
      customerUid: "",
      customerPassword: "",
      checkoutMessage: "",
      displayError: false,
      login_seen: false,
      signUpSeen: false, 
      checkoutError: false,
      ambassadorMessage: "",
      ambassadorError: false,
      paymentType: 'NULL',
      fetchingFees: false
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

    axios.get(API_URL + "Profile/" + this.props.customerId)
      .then(res=>{

        this.setState({
          latitude: res.data.result[0].customer_lat,
          longitude: res.data.result[0].customer_long,
        })
        console.log(this.state.latitude);
        console.log(this.state.longitude);
      })
    console.log(this.props)

    let temp_lat;
    let temp_lng;

    if(this.state.latitude==''){
      temp_lat = 37.3382;
    }
    else{
      temp_lat = this.state.latitude;
    }

    if(this.state.longitude==''){
      temp_lng = -121.893028
    }
    else{
      temp_lng = this.state.longitude;
    }

    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: temp_lat, lng: temp_lng},
      zoom: 12,
    });
    console.log(map)
    const input = document.getElementById("pac-input");
    const options = {
      componentRestrictions: { country: "us" }
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.bindTo("bounds", map);
    const infowindow = new google.maps.InfoWindow();
    const marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
      let address1 = "";
      let postcode = "";
      let city = '';
      let state = '';
      let address1Field = document.querySelector("#pac-input");
      let postalField = document.querySelector("#postcode");
      infowindow.close();
      marker.setVisible(false);
      const place = autocomplete.getPlace();
      console.log(place)
      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
      
      if (place.geometry.viewport) {
        console.log('here')
        map.fitBounds(place.geometry.viewport);
      } else {
        console.log('there')
        map.setCenter(place.geometry.location);
      }

      map.setZoom(17);
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      for (const component of place.address_components) {
        const componentType = component.types[0];
        switch (componentType) {
          case "street_number": {
            address1 = `${component.long_name} ${address1}`;
            break;
          }
    
          case "route": {
            address1 += component.short_name;
            break;
          }
    
          case "postal_code": {
            postcode = `${component.long_name}${postcode}`;
            break;
          }
  
          case "locality":
            document.querySelector("#locality").value = component.long_name;
            city = component.long_name;
            break;
    
          case "administrative_area_level_1": {
            document.querySelector("#state").value = component.short_name;
            state= component.short_name;
            break;
          }
          
        }
      }
      address1Field.value = address1;
      postalField.value = postcode;

      this.setState({
        name: place.name,
        street_address: address1,
        city: city,
        state: state,
        zip_code: postcode,
        lat:place.geometry.location.lat(),
        lng:place.geometry.location.lng(),
      })



    });





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
      this.setState(prevState => ({
        mounted: true,
        customerUid: customerUid,
        paymentSummary: {
          ...prevState.paymentSummary,
          mealSubPrice: (
            this.props.selectedPlan.item_price *
            this.props.selectedPlan.num_deliveries
          ).toFixed(2),
          discountAmount: (
            this.props.selectedPlan.item_price *
            this.props.selectedPlan.num_deliveries *
            this.props.selectedPlan.delivery_discount * 0.01
          ).toFixed(2),
          taxAmount: (
            this.props.selectedPlan.item_price *
            this.props.selectedPlan.num_deliveries *
            (1-(this.props.selectedPlan.delivery_discount*0.01)) *
            this.state.paymentSummary.taxRate * 0.01
          ).toFixed(2)
        }
      }));
      console.log("paymentSummary: " + JSON.stringify(this.state.paymentSummary));
      console.log("taxAmount toFixed: " + this.state.taxAmount);
      console.log("discountAmount toFixed: " + this.state.discountAmount);
      this.props.fetchProfileInformation(customerUid);
      //console.log("payment details props: " + JSON.stringify(this.props));
    } else {
      // Reroute to log in page
      console.log("Payment-details NOT LOGGED IN");
      this.setState(prevState => ({
        mounted: true,
        customerUid: "GUEST",
        paymentSummary: {
          ...prevState.paymentSummary,
          mealSubPrice: (
            this.props.selectedPlan.item_price *
            this.props.selectedPlan.num_deliveries
          ).toFixed(2),
          discountAmount: (
            this.props.selectedPlan.item_price *
            this.props.selectedPlan.num_deliveries *
            this.props.selectedPlan.delivery_discount * 0.01
          ).toFixed(2),
          taxAmount: (
            this.props.selectedPlan.item_price *
            this.props.selectedPlan.num_deliveries *
            (1-(this.props.selectedPlan.delivery_discount*0.01)) *
            this.state.paymentSummary.taxRate * 0.01
          ).toFixed(2)
        }
      }));
      this.setTotal();
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
  }
    
  changeTip(newTip) {
    this.setState(prevState => ({
      paymentSummary: {
        ...prevState.paymentSummary,
        tip: newTip
      }
    }));
  }
    
  saveDeliveryDetails() {
    console.log("Saving delivery details...");

    this.setState({
      fetchingFees: true
    });
      
    if(this.state.customerUid !== "GUEST"){
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
                  
      console.log("(saveDeliveryDetails) updateProfile object: " + JSON.stringify(object));
      
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
    }
      
    this.props.changeDeliveryDetails({
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.addressZip,
      unit: this.state.unit,
      instructions: this.state.instructions
    });

    fetchAddressCoordinates(
      this.state.street,
      this.state.city,
      this.state.state,
      this.state.addressZip,
      (coords) => {
        console.log("Fetched coordinates: " + JSON.stringify(coords));
        this.setState({
          latitude: coords.latitude,
          longitude: coords.longitude
        });
        axios
          .get(`${API_URL}categoricalOptions/${coords.longitude},${coords.latitude}`)
          .then((response) => {
            console.log("Categorical Options response: " + JSON.stringify(response));
            if(response.data.result.length !== 0) {
              this.setState(prevState => ({
                paymentSummary: {
                  ...prevState.paymentSummary,
                  taxRate: response.data.result[1].tax_rate,
                  serviceFee: response.data.result[1].service_fee.toFixed(2),
                  deliveryFee: response.data.result[1].delivery_fee.toFixed(2),
                  taxAmount: (
                    this.props.selectedPlan.item_price *
                    this.props.selectedPlan.num_deliveries *
                    (1-(this.props.selectedPlan.delivery_discount*0.01)) *
                    response.data.result[1].tax_rate * 0.01
                  ).toFixed(2)
                },
                fetchingFees: false
              }));
              console.log("catOptions taxAmount: " + this.state.paymentSummary.taxAmount);
            } else {
              this.setState(prevState => ({
                paymentSummary: {
                  ...prevState.paymentSummary,
                  taxRate: 0,
                  serviceFee: "0.00",
                  deliveryFee: "0.00",
                  taxAmount: "0.00"
                }
              }));
            }
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
            }
            console.log(err);
          });
      }
    );

    //console.log("NEW COORDIANTES: " + JSON.stringify(coordinates));

    console.log("delivery props: " + JSON.stringify(this.props));
  }
    
  saveContactDetails() {
    console.log("Saving contact details...");
      
    if(this.state.customerUid !== "GUEST"){
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
                  
      console.log("(saveContactDetails) updateProfile object: " + JSON.stringify(object));
      
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
    }
      
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
    
  applyAmbassadorCode() {
    /*console.log("Applying ambassador code...");
    console.log("this.state.ambassadorCode: " + this.state.ambassadorCode);
    console.log("this.props.email: " + this.props.email);
    console.log("this.state.email: {" + this.state.email + "}");*/

    if(this.state.email !== ""){
      console.log("(Ambassador code) Valid email");
    } else {
      console.log("(Ambassador code) Invalid email");
    }
      
    axios
      .post(API_URL + 'brandAmbassador/generate_coupon',
        {
          amb_email: this.state.ambassadorCode,
          cust_email: this.state.email
        }
      )
      .then(res => {
        let items = res.data
        console.log("ambassador code response: " + JSON.stringify(res));

        if(typeof(items) === "string") {
          console.log("Invalid code");
          this.setState({
            validCode: false,
            ambassadorMessage: items
          });
          this.displayAmbassadorError();
        } else {
          console.log("Valid code");
          items = items.result[0];
          console.log("result: " + JSON.stringify(items));
          this.setState(prevState => ({
            validCode: true,
            paymentSummary: {
              ...prevState.paymentSummary,
              ambassadorDiscount: (
                items.discount_amount +
                items.discount_shipping
              ).toFixed(2)
            }
          }));
        }
      })
      .catch(err => {
        console.log("Ambassador code error: " + err);
      });
  }

  displayCheckoutError = () => {
    if(this.state.checkoutError === false) {
      this.setState({
        checkoutErrorModal: styles.changeErrorModalPopUpShow,
        checkoutError: true,
      });
    }else{
      this.setState({
        checkoutErrorModal: styles.changeErrorModalPopUpHide,
        checkoutError: false
      });
    }
    console.log("\ncheckout error toggled to " + this.state.checkoutError + "\n\n");
  }

  displayAmbassadorError = () => {
    if(this.state.ambassadorError === false) {
      this.setState({
        ambassadorErrorModal: styles.changeErrorModalPopUpShow,
        ambassadorError: true,
      })
    }else{
      this.setState({
        ambassadorErrorModal: styles.changeErrorModalPopUpHide,
        ambassadorError: false
      })
    }
    console.log("\nambassador error toggled to " + this.state.ambassadorError + "\n\n");
  }

  setPaymentType(type) {
    this.setState({
      paymentType: type
    });
  }

  calculateSubtotal() {
    let subtotal = (
      parseFloat(this.state.paymentSummary.mealSubPrice) -
      parseFloat(this.state.paymentSummary.discountAmount) + 
      parseFloat(this.state.paymentSummary.deliveryFee) + 
      parseFloat(this.state.paymentSummary.serviceFee) +
      parseFloat(this.state.paymentSummary.taxAmount) + 
      parseFloat(this.state.paymentSummary.tip)
    );
    /*this.setState(prevState => ({
      ...prevState.paymentSummary,
      subtotal: subtotal.toFixed(2)
    }));*/
    return subtotal.toFixed(2);
  }

  calculateTotal() {
    let total = (
      parseFloat(this.state.paymentSummary.mealSubPrice) -
      parseFloat(this.state.paymentSummary.discountAmount) + 
      parseFloat(this.state.paymentSummary.deliveryFee) + 
      parseFloat(this.state.paymentSummary.serviceFee) +
      parseFloat(this.state.paymentSummary.taxAmount) + 
      parseFloat(this.state.paymentSummary.tip) -
      parseFloat(this.state.paymentSummary.ambassadorDiscount)
    );
    /*this.setState(prevState => ({
      ...prevState.paymentSummary,
      total: total.toFixed(2)
    }));*/
    return total.toFixed(2);
  }

  setTotal() {
    let total = this.calculateTotal();
    let subtotal = this.calculateSubtotal();
    /*console.log("setTotal total: " + total);
    console.log("setTotal subtotal: " + subtotal);*/
    this.setState(prevState => ({
      paymentSummary: {
        ...prevState.paymentSummary,
        total,
        subtotal
      }
    }));
  }

  render() {
    let loggedInByPassword = false;
    if (this.state.customerUid !== "GUEST" && this.props.socialMedia === "NULL") {
      loggedInByPassword = true;
    }
    return (
      <div>
        <WebNavBar 
        poplogin = {this.togglePopLogin}
        popSignup = {this.togglePopSignup}
        />
        {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
        {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}

        {(() => {
          // console.log("\ndisplay checkout error message? " + this.state.checkoutError + "\n\n");
          if (this.state.checkoutError === true) {
            return (
              <>
              <div className = {this.state.checkoutErrorModal}>
                <div className  = {styles.changeErrorModalContainer}>
                    <a  style = {{
                            color: 'black',
                            textAlign: 'center', 
                            fontSize: '45px', 
                            zIndex: '2', 
                            float: 'right', 
                            position: 'absolute', top: '0px', left: '350px', 
                            transform: 'rotate(45deg)', 
                            cursor: 'pointer'}} 
                            
                            onClick = {this.displayCheckoutError}>+</a>

                    <div style = {{display: 'block', width: '300px', margin: '40px auto 0px'}}>
                      <h6 style = {{margin: '5px', color: 'orange', fontWeight: 'bold', fontSize: '25px'}}>PAYMENT ERROR</h6>
                      <text>{this.state.checkoutMessage}</text>
                    </div> 
                  </div>
                </div>
              </>
            );
          }
        })()} 
        {(() => {
          // console.log("\ndisplay ambassador error message? " + this.state.ambassadorError + "\n\n");
          if (this.state.ambassadorError === true) {
            return (
              <>
              <div className = {this.state.ambassadorErrorModal}>
                <div className  = {styles.changeErrorModalContainer}>
                    <a  style = {{
                            color: 'black',
                            textAlign: 'center', 
                            fontSize: '45px', 
                            zIndex: '2', 
                            float: 'right', 
                            position: 'absolute', top: '0px', left: '350px', 
                            transform: 'rotate(45deg)', 
                            cursor: 'pointer'}} 
                            
                            onClick = {this.displayAmbassadorError}>+</a>

                    <div style = {{display: 'block', width: '300px', margin: '40px auto 0px'}}>
                      <h6 style = {{margin: '5px', color: 'orange', fontWeight: 'bold', fontSize: '25px'}}>AMBASSADOR CODE ERROR</h6>
                      <text>{this.state.ambassadorMessage}</text>
                    </div> 
                  </div>
                </div>
              </>
            );
          }
        })()} 
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
                placeholder={this.props.address.street==''?"street":this.props.address.street}
                className={styles.input}
                id="pac-input"
              />
              <input
                type='text'
                placeholder={this.props.address.unit==''?'Address Line 2 (Apartment number, Suite, Building, Floor, etc.)':this.props.address.unit}
                className={styles.input}
                value={this.state.unit}
                onChange={e => {
                  this.setState({
                    unit: e.target.value
                  });
                }}
              />
              <input
                type='text'
                placeholder={this.props.address.city==''?"city":this.props.address.city}
                id="locality" name="locality"

                className={styles.input}
              />
              <input
                type='text'
                placeholder={this.props.address.state==''?"State":this.props.address.state}
                
                className={styles.input}
                id="state" name="state"
              />
              <input
                type='text'
                placeholder={this.props.address.zip==''?"zip":this.props.address.zip}
                className={styles.input}
                id="postcode" name="postcode"

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
            <div className = {styles.googleMap} id = "map"/>
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
              {(() => {
                  if (this.state.customerUid === "GUEST") {
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



          {(() => {
            if (this.state.showPaymentInfo === false) {
              return (
                <button className={styles.proceedButton} onClick={() => {
                  this.setState({
                    showPaymentInfo: true
                  });
                  this.saveDeliveryDetails();
                  this.saveContactDetails();
                }}>
                  Proceed to Payment
                </button>
              );
            } else {
              return (
                <>
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
                Discount ({this.props.selectedPlan.delivery_discount}%):
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
                  if (this.state.paymentSummary.tip === "0.00") {
                    return (
                      <button className={styles.tipButtonSelected} onClick={() => this.changeTip("0.00")}>
                        No Tip
                      </button>
                    );
                  } else {
                    return (
                      <button className={styles.tipButton} onClick={() => this.changeTip("0.00")}>
                        No Tip
                      </button>
                    );
                  }
                })()}
                {(() => {
                  if (this.state.paymentSummary.tip === "2.00") {
                    return (
                      <button className={styles.tipButtonSelected} onClick={() => this.changeTip("2.00")}>
                        $2
                      </button>
                    );
                  } else {
                    return (
                      <button className={styles.tipButton} onClick={() => this.changeTip("2.00")}>
                        $2
                      </button>
                    );
                  }
                })()} 
                {(() => {
                  if (this.state.paymentSummary.tip === "3.00") {
                    return (
                      <button className={styles.tipButtonSelected} onClick={() => this.changeTip("3.00")}>
                        $3
                      </button>
                    );
                  } else {
                    return (
                      <button className={styles.tipButton} onClick={() => this.changeTip("3.00")}>
                        $3
                      </button>
                    );
                  }
                })()} 
                {(() => {
                  if (this.state.paymentSummary.tip === "5.00") {
                    return (
                      <button className={styles.tipButtonSelected} onClick={() => this.changeTip("5.00")}>
                        $5
                      </button>
                    );
                  } else {
                    return (
                      <button className={styles.tipButton} onClick={() => this.changeTip("5.00")}>
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
                }}
              />
                
              <button 
                className={styles.codeButton}
                onClick={() => this.applyAmbassadorCode()}
              >
                APPLY CODE
              </button>
                
            </div>
            
            <div style = {{display: 'inline-block', width: '20%', height: '480px'}}>
              <div className={styles.summaryRight}>
                ${this.state.paymentSummary.mealSubPrice}
              </div>
              <div className={styles.summaryRight}>
                {console.log("----- discount: " + this.state.paymentSummary.discountAmount)}
                -${this.state.paymentSummary.discountAmount}
              </div>
              <div className={styles.summaryRight}>
                ${(this.state.paymentSummary.deliveryFee)}
              </div>
              <div className={styles.summaryRight}>
                ${(this.state.paymentSummary.serviceFee)}
              </div>
              <div className={styles.summaryRight}>
                {console.log("----- tax: " + this.state.paymentSummary.taxAmount)}
                ${(this.state.paymentSummary.taxAmount)}
              </div>
              <div className={styles.summaryRight}>
                ${(this.state.paymentSummary.tip)}
              </div>
              <div className={styles.summaryRight2}>
                ${this.calculateSubtotal()}
              </div>
              <div className={styles.summaryRight2}>
                {console.log("ambassador discount: " + this.state.ambassadorDiscount)}
                -${this.state.paymentSummary.ambassadorDiscount}
              </div>
              <hr className={styles.sumLine}></hr>
              <div className={styles.summaryRight2}>
                ${this.calculateTotal()}
              </div>
            </div>
          </div>
            
          <div className={styles.topHeading}>
            <h6 className={styles.subHeading}>PAYMENT OPTIONS</h6>
          </div>
            
          <div style={{display: 'flex'}}>
            <div style = {{display: 'inline-block', width: '80%', height: '500px'}}>
              <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={() => {
                  if(this.state.paymentType === 'STRIPE'){
                    this.setPaymentType('NULL');
                  } else {
                    this.setPaymentType('STRIPE');
                  }
                  this.setTotal();
                }}>
                  STRIPE
                </button>
              </div>
              <div className = {styles.buttonContainer}>
                {/* {console.log("stripe payment summary: " + JSON.stringify(this.state.paymentSummary))} */}
                {this.state.paymentType === 'STRIPE' && (
                  <StripeElement
                    customerPassword={this.state.customerPassword}
                    deliveryInstructions={this.state.instructions}
                    setPaymentType={this.setPaymentType}
                    paymentSummary={this.state.paymentSummary}
                    loggedInByPassword={loggedInByPassword}
                    latitude={this.state.latitude.toString()}
                    longitude={this.state.longitude.toString()}
                    email={this.state.email}
                    customerUid={this.state.customerUid}
                    cardInfo={this.state.cardInfo}
                  />
                )}
              </div>
              <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={() => {
                  if(this.state.paymentType === 'PAYPAL'){
                    this.setPaymentType('NULL');
                  } else {
                    this.setPaymentType('PAYPAL');
                  }
                  this.setTotal();
                }}>
                  PAYPAL
                </button>
                {console.log("paypal payment summary: " + JSON.stringify(this.state.paymentSummary))}
                {this.state.paymentType === 'PAYPAL' && 
                 parseFloat(this.state.paymentSummary.total) > 0  && (
                  <PayPal
                    deliveryInstructions={this.state.instructions}
                    paymentSummary={this.state.paymentSummary}
                    customerPassword={this.state.customerPassword}
                    loggedInByPassword={loggedInByPassword}
                    latitude={this.state.latitude.toString()}
                    longitude={this.state.longitude.toString()}
                    email={this.state.email}
                    customerUid={this.state.customerUid}
                  />
                )}
              </div>
            </div>
          </div>
                </>
              );
            }
          })()} 
            

          <div style={{display: 'flex'}}>
            <div style = {{display: 'inline-block', width: '80%', height: '200px'}}>
              <input
                type='text'
                placeholder='Card Holder Name'
                className={styles.input}
                value={this.state.cardInfo.name}
                onChange={e => {
                  this.setState(prevState => ({
                    cardInfo: {
                      ...prevState.cardInfo,
                      name: e.target.value
                    }
                  }));
                }}
              />
              <input
                type='text'
                placeholder='Credit Card Number'
                className={styles.input}
                value={this.state.cardInfo.number}
                onChange={e => {
                  this.setState(prevState => ({
                    cardInfo: {
                      ...prevState.cardInfo,
                      number: e.target.value
                    }
                  }));
                }}
              />

            <div style = {{display: 'inline-flex', height: '100px', width: '125%'}}>
              <input
                type='text'
                placeholder='MM'
                className={styles.monthInput}
                value={this.state.cardInfo.month}
                onChange={e => {
                  this.setState(prevState => ({
                    cardInfo: {
                      ...prevState.cardInfo,
                      month: e.target.value
                    }
                  }));
                }}
              />

            <div className={styles.dateSlash}>/</div>
              <input
                type='text'
                placeholder='YEAR'
                className={styles.yearInput}
                value={this.state.cardInfo.year}
                onChange={e => {
                  this.setState(prevState => ({
                    cardInfo: {
                      ...prevState.cardInfo,
                      year: e.target.value
                    }
                  }));
                }}
              />
              <input
                type='text'
                placeholder='CVV'
                className={styles.cvvInput}
                value={this.state.cardInfo.cvv}
                onChange={e => {
                  this.setState(prevState => ({
                    cardInfo: {
                      ...prevState.cardInfo,
                      cvv: e.target.value
                    }
                  }));
                }}
              />
            <input
                type='text'
                placeholder='ZIPCODE'
                className={styles.zipInput}
                value={this.state.cardInfo.cardZip}
                onChange={e => {
                  this.setState(prevState => ({
                    cardInfo: {
                      ...prevState.cardInfo,
                      cardZip: e.target.value
                    }
                  }));
                }}
              />
            {/*<button
              className={styles.finishButton}
              onClick={() => {
                this.handleCheckout();
              }}
            >
              FINISH
            </button>*/}
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
  loginPassword: PropTypes.string.isRequired,
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
  loginPassword: state.login.password,
  userInfo: state.login.newUserInfo,
  password: state.subscribe.paymentPassword,
  address: state.subscribe.address,
  addressInfo: state.subscribe.addressInfo,
  creditCard: state.subscribe.creditCard,
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
  chooseMealsDelivery,
  choosePaymentOption,
  submitGuestSignUp
};

export default connect(
  mapStateToProps,
  functionList
)(withRouter(PaymentDetails));
