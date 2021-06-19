import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
  initAppleSignUp,
  changeNewFirstName,
  changeNewLastName,
  changeNewPhone,
  changeNewAddress,
  changeNewUnit,
  changeNewCity,
  changeNewState,
  changeNewZip,
  submitSocialSignUp
} from "../../reducers/actions/loginActions";
import {withRouter} from "react-router";
import styles from "../SignUp/signup.module.css";
import {WebNavBar} from "../NavBar";

import axios from 'axios';

// import styles from "./socialSignup.module.css";

const google = window.google;

class SocialSignUp extends React.Component {
  constructor(props) {
    super(props);
    this.handlePlaceSelect_signup = this.handlePlaceSelect_signup.bind(this)
    this.autocomplete_social = null
    this.state = {
      mounted: false,
      name: '',
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
      lat:'',
      lng:''
    }
  }

  // initialState() {
  //   return {
  //     mounted: false,
  //     name: '',
  //     street_address: '',
  //     city: '',
  //     state: '',
  //     zip_code: '',
  //     lat:'',
  //     lng:''
  //   }
  // }

  componentDidMount() {
    let queryString = this.props.location.search;
    console.log("(SSU) queryString: ", queryString);

    let urlParams = new URLSearchParams(queryString);
    console.log("(SSU) urlParams: ", urlParams);

    if (urlParams.has("id")) {
      console.log("(SSU) before initAppleSignup");

      this.props.initAppleSignUp(urlParams.get("id"), () => {
        this.setState({
          mounted: true
        });
      });
    } else {
      console.log("(SSU) NOT initAppleSignup");

      this.setState({
        mounted: true // always true?
      });
    }


    this.autocomplete_social = new google.maps.places.Autocomplete(document.getElementById('ship-address-social-login'),{
      componentRestrictions: { country: ["us", "ca"] },
    })
    this.autocomplete_social.addListener("place_changed", this.handlePlaceSelect_signup)

    console.log(this.autocomplete_social)
  }

  handlePlaceSelect_signup() {
    console.log('here')
    let address1Field = document.querySelector("#ship-address-social-login");
    let postalField = document.querySelector("#postcode");

    let addressObject = this.autocomplete_social.getPlace()
    console.log(addressObject);

    let address1 = "";
    let postcode = "";
    let city = '';
    let state = '';

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
          state= component.short_name;
          break;
        }
        
      }
    }

    address1Field.value = address1;
    postalField.value = postcode;

    console.log(address1);
    console.log(postcode)

    this.setState({
      name: addressObject.name,
      street_address: address1,
      city: city,
      state: state,
      zip_code: postcode,
      lat:addressObject.geometry.location.lat(),
      lng:addressObject.geometry.location.lng(),
    })

    axios.get(`https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/categoricalOptions/${this.state.lng},${this.state.lat}`)
      .then(res=>{
        console.log(res)
        if(res.data.result.length==0){
          alert('cannot deliver to this address')
          console.log('cannot deliver to this address')
        }else{
          console.log('we can deliver to this address')
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });



    console.log(this.state)
  }


  signupCheck=()=>{

    if(this.props.firstName==''||this.props.lastName==''){
      alert('first name and last name is required')
    }else{
        this.props.submitSocialSignUp(
        this.props.AppleSignUp,
        this.props.customerId,
        this.props.email,
        this.props.platform,
        this.props.accessToken,
        this.props.refreshToken,
        this.props.firstName,
        this.props.lastName,
        this.props.phone,
        this.state.street_address,
        this.props.unit,
        this.state.city,
        this.state.state,
        this.state.zip_code,
        this.signUpSuccess
      );
    }

    // The following code allows you to create null social media accounts for testing

    // this.props.submitSocialSignUp(
    //       this.props.AppleSignUp,
    //       this.props.customerId,
    //       this.props.email,
    //       this.props.platform,
    //       this.props.accessToken,
    //       this.props.refreshToken,
    //       this.props.firstName,
    //       this.props.lastName,
    //       this.props.phone,
    //       this.state.street_address,
    //       this.props.unit,
    //       this.state.city,
    //       this.state.state,
    //       this.state.zip_code,
    //       this.signUpSuccess
    //     );



  }

  signUpSuccess = () => {
    this.props.history.push("/choose-plan");
  };

  render() {
    if (!this.state.mounted) {
      return null;
    }
    // Removed this code so Apple Login would work
    // if (this.props.email === "" || this.props.refreshToken === "") {
    //   this.props.history.push("sign-up");
    //}
    return (
      <div className={styles.root}>
        <WebNavBar />
        <div className={styles.wrap_container}>
          <div className={styles.container + " row"}>
            <div className={"col-7 " + styles.userInfo} style = {{padding: '110px 0px'}}>
              <h6 className={styles.subHeading}> User Information </h6>
              <div className={styles.inputContainer}>
                <div className={styles.inputItem}>
                  <input
                    type='text'
                    //   className={styles.input}
                    placeholder={"First name"}
                    value={this.props.firstName}
                    onChange={e => {
                      this.props.changeNewFirstName(e.target.value);
                    }}
                    aria-label="Enter your first name here"
                  />
                </div>
                <div className={styles.inputItem}>
                  <input
                    type='text'
                    //   className={styles.input}
                    placeholder={"Last name"}
                    value={this.props.lastName}
                    onChange={e => {
                      this.props.changeNewLastName(e.target.value);
                    }}
                    required
                    aria-label="Enter your last name here"
                  />
                </div>
                <div className={styles.inputItem}>
                  <input
                    type='text'
                    //   className={styles.input}
                    placeholder={"Phone"}
                    value={this.props.phone}
                    onChange={e => {
                      this.props.changeNewPhone(e.target.value);
                    }}
                    aria-label="Enter your phone number here"
                  />
                </div>
              </div>
              <h6 className={styles.subHeading}> Address </h6>
              <div className={styles.inputContainer}>
                <div className={styles.inputItemAddress}>
                  <input
                    id="ship-address-social-login"
                    name="ship-address-social-login"

                    placeholder='Street Address'
                    aria-label="Enter your street address"
                  />
                </div>
                <div className={styles.inputItemAddress}>
                  <input
                    placeholder='Unit'
                    value={this.props.unit}
                    onChange={e => {
                      this.props.changeNewUnit(e.target.value);
                    }}
                    aria-label="Enter your unit number. Optional"
                  />
                </div>
                <div className={styles.inputItemAddress}>
                  <input
                    placeholder='City'
                    placeholder='City'
                    id="locality" name="locality"
                    aria-label="Enter your city"

                  />
                </div>
                <div className={styles.inputItemAddress}>
                  <input

                    placeholder='State'
                    id="state" name="state"
                    aria-label="Enter your state"
                  />
                </div>
                <div className={styles.inputItemAddress}>
                  <input
                    placeholder='Zip'
                    placeholder='Zip'
                    id="postcode" name="postcode"
                    aria-label="Enter your zip code"

                  />
                </div>
              </div>
              <div className={styles.buttonContainer}>
                <button className={styles.button + " mr-3"} aria-label="Click here to go back">BACK</button>
                <button
                  className={styles.button + " ml-3"}
                  onClick={this.signupCheck}
                  aria-label="Click here to sign up"
                >
                  SIGN UP
                </button>
              </div>
            </div>
            <div className={"col-5 " + styles.explore}>
              <div className={"row " + styles.centerBtn}>
                <p>EXPLORE WITHOUT LOGIN</p>
                <button aria-label="Click here to explore without loging in"> START </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SocialSignUp.propTypes = {
  changeNewFirstName: PropTypes.func.isRequired,
  changeNewLastName: PropTypes.func.isRequired,
  changeNewPhone: PropTypes.func.isRequired,
  changeNewAddress: PropTypes.func.isRequired,
  changeNewUnit: PropTypes.func.isRequired,
  changeNewCity: PropTypes.func.isRequired,
  changeNewState: PropTypes.func.isRequired,
  changeNewZip: PropTypes.func.isRequired,
  submitSocialSignUp: PropTypes.func.isRequired,
  AppleSignUp: PropTypes.bool.isRequired,
  customerId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
  accessToken: PropTypes.string.isRequired,
  refreshToken: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  street: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  zip: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  AppleSignUp: state.login.newUserInfo.AppleSignUp,
  customerId: state.login.newUserInfo.customerId,
  email: state.login.newUserInfo.email,
  platform: state.login.newUserInfo.platform,
  accessToken: state.login.newUserInfo.accessToken,
  refreshToken: state.login.newUserInfo.refreshToken,
  firstName: state.login.newUserInfo.firstName,
  lastName: state.login.newUserInfo.lastName,
  phone: state.login.newUserInfo.phone,
  street: state.login.newUserInfo.address.street,
  unit: state.login.newUserInfo.address.unit,
  city: state.login.newUserInfo.address.city,
  state: state.login.newUserInfo.address.state,
  zip: state.login.newUserInfo.address.zip
});

const functionList = {
  initAppleSignUp,
  changeNewFirstName,
  changeNewLastName,
  changeNewPhone,
  changeNewAddress,
  changeNewUnit,
  changeNewCity,
  changeNewState,
  changeNewZip,
  submitSocialSignUp
};

export default connect(mapStateToProps, functionList)(withRouter(SocialSignUp));
