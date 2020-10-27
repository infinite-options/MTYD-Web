import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
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
    submitPasswordSignUp,
  } from "../../../reducers/actions/loginActions";

import styles from './signupweb.module.css';
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";

class SignUpWeb extends React.Component {

    signUpSuccess = () => {
        this.props.history.push('/select-plan-web');
    }

    render() {
        return (
            <div className={styles.root}>
                <div className={styles.mealHeader}>
                {/* title stuff deleted here */}
                </div>
                <div style={{backgroundColor: "#00000074"}}>

               
                <div style={{border:"2px solid #FFA500",alignSelf:"center", margin:"0rem 2rem 2rem 2rem", paddingBottom:"15px", borderRadius:"15px", boxShadow:"1px 1px 1px 2px #d3d3d3 ",backgroundColor:"white", height:"70%"}}>
                <h6 className={styles.subHeading}> SIGN UP </h6>
                <div className={styles.inputContainer}>
                    <div className={styles.inputItem}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={"Email"}
                            value={this.props.email}
                            onChange={(e) => {
                                this.props.changeNewEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.inputItem}>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder={"Password"}
                            value={this.props.password}
                            onChange={(e) => {
                                this.props.changeNewPassword(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.inputItem}>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder={"Confirm password"}
                            value={this.props.passwordConfirm}
                            onChange={(e) => {
                                this.props.changeNewPasswordConfirm(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.inputItem}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={"First name"}
                            value={this.props.firstName}
                            onChange={(e) => {
                                this.props.changeNewFirstName(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.inputItem}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={"Last name"}
                            value={this.props.lastName}
                            onChange={(e) => {
                                this.props.changeNewLastName(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.inputItem}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={"Phone"}
                            value={this.props.phone}
                            onChange={(e) => {
                                this.props.changeNewPhone(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button
                        className={styles.button}
                        onClick={() => {
                            this.props.submitPasswordSignUp(
                                this.props.email, this.props.password, this.props.passwordConfirm,
                                this.props.firstName, this.props.lastName, this.props.phone,
                                this.props.street, this.props.unit, this.props.city, this.props.state,
                                this.props.zip,this.signUpSuccess
                            );
                        }}
                    >
                        SIGN UP
                    </button>
                </div>
                <p style={{color:"white", textAlign:"center", fontSize:"1rem", paddingTop:"1.2rem"}}>LOGIN OR SIGNUP WITH</p>
                <div style={{marginTop:"3.7rem", display:"flex", flexDirection:"row", alignContent:"center", textAlign:"center", justifyContent:"space-between", padding:"0rem 8.5rem"}}>
                    <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        render={renderProps => (
                        <button className={styles.googleBtn} onClick={renderProps.onClick} disabled={renderProps.disabled}></button>
                        )}
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        isSignedIn={false}
                        disabled= {false} 
                        cookiePolicy={"single_host_origin"}
                    />
                    <FacebookLogin
                        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                        autoLoad={false}
                        fields={"name,email,picture"}
                        callback={this.responseFacebook}
                        cssClass={styles.fbLogin}
                    />
                    <button
                        onClick={() => {
                        window.AppleID.auth.signIn();
                        }}
                        className={styles.appleLogin}
                    >
                        <i className="fa fa-apple" style={{fontSize:"28px", color:"white"}}></i>
                    </button>
                </div>
                {/*TODO: Figure out where the next two closing div tags point to */}
                </div>
                </div>
            </div>
        )
    }
}

SignUpWeb.propTypes = {
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
    zip: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
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
    zip: state.login.newUserInfo.address.zip,
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
    submitPasswordSignUp,
}

export default connect(mapStateToProps, functionList)(SignUpWeb);