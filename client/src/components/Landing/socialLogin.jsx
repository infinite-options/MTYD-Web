import React, { Component } from 'react';
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import {connect} from "react-redux";
import {
  // bypassLogin,
  // changeEmail,
  // changePassword,
  // loginAttempt,
  socialLoginAttempt
} from "../../reducers/actions/loginActions";
import {withRouter} from "react-router";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import styles from "./landing.module.css";
import socialG from "../../images/socialGoogle.png"
import socialF from "../../images/socialFb.png"
import socialA from "../../images/socialApple.png"


class SocialLogin extends Component {

  constructor(props){
    super(props);
    this.state = { 
      verticalFormat : false,
    }
  }

  successLogin = page => {
    this.props.history.push(`/${page}`);
  };

  socialSignUp = () => {
    this.props.history.push("social-sign-up");
  };

  componentDidMount() {
    if(this.props.verticalFormat){
      // console.log('here')
      this.setState({verticalFormat:this.props.verticalFormat})
    }

    window.AppleID.auth.init({
        clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
        scope: "email",
        redirectURI: process.env.REACT_APP_APPLE_REDIRECT_URI
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
      showError = err => {
        console.log("this is error in show err: ", err);
        return (
          <div
            style={{display: "flex", alignItem: "center", justifyContent: "center"}}
          >
            <p
              style={{
                color: "red",
                fontSize: "15px",
                fontWeight: "bold",
                padding: "10px 10px"
              }}
            >
              {err}
            </p>
          </div>
        );
      };

    render() { 
        return ( 

          !this.state.verticalFormat?
            <div>
              <div
                style={{
                  width:'412px',
                  height:'77px',
                  marginBottom:'11px',
                  marginLeft:'68px',
                  backgroundImage:`url(${socialG})`,
                  backgroundSize:'cover',
                  backgroundPosition:'center',
                }}
              >
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  render={renderProps => (
                    <button
                      className={styles.googleBtn}
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      aria-label="Continue with google"
                    ></button>
                  )}
                  onSuccess={this.responseGoogle}
                  onFailure={this.responseGoogle}
                  isSignedIn={false}
                  disabled={false}
                  cookiePolicy={"single_host_origin"}
                />
              </div>
              <div
              style={{
                width:'412px',
                height:'77px',
                marginLeft:'2px',
                marginBottom:'11px',
                marginLeft:'68px',
                backgroundImage:`url(${socialF})`,
                backgroundSize:'cover',
                backgroundPosition:'center',
              }}
              tabIndex="0"
              aria-label="Continue in with Facebook "
              >
                <FacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                  autoLoad={false}
                  fields={"name,email,picture"}
                  callback={this.responseFacebook}
                  cssClass={styles.fbLogin}
                  textButton=''
                  tabIndex="-1"
                  aria-hidden="true"
                />
              </div>
              <div
                style={{
                  width:'412px',
                  height:'77px',
                  marginLeft:'68px',
                  marginBottom:'11px',
                  backgroundImage:`url(${socialA})`,
                  backgroundSize:'cover',
                  backgroundPosition:'center',
                  
                }}
              >
                <button
                  onClick={() => {
                    window.AppleID.auth.signIn();
                  }}
                  className={styles.appleLogin}
                  aria-label="Continue with your Apple ID"     
                >
                </button>
              </div>
              </div>
              :
              <div className={styles.socialLogin}>
                <div>
                  <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    render={renderProps => (
                      <button
                        className={styles.googleBtnCircle}
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        style={{
                          marginLeft:'15px'
                        }}
                        aria-label="Sign in with Google"
                      ></button>
                    )}
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    isSignedIn={false}
                    disabled={false}
                    cookiePolicy={"single_host_origin"}
                  />
                </div>
                <div tabIndex="0" aria-label="Sign in with Facebook ">
                  <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                    autoLoad={false}
                    fields={"name,email,picture"}
                    callback={this.responseFacebook}
                    cssClass={styles.fbLoginCircle}
                    textButton=''
                  />
                </div>

                <div>
                  <button
                    onClick={() => {
                      window.AppleID.auth.signIn();
                    }}
                    className={styles.appleLoginCircle}
                    style={{
                      marginLeft:'15px'
                    }}
                    aria-label="Sign in with Apple ID"
                  >
                    <i
                      className='fa fa-apple'
                      style={{fontSize: "35px", color: "black"}}
                    ></i>
                  </button>
                </div>
              </div>









         );
    }
}

SocialLogin.propTypes = {
    // bypassLogin: PropTypes.func.isRequired,
    // changeEmail: PropTypes.func.isRequired,
    // changePassword: PropTypes.func.isRequired,
    // loginAttempt: PropTypes.func.isRequired,
    socialLoginAttempt: PropTypes.func.isRequired,
    // email: PropTypes.string.isRequired,
    // password: PropTypes.string.isRequired
  };
  
  // const mapStateToProps = state => ({
  //   email: state.login.email,
  //   password: state.login.password,
  //   error: state.login.error
  // });

  const mapStateToProps = state => ({});
  
  const functionList = {
    // bypassLogin,
    // changeEmail,
    // changePassword,
    // loginAttempt,
    socialLoginAttempt
  };
 
  export default connect(mapStateToProps, functionList)(withRouter(SocialLogin));