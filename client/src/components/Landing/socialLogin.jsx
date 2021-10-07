import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  socialLoginAttempt,
} from "../../reducers/actions/loginActions";
import { withRouter } from "react-router";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import styles from "./landing.module.css";
import socialG from "../../images/socialGoogle.png";
import socialF from "../../images/socialFb.png";
import socialA from "../../images/socialApple.png";
import axios from "axios";
import { API_URL } from "../../reducers/constants";

export var responseData = null;

class SocialLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verticalFormat: false,
      showLoginError: false,
      waitForLogin: false,
    };
  }

  successLogin = (page) => {
    this.props.history.push(`/${page}`);
  };

  socialSignUp = () => {
    this.props.history.push("social-sign-up");
  };

  componentDidMount() {
    if (this.props.verticalFormat) {
      this.setState({ verticalFormat: this.props.verticalFormat });
    }

    window.AppleID.auth.init({
      clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
      scope: "email",
      redirectURI: process.env.REACT_APP_APPLE_REDIRECT_URI,
      //redirectURI: ""
    });
  }

  responseGoogle = (response) => {
    console.log("===| GOOGLE LOGIN SUCCESS |===");
    console.log("google response: ", response);
    
    this.setState({
      waitForLogin: true
    }, () => {
      if (response.profileObj) {
        // Google Login successful, try to login to MTYD
        // console.log("Google login successful 2");
        let email = response.profileObj.email;
        let accessToken = response.accessToken;
        let refreshToken = response.googleId;

        // make sure profile is social media account before proceeding
        axios
          .get(API_URL + "Profile?customer_email=" + email)
          .then((res) => {
            console.log("(profile) res: ", res);

            if(
              res.data.code !== 404 && // if 404 profile not found, login (create new social account)
              res.data.result[0].user_social_media !== 'GOOGLE'
            ){
              console.log("(profile) invalid social media account!");
              this.setState({
                showLoginError: true,
                waitForLogin: false
              });
            } else {
              console.log("(profile) valid social media account, proceeding with login...");
              this.props.socialLoginAttempt(
                email,
                accessToken,
                refreshToken,
                "GOOGLE",
                this.successLogin,
                this.socialSignUp
              );
            }

          })
          .catch((err) => {
            console.log(err);
          });

      } else {
        // Google Login unsuccessful
        console.log("Google Login failed");
        this.setState({
          // showLoginError: ,
          waitForLogin: false
        });
      }
    });
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
    return !this.state.verticalFormat ? (
      <div
        style={{
          width: '100%',
          // height: '100%',
          height: 'calc(100% - 60px)',
          // backgroundColor: 'white',
          backgroundColor: 'rgb(255,255,255,0.5)',
          position: 'absolute',
          top: '60px',
          display: 'flex',
          justifyContent: 'center',
          // opacity: 0.5
          zIndex: '2001',
          // border: '1px dashed'
        }}
      >
        <div className='loginErrorModal'>
          <button 
            className="close" 
            onClick={() => {
              this.setState({showLoginError: false})
            }} 
            aria-label="Click here to close login error pop up" 
            title="Click here to close login error pop up"
          />
          <div className='loginErrorHeader'>
            Use Direct Login
          </div>
          <div className='loginErrorText'>
            We have found this account with an email and password.
          </div>
          <div className='socialBtnWrapper'>
            <button
              className='orangeBtn'
              onClick={() => {
                this.setState({showLoginError: false});
                // this.props.toggleLoginPopup(true);
              }}
              aria-label="Login using email and password"
              title="Login using email and password"
            >
              Log in with email
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div
        style={{
          // width: '100%',
          // // height: '100%',
          // height: 'calc(100% - 60px)',
          // // backgroundColor: 'white',
          backgroundColor: 'rgb(255,255,255,0.5)',
          // position: 'absolute',
          // top: '60px',
          // display: 'flex',
          // justifyContent: 'center',
          // // opacity: 0.5
          zIndex: '1000',
          // border: '1px dashed',
          position: 'fixed',
          top: '0',
          left: '0',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div 
          className='loginErrorModal'
          style={{marginTop: '0px'}}
        >
          <button 
            className="close" 
            onClick={() => {
              this.setState({showLoginError: false})
            }} 
            aria-label="Click here to close login error pop up" 
            title="Click here to close login error pop up"
          />
          <div className='loginErrorHeader'>
            Use Direct Login
          </div>
          <div className='loginErrorText'>
            We have found this account with an email and password.
          </div>
          <div className='socialBtnWrapper'>
            <button
              className='orangeBtn'
              onClick={() => {
                this.setState({showLoginError: false})
                this.props.toggleLoginPopup(true);
              }}
              aria-label="Login using email and password"
              title="Login using email and password"
            >
              Log in with email
            </button>
          </div>
        </div>
      </div>
    );
  };

  showLoading = () => {
    return (
      <div
        style={{
          // width: '100%',
          // // height: '100%',
          // height: 'calc(100% - 60px)',
          // // backgroundColor: 'white',
          backgroundColor: 'rgb(255,255,255,0.5)',
          // position: 'absolute',
          // top: '60px',
          // display: 'flex',
          // justifyContent: 'center',
          // // opacity: 0.5
          zIndex: '1000',
          // border: '1px dashed',
          position: 'fixed',
          top: '0',
          left: '0',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div 
          className='loginErrorModal'
          style={{marginTop: '0px', width: '300px'}}
        >
          {/* <button 
            className="close" 
            onClick={() => {
              this.setState({showLoginError: false})
            }} 
            aria-label="Click here to close login error pop up" 
            title="Click here to close login error pop up"
          /> */}
          <div className='loginErrorHeader'>
            Logging In
          </div>
          <div 
            className='loginErrorText'
            style={{marginBottom: '0px', paddingBottom: '60px'}}
          >
            Please Wait...
          </div>
          {/* <div className='socialBtnWrapper'>
            <button
              className='orangeBtn'
              onClick={() => {
                this.setState({showLoginError: false})
                this.props.toggleLoginPopup(true);
              }}
              aria-label="Login using email and password"
              title="Login using email and password"
            >
              Log in with email
            </button>
          </div> */}
        </div>
      </div>
    );
  };

  render() {
    let data = null;

    return !this.state.verticalFormat ? (
      <div
        // style={{
        //    border: '1px solid cyan'
        // }}
      >
        {this.state.waitForLogin ? (
          this.showLoading()
        ) : (
          null
        )}

        {console.log("before showError 1")}
        {this.state.showLoginError ? (
          this.showError("ERROR: Attempted to login with wrong social media account")
        ) : (
          null
        )}

        <div
          style={{
            width: "412px",
            height: "77px",
            marginBottom: "11px",
            marginLeft: "68px",
            backgroundImage: `url(${socialG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            render={(renderProps) => (
              <button
                className={styles.googleBtn}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                aria-label="Continue with google"
                title="Continue with google"
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
            width: "412px",
            height: "77px",
            marginLeft: "2px",
            marginBottom: "11px",
            marginLeft: "68px",
            backgroundImage: `url(${socialF})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          //tabIndex="0"
          //aria-label="Continue with Facebook"
          title="Continue in with Facebook"
        >
          <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            autoLoad={false}
            fields={"name,email,picture"}
            callback={this.responseFacebook}
            cssClass={styles.fbLogin}
            textButton=""
          />
        </div>
        <div
          style={{
            width: "412px",
            height: "77px",
            marginLeft: "68px",
            marginBottom: "11px",
            backgroundImage: `url(${socialA})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <button
            onClick={() => {
              console.log("pressed apple login button");
              const data = window.AppleID.auth.signIn();
              console.log(data);
            }}
            className={styles.appleLogin}
            //callback={this.responseApple}
            aria-label="Continue with your Apple ID"
            title="Continue with your Apple ID"
          ></button>
        </div>
      </div>
    ) : (
      <div className={styles.socialLogin}>
        {this.state.waitForLogin ? (
          this.showLoading()
        ) : (
          null
        )}

        {console.log("before showError 2")}
        {this.state.showLoginError ? (
          this.showError("ERROR: Attempted to login with wrong social media account")
        ) : (
          null
        )}
        <div>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            render={(renderProps) => (
              <button
                className={styles.googleBtnCircle}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                style={{
                  marginLeft: "15px",
                }}
                aria-label="Sign in with Google"
                title="Sign in with Google"
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
          tabIndex="-1"
          aria-label="Sign in with Facebook"
          title="Sign in with Facebook"
        >
          <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            autoLoad={false}
            fields={"name,email,picture"}
            callback={this.responseFacebook}
            cssClass={styles.fbLoginCircle}
            textButton=""
          />
        </div>

        <div>
          <button
            onClick={() => {
              try {
                console.log("pressed apple login button");
                const data = window.AppleID.auth.signIn();
                console.log(data);
              } catch (error) {
                console.log(data);
              }
            }}
            className={styles.appleLoginCircle}
            style={{
              marginLeft: "15px",
            }}
            aria-label="Sign in with Apple ID"
            title="Sign in with Apple ID"
          >
            <i
              className="fa fa-apple"
              style={{ fontSize: "35px", color: "black" }}
            ></i>
          </button>
        </div>
      </div>
    );
  }
}

SocialLogin.propTypes = {
  socialLoginAttempt: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({});

const functionList = {
  socialLoginAttempt
};

export default connect(mapStateToProps, functionList)(withRouter(SocialLogin));