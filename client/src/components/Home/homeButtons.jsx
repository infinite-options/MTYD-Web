/*Remove loginPopup and Signup popUp
  Become an ambassador for logged in user needs to be linked to the form.
*/
import { Component } from "react";
import styles from "./home.module.css";
import { Link } from "react-router-dom";
import facebookAndInstagramImg from "../../images/Group 68.svg";
import closeIconImg from "../../images/Icon ionic-ios-close-circle.png";
import LTBAA from "../../images/Group 450.png";
import SUTBAA from "../../images/Group 234 for Ambassador.png";
import Cookies from "js-cookie";
import { API_URL } from "../../reducers/constants";
import axios from "axios";
import PopLogin from "../PopLogin";
import Popsignup from "../PopSignup";
import loginButton from "../../images/Group 479.png";
import signupButton from "../../images/Group 480.png";
import continueExploring from "../../images/Group 575.png";
import heartImage from "../../images/Icon ionic-ios-heart.png";
import continueWithApple from "../../images/Group 539.png";
import continueWithFacebook from "../../images/Group 537.png";
import continueWithGoogle from "../../images/Group 538.png";
import BecomeAmbass from "../BecomeAmbass";

class HomeLink extends Component {
  render() {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          // marginBottom: "50px",
          fontWeight: "bold",
        }}
      >
        {/* <a
          href={this.props.link}
          style={{
            height: "68px",
            width: "432px",
            marginTop: "77.66px",
            marginLeft: "auto",
            marginRight: "auto",
            // backgroundImage: `url(${this.props.text})`,
          }}
          aria-label="Start saving now with Meals 4 Me"
          title="Start saving now with Meals 4 Me"
        >
          <img
            src={this.props.text}
            style={{ height: "auto", width: "auto" }}
          ></img>
        </a> */}
        <Link to={this.props.link} style={{ textDecoration: "none" }}>
          <button
            style={{
              color: "white",
              backgroundColor: "#F26522",
              border: "none",
              padding: "20px",
              borderRadius: "20px",
              width: "500px",
              fontSize: "25px",
            }}
          >
            {this.props.text}
          </button>
        </Link>
      </div>
    );
  }
}
class LoginModalLink extends Component {
  render() {
    return (
      <Link component={LoginModal}>
        <img
          className={styles.buttonsBelowTheLogo}
          src={this.props.text}
          style={this.props.style}
        />
      </Link>
    );
  }
}
class AddressLink extends Component {
  render() {
    return (
      <button onClick={this.props.popSignup} className={styles.orangeButton}>
        {this.props.text}
      </button>
    );
  }
}

class FootLink extends Component {
  state = {
    seen: false,
    windowHeight: undefined,
    windowWidth: undefined,
  };

  togglePop = () => {
    this.setState({
      seen: !this.state.seen,
    });
  };

  handleResize = () =>
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });

  componentDidMount() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }

  render() {
    if (this.state.windowWidth > 750) {
      return (
        <>
          <div className={styles.footerBackground}>
            {/* For debugging window size */}
            {/* <span 
                style={{
                  zIndex: '101',
                  // position: 'fixed',
                  backgroundColor: 'white',
                  border: 'solid',
                  borderWidth: '1px',
                  borderColor: 'red',
                  width: '150px',
                  // zIndex: '200'
                }}
              >
                Height: {this.state.windowHeight}px
                <br />
                Width: {this.state.windowWidth}px
              </span> */}

            <p className={styles.findUs}>
              Find us
              <img
                className={styles.footerLogo}
                src={facebookAndInstagramImg}
                alt="facebookAndInstagramImg"
              />
              <a
                href="https://www.facebook.com/Meals-For-Me-101737768566584"
                target="_blank"
                style={{
                  position: "absolute",
                  width: "50px",
                  height: "50px",
                  backgroundColor: "red",
                  bottom: "0px",
                  left: "200px",
                  opacity: "0",
                }}
                aria-label="Check us out on facebook"
                title="Check us out on facebook"
              />
              <a
                href="https://www.instagram.com/mealsfor.me/?hl=en"
                target="_blank"
                style={{
                  position: "absolute",
                  width: "50px",
                  height: "50px",
                  backgroundColor: "red",
                  bottom: "0px",
                  left: "260px",
                  opacity: "0",
                }}
                aria-label="Check us out on Instagram"
                title="Check us out on Instagram"
              />
            </p>
            {/* <div className = {styles.footerRight}> */}
            {/* <img 
                  onClick={() => this.togglePop()} 
                  style = {{
                    width: '320px', 
                    height:'67px'
                  }} 
                  src = {becomeAnAmbassadorImg} 
                  // style = {{marginTop: '25px'}} 
                  aria-label="click here to become an ambassador" 
                  title="click here to become an ambassador" tabIndex="0"
                />		 */}
            <div
              onClick={() => this.togglePop()}
              className={styles.becomeAmbassadorBtn}
              style={{
                width: "320px",
                height: "60px",
              }}
              // src = {becomeAnAmbassadorImg}
              // style = {{marginTop: '25px'}}
              aria-label="click here to become an ambassador"
              title="click here to become an ambassador"
              tabIndex="0"
            >
              Become an Ambassador
            </div>
            {/* </div> */}

            {this.state.seen ? (
              <div
                style={{
                  // border: 'dashed',
                  position: "fixed",
                  top: "0",
                  left: "0",
                  width: "100vw",
                  height: "100vh",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  backgroundColor: "rgb(255,255,255,0.5)",
                  zIndex: "50",
                  // display: 'flex',
                  // justifyContent: 'center'
                  // backgroundColor: 'white',
                  // opacity: '0.5'
                }}
              >
                <BecomeAmbass toggle={this.togglePop} />
              </div>
            ) : null}
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={styles.footerBackgroundNarrow}>
            {/* <p className = {styles.findUs}>Find us 		

              <img className = {styles.footerLogo} src = {facebookAndInstagramImg} alt="facebookAndInstagramImg" />
              <a href='https://www.facebook.com/Meals-For-Me-101737768566584' target="_blank"
              style={{
                position:'absolute',
                width:'50px',
                height:'50px',
                backgroundColor:'red',
                bottom:'0px',
                left:'200px',
                opacity:'0',
              }}
              aria-label="Check us out on facebook"
              title="Check us out on facebook"/>

              <a href='https://www.instagram.com/mealsfor.me/?hl=en' target="_blank"
              style={{
                position:'absolute',
                width:'50px',
                height:'50px',
                backgroundColor:'red',
                bottom:'0px',
                left:'260px',
                opacity:'0',
              }}
              aria-label="Check us out on Instagram"
              title="Check us out on Instagram"/>


              </p> */}

            <div className={styles.narrowWrapper}>
              {/* <p className = {styles.findUsNarrow}>
                  Find uss
                </p> */}
              <div
                // style={{
                //   border: 'solid',
                //   height: '100%'
                // }}
                className={styles.findUsNarrow}
              >
                Find us
                <img
                  className={styles.footerLogoNarrow}
                  src={facebookAndInstagramImg}
                  alt="facebookAndInstagramImg"
                />
              </div>

              {/* <img 
                  className = {styles.footerLogoNarrow} 
                  src = {facebookAndInstagramImg} 
                  alt = "facebookAndInstagramImg" 
                /> */}
              <a
                href="https://www.facebook.com/Meals-For-Me-101737768566584"
                target="_blank"
                style={{
                  // position:'absolute',
                  width: "47px",
                  height: "47px",
                  backgroundColor: "red",
                  // bottom:'0px',
                  // left:'200px',
                  opacity: "0",
                  border: "solid",
                  zIndex: "30",
                  borderRadius: "50%",
                }}
                aria-label="Check us out on facebook"
                title="Check us out on facebook"
              />

              <a
                href="https://www.instagram.com/mealsfor.me/?hl=en"
                target="_blank"
                style={{
                  // position:'absolute',
                  width: "47px",
                  height: "47px",
                  backgroundColor: "red",
                  // bottom:'0px',
                  // left:'260px',
                  opacity: "0",
                  border: "solid",
                  zIndex: "30",
                  marginLeft: "13px",
                  borderRadius: "20%",
                }}
                aria-label="Check us out on Instagram"
                title="Check us out on Instagram"
              />
            </div>

            <div className={styles.narrowWrapper2}>
              <div
                onClick={() => this.togglePop()}
                className={styles.becomeAmbassadorBtnNarrow}
                style={{
                  width: "320px",
                  height: "60px",
                  marginLeft: '20px',
                  marginRight: '20px'
                }}
                // src = {becomeAnAmbassadorImg}
                // style = {{marginTop: '25px'}}
                aria-label="click here to become an ambassador"
                title="click here to become an ambassador"
                tabIndex="0"
              >
                Become an Ambassador
              </div>
            </div>

            {this.state.seen ? (
              <div
                style={{
                  // border: 'dashed',
                  position: "fixed",
                  top: "0",
                  left: "0",
                  width: "100vw",
                  height: "100vh",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  backgroundColor: "rgb(255,255,255,0.5)",
                  zIndex: "50",
                  // display: 'flex',
                  // justifyContent: 'center'
                  // backgroundColor: 'white',
                  // opacity: '0.5'
                }}
              >
                <BecomeAmbass toggle={this.togglePop} />
              </div>
            ) : null}
          </div>
        </>
      );
    }
  }
}
class AmbassadorLink extends Component {
  constructor(props) {
    super();
    this.state = {
      user_id: "",
      user_address: "",
      login_seen: false,
      signUpSeen: false,
      wantToLogin: false,
      wantToSignUp: false,
      seenForAmb: false,
    };
  }
  handleClick = () => {
    this.props.toggle();
  };
  togglePopWTL = () => {
    this.setState({
      wantToLogin: !this.state.wantToLogin,
    });
  };
  togglePopWTS = () => {
    this.setState({
      wantToSignUp: !this.state.wantToSignUp,
    });
  };
  togglePopForAmb = () => {
    this.setState({
      seenForAmb: !this.state.seenForAmb,
    });
  };
  togglePopLogin = () => {
    this.setState({
      login_seen: !this.state.login_seen,
    });

    if (!this.state.login_seen) {
      this.setState({
        signUpSeen: false,
      });
    }
  };

  togglePopSignup = () => {
    this.setState({
      signUpSeen: !this.state.signUpSeen,
    });

    if (!this.state.signUpSeen) {
      this.setState({
        login_seen: false,
      });
    }
  };

  componentDidMount() {
    const customer_uid = Cookies.get("customer_uid");
    console.log(Cookies.get("customer_uid"));
    if (customer_uid) {
      this.setState({ user_id: customer_uid });
      axios
        .get(`${API_URL}Profile/${customer_uid}`)
        .then((response) => {
          const addr = response.data.result[0].customer_address.toLowerCase();
          this.setState({ user_address: addr });
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    } else {
      this.setState({ user_id: "not login" });
      this.setState({ user_address: "not login yet" });
      /*Use the following for setting the user */
      /* this.setState({user_id:'anup'});
	this.setState({user_address: '214 Main Ave, San Jose, CA 91101'});*/
    }
  }

  render() {
    return (
      <div>
        {this.state.login_seen ? (
          <PopLogin toggle={this.togglePopLogin} toggle_signup={this.togglePopSignup}/>
        ) : null}
        {this.state.signUpSeen ? (
          <Popsignup toggle={this.togglePopSignup} />
        ) : null}

        {(() => {
          if (this.state.user_id != "not login") {
            return (
              <div className={styles.modal}>
                <div className={styles.modal_content}>
                  <span className={styles.close} onClick={this.handleClick}>
                    <img src={closeIconImg} />
                  </span>
                  <p
                    style={{
                      font: "SF Pro",
                      fontWeight: "bold",
                      fontSize: "32px",
                      textAlign: "center",
                      color: "black",
                    }}
                  >
                    Love MealsFor.Me?
                  </p>
                  <p
                    style={{
                      font: "SF Pro",
                      fontSize: "18px",
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "black",
                    }}
                  >
                    {" "}
                    Become an Ambassador
                  </p>
                  <p
                    className={styles.ambassdorText}
                    style={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      width: "437px",
                      height: "117px",
                      font: "SF Pro",
                      fontSize: "22px",
                      fontWeight: "medium",
                      textAlign: "center",
                    }}
                  >
                    Your friend(s) saves{" "}
                    <span style={{ color: "#F26522" }}>20%</span> on their first
                    order and you save{" "}
                    <span style={{ color: "#F26522" }}>20%</span> on your next
                    renewal <br />+ <br />
                    Each time your friend renews, you get an additional{" "}
                    <span style={{ color: "#F26522" }}>5%</span> renewal bonus.
                    Sign up 20 friends and eat for free!
                  </p>
                  <br />
                  <br />
                  <br />
                  <br />
                  <p
                    style={{
                      display: "inline",
                      font: "SF Pro",
                      fontSize: "18px",
                      fontWeight: "medium",
                      textAlign: "center",
                      color: "#F26522",
                      witdth: "50%",
                    }}
                  >
                    Ambassador Name:
                  </p>
                  <p
                    style={{
                      display: "inline-block",
                      verticalAlign: "top",
                      font: "SF Pro",
                      fontSize: "18px",
                      fontWeight: "medium",
                      textAlign: "right",
                      color: "#F26522",
                      color: "black",
                      marginLeft: "350px",
                    }}
                  >
                    John Doe
                  </p>
                  <form>
                    <input
                      style={{
                        border: "2px solid #F26522",
                        borderRadius: "15px",
                        width: "100%",
                        padding: "5px",
                      }}
                      placeholder="johndoe@gmail.com"
                    />
                  </form>
                  <p
                    style={{
                      font: "SF Pro",
                      fontSize: "18px",
                      fontWeight: "medium",
                      textAlign: "center",
                      color: "#F26522",
                    }}
                  >
                    Your friends can use this email address as the Ambassador
                    code when they sign up
                  </p>
                </div>
              </div>
            );
          } else {
            return (
              <div className={styles.modal}>
                <div className={styles.modal_content}>
                  <span className={styles.close} onClick={this.handleClick}>
                    <img src={closeIconImg} />
                  </span>
                  <p
                    style={{
                      font: "SF Pro",
                      fontSize: "32px",
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "black",
                    }}
                  >
                    Love MealsFor.Me?
                  </p>
                  <p
                    style={{
                      font: "SF Pro",
                      fontSize: "18px",
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "black",
                    }}
                  >
                    {" "}
                    Become an Ambassador
                  </p>
                  <p
                    style={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      width: "437px",
                      height: "117px",
                      font: "SF Pro",
                      fontWeight: "medium",
                      fontSize: "22px",
                      textAlign: "center",
                    }}
                  >
                    Save money by helping others eat better. Become an
                    ambassador by sharing MealsFor.Me with your friends. The
                    more you share, the more you save.
                  </p>
                  <br />
                  <br />
                  <img
                    style={{
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                    src={LTBAA}
                    onClick={this.togglePopLogin}
                  />
                  {this.state.wantToLogin ? (
                    <LoginModal toggle={this.togglePopWTL} />
                  ) : null}
                  <p
                    style={{
                      font: "SF Pro",
                      fontWeight: "bold",
                      fontSize: "26px",
                      textAlign: "center",
                      paddingTop: "15px",
                    }}
                  >
                    OR
                  </p>
                  <img
                    style={{
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                    src={SUTBAA}
                    onClick={() => this.togglePopSignup()}
                  />
                  {this.state.wantToSignUp ? (
                    <SignUpModal toggle={this.togglePopWTS} />
                  ) : null}
                </div>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}
class SaveMeals extends Component {
  constructor(props) {
    super();
    this.state = {
      user_id: "",
      user_address: "",
      login_seen: false,
      signUpSeen: false,
      wantToLogin: false,
      wantToSignUp: false,
      seenForAM: false,
    };
  }
  handleClick = () => {
    this.props.toggle();
  };
  togglePopWTL = () => {
    this.setState({
      wantToLogin: !this.state.wantToLogin,
    });
  };
  togglePopWTS = () => {
    this.setState({
      wantToSignUp: !this.state.wantToSignUp,
    });
  };
  togglePopForAdd = () => {
    this.setState({
      seenForAM: !this.state.seenForAM,
    });
  };
  togglePopLogin = () => {
    this.setState({
      login_seen: !this.state.login_seen,
    });

    if (!this.state.login_seen) {
      this.setState({
        signUpSeen: false,
      });
    }
  };

  togglePopSignup = () => {
    this.setState({
      signUpSeen: !this.state.signUpSeen,
    });

    if (!this.state.signUpSeen) {
      this.setState({
        login_seen: false,
      });
    }
  };

  componentDidMount() {
    const customer_uid = Cookies.get("customer_uid");
    console.log(Cookies.get("customer_uid"));
    if (customer_uid) {
      this.setState({ user_id: customer_uid });
      axios
        .get(`${API_URL}Profile/${customer_uid}`)
        .then((response) => {
          const addr = response.data.result[0].customer_address.toLowerCase();
          this.setState({ user_address: addr });
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    } else {
      this.setState({ user_id: "not login" });
      this.setState({ user_address: "not login yet" });
      /*Use the following for setting the user */
      /*this.setState({user_id:'anup'});
	this.setState({user_address: '214 Main Ave, San Jose, CA 91101'});*/
    }
  }

  render() {
    return (
      <div>
        {this.state.login_seen ? (
          <PopLogin toggle={this.togglePopLogin} toggle_signup={this.togglePopSignup}/>
        ) : null}
        {this.state.signUpSeen ? (
          <Popsignup toggle={this.togglePopSignup} />
        ) : null}
        {(() => {
          if (this.state.user_id == "not login") {
            return (
              <div className={styles.modal}>
                <div className={styles.modal_content}>
                  <p
                    className={styles.ambassdorText}
                    style={{
                      font: "SF Pro",
                      fontSize: "24px",
                      fontWeight: "medium",
                      textAlign: "left",
                      color: "black",
                    }}
                  >
                    <span style={{ color: "#F26522" }}>Save</span> allows you to
                    select your meals up
                    <br /> to 3 weeks in advance.
                  </p>
                  <br />
                  <br />
                  <span onClick={this.handleClick}>
                    <img
                      style={{ marginLeft: "80px" }}
                      src={continueExploring}
                    />
                  </span>
                  <p
                    style={{
                      marginLeft: "50px",
                      font: "SF Pro",
                      fontWeight: "bold",
                      fontSize: "18px",
                      textAlign: "left",
                      paddingTop: "15px",
                      color: "black",
                    }}
                  >
                    Already a Customer?
                  </p>
                  <img
                    style={{
                      display: "block",
                      marginLeft: "80px",
                      marginTop: "-20px",
                      marginRight: "auto",
                    }}
                    src={loginButton}
                    onClick={() => this.togglePopLogin()}
                  />
                  {this.state.wantToLogin ? (
                    <LoginModal toggle={this.togglePopWTL} />
                  ) : null}
                  <p
                    style={{
                      marginLeft: "80px",
                      font: "SF Pro",
                      fontWeight: "bold",
                      fontSize: "18px",
                      textAlign: "left",
                      paddingTop: "15px",
                      color: "black",
                    }}
                  >
                    Ready to start eating better?
                  </p>
                  <img
                    style={{
                      display: "block",
                      marginLeft: "80px",
                      marginTop: "-15px",
                      marginRight: "auto",
                    }}
                    src={signupButton}
                    onClick={() => this.togglePopSignup()}
                  />
                  {this.state.wantToSignUp ? (
                    <SignUpModal toggle={this.togglePopWTS} />
                  ) : null}
                </div>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}
class SurpriseMeals extends Component {
  constructor(props) {
    super();
    this.state = {
      user_id: "",
      user_address: "",
      login_seen: false,
      signUpSeen: false,
      wantToLogin: false,
      wantToSignUp: false,
      seenForAM: false,
    };
  }
  handleClick = () => {
    this.props.toggle();
  };
  togglePopWTL = () => {
    this.setState({
      wantToLogin: !this.state.wantToLogin,
    });
  };
  togglePopWTS = () => {
    this.setState({
      wantToSignUp: !this.state.wantToSignUp,
    });
  };
  togglePopForAdd = () => {
    this.setState({
      seenForAM: !this.state.seenForAM,
    });
  };
  togglePopLogin = () => {
    this.setState({
      login_seen: !this.state.login_seen,
    });

    if (!this.state.login_seen) {
      this.setState({
        signUpSeen: false,
      });
    }
  };

  togglePopSignup = () => {
    this.setState({
      signUpSeen: !this.state.signUpSeen,
    });

    if (!this.state.signUpSeen) {
      this.setState({
        login_seen: false,
      });
    }
  };

  componentDidMount() {
    const customer_uid = Cookies.get("customer_uid");
    console.log(Cookies.get("customer_uid"));
    if (customer_uid) {
      this.setState({ user_id: customer_uid });
      axios
        .get(`${API_URL}Profile/${customer_uid}`)
        .then((response) => {
          const addr = response.data.result[0].customer_address.toLowerCase();
          this.setState({ user_address: addr });
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    } else {
      this.setState({ user_id: "not login" });
      this.setState({ user_address: "not login yet" });
      /*Use the following for setting the user */
      /*this.setState({user_id:'anup'});
	this.setState({user_address: '214 Main Ave, San Jose, CA 91101'});*/
    }
  }

  render() {
    return (
      <div>
        {this.state.login_seen ? (
          <PopLogin toggle={this.togglePopLogin} toggle_signup={this.togglePopSignup}/>
        ) : null}
        {this.state.signUpSeen ? (
          <Popsignup toggle={this.togglePopSignup} />
        ) : null}

        {(() => {
          if (this.state.user_id == "not login") {
            return (
              <div className={styles.modal}>
                <div className={styles.modal_content}>
                  <p
                    className={styles.ambassdorText}
                    style={{
                      font: "SF Pro",
                      fontSize: "24px",
                      fontWeight: "medium",
                      textAlign: "left",
                      color: "black",
                    }}
                  >
                    <span style={{ color: "#F26522" }}>Surprise</span> means
                    we’ll give you an <br />
                    assortment of meals on the specific <br />
                    delivery day.
                  </p>
                  <br />
                  <br />
                  <span onClick={this.handleClick}>
                    <img
                      style={{ marginLeft: "80px" }}
                      src={continueExploring}
                    />
                  </span>
                  <p
                    style={{
                      marginLeft: "50px",
                      font: "SF Pro",
                      fontWeight: "bold",
                      fontSize: "18px",
                      textAlign: "left",
                      paddingTop: "15px",
                      color: "black",
                    }}
                  >
                    Already a Customer?
                  </p>
                  <img
                    style={{
                      display: "block",
                      marginLeft: "80px",
                      marginTop: "-20px",
                      marginRight: "auto",
                    }}
                    src={loginButton}
                    onClick={() => this.togglePopLogin()}
                  />
                  {this.state.wantToLogin ? (
                    <LoginModal toggle={this.togglePopWTL} />
                  ) : null}
                  <p
                    style={{
                      marginLeft: "80px",
                      font: "SF Pro",
                      fontWeight: "bold",
                      fontSize: "18px",
                      textAlign: "left",
                      paddingTop: "15px",
                      color: "black",
                    }}
                  >
                    Ready to start eating better?
                  </p>
                  <img
                    style={{
                      display: "block",
                      marginLeft: "80px",
                      marginTop: "-15px",
                      marginRight: "auto",
                    }}
                    src={signupButton}
                    onClick={() => this.togglePopSignup()}
                  />
                  {this.state.wantToSignUp ? (
                    <SignUpModal toggle={this.togglePopWTS} />
                  ) : null}
                </div>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}
class SkipMeals extends Component {
  constructor(props) {
    super();
    this.state = {
      user_id: "",
      user_address: "",
      login_seen: false,
      signUpSeen: false,
      wantToLogin: false,
      wantToSignUp: false,
      seenForAM: false,
    };
  }
  handleClick = () => {
    this.props.toggle();
  };
  togglePopWTL = () => {
    this.setState({
      wantToLogin: !this.state.wantToLogin,
    });
  };
  togglePopWTS = () => {
    this.setState({
      wantToSignUp: !this.state.wantToSignUp,
    });
  };
  togglePopForAdd = () => {
    this.setState({
      seenForAM: !this.state.seenForAM,
    });
  };
  togglePopLogin = () => {
    this.setState({
      login_seen: !this.state.login_seen,
    });

    if (!this.state.login_seen) {
      this.setState({
        signUpSeen: false,
      });
    }
  };

  togglePopSignup = () => {
    this.setState({
      signUpSeen: !this.state.signUpSeen,
    });

    if (!this.state.signUpSeen) {
      this.setState({
        login_seen: false,
      });
    }
  };

  componentDidMount() {
    const customer_uid = Cookies.get("customer_uid");
    console.log(Cookies.get("customer_uid"));
    if (customer_uid) {
      this.setState({ user_id: customer_uid });
      axios
        .get(`${API_URL}Profile/${customer_uid}`)
        .then((response) => {
          const addr = response.data.result[0].customer_address.toLowerCase();
          this.setState({ user_address: addr });
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    } else {
      this.setState({ user_id: "not login" });
      this.setState({ user_address: "not login yet" });
      /*Use the following for setting the user */
      /*this.setState({user_id:'anup'});
	this.setState({user_address: '214 Main Ave, San Jose, CA 91101'});*/
    }
  }

  render() {
    return (
      <div>
        {this.state.login_seen ? (
          <PopLogin toggle={this.togglePopLogin} toggle_signup={this.togglePopSignup}/>
        ) : null}
        {this.state.signUpSeen ? (
          <Popsignup toggle={this.togglePopSignup} />
        ) : null}

        {(() => {
          if (this.state.user_id == "not login") {
            return (
              <div className={styles.modal}>
                <div className={styles.modal_content}>
                  <p
                    className={styles.ambassdorText}
                    style={{
                      font: "SF Pro",
                      fontSize: "24px",
                      fontWeight: "medium",
                      textAlign: "left",
                      color: "black",
                    }}
                  >
                    Not at home or have other plans?
                    <br /> Its easy to{" "}
                    <span style={{ color: "#F26522" }}>Skip</span> a delivery
                    and we’ll
                    <br /> automatically extend your subscription.
                  </p>
                  <br />
                  <br />
                  <span onClick={this.handleClick}>
                    <img
                      style={{ marginLeft: "80px" }}
                      src={continueExploring}
                    />
                  </span>
                  <p
                    style={{
                      marginLeft: "50px",
                      font: "SF Pro",
                      fontWeight: "bold",
                      fontSize: "18px",
                      textAlign: "left",
                      paddingTop: "15px",
                      color: "black",
                    }}
                  >
                    Already a Customer?
                  </p>
                  <img
                    style={{
                      display: "block",
                      marginLeft: "80px",
                      marginTop: "-20px",
                      marginRight: "auto",
                    }}
                    src={loginButton}
                    onClick={() => this.togglePopLogin()}
                  />
                  {this.state.wantToLogin ? (
                    <LoginModal toggle={this.togglePopWTL} />
                  ) : null}
                  <p
                    style={{
                      marginLeft: "80px",
                      font: "SF Pro",
                      fontWeight: "bold",
                      fontSize: "18px",
                      textAlign: "left",
                      paddingTop: "15px",
                      color: "black",
                    }}
                  >
                    Ready to start eating better?
                  </p>
                  <img
                    style={{
                      display: "block",
                      marginLeft: "80px",
                      marginTop: "-15px",
                      marginRight: "auto",
                    }}
                    src={signupButton}
                    onClick={() => this.togglePopSignup()}
                  />
                  {this.state.wantToSignUp ? (
                    <SignUpModal toggle={this.togglePopWTS} />
                  ) : null}
                </div>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}
class FavoriteMeal extends Component {
  constructor(props) {
    super();
    this.state = {
      user_id: "",
      user_address: "",
      login_seen: false,
      signUpSeen: false,
      wantToLogin: false,
      wantToSignUp: false,
      seenForAM: false,
    };
  }
  handleClick = () => {
    this.props.toggle();
  };
  togglePopWTL = () => {
    this.setState({
      wantToLogin: !this.state.wantToLogin,
    });
  };
  togglePopWTS = () => {
    this.setState({
      wantToSignUp: !this.state.wantToSignUp,
    });
  };
  togglePopForAdd = () => {
    this.setState({
      seenForAM: !this.state.seenForAM,
    });
  };
  togglePopLogin = () => {
    this.setState({
      login_seen: !this.state.login_seen,
    });

    if (!this.state.login_seen) {
      this.setState({
        signUpSeen: false,
      });
    }
  };

  togglePopSignup = () => {
    this.setState({
      signUpSeen: !this.state.signUpSeen,
    });

    if (!this.state.signUpSeen) {
      this.setState({
        login_seen: false,
      });
    }
  };

  componentDidMount() {
    const customer_uid = Cookies.get("customer_uid");
    console.log(Cookies.get("customer_uid"));
    if (customer_uid) {
      this.setState({ user_id: customer_uid });
      axios
        .get(`${API_URL}Profile/${customer_uid}`)
        .then((response) => {
          const addr = response.data.result[0].customer_address.toLowerCase();
          this.setState({ user_address: addr });
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    } else {
      this.setState({ user_id: "not login" });
      this.setState({ user_address: "not login yet" });
      /*Use the following for setting the user */
      /*this.setState({user_id:'anup'});
	this.setState({user_address: '214 Main Ave, San Jose, CA 91101'});*/
    }
  }

  render() {
    return (
      <div>
        {this.state.login_seen ? (
          <PopLogin toggle={this.togglePopLogin} toggle_signup={this.togglePopSignup}/>
        ) : null}
        {this.state.signUpSeen ? (
          <Popsignup toggle={this.togglePopSignup} />
        ) : null}

        {(() => {
          if (this.state.user_id == "not login") {
            return (
              <div className={styles.modal}>
                <div className={styles.modal_content}>
                  <p
                    className={styles.ambassdorText}
                    style={{
                      font: "SF Pro",
                      fontSize: "24px",
                      fontWeight: "medium",
                      textAlign: "left",
                      color: "black",
                    }}
                  >
                    Don’t forget your{" "}
                    <span style={{ color: "#F26522" }}>favorite</span> meals!
                    <br /> Click the <img src={heartImage} /> to easily find
                    your favorite
                    <br /> meals and get reminders.
                  </p>
                  <br />
                  <br />
                  <span onClick={this.handleClick}>
                    <img
                      style={{ marginLeft: "80px" }}
                      src={continueExploring}
                    />
                  </span>
                  <p
                    style={{
                      marginLeft: "50px",
                      font: "SF Pro",
                      fontWeight: "bold",
                      fontSize: "18px",
                      textAlign: "left",
                      paddingTop: "15px",
                      color: "black",
                    }}
                  >
                    Already a Customer?
                  </p>
                  <img
                    style={{
                      display: "block",
                      marginLeft: "80px",
                      marginTop: "-20px",
                      marginRight: "auto",
                    }}
                    src={loginButton}
                    onClick={() => this.togglePopLogin()}
                  />
                  {this.state.wantToLogin ? (
                    <LoginModal toggle={this.togglePopWTL} />
                  ) : null}
                  <p
                    style={{
                      marginLeft: "80px",
                      font: "SF Pro",
                      fontWeight: "bold",
                      fontSize: "18px",
                      textAlign: "left",
                      paddingTop: "15px",
                      color: "black",
                    }}
                  >
                    Ready to start eating better?
                  </p>
                  <img
                    style={{
                      display: "block",
                      marginLeft: "80px",
                      marginTop: "-15px",
                      marginRight: "auto",
                    }}
                    src={signupButton}
                    onClick={() => this.togglePopSignup()}
                  />
                  {this.state.wantToSignUp ? (
                    <SignUpModal toggle={this.togglePopWTS} />
                  ) : null}
                </div>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}
class CreateAccPWSU1 extends Component {
  constructor(props) {
    super();
  }
  handleClick = () => {
    this.props.toggle();
  };
  viewPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  render() {
    return (
      <div>
        <div className={styles.modal3}>
          <div className={styles.modal_content}>
            <p
              className={styles.ambassdorText}
              style={{
                font: "SF Pro",
                fontSize: "26px",
                fontWeight: "bold",
                textAlign: "center",
                color: "black",
              }}
            >
              Create an account
            </p>
            <br />
            <img
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "10px",
              }}
              src={continueWithApple}
            />
            <img
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "10px",
              }}
              src={continueWithFacebook}
            />
            <img
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              src={continueWithGoogle}
            />
            <p
              style={{
                font: "SF Pro",
                fontWeight: "bold",
                fontSize: "26px",
                textAlign: "center",
                color: "black",
              }}
            >
              OR
            </p>
            <div style={{ textAlign: "center" }}>
              <input
                type="credentials"
                style={{
                  border: "2px solid #F26522",
                  marginBottom: "10px",
                  width: " 428px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "15px",
                  padding: "10px",
                }}
                placeholder="Create Password"
              />
              <br />
              <input
                type="password"
                style={{
                  border: "2px solid #F26522",
                  marginLeft: "auto",
                  width: " 428px",
                  marginRight: "auto",
                  borderRadius: "15px",
                  padding: "10px",
                }}
                placeholder="Confirm Password"
              />
              <br />
              <br />
              <br />
              <img
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                src={signupButton}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
class LoginModal extends Component {
  constructor(props) {
    super();
  }
  handleClick = () => {
    this.props.toggle();
  };
  render() {
    return (
      <div>
        <div className={styles.modal2}>
          <div className={styles.modal_content}>
            <span className={styles.close} onClick={this.handleClick}>
              <img src={closeIconImg} />
            </span>
            <p
              className={styles.ambassdorText}
              style={{
                font: "SF Pro",
                fontSize: "26px",
                fontWeight: "bold",
                textAlign: "center",
                color: "black",
              }}
            >
              Login
            </p>
            <br />
            <img
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "10px",
              }}
              src={continueWithApple}
            />
            <img
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "10px",
              }}
              src={continueWithFacebook}
            />
            <img
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              src={continueWithGoogle}
            />
            <p
              style={{
                font: "SF Pro",
                fontWeight: "bold",
                fontSize: "26px",
                textAlign: "center",
                color: "black",
              }}
            >
              OR
            </p>
            <div style={{ textAlign: "center" }}>
              <input
                type="credentials"
                style={{
                  border: "2px solid #F26522",
                  marginBottom: "10px",
                  width: " 428px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "15px",
                  padding: "10px",
                }}
                placeholder="Username"
              />
              <br />
              <div>
                <span>
                  <input
                    type="password"
                    style={{
                      border: "2px solid #F26522",
                      marginLeft: "auto",
                      width: " 428px",
                      marginRight: "auto",
                      borderRadius: "15px",
                      padding: "10px",
                    }}
                    placeholder="Password"
                  />
                  <a>
                    <i
                      className="far fa-eye"
                      id="togglePassword"
                      style={{ color: "#F26522" }}
                      onClick={this.viewPassword}
                    ></i>
                  </a>
                </span>
              </div>
              <p
                style={{
                  font: "SF Pro",
                  fontWeight: "medium",
                  fontSize: "13px",
                  color: "black",
                }}
              >
                <u>Forgot password?</u>
              </p>
              <br />
              <img
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                src={loginButton}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
class SignUpModal extends Component {
  constructor(props) {
    super();
  }
  handleClick = () => {
    this.props.toggle();
  };
  render() {
    return (
      <div>
        <div className={styles.modal2}>
          <div className={styles.modal_content}>
            <span className={styles.close} onClick={this.handleClick}>
              <img src={closeIconImg} />
            </span>
            <p
              className={styles.ambassdorText}
              style={{
                font: "SF Pro",
                fontSize: "26px",
                fontWeight: "bold",
                textAlign: "center",
                color: "black",
              }}
            >
              Sign up
            </p>
            <br />
            <img
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "10px",
              }}
              src={continueWithApple}
            />
            <img
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "10px",
              }}
              src={continueWithFacebook}
            />
            <img
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              src={continueWithGoogle}
            />
            <p
              style={{
                font: "SF Pro",
                fontWeight: "bold",
                fontSize: "26px",
                textAlign: "center",
                color: "black",
              }}
            >
              OR
            </p>
            <div style={{ textAlign: "center" }}>
              <div style={{ overflow: "hidden", display: "inline-flex" }}>
                <input
                  type="credentials"
                  style={{
                    float: "left",
                    border: "2px solid #F26522",
                    marginBottom: "10px",
                    width: " 214px",
                    borderRadius: "15px",
                    padding: "10px",
                    marginRight: "10px",
                  }}
                  placeholder="First Name"
                />
                <br />
                <input
                  type="credentials"
                  style={{
                    float: "right",
                    border: "2px solid #F26522",
                    marginBottom: "10px",
                    width: " 214px",
                    borderRadius: "15px",
                    padding: "10px",
                  }}
                  placeholder="Last Name"
                />
                <br />
              </div>
              <br />
              <input
                type="credentials"
                style={{
                  border: "2px solid #F26522",
                  marginBottom: "10px",
                  width: " 428px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "15px",
                  padding: "10px",
                }}
                placeholder="Email address"
              />
              <br />
              <input
                type="credentials"
                style={{
                  border: "2px solid #F26522",
                  marginLeft: "auto",
                  width: " 428px",
                  marginRight: "auto",
                  borderRadius: "15px",
                  padding: "10px",
                }}
                placeholder="Confirm Email address"
              />
              <br />
              <input
                type="credentials"
                style={{
                  border: "2px solid #F26522",
                  marginBottom: "10px",
                  width: " 428px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "15px",
                  padding: "10px",
                }}
                placeholder="Create Password "
              />
              <a>
                <i
                  className="far fa-eye"
                  id="togglePassword"
                  style={{ color: "#F26522" }}
                  onClick={this.viewPassword}
                ></i>
              </a>
              <br />
              <input
                type="credentials"
                style={{
                  border: "2px solid #F26522",
                  marginLeft: "auto",
                  width: " 428px",
                  marginRight: "auto",
                  borderRadius: "15px",
                  padding: "10px",
                }}
                placeholder="Confirm Password"
              />
              <a>
                <i
                  className="far fa-eye"
                  id="togglePassword"
                  style={{ color: "#F26522" }}
                  onClick={this.viewPassword}
                ></i>
              </a>
              <p
                style={{
                  font: "SF Pro",
                  fontWeight: "medium",
                  fontSize: "13px",
                  color: "black",
                }}
              >
                <u>Forgot password?</u>
              </p>
              <br />
              <img
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                src={signupButton}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export {
  HomeLink,
  FootLink,
  AmbassadorLink,
  AddressLink,
  SaveMeals,
  SurpriseMeals,
  SkipMeals,
  FavoriteMeal,
  CreateAccPWSU1,
  LoginModal,
  SignUpModal,
};
