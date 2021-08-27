import React, { Component } from "react";
import styles from "./popSignup.css";
import SocialLogin from "../Landing/socialLogin";
import {
  changeNewEmail,
  changeNewPassword,
  changeNewPasswordConfirm,
  changeNewFirstName,
  changeNewLastName,
  changeNewPhone,
  changeNewAddress,
  changeNewUnit,
  changeNewCity,
  changeNewState,
  changeNewZip,
  submitPasswordSignUp,
  loginAttempt,
} from "../../reducers/actions/loginActions";
import { connect } from "react-redux";
import { Route, withRouter } from "react-router-dom";
import axios from "axios";

const google = window.google;

export class PopSignup extends Component {
  constructor(props) {
    super(props);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.autocomplete = null;
    this.state = this.initialState();
  }

  initialState() {
    if (this.props.messageFromHooray) {
      return {
        name: "xxx",
        street_address: this.props.streetAddressFromHooray,
        city: this.props.cityFromHooray,
        state: this.props.stateFromHooray,
        zip_code: this.props.zipCodeFromHooray,
      };
    }

    return {
      name: "",
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      lat: "",
      lng: "",
    };
  }

  componentDidMount() {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("ship-address"),
      {
        componentRestrictions: { country: ["us", "ca"] },
      }
    );
    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);

    console.log(this.state);
  }

  handlePlaceSelect() {
    let address1Field = document.querySelector("#ship-address");
    let postalField = document.querySelector("#postcode");

    let addressObject = this.autocomplete.getPlace();
    console.log(addressObject);
    console.log(addressObject.address_components);

    let address1 = "";
    let postcode = "";
    let city = "";
    let state = "";

    for (const component of addressObject.address_components) {
      const componentType = component.types[0];
      switch (componentType) {
        case "street_number": {
          address1 = `${component.long_name} ${address1}`;
          break;
        }

        case "route": {
          address1 += component.short_name;
          break;
        }

        case "postal_code": {
          postcode = `${component.long_name}${postcode}`;
          break;
        }

        case "locality":
          document.querySelector("#locality").value = component.long_name;
          city = component.long_name;
          break;

        case "administrative_area_level_1": {
          document.querySelector("#state").value = component.short_name;
          state = component.short_name;
          break;
        }
      }
    }

    address1Field.value = address1;
    postalField.value = postcode;

    // console.log(address1);
    // console.log(postcode)

    this.setState({
      name: addressObject.name,
      street_address: address1,
      city: city,
      state: state,
      zip_code: postcode,
      lat: addressObject.geometry.location.lat(),
      lng: addressObject.geometry.location.lng(),
    });

    console.log(this.state);

    axios
      .get(
        `https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/categoricalOptions/${this.state.lng},${this.state.lat}`
      )
      .then((res) => {
        console.log(res);
        if (res.data.result.length == 0) {
          alert("cannot deliver to this address");
          console.log("cannot deliver to this address");
        } else {
          console.log("we can deliver to this address");
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });

    // console.log(this.state)
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    console.log(event.target.name);
    console.log(event.target.value);
  }

  handleClick = () => {
    this.props.toggle();
  };

  successLogin = () => {
    console.log("inside success login");
    this.props.history.push(`/choose-plan`);
  };

  sleep = (milliseconds) => {
    console.log("inside sleep");
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  wrapperFunction = () => {
    console.log(this.state);
    let nameCheck = false;
    let emailCheck = false;
    let passwordCheck = false;
    if (this.props.firstName == "" || this.props.lastName == "") {
      alert("first name and last name is required");
    } else {
      nameCheck = true;
    }
    if (this.props.email == "") {
      alert("email is required");
    } else {
      emailCheck = true;
    }
    if (this.props.password != this.props.passwordConfirm) {
      alert("passwords do not match");
    } else {
      passwordCheck = true;
    }
    if (nameCheck == true && emailCheck == true && passwordCheck == true) {
      this.props.submitPasswordSignUp(
        this.props.email,
        this.props.password,
        this.props.passwordConfirm,
        this.props.firstName,
        this.props.lastName,
        this.props.phone,
        this.state.street_address,
        this.props.unit,
        this.state.city,
        this.state.state,
        this.state.zip_code
      );
      let temppd = this.props.password;
      let tempem = this.props.email;

      console.log("finish signup function");

      this.sleep(1000).then(() => {
        this.props.loginAttempt(tempem, temppd, this.successLogin);
        console.log("finish login function");
      });
    }
  };

  render() {
    return (
      <div className="model_content">
        <button
          className="close"
          onClick={this.handleClick}
          aria-label="Click here to exit sign up menu"
          title="Click here to exit sign up menu"
        />
        <div
          style={{
            marginTop: "59px",
            marginBottom: "33px",
            fontSize: "26px",
            fontWeight: "bold",
            marginLeft: "230px",
          }}
        >
          Sign up
        </div>

        <div>
          <SocialLogin />
        </div>

        <div
          style={{
            textAlign: "center",
            height: "28px",
            letterSpacing: "0.38px",
            color: "black",
            fontSize: "26px",
            opacity: 1,
            marginTop: "28px",
            marginBottom: "25px",
            fontWeight: "bold",
          }}
        >
          OR
        </div>

        <div
          style={{
            marginLeft: "61px",
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            <input
              style={{
                width: "208px",
                marginRight: "12px",
              }}
              className="inputBox"
              placeholder="First name"
              value={this.props.firstName}
              onChange={(e) => {
                this.props.changeNewFirstName(e.target.value);
              }}
              aria-label="Input first name"
              title="Input first name"
            ></input>

            <input
              style={{
                width: "208px",
              }}
              className="inputBox"
              placeholder="Last name"
              value={this.props.lastName}
              onChange={(e) => {
                this.props.changeNewLastName(e.target.value);
              }}
              aria-label="Input last name"
              title="Input last name"
            ></input>
          </div>

          <input
            className="inputBox"
            placeholder="Email address (for order confirmation)"
            value={this.props.email}
            onChange={(e) => {
              this.props.changeNewEmail(e.target.value);
            }}
            aria-label="Input email address"
            title="Input email address"
          ></input>

          <input
            className="inputBox"
            placeholder="Create Password"
            type="password"
            value={this.props.password}
            onChange={(e) => {
              this.props.changeNewPassword(e.target.value);
            }}
            aria-label="Enter password you want to use"
            title="Enter password you want to use"
          ></input>

          <input
            className="inputBox"
            placeholder="Confirm Password"
            type="password"
            value={this.props.passwordConfirm}
            onChange={(e) => {
              this.props.changeNewPasswordConfirm(e.target.value);
            }}
            aria-label="Confirn your password"
            title="Confirn your password"
          ></input>

          <input
            className="inputBox"
            placeholder="Phone Number"
            value={this.props.phone}
            onChange={(e) => {
              this.props.changeNewPhone(e.target.value);
            }}
            aria-label="Enter your phone number"
            title="Enter your phone number"
          ></input>

          <input
            className={
              this.state.street_address == "" ? "inputBox" : "StreetinputBox"
            }
            id="ship-address"
            name="ship-address"
            onChange={(e) => {
              this.props.changeNewAddress(e.target.value);
            }}
            placeholder={
              this.state.street_address == ""
                ? "Street Address"
                : this.state.street_address
            }
            aria-label="Enter your street address"
            title="Enter your street address"
          />

          <input
            style={{
              width: "208px",
              marginRight: "12px",
            }}
            className="inputBox"
            placeholder="Unit"
            value={this.props.unit}
            onChange={(e) => {
              this.props.changeNewUnit(e.target.value);
            }}
            aria-label="Enter your unit number. optional"
            title="Enter your unit number. optional"
          />

          <input
            style={{
              width: "208px",
              marginRight: "12px",
            }}
            className="inputBox"
            placeholder="City"
            id="locality"
            name="locality"
            value={this.state.city}
            aria-label="Enter your city"
            title="Enter your city"
            onChange={(e) => {
              this.props.changeNewCity(e.target.value);
            }}
          />

          <input
            style={{
              width: "208px",
              marginRight: "12px",
            }}
            className="inputBox"
            placeholder="State"
            id="state"
            name="state"
            value={this.state.state}
            aria-label="Enter your state"
            title="Enter your state"
            onChange={(e) => {
              this.props.changeNewState(e.target.value);
            }}
          />

          <input
            style={{
              width: "208px",
              marginRight: "12px",
            }}
            className="inputBox"
            placeholder="Zip"
            id="postcode"
            name="postcode"
            value={this.state.zip_code}
            aria-label="Enter your zip code"
            title="Enter your zip code"
            onChange={(e) => {
              this.props.changeNewZip(e.target.value);
            }}
          />
        </div>

        <button
          style={{
            width: "452px",
            height: "71px",
            background: " #FF8500 0% 0% no-repeat padding-box",
            borderRadius: "14px",
            opacity: 1,
            marginLeft: "49px",
            marginTop: "26px",
            border: "none",
          }}
          onClick={this.wrapperFunction}
        >
          <p
            style={{
              fontSize: "20px",
              textAlign: "center",
              marginTop: 8,
              fontWeight: 500,
            }}
            aria-label="Click here to sign up"
            title="Click here to sign up"
          >
            Sign up
          </p>
        </button>

        {/* <GooglePlacesAutocomplete
          placeholder="Type in an address"
        /> */}

        {/* <input id="autocompletexx"/> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.login.newUserInfo.email,
  password: state.login.newUserInfo.password,
  passwordConfirm: state.login.newUserInfo.passwordConfirm,
  firstName: state.login.newUserInfo.firstName,
  lastName: state.login.newUserInfo.lastName,
  phone: state.login.newUserInfo.phone,
  street: state.login.newUserInfo.address.street,
  unit: state.login.newUserInfo.address.unit,
  city: state.login.newUserInfo.address.city,
  state: state.login.newUserInfo.address.state,
  zip: state.login.newUserInfo.address.zip,
});

const functionList = {
  changeNewEmail,
  changeNewPassword,
  changeNewPasswordConfirm,
  changeNewFirstName,
  changeNewLastName,
  changeNewPhone,
  changeNewAddress,
  changeNewUnit,
  changeNewCity,
  changeNewState,
  changeNewZip,
  submitPasswordSignUp,
  loginAttempt,
};

export default connect(mapStateToProps, functionList)(withRouter(PopSignup));
