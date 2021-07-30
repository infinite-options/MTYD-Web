import React from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import {
  bypassLogin,
  changeEmail,
  changePassword,
  loginAttempt,
  socialLoginAttempt,
  forgotPassword,
} from "../../reducers/actions/loginActions";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import styles from "./login.module.css";
import Alert from "../Alert";
import SocialLogin from "../Landing/socialLogin";
import { WebNavBar } from "../NavBar";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
      error: "",
      loginDisplay: "flex",
      forgotPasswordDisplay: "none",
    };
  }

  toggleDisplay = () => {
    if (this.state.loginDisplay === "flex") {
      this.setState({
        loginDisplay: "none",
        forgotPasswordDisplay: "flex",
      });
    } else {
      this.setState({
        loginDisplay: "flex",
        forgotPasswordDisplay: "none",
      });
    }
  };

  successLogin = (page) => {
    this.props.history.push(`/${page}`);
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
    if (this.props.location.state !== undefined) {
      // console.log('forgot Password')
      this.toggleDisplay();
    }

    // console.log(foo) // "bar"
    //check for logedIn
    const customerId = Cookies.get("customer_uid");
    if (customerId) {
      this.props.history.push("/select-meal");
    } else {
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
          clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
          scope: "email",
          redirectURI: process.env.REACT_APP_APPLE_REDIRECT_URI,
        });
      }
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
  showError = (err) => {
    console.log("this is error in show err: ", err);
    return (
      <div
        style={{
          display: "flex",
          alignItem: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            color: "red",
            fontSize: "15px",
            fontWeight: "bold",
            padding: "10px 10px",
          }}
        >
          {err}
        </p>
      </div>
    );
  };

  render() {
    if (!this.state.mounted) {
      return null;
    }
    return (
      <div className={styles.root}>
        <WebNavBar />
        {/* <div className={styles.mealHeader}>
          <p>NUTRITION MADE EASY</p>
          <p>LOCAL.ORGANIC.RESPONSIBLE</p>
        </div> */}
        <div className={styles.wrap_container}>
          <div
            className={styles.container + " row"}
            style={{ display: this.state.loginDisplay }}
          >
            <div
              className={"col-7 " + styles.userInfo}
              style={{ padding: "105px 7.5px" }}
            >
              <div>
                <div className={styles.loginSectionContainer}>
                  <h5
                    style={{
                      marginLeft: "90px",
                      fontSize: "30px",
                      color: "#FF9E19",
                      fontWeight: "bold",
                    }}
                  >
                    LOGIN
                  </h5>
                  <div className={styles.loginSectionItem}>
                    <input
                      type="text"
                      placeholder="USER NAME"
                      className={styles.loginSectionInput}
                      value={this.props.email}
                      onChange={(e) => {
                        this.props.changeEmail(e.target.value);
                      }}
                    />
                  </div>
                  <div className={styles.loginSectionItem}>
                    <span className={styles.loginSectionInput}>
                      <input
                        style={{ marginBottom: "0px" }}
                        type="password"
                        id="password"
                        placeholder="PASSWORD"
                        value={this.props.password}
                        onChange={(e) => {
                          this.props.changePassword(e.target.value);
                        }}
                      />

                      {/* <a >
                      <i
                        className='far fa-eye'
                        id='togglePassword'
                        onClick={this.viewPassword}
                      ></i>
                    </a> */}
                    </span>
                  </div>

                  <a
                    style={{ marginLeft: "90px", cursor: "pointer" }}
                    onClick={this.toggleDisplay}
                  >
                    <h6
                      style={{
                        fontSize: "1rem",
                        color: "black",
                        float: "right",
                      }}
                    >
                      {" "}
                      Forgot Password?
                    </h6>
                  </a>
                </div>
                <div className={styles.buttonContainer}>
                  <button
                    className={styles.button}
                    onClick={() => {
                      //console.log(this.successLogin)
                      let a = this.props.loginAttempt(
                        this.props.email,
                        this.props.password,
                        this.successLogin
                      );
                      console.log("test2");
                    }}
                  >
                    LOGIN
                  </button>
                  <Link style={{ textDecoration: "none" }} to="sign-up">
                    <button className={styles.button}>SIGNUP</button>
                  </Link>
                </div>
                <hr
                  style={{
                    marginTop: "2rem",
                    color: "#E392409D",
                    width: "300px",
                  }}
                ></hr>
                <p
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontSize: "1rem",
                    paddingTop: "1.2rem",
                  }}
                >
                  LOGIN OR SIGNUP WITH
                </p>
                <div
                  style={{
                    marginTop: "3.7rem",
                    display: "flex",
                    flexDirection: "row",
                    alignContent: "center",
                    textAlign: "center",
                    justifyContent: "space-between",
                    padding: "0rem 8.5rem",
                  }}
                >
                  <SocialLogin />
                </div>
                <Alert />
              </div>
            </div>
            <div className={"col-5 " + styles.explore}>
              <div className={"row " + styles.centerBtn}>
                <p>EXPLORE WITHOUT LOGIN</p>
                <Link style={{ textDecoration: "none" }} to="/select-meal">
                  <button style={{ color: "white" }}> START </button>
                </Link>
              </div>
            </div>
          </div>
          <div
            className={styles.container + " row"}
            style={{ zIndex: "1", display: this.state.forgotPasswordDisplay }}
          >
            <div
              className={"col-7 " + styles.userInfo}
              style={{ padding: "200px 7.5px" }}
            >
              <div>
                <div className={styles.loginSectionContainer}>
                  <h5
                    style={{
                      marginLeft: "90px",
                      fontSize: "30px",
                      color: "#FF9E19",
                      fontWeight: "bold",
                    }}
                  >
                    Forgot Password
                  </h5>
                  <div className={styles.loginSectionItem}>
                    <input
                      type="text"
                      placeholder="EMAIL"
                      className={styles.loginSectionInput}
                      value={this.props.email}
                      onChange={(e) => {
                        this.props.changeEmail(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div
                  className={styles.buttonContainer}
                  style={{ marginBottom: "100px" }}
                >
                  <button
                    className={styles.button}
                    onClick={this.toggleDisplay}
                  >
                    BACK
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => {
                      this.props.forgotPassword(this.props.email);
                    }}
                  >
                    SEND
                  </button>
                </div>
              </div>
              <Alert />
            </div>

            <div className={"col-5 " + styles.explore}>
              <div className={"row " + styles.centerBtn}>
                <p>EXPLORE WITHOUT LOGIN</p>
                <Link to="/select-meal">
                  <button> START </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  bypassLogin: PropTypes.func.isRequired,
  changeEmail: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  loginAttempt: PropTypes.func.isRequired,
  socialLoginAttempt: PropTypes.func.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  email: state.login.email,
  password: state.login.password,
  error: state.login.error,
});

const functionList = {
  bypassLogin,
  changeEmail,
  changePassword,
  loginAttempt,
  socialLoginAttempt,
  forgotPassword,
};

export default connect(mapStateToProps, functionList)(withRouter(Login));
