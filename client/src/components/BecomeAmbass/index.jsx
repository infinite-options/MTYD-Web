import React, { Component } from "react";
import axios from "axios";
import { API_URL } from "../../reducers/constants";
import Cookies from "js-cookie";
import PopLogin from "../PopLogin";
import Popsignup from "../PopSignup";
import style from "./becomeAmbass.css";

export class BecomeAmbass extends Component {
  constructor(props) {
    super();
    this.state = {
      user_id: "",
      user_address: "",
      login_seen: false,
      signUpSeen: false,
      seenForAM: false,
      hidden: 1,
      username: "",
    };
  }
  handleClick = () => {
    this.props.toggle();
  };
  togglePopForAdd = () => {
    this.setState({
      seenForAM: !this.state.seenForAM,
    });
  };
  togglePopLogin = () => {
    this.setState({
      login_seen: !this.state.login_seen,
      hidden: 0,
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
      hidden: 0,
    });

    if (!this.state.signUpSeen) {
      this.setState({
        login_seen: false,
      });
    }
  };

  sendAmbassadorEmail() {
    let email = document.getElementById("becomeAmbassadorEmail").value;
    // alert(document.getElementById("becomeAmbassadorEmail").value)
    axios
      .post(API_URL + "brandAmbassador/create_ambassador", {
        code: email,
      })
      .then((res) => {
        console.log(res);
      });
    alert("regisitered as ambassador");
    this.handleClick();
  }

  componentDidMount() {
    const customer_uid = Cookies.get("customer_uid");
    console.log(Cookies.get("customer_uid"));
    if (customer_uid) {
      this.setState({ user_id: customer_uid });
      axios
        .get(`${API_URL}Profile/${customer_uid}`)
        .then((response) => {
          console.log(response.data.result[0].customer_first_name);
          console.log(response.data.result[0].customer_last_name);

          const addr = response.data.result[0].customer_address.toLowerCase();
          this.setState({
            user_address: addr,
            username:
              response.data.result[0].customer_first_name +
              " " +
              response.data.result[0].customer_last_name,
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
        }}
      >
        <div className="poploginsignup">
          {this.state.login_seen ? (
            <PopLogin toggle={this.togglePopLogin} />
          ) : null}
          {this.state.signUpSeen ? (
            <Popsignup toggle={this.togglePopSignup} />
          ) : null}
        </div>

        {(() => {
          if (this.state.user_id == "not login") {
            return (
              <div
                style={{
                  opacity: this.state.hidden,
                  zIndex: 4,
                }}
                className="becomeAnAmbassadorPopup"
              >
                <div
                  style={{
                    position: "absolute",
                    width: "50px",
                    height: "50px",
                    backgroundColor: "red",
                    top: "20px",
                    right: "20px",
                    opacity: 0,
                  }}
                  onClick={this.handleClick}
                  tabIndex="0"
                  aria-label="click here to close"
                  title="click here to close"
                />
                <div
                  style={{
                    position: "absolute",
                    width: "430px",
                    height: "80px",
                    backgroundColor: "#f26522",
                    top: "335px",
                    left: "78px",
                    opacity: 1,
                    borderRadius: "15px",
                    textAlign: "center",
                    paddingTop: "20px",
                    color: "white",
                    fontSize: "25px",
                  }}
                  onClick={() => this.togglePopLogin()}
                  tabIndex="0"
                  aria-label="Click here to log in"
                  title="Click here to log in"
                >
                  Login to become an ambassador
                </div>

                <div
                  style={{
                    position: "absolute",
                    width: "430px",
                    height: "80px",
                    backgroundColor: "#f26522",
                    top: "473px",
                    left: "78px",
                    opacity: 1,
                    borderRadius: "15px",
                    textAlign: "center",
                    paddingTop: "20px",
                    color: "white",
                    fontSize: "25px",
                  }}
                  onClick={() => this.togglePopSignup()}
                  tabIndex="0"
                  aria-label="Click here to sign up for meals 4 me"
                  title="Click here to sign up for meals 4 me"
                >
                  Signup for MealsForMe
                </div>
              </div>
            );
          } else {
            return (
              <div
                className="becomeAnAmbassadorPopupSignin"
                style={{
                  zIndex: 4,
                  // border: 'dashed'
                  position: "fixed",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "37px",
                    height: "37px",
                    borderRadius: "50%",
                    // backgroundColor:'blue',
                    top: "7px",
                    right: "5px",
                    opacity: 0.5,
                    cursor: "pointer",
                  }}
                  onClick={this.handleClick}
                  tabIndex="0"
                  aria-label="click here to close"
                  title="click here to close"
                />

                <div
                  style={{
                    position: "absolute",
                    width: "200px",
                    height: "30px",
                    backgroundColor: "white",
                    top: "390px",
                    right: "40px",
                    // opacity:0.5,
                    color: "black",
                    textAlign: "center",
                    fontSize: "18px",
                  }}
                  // onClick={this.handleClick}
                >
                  {this.state.username}
                </div>
                <input
                  style={{
                    position: "absolute",
                    width: "385px",
                    height: "42px",
                    backgroundColor: "white",
                    top: "432px",
                    right: "74px",
                    border: "2px solid #F26522",
                    borderRadius: "15px",
                    outline: "none",
                    // opacity:0.5
                  }}
                  id="becomeAmbassadorEmail"
                  placeholder="Enter your email here"
                />

                <button
                  style={{
                    position: "absolute",
                    width: "410px",
                    height: "75px",
                    backgroundColor: "red",
                    top: "560px",
                    right: "60px",
                    opacity: 0,
                  }}
                  onClick={() => this.sendAmbassadorEmail()}
                  aria-label="click here to register as an ambassador"
                  title="click here to register as an ambassador"
                ></button>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}

export default BecomeAmbass;
