import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    resetProfile, fetchOrderHistory, fetchProfile, changeNewAddress, changeNewCity, changeNewEmail,
    changeNewFirstName, changeNewLastName, changeNewPhone, changeNewState, changeNewUnit, changeNewZip, submitnewProfile
} from '../../../reducers/actions/profileActions';
import { resetSubsription } from '../../../reducers/actions/subscriptionActions';
import { resetLogin } from '../../../reducers/actions/loginActions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBell, faPen, faShareAlt, faSearch, faSignOutAlt, faPlus } from '@fortawesome/free-solid-svg-icons'

import styles from './profile.module.css';
import Modal from './modal.js'

class Profile extends React.Component {

    constructor(){
        super();
        this.state = {
            mounted: false,
            modalIsOpen: false,
        }
    }
    
    showModal = () => {
        this.setState({modalIsOpen: true});
    };

    hideModal = () => {
        this.setState({modalIsOpen: false})
    }

    componentDidMount() {
        console.log(document.cookie)
        /*
        if (document.cookie.split(';').some((item) => item.trim().startsWith('customer_uid='))) {
            // Logged in
            let customer_uid = document.cookie.split('; ').find(row => row.startsWith('customer_uid')).split('=')[1];
            console.log(customer_uid)
            // console.log(customerFirstName)
            this.props.fetchOrderHistory(customer_uid);
            this.setState({
                mounted: true,
            })
        } else {
            // Reroute to log in page
            this.props.history.push('/')
        }*/
        // console.log(customerFirstName)
        this.props.fetchProfile();
        this.setState({
            mounted: true,
        })
    }

    render() {
        
        // Return nothing before login checked
        if(!this.state.mounted) {
            return (
                null
            )
        }
        return (
            <div className={styles.root}>
                <div className={styles.mealHeader}>
                    <div className={styles.headerItemContainer}>
                        <div className={styles.headerItem} > 
                            <FontAwesomeIcon icon={faBars} className={"headerIcon"}/>
                        </div>
                        {/*<div className={styles.headerItem}> <FontAwesomeIcon icon={faBell} className={"headerIcon"}/> </div>
                        <div className={styles.headerItem}> <FontAwesomeIcon icon={faShareAlt} className={"headerIcon"}/> </div>
        <div className={styles.headerItem}> <FontAwesomeIcon icon={faSearch} className={"headerIcon"}/> </div>
                        <div
                            className={styles.headerItem}
                            onClick={() => {
                                this.props.resetProfile();
                                this.props.resetSubsription();
                                this.props.resetLogin(() => {
                                    // Reroute to log in page
                                    this.props.history.push('/')
                                });
                            }}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className={"headerIcon"}/>
                        </div>
                        */}
                        <div className='title'>
                            <h4 className={styles.profileTitle}>USER PROFILE</h4>
                        </div>
                    </div>
                </div>
                <div className={styles.headingContainer}>
                    <div className={styles.headingItem}>
                        <h6 className={styles.subHeading}> CHOOSE PAYMENT METHOD </h6>
                    </div>
                </div>
                <div className={styles.cardContainer}>
                    <div className={styles.cardItem}>
                        <FontAwesomeIcon icon={faPlus} className={styles.addPayment}/>
                    </div>
                    <div className={styles.cardItem}>
                        <FontAwesomeIcon icon={faPlus} className={styles.addPayment}/>
                    </div>
                    <div className={styles.cardItem}>
                        <FontAwesomeIcon icon={faPlus} className={styles.addPayment}/>
                    </div>
                    <div className={styles.cardItem}>
                        <FontAwesomeIcon icon={faPlus} className={styles.addPayment}/>
                    </div>
                </div>
                <div className={styles.headingContainer}>
                    <div className={styles.headingItem}>
                        <h6 className={styles.subHeading}> CHOOSE YOUR ADDRESS </h6>
                    </div>
                </div>
                <div className={styles.headingContainer}>
                    <div className={styles.headingItem}>
                        <h6 className={styles.subHeading}> FIRST NAME LAST NAME </h6>
                    </div>
                    <div className={styles.headingItem}>
                    <FontAwesomeIcon icon = {faPen}  onClick={this.showModal} className={styles.editIcon}/>
                        <Modal show={this.showModal}>
                            <div className={styles.inputContainer}>
                                <div className={styles.inputItem}>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder={"First name"}
                                            defaultValue={this.props.profileInfo.customer_first_name}
                                            onChange={(e) => {
                                                this.props.changeNewFirstName(e.target.value);
                                            }}
                                        />
                                </div>
                                <div className={styles.inputItem} >
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder={"Last name"}
                                        defaultvalue={this.props.profileInfo.customer_last_name}
                                        onChange={(e) => {
                                            this.props.changeNewLastName(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className={styles.inputItem}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder={"Email"}
                                        defaultvalue={this.props.profileInfo.customer_email}
                                        onChange={(e) => {
                                            this.props.changeNewEmail(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className={styles.inputItem}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder={"Phone"}
                                        defaultvalue={this.props.profileInfo.customer_phone_num}
                                        onChange={(e) => {
                                            this.props.changeNewPhone(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className={styles.inputItemAddress}>
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className={styles.input}
                                        defaultvalue={this.props.profileInfo.customer_address}
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
                                        defaultvalue={this.props.profileInfo.customer_unit}
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
                                        defaultvalue={this.props.profileInfo.customer_city}
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
                                        defaultvalue={this.props.profileInfo.customer_state}
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
                                        defaultvalue={this.props.profileInfo.customer_zip}
                                        onChange={(e) => {
                                            this.props.changeNewZip(e.target.value);
                                        }}
                                    />
                                </div>
                                
                                <button  onClick={() => {
                                    this.props.submitnewProfile(
                                        this.props.firstName, this.props.lastName, this.props.email, this.props.phone,
                                        this.props.street, this.props.unit, this.props.city, this.props.state,
                                        this.props.zip,
                                    );
                                 }}
                                className={styles.checkoutButton}>SAVE</button>
                            </div>
                        </Modal>
                    </div>
                </div>
                <div className={styles.billingAddress}>
                    <div>Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sedo</div>
                </div>
                <div className={styles.headingContainer}>
                    <div className={styles.headingItem}>
                        <h6 className={styles.subHeading}> {this.props.profileInfo.customer_first_name} {this.props.profileInfo.customer_last_name}</h6>
                    </div>
                    <div className={styles.headingItem}>
                        <FontAwesomeIcon icon={faPen} className={styles.editIcon}/>
                    </div>
                </div>
                <div className={styles.billingAddress}>
                    <div>{this.props.profileInfo.customer_email}</div>
                    <div>{this.props.profileInfo.customer_address}</div>
                    <div>Unit {this.props.profileInfo.customer_unit}, {this.props.profileInfo.customer_city}, {this.props.profileInfo.customer_state}</div>
                    <div>{this.props.profileInfo.customer_zip} Phone: {this.props.profileInfo.customer_phone_num}</div>
                </div>
                <div className={styles.headingContainer}>
                    <div className={styles.headingItem}>
                        <h6 className={styles.subHeading}> Add Another Address </h6>
                    </div>
                    <FontAwesomeIcon icon={faPlus} className={styles.addPayment}/>
                </div>
                <div className={styles.orderHistoryContainer}>
                    <div className={styles.orderHistoryItem}>
                        <div className={styles.subHeading}>ENTER PASSWORD TO CONFIRM*</div><br></br>
                    </div>
                </div>
                <div>
                    <input type="text" className={styles.passwordText} placeholder="ENTER PASSWORD"/> 
                </div> <br></br>
                <div>
                    <button className={styles.checkoutButton}>SAVE</button>
                </div>
            </div>
        )
    }
};

Profile.propTypes = {
    resetProfile: PropTypes.func.isRequired,
    fetchOrderHistory: PropTypes.func.isRequired,
    orderHistory: PropTypes.array.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    profileInfo: PropTypes.object.isRequired,
    changeNewEmail: PropTypes.func.isRequired,
    changeNewFirstName: PropTypes.func.isRequired,
    changeNewLastName: PropTypes.func.isRequired,
    changeNewPhone: PropTypes.func.isRequired,
    changeNewAddress: PropTypes.func.isRequired,
    changeNewUnit: PropTypes.func.isRequired,
    changeNewCity: PropTypes.func.isRequired,
    changeNewState: PropTypes.func.isRequired,
    changeNewZip: PropTypes.func.isRequired,
    submitnewProfile: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
    orderHistory: state.profile.orderHistory,
    profileInfo: state.profile.profileInfo, 
    email: state.profile.newProfileInfo.email,
    firstName: state.profile.newProfileInfo.firstName,
    lastName: state.profile.newProfileInfo.lastName,
    phone: state.profile.newProfileInfo.phone,
    street: state.profile.newProfileInfo.street,
    unit: state.profile.newProfileInfo.unit,
    city: state.profile.newProfileInfo.city,
    state: state.profile.newProfileInfo.state,
    zip: state.profile.newProfileInfo.zip,
})

const functionList = {
    resetLogin,
    resetProfile,
    resetSubsription,
    fetchOrderHistory,
    fetchProfile, 
    changeNewFirstName,
    changeNewLastName,
    changeNewEmail,
    changeNewPhone,
    changeNewAddress,
    changeNewUnit,
    changeNewCity,
    changeNewState,
    changeNewZip,
    submitnewProfile,
}

export default connect(mapStateToProps, functionList )(withRouter(Profile));