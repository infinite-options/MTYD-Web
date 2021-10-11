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

  // componentDidMount() {
    // const input = document.getElementById("pac-input");

    // const options = {
    //   componentRestrictions: { country: "us" },
    // };

    // this.autocomplete = new google.maps.places.Autocomplete(input, options);

    // console.log(autocomplete)
    // console.log(this.autocomplete)

    // this.autocomplete.addListener("place_changed", () => {
    //   let place = this.autocomplete.getPlace();

    //   // console.log(place)
    //   // console.log(place.address_components)

    //   let address1 = "";
    //   let postcode = "";
    //   let city = "";
    //   let state = "";

    //   for (const component of place.address_components) {
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
    //         city = component.long_name;
    //         break;

    //       case "administrative_area_level_1": {
    //         state = component.short_name;
    //         break;
    //       }
    //     }
    //   }

    //   this.setState({
    //     name: place.name,
    //     street_address: address1,
    //     city: city,
    //     state: state,
    //     zip_code: postcode,
    //     lat: place.geometry.location.lat(),
    //     lng: place.geometry.location.lng(),
    //   });

    //   // console.log(this.state)

    //   if (!place.geometry || !place.geometry.location) {
    //     // User entered the name of a Place that was not suggested and
    //     // pressed the Enter key, or the Place Details request failed.
    //     window.alert("No details available for input: '" + place.name + "'");
    //     return;
    //   }

      // axios
      //   .get(
      //     `https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/categoricalOptions/${this.state.lng},${this.state.lat}`
      //   )
      //   .then((res) => {
      //     console.log("(CO) res: ", res);
      //     if (res.data.result.length == 0) {
      //       // alert('cannot deliver to this address')
      //       this.setState({
      //         stillGrowing: true,
      //       });
      //       // console.log("cannot deliver to this address");
      //     } else {
      //       this.setState({
      //         hooray: true,
      //         await_endpoints: false
      //       });
      //       // console.log("we can deliver to this address");
      //     }
      //   })
      //   .catch((err) => {
      //     if (err.response) {
      //       console.log(err.response);
      //     }
      //     console.log(err);
      //   });
    // });
  // }

  // checkIfDelivers = () => {
  //   this.setState({
  //     await_endpoints: true
  //   }, () => {
  //     axios
  //       .get(
  //         `https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/categoricalOptions/${this.state.lng},${this.state.lat}`
  //       )
  //       .then((res) => {
  //         console.log("(CO) res: ", res);
  //         if (res.data.result.length == 0) {
  //           // alert('cannot deliver to this address')
  //           this.setState({
  //             stillGrowing: true,
  //             await_endpoints: false
  //           });
  //           // console.log("cannot deliver to this address");
  //         } else {
  //           this.setState({
  //             hooray: true,
  //             await_endpoints: false
  //           });
  //           // console.log("we can deliver to this address");
  //         }
  //       })
  //       .catch((err) => {
  //         this.setState({
  //           await_endpoints: false
  //         });
  //         if (err.response) {
  //           console.log(err.response);
  //         }
  //         console.log(err);
  //       });
  //   });
  // }

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
          // {/* {true? */}
          <div
            className={styles.hoorayPopUp}
            // style={{
            //   position: "absolute",
            //   width: "384px",
            //   height: "371px",
            //   backgroundColor: "white",
            //   border: "2px solid #F26522",
            //   // top: '100px',
            //   top: '-400px',
            //   right: '20px',
            //   marginLeft: '20px'
            //   // left: "65%",
            //   // top: "40%",
            //   // top: '0px'

            // }}
          >
            <button
              className="close"
              onClick={() => {
                this.setState({ hooray: false });
              }}
              aria-label="close popup"
              title="close popup"
            />

            <div
              className={styles.hoorayHeader}
              // style={{
              //   position: "relative",
              //   top: "29px",
              //   left: "144px",
              //   width: "96px",
              //   height: "31px",
              //   fontSize: "26px",
              //   fontWeight: "bold",
              // }}
            >
              Hooray!
            </div>

            <div
              className={styles.hoorayText}
              // style={{
              //   position: "relative",
              //   top: "57px",
              //   left: "27px",
              //   width: "330px",
              //   height: "69px",
              //   fontSize: "18px",
              //   textAlign: "center",
              //   //  fontWeight:'',
              // }}
            >
              Looks like we deliver to your address. Click the button below to
              see the variety of meals we offer.
            </div>

            <button
              className={styles.hoorayBtn}
              // style={{
                // position: "relative",
                // top: "0px",
                // left: "92px",
                // width: "200px",
                // height: "50px",
                // fontSize: "18px",
                // textAlign: "center",
                // backgroundColor: "#F26522",
                // color: "white",
                // paddingTop: "10px",
                // borderRadius: "15px",
                //  fontWeight:'',
              // }}
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
                this.props.toggleSignupPopup(!this.props.showSignupPopup);
              }}
              aria-label="Click here to sign up"
              title="Click here to sign up"
            >
              Sign up
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

        {/* <div id="pac-container"> */}
          {/* <input
            // id="pac-input"
            type="text"
            placeholder="Enter a Location"
            style={{
              width: "320px",
              height: "57px",
              borderRadius: "10px",
              fontSize: "25px",
              // border: "1px solid",
              border: 'none',
              textAlign: "center",
              color: "black",
              marginLeft: "40px",
              marginTop: "-30px",
              marginBottom: "15px",
              borderRadius: "10px",
            }}
          /> */}
          {/* <div
            style={{
              width: '100%',
              dispaly: 'flex',
              justifyContent: 'center',
              border: '1px solid lime'
            }}
          > */}
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
          {/* </div> */}

          <div
            style={{
              // border: '1px dashed',
              // width: '100%',
              // position: 'relative',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
          <button
            // style={{
            //   width: "320px",
            //   height: "57px",
            //   borderRadius: "10px",
            //   fontSize: "25px",
            //   border: "none",
            //   textAlign: "center",
            //   color: "white",
            //   marginLeft: "40px",
            //   marginBottom: "15px",
            //   borderRadius: "10px",
            //   backgroundColor: "#ff6505",
            // }}
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
            {/* <a
              href="/select-meal"
              style={{
                color: "white",
                marginLeft: "95px",
                textAlign: "center",
                border: '1px solid'
              }}
              tabIndex="-1"
            >
              View Meals
            </a> */}
            View Meals
          </button>
          </div>
        {/* </div> */}

        {/* {this.state.signup ? (
          <Popsignup
            toggle={this.togglePopLogin}
            messageFromHooray={true}
            nameFromHooray={this.state.name}
            // streetAddressFromHooray={this.state.street_address}
            streetAddressFromHooray={this.state.address}
            cityFromHooray={this.state.city}
            stateFromHooray={this.state.state}
            zipCodeFromHooray={this.state.zip_code}
            styling={{
              top: '100px', 
              position: 'relative'
              // zIndex: '10000'
              // border: '1px solid green'
            }}
          />
        ) : null} */}
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({
//   showSignupPopup: state.login.showSignupPopup
// });

// const functionList = {
//   toggleSignupPopup
// };

export default withRouter(HomeMap);
// export default connect(mapStateToProps, functionList)(withRouter(HomeMap));