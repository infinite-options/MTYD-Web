import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {WebNavBar} from "../NavBar";
import {API_URL} from "../../reducers/constants";
import Menu from "../Menu";
import {
  resetProfile,
  fetchOrderHistory
} from "../../reducers/actions/profileActions";
import {
  changePassword,
} from "../../reducers/actions/loginActions";
import {resetSubscription} from "../../reducers/actions/subscriptionActions";
import {resetLogin} from "../../reducers/actions/loginActions";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faPen,
  faShareAlt,
  faSearch,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'
import styles from "./profile.module.css";

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
      customer_uid: '',
      oldPassword: '',
      newPassword: ''
    };
  }

  componentDidMount() {
    console.log(document.cookie);
    if (
      document.cookie
        .split(";")
        .some(item => item.trim().startsWith("customer_uid="))
    ) {
      // Logged in
      let customer_uid = document.cookie
        .split("; ")
        .find(row => row.startsWith("customer_uid"))
        .split("=")[1];
      console.log(customer_uid);
      // console.log(customerFirstName)
      this.props.fetchOrderHistory(customer_uid);
      this.setState({
        mounted: true,
        customer_uid: customer_uid
      });
    } else {
      // Reroute to log in page
      this.props.history.push("/");
    }
  }

  changePassword = (value, x) => {

    if(x === 1) {
      this.setState({
        oldPassword: value
      })
    }
    if(x ===2) {
      this.setState({
        newPassword: value
      })
    }

    console.log(this.state.oldPassword)
    console.log(this.state.newPassword)
  }

  updatePassword = () => {
    console.log(this.state.customer_uid)
    console.log(this.state.oldPassword)
    console.log(this.state.newPassword)

    axios.post(API_URL+'change_password', 
      {
      customer_uid: this.state.customer_uid,
      old_password: this.state.oldPassword,
      new_password: this.state.newPassword
      }  
    )
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })


    // {
    //   "customer_uid":"100-000001",
    //   "old_password":"old",
    //   "new_password":"new"
    // }
  }

  render() {
    // Return nothing before login checked
    if (!this.state.mounted) {
      return null;
    }
    return (
      <>
        <WebNavBar />
        <Menu show={false} />
        <div className={styles.root}>
          <div className={styles.mealHeader}>
            <div className={styles.headerItemContainer}>
              <div className={styles.headerItem}>
                {" "}
                <FontAwesomeIcon icon={faBars} className={"headerIcon"} />{" "}
              </div>
              <div className={styles.headerItem}>
                {" "}
                <FontAwesomeIcon icon={faBell} className={"headerIcon"} />{" "}
              </div>
              <div className={styles.headerItem}>
                {" "}
                <FontAwesomeIcon
                  icon={faShareAlt}
                  className={"headerIcon"}
                />{" "}
              </div>
              <div className={styles.headerItem}>
                {" "}
                <FontAwesomeIcon
                  icon={faSearch}
                  className={"headerIcon"}
                />{" "}
              </div>
              <div
                className={styles.headerItem}
                onClick={() => {
                  this.props.resetProfile();
                  this.props.resetSubscription();
                  this.props.resetLogin(() => {
                    // Reroute to log in page
                    this.props.history.push("/");
                  });
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className={"headerIcon"} />
              </div>
            </div>
            <div className='title'>
              <h4 className='mainTitle'>NUTRITION MADE EASY</h4>
              <h6 className='subTitle'>LOCAL. ORGANIC. RESPONSIBLE.</h6>
            </div>
          </div>
          <div className={styles.headingContainer}>
            <div className={styles.headingItem}>
              <h6 className={styles.subHeading}> Personal Details </h6>
            </div>
            <div className={styles.headingItem}>
              <FontAwesomeIcon icon={faPen} className={styles.editIcon} />
            </div>
          </div>
          <div className={styles.personalDetails}>
            <div> First Last </div>
            <div> Email </div>
          </div>
          <div className={styles.headingContainer}>
            <div className={styles.headingItem}>
              <h6 className={styles.subHeading}> Payment Cards </h6>
            </div>
            <div className={styles.headingItem}>
              <FontAwesomeIcon icon={faPen} className={styles.editIcon} />
            </div>
          </div>
          <div className={styles.cardContainer}>
            <div className={styles.cardItem}></div>
            <div className={styles.cardItem}></div>
            <div className={styles.cardItem}></div>
          </div>
          <div className={styles.headingContainer}>
            <div className={styles.headingItem}>
              <h6 className={styles.subHeading}> Billing Address </h6>
            </div>
            <div className={styles.headingItem}>
              <FontAwesomeIcon icon={faPen} className={styles.editIcon} />
            </div>
          </div>
          <div className={styles.billingAddress}>
            <div>Lorem Ipsum</div>
            <div>Lorem Ipsum</div>
            <div>Lorem Ipsum</div>
          </div>
          <div className={styles.headingContainer}>
            <div className={styles.headingItem}>
              <h6 className={styles.subHeading}> Order History </h6>
            </div>
          </div>
          <div className={styles.orderHistoryContainer}>
            <div className={styles.orderHistoryItem}>
              <div className={styles.orderHistoryItemContianer}>
                <div className={styles.orderHistorySubItem}>
                  {/* <img alt-="Menu Item"/> */}
                  <div> Image </div>
                </div>
                <div className={styles.orderHistorySubItem}>
                  <p> Title </p>
                </div>
                <div className={styles.orderHistorySubItem}>Quantity</div>
                <div className={styles.orderHistorySubItem}>Total</div>
              </div>
            </div>
          </div>
        </div>

        <input 
          type = 'password'
          placeholder = 'Old Password'
          value = {this.props.oldPassword}
          onChange={e => {
            this.changePassword(e.target.value, 1);
          }}
        />

        <input 
          type = 'password'
          placeholder = 'New Password'
          value = {this.props.newPassword}
          onChange={e => {
            this.changePassword(e.target.value, 2);
          }}
        />

        <button onClick = {this.updatePassword}> Submit </button>

      </>
    );
  }
}

Profile.propTypes = {
  resetProfile: PropTypes.func.isRequired,
  fetchOrderHistory: PropTypes.func.isRequired,
  orderHistory: PropTypes.array.isRequired,
  changePassword: PropTypes.func.isRequired,

};

const mapStateToProps = state => ({
  orderHistory: state.profile.orderHistory,
  oldPassword: state.login.oldPassword,
  newPassword: state.login.newPassword

});

const functionList = {
  resetLogin,
  resetProfile,
  resetSubscription,
  fetchOrderHistory,
  changePassword
};

export default connect(mapStateToProps, functionList)(withRouter(Profile));
