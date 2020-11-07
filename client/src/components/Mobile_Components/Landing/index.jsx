import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  bypassLogin,
  changeEmail,
  changePassword,
  loginAttempt,
  socialLoginAttempt,
} from "../../../reducers/actions/loginActions";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import styles from "./landing.module.css";

class Landing extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
    };
  }

  successLogin = (hasPurchases) => {
    if(hasPurchases) {
      this.props.history.push("/select-meal")
    } else {
        this.props.history.push("/choose-plan");
    }
  };

 viewPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  } 

  socialSignUp = () => {
    this.props.history.push("social-sign-up");
  };

  componentDidMount() {
    let queryString = this.props.location.search;
    let urlParams = new URLSearchParams(queryString);
    // Clear Query parameters
    window.history.pushState({}, document.title, window.location.pathname);
    if (urlParams.has("email") && urlParams.has("hashed")) {
      // Automatic log in
      this.props.bypassLogin(
        urlParams.get("email"),
        urlParams.get("hashed"),
        this.successLogin
      );
    } else {
      this.setState({
        mounted: true,
      });
      window.AppleID.auth.init({
        clientId : process.env.REACT_APP_APPLE_CLIENT_ID,
        scope : 'email',
        redirectURI : process.env.REACT_APP_APPLE_REDIRECT_URI
      });
    }
  }

  responseGoogle = (response) => {
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

  responseFacebook = (response) => {
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

  render() {
    if (!this.state.mounted) {
      return null;
    }
    return (
      <div className={styles.root}>
        <div style={{  backgroundColor: "#00000074"}}>
        <div className={styles.mealHeader}>
          <p>NUTRITION MADE EASY</p>
          <p>LOCAL.ORGANIC.RESPONSIBLE</p>
        </div>
        <div style={{height:"700px"}}>
        <div className={styles.loginSectionContainer}>
          <div className={styles.loginSectionItem}>
            <input
              type='text'
              placeholder='USER NAME'
              className={styles.loginSectionInput}
              value={this.props.email}
              onChange={(e) => {
                this.props.changeEmail(e.target.value);
              }}
            />
          </div>
          <div className={styles.loginSectionItem}>
            <input
            style={{marginBottom:"0px"}}
              type='password'
              id="password"
              placeholder='PASSWORD'
              className={styles.loginSectionInput}
              value={this.props.password}
              onChange={(e) => {
                this.props.changePassword(e.target.value);
              }}
            />
          <i class="far fa-eye" id="togglePassword" onClick={this.viewPassword}></i>
          </div>
          <p style={{marginLeft:"9rem",fontSize:"1rem",color:"white", float:"right"}}>Forgot Password?</p>
        </div>
        <div className={styles.buttonContainer}>
          
            <button
              className={styles.button}
              onClick={() => {
                this.props.loginAttempt(
                  this.props.email,
                  this.props.password,
                  this.successLogin
                );
              }}
            >
              LOGIN
            </button>
            <Link to='sign-up'>
              <button className={styles.button}>SIGNUP</button>
            </Link>
        </div>
        <hr style={{marginTop:"2rem",color:"#E392409D", width:"300px"}}></hr>
        <p style={{color:"white", textAlign:"center", fontSize:"1rem", paddingTop:"1.2rem"}}>LOGIN OR SIGNUP WITH</p>
        <div style={{marginTop:"3.7rem", display:"flex", flexDirection:"row", alignContent:"center", textAlign:"center", justifyContent:"space-between", padding:"0rem 8.5rem"}}>
              
              <GoogleLogin
              
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            render={renderProps => (
              <button className={styles.googleBtn} onClick={renderProps.onClick} disabled={renderProps.disabled}></button>
            )}
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            isSignedIn={false}
            disabled= {false} 
            cookiePolicy={"single_host_origin"}
          />
          <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            autoLoad={false}
            fields={"name,email,picture"}
            callback={this.responseFacebook}
            cssClass={styles.fbLogin}
            
          />
          <button
            onClick={() => {
              window.AppleID.auth.signIn();
            }}
            className={styles.appleLogin}
          >
            <i className="fa fa-apple" style={{fontSize:"28px", color:"white"}}></i>
          </button>
              </div>
          
        </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  bypassLogin: PropTypes.func.isRequired,
  changeEmail: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  loginAttempt: PropTypes.func.isRequired,
  socialLoginAttempt: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  email: state.login.email,
  password: state.login.password,
});

const functionList = {
  bypassLogin,
  changeEmail,
  changePassword,
  loginAttempt,
  socialLoginAttempt,
};

export default connect(mapStateToProps, functionList)(withRouter(Landing));
