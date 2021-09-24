import { Component } from "react";
import axios from "axios";
import Popsignup from "../PopSignup";
import { withRouter } from "react-router-dom";
import styles from "../Home/home.module.css";

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
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
    };
  }

  togglePopLogin = () => {
    this.setState({
      signup: !this.state.signup,
    });
  };

  componentDidMount() {
    const input = document.getElementById("pac-input");

    const options = {
      componentRestrictions: { country: "us" },
    };

    this.autocomplete = new google.maps.places.Autocomplete(input, options);

    // console.log(autocomplete)
    // console.log(this.autocomplete)

    this.autocomplete.addListener("place_changed", () => {
      let place = this.autocomplete.getPlace();

      // console.log(place)
      // console.log(place.address_components)

      let address1 = "";
      let postcode = "";
      let city = "";
      let state = "";

      for (const component of place.address_components) {
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
            city = component.long_name;
            break;

          case "administrative_area_level_1": {
            state = component.short_name;
            break;
          }
        }
      }

      this.setState({
        name: place.name,
        street_address: address1,
        city: city,
        state: state,
        zip_code: postcode,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });

      // console.log(this.state)

      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      axios
        .get(
          `https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/categoricalOptions/${this.state.lng},${this.state.lat}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.result.length == 0) {
            // alert('cannot deliver to this address')
            this.setState({
              stillGrowing: true,
            });
            console.log("cannot deliver to this address");
          } else {
            this.setState({
              hooray: true,
            });
            console.log("we can deliver to this address");
          }
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          }
          console.log(err);
        });
    });
  }

  render() {
    return (
      <div
        style={{
          display: "block",
          width: "300px",
          height: "200px",
        }}
      >
        {this.state.hooray ? (
          // {/* {true? */}
          <div
            style={{
              position: "absolute",
              width: "384px",
              height: "371px",
              backgroundColor: "white",
              border: "2px solid #F26522",
              left: "65%",
              top: "40%",
            }}
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
              style={{
                position: "relative",
                top: "29px",
                left: "144px",
                width: "96px",
                height: "31px",
                fontSize: "26px",
                fontWeight: "bold",
              }}
            >
              Hooray!
            </div>

            <div
              style={{
                position: "relative",
                top: "57px",
                left: "27px",
                width: "330px",
                height: "69px",
                fontSize: "18px",
                textAlign: "center",
                //  fontWeight:'',
              }}
            >
              Looks like we deliver to your address. Click the button below to
              see the variety of meals we offer.
            </div>

            <button
              style={{
                position: "relative",
                top: "100px",
                left: "92px",
                width: "200px",
                height: "50px",
                fontSize: "18px",
                textAlign: "center",
                backgroundColor: "#F26522",
                color: "white",
                paddingTop: "10px",
                borderRadius: "15px",
                //  fontWeight:'',
              }}
              onClick={() => {
                this.props.history.push("/select-meal");
              }}
              aria-label="Click here to explore meals"
              title="Click here to explore meals"
            >
              Explore Meals
            </button>

            <button
              style={{
                position: "relative",
                top: "113px",
                left: "92px",
                width: "200px",
                height: "50px",
                fontSize: "18px",
                textAlign: "center",
                backgroundColor: "#F26522",
                color: "white",
                paddingTop: "10px",
                borderRadius: "15px",
                //  fontWeight:'',
              }}
              onClick={() => {
                this.setState({ signup: true, hooray: false });
                console.log(this.state);
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
            // {true?<div
            style={{
              position: "absolute",
              width: "384px",
              height: "371px",
              backgroundColor: "white",
              border: "2px solid #F26522",
              left: "65%",
              top: "40%",
            }}
          >
            <div
              className="close"
              onClick={() => {
                this.setState({ stillGrowing: false });
              }}
            />

            <div
              style={{
                position: "relative",
                top: "29px",
                left: "106px",
                width: "172px",
                height: "31px",
                fontSize: "26px",
                fontWeight: "bold",
              }}
            >
              Still Growing
            </div>

            <div
              style={{
                position: "relative",
                top: "57px",
                left: "27px",
                width: "332px",
                height: "69px",
                fontSize: "18px",
                textAlign: "center",
                //  fontWeight:'',
              }}
            >
              Sorry, it looks like we don’t deliver to your neighborhood yet.
              Enter your email address and we will let you know as soon as we
              come to your neighborhood.
            </div>

            <input
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
            ></input>

            <button
              style={{
                position: "relative",
                top: "153px",
                left: "92px",
                width: "200px",
                height: "50px",
                fontSize: "18px",
                textAlign: "center",
                backgroundColor: "#F26522",
                color: "white",
                borderRadius: "15px",
                border: "none",
              }}
            >
              Okay
            </button>
          </div>
        ) : null}

        <div id="pac-container">
          <input
            id="pac-input"
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
          />

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
            aria-label="Click here to view meals"
            title="Click here to view meals"
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

        {this.state.signup ? (
          <Popsignup
            toggle={this.togglePopLogin}
            messageFromHooray={true}
            nameFromHooray={this.state.name}
            streetAddressFromHooray={this.state.street_address}
            cityFromHooray={this.state.city}
            stateFromHooray={this.state.state}
            zipCodeFromHooray={this.state.zip_code}
          />
        ) : null}
      </div>
    );
  }
}

export default withRouter(HomeMap);
