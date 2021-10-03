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
    };

    this.autocomplete = null;
    // this.handlePlaceSelect = this.handlePlaceSelect.bind(this)
  }

  togglePopLogin = () => {
    window.scrollTo(0, 0);
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
    window.scrollTo(0, 0);
    this.setState({
      signUpSeen: !this.state.signUpSeen,
    });

    if (!this.state.signUpSeen) {
      this.setState({
        login_seen: false,
      });
    }
  };

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

  render() {
    return (
      <div
        style={{
          // border: '1px dashed',
          width: '100%',
          // maxWidth: '100%'
          // max
          // maxWidth: 'calc(100vw - 15px)',
          position: 'relative'
        }}
      >
        <div
          style={{
            zIndex: "99",
            position: "absolute",
            // width: 'calc(100vw - 15px)',
            width: '100%'
            // maxWidth: '100%'
            // width: "100vw",
            // border: '1px solid cyan'
          }}
        >
          <WebNavBar />
        </div>
        {/* <WebNavBar/> */}
        {/* <div>
        <WebNavBar/>
      </div> */}
        <div
          style={{
            position: "absolute",
            right: "10px",
            top: "0px",
            zIndex: "1100",
            // border: '1px solid cyan'
          }}
        >
          {this.state.login_seen ? (
            <PopLogin toggle={this.togglePopLogin} toggle_signup={this.togglePopSignup}/>
          ) : null}
          {this.state.signUpSeen ? (
            <PopSignup 
              toggle={this.togglePopSignup} 
              // styling={{
              //   top: '100px', 
              //   border: '1px solid green'
              // }}
            />
          ) : null}
        </div>

        <div className={styles.topBackground}>
          <div className={styles.gridDisplayRight}>
            <SocialLogin verticalFormat={true} />
            <img
              className={styles.gridRightIcons}
              src={goToImg}
              onClick={this.togglePopLogin}
            />
          </div>

          {/* <div className =  {styles.whiteStripe}>		  
          <div className = {styles.gridDisplayCenter}>
            <div className = {styles.centerSubtitleText}>
              <img className = {styles.centerImage} src = {Logo} alt="logo" />
            </div>
            <div
            style={{
              zIndex:'3'
            }}>
              <HomeMap/>
            </div>

          </div>
        </div>	 */}

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              // border: '1px solid blue'
            }}
          >
            <div className={styles.whiteStripe}>
              <div className={styles.gridDisplayCenter}>
                <div className={styles.centerSubtitleText}>
                  <img className={styles.centerImage} src={Logo} alt="logo" />
                </div>
                <div
                  style={{
                    zIndex: "3",
                    opacity: "1",
                    // border: '1px solid red'
                  }}
                >
                  <HomeMap 
                    toggleSignupPopup={this.props.toggleSignupPopup}
                    showSignupPopup={this.props.showSignupPopup}
                  />
                </div>
              </div>
            </div>
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

        <div 
          className={styles.sectionHeader}
          style={{
            marginTop: '100px'
          }}
        >
          How does&nbsp;
          <span
            style={{
              color: "white",
            }}
          >
            MealsFor.Me
          </span>
          &nbsp;work?
        </div>

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
                  {/* <img
                    src={howItWorksDiagram}
                    width="100%"
                    float="left"
                  ></img> */}
                  <HowItWorks />
                </div>
                {/* <div className={styles.stepsContainer}>
                  <img className = {styles.stepsImage} src = {exploreImg} ></img>
                  <div className = {styles.stepsHeaderForHowDoesSection} onClick={() => this.goToLink('select-meal')}>
                      <h6 className = {styles.stepsTextForExplore}><h6 className={styles.stepsNumber}>
                        1. Explore</h6><br/><br/>
                        Let your pallete be your guide. Explore the different cuisines (we have three!) and dishes available.
                      </h6>
                        
                    <img className = {styles.pathFromExploreToPickAPlan} src = {pathFromExploreToPickAPlan}></img>
                        
                  </div>
                </div>
                <div className={styles.stepsContainer}>
                        <div className = {styles.stepsHeaderForHowDoesSection}>
                        </div>
                </div>                
                      
                <div className={styles.stepsContainer} style = {{marginLeft:'-230px', marginTop:'-50px'}}>
                        <div className = {styles.stepsHeaderForHowDoesSection} styles= {{marginLeft:'-300px'}} onClick={() => this.goToLink('choose-plan')} style = {{marginTop:'200px'}}>

                      <h6 className = {styles.stepsText}><h6 className={styles.stepsNumber}>2. Purchase</h6><br/><br/>
                                  Purchase a Meal Plan. Pre-pay with PayPal or Stripe. Get discounts if you purchase 2 or 4 weeks in advance.</h6>
                              
                      <img className = {styles.stepsImageForPurchase} src = {purchaseImg}></img></div> 
                      <img className = {styles.pathFromPurchaseToChoose} src = {pathFromPurchaseToChoose}></img>
                        
                </div>
                <div className={styles.stepsContainer} >
                      <div className = {styles.stepsHeaderForHowDoesSection}>
                    <h6 className = {styles.stepsText}>
                              <h6 className={styles.stepsNumber}>3. Choose</h6><br/><br/>
                            Choose the meals you want to receive each delivery up to 4 weeks in advance.</h6>          
                              <img className = {styles.stepsImageForChoose} src = {chooseImg}></img>
                      <img className = {styles.pathFromSelectMealsToEnjoy} src = {pathFromSelectMealsToEnjoy}></img></div>
                </div>
                <div className={styles.stepsContainer}>
                        <div className = {styles.stepsHeaderForHowDoesSection}>
                        </div>
                </div>

                <div className={styles.stepsContainer}>
                        <div className = {styles.stepsHeaderForHowDoesSection}>
                        </div>
                </div>
                      
                <div className={styles.stepsContainer}>
                  <div className = {styles.stepsHeaderForHowDoesSection} style = {{marginLeft: '-350px',marginTop:'180px'}}>
                      <h6 className = {styles.stepsText}>					
                        <h6 className={styles.stepsNumber}>4. Enjoy</h6>
                        <br/><br/>
                        Heat, enjoy, and stay healthy!
                      </h6>
                      <img className = {styles.stepsImageForEnjoy} src = {enjoyImg} aria-label="Click to get started" title="Click to get started"></img>
                    </div>
                </div> */}
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
                {/* <div className = {styles.stepsHeader} onClick={() => this.goToLink('select-meal')}>
                  <img className = {styles.stepsImage} src = {exploreImg}></img>
                  <div style = {{justifyContent: 'center', display: 'inline-flex'}}>
                  <view className={styles.stepsNumber}>1</view>
                    <h6 className = {styles.stepsTitleNarrow}>Explore</h6>
                  </div>
                  <h6 className = {styles.stepsTextNarrow}>Let your pallete be your guide. Explore the different cuisines (we have three!) and dishes available.</h6>
                </div>
                <div className = {styles.stepsHeader} onClick={() => this.goToLink('choose-plan')}>
                  <img className = {styles.stepsImage} src = {purchaseImg}></img>
                  <div style = {{justifyContent: 'center', display: 'inline-flex'}}>
                  <view className={styles.stepsNumber}>2</view>
                    <h6 className = {styles.stepsTitle}>Purchase</h6>
                  </div>
                  <h6 className = {styles.stepsTextNarrow}>Purchase a Meal Plan. Pre-pay with PayPal or Stripe. Get discounts if you purchase 2 or 4 weeks in advance.</h6>
                </div>
                <div className = {styles.stepsHeader}>
                  <img className = {styles.stepsImage} src = {chooseImg}></img>
                  <div style = {{justifyContent: 'center', display: 'inline-flex'}}>
                  <view className={styles.stepsNumber}>3</view>
                    <h6 className = {styles.stepsTitle}>Choose</h6>
                  </div>
                  <h6 className = {styles.stepsTextNarrow}>Choose the meals you want to receive each delivery up to 4 weeks in advance.</h6>
                </div>
                <div className = {styles.stepsHeader}>
                  <img className = {styles.stepsImage} src = {enjoyImg}></img>
                  <div style = {{justifyContent: 'center', display: 'inline-flex'}}>
                  <view className={styles.stepsNumber}>4</view>
                    <h6 className = {styles.stepsTitle}>Enjoy</h6>
                  </div>
                  <h6 className = {styles.stepsTextNarrow}>Heat, enjoy, and stay healthy!</h6>
                </div> */}
              </div>
            );
          }
        })()}

        {/* <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            fontWeight: "bold",
            width: "100%",
          }}
        >
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
            onClick={this.togglePopSignup}
          >
            Signup
          </button>
        </div> */}
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
            // style={{
            //   backgroundColor: "white",
            //   color: "#F26522",
            //   border: "2px solid #F26522",
            //   padding: "15px",
            //   borderRadius: "15px",
            //   width: "300px",
            //   fontSize: "24px",
            // }}
            onClick={this.togglePopSignup}
          >
            Sign Up
          </button>
        </div>

        {(() => {
          if (this.state.windowWidth >= 800) {
            return (
              <>
                {/* <div class={styles.howDoesContainer}>
                  <div class={styles.howDoesText}>
                    <p
                      style={{
                        marginLeft: "-90px",
                        display: "inline",
                        color: "black",
                      }}
                    >
                      Our Partners Chefs and Restaurants
                    </p>
                  </div>
                </div> */}
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
                    marginTop: '100px'
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
                }}
              >
                <div className={styles.stepsHeader}>
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
          } else {
            return (
              <div
                style={{
                  display: "inline-block",
                  width: "100%",
                  marginTop: "30px",
                }}
              >
                <div className={styles.stepsHeader}>
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
            width: "100%", 
            // border: '1px dashed',
            padding: "40px" 
          }}
        >
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
      </div>
    );
  }
}

// export default Home;
const mapStateToProps = (state) => ({
  showSignupPopup: state.login.showSignupPopup
});

const functionList = {
  toggleSignupPopup
};

// export default withRouter(HomeMap);
export default connect(mapStateToProps, functionList)(withRouter(Home));
