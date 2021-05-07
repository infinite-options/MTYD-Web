/*
*
*/
import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {WebNavBar} from "../NavBar";
import SignUp from "./signUp"
import {HomeLink, FootLink, AmbassadorLink, AddressLink,AddMeals} from "./homeButtons"
import Menu from "../Menu";
import MenuCarousel from "./menuCarousel"
import styles from "./home.module.css"
import Logo from "../../images/LOGO_NoBG_MealsForMe.png";
import exploreImg from "./images/explore.svg"
import purchaseImg from "./images/purchase.svg"
import chooseImg from "./images/choose.svg"
import enjoyImg from "./images/enjoy.svg"
import inchins from "./images/inchins.png"
import ponoHawaiian from "./images/PONOHAWAIIAN_LOGO.png"
import nityaAyurveda from "./images/Nitya_Ayurveda Clear_Logo.png"
import facebookImg from "../../images/facebook.svg"
import googleImg from "../../images/google-plus.svg"
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import PopLogin from '../PopLogin';
import Popsignup from '../PopSignup';
import EnterZipCodeImg from "../../images/Group 161.png"
import getStartedImg from "../../images/Group 133.png"
import viewMealsImg from "../../images/Group 163.png"
import appleImg from "../../images/Group 172.svg"
import facebookImgSmall from "../../images/Group 173.svg"
import googleImgSmall from "../../images/Group 174.svg"
import goToImg from "../../images/Group 369.svg"
import pathFromExploreToPickAPlan from "../../images/Path 17.svg"
import pathFromSelectMealsToEnjoy from "../../images/Path 51.svg"
import startServingNowImg from "../../images/Group 182.png"
import pathFromPurchaseToChoose from "../../images/Path 50.svg"
import howDoesImage from "../../images/howDoesImage.png"
import axios from 'axios';
import ProductDisplay from './ProductDisplay';
import HomeMap from "../HomeAddressSearch";
import SocialLogin from "../Landing/socialLogin"
const google = window.google;


class Home extends Component {   

  constructor(props){
    super(props);
    this.state = { 
      signUpDisplay: styles.signUpLink,
      windowHeight: undefined,
      windowWidth: undefined,
      login_seen:false,
      signUpSeen:false,
    }

    this.autocomplete = null
    // this.handlePlaceSelect = this.handlePlaceSelect.bind(this)

  }

  togglePopLogin = () => {
    this.setState({
     login_seen: !this.state.login_seen,
    });

    if(!this.state.login_seen){
      this.setState({
        signUpSeen:false
      })
    }

   };

   togglePopSignup = () => {
    this.setState({
     signUpSeen: !this.state.signUpSeen
    });

    if(!this.state.signUpSeen){
      this.setState({
        login_seen:false
      })
    }
   };

  handleResize = () => this.setState({
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  });

  componentDidMount() {
    // console.log("Home page props: " + JSON.stringify(this.props));
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('ship-address'),{
      componentRestrictions: { country: ["us", "ca"] },
    })

    autocomplete.addListener("place_changed", ()=>{
      const place = autocomplete.getPlace();
      console.log(place)
    })

    console.log(autocomplete)

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.handleResize);
  // }

  goToLink(navlink){
    console.log("LINK CLICKED");
    this.props.history.push(navlink);
  }

  handlePlaceSelect() {

    console.log('here')

    let address1Field = document.querySelector("#ship-address");

    let addressObject = this.autocomplete.getPlace()
    console.log(addressObject.address_components);

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

    axios.get(`https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/categoricalOptions/${addressObject.geometry.location.lat()},${addressObject.geometry.location.lng()}`)
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




  render() { 
    return (
      <>
      <div>
        <WebNavBar/>
      </div>
      {/* <AddMeals /> */}
      
      {(() => {
        if (this.state.windowWidth >= 800) {
          return (
          <div className = {styles.topBackground}>
            <div className = {styles.gridDisplayRight}>

              <SocialLogin verticalFormat={true}/>
            </div>	
            <div className =  {styles.whiteStripe}>		  
              <div className = {styles.gridDisplayCenter}>
                <div className = {styles.centerSubtitleText}>
                  <img className = {styles.centerImage} src = {Logo} alt="logo" />
                </div>
                <div
                style={{
                  zIndex:'100'
                }}>
                  <HomeMap/>
                </div>

              </div>
            </div>		  
          </div>
          );
        } else {
          return (
          <div className = {styles.topBackground}>
              <div className = {styles.gridDisplayRight}>
                <img className = {styles.gridRightIcons} src = {appleImg}/> 
                <img className = {styles.gridRightIcons} src = {facebookImgSmall}/> 
                <img className = {styles.gridRightIcons} src = {googleImgSmall}/> 
                <img className = {styles.gridRightIcons} src = {goToImg}/> 
              </div>
            <div className =  {styles.whiteStripe}>		  
              <div className = {styles.gridDisplayCenter}>
                <div className = {styles.centerSubtitleText}>
                  <img className = {styles.centerImage} src = {Logo} alt="logo" />
                </div>
              {/* <img className = {styles.buttonsBelowTheLogo} src = {EnterZipCodeImg}/> */}
              <img className = {styles.buttonsBelowTheLogo} src = {viewMealsImg}/> 
              <div style = {{display: 'inline-flex', justifyContent: 'space-between'}}/>
                
              </div>
            </div>		  
          </div>		  
          );
        }
      })()}
        
        {(() => {
          if (this.state.windowWidth >= 800) {
            return (
        <div style = {{display: 'inline-flex', width: '100%', marginTop: '37px'}}>
          <h3 style = {{textAlign: 'left', fontWeight: 'bold', marginLeft: '5%', fontSize: '24px', height: '29px'}}><u>Explore</u> meals</h3>
        </div>
            );
          } else {
            return (
        <div style = {{display: 'inline-flex', width: '100%', marginTop: '20px', justifyContent: 'center'}}>
          <h3 style = {{fontWeight: 'bold'}}>Explore Meals</h3>
        </div>
            );
          }
        })()}
		
        <div style = {{width: '100%', marginTop: '25px'}}>
			    <ProductDisplay />         
        </div>

		<div class = {styles.howDoesContainer}>
            <div class = {styles.howDoesText}>
			    <p style = {{marginLeft: '-90px', display:'inline', color: 'black'}}>How does<p style = {{marginLeft: '-78px', display:'inline', color: 'white'}}> MealFor.Me
				<p style = {{marginLeft: '-78px', display:'inline', color:'black'}}> work?</p></p></p>
			</div>
		</div>
		
        <div>
		  <br/>
		  <br/>

        </div>
        {(() => {
          if (this.state.windowWidth >= 800) {
            return (
			<div style = {{display: 'inline-flex', marginTop: '30px', justifyContent: 'center', alignSelf: 'center', width:'100%'}}>
				  <div className={styles.stepsContainer}>
                    <img className = {styles.stepsImage} src = {exploreImg}></img>
                  <div className = {styles.stepsHeaderForHowDoesSection} onClick={() => this.goToLink('select-meal')}>
                      <h6 className = {styles.stepsTextForExplore}><h6 className={styles.stepsNumber}>
                      1. Explore</h6><br/><br/>
                  Let your pallete be your guide. Explore the different cuisines (we have three!) and dishes available.</h6>
                    
				    <img className = {styles.pathFromExploreToPickAPlan} src = {pathFromExploreToPickAPlan}></img>
                    
                  </div>
                </div>
				  <div className={styles.stepsContainer}>
                  <div className = {styles.stepsHeaderForHowDoesSection}>
                  </div>
                </div>                
                {
				  <div className={styles.stepsContainer} style = {{marginLeft:'-230px', marginTop:'-50px'}}>
                  <div className = {styles.stepsHeaderForHowDoesSection} styles= {{marginLeft:'-300px'}} onClick={() => this.goToLink('choose-plan')} style = {{marginTop:'200px'}}>

					<h6 className = {styles.stepsText}><h6 className={styles.stepsNumber}>2. Purchase</h6><br/><br/>
                      Purchase a Meal Plan. Pre-pay with PayPal or Stripe. Get discounts if you purchase 2 or 4 weeks in advance.</h6>
                   
					<img className = {styles.stepsImageForPurchase} src = {purchaseImg}></img></div> 
					<img className = {styles.pathFromPurchaseToChoose} src = {pathFromPurchaseToChoose}></img>
                  
                </div>}
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
                {
				  <div className={styles.stepsContainer}>
                  <div className = {styles.stepsHeaderForHowDoesSection} style = {{marginLeft: '-350px',marginTop:'180px'}}>
                    <h6 className = {styles.stepsText}>					
                    <h6 className={styles.stepsNumber}>4. Enjoy</h6><br/><br/>
					      Heat, enjoy, and stay healthy!</h6>
                    <img className = {styles.stepsImageForEnjoy} src = {enjoyImg}></img></div>
				<div>
				</div>
                </div>}
              </div>			  
            );
          /*} else if (this.state.windowWidth >= 800) {
            return (
              <div style = {{display: 'inline-flex', width: '100%', marginTop: '30px'}}>
                <div className = {styles.stepsHeader} onClick={() => this.goToLink('select-meal')}>
                  <img className = {styles.stepsImage} src = {exploreImg}></img>
                  <div style = {{justifyContent: 'center', display: 'inline-flex'}}>
                    <h6 className = {styles.stepsNumberNarrow}>1</h6>
                    <h6 className = {styles.stepsTitle}>Explore</h6>
                  </div>
                  <h6 className = {styles.stepsTextMid}>Let your pallete be your guide. Explore the different cuisines (we have three!) and dishes available.</h6>
                </div>
                <div className = {styles.stepsHeader} onClick={() => this.goToLink('choose-plan')}>
                  <img className = {styles.stepsImage} src = {purchaseImg}></img>
                  <div style = {{justifyContent: 'center', display: 'inline-flex'}}>
                    <h6 className = {styles.stepsNumberNarrow}>2</h6>
                    <h6 className = {styles.stepsTitle}>Purchase</h6>
                  </div>
                  <h6 className = {styles.stepsTextMid}>Purchase a Meal Plan. Pre-pay with PayPal or Stripe. Get discounts if you purchase 2 or 4 weeks in advance.</h6>
                </div>
                <div className = {styles.stepsHeader}>
                  <img className = {styles.stepsImage} src = {chooseImg}></img>
                  <div style = {{justifyContent: 'center', display: 'inline-flex'}}>
                    <h6 className = {styles.stepsNumberNarrow}>3</h6>
                    <h6 className = {styles.stepsTitle}>Choose</h6>
                  </div>
                  <h6 className = {styles.stepsTextMid}>Choose the meals you want to receive each delivery up to 4 weeks in advance.</h6>
                </div>
                <div className = {styles.stepsHeader}>
                  <img className = {styles.stepsImage} src = {enjoyImg}></img>
                  <div style = {{justifyContent: 'center', display: 'inline-flex'}}>
                    <h6 className = {styles.stepsNumberNarrow}>4</h6>
                    <h6 className = {styles.stepsTitle}>Enjoy</h6>
                  </div>
                  <h6 className = {styles.stepsTextMid}>Heat, enjoy, and stay healthy!</h6>
                </div>
              </div>
            );*/
          } else {
            return (
              <div style = {{display: 'inline-block', width: '100%', marginTop: '30px'}}>
                <div className = {styles.stepsHeader} onClick={() => this.goToLink('select-meal')}>
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
                </div>
              </div>
            );
          }
        })()}
        
        {/*<div style = {{display: 'inline-flex', width: '100%', marginTop: '20px'}}>
          <h3 style = {{textAlign: 'left', marginTop: '50px', fontWeight: 'bold', marginLeft: '5%'}}>UPCOMING MENU</h3>
        </div>*/}
        <div style = {{textAlign: 'center', marginTop: '50px', fontWeight: 'bold'}}>

        <HomeLink text = {getStartedImg} link = "/select-meal" style = {{height: '50px', width:'320px', marginBottom: '-30px', marginTop: '-10px'}}/>
		<img />
        </div>
        {(() => {
          if (this.state.windowWidth >= 800) {
            return (
              <>
		        <div class = {styles.howDoesContainer}>
                    <div class = {styles.howDoesText}>
			        <p style = {{marginLeft: '-90px', display:'inline', color: 'black'}}>Our Partners Chefs and Restaurants</p>
			        </div>
		           </div>
                <div style = {{display: 'inline-flex'}}>
                  <div style = {{display: 'flex',flexWrap: 'wrap', width: '120%', marginTop: '50px', marginLeft: '200px'}}>
                    <div className = {styles.partnerContainer}>
                      <img className = {styles.partnerImage} src = {ponoHawaiian}></img>
                    </div>
                  </div>
                  <div style = {{display: 'flex',flexWrap: 'wrap', width: '120%', marginTop: '50px'}}>
                    <div className = {styles.partnerContainer}>
                      <img className = {styles.partnerImage} src = {nityaAyurveda}></img>
                    </div>
                  </div>
                </div>
              </>
            );
          } else {
            return (
              <>
		        <div class = {styles.howDoesContainer}>
                  <div class = {styles.howDoesText}>
			      <h1 style = {{display:'inline'}}>Our Partner Chefs & Restaurants</h1>
			    </div>
		        </div>

                <div style = {{display: 'inline-block'}}>
                  <div style = {{display: 'flex', width: '100%', marginTop: '20px', justifyContent: 'center'}}>
                    <img className = {styles.partnerImageNarrow} src = {ponoHawaiian}></img>
                  </div>
                  <div style = {{display: 'flex', width: '100%', marginTop: '20px', justifyContent: 'center'}}>
                    <img className = {styles.partnerImageNarrow} src = {nityaAyurveda}></img>
                  </div>
                </div> 
              </>
            );
          }
        })()}
        
        <div>
		  <div class = {styles.howDoesContainer}>
              <div class = {styles.howDoesText}>
	          <p style = {{marginLeft: '-90px',display:'inline', color: 'black'}}>Why try MealFor.Me?</p>
    	  </div>
		  </div>
       </div>
        {(() => {
          if (this.state.windowWidth >= 800) {
            return (
                <div style = {{display: 'inline-flex', width: '100%', marginTop: '30px'}}>				              
                <div className = {styles.stepsHeader}>
                  <h6 className = {styles.stepsTitle2}>Who has time?</h6>
                  <h6 className = {styles.stepsText2}>Save time and money! Ready to heat meal come to your doors and you can order 10 deliveries in advance so you know what's coming and don't have to think about it again.</h6>
                </div>
                <div className = {styles.stepsHeader}>
                  <h6 className = {styles.stepsTitle2}>Food when you're hungry</h6>
                  <h6 className = {styles.stepsText2}>If you order food when you're hungry, you're starving by the time it arrives! With MealsFor.Me there is always something in the fridge and your next meals are en route!</h6>
                </div>
                <div className = {styles.stepsHeader}>
                  <h6 className = {styles.stepsTitle2}>Better value</h6>
                  <h6 className = {styles.stepsText2}>You get resturant quality food at a fraction of the cost; plus, it is made from the highest quality ingredients by exceptional chefs.</h6>
                </div>
                </div>
            );
          } else {
            return (
              <div style = {{display: 'inline-block', width: '100%', marginTop: '30px'}}>
                <div className = {styles.stepsHeader}>
                  <h6 className = {styles.stepsTitle2}>Who has time?</h6>
                  <h6 className = {styles.stepsText2}>Save time and money! Ready to heat meal come to your doors and you can order up to 10 deliveries in advance so you know what's coming!</h6>
                </div>
                <div className = {styles.stepsHeader}>
                  <h6 className = {styles.stepsTitle2}>Food when you're hungry</h6>
                  <h6 className = {styles.stepsText2}>If you order food when you're hungry, you're starving by the time it arrives! With MealsFor.Me there is always something in the fridge and your next meals are en route!</h6>
                </div>
                <div className = {styles.stepsHeader}>
                  <h6 className = {styles.stepsTitle2}>Better value</h6>
                  <h6 className = {styles.stepsText2}>You get resturant quality food at a fraction of the cost; plus, it is made from the highest quality ingredients by exceptional chefs.</h6>
                </div>
              </div>
            );
          }
        })()}
        
		<div style = {{textAlign: 'center', marginTop: '30px', marginBottom: '50px',fontWeight: 'bold'}}>
             <HomeLink text = {startServingNowImg} link = "/choose-plan" style = {{height:'68px', width:'432px', marginTop:'77.66px', marginLeft:'auto'}}/>			
        </div>
        
      {/*<span>
        {this.state.windowWidth} x {this.state.windowHeight}
      </span>*/}

        {(() => {
          if (this.state.windowWidth >= 800) {
            return (
			<FootLink/>			
            );
          } else {
            return (
			<FootLink/>			
            );
          }
        })()}
        
    </>
    );
  }
}
 
export default Home;