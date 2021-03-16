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
      mounted: false
    };
  }

  componentDidMount() {
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
      <div className={styles.root}>
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
          </div>
            
          {/* <h6 className={styles.subHeading}> Address Details </h6> */}
          <div className={styles.inputContainer}>
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
          </div>
            
          <div className={styles.topHeading}>
            <h6 className={styles.subHeading}>PAYMENT SUMMARY</h6>
          </div>
            
          <div className={styles.summaryText}>
              Meal Subscription:
          </div>
          <div className={styles.summaryText}>
              Add-Ons:
          </div>
          <div className={styles.summaryText}>
              Total Delivery Fee For All 8 Deliveries:
          </div>
          <div className={styles.summaryText}>
              Service Fee:
          </div>
          <div className={styles.summaryText}>
              Taxes: 
          </div>
          <div className={styles.summaryText}>
              Chef and Driver Tip:
          </div>
            
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
            
          <div style={{marginTop: "2rem"}} className={styles.topHeading}>
            <h6 className={styles.subHeading}>PAYMENT OPTIONS</h6>
          </div>
            
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
            
          <div className={styles.inputContainer}>
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
          </div>
          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
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
              SAVE
            </button>
          </div>
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
