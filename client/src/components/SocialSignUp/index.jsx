import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    changeNewFirstName,
    changeNewLastName,
    changeNewPhone,
    changeNewAddress,
    changeNewUnit,
    changeNewCity,
    changeNewState,
    changeNewZip,
    submitPasswordSignUp,
  } from "../../reducers/actions/loginActions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faShareAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import styles from './socialSignup.module.css'

class SocialSignUp extends React.Component {
    render() {
        return (
            <div className={styles.root}>
                <div className={styles.mealHeader}>
                    <div className={styles.headerItem}> <FontAwesomeIcon icon={faBars} className={"headerIcon"}/> </div>
                    <div className={styles.headerItem}> <FontAwesomeIcon icon={faBell} className={"headerIcon"}/> </div>
                    <div className={styles.headerItem}> <FontAwesomeIcon icon={faShareAlt} className={"headerIcon"}/> </div>
                    <div className={styles.headerItem}> <FontAwesomeIcon icon={faSearch} className={"headerIcon"}/> </div>
                    <div className='title'>
                        <h4 className='mainTitle'>Sign Up</h4>
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
                            this.props.submitPasswordSignUp(
                                this.props.email, this.props.password, this.props.passwordConfirm,
                                this.props.firstName, this.props.lastName, this.props.phone,
                                this.props.street, this.props.unit, this.props.city, this.props.state,
                                this.props.zip
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

export default connect(mapStateToProps, functionList)(SocialSignUp);