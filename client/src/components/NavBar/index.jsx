import React, {Fragment} from "react";
import Subscribe from "../NavBar/subscribe.png";
import Select from "../NavBar/select.png";
import Profile from "../NavBar/profile.png";
import More from "../NavBar/more.png";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {resetLogin, LoadUserInfo} from "../../reducers/actions/loginActions";
import {resetProfile} from "../../reducers/actions/profileActions";
import {resetSubscription} from "../../reducers/actions/subscriptionActions";
import store from "../../reducers/store";
import styles from "./navBar.module.css";
import Cookies from "js-cookie";
import User from "./User.svg";
class SideNavBar extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.navContainer}>
          <Link to='/choose-plan'>
            <div className={styles.navElt}>
              <img src={Subscribe} alt='Subscribe' />
            </div>
          </Link>
          <Link to='/profile'>
            <div className={styles.navElt}>
              <img src={Profile} alt='Profile' />
            </div>
          </Link>
          <Link to='/select-meal'>
            <div className={styles.navElt}>
              <img src={Select} alt='Select' />
            </div>
          </Link>
          <div className={styles.navElt}>
            <img src={More} alt='More' />
          </div>
        </div>
      </div>
    );
  }
}

class BottomNavBar extends React.Component {
  render() {
    return (
      <div className='navbar'>
        <div className='meal-footer'>
          <Link to='/choose-plan'>
            <div className='footer-icon-tray'>
              <img src={Subscribe} alt='Subscribe' className='footer-icons' />
              <p>Subscribe</p>
            </div>
          </Link>
          <Link to='/select-meal'>
            <div className='footer-icon-tray'>
              <img src={Select} alt='Select' className='footer-icons' />
              <p>Select</p>
            </div>
          </Link>
          <Link to='/profile'>
            <div className='footer-icon-tray'>
              <img src={Profile} alt='Profile' className='footer-icons' />
              <p>Profile</p>
            </div>
          </Link>
          <div className='footer-icon-tray'>
            <img src={More} alt='More' className='footer-icons' />
            <p>More</p>
          </div>
        </div>
      </div>
    );
  }
}

class NavBar extends React.Component {
  constructor(props) {
    super();
    this.state = {
      login: false,
      iconName: "",
      firstName: "",
      lastName: "",
      customerId: ""
    };
  }
  logOut = () => {
    this.props.resetProfile();
    this.props.resetSubscription();
    this.props.resetLogin(() => {
      // Reroute to log in page
      this.props.history.push("/");
    });
  };
  componentDidMount() {
    //check for logged in
    let currentState;
    const customer_uid = Cookies.get("customer_uid");
    if (customer_uid) {
      this.setState({login: true});
    }
    this.props.LoadUserInfo(customer_uid);
    store.subscribe(() => {
      let userInfo = store.getState().login.userInfo;
      if (userInfo && userInfo.customerId !== "") {
        let iconName = (
          userInfo.firstName.charAt(0) + userInfo.lastName.charAt(0)
        ).toUpperCase();
        this.setState(state => ({
          ...state,
          ...userInfo,
          iconName
        }));
      }
    });
  }
  render() {
    return (
      <div className={styles.navbar}>
        <div>
          <h4 style={{color: "orange", fontSize: "20px"}}>LOGO</h4>
        </div>
        <ul>
          <Link to='/'>HOME</Link>
          <Link to='/about'>ABOUT</Link>
          {this.state.login ? (
            <a href='/Profile' className={styles.profileIconWrapper}>
              <input
                className={styles.profileIcon}
                readOnly
                value={this.state.iconName}
              />
              <p>PROFILE</p>
            </a>
          ) : (
            <a href='/'>
              <img src={User} alt='User Logo' />
              SIGN IN
            </a>
          )}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({});
const WebNavBar = connect(mapStateToProps, {
  resetLogin,
  resetProfile,
  resetSubscription,
  LoadUserInfo
})(withRouter(NavBar));
export {WebNavBar, BottomNavBar, SideNavBar};
