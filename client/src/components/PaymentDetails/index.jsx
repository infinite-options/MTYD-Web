import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
  fetchProfileInformation,
  changeDeliveryDetails,
  changeContactDetails,
  changePaymentDetails,
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

import { loadStripe } from '@stripe/stripe-js';

import {withRouter} from "react-router";

import {WebNavBar} from "../NavBar";
import axios from 'axios';
import { API_URL } from '../../reducers/constants';

import styles from "./paymentDetails.module.css";
import PopLogin from '../PopLogin';
import Popsignup from '../PopSignup';

import StripeElement from './StripeElement';

import createGuestAccount from '../../utils/CreateGuestAccount';
import fetchAddressCoordinates from '../../utils/FetchAddressCoordinates';

const google = window.google;

const CLOSED = -1;
const DATA_ERROR = 0;
const CHECKOUT_ERROR = 1;
const AMBASSADOR_ERROR = 2;
const EMAIL_ERROR = 3;

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
      login_seen: false,
      signUpSeen: false, 
      errorType: CLOSED,
      errorMessage: "",
      paymentType: 'NULL',
      fetchingFees: true,
      recalculatingPrice: false,
      stripePromise: null,
      createGuestErrorCode: -1
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
    console.log("(mount) props: ", this.props);
    console.log("(mount) selectedPlan: ", this.props.selectedPlan);
    console.log("(mount) email: ", this.props.email);

    document.getElementById("locality").value = this.props.city;
    document.getElementById("state").value = this.props.state;
    document.getElementById("pac-input").value = this.props.street;
    document.getElementById("postcode").value = this.props.zip;

    console.log("calling fetchAddressCoordinates...");
    
    fetchAddressCoordinates( //(address, city, state, zip, _callback) {
      this.props.street,
      this.props.city,
      this.props.state,
      this.props.zip,
      (coords) => {
        console.log("(mount) Fetched coordinates: " + JSON.stringify(coords));

        this.setState({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        const temp_position = {lat:parseFloat(coords.latitude), lng:parseFloat(coords.longitude)}

        console.log(temp_position)

        map.setCenter(temp_position)

        if(coords.latitude !== ''){
          map.setZoom(17);
          new google.maps.Marker({
            position: temp_position,
            map,
          });
        }
      }
    );

    if(JSON.stringify(this.props.selectedPlan) === '{}'){
      this.displayError(DATA_ERROR, 'No plans selected. Please select a Meal Plan to proceed.');
    }

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



    const input = document.getElementById("pac-input");
    const options = {
      componentRestrictions: { country: "us" }
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.bindTo("bounds", map);
    const marker = new google.maps.Marker({
      map,
    });

    autocomplete.addListener("place_changed", () => {
      let address1 = '';
      let postcode = '';
      let city = '';
      let state = '';
      // let address1 = this.props.address.street;
      // let city = this.props.address.city;
      // let state = this.props.address.state;
      // let postcode = this.props.address.zip;

      let address1Field = document.querySelector("#pac-input");
      let postalField = document.querySelector("#postcode");

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
        street: address1,
        city: city,
        state: state,
        addressZip: postcode,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
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

      console.log("(mount) customer uid: " + customerUid);
      console.log("(mount) email: " + this.props.email);

      this.setState(prevState => ({
        mounted: true,
        customerUid: customerUid,
        // street: this.props.address.street,
        // city: this.props.address.city,
        // state: this.props.address.state,
        // addressZip: this.props.address.zip,
        unit: this.props.address.unit,
        instructions: this.props.instructions,
        firstName: this.props.addressInfo.firstName,
        lastName: this.props.addressInfo.lastName,
        email: this.props.email,
        phone: this.props.addressInfo.phoneNumber,
        // name: this.props.creditCard.name,
        // number: this.props.creditCard.number,
        // cvv: this.props.creditCard.cvv,
        // month: this.props.creditCard.month,
        year: this.props.creditCard.year,
        cardZip: this.props.creditCard.zip,
        recalculatingPrice: true,
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
      }), () => {
        this.setTotal();
      });

    } else {

      // Reroute to log in page
      console.log("Payment-details NOT LOGGED IN");

      this.setState(prevState => ({
        mounted: true,
        customerUid: "GUEST",
        recalculatingPrice: true,
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
      }), () => {
        this.setTotal();
      });

    }
      
    // this.setState({
    //   street: this.props.address.street,
    //   city: this.props.address.city,
    //   state: this.props.address.state,
    //   addressZip: this.props.address.zip,
    //   unit: this.props.address.unit,
    //   instructions: this.props.instructions,
    //   firstName: this.props.addressInfo.firstName,
    //   lastName: this.props.addressInfo.lastName,
    //   email: this.props.email,
    //   phone: this.props.addressInfo.phoneNumber,
    //   name: this.props.creditCard.name,
    //   number: this.props.creditCard.number,
    //   cvv: this.props.creditCard.cvv,
    //   month: this.props.creditCard.month,
    //   year: this.props.creditCard.year,
    //   cardZip: this.props.creditCard.zip
    // });
  }
    
  changeTip(newTip) {
    this.setState(prevState => ({
      recalculatingPrice: true,
      paymentSummary: {
        ...prevState.paymentSummary,
        tip: newTip
      }
    }), () => {
      this.setTotal();
      console.log("changeTip new paymentSummary: ", this.state.paymentSummary);
    });
    //this.setTotal();
    //console.log("changeTip new paymentSummary: ", this.state.paymentSummary);
  }
    
  saveDeliveryDetails() {
    console.log("Saving delivery details...");

    this.setState({
      fetchingFees: true
    });
      
    if(this.state.customerUid !== "GUEST"){
      let object = {
        //uid: this.state.customerUid,
        // first_name: this.props.addressInfo.firstName,
        // last_name: this.props.addressInfo.lastName,
        // phone: this.props.addressInfo.phoneNumber,
        // email: this.props.email,
        uid: this.state.customerUid,
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        phone: this.state.phone,
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
                recalculatingPrice: true,
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
              }), () => {
                this.setTotal();
                console.log("catOptions taxAmount: " + this.state.paymentSummary.taxAmount);
                console.log("catOptions new payment summary: ", this.state.paymentSummary);
              });
              //this.setTotal();
              //console.log("catOptions taxAmount: " + this.state.paymentSummary.taxAmount);
              //console.log("catOptions new payment summary: ", this.state.paymentSummary);
            } else {
              this.setState(prevState => ({
                recalculatingPrice: true,
                paymentSummary: {
                  ...prevState.paymentSummary,
                  taxRate: 0,
                  serviceFee: "0.00",
                  deliveryFee: "0.00",
                  taxAmount: "0.00"
                }
              }), () => {
                this.setTotal();
              });
              //this.setTotal();
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
    
  // saveContactDetails() {
  //   console.log("Saving contact details...");
      
  //   if(this.state.customerUid !== "GUEST"){
  //     // let object = {
  //     //   uid: this.state.customerUid,
  //     //   first_name: this.state.firstName,
  //     //   last_name: this.state.lastName,
  //     //   phone: this.state.phone,
  //     //   email: this.props.email,
  //     //   address: this.props.street,
  //     //   unit: this.props.address.unit,
  //     //   city: this.props.address.city,
  //     //   state: this.props.address.state,
  //     //   zip: this.props.address.zip,
  //     //   noti: "false"
  //     // };
  //     let object = {
  //       uid: this.state.customerUid,
  //       first_name: this.state.firstName,
  //       last_name: this.state.lastName,
  //       phone: this.state.phone,
  //       email: this.props.email,
  //       address: this..street,
  //       unit: this.pro.address.unit,
  //       city: this.props.address.city,
  //       state: this.props.address.state,
  //       zip: this.props.address.zip,
  //       noti: "false"
  //     };

  //     // let object = {
  //     //   uid: this.state.customerUid,
  //     //   first_name: this.props.addressInfo.firstName,
  //     //   last_name: this.props.addressInfo.lastName,
  //     //   phone: this.props.addressInfo.phoneNumber,
  //     //   email: this.props.email,
  //     //   address: this.state.street,
  //     //   unit: this.state.unit,
  //     //   city: this.state.city,
  //     //   state: this.state.state,
  //     //   zip: this.state.addressZip,
  //     //   noti: "false"
  //     // };
                  
  //     console.log("(saveContactDetails) updateProfile object: " + JSON.stringify(object));
      
  //     axios
  //       .post(API_URL + 'UpdateProfile', object)
  //       .then(res => {
  //         console.log(res);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         if (err.response) {
  //           console.log("error: " + JSON.stringify(err.response));
  //         }
  //       });
  //   }
      
  //   this.props.changeContactDetails({
  //     firstName: this.state.firstName,
  //     lastName: this.state.lastName,
  //     email: this.state.email,
  //     phone: this.state.phone
  //   });
  // }
    
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

          this.displayError(AMBASSADOR_ERROR, items);

        } else {
          
          console.log("Valid code");

          items = items.result[0];

          console.log("result: " + JSON.stringify(items));

          this.setState(prevState => ({
            recalculatingPrice: true,
            paymentSummary: {
              ...prevState.paymentSummary,
              ambassadorDiscount: (
                items.discount_amount +
                items.discount_shipping
              ).toFixed(2)
            }
          }), () => {
            this.setTotal();
          });

        }
      })
      .catch(err => {
        console.log("Ambassador code error: " + err);
      });
  }

  displayError = (type, message) => {

    if(type === CLOSED) {
      this.setState({
        errorModal: styles.errorModalPopUpHide,
        errorType: type,
        errorMessage: ''
      });
    } else {
      this.setState({
        errorModal: styles.errorModalPopUpShow,
        errorType: type,
        errorMessage: message
      });
    }

    console.log("\npop up error toggled to " + type + "\n\n");
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
    return total.toFixed(2);
  }

  setTotal() {

    let total = this.calculateTotal();
    let subtotal = this.calculateSubtotal();

    this.setState(prevState => ({
      recalculatingPrice: false,
      paymentSummary: {
        ...prevState.paymentSummary,
        total,
        subtotal
      }
    }), ()=>{
      console.log("setTotal new paymentSummary: ", this.state.paymentSummary);
    });

  }

  proceedToPayment() {
    this.saveDeliveryDetails();
    //this.saveContactDetails();

    if(this.state.customerUid === "GUEST"){
      console.log("Before createGuestAccount");
      createGuestAccount(
        {
          email: this.state.email,
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          phone_number: this.state.phone,
          address: this.state.street,
          unit: this.state.unit,
          city: this.state.city,
          state: this.state.state,
          zip_code: this.state.addressZip,
          latitude: this.state.latitude.toString(),
          longitude: this.state.longitude.toString(),
          referral_source: "WEB",
          role: "GUEST",
          social: "FALSE",
          social_id: "NULL",
          user_access_token: "FALSE",
          user_refresh_token: "FALSE",
          mobile_access_token: "FALSE",
          mobile_refresh_token: "FALSE"
        },
        (response) => {
          if (response.code >= 200 && response.code <= 299) {
            this.props.fetchProfileInformation(response.data.result.customer_uid);
            this.setState({
              customerUid: response.data.result.customer_uid,
              showPaymentInfo: true
            });
          } else if (response.code === 409) {
            this.displayError(EMAIL_ERROR, `
              Looks like the email address is already in use by another account. 
              Please login to continue with that user account.
            `);
          } else {
            this.displayError(EMAIL_ERROR, response.message);
          }
        }
      );

    } else {
      this.setState({
        showPaymentInfo: true
      });
    }

    if(this.state.instructions === 'M4METEST'){

      // Fetch public key
      console.log("(m4metest) fetching stripe key");

      axios.get("https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/stripe_key/M4METEST")
        .then(result=>{
          let stripePromise = loadStripe(result.data.publicKey);
          this.setState({
            stripePromise: stripePromise
          });
        })
        .catch(err => {
          console.log(err);
          if (err.response) {
            console.log("(m4metest) stripe_key error: " + JSON.stringify(err.response));
          }
        });

    } else {

      // Fetch public key live
      console.log("(live) fetching stripe key");
      
      axios.get("https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/stripe_key/LIVE")
        .then(result=>{
          let stripePromise = loadStripe(result.data.publicKey);
          this.setState({
            stripePromise: stripePromise
          });
        })
        .catch(err => {
          console.log(err);
          if (err.response) {
            console.log("(live) stripe_key error: " + JSON.stringify(err.response));
          }
        });

    }
  }

  // saveAndProceedButton(){
  //   this.saveDeliveryDetails();
  //   this.saveContactDetails();
  //   this.setState({
  //     showPaymentInfo: true
  //   });
  // }

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
          if (this.state.errorType === EMAIL_ERROR) {
            return (
              <>
                <div className = {this.state.errorModal}>
                  <div className  = {styles.errorModalContainer}>
                    <div
                      className={styles.errorCancelButton}
                      onClick = {() => {
                        this.displayError(CLOSED, '');
                      }} 
                    />

                    <div className={styles.errorContainer}>    

                      <h6 style = {{margin: '5px', fontWeight: 'bold', fontSize: '25px'}}>Hmm..</h6>

                      <div style = {{display: 'block', width: '300px', margin: '20px auto 0px'}}>
                        {this.state.errorMessage}
                      </div> 

                      <br />

                      <button 
                        className={styles.errorBtn}
                        onClick = {() => {
                          console.log("go back clicked...");
                          this.displayError(CLOSED, '');
                        }}
                      >
                        Go Back
                      </button>

                      <button 
                        className={styles.errorBtn}
                        onClick = {() => {
                          console.log("login clicked...");
                          this.displayError();
                          this.togglePopLogin(CLOSED, '');
                        }}
                      >
                        Login
                      </button>

                    </div>
                  </div>
                </div>

              </>
            );
          } else if (this.state.errorType === AMBASSADOR_ERROR) {
            return (
              <>
                <div className = {this.state.errorModal}>
                  <div className  = {styles.errorModalContainer}>

                    <div className={styles.errorContainer}>    

                      <h6 style = {{margin: '5px', fontWeight: 'bold', fontSize: '25px'}}>Hmm..</h6>

                      <div style = {{display: 'block', width: '300px', margin: '20px auto 0px'}}>
                        {this.state.errorMessage}
                      </div> 

                      <br />

                      <button 
                        className={styles.errorBtn}
                        onClick = {() => {
                          this.displayError(CLOSED, '');
                        }}
                      >
                        OK
                      </button>

                    </div>
                  </div>
                </div>

              </>
            );
          } else if (this.state.errorType === DATA_ERROR) {
            return (
              <>
                <div className = {this.state.errorModal}>
                  <div className  = {styles.errorModalContainer}>

                    <div className={styles.errorContainer}>    

                      <h6 style = {{margin: '5px', fontWeight: 'bold', fontSize: '25px'}}>Hmm..</h6>

                      <div style = {{display: 'block', width: '300px', margin: '20px auto 0px'}}>
                        {this.state.errorMessage}
                      </div> 

                      <br />

                      <button 
                        className={styles.errorBtn}
                        onClick = {() => {
                          this.props.history.goBack();
                        }}
                      >
                        Choose a Plan
                      </button>

                    </div>
                  </div>
                </div>

              </>
            );
          }
        })()} 

        <div style={{display: 'flex'}}>
          <div className={styles.sectionHeaderLeft}>
            Delivery Details
          </div>
          <div className={styles.sectionHeaderRight}>
            Payment Summary
          </div>
        </div>

        <div className={styles.containerSplit}>

          <div style = {{display: 'inline-block', marginLeft: '8%', width: '40%', marginRight: '4%'}}>
            <div style={{display: 'flex'}}>
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
                placeholder='Last Name'
                className={styles.inputContactRight}
                value={this.state.lastName}
                onChange={e => {
                  this.setState({
                    lastName: e.target.value
                  });
                }}
              />
            </div>

            {(() => {
              if (this.state.customerUid === "GUEST") {
                return (
                  <input
                    type='text'
                    placeholder='Email'
                    className={styles.input}
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
                    className={styles.input}
                    value={this.props.email}
                    onChange={e => {
                
                    }}
                  />
                );
              }
            })()} 

            <input
              type='text'
              placeholder='Phone Number'
              className={styles.input}
              value={this.state.phone}
              onChange={e => {
                this.setState({
                  phone: e.target.value
                });
              }}
            />

            {/* <input
              type='text'
              placeholder={this.props.address.street==''?"street":this.props.address.street}
              className={styles.input}
              id="pac-iput"
            />

            <div style={{display: 'flex'}}>
              <input
                type='text'
                placeholder={this.props.address.unit==''?'Unit':this.props.address.unit}
                className={styles.inputContactLeft}
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

                className={styles.inputContactRight}
              />
            </div>

            <div style={{display: 'flex'}}>
              <input
                type='text'
                placeholder={this.props.address.state==''?"State":this.props.address.state}
                
                className={styles.inputContactLeft}
                id="state" name="state"
              />
              <input
                type='text'
                placeholder={this.props.address.zip==''?"zip":this.props.address.zip}
                className={styles.inputContactRight}
                id="postcode" name="postcode"
              />
            </div> */}

            <input
              type='text'
              placeholder={"Address 1"}
              className={styles.input}
              id="pac-input" name="pac-input"
            />

              {/* <input
                type='text'
                placeholder={'Zip Code'}
                autocomplete="bs"
                className={styles.inputContactRight}
                id="postcode" name="postcode"
              /> */}

            <div style={{display: 'flex'}}>
              <input
                type='text'
                placeholder={'Unit'}
                className={styles.inputContactLeft}
                value={this.state.unit}
                onChange={e => {
                  this.setState({
                    unit: e.target.value
                  });
                }}
              />
              
              <input
                type='text'
                placeholder={'City'}
                id="locality" name="locality"
                className={styles.inputContactRight}
              />
            </div>

            <div style={{display: 'flex'}}>
              <input
                type='text'
                placeholder={'State'}
                className={styles.inputContactLeft}
                id="state" name="state"
              />
              <input
                type='text'
                placeholder={'Zip Code'}
                className={styles.inputContactRight}
                id="postcode" name="postcode"
              />
            </div> 

            <input
              type='text'
              placeholder='Delivery Instructions'
              className={styles.input}
              value={this.state.instructions}
              onChange={e => {
                this.setState({
                  instructions: e.target.value
                });
              }}
            />

            <div className = {styles.googleMap} id = "map"/>     

            <div style={{textAlign: 'center'}}>
              <button 
                className={styles.orangeBtn}
                onClick={()=>this.proceedToPayment()}
              >
                Save and Proceed
              </button>
            </div> 

          </div>

          <div style={{display: 'inline-block', width:'48%'}}>
            <div style={{width: '84%', marginLeft: '6%'}}>
              <div
                style={{
                  display: !this.state.showPaymentInfo?'block':'none',
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                {"Please fill out the Delivery Details,"}
                <br />
                {"Save and Proceed to view Payment Summary."}
              </div>


              <div
                style={{
                  visibility:this.state.showPaymentInfo?'visible':'hidden'
                }}
              > 
                <div 
                  style=
                  {{
                    display: 'flex',
                    borderBottom:'solid 2px black'
                  }}
                >
                  <div 
                    className={styles.summaryLeft}
                    style={{
                      fontWeight:'bold'
                    }}

                  >Plan:</div>
                  <div className={styles.summaryRight}>
                    {
                      this.props.selectedPlan.num_items
                    } Meals for {
                      this.props.selectedPlan.num_deliveries
                    } Deliveries</div>

                </div>
                <div 
                  style={{display: 'flex',borderBottom:'1px solid'}}>
                    <div className={styles.summaryLeft}>
                      Meal Subscription 
                      <br/>({
                        this.props.selectedPlan.num_items
                      } Meals for {
                        this.props.selectedPlan.num_deliveries
                      } Deliveries):
                    </div>

                    <div className={styles.summaryRight}>
                      ${this.state.paymentSummary.mealSubPrice}
                    </div>
                </div>

                <div 
                  style={{display: 'flex',borderBottom:'1px solid'}}>
                    <div className={styles.summaryLeft}>
                    Discount ({this.props.selectedPlan.delivery_discount}%):
                    </div>

                    <div className={styles.summaryRight}>
                      -${this.state.paymentSummary.discountAmount}
                    </div>
                </div>

                <div 
                  style={{display: 'flex',borderBottom:'1px solid'}}>
                    <div className={styles.summaryLeft}>
                      Total Delivery Fee For All {
                          this.props.selectedPlan.num_deliveries
                        } Deliveries:
                    </div>

                    <div className={styles.summaryRight}>
                      ${(this.state.paymentSummary.deliveryFee)}
                    </div>
                </div>

                <div 
                  style={{display: 'flex',borderBottom:'1px solid'}}>
                    <div className={styles.summaryLeft}>
                      Service Fee:
                    </div>

                    <div className={styles.summaryRight}>
                      ${(this.state.paymentSummary.serviceFee)}
                    </div>
                </div>

                <div 
                  style={{display: 'flex',borderBottom:'1px solid'}}>
                    <div className={styles.summaryLeft}>
                      Taxes:
                    </div>

                    <div className={styles.summaryRight}>
                      ${(this.state.paymentSummary.taxAmount)}
                    </div>
                </div>

                <div 
                  style={{display: 'flex'}}>
                    <div className={styles.summaryLeft}>
                      Chef and Driver Tip:
                    </div>

                    <div className={styles.summaryRight}>
                      ${(this.state.paymentSummary.tip)}
                    </div>
                </div>
                <div 
                  style={{display: 'flex'}}>
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
                            <button className={styles.tipButtonSelected2} onClick={() => this.changeTip("2.00")}>
                              $2
                            </button>
                          );
                        } else {
                          return (
                            <button className={styles.tipButton2} onClick={() => this.changeTip("2.00")}>
                              $2
                            </button>
                          );
                        }
                      })()} 
                      {(() => {
                        if (this.state.paymentSummary.tip === "3.00") {
                          return (
                            <button className={styles.tipButtonSelected2} onClick={() => this.changeTip("3.00")}>
                              $3
                            </button>
                          );
                        } else {
                          return (
                            <button className={styles.tipButton2} onClick={() => this.changeTip("3.00")}>
                              $3
                            </button>
                          );
                        }
                      })()} 
                      {(() => {
                        if (this.state.paymentSummary.tip === "5.00") {
                          return (
                            <button className={styles.tipButtonSelected2} onClick={() => this.changeTip("5.00")}>
                              $5
                            </button>
                          );
                        } else {
                          return (
                            <button className={styles.tipButton2} onClick={() => this.changeTip("5.00")}>
                              $5
                            </button>
                          );
                        }
                      })()}
                </div>

                <div style={{display: 'flex',borderBottom:'1px solid'}}>
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
                    Verify
                  </button>

                  <div className={styles.summaryAmb}>
                    -${this.state.paymentSummary.ambassadorDiscount}
                  </div>
                </div>

                <div style={{display: 'flex' ,marginBottom:'73px'}}>
                  <div className={styles.summaryLeft}>
                    Total:
                  </div>

                  <div className={styles.summaryRight}>
                    ${this.calculateTotal()}
                  </div>
                </div>
              </div>
            </div>
              
            {
              this.state.showPaymentInfo
                ? (<>
                    <div style={{width: '100%'}}>
                      <h6 className={styles.sectionHeaderRight2}>Complete Payment</h6>
                    </div>
                        
                    <div style={{width: '84%', textAlign: 'left'}}>
                      <div style={{display: 'flex'}}>
                          <div className = {styles.buttonContainer}>
                            <StripeElement
                              stripePromise={this.state.stripePromise}
                              customerPassword={this.state.customerPassword}
                              deliveryInstructions={this.state.instructions}
                              setPaymentType={this.setPaymentType}
                              paymentSummary={this.state.paymentSummary}
                              loggedInByPassword={loggedInByPassword}
                              latitude={this.state.latitude.toString()}
                              longitude={this.state.longitude.toString()}
                              email={this.state.email}
                              customerUid={this.state.customerUid}
                              phone={this.state.phone}
                            />
                          </div>
                      </div>
                    </div>
                  </>)
                : null
            }

          </div>
        </div>
      </div>
    );
    
  }
}

PaymentDetails.propTypes = {
  changeDeliveryDetails: PropTypes.func.isRequired,
  changeContactDetails: PropTypes.func.isRequired,
  changePaymentDetails: PropTypes.func.isRequired,
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
  password: state.subscribe.paymentPassword,
  address: state.subscribe.address,
  addressInfo: state.subscribe.addressInfo,
  creditCard: state.subscribe.creditCard,
});

const functionList = {
  fetchProfileInformation,
  changeDeliveryDetails,
  changeContactDetails,
  changePaymentDetails,
  changePaymentPassword,
  changeCardNumber,
  changeCardMonth,
  changeCardYear,
  changeCardZip,
  changeCardCvv,
  submitPayment,
  chooseMealsDelivery,
  choosePaymentOption
};

export default connect(
  mapStateToProps,
  functionList
)(withRouter(PaymentDetails));
