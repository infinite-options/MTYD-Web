import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    initAppleSignUp,
    changeNewFirstName,
    changeNewLastName,
    changeNewPhone,
    changeNewAddress,
    changeNewUnit,
    changeNewCity,
    changeNewState,
    changeNewZip,
    submitSocialSignUp,
  } from "../../../reducers/actions/loginActions";
  import { withRouter } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faShareAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import styles from './socialSignup.module.css'

class SocialSignUp extends React.Component {

    constructor() {
        super();
        this.state = {
            mounted: false,
        }
    }

    componentDidMount() {
        let queryString = this.props.location.search;
        let urlParams = new URLSearchParams(queryString);
        // Clear Query parameters
        window.history.pushState({}, document.title, window.location.pathname);
        // Set state for id
        if (urlParams.has("id")) {
            this.props.initAppleSignUp(urlParams.get("id"),() => {
                this.setState({
                    mounted: true,
                })
            })
        } else {
            this.setState({
                mounted: true,
            })
        }
    }

    signUpSuccess = () => {
        this.props.history.push("/choose-plan");
    };

    render() {
        if(!this.state.mounted) {
            return null;
        }
        if(this.props.email === '' || this.props.refreshToken === '') {
            this.props.history.push('sign-up');
        }
        return (
            <div className={styles.root}>
                <div className={styles.mealHeader}>
                    <div className={styles.headerItemContainer}>
                        <div className={styles.headerItem}> <FontAwesomeIcon icon={faBars} className={"headerIcon"}/> </div>
                        <div className={styles.headerItem}> <FontAwesomeIcon icon={faBell} className={"headerIcon"}/> </div>
                        <div className={styles.headerItem}> <FontAwesomeIcon icon={faShareAlt} className={"headerIcon"}/> </div>
                        <div className={styles.headerItem}> <FontAwesomeIcon icon={faSearch} className={"headerIcon"}/> </div>
                    </div>
                    <div className='title'>
                        <h4 className='mainTitle'>SOCIAL SIGN UP</h4>
                        <h6 className='subTitle'>LOCAL. ORGANIC. RESPONSIBLE.</h6>
                    </div>
                </div>
                <h6 className={styles.subHeading}> User Information </h6>
                <div className={styles.inputContainer}>
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
                <h6 className={styles.subHeading}> Address </h6>
                <div className={styles.inputContainer}>
                    <div className={styles.inputItemAddress}>
                        <input
                            type="text"
                            placeholder="Address"
                            className={styles.input}
                            value={this.props.street}
                            onChange={(e) => {
                                this.props.changeNewAddress(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.inputItemAddress}>
                        <input
                            type="text"
                            placeholder="Unit"
                            className={styles.input}
                            value={this.props.unit}
                            onChange={(e) => {
                                this.props.changeNewUnit(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.inputItemAddress}>
                        <input
                            type="text"
                            placeholder="City"
                            className={styles.input}
                            value={this.props.city}
                            onChange={(e) => {
                                this.props.changeNewCity(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.inputItemAddress}>
                        <input
                            type="text"
                            placeholder="State"
                            className={styles.input}
                            value={this.props.state}
                            onChange={(e) => {
                                this.props.changeNewState(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.inputItemAddress}>
                        <input
                            type="text"
                            placeholder="Zip"
                            className={styles.input}
                            value={this.props.zip}
                            onChange={(e) => {
                                this.props.changeNewZip(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button
                        className={styles.button}
                        onClick={() => {
                            this.props.submitSocialSignUp(
                                this.props.AppleSignUp, this.props.customerId,
                                this.props.email, this.props.platform, this.props.accessToken, this.props.refreshToken,
                                this.props.firstName, this.props.lastName, this.props.phone,
                                this.props.street, this.props.unit, this.props.city, this.props.state,
                                this.props.zip,this.signUpSuccess
                            );
                        }}
                    >
                        SIGN UP
                    </button>
                </div>
            </div>
        )
    }
}

SocialSignUp.propTypes = {
    changeNewFirstName: PropTypes.func.isRequired,
    changeNewLastName: PropTypes.func.isRequired,
    changeNewPhone: PropTypes.func.isRequired,
    changeNewAddress: PropTypes.func.isRequired,
    changeNewUnit: PropTypes.func.isRequired,
    changeNewCity: PropTypes.func.isRequired,
    changeNewState: PropTypes.func.isRequired,
    changeNewZip: PropTypes.func.isRequired,
    submitSocialSignUp: PropTypes.func.isRequired,
    AppleSignUp: PropTypes.bool.isRequired,
    customerId: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
    accessToken: PropTypes.string.isRequired,
    refreshToken: PropTypes.string.isRequired,
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
    AppleSignUp: state.login.newUserInfo.AppleSignUp,
    customerId: state.login.newUserInfo.customerId,
    email: state.login.newUserInfo.email,
    platform: state.login.newUserInfo.platform,
    accessToken: state.login.newUserInfo.accessToken,
    refreshToken: state.login.newUserInfo.refreshToken,
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
    initAppleSignUp,
    changeNewFirstName,
    changeNewLastName,
    changeNewPhone,
    changeNewAddress,
    changeNewUnit,
    changeNewCity,
    changeNewState,
    changeNewZip,
    submitSocialSignUp
}

export default connect(mapStateToProps, functionList)(withRouter(SocialSignUp));