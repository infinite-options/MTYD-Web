import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import styles from "./popLogin.css"
import SocialLogin from "../Landing/socialLogin"
import {
  loginAttempt,
  changeEmail,
  changePassword,
  errMessage,
  getErrMessage,
  socialLoginAttempt
} from "../../reducers/actions/loginActions";

import { Route , withRouter} from 'react-router-dom';
import closeIcon from '../../images/closeIcon.png'
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";


import {connect} from "react-redux";
import { Grid, Paper, Button, Typography, Box } from '@material-ui/core';
import { text } from '@fortawesome/fontawesome-svg-core';

import socialG from "../../images/socialGoogle.png"
import socialF from "../../images/socialFb.png"
import socialA from "../../images/socialApple.png"


export class PopLogin extends Component {

  constructor(){
    super();
    // this.state = {
    //   showErrorModal: false,
    //   errorModal: null,
    //   errorMessage: '',
    //   errorLink: '',
    //   errorLinkText: '',
    //   errorHeader: ''
    // }
  }

  errVal=''
  attemptLogin=false
  attemptShow=true
  attemptReload=false
  showErrorModal = false
  errorModal = null
  errorMessage = ''
  errorLink = ''
  errorLinkText = ''
  errorHeader = ''
  loginClicked = false

  componentDidMount() {
    console.log("(popLogin 1) apple_redirect: ", process.env.REACT_APP_APPLE_REDIRECT_URI);
    window.AppleID.auth.init({
      clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
      scope: "email",
      redirectURI: process.env.REACT_APP_APPLE_REDIRECT_URI
      //redirectURI: ""
    });
  }

  errVal=''
  attemptLogin=false
  attemptShow=true
  attemptReload=false
  showErrorModal = false
  errorModal = null
  errorMessage = ''
  errorLink = ''
  errorLinkText = ''
  errorHeader = ''
  loginClicked = false

  componentDidMount() {
    console.log("(popLogin 2) apple_redirect: ", process.env.REACT_APP_APPLE_REDIRECT_URI);
    window.AppleID.auth.init({
      clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
      scope: "email",
      redirectURI: process.env.REACT_APP_APPLE_REDIRECT_URI
      //redirectURI: ""
    });
  }

  responseGoogle = response => {
    console.log(response);
    if (response.profileObj) {
      // Google Login successful, try to login to MTYD
      console.log("Google login successful");
      let email = response.profileObj.email;
      let accessToken = response.accessToken;
      let refreshToken = response.googleId;
      // console.log(email,accessToken,refreshToken)
      this.props.socialLoginAttempt(
        email,
        accessToken,
        refreshToken,
        "GOOGLE",
        this.successLogin,
        this.socialSignUp
      );
    } else {
      // Google Login unsuccessful
      console.log("Google Login failed");
    }
  };

  responseFacebook = response => {
    console.log(response);
    if (response.email) {
      console.log("Facebook Login successful");
      let email = response.email;
      let accessToken = response.accessToken;
      let refreshToken = response.id;
      this.props.socialLoginAttempt(
        email,
        accessToken,
        refreshToken,
        "FACEBOOK",
        this.successLogin,
        this.socialSignUp
      );
    } else {
      // Facebook Login unsuccessful
      console.log("Facebook Login failed");
    }
  };

  handleClick = () => {
    this.props.toggle(); // this.props.toggle is not a function
  };

  viewPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  successLogin = page => {
    //console.log(page)
    this.props.history.push(`/${page}`);
  }; 

  render() {
    //this.errVal=''
    this.attemptLogin=true
    this.getError()
    //this.attemptShow=true
    this.showError()
    this.attemptReload=false
    console.log(this.errorLink + ":)")
    //this.handleReload()
    return (
      <div          
        className="pop_content"
      >

          <button className="close" onClick={this.handleClick} aria-label="Click here to exit Login menu" title="Click here to exit Login menu"/>
          <p style={{
            textAlign:'center',
            height: '28px',
            letterSpacing: '0.38px',
            color: 'black',
            fontSize:'26px',
            opacity: 1,
            marginTop:'58px',
            marginBottom:'25px',
            fontWeight:'bold'
            }} 
          >
          Login
          </p>



          {/* <div
              style={{
                marginTop: "24",
                marginLeft:'68px',
                alignContent: "center",
                textAlign: "center",
                justifyContent: "space-between",
              }}
          > */}
            <SocialLogin />
          {/* </div> */}

          <div  
          style={{
            textAlign:'center',
            height: '28px',
            letterSpacing: '0.38px',
            color: 'black',
            fontSize:'26px',
            opacity: 1,
            marginTop:'28px',
            marginBottom:'25px',
            fontWeight:'bold'
          }}>
            OR
          </div>


          <input
            type='text'
            placeholder='USER NAME'
            className="loginSectionItem"
            onChange={e => {
              this.props.changeEmail(e.target.value);
              this.loginClicked = false;
              //console.log(e.target.value);
            }}
            aria-label="Enter your username"
            title="Enter your username"
          />
            

          <input
            className="loginSectionItem"
            style={{marginBottom: "0px"}}
            type='password'
            id='password'
            placeholder='PASSWORD'
            size="56"
            value={this.props.password}
            onChange={e => {
              this.props.changePassword(e.target.value);
              this.loginClicked = false;
            }}
            aria-label="Enter your password"
            title="Enter your password"
          />


          <p
          style={{
            textAlign: 'center',
            letterSpacing: '0.32px',
            color: '#FFFFFF',
            opacity: 1,
            fontSize:'13px',
            color:'black',
            paddingTop:0,
            marginTop:10,
            textDecoration:"underline"
          }}
          aria-label="Click here to reset your password"
          title="Click here to reset your password">
            Forgot password?
          </p>

          <button
            className='signInBtn'
            onClick={() => {
              this.attemptLogin = true
              this.getError()
              this.forceUpdate()
              //console.log("Login clicked, attemptLogin = " + this.attemptLogin)
              this.loginClicked = true
            }}
            aria-label="Click here to login"
            title="Click here to login"
          >

            <p
            style={{
              textAlign: 'center',
              letterSpacing: '0.32px',
              color: '#FFFFFF',
              opacity: 1,
            }}>
              Login
            </p>
          </button>
          {/*this.getError()*/}
          {this.showError()}
          

          {(() => {
            let defaultHeight = '350px'
            if (this.errorHeader != 'Hmm...') {
              let defaultHeight = '530px'
            }
            if (this.showErrorModal === true && this.loginClicked==true) {
              return (
                <div>
                  <div className = {this.errorModal} style = {{marginTop: '-541px'}}>
                    <div className  = {styles.errorModalContainer} style = {{
                      position: 'relative',
                      //justify-self: 'center',
                      justifySelf: 'center',
                      //align-self: 'center',
                      alignSelf: 'center',
                      display: 'block',
                      border:'solid',
                      borderColor: '#ff6505',
                      backgroundColor: 'white',
                      height: {defaultHeight},
                      width: '450px',
                      marginRight: 'auto',
                      //marginBottom: '0px',
                      marginLeft: 'auto',
                      zIndex: '2'
                    }}>

                      <div className={styles.errorContainer} style = {{
                        
                        display: 'block',
                        width: '370px',
                        /*margin: 80px auto 0px;*/
                        //margin: '0px auto' '0px',
                        marginTop: '0px',
                        marginRight: 'auto',
                        marginBottom: '0px',
                        marginLeft: 'auto',
                        textAlign: 'center'
                      }}>
                        <div className={styles.errorHeader} style = {{
                          fontSize: '40px',
                          fontWeight: 'bold',
                          paddingTop: '5px',
                          paddingLeft: '20px',
                          marginTop: '50px'
                        }}>
                          {this.errorHeader}
                        </div>

                        <div className={styles.errorText} style = {{
                          fontSize: '20px',
                          paddingTop: '20px'
                        }}>
                          {this.errorMessage}
                        </div>
                        <br />
                        {(() => {
                          console.log("sometext"+this.errorLink)
                          console.log("errorLink: " + this.errorLink)
                          if (this.errorLink === 'google') {
                            console.log("in google check")
                            return (
                              <GoogleLogin
                                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                render={renderProps => (
                                  <button
                                  className={styles.googleBtnCircle}
                                  onClick={renderProps.onClick}
                                  // onClick = {() => {
                                  //   renderProps.onClick;
                                  //   if(this.errorLink === 'google'){
                                  //     this.displayErrorModal();
                                  //     this.loginClicked = false
                                  //     this.showErrorModal=false
                                  //     this.forceUpdate()
                                  //   } else {
                                  //     this.props.history.push(this.errorLink);
                                  //   }
                                  // }}
                                  disabled={renderProps.disabled}
                                  style={{
                                    borderRadius: '10px',
                                    borderWidth: '0',
                                    minWidth: '100px',
                                    backgroundColor: '#ff6505',
                                    marginTop: '10px',
                                    marginBottom: '25px',
                                    width: '90%',
                                    height: '50px',
                                    backgroundImage:`url(${socialG})`,
                                    backgroundSize:'cover',
                                    backgroundPosition:'center',
                                  }}
                                  aria-label="Continue in with Google"
                                  title="Continue in with Google"
                                  ></button>
                                  )}
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                isSignedIn={false}
                                disabled={false}
                                cookiePolicy={"single_host_origin"}
                              />
                            )
                          }
                          if (this.errorLink === 'facebook') {
                            console.log("in fb check")
                            return (
                              <div
                                style={{
                                  borderRadius: '10px',
                                  borderWidth: '0',
                                  minWidth: '100px',
                                  backgroundColor: '#ff6505',
                                  marginTop: '10px',
                                  marginBottom: '25px',
                                  width: '90%',
                                  height: '50px',
                                  backgroundImage:`url(${socialF})`,
                                  backgroundSize:'cover',
                                  backgroundPosition:'center',
                                }}
                                title="Continue in with Facebook"
                              >
                              <FacebookLogin
                                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                                autoLoad={false}
                                fields={"name,email,picture"}
                                callback={this.responseFacebook}
                                cssClass={styles.fbLogin}
                                textButton=''
                              />
                              </div>
                            )
                          }
                          if (this.errorLink === 'apple') {
                            console.log("in apple check")
                            return (
                              <div
                            >
                              <button
                                onClick={() => {
                                  console.log("pressed apple login button")
                                  const data = window.AppleID.auth.signIn();
                                  console.log(data)
                                }}
                                style={{
                                  borderRadius: '10px',
                                  borderWidth: '0',
                                  minWidth: '100px',
                                  backgroundColor: '#ff6505',
                                  marginTop: '10px',
                                  marginBottom: '25px',
                                  width: '90%',
                                  height: '50px',
                                  backgroundImage:`url(${socialA})`,
                                  backgroundSize:'cover',
                                  backgroundPosition:'center',
                                }}
                                className={styles.appleLogin}
                                //callback={this.responseApple}
                                aria-label="Continue with your Apple ID"     
                                title="Continue with your Apple ID" 
                              >
                              </button>
                            </div>
                            )
                          } 
                          if (this.errorLink === '' || this.errorLink=== 'back') {
                            console.log("in else check")
                            return (
                              <button 
                              className={styles.chargeBtn}
                              onClick = {() => {
                                this.displayErrorModal();
                                this.loginClicked = false
                                this.showErrorModal=false
                                this.forceUpdate()
                              }}
                              style = {{
                                textAlign: 'center',
                                justifyContent: 'center',
                                padding: '5px',
                                /*color: black !important;*/
                                color: '#ffffff',
                                fontSize: '16px',
                                /*border: 1px solid rgb(187, 174, 174);*/
                                borderRadius: '10px',
                                borderWidth: '0',
                                minWidth: '100px',
                                backgroundColor: '#ff6505',
                                marginTop: '10px',
                                marginBottom: '25px',
                                width: '90%',
                                height: '50px'
                              }}
                            >
                              {this.errorLinkText}
                            </button>
                            )
                          }
                          if (this.errorLink=== 'sign-up') {
                            console.log("email-check")
                            return (
                              <div>
                                <button 
                                  className={styles.chargeBtn}
                                  onClick = {() => {
                                  this.displayErrorModal();
                                  this.loginClicked = false
                                  this.showErrorModal=false
                                  this.forceUpdate()
                                }}
                                style = {{
                                  textAlign: 'center',
                                  justifyContent: 'center',
                                  padding: '5px',
                                  /*color: black !important;*/
                                  color: '#ffffff',
                                  fontSize: '16px',
                                  /*border: 1px solid rgb(187, 174, 174);*/
                                  borderRadius: '10px',
                                  borderWidth: '0',
                                  minWidth: '100px',
                                  backgroundColor: '#ff6505',
                                  marginTop: '10px',
                                  marginBottom: '25px',
                                  width: '90%',
                                  height: '50px'
                                }}
                              >
                                Try again with different email
                              </button>
                                Don't have an account?
                              <button 
                              className={styles.chargeBtn}
                              onClick = {() => {
                                this.displayErrorModal();
                                this.loginClicked = false
                                this.showErrorModal=false
                                this.props.history.push("/sign-up")
                                //this.forceUpdate()
                              }}
                              style = {{
                                textAlign: 'center',
                                justifyContent: 'center',
                                padding: '5px',
                                /*color: black !important;*/
                                color: '#ffffff',
                                fontSize: '16px',
                                /*border: 1px solid rgb(187, 174, 174);*/
                                borderRadius: '10px',
                                borderWidth: '0',
                                minWidth: '100px',
                                backgroundColor: '#ff6505',
                                marginTop: '10px',
                                marginBottom: '25px',
                                width: '90%',
                                height: '50px'
                              }}
                            >
                              {this.errorLinkText}
                            </button>
                            
                            </div>
                            )
                          }
                        })()}
                      </div> 
                    </div>
                  </div>
                </div>
              );
            }
          })()}
          {this.handleReload()}
      </div>
    )
  }

  displayErrorModal = (header, message, linkText, link) => {
    if(this.showErrorModal === false) {
      
      this.errorModal= styles.errorModalPopUpShow
      this.showErrorModal= true
      this.errorMessage= message
      this.errorLinkText= linkText
      this.errorLink= link
      this.errorHeader= header
      
      console.log("\nerror pop up toggled to true");
    }else{
      
      this.errorModal= styles.errorModalPopUpHide
      this.showErrorModal= false
      this.errorMessage= message
      this.errorLinkText= linkText
      this.errorLink= link
      this.errorHeader= header
      
      console.log("\nerror pop up toggled to false");
    }
  }

  getError = () => {
    //console.log("attemptLogin = " + this.attemptLogin)
    if (this.attemptLogin==true){
      if (this.props.email!=''){ 
        this.props.loginAttempt( 
          this.props.email,
          this.props.password,
          this.successLogin
        );
      }
      this.attemptLogin=false
      this.attemptShow=true
      //this.errVal=getErrMessage()
      
      //console.log("error modal :" + this.errorMessage)
    }
    return null;
  }

  showError = () => {
    //console.log("attemptShow = " + this.attemptShow)
    let errorHead = ''
    let errorString = ''
    let errorButton = ''
    let errorLink = ''
    if (this.attemptShow==true){
      this.errVal=getErrMessage()
      if (this.errVal == "Social Signup exists. Use 'GOOGLE' ") {
        errorHead = 'Social sign up exists'
        errorString = "We have found this account with a different social login. Please click below to continue."
        errorButton = 'Google button placeholder'
        errorLink = 'google'
      }
      if (this.errVal == "Social Signup exists. Use 'FACEBOOK' ") {
        errorHead = 'Social sign up exists'
        errorString = "We have found this account with a different social login. Please click below to continue."
        errorButton = 'Facebook button placeholder'
        errorLink = 'facebook'
      }
      if (this.errVal == "Social Signup exists. Use 'APPLE' ") {
        errorHead = 'Social sign up exists'
        errorString = "We have found this account with a different social login. Please click below to continue."
        errorButton = 'Apple button placeholder'
        errorLink = 'apple'
      } 
      if (this.errVal == "" || this.errVal == "Wrong password") {
        errorHead = 'Hmm...'
        errorString = "Something doesn't match, please make sure you've entered your email address and password correctly."
        errorButton = 'Okay'
        errorLink = 'back'
      }
      if (this.errVal == "Email doesn't exists") {
        errorHead = 'Account Not Found'
        errorString = "Sorry, we don't recognize this email."
        errorButton = 'Sign up'
        errorLink = 'sign-up'
      }
      this.displayErrorModal(errorHead, errorString, errorButton, errorLink)
      //console.log("Set error text to: "+ this.errVal)
      this.attemptShow=false
      this.attemptReload=true
    }
    
    // if (this.errVal == '') {
    //   return null;
    // }
    // if (this.loginClicked == true){
    //   return <Typography style={{ color: 'red', textAlign:'center' }}>{this.errVal}</Typography>;
    // }

    return null
    // return {

    // }
  }

  handleReload = () => {
    //console.log("attemptReload = " + this.attemptReload)
    if (this.attemptReload == true){
      this.forceUpdate()
    }
    this.attemptReload=false
    return null;
  }
}

const mapStateToProps = state => ({
  email: state.login.email,
  password: state.login.password,
  error: state.login.error
});

const functionList = {
  loginAttempt,
  changeEmail,
  changePassword,
  loginAttempt,
  socialLoginAttempt
};

export default connect(mapStateToProps, functionList) (withRouter(PopLogin));