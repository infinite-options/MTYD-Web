import React from "react";
import {Link,withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
  changeNewEmail,
  changeNewPassword,
  changeNewPasswordConfirm,
  changeNewFirstName,
  changeNewLastName,
  changeNewPhone,
  changeNewAddress,
  changeNewUnit,
  changeNewCity,
  changeNewState,
  changeNewZip,
  submitPasswordSignUp
} from "../../reducers/actions/loginActions";
import {WebNavBar} from "../NavBar";
import styles from "./signup.module.css";
import SocialSignUp from "../Landing/socialLogin"
import {API_URL} from "../../reducers/constants";
import axios from 'axios'

class SignUp extends React.Component {
  signUpSuccess = () => {
    this.props.history.push("/login");
  };

  render() {
    return (
      <div className={styles.root}>
        <WebNavBar />
        {/* <div className={styles.mealHeader}>
          <p>NUTRITION MADE EASY</p>
          <p>LOCAL.ORGANIC.RESPONSIBLE</p>
        </div> */}
        <div className={styles.wrap_container}>
          <div className={styles.container + " row"}>
            <div className={"col-7 " + styles.userInfo}>
              <h6 className={styles.subHeading}> User Information </h6>
              <div className={styles.inputContainer}>
                <div className={styles.inputItem}>
                  <input
                    type='text'
                    //   className={styles.input}
                    placeholder='Email'
                    value={this.props.email}
                    onChange={e => {
                      this.props.changeNewEmail(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.inputItem}>
                  <input
                    type='password'
                    //   className={styles.input}
                    placeholder={"Password"}
                    value={this.props.password}
                    onChange={e => {
                      this.props.changeNewPassword(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.inputItem}>
                  <input
                    type='password'
                    //   className={styles.input}
                    placeholder={"Confirm password"}
                    value={this.props.passwordConfirm}
                    onChange={e => {
                      this.props.changeNewPasswordConfirm(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.inputItem}>
                  <input
                    type='text'
                    //   className={styles.input}
                    placeholder={"First name"}
                    value={this.props.firstName}
                    onChange={e => {
                      this.props.changeNewFirstName(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.inputItem}>
                  <input
                    type='text'
                    //   className={styles.input}
                    placeholder={"Last name"}
                    value={this.props.lastName}
                    onChange={e => {
                      this.props.changeNewLastName(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.inputItem}>
                  <input
                    type='text'
                    //   className={styles.input}
                    placeholder={"Phone"}
                    value={this.props.phone}
                    onChange={e => {
                      this.props.changeNewPhone(e.target.value);
                    }}
                  />
                </div>
              </div>
              <h6 className={styles.subHeading}> Address </h6>
              <div className={styles.inputContainer}>
                <div className={styles.inputItemAddress}>
                  <input
                    type='text'
                    placeholder='Address'
                    //   className={styles.input}
                    value={this.props.street}
                    onChange={e => {
                      this.props.changeNewAddress(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.inputItemAddress}>
                  <input
                    type='text'
                    placeholder='Unit'
                    //   className={styles.input}
                    value={this.props.unit}
                    onChange={e => {
                      this.props.changeNewUnit(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.inputItemAddress}>
                  <input
                    type='text'
                    placeholder='City'
                    //   className={styles.input}
                    value={this.props.city}
                    onChange={e => {
                      this.props.changeNewCity(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.inputItemAddress}>
                  <input
                    type='text'
                    placeholder='State'
                    //   className={styles.input}
                    value={this.props.state}
                    onChange={e => {
                      this.props.changeNewState(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.inputItemAddress}>
                  <input
                    type='text'
                    placeholder='Zip'
                    //   className={styles.input}
                    value={this.props.zip}
                    onChange={e => {
                      this.props.changeNewZip(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className={styles.buttonContainer}>
                <Link style = {{textDecoration: 'none'}} to = "/login">
                  <button className={styles.button + " mr-3"}>BACK</button>
                </Link>
                <button
                  className={styles.button + " ml-3"}
                  onClick={() => {
                    let nameCheck = false
                    let emailCheck = false
                    if(this.props.firstName == '' || this.props.lastName == ''){
                      alert('first name and last name is required')
                    } else {
                      nameCheck = true
                    }
                    if(this.props.email == ''){
                      alert('email is required')
                    } else {
                      emailCheck = true
                    }
                    if (nameCheck == true && emailCheck == true) {
                      this.props.submitPasswordSignUp(
                        this.props.email,
                        this.props.password,
                        this.props.passwordConfirm,
                        this.props.firstName,
                        this.props.lastName,
                        this.props.phone,
                        this.props.street,
                        this.props.unit,
                        this.props.city,
                        this.props.state,
                        this.props.zip,
                        this.signUpSuccess
                      );
                    }
                  }}
                >
                  SIGN UP
                </button>
                
              </div>
              <div>
                <hr
                  style={{marginTop: "2rem", color: "#E392409D", width: "300px"}}
                ></hr>
                <h6 className = {styles.subHeading} style = {{textAlign: 'center', margin: '20px 0px'}}>OR SIGN UP WITH</h6>
                <SocialSignUp />
              </div>
  
            </div>
            <div className={"col-5 " + styles.explore}>
              <div className={"row " + styles.centerBtn}>
                <p>EXPLORE WITHOUT LOGIN</p>
                <Link style = {{textDecoration: 'none'}} to = '/select-meal'>
                  <button style = {{color: 'white'}}> START >></button>
                </Link>
              </div>
            </div>
  
          </div>
        </div>
      </div>
    );
  }
}

SignUp.propTypes = {
  changeNewEmail: PropTypes.func.isRequired,
  changeNewPassword: PropTypes.func.isRequired,
  changeNewPasswordConfirm: PropTypes.func.isRequired,
  changeNewFirstName: PropTypes.func.isRequired,
  changeNewLastName: PropTypes.func.isRequired,
  changeNewPhone: PropTypes.func.isRequired,
  changeNewAddress: PropTypes.func.isRequired,
  changeNewUnit: PropTypes.func.isRequired,
  changeNewCity: PropTypes.func.isRequired,
  changeNewState: PropTypes.func.isRequired,
  changeNewZip: PropTypes.func.isRequired,
  submitPasswordSignUp: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  passwordConfirm: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  street: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  zip: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  email: state.login.newUserInfo.email,
  password: state.login.newUserInfo.password,
  passwordConfirm: state.login.newUserInfo.passwordConfirm,
  firstName: state.login.newUserInfo.firstName,
  lastName: state.login.newUserInfo.lastName,
  phone: state.login.newUserInfo.phone,
  street: state.login.newUserInfo.address.street,
  unit: state.login.newUserInfo.address.unit,
  city: state.login.newUserInfo.address.city,
  state: state.login.newUserInfo.address.state,
  zip: state.login.newUserInfo.address.zip
});

const functionList = {
  changeNewEmail,
  changeNewPassword,
  changeNewPasswordConfirm,
  changeNewFirstName,
  changeNewLastName,
  changeNewPhone,
  changeNewAddress,
  changeNewUnit,
  changeNewCity,
  changeNewState,
  changeNewZip,
  submitPasswordSignUp
};

export default connect(mapStateToProps, functionList)(withRouter(SignUp));
