import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {WebNavBar} from "../NavBar";
import SignUp from "./signUp"
import Menu from "../Menu";
import MenuCarousel from "./menuCarousel"
import styles from "./home.module.css"
import Logo from "../../images/LOGO_NoBG_MealsForMe.png";
import exploreImg from "./images/explore.svg"
import purchaseImg from "./images/purchase.svg"
import chooseImg from "./images/choose.svg"
import enjoyImg from "./images/enjoy.svg"
import inchins from "./images/inchins.png"
import oliveGarden from "./images/oliveGarden.png"
import paradiseBay from "./images/paradiseBay.png"

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
            {/* <a className = {this.state.signUpDisplay} onClick = {this.changeCSS}>Get Started</a> */}
            <SignUp />

            <div className = {styles.gridDisplayCenter}>
              <h3 style = {{textAlign: 'center', marginTop: '100px', fontWeight: 'bold', color: 'white'}}>HOW IT WORKS</h3>
              <p style = {{color: '#979797', fontSize: '18px', width: '600px', textAlign: 'center', marginTop: '10px', marginBottom: '0',color: 'white'}}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p style = {{color: 'black', fontSize: '18px', width: '600px', textAlign: 'center', marginTop: '0', fontWeight: 'bold', color: 'white'}}>
                Explore -> Pay -> Choose -> Enjoy
              </p>
          </div>
          </div>
        </div>
        {/* <div className = {styles.gridDisplayCenter}>
          <h3 style = {{textAlign: 'center', marginTop: '100px', fontWeight: 'bold'}}>HOW IT WORKS</h3>
          <p style = {{color: '#979797', fontSize: '15px', width: '600px', textAlign: 'center', marginTop: '10px', marginBottom: '0'}}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p style = {{color: 'black', fontSize: '15px', width: '600px', textAlign: 'center', marginTop: '0', fontWeight: 'bold'}}>
            Explore -> Pay -> Choose -> Enjoy
          </p>
        </div> */}
        <div style = {{display: 'inline-flex', width: '100%', marginTop: '100px'}}>
          <div className = {styles.stepsContainer}>
            <img className = {styles.stepsImage} src = {exploreImg}></img>
           <div>
             <h6 className = {styles.stepsNumber}>1</h6>
             <h6 className = {styles.stepsTitle}>Explore</h6>
           </div>
           <h6 className = {styles.stepsText}>tempor incididunt ut labore et dolore magna aliqua.</h6>
          </div>
          <div className = {styles.stepsContainer}>
          <img className = {styles.stepsImage} src = {purchaseImg}></img>
           <div>
             <h6 className = {styles.stepsNumber}>2</h6>
             <h6 className = {styles.stepsTitle}>Purchase</h6>
           </div>
           <h6 className = {styles.stepsText}>tempor incididunt ut labore et dolore magna aliqua.</h6>
          </div>
          <div className = {styles.stepsContainer}>
          <img className = {styles.stepsImage} src = {chooseImg}></img>
           <div>
             <h6 className = {styles.stepsNumber}>3</h6>
             <h6 className = {styles.stepsTitle}>Choose</h6>
           </div>
           <h6 className = {styles.stepsText}>tempor incididunt ut labore et dolore magna aliqua.</h6>
          </div>
          <div className = {styles.stepsContainer}>
          <img className = {styles.stepsImage} src = {enjoyImg}></img>
           <div>
             <h6 className = {styles.stepsNumber}>4</h6>
             <h6 className = {styles.stepsTitle}>Enjoy</h6>
           </div>
           <h6 className = {styles.stepsText}>tempor incididunt ut labore et dolore magna aliqua.</h6>
          </div>
        </div>
        <div style = {{display: 'inline-flex', width: '100%', marginTop: '50px'}}>
          <h3 style = {{textAlign: 'left', marginTop: '100px', fontWeight: 'bold', marginLeft: '5%'}}>ENJOY SPECIAL DISCOUNTS</h3>
        </div>
        <div style = {{display: 'flex',flexWrap: 'wrap', width: '100%', marginTop: '50px', padding: '0 50px'}}>

        {/* replace images with the coupons later*/}
        <div className = {styles.couponContainer}>
          <img className = {styles.couponImage} src = {enjoyImg}></img>
           <h6 className = {styles.couponText}>Select 2 weeks Pre-Pay Option & Get 10% off</h6>
          </div>
          <div className = {styles.couponContainer}>
          <img className = {styles.couponImage} src = {enjoyImg}></img>
           <h6 className = {styles.couponText}>Select 4 weeks Pre-Pay Option & Get 15% off</h6>
          </div>
        </div>

        <div style = {{display: 'inline-flex', width: '100%', marginTop: '50px'}}>
          <h3 style = {{textAlign: 'left', marginTop: '100px', fontWeight: 'bold', marginLeft: '5%'}}>OUR PARTNER CHEFS & RESTAURANTS</h3>
        </div>
        <div style = {{display: 'flex',flexWrap: 'wrap', width: '100%', marginTop: '50px', padding: '0 50px'}}>
          <div className = {styles.partnerContainer}>
           <img className = {styles.partnerImage} src = {inchins}></img>
          </div>
          <div className = {styles.partnerContainer}>
            <img className = {styles.partnerImage} src = {oliveGarden}></img>
          </div>
          <div className = {styles.partnerContainer}>
           <img className = {styles.partnerImage} src = {paradiseBay}></img>
          </div>
        </div>
      
        <div style = {{display: 'inline-flex', width: '100%', marginTop: '50px'}}>
          <h3 style = {{textAlign: 'left', marginTop: '100px', fontWeight: 'bold', marginLeft: '5%'}}>THIS WEEK’S MENU</h3>
        </div>

        <div style = {{width: '100%', marginTop: '50px'}}>
          <MenuCarousel/>
            
        </div>
    </>
      );
  }
}
 
export default Home;