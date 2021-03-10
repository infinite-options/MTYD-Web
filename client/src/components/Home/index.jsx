import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {WebNavBar} from "../NavBar";
import SignUp from "./signUp"
import {HomeLink, FootLink, AmbassadorLink} from "./homeButtons"
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
import facebookImg from "../../images/facebook.svg"
import googleImg from "../../images/google-plus.svg"

class Home extends Component {
  state = { 
    signUpDisplay: styles.signUpLink,
   }
   
  
  render() { 
    return (
      <>
      {/* <Menu show={false} /> */}
        <div className = {styles.topBackground}>
          <WebNavBar />
          <div className = {styles.gridDisplayCenter}>
            <h1 className = {styles.centerSubtitleText}>WELCOME TO <img style = {{height: '140px', width: '400px', marginTop: '-50px'}} src = {Logo} alt="logo" /></h1>
            <h3 className = {styles.centerSubText}>Get the freshly cooked meal options for your healthy lifestyle</h3>
            <div style = {{display: 'inline-flex', justifyContent: 'space-between'}}>
              <HomeLink text = "Explore Meals" link = '/select-meal'/>
              <HomeLink text = "Explore Subscriptions" link = '/choose-plan'/>
              <HomeLink text = "Explore Delivery Options" link = '/choose-plan'/>
            </div>
          </div>
        </div>
        
        <div>
          <h3 style = {{textAlign: 'center', marginTop: '15px', fontWeight: 'bold'}}>HOW IT WORKS</h3>
          <p style = {{color: '#979797', fontSize: '18px', textAlign: 'center', marginTop: '10px'}}>
                Explore meals and cuisines. Choose a meal plan that is right for you.
              </p>
        </div>
        <div style = {{display: 'inline-flex', width: '100%', marginTop: '30px'}}>
          <div className = {styles.stepsContainer}>
            <img className = {styles.stepsImage} src = {exploreImg}></img>
           <div>
             <h6 className = {styles.stepsNumber}>1</h6>
             <h6 className = {styles.stepsTitle}>Explore</h6>
           </div>
           <h6 className = {styles.stepsText}>Let your pallete be your guide. Explore the different cuisines (we have three!) and dishes available.</h6>
          </div>
          <div className = {styles.stepsContainer}>
          <img className = {styles.stepsImage} src = {purchaseImg}></img>
           <div>
             <h6 className = {styles.stepsNumber}>2</h6>
             <h6 className = {styles.stepsTitle}>Purchase</h6>
           </div>
           <h6 className = {styles.stepsText}>Purchase a Meal Plan. Pre-pay with PayPal or Stripe. Get discounts if you purchase 2 or 4 weeks in advance.</h6>
          </div>
          <div className = {styles.stepsContainer}>
          <img className = {styles.stepsImage} src = {chooseImg}></img>
           <div>
             <h6 className = {styles.stepsNumber}>3</h6>
             <h6 className = {styles.stepsTitle}>Choose</h6>
           </div>
           <h6 className = {styles.stepsText}>Choose the meals you want to receive each delivery up to 4 weeks in advance.</h6>
          </div>
          <div className = {styles.stepsContainer}>
          <img className = {styles.stepsImage} src = {enjoyImg}></img>
           <div>
             <h6 className = {styles.stepsNumber}>4</h6>
             <h6 className = {styles.stepsTitle}>Enjoy</h6>
           </div>
           <h6 className = {styles.stepsText}>Heat, enjoy, and stay healthy!</h6>
          </div>
        </div>
        
        <div style = {{display: 'inline-flex', width: '100%', marginTop: '50px'}}>
          <h3 style = {{textAlign: 'left', marginTop: '100px', fontWeight: 'bold', marginLeft: '5%'}}>THIS WEEK’S MENU</h3>
        </div>

        <div style = {{width: '100%', marginTop: '50px'}}>
          <MenuCarousel/>
        </div>

        <div style = {{display: 'inline-flex', width: '100%', marginTop: '50px'}}>
          <h3 style = {{textAlign: 'left', marginTop: '100px', fontWeight: 'bold', marginLeft: '5%'}}>OUR PARTNER CHEFS & RESTAURANTS</h3>
        </div>
        <div style = {{display: 'flex',flexWrap: 'wrap', width: '100%', marginTop: '50px', padding: '0 50px'}}>
          <div className = {styles.partnerContainer}>
           <img className = {styles.partnerImage} src = {ponoHawaiian}></img>
          </div>
        </div>
        
        <div>
          <h3 style = {{textAlign: 'center', marginTop: '100px', fontWeight: 'bold'}}>WHY TRY MEALSFOR.ME</h3>
        </div>
        <div style = {{display: 'inline-flex', width: '100%', marginTop: '30px'}}>
          <div className = {styles.stepsContainer}>
           <div>
             <h6 className = {styles.stepsNumber}>1</h6>
             <h6 className = {styles.stepsTitle}>Who has time?</h6>
           </div>
           <h6 className = {styles.stepsText}>Save time and money! Ready to heat meal come to your doors and you can order up to 10 deliveries in advance so you know what's coming!</h6>
          </div>
          <div className = {styles.stepsContainer}>
           <div>
             <h6 className = {styles.stepsNumber}>2</h6>
             <h6 className = {styles.stepsTitle}>Food when you're hungry</h6>
           </div>
           <h6 className = {styles.stepsText}>If you order food when you're hungry, you're starving by the time it arrives! With MealsFor.Me there is always something in the fridge and your next meals are en route!</h6>
          </div>
          <div className = {styles.stepsContainer}>
           <div>
             <h6 className = {styles.stepsNumber}>3</h6>
             <h6 className = {styles.stepsTitle}>Better value</h6>
           </div>
           <h6 className = {styles.stepsText}>You get resturant quality food at a fraction of the cost; plus, it is made from the highest quality ingredients by exceptional chefs.</h6>
          </div>
        </div>
        
        <div>
          <h3 style = {{textAlign: 'center', marginTop: '100px', fontWeight: 'bold'}}>READY TO START?</h3>
        </div>
        <div className = {styles.gridDisplayCenter}>
          <div style = {{display: 'inline-flex', margin: 'auto'}}>
            <div style = {{marginLeft: '50px', marginRight: '50px', marginBottom: '50px'}}>
              <HomeLink text = "Explore Subscriptions" link = '/choose-plan'/>
            </div>
            <div style = {{marginLeft: '50px', marginRight: '50px', marginBottom: '50px'}}>
              <HomeLink text = "Enter Your Address" link = '/home'/>
            </div>
          </div>
        </div>
        
        <div className = {styles.footerBackground}>
          <img className = {styles.footerLogo} src = {Logo} alt="logo" />
          <div className = {styles.footerLinks}>
            <div>
              <FootLink text = "Buy a Gift Card" link = '/home'/>
            </div>
            <div>
              <FootLink text = "Join our Crew" link = '/home'/>
            </div>
            <div>
              <FootLink text = "Contact Us" link = '/home'/>
            </div>
          </div>
          <div className = {styles.footerRight}>
            <AmbassadorLink text = "Become an Ambassador"  link = '/home'/>
            <img src = {facebookImg} style = {{marginTop: '50px', height: '100px', width: '100px'}}/>
            <img src = {googleImg} style = {{marginLeft: '25px', marginTop: '50px', height: '100px', width: '100px'}}/>
          </div>
        </div>
        
    </>
    );
  }
}
 
export default Home;