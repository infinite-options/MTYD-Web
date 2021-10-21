import { Component } from "react";
import { WebNavBar } from "../NavBar";
import { HomeLink, FootLink } from "./homeButtons";
import styles from "./home.module.css";
import Logo from "../../images/LOGO_NoBG_MealsForMe.png";
import ponoHawaiian from "../../images/PONOHAWAIIAN_LOGO.png";
import nityaAyurveda from "../../images/Nitya_Ayurveda Clear_Logo.png";
import PopLogin from "../PopLogin";
import getStartedImg from "../../images/Group 133.png";
import goToImg from "../../images/Group 369.svg";
import startServingNowImg from "../../images/Group 182.png";
import howItWorksDiagram from "../../images/howitworksdiagram.png";
import { ReactComponent as HowItWorks } from "../../images/howItWorksDiagramSVG.svg";
import mobileGraphic from "../../images/mobilegraphic.png";
import axios from "axios";
import ProductDisplay from "./ProductDisplay";
import HomeMap from "../HomeAddressSearch";
import SocialLogin from "../Landing/socialLogin";
import PopSignup from "../PopSignup";
import {
  toggleLoginPopup,
  toggleSignupPopup
} from "../../reducers/actions/loginActions";
import { connect } from "react-redux";
import { Route, withRouter } from "react-router-dom";

const google = window.google;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signUpDisplay: styles.signUpLink,
      windowHeight: undefined,
      windowWidth: undefined,
      login_seen: false,
      signUpSeen: false,
      address_horray: null,
      city_hooray: null,
      state_hooray: null,
      zip_hooray: null
    };

    this.autocomplete = null;
    // this.handlePlaceSelect = this.handlePlaceSelect.bind(this)
  }

  togglePopLogin = () => {
    // window.scrollTo(0, 0);
    // this.setState({
    //   login_seen: !this.state.login_seen,
    // });

    // if (!this.state.login_seen) {
    //   this.setState({
    //     signUpSeen: false,
    //   });
    // }
    this.props.toggleLoginPopup(!this.props.showLoginPopup);
  };

  togglePopSignup = () => {
    // window.scrollTo(0, 0);
    // this.setState({
    //   signUpSeen: !this.state.signUpSeen,
    // });

    // if (!this.state.signUpSeen) {
    //   this.setState({
    //     login_seen: false,
    //   });
    // }
    this.props.toggleSignupPopup(!this.props.showSignupPopup);
  };

  toggleHooraySignup = (addr, city, state, zip) => {
    this.setState({
      address_horray: addr,
      city_hooray: city,
      state_hooray: state,
      zip_hooray: zip
    }, () => {
      this.props.toggleSignupPopup(!this.props.showSignupPopup);
    });
  }

  handleResize = () =>
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });

  componentDidMount() {
    // console.log("Home page props: " + JSON.stringify(this.props));
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("ship-address"),
      {
        componentRestrictions: { country: ["us", "ca"] },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      // console.log(place);
    });

    // console.log(autocomplete);

    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }

  goToLink(navlink) {
    // console.log("LINK CLICKED");
    this.props.history.push(navlink);
  }

  handlePlaceSelect() {
    // console.log("here");

    let address1Field = document.querySelector("#ship-address");

    let addressObject = this.autocomplete.getPlace();
    // console.log(addressObject.address_components);

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

    // console.log(address1);
    // console.log(postcode);

    this.setState({
      name: addressObject.name,
      street_address: address1,
      city: city,
      state: state,
      zip_code: postcode,
      lat: addressObject.geometry.location.lat(),
      lng: addressObject.geometry.location.lng(),
    });

    axios
      .get(
        `https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/categoricalOptions/${addressObject.geometry.location.lat()},${addressObject.geometry.location.lng()}`
      )
      .then((res) => {
        console.log(res);
        if (res.data.result.length == 0) {
          alert("cannot deliver to this address");
          // console.log("cannot deliver to this address");
        } else {
          // console.log("we can deliver to this address");
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
    // console.log(this.state);
  }

  loggedIn = () => {
    console.log("in loggedIn");
    let is_logged_in = this.props.userInfo.customerId !== "";
    console.log("is logged in? ", is_logged_in);
    return is_logged_in;
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          position: 'relative'
        }}
      >
        <div
          style={{
            zIndex: "99",
            position: "absolute",
            width: '100%'
          }}
        >
          <WebNavBar 
            streetAddressFromHooray={this.state.address_horray}
            cityFromHooray={this.state.city_hooray}
            stateFromHooray={this.state.state_hooray}
            zipCodeFromHooray={this.state.zip_hooray}
          />
        </div>

        <div className={styles.topBackground}>

            <SocialLogin 
              verticalFormat={true} 
              toggleLoginPopup={this.props.toggleLoginPopup}
            />
            <img
              className={styles.gridRightIcons}
              style={this.loggedIn() ? ({
                opacity: '0',
                cursor: 'default'
              }) : ({})}
              src={goToImg}
              onClick={this.togglePopLogin}
            />
          
          <div
            className={styles.banner}
          >
            <img className={styles.centerImage} src={Logo} alt="logo" />
          </div>

          <div
            className={styles.viewMealsWrapper}
          >
            <HomeMap 
              toggleSignupPopup={this.props.toggleSignupPopup}
              toggleHooraySignup={this.toggleHooraySignup}
              showSignupPopup={this.props.showSignupPopup}
              loggedIn={this.loggedIn()}
            />
          </div>


        </div>

        {(() => {
          if (this.state.windowWidth >= 800) {
            return (
              <div
                style={{
                  display: "inline-flex",
                  width: "100%",
                  marginTop: "37px",
                }}
              >
                <h3
                  style={{
                    textAlign: "left",
                    fontWeight: "bold",
                    marginLeft: "5%",
                    fontSize: "24px",
                    height: "29px",
                  }}
                >
                  <u>Explore</u> Meals
                </h3>
              </div>
            );
          } else {
            return (
              <div
                style={{
                  display: "inline-flex",
                  width: "100%",
                  marginTop: "20px",
                  justifyContent: "center",
                }}
              >
                <h3 style={{ fontWeight: "bold" }}>Explore Meals</h3>
              </div>
            );
          }
        })()}

        <div 
          style={{ 
            width: "100%", 
            // position: 'relative',
            height: '272px',
            // maxWidth: 'calc(100vw - 15px)',
            marginTop: "25px", 
            // border: '1px dashed' 
          }}
        >
          <ProductDisplay />
        </div>

        {/* <div class={styles.howDoesContainer}> */}
          {/* <div class={styles.howDoesText}>
            <p
              style={{ marginLeft: "-90px", display: "inline", color: "black" }}
            >
              How does
              <p
                style={{
                  marginLeft: "-78px",
                  display: "inline",
                  color: "white",
                }}
              >
                {" "}
                MealsFor.Me
                <p
                  style={{
                    marginLeft: "-78px",
                    display: "inline",
                    color: "black",
                  }}
                >
                  {" "}
                  work?
                </p>
              </p>
            </p>
          </div> */}
        {/* </div> */}

        {this.state.windowWidth >= 400 ? (
          <div 
            className={styles.sectionHeader}
            style={{
              marginTop: '100px',
              whiteSpace: 'pre-wrap'
            }}
          >
            <span>How does&nbsp;</span>
            <span
              style={{
                color: "white",
              }}
            >
              MealsFor.Me
            </span>
            <span>&nbsp;work?</span>
          </div>
        ) : (
          <div 
            className={styles.sectionHeader}
            style={{
              marginTop: '100px',
              // whiteSpace: 'pre-wrap'
              display: 'inline-block',
              height: '82px'
            }}
          >
            <span>How does</span>
            <br/>
            <span
              style={{
                color: "white",
              }}
            >
              MealsFor.Me
            </span>
            <br/>
            <span>work?</span>
          </div>
        )}
        {/* <div 
          className={styles.sectionHeader}
          style={{
            marginTop: '100px',
            whiteSpace: 'pre-wrap'
          }}
        >
          <span>How does&#32;</span>
          <span
            style={{
              color: "white",
            }}
          >
            MealsFor.Me
          </span>
          <span>&#32;work?</span>
        </div> */}

        <div>
          <br />
          <br />
        </div>

        {(() => {
          if (this.state.windowWidth >= 900) {
            return (
              <div
                style={{
                  display: "inline-flex",
                  marginTop: "30px",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <HowItWorks />
                </div>
                
              </div>
            );
          } else {
            return (
              <div
                style={{
                  display: "inline-block",
                  width: "100%",
                  marginTop: "30px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <img src={mobileGraphic} width="100%" float="left"></img>
                </div>
                
              </div>
            );
          }
        })()}

        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          <button
            className={styles.whiteBtn}
            onClick={this.togglePopSignup}
          >
            Sign Up
          </button>
        </div>

        {(() => {
          if (this.state.windowWidth >= 800) {
            return (
              <>
                <div 
                  className={styles.sectionHeader}
                  style={{
                    marginTop: '100px'
                  }}
                >
                  Our Partners Chefs and Restaurants
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    marginTop: "50px",
                    padding: "0px 163px 20px",
                  }}
                >
                  <div className={styles.partnerContainer}>
                    <img
                      className={styles.partnerImage}
                      src={ponoHawaiian}
                    ></img>
                  </div>

                  <div className={styles.partnerContainer}>
                    <img
                      className={styles.partnerImage}
                      src={nityaAyurveda}
                    ></img>
                  </div>
                </div>
              </>
            );
          } else {
            return (
              <>
                {/* <div class={styles.howDoesContainer}>
                  <div class={styles.howDoesText}>
                    <h1 style={{ display: "inline" }}>
                      Our Partner Chefs & Restaurants
                    </h1>
                  </div>
                </div> */}
                <div 
                  className={styles.sectionHeader}
                  style={{
                    marginTop: '100px',

                    // justifyContent: 'center',
                    // padding: '0',
                    // textAlign: 'center'
                  }}
                >
                  Our Partners Chefs and Restaurants
                </div>

                <div style={{ display: "inline-block" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      marginTop: "20px",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      className={styles.partnerImageNarrow}
                      src={ponoHawaiian}
                      aria-label="Pono Hawaiian"
                      title="Pono Hawaiian"
                    ></img>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      marginTop: "20px",
                      justifyContent: "center",
                    }}
                    role="img"
                    aria-label="Nitya Ayurveda"
                    title="Nitya Ayurveda"
                  >
                    <img
                      className={styles.partnerImageNarrow}
                      src={nityaAyurveda}
                      aria-label="Nitya Ayurveda"
                      title="Nitya Ayurveda"
                    ></img>
                  </div>
                </div>
              </>
            );
          }
        })()}

        {/* <div> */}
          {/* <div class={styles.howDoesContainer}>
            <div class={styles.howDoesText}>
              <p
                style={{
                  marginLeft: "-90px",
                  display: "inline",
                  color: "black",
                }}
              >
                Why try MealsFor.Me?
              </p>
            </div>
          </div> */}
        {/* </div> */}
        <div 
          className={styles.sectionHeader}
          style={{
            marginTop: '50px'
          }}
        >
          Why Try MealsFor.Me?
        </div>

        {(() => {
          if (this.state.windowWidth >= 800) {
            return (
              <div
                style={{
                  display: "inline-flex",
                  width: "100%",
                  marginTop: "30px",
                  // border: '1px dashed'
                }}
              >
                <div 
                  className={styles.stepsHeader}
                  style={{
                    marginLeft: '40px'
                  }}
                >
                  <h6 className={styles.stepsTitle2}>Who has time?</h6>
                  <h6 className={styles.stepsText2}>
                    Save time and money! Ready to heat meal come to your doors
                    and you can order 10 deliveries in advance so you know
                    what's coming and don't have to think about it again.
                  </h6>
                </div>
                <div className={styles.stepsHeader}>
                  <h6 className={styles.stepsTitle2}>
                    Food when you're hungry
                  </h6>
                  <h6 className={styles.stepsText2}>
                    If you order food when you're hungry, you're starving by the
                    time it arrives! With MealsFor.Me there is always something
                    in the fridge and your next meals are en route!
                  </h6>
                </div>
                <div 
                  className={styles.stepsHeader}
                  style={{
                    marginRight: '40px'
                  }}
                >
                  <h6 className={styles.stepsTitle2}>Better value</h6>
                  <h6 className={styles.stepsText2}>
                    You get resturant quality food at a fraction of the cost;
                    plus, it is made from the highest quality ingredients by
                    exceptional chefs.
                  </h6>
                </div>
              </div>
            );
          } else {
            return (
              <div
                style={{
                  display: "inline-block",
                  width: "100%",
                  marginTop: "30px",
                }}
              >
                <div 
                  className={styles.stepsHeader}
                  style={{
                    marginTop: '0'
                  }}
                >
                  <h6 className={styles.stepsTitle2}>Who has time?</h6>
                  <h6 className={styles.stepsText2}>
                    Save time and money! Ready to heat meal come to your doors
                    and you can order up to 10 deliveries in advance so you know
                    what's coming!
                  </h6>
                </div>
                <div className={styles.stepsHeader}>
                  <h6 className={styles.stepsTitle2}>
                    Food when you're hungry
                  </h6>
                  <h6 className={styles.stepsText2}>
                    If you order food when you're hungry, you're starving by the
                    time it arrives! With MealsFor.Me there is always something
                    in the fridge and your next meals are en route!
                  </h6>
                </div>
                <div className={styles.stepsHeader}>
                  <h6 className={styles.stepsTitle2}>Better value</h6>
                  <h6 className={styles.stepsText2}>
                    You get resturant quality food at a fraction of the cost;
                    plus, it is made from the highest quality ingredients by
                    exceptional chefs.
                  </h6>
                </div>
              </div>
            );
          }
        })()}

        {/* <div style={{ textAlign: "center", width: "100%", padding: "40px" }}>
          <button
            style={{
              backgroundColor: "white",
              color: "#F26522",
              border: "2px solid #F26522",
              padding: "15px",
              borderRadius: "15px",
              width: "20%",
              fontSize: "24px",
            }}
            onClick={() => {
              window.location.href = "/choose-plan";
            }}
          >
            Get Started
          </button>
        </div> */}

        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            fontWeight: "bold",
            width: "100%",
            // border: '1px solid red',
            marginBottom: '40px'
          }}
        >
        {/* <div 
          style={{ 
            textAlign: "center", 
            width: "100%", 
            // border: '1px dashed',
            padding: "40px" 
          }}
        > */}
          <button
            className={styles.whiteBtn}
            // style={{
            //   backgroundColor: "white",
            //   color: "#F26522",
            //   border: "2px solid #F26522",
            //   padding: "15px",
            //   borderRadius: "15px",
            //   width: "300px",
            //   // width: '20%',
            //   fontSize: "24px",
            // }}
            onClick={() => {
              window.location.href = "/choose-plan";
            }}
          >
            Get Started
          </button>
        </div>

        <FootLink />
        {/* <FootLink 
          toggleLoginPopup={this.props.toggleLoginPopup}
          toggleSignupPopup={this.props.toggleSignupPopup}
        /> */}
      </div>
    );
  }
}

// export default Home;
const mapStateToProps = (state) => ({
  showSignupPopup: state.login.showSignupPopup,
  showLoginPopup: state.login.showLoginPopup,
  userInfo: state.login.userInfo,
});

const functionList = {
  toggleSignupPopup,
  toggleLoginPopup
};

// export default withRouter(HomeMap);
export default connect(mapStateToProps, functionList)(withRouter(Home));