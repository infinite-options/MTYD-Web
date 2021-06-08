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
import whiteLogo from "../../images/White_logo_for_web.png";
import axios from 'axios';
import { API_URL } from '../../reducers/constants';
import PopLogin from "../PopLogin";
import NavMenu from "../NavBarHamburger";
import Popsignup from '../PopSignup';

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
      login_seen:false,
      signUpSeen:false,
      // width:window.innerWidth,
      // loginNameLogoutDisplay:'flex',
      windowHeight: undefined,
      windowWidth: undefined
    };
  }

  handleResize = () => this.setState({
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  });

  togglePopLogin = () => {

    console.log('inside toggle pop login')
    this.setState({
     login_seen: !this.state.login_seen,
    });

    if(!this.state.login_seen){
      this.setState({
        signUpSeen:false
      })
    }
   };

   togglePopSignup = () => {
    this.setState({
     signUpSeen: !this.state.signUpSeen
    });

    if(!this.state.signUpSeen){
      this.setState({
        login_seen:false
      })
    }
   };

  logOut = () => {
    this.props.resetProfile();
    this.props.resetSubscription();
    this.props.resetLogin(() => {
      // Reroute to log in page
      this.props.history.push("/");
      window.location.reload();
    });
  };

  goToLink = (link) => {
    this.props.history.push(link);
  }

  componentDidMount() {
    //check for logged in
    let currentState;
    const customer_uid = Cookies.get("customer_uid");
    // console.log("props: ", this.props.history.location.pathname);

    this.handleResize();
    window.addEventListener('resize', this.handleResize);

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
        // console.log("Profile role: " + this.state.profileRole);
        // console.log(response)
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });    
      
      // window.addEventListener('resize', this.updateDimensions);

      // if(window.innerWidth<=800){
      //   this.setState({
      //     loginNameLogoutDisplay:'none'
      //   })
      // }else{
      //   this.setState({
      //     loginNameLogoutDisplay:'flex'
      //   })
      // } 
  }

  // updateDimensions = () => {
  //   if(window.innerWidth<=800){
  //     this.setState({
  //       loginNameLogoutDisplay:'none'
  //     })
  //   }else{
  //     this.setState({
  //       loginNameLogoutDisplay:'flex'
  //     })
  //   } 
  // }


  render() {

    const nameLength = this.state.firstName.length*14+this.state.lastName.length*14+30;

    // const nameFormat = {
    //   width: nameLength,
    //   color:'white',
    //   display:this.state.loginNameLogoutDisplay
    // }

    return (
      <div className={styles.navbar}>

        {/* For debugging window size */}
        <span 
          style={{
            zIndex: '101',
            position: 'fixed',
            backgroundColor: 'white',
            border: 'solid',
            borderWidth: '1px',
            borderColor: 'red',
            width: '150px',
            top: '100px'
          }}
        >
          Height: {this.state.windowHeight}px
          <br />
          Width: {this.state.windowWidth}px
        </span>

        <NavMenu
          login = {this.state.login}
          LogoutFunction = {this.logOut}
          togglePopSignup = {this.togglePopSignup}
          togglePopLogin = {this.togglePopLogin}
        />

        {/* <a 
          href='/home' 
          style={{
            // margin:0,
            // position:"absolute",
            // width: "160px", 
            // height:"80px",
            // top:"5px",

            backgroundImage:`url(${whiteLogo})`,
            backgroundSize:'cover',
            // backgroundPosition:'center',
            // left:'48%',
            // border: 'solid'
          }}>
        </a> */}
        <div
          style={{
            border: 'inset',
            width: '30%',
            minWidth: '200px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <a 
            href='/home' 
            style={{
              // margin:0,
              // position:"absolute",
              // width: "160px", 
              // height:"80px",
              // top:"5px",
              // border: 'inset',
              backgroundImage:`url(${whiteLogo})`,
              backgroundSize:'cover',
              // backgroundPosition:'center',
              // left:'48%',
              width: '160px',
              height: '80px'
            }}>
          </a>
        </div>

        {this.state.login ? (
          <div
            style={{
              border: 'inset',
              display: 'inline-flex',
              height: '44px',
              width: '40%',
              minWidth: '200px',
              position: 'relative'
            }}
          >

            {/* <Link 
              to='/meal-plan' 
              className={styles.whiteBackBtn} 
              // style={{
              //   width: nameLength,
              //   color:'white',
              //   // display:this.state.loginNameLogoutDisplay
              // }}
            >
                {this.state.firstName} {this.state.lastName}
            </Link> */}
            <div
              // to='/meal-plan' 
              onClick={() => {this.goToLink('/meal-plan')}}
              className={styles.nameBtn} 
              // style={{
              //   width: nameLength,
              //   color:'white',
              //   // display:this.state.loginNameLogoutDisplay
              // }}
            >
                {this.state.firstName} {this.state.lastName}
            </div>

            <div className={styles.divider}/>

            {/* <a
              className={styles.whiteBackBtn}
              onClick={this.logOut}
              // style={{
              //   // display: this.state.loginNameLogoutDisplay, 
              //   alignItem: "center", 
              //   color:'white'
              // }}
            >
              {" "}
              LOGOUT&nbsp;
            </a> */}
            <div
              className={styles.logoutBtn}
              onClick={this.logOut}
              // style={{
              //   // display: this.state.loginNameLogoutDisplay, 
              //   alignItem: "center", 
              //   color:'white'
              // }}
            >
              {" "}
              LOGOUT&nbsp;
            </div>

          </div>
        ) : (
          <div
            style={{
              border: 'inset'
            }}
          >

            <div
              style={{
                height:'100%',
                // display: this.state.loginNameLogoutDisplay
              }}
            >
              <button 
                onClick={this.togglePopSignup}
                className={styles.signUpBtn}
              >
                Sign Up
              </button>
            </div>

            {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}

            <div
              style={{
                height:'100%',
                // display: this.state.loginNameLogoutDisplay
              }}
            >
              <button 
                onClick={this.togglePopLogin}
                className={styles.signInBtn}
              >
                Login
              </button>
            </div>

            {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}

          </div>
        )}

        {/* {this.state.login && this.state.profileRole === 'admin' ? (
          <>
            {(() => {
              if (this.state.profileRole === 'admin') {
                return (
                  <a href='/admin'
                    style ={{
                      color:'white',
                      position:"absolute",
                      left:'150px'
                    }}
                    className={styles.whiteBackBtn}
                    >
                    Admin
                  </a>
                );
              }
            })()}
          </>
        ) : null} */}
        {/* {this.state.login && this.state.profileRole === 'admin' ? (
          <a href='/admin'
            style ={{
              color:'white',
              position:"absolute",
              left:'150px'
            }}
            className={styles.whiteBackBtn}
          >
            Admin
          </a>
        ) : null} */}
        {/* {this.state.login ? (
          <a href='/admin'
            style ={{
              color:'white',
              position:"absolute",
              left:'150px'
            }}
            className={styles.whiteBackBtn}
          >
            Admin
          </a>
        ) : null} */}

        {/* <ul>
          {this.state.login ? (
            <>

              <Link 
                to='/meal-plan' 
                className={styles.whiteBackBtn} 
                style={{
                  width: nameLength,
                  color:'white',
                  // display:this.state.loginNameLogoutDisplay
                }}
              >
                  {this.state.firstName} {this.state.lastName}
              </Link>

              <div className={styles.divider}/>

              <a
                className={styles.whiteBackBtn}
                onClick={this.logOut}
                style={{
                  // display: this.state.loginNameLogoutDisplay, 
                  alignItem: "center", 
                  color:'white'
                }}
              >
                {" "}
                LOGOUT&nbsp;
              </a>
            </>
          ) : (
            <>
              <div
                style={{
                  height:'100%',
                  // display: this.state.loginNameLogoutDisplay
                }}
              >
                <button 
                  onClick={this.togglePopSignup}
                  className={styles.signUpBtn}
                >
                  Sign Up
                </button>
              </div>
              {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}

              <div
                style={{
                  height:'100%',
                  // display: this.state.loginNameLogoutDisplay
                }}
              >
                <button 
                  onClick={this.togglePopLogin}
                  className={styles.signInBtn}
                >
                  Login
                </button>
              </div>
              {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
            </>
          )}
        </ul> */}

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
