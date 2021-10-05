import React, { Component } from "react";
import styles from "./popSignup.css";
import SocialLogin from "../Landing/socialLogin";
import { API_URL } from "../../reducers/constants";
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
  submitPasswordSignUp_v2,
  loginAttempt,
  toggleLoginPopup,
  toggleSignupPopup
} from "../../reducers/actions/loginActions";
import { connect } from "react-redux";
import { Route, withRouter } from "react-router-dom";
import axios from "axios";
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';
import verifyAddressDelivers from "../../utils/VerifyAddressDelivers";

const google = window.google;

export class PopSignup extends Component {
  constructor(props) {
    super(props);
    // this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    // this.autocomplete = null;
    // this.state = this.initialState();
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      password: '',
      password_confirm: '',
      latitude: '',
      longitude: '',
      address: '',
      coordinates: {lat: null, lng: null},
      signUpPopUp: null,
      disableSignUp: false
    }
  }

  // initialState() {
  //   if (this.props.messageFromHooray) {
  //     return {
  //       name: "xxx",
  //       street_address: this.props.streetAddressFromHooray,
  //       city: this.props.cityFromHooray,
  //       state: this.props.stateFromHooray,
  //       zip_code: this.props.zipCodeFromHooray,
  //     };
  //   }

  //   return {
  //     name: "",
  //     street_address: "",
  //     city: "",
  //     state: "",
  //     zip_code: "",
  //     lat: "",
  //     lng: "",
  //   };
  // }

  componentDidMount() {
    console.log("(PSU) props: ", this.props);
    // this.autocomplete = new google.maps.places.Autocomplete(
    //   document.getElementById("ship-address"),
    //   {
    //     componentRestrictions: { country: ["us", "ca"] },
    //   }
    // );
    // this.autocomplete.addListener("place_changed", this.handlePlaceSelect);

    console.log(this.state);
    if (this.props.messageFromHooray) {
      this.setState({
        address: this.props.streetAddressFromHooray,
        city: this.props.cityFromHooray,
        state: this.props.stateFromHooray,
        zip: this.props.zipCodeFromHooray
      });
    }
  }

  // handlePlaceSelect() {
  //   console.log("in handlePlaceSelect");
  //   let address1Field = document.querySelector("#ship-address");
  //   let postalField = document.querySelector("#postcode");

  //   let addressObject = this.autocomplete.getPlace();
  //   console.log(addressObject);
  //   console.log(addressObject.address_components);

  //   let address1 = "";
  //   let postcode = "";
  //   let city = "";
  //   let state = "";

  //   for (const component of addressObject.address_components) {
  //     const componentType = component.types[0];
  //     switch (componentType) {
  //       case "street_number": {
  //         address1 = `${component.long_name} ${address1}`;
  //         break;
  //       }

  //       case "route": {
  //         address1 += component.short_name;
  //         break;
  //       }

  //       case "postal_code": {
  //         postcode = `${component.long_name}${postcode}`;
  //         break;
  //       }

  //       case "locality":
  //         document.querySelector("#locality").value = component.long_name;
  //         city = component.long_name;
  //         break;

  //       case "administrative_area_level_1": {
  //         document.querySelector("#state").value = component.short_name;
  //         state = component.short_name;
  //         break;
  //       }
  //     }
  //   }

  //   address1Field.value = address1;
  //   postalField.value = postcode;

  //   // console.log(address1);
  //   // console.log(postcode)

  //   // this.setState({
  //   //   name: addressObject.name,
  //   //   street_address: address1,
  //   //   city: city,
  //   //   state: state,
  //   //   zip_code: postcode,
  //   //   lat: addressObject.geometry.location.lat(),
  //   //   lng: addressObject.geometry.location.lng(),
  //   // });
  //   this.setState({
  //     name: addressObject.name,
  //     street: address1,
  //     city: city,
  //     state: state,
  //     zip: postcode,
  //     latitude: addressObject.geometry.location.lat().toString(),
  //     longitude: addressObject.geometry.location.lng().toString(),
  //   });

  //   console.log(this.state);

  //   axios
  //     .get(
  //       `https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/categoricalOptions/${this.state.longitude},${this.state.latitude}`
  //     )
  //     .then((res) => {
  //       console.log(res);
  //       if (res.data.result.length == 0) {
  //         alert("cannot deliver to this address");
  //         console.log("cannot deliver to this address");
  //       } else {
  //         console.log("we can deliver to this address");
  //       }
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         console.log(err.response);
  //       }
  //       console.log(err);
  //     });

  //   // console.log(this.state)
  // }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    console.log(event.target.name);
    console.log(event.target.value);
  }

  handleClick = () => {
    // this.props.toggle();
    // this.props.dispatch({type: "SHOW_SIGNUP_POPUP"})
    this.props.toggleSignupPopup(!this.props.showSignupPopup);
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

  directSignUp = () => {
    console.log("(DSU) in directSignUp");
    console.log("(DSU) state: ", this.state);

    let nameCheck = false;
    let emailCheck = false;
    let passwordCheck = false;

    if (this.state.password !== this.state.password_confirm) {
      // alert("passwords do not match");
      this.setState({
        signUpPopUp: (
          <div className='loginErrorModal' style={{marginTop: '500px'}}>
            <button 
              className="close" 
              onClick={() => {
                this.setState({signUpPopUp: null})
              }} 
              aria-label="Click here to close password error pop up" 
              title="Click here to close password error pop up"
            />
            <div className='loginErrorHeader'>
              Passwords Don't Match
            </div>
            <div className='loginErrorText'>
              Please enter matching passwords.
            </div>
            <div className='socialBtnWrapper'>
              <button
                className='orangeBtn'
                onClick={() => {
                  this.setState({signUpPopUp: null})
                }}
                aria-label="Click here to close password error pop up"
                title="Click here to close password error pop up"
              >
                OK
              </button>
            </div>
          </div>
        )
      });
    } else {
      this.setState({
        disableSignUp: true
      }, () => {
        verifyAddressDelivers(
          this.state.address,
          this.state.city,
          this.state.state,
          this.state.zip,
          (latitude, longitude) => {
            if(latitude !== null && longitude !== null){
              axios
                .get(API_URL + "Profile?customer_email=" + this.state.email)
                // .get('http://localhost:2000/api/v2/Profile?customer_email=' + this.state.email)
                .then((res) => {
                  console.log("(profile) res: ", res);

                  if(res.data.code === 404){ // account doesn't exist, so proceed with creating it
                    let temp_pw = this.state.password;
                    let temp_email = this.state.email;
                    
                    this.props.submitPasswordSignUp_v2(
                      this.state.email,
                      this.state.password,
                      this.state.password_confirm,
                      this.state.first_name,
                      this.state.last_name,
                      this.state.phone,
                      this.state.address,
                      this.state.unit,
                      this.state.city,
                      this.state.state,
                      this.state.zip,
                      (signup_success, message) => {
                        console.log("callback success? ", signup_success);
                        console.log("callback message: ", message);
                        if(signup_success){
                          this.props.loginAttempt(temp_email, temp_pw, this.successLogin);
                        } else {
                          this.setState({
                            signUpPopUp: (
                              <div className='loginErrorModal' style={{marginTop: '500px'}}>
                                <button 
                                  className="close" 
                                  onClick={() => {
                                    this.setState({
                                      signUpPopUp: null, 
                                      disableSignUp: false
                                    });
                                  }} 
                                  aria-label="Click here to close sign up error pop up" 
                                  title="Click here to close sign up error pop up"
                                />
                                <div className='loginErrorHeader'>
                                  Error Creating Account
                                </div>
                                <div className='loginErrorText'>
                                  {message}
                                </div>
                                <div className='socialBtnWrapper'>
                                  <button
                                    className='orangeBtn'
                                    onClick={() => {
                                      this.setState({
                                        signUpPopUp: null, 
                                        disableSignUp: false
                                      });
                                    }}
                                    aria-label="Click here to close sign up error pop up"
                                    title="Click here to close sign up error pop up"
                                  >
                                    OK
                                  </button>
                                </div>
                              </div>
                            )
                          });
                        }
                      }
                    );
                    
                  } else { // account already exists, display error
                    this.setState({
                      signUpPopUp: (
                        <div className='loginErrorModal' style={{marginTop: '500px'}}>
                          <button 
                            className="close" 
                            onClick={() => {
                              this.setState({
                                signUpPopUp: null, 
                                disableSignUp: false
                              });
                            }} 
                            aria-label="Click here to close email exists error pop up" 
                            title="Click here to close email exists error pop up"
                          />
                          <div className='loginErrorHeader'>
                            Email Already Exists
                          </div>
                          <div className='loginErrorText'>
                            {"The email "}
                            <span style={{textDecoration: 'underline'}}>{this.state.email}</span>
                            {" has already been used to create an account. Please use a different one."}
                          </div>
                          <div className='socialBtnWrapper'>
                            <button
                              className='orangeBtn'
                              onClick={() => {
                                this.setState({
                                  signUpPopUp: null, 
                                  disableSignUp: false
                                });
                              }}
                              aria-label="Click here to close email exists error pop up"
                              title="Click here to close email exists error pop up"
                            >
                              OK
                            </button>
                          </div>
                        </div>
                      )
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.setState({
                signUpPopUp: (
                  <div className='loginErrorModal' style={{marginTop: '500px'}}>
                    <button 
                      className="close" 
                      onClick={() => {
                        this.setState({
                          signUpPopUp: null, 
                          disableSignUp: false
                        });
                      }} 
                      aria-label="Click here to close address error pop up" 
                      title="Click here to close address error pop up"
                    />
                    <div className='loginErrorHeader'>
                      Still Growing
                    </div>
                    {/* <div className='loginErrorText'>
                      {"Sorry, the address\n"}
                      <br/>
                      <span style={{textDecoration: 'underline'}}>
                        {this.state.address + ", "}
                        <br/>
                        {this.state.city + ", " +
                        this.state.state + ", " +
                        this.state.zip}
                      </span>
                      <br/>
                      {" is currently outside our service area."}
                    </div> */}
                    <div className='loginErrorText'>
                      Sorry, it looks like we don’t deliver to your neighborhood yet.
                    </div>
                    <div className='socialBtnWrapper'>
                      <button
                        className='orangeBtn'
                        onClick={() => {
                          this.setState({
                            signUpPopUp: null, 
                            disableSignUp: false
                          });
                        }}
                        aria-label="Click here to close address error pop up"
                        title="Click here to close address error pop up"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )
              });
            }
          }
        );
      });
      // let temp_pw = this.state.password;
      // let temp_email = this.state.email;
      // this.setState({
      //   disableSignUp: true
      // }, () => {
      //   this.props.submitPasswordSignUp_v2(
      //     this.state.email,
      //     this.state.password,
      //     this.state.password_confirm,
      //     this.state.first_name,
      //     this.state.last_name,
      //     this.state.phone,
      //     this.state.address,
      //     this.state.unit,
      //     this.state.city,
      //     this.state.state,
      //     this.state.zip,
      //     () => {
      //       this.props.loginAttempt(temp_email, temp_pw, this.successLogin);
      //       console.log("finish signup function");
      //     }
      //   );
      // });
    }
  }

  handleChange = address => {
    this.setState({address});
  };

  handleSelect = async (value, placeId) => {
    const results = await geocodeByAddress(value);

    const ll = await getLatLng(results[0])
    console.log("(handleSelect) coords: ", ll);

    const [place] = await geocodeByPlaceId(placeId);
    const { long_name: postalCode = '' } =
      place.address_components.find(c => c.types.includes('postal_code')) || {};
    console.log("(handleSelect) postalCode: ",postalCode);

    console.log("(handleSelect) value: ", value);
    let tokens = value.split(', ');
    console.log("(handleSelect) address tokens: ", tokens);

    this.setState({
      address: tokens[0],
      city: tokens[1],
      state: tokens[2],
      zip: postalCode,
      coordinates: ll
    });
  }

  formIsValid = () => {
    console.log("(FIV) state: ", this.state);

    // this.props.email,
    //     this.props.password,
    //     this.props.passwordConfirm,
    //     this.props.firstName,
    //     this.props.lastName,
    //     this.props.phone,
    //     this.state.street_address,
    //     this.props.unit,
    //     this.state.city,
    //     this.state.state,
    //     this.state.zip_code

    if(
      this.state.first_name === '' || 
      this.state.last_name === '' ||
      this.state.email === '' ||
      this.state.phone === '' ||
      this.state.password === '' ||
      this.state.password_confirm === '' ||
      this.state.address === '' ||
      this.state.city === '' ||
      this.state.state === '' ||
      this.state.zip === ''
    ) {
      return false;
    }
    return true;
  }

  render() {
    console.log("(PSU) styling: ", this.props.styling);
    console.log("(PSU) props 2: ", this.props);
    return (
      <div 
        className="model_content"
        style={this.props.styling === null ? ({}) : (
          this.props.styling
        )}
      >
        {this.state.signUpPopUp === null && this.state.disableSignUp === false ? (null) : (
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
            {this.state.signUpPopUp}
          </div>
        )}
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
              // value={this.props.firstName}
              // onChange={(e) => {
              //   this.props.changeNewFirstName(e.target.value);
              // }}
              value={this.state.first_name}
              onChange={(e) => {
                this.setState({
                  first_name: e.target.value
                });
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
              // value={this.props.lastName}
              // onChange={(e) => {
              //   this.props.changeNewLastName(e.target.value);
              // }}
              value={this.state.last_name}
              onChange={(e) => {
                this.setState({
                  last_name: e.target.value
                });
              }}
              aria-label="Input last name"
              title="Input last name"
            ></input>
          </div>

          <input
            className="inputBox"
            placeholder="Email address (for order confirmation)"
            // value={this.props.email}
            // onChange={(e) => {
            //   this.props.changeNewEmail(e.target.value);
            // }}
            value={this.state.email}
            onChange={(e) => {
              this.setState({
                email: e.target.value
              });
            }}
            aria-label="Input email address"
            title="Input email address"
          ></input>

          <input
            className="inputBox"
            placeholder="Create Password"
            type="password"
            // value={this.props.password}
            // onChange={(e) => {
            //   this.props.changeNewPassword(e.target.value);
            // }}
            value={this.state.password}
            onChange={(e) => {
              this.setState({
                password: e.target.value
              });
            }}
            aria-label="Enter password you want to use"
            title="Enter password you want to use"
          ></input>

          <input
            className="inputBox"
            placeholder="Confirm Password"
            type="password"
            // value={this.props.passwordConfirm}
            // onChange={(e) => {
            //   this.props.changeNewPasswordConfirm(e.target.value);
            // }}
            value={this.state.password_confirm}
            onChange={(e) => {
              this.setState({
                password_confirm: e.target.value
              });
            }}
            aria-label="Confirn your password"
            title="Confirn your password"
          ></input>

          <input
            className="inputBox"
            placeholder="Phone Number"
            // value={this.props.phone}
            // onChange={(e) => {
            //   this.props.changeNewPhone(e.target.value);
            // }}
            value={this.state.phone}
            onChange={(e) => {
              this.setState({
                phone: e.target.value
              });
            }}
            aria-label="Enter your phone number"
            title="Enter your phone number"
          ></input>

          {/* <input
            // className={
            //   this.state.street == "" ? "inputBox" : "StreetinputBox"
            // }
            className='inputBox'
            id="ship-address"
            name="ship-address"
            // onChange={(e) => {
            //   this.props.changeNewAddress(e.target.value);
            // }}
            value={this.state.street}
            onChange={(e) => {
              this.setState({
                street: e.target.value
              });
            }}
            // placeholder={
            //   this.state.street == ""
            //     ? "Street Address"
            //     : this.state.street
            // }
            placeholder={"Street Address"}
            aria-label="Enter your street address"
            title="Enter your street address"
          /> */}
          {/* <input
            className={
              this.state.street == "" ? "inputBox" : "StreetinputBox"
            }
            id="ship-address"
            name="ship-address"
            onChange={(e) => {
              this.props.changeNewAddress(e.target.value);
            }}
            placeholder={
              this.state.street == ""
                ? "Street Address"
                : this.state.street
            }
            aria-label="Enter your street address"
            title="Enter your street address"
          /> */}
          {/* <input
            className={
              this.state.street == "" ? "inputBox" : "StreetinputBox"
            }
            id="ship-address"
            name="ship-address"
            onChange={(e) => {
              this.props.changeNewAddress(e.target.value);
            }}
            placeholder={
              this.state.street == ""
                ? "Street Address"
                : this.state.street
            }
            aria-label="Enter your street address"
            title="Enter your street address"
          /> */}
          {/* <Autocomplete
            apiKey={'AIzaSyBLoal-kZlb6tO5aDvkJTFC0a4WMp7oHUM'}
            onPlaceSelected={(place) => {
              console.log("(autocomplete) place: ", place);
            }}
          /> */}
          {console.log("(RPAC) coords: ", this.state.coordinates)}
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div
                style={{
                  // border: '1px dashed'
                  position: 'relative',
                }}
              >
                <input
                  // className='inputBox'
                  // style={{
                  //   border: '1px solid blue'
                  // }}
                  {...getInputProps({
                    placeholder: 'Address',
                    // className: 'location-search-input',
                    className: 'inputBox',
                    style: {
                      marginBottom: '0px',
                      // borderRadius: '15px 15px 0 0'
                    }
                  })}
                />
                <div 
                  // className="autocomplete-dropdown-container"
                  style={{
                    // border: '1px solid #ff8500',
                    // backgroundColor: '#ffba00',
                    width: '428px',
                    // borderRadius: '15px',
                    position: 'absolute',
                    top: '48px'
                  }}
                >
                  {/* {loading && 
                    <div 
                      style={{
                        backgroundColor: '#ccc9c9',
                        border: 'inset',
                        borderWidth: '0px 1px 1px 1px'
                      }}>
                      Loading...
                    </div>}
                  {suggestions.map((suggestion,index) => {
                    const className = suggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item';
                    // inline style for demonstration purpose
                    const style = suggestion.active ? { 
                      backgroundColor: '#ff6505', 
                      color: 'white', 
                      cursor: 'pointer' ,
                      border: 'inset',
                      borderWidth: '0px 1px 1px 1px'
                    } : { 
                      backgroundColor: '#ccc9c9', 
                      cursor: 'pointer',
                      border: 'inset',
                      borderWidth: '0px 1px 1px 1px'
                    };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })} */}
                  {loading ? (
                    <div 
                      style={{
                        backgroundColor: '#f3f3f3',
                        border: 'inset',
                        borderWidth: '0px 1px 1px 1px'
                      }}>
                      Loading...
                    </div>
                  ) : (suggestions.map((suggestion,index) => {
                    const className = suggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item';
                    // inline style for demonstration purpose
                    const style = suggestion.active ? { 
                      backgroundColor: '#ff6505', 
                      color: 'white', 
                      cursor: 'pointer' ,
                      border: 'inset',
                      borderWidth: '0px 1px 1px 1px'
                    } : { 
                      backgroundColor: '#f3f3f3', 
                      cursor: 'pointer',
                      border: 'inset',
                      borderWidth: '0px 1px 1px 1px'
                    };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  }))}
                </div>
              </div>
            )}
          </PlacesAutocomplete>

          <input
            style={{
              width: "208px",
              margin: "6px 12px 0 0",
            }}
            className="inputBox"
            placeholder="Unit"
            // value={this.props.unit}
            // onChange={(e) => {
            //   this.props.changeNewUnit(e.target.value);
            // }}
            value={this.state.unit}
            onChange={(e) => {
              this.setState({
                unit: e.target.value
              });
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
            // value={this.state.city}
            aria-label="Enter your city"
            title="Enter your city"
            // onChange={(e) => {
            //   this.props.changeNewCity(e.target.value);
            // }}
            value={this.state.city}
            onChange={(e) => {
              this.setState({
                city: e.target.value
              });
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
            // value={this.state.state}
            aria-label="Enter your state"
            title="Enter your state"
            // onChange={(e) => {
            //   this.props.changeNewState(e.target.value);
            // }}
            value={this.state.state}
            onChange={(e) => {
              this.setState({
                state: e.target.value
              });
            }}
          />

          <input
            style={{
              width: "208px",
              marginRight: "12px",
            }}
            className="inputBox"
            placeholder="Zip"
            // id="postcode"
            // name="postcode"
            // value={this.state.zip_code}
            aria-label="Enter your zip code"
            title="Enter your zip code"
            // onChange={(e) => {
            //   this.props.changeNewZip(e.target.value);
            // }}
            value={this.state.zip}
            onChange={(e) => {
              this.setState({
                zip: e.target.value
              });
            }}
          />
        </div>

        <div
          style={{
            // border: '1px dashed',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '25px'
          }}
        >
          <button
            // style={{
            //   width: "452px",
            //   height: "71px",
            //   background: " #FF8500 0% 0% no-repeat padding-box",
            //   borderRadius: "14px",
            //   opacity: 1,
            //   marginLeft: "49px",
            //   marginTop: "26px",
            //   border: "none",
            // }}
            className='signUpBtn'
            // onClick={this.wrapperFunction}
            disabled={!this.formIsValid()}
            onClick={this.directSignUp}
          >
            {/* <p
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
            </p> */}
            Sign up
          </button>
        </div>

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
  showSignupPopup: state.login.showSignupPopup
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
  submitPasswordSignUp_v2,
  loginAttempt,
  toggleSignupPopup
};

export default connect(mapStateToProps, functionList)(withRouter(PopSignup));