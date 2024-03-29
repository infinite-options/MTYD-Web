import { Component } from "react";
import axios from "axios";
import { API_URL } from "../../reducers/constants";
import Cookies from "js-cookie";
import PopLogin from "../PopLogin";
import Popsignup from "../PopSignup";
import {
  toggleLoginPopup,
  toggleSignupPopup
} from "../../reducers/actions/loginActions";
import { ReactComponent as CloseBtn } from "../../images/closeBtn.svg";
import styles from "./becomeAmbass.module.css";
import { connect } from "react-redux";
import { Route, withRouter } from "react-router-dom";

export class BecomeAmbass extends Component {
  constructor(props) {
    super();
    this.state = {
      user_id: "",
      user_address: "",
      user_email: "",
      login_seen: false,
      signUpSeen: false,
      seenForAM: false,
      hidden: 1,
      username: "",
      validEmail: true,
      emailExists: false,
      success: false,
    };
  }

  handleClick = () => {
    this.props.toggle();
    console.log("(BA) handleClick triggered");
  };
  togglePopForAdd = () => {
    this.setState({
      seenForAM: !this.state.seenForAM,
    });
  };
  togglePopLogin = () => {
    // console.log("(BA) in togglePopLogin");
    // this.setState({
    //   login_seen: !this.state.login_seen,
    //   hidden: 0,
    // });

    // if (!this.state.login_seen) {
    //   this.setState({
    //     signUpSeen: false,
    //   });
    // }
    this.props.toggleLoginPopup(!this.props.showLoginPopup);
    this.props.toggle();
  };

  // toggleLoginAndAmbassador = () => {
  //   this.handleClick();
  // }

  togglePopSignup = () => {
    // this.setState({
    //   signUpSeen: !this.state.signUpSeen,
    //   hidden: 0,
    // });

    // if (!this.state.signUpSeen) {
    //   this.setState({
    //     login_seen: false,
    //   });
    // }
    this.props.toggleSignupPopup(!this.props.showSignupPopup);
    this.props.toggle();
  };

  validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  sendAmbassadorEmail() {
    let email = document.getElementById("becomeAmbassadorEmail").value;
    // alert(document.getElementById("becomeAmbassadorEmail").value)

    if (this.validateEmail(email)) {
      this.setState({
        ...this.state,
        validEmail: true,
      });
      axios
        .post(API_URL + "brandAmbassador/create_ambassador", {
          code: email,
        })
        .then((res) => {
          const responseMessage = res.data;
          if (responseMessage === "Customer already an Ambassador") {
            this.setState({
              ...this.state,
              emailExists: true,
            });
          } else {
            this.setState({
              ...this.state,
              success: true,
              emailExists: false,
            });
          }
        });
    } else {
      this.setState({
        ...this.state,
        validEmail: false,
      });
    }
  }

  componentDidMount() {
    console.log("(mount) props: ", this.props);
    const customer_uid = Cookies.get("customer_uid");
    // console.log(Cookies.get("customer_uid"));
    if (customer_uid) {
      this.setState({ user_id: customer_uid });
      axios
        .get(`${API_URL}Profile/${customer_uid}`)
        .then((response) => {
          // console.log(response.data.result[0].customer_first_name);
          // console.log(response.data.result[0].customer_last_name);

          const addr = response.data.result[0].customer_address.toLowerCase();
          this.setState({
            user_address: addr,
            username:
              response.data.result[0].customer_first_name +
              " " +
              response.data.result[0].customer_last_name,
            user_email: response.data.result[0].customer_email,
          });
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
    }
  }

  render() {
    console.log("(becomeAmbass) props: ", this.props);
    return (
      <div
        style={{
          position: "relative",
          // border: 'inset'
          // border: 'green solid',
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "2000",
        }}
        // style={{
        //   position: "fixed",
        //   // border: 'inset'
        //   border: 'green solid',
        //   width: "100vw",
        //   height: "100vh",
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "center",
        //   zIndex: "2000",
        // }}
      >
        <div 
          className={styles.poploginsignup}
          style={this.state.login_seen || this.state.signUpSeen ? ({
            height: '100%',
            width: '100%',
            // border: '1px dashed',
            overflowY: 'scroll',
            zIndex: 5
          }) : ({
            height: '0%',
            width: '0%',
            zIndex: 3
          })}
        >
          
        </div>

        {(() => {
          if (this.state.user_id == "not login") {
            return (
              <div
                className={styles.becomeAnAmbassadorPopupSignin}
                style={{
                  zIndex: 4,
                  position: "fixed",
                }}
              >
                <div 
                  style={{ 
                    padding: "10px", 
                    textAlign: "right",
                    // border: '1px solid red'
                  }}
                >
                  <CloseBtn
                    // style={{
                    //   cursor: "pointer",
                    // }}
                    className={styles.closeBtn}
                    onClick={this.handleClick}
                    aria-label="click here to close"
                    title="click here to close"
                  />
                </div>

                <div
                  className={styles.becomeAmbassContent}
                  // style={{ 
                  //   textAlign: "center", 
                  //   padding: "0px 50px 20px 50px",
                  //   border: '1px solid blue'
                  // }}
                >
                  <p
                    style={{
                      color: "black",
                      padding: "0px",
                      fontSize: "32px",
                      fontWeight: "bold",
                      margin: "0px",
                    }}
                  >
                    Love MealsFor.Me?
                  </p>
                  <p
                    style={{
                      color: "black",
                      padding: "20px",
                      fontSize: "22px",
                      fontWeight: "bold",
                      margin: "0px",
                    }}
                  >
                    Become an Ambassador
                  </p>
                  <p
                    style={{
                      fontSize: "22px",
                      margin: "0px",
                      marginTop: "20px",
                    }}
                  >
                    Your friend(s) saves{" "}
                    <span style={{ color: "#F26522" }}>20%</span> on their first
                    order and you save{" "}
                    <span style={{ color: "#F26522" }}>20%</span> on your next
                    renewal
                    <br />
                    <span style={{ fontWeight: "bold" }}>+</span>
                    <br />
                    Each time your friend renews, you get an additional{" "}
                    <span style={{ color: "#F26522" }}>5%</span> renewal bonus.
                    <br />
                    Sign up 20 friends and eat for free
                  </p>

                  <button
                    className={styles.orangeBtn}
                    onClick={() => {
                      // this.handleClick();
                      this.togglePopLogin();
                    }}
                    aria-label="Click here to log in"
                    title="Click here to log in"
                  >
                    Login to become an ambassador
                  </button>
                  <div style={{ fontWeight: "bold", fontSize: "17px" }}>OR</div>
                  <button
                    className={styles.orangeBtn}
                    style={{
                      marginTop: "10px",
                    }}
                    onClick={() => {
                      // this.handleClick();
                      // this.props.togglePopSignup();
                      this.togglePopSignup();
                    }}
                    aria-label="Click here to sign up for meals 4 me"
                    title="Click here to sign up for meals 4 me"
                  >
                    Signup for MealsForMe
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <div
                className={styles.becomeAnAmbassadorPopupSignin}
                style={{
                  zIndex: 4,
                  position: "fixed",
                }}
              >
                <div style={{ padding: "10px", textAlign: "right" }}>
                  <CloseBtn
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={this.handleClick}
                    aria-label="click here to close"
                    title="click here to close"
                  />
                </div>

                <div
                  className={styles.ambContent2}
                  // style={{ 
                  //   textAlign: "center", 
                  //   padding: "0px 50px 20px 50px",
                  //   border: '1px dashed'
                  // }}
                >
                  <p
                    style={{
                      color: "black",
                      padding: "0px",
                      fontSize: "32px",
                      fontWeight: "bold",
                      margin: "0px",
                    }}
                  >
                    {(() => {
                      if (this.state.emailExists) {
                        return "Already an Ambassador";
                      } else if (this.state.success) {
                        return "Congratulations!";
                      }
                      return "Love MealsFor.Me?";
                    })()}
                  </p>
                  <p
                    style={{
                      color: "black",
                      padding: "20px",
                      fontSize: "22px",
                      fontWeight: "bold",
                      margin: "0px",
                    }}
                  >
                    {(() => {
                      if (this.state.emailExists) {
                        return "Registration found";
                      } else if (this.state.success) {
                        return "Registered as ambassador!";
                      } else return "Become an Ambassador";
                    })()}
                  </p>

                  <p
                    style={{
                      fontSize: "22px",
                      margin: "0px",
                      marginTop: "20px",
                    }}
                  >
                    {(() => {
                      if (this.state.emailExists) {
                        return "Looks like you're already an ambassador!";
                      } else if (this.state.success) {
                        return "You've successfully registered as an ambassador with us. Share the code (your email) with friends to start enjoying the benefits!";
                      } else
                        return (
                          <div>
                            Your friend(s) saves{" "}
                            <span style={{ color: "#F26522" }}>20%</span> on
                            their first order and you save{" "}
                            <span style={{ color: "#F26522" }}>20%</span> on
                            your next renewal
                            <br />
                            <span style={{ fontWeight: "bold" }}>+</span>
                            <br />
                            Each time your friend renews, you get an additional{" "}
                            <span style={{ color: "#F26522" }}>5%</span> renewal
                            bonus.
                            <br />
                            Sign up 20 friends and eat for free
                          </div>
                        );
                    })()}
                  </p>

                  <div
                    className={styles.ambNameWrapper}
                    // style={{
                    //   backgroundColor: "white",
                    //   // opacity:0.5,
                    //   color: "black",
                    //   textAlign: "center",
                    //   fontSize: "18px",
                    //   display: "flex",
                    //   flexDirection: "row",
                    //   justifyContent: "space-between",
                    //   padding: "20px 20px 0px 20px",
                    //   marginTop: "30px",
                    //   border: '1px solid blue'
                    // }}
                    // onClick={this.handleClick}
                  >
                    <div 
                      style={{ 
                        color: "#F26522",
                        // border: '1px solid red'
                      }}
                    >
                      Ambassador Name:
                    </div>
                    <div
                      style={{ 
                        // border: '1px solid green'
                      }}
                    >
                      {this.state.username}
                    </div>
                  </div>
                  <p
                    style={{
                      color: "red",
                      margin: "0px",
                      textAlign: "left",
                      paddingLeft: "40px",
                      height: "25px",
                      lineHeight: "25px",
                    }}
                  >
                    {!this.state.validEmail ? "Please enter a valid email" : ""}
                  </p>
                  <input
                    className={styles.ambEmailInput}
                    // style={{
                    //   width: "385px",
                    //   height: "42px",
                    //   backgroundColor: "white",
                    //   border: "2px solid #F26522",
                    //   borderRadius: "15px",
                    //   outline: "none",
                    //   paddingLeft: "15px",
                    //   // opacity:0.5
                    // }}
                    id="becomeAmbassadorEmail"
                    placeholder="Enter your email here"
                    value={this.state.user_email}
                    onChange={(event) => {
                      this.setState({
                        ...this.state,
                        user_email: event.target.value,
                      });
                    }}
                  />

                  <div style={{ color: "#F26522", padding: "25px" }}>
                    Your friends can use this email address as the Ambassador
                    code when they sign up
                  </div>

                  <button
                    className={styles.ambPopUpBtn}
                    // style={{
                    //   width: "410px",
                    //   height: "75px",
                    //   backgroundColor: "#F26522",
                    //   color: "white",
                    //   border: "none",
                    //   borderRadius: "20px",
                    //   fontSize: "24px",
                    // }}
                    onClick={() => {
                      if (this.state.emailExists || this.state.success) {
                        this.handleClick();
                      } else {
                        this.sendAmbassadorEmail();
                      }
                    }}
                    aria-label={
                      this.state.emailExists || this.state.success
                        ? "click here to exit"
                        : "click here to register as an ambassador"
                    }
                    title={
                      this.state.emailExists || this.state.success
                        ? "okay"
                        : "click here to register as an ambassador"
                    }
                  >
                    {(() => {
                      if (this.state.emailExists) {
                        return "Okay";
                      } else if (this.state.success) {
                        return "Okay";
                      } else return "Become an Ambassador";
                    })()}
                  </button>
                </div>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  showSignupPopup: state.login.showSignupPopup,
  showLoginPopup: state.login.showLoginPopup
});

const functionList = {
  toggleSignupPopup,
  toggleLoginPopup
};

// export default BecomeAmbass;
export default connect(mapStateToProps, functionList)(withRouter(BecomeAmbass));
