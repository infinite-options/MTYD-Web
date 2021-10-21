import { Component } from "react";
import axios from "axios";
import Popsignup from "../PopSignup";
import { withRouter } from "react-router-dom";
import styles from "../Home/home.module.css";
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';
import verifyAddressDelivers from "../../utils/VerifyAddressDelivers";
import {
  toggleLoginPopup,
  toggleSignupPopup
} from "../../reducers/actions/loginActions";
import { connect } from "react-redux";

const google = window.google;

export class HomeMap extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.autocomplete = null;
    this.state = {
      lat: "",
      lng: "",
      hooray: false,
      stillGrowing: false,
      signup: false,
      name: "",
      // street_address: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      street: "",
      await_delivery_check: false,
      await_autocomplete_select: false
    };
  }

  handleChange = address => {
    this.setState({address});
  };

  handleSelect = (value, placeId) => {
    this.setState({
      await_autocomplete_select: true
    }, () => {
      this.handleSelect2(value, placeId)
      // const results = await geocodeByAddress(value);

      // const ll = await getLatLng(results[0])
      // console.log("(handleSelect) coords: ", ll);

      // const [place] = await geocodeByPlaceId(placeId);
      // const { long_name: postalCode = '' } =
      //   place.address_components.find(c => c.types.includes('postal_code')) || {};
      // console.log("(handleSelect) postalCode: ",postalCode);

      // console.log("(handleSelect) value: ", value);
      // let tokens = value.split(', ');
      // console.log("(handleSelect) address tokens: ", tokens);

      // this.setState({
      //   // address: tokens[0],
      //   address: value,
      //   city: tokens[1],
      //   state: tokens[2],
      //   zip: postalCode,
      //   coordinates: ll,
      //   await_autocomplete_select: false
      // });
    });
  }

  handleSelect2 = async (value, placeId) => {
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
      // address: tokens[0],
      street: tokens[0],
      address: value,
      city: tokens[1],
      state: tokens[2],
      zip: postalCode,
      coordinates: ll,
      await_autocomplete_select: false
    });
  }

  togglePopLogin = () => {
    this.setState({
      signup: !this.state.signup,
    });
  };

  checkIfDelivers = () => {
    let tokens = this.state.address.split(', ');
    console.log("(CID) tokens: ", tokens);
    this.setState({
      await_delivery_check: true
    }, () => {
      verifyAddressDelivers(
        tokens[0],
        this.state.city,
        this.state.state,
        this.state.zip,
        (latitude, longitude) => {
          if(latitude !== null && longitude !== null){
            this.setState({
              hooray: true,
              await_delivery_check: false
            });
          } else {
            this.setState({
              stillGrowing: true,
              await_delivery_check: false
            });
          }
        }
      );
    });
  }

  render() {
    return (
      <div
        style={{
          display: "block",
          // width: "300px",
          width: '100%',
          // border: '1px solid green',
          // height: "200px",
        }}
      >
        {this.state.hooray ? (
          <div className={styles.hoorayPopUp}>
            <button
              className="close"
              onClick={() => {
                this.setState({ hooray: false });
              }}
              aria-label="close popup"
              title="close popup"
            />

            <div className={styles.hoorayHeader}>
              Hooray!
            </div>

            <div className={styles.hoorayText}>
              Looks like we deliver to your address. Click the button below to
              see the variety of meals we offer.
            </div>

            <button
              className={styles.hoorayBtn}
              onClick={() => {
                this.props.history.push("/select-meal");
              }}
              aria-label="Click here to explore meals"
              title="Click here to explore meals"
            >
              Explore Meals
            </button>

            <button
              className={styles.hoorayBtn2}
              disabled={this.props.loggedIn}
              onClick={() => {
                // this.setState({ signup: true, hooray: false });
                this.setState({ hooray: false });
                console.log("click props: ", this.props);
                // this.props.toggleSignupPopup(!this.props.showSignupPopup);
                this.props.toggleHooraySignup(
                  this.state.street,
                  this.state.city,
                  this.state.state,
                  this.state.zip
                ); 
              }}
              aria-label="Click here to sign up"
              title="Click here to sign up"
            >
              Sign Up
            </button>
          </div>
        ) : null}

        {this.state.stillGrowing ? (
          <div
            className={styles.stillGrowingPopUp}
            // style={{
            //   position: "absolute",
            //   width: "384px",
            //   // height: "371px",
            //   height: '271px',
            //   backgroundColor: "white",
            //   border: "2px solid #F26522",
            //   // left: "65%",
            //   // top: "40%",
            //   // top: '100px',
            //   bottom: '269px',
            //   right: '20px',
            //   zIndex: 100
            // }}
          >
            <div
              style={{
                position: 'relative',
                cursor: 'pointer',
                zIndex: 102
              }}
              className="close"
              onClick={() => {
                this.setState({ stillGrowing: false });
              }}
            />

            <div
              className={styles.stillGrowingHeader}
              // style={{
              //   position: "relative",
              //   top: "29px",
              //   left: "106px",
              //   width: "172px",
              //   height: "31px",
              //   fontSize: "26px",
              //   fontWeight: "bold",
              // }}
            >
              Still Growing
            </div>

            <div
              className={styles.stillGrowingText}
              // style={{
              //   position: "relative",
              //   top: "57px",
              //   left: "27px",
              //   width: "332px",
              //   height: "69px",
              //   fontSize: "18px",
              //   textAlign: "center",
              //   //  fontWeight:'',
              // }}
            >
              {/* Sorry, it looks like we don’t deliver to your neighborhood yet.
              Enter your email address and we will let you know as soon as we
              come to your neighborhood. */}
              Sorry, it looks like we don’t deliver to your neighborhood yet.
            </div>

            {/* <input
              placeholder="Enter your email"
              style={{
                position: "relative",
                top: "140px",
                left: "17px",
                width: "351px",
                height: "40px",
                fontSize: "18px",
                textAlign: "center",
                border: "2px solid #F26522",
                color: "black",
                borderRadius: "15px",
                outline: "none",
              }}
            ></input> */}

            <button
              className={styles.hoorayBtn3}
              style={{
                // position: "relative",
                // top: "153px",
                top:'70px'
                // left: "92px",
                // width: "200px",
                // height: "50px",
                // fontSize: "18px",
                // textAlign: "center",
                // backgroundColor: "#F26522",
                // color: "white",
                // borderRadius: "15px",
                // border: "none",
              }}
              onClick={() => {
                this.setState({ stillGrowing: false });
              }}
            >
              Ok
            </button>
          </div>
        ) : null}
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div
                style={{
                  // border: '1px dashed',
                  // width: '100%',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <input
                  // className='inputBox'
                  // style={{
                  //   border: '1px solid blue'
                  // }}
                  {...getInputProps({
                    placeholder: 'Enter a Location',
                    // className: 'location-search-input',
                    // className: 'inputBox',
                    style: {
                      width: "320px",
                      height: "57px",
                      borderRadius: "10px",
                      fontSize: "25px",
                      // border: "1px solid red",
                      border: 'none',
                      textAlign: "center",
                      color: "black",
                      marginLeft: '20px',
                      marginRight: '20px',
                      // marginLeft: "40px",
                      // marginTop: "-30px",
                      // marginBottom: "15px",
                      borderRadius: "10px",
                    }
                    // style: {
                    //   marginBottom: '0px',
                      // borderRadius: '15px 15px 0 0'
                    // }
                  })}
                />
                <div 
                  // className="autocomplete-dropdown-container"
                  style={{
                    // border: '1px solid #ff8500',
                    // backgroundColor: '#ffba00',
                    width: '320px',
                    // borderRadius: '15px',
                    position: 'absolute',
                    // top: '48px',
                    // marginLeft: "40px",
                    // marginTop: "27px",
                    // marginTop: 
                    top: '57px',
                    // marginBottom: "15px",
                    // borderRadius: "10px",
                  }}
                >
                  
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <button
              className={styles.viewMeals}
              disabled={
                this.state.await_delivery_check ||
                this.state.await_autocomplete_select
              }
              aria-label="Click here to view meals"
              title="Click here to view meals"
              onClick={() => {
                this.checkIfDelivers();
              }}
            >
              View Meals
            </button>
          </div>
      </div>
    );
  }
}

export default withRouter(HomeMap);