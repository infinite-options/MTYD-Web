import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router";

import {
  resetProfile,
  fetchOrderHistory
} from "../../reducers/actions/profileActions";
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

import styles from "./profile.module.css";

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false
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
        mounted: true
      });
    } else {
      // Reroute to log in page
      this.props.history.push("/");
    }
  }

  render() {
    // Return nothing before login checked
    if (!this.state.mounted) {
      return null;
    }
    return (
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
              <FontAwesomeIcon icon={faSearch} className={"headerIcon"} />{" "}
            </div>
            <div
              className={styles.headerItem}
              onClick={() => {
                this.props.resetProfile();
                this.props.resetSubsription();
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
    );
  }
}

Profile.propTypes = {
  resetProfile: PropTypes.func.isRequired,
  fetchOrderHistory: PropTypes.func.isRequired,
  orderHistory: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  orderHistory: state.profile.orderHistory
});

const functionList = {
  resetLogin,
  resetProfile,
  resetSubscription,
  fetchOrderHistory
};

export default connect(mapStateToProps, functionList)(withRouter(Profile));
