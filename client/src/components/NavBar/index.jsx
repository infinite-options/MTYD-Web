import React, {Fragment,useState, useEffect, useRef} from "react";
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
import Logo from "../../images/LOGO_White_BG_MealsForMe.png";
import axios from 'axios';
import { API_URL } from '../../reducers/constants';
import PopLogin from "../PopLogin";

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
      customerId: "",
      profileRole: "",
    };
  }

  logOut = () => {
    this.props.resetProfile();
    this.props.resetSubscription();
    this.props.resetLogin(() => {
      // Reroute to log in page
      this.props.history.push("/");
      window.location.reload();
    });
  };

  componentDidMount() {
    //check for logged in
    let currentState;
    const customer_uid = Cookies.get("customer_uid");
    console.log("props: ", this.props.history.location.pathname);
    if (customer_uid) {
      this.setState({login: true});
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
            iconName,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
          }));
        }
      });
    }
      
    // Get user role
    axios
      .get(`${API_URL}Profile/${customer_uid}`)
      .then((response) => {
        const role = response.data.result[0].role.toLowerCase();
        this.setState({profileRole: role});
        console.log("Profile role: " + this.state.profileRole);
        console.log(response)
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
      
  }
  render() {
    if(this.props.narrowView === false){
    return (
      <div className={styles.navbar}>
        <div>
          <img style={{width: "60%", height:"60%"}} src={Logo} alt="logo" />
        </div>
        <ul>
          {this.state.login ? (
            <>
          {(() => {
            if (this.state.profileRole === 'admin') {
              return (
                <div>
                  <Link to='/admin' className={styles.narrowBtn}>
                    ADMIN
                  </Link>
                </div>
              );
            }
          })()}
          <Link to='/home' className={styles.narrowBtn}>
            HOME
          </Link>
          <Link to='/about' className={styles.narrowBtn}>
            ABOUT
          </Link>
            <Link to='/meal-plan' className={styles.profileIconWrapper} 
                style = {{display: 'flex', border: '4px solid orange', borderRadius: '20px', height: '90%', margin: '5px 0px'}}>
                  <input
                    className={styles.profileIcon}
                    readOnly
                    value={this.state.iconName}
                    style = {{cursor: 'pointer'}}
                  />
                  <div style = {{marginLeft:'5px', width: '200px'}}>
                    <h6 style = {{margin: '0', fontSize: '20px', textAlign: 'center'}}>{this.state.firstName} {this.state.lastName}</h6>
                    <h6 style = {{margin: '0', fontSize: '15px', textAlign: 'center'}}>{this.state.email}</h6>
                  </div> 
                </Link>

                <a
                  className={styles.profileIconWrapper}
                  onClick={this.logOut}
                  style={{display: "flex", alignItem: "center"}}
                >
                  {"  "}
                  LOGOUT&nbsp;
                  <i className='fa fa-sign-out'> </i>
                </a>
            </>
          ) : (
            <>
              <Link to='/home' className={styles.signUpBtn}>
                Sign Up
              </Link>
              <Link to='/login' className={styles.signInBtn}>
                Sign In
              </Link>
            </>
          )}
        </ul>
      </div>
    );
    } else {
    return (
      <div className={styles.navbar}>
        <div>
          <img style={{width: "60%", height:"60%"}} src={Logo} alt="logo" />
        </div>
        <ul>
          {this.state.login ? (
            <>
          {(() => {
            if (this.state.profileRole === 'admin') {
              return (
                  <Link to='/admin' className={styles.whiteBackBtn}>
                    ADMIN
                  </Link>
              );
            }
          })()}

          <div class={styles.divider}/>

          <Link to='/home' className={styles.whiteBackBtn}>
            HOME
          </Link>

          <div class={styles.divider}/>

          <Link to='/meal-plan' className={styles.showNameBtn} >
              {this.state.firstName} {this.state.lastName}
          </Link>

          <div class={styles.divider}/>
            <a
              className={styles.signInBtn}
              onClick={this.logOut}
              style={{display: "flex", alignItem: "center"}}
            >
              {"  "}
              LOGOUT&nbsp;
            </a>
            </>
          ) : (
            <>
              {/* <Link to='/home' className={styles.signUpBtn}>
                Sign Up
              </Link>
              <Link to='/login' className={styles.signInBtn}>
                Sign In
              </Link> */}

              <button 
                onClick={this.props.poplogin}
                className={styles.signInBtn}
              >
                Plogin
              </button>

              <button 
                onClick={this.props.popSignup}
                className={styles.signUpBtn}
              >
                PSignUp
              </button>
            </>
          )}
        </ul>










      </div>
        );
    }
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
