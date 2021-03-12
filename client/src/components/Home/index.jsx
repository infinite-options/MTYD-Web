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
import nityaAyurveda from "./images/Nitya_Ayurveda Clear_Logo.png"
import facebookImg from "../../images/facebook.svg"
import googleImg from "../../images/google-plus.svg"
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

class Home extends Component {   
  state = { 
    signUpDisplay: styles.signUpLink,
    windowHeight: undefined,
    windowWidth: undefined
  }

  handleResize = () => this.setState({
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  });

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
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
          <h3 style = {{textAlign: 'left', marginTop: '100px', fontWeight: 'bold', marginLeft: '5%'}}>UPCOMING MENU</h3>
        </div>

        <div style = {{width: '100%', marginTop: '50px'}}>
          <MenuCarousel/>
        </div>

        <div style = {{display: 'inline-flex', width: '100%', marginTop: '50px'}}>
          <h3 style = {{textAlign: 'left', marginTop: '100px', fontWeight: 'bold', marginLeft: '5%'}}>OUR PARTNER CHEFS & RESTAURANTS</h3>
        </div>
        <div style = {{display: 'inline-flex'}}>
          <div style = {{display: 'flex',flexWrap: 'wrap', width: '100%', marginTop: '50px'}}>
            <div className = {styles.partnerContainer}>
              <img className = {styles.partnerImage} src = {ponoHawaiian}></img>
            </div>
          </div>
          <div style = {{display: 'flex',flexWrap: 'wrap', width: '100%', marginTop: '50px'}}>
            <div className = {styles.partnerContainer}>
              <img className = {styles.partnerImage} src = {nityaAyurveda}></img>
            </div>
          </div>
        </div>
        
        <div>
          <h3 style = {{textAlign: 'center', marginTop: '100px', fontWeight: 'bold'}}>WHY TRY MEALSFOR.ME</h3>
        </div>
        {/*<div style = {{display: 'inline-flex', width: '100%', marginTop: '30px'}}>
          <div className = {styles.stepsContainer2}>
            <h6 className = {styles.stepsTitle2}>Who has time?</h6>
            <h6 className = {styles.stepsText}>Save time and money! Ready to heat meal come to your doors and you can order up to 10 deliveries in advance so you know what's coming!</h6>
          </div>
          <div className = {styles.stepsContainer2}>
            <h6 className = {styles.stepsTitle2}>Food when you're hungry</h6>
            <h6 className = {styles.stepsText}>If you order food when you're hungry, you're starving by the time it arrives! With MealsFor.Me there is always something in the fridge and your next meals are en route!</h6>
          </div>
          <div className = {styles.stepsContainer2}>
            <h6 className = {styles.stepsTitle2}>Better value</h6>
            <h6 className = {styles.stepsText}>You get resturant quality food at a fraction of the cost; plus, it is made from the highest quality ingredients by exceptional chefs.</h6>
          </div>
        </div>*/}
        
        {(() => {
          if (this.state.windowWidth >= 800) {
            return (
              <div style = {{display: 'inline-flex', width: '100%', marginTop: '30px'}}>
                <div className = {styles.stepsContainer2}>
                  <h6 className = {styles.stepsTitle2}>Who has time?</h6>
                  <h6 className = {styles.stepsText2}>Save time and money! Ready to heat meal come to your doors and you can order up to 10 deliveries in advance so you know what's coming!</h6>
                </div>
                <div className = {styles.stepsContainer2}>
                  <h6 className = {styles.stepsTitle2}>Food when you're hungry</h6>
                  <h6 className = {styles.stepsText2}>If you order food when you're hungry, you're starving by the time it arrives! With MealsFor.Me there is always something in the fridge and your next meals are en route!</h6>
                </div>
                <div className = {styles.stepsContainer2}>
                  <h6 className = {styles.stepsTitle2}>Better value</h6>
                  <h6 className = {styles.stepsText2}>You get resturant quality food at a fraction of the cost; plus, it is made from the highest quality ingredients by exceptional chefs.</h6>
                </div>
              </div>
            );
          } else {
            return (
              <div style = {{display: 'inline-block', width: '100%', marginTop: '30px'}}>
                <div className = {styles.stepsContainer2}>
                  <h6 className = {styles.stepsTitle2}>Who has time?</h6>
                  <h6 className = {styles.stepsText2}>Save time and money! Ready to heat meal come to your doors and you can order up to 10 deliveries in advance so you know what's coming!</h6>
                </div>
                <div className = {styles.stepsContainer2}>
                  <h6 className = {styles.stepsTitle2}>Food when you're hungry</h6>
                  <h6 className = {styles.stepsText2}>If you order food when you're hungry, you're starving by the time it arrives! With MealsFor.Me there is always something in the fridge and your next meals are en route!</h6>
                </div>
                <div className = {styles.stepsContainer2}>
                  <h6 className = {styles.stepsTitle2}>Better value</h6>
                  <h6 className = {styles.stepsText2}>You get resturant quality food at a fraction of the cost; plus, it is made from the highest quality ingredients by exceptional chefs.</h6>
                </div>
              </div>
            );
          }
        })()}
        
        <div>
          <h3 style = {{textAlign: 'center', marginTop: '50px', fontWeight: 'bold'}}>READY TO START?</h3>
        </div>
        <div className = {styles.gridDisplayCenter}>
          <div style = {{display: 'inline-flex', margin: 'auto'}}>
            <div style = {{marginLeft: '50px', marginRight: '50px', marginBottom: '80px'}}>
              <HomeLink text = "Explore Subscriptions" link = '/choose-plan'/>
            </div>
            <div style = {{marginLeft: '50px', marginRight: '50px', marginBottom: '80px'}}>
              <HomeLink text = "Enter Your Address" link = '/home'/>
            </div>
          </div>
        </div>
        
            {/*(() => {
            if (this.state.windowWidth >= 700) {
              return (
                <div style = {{marginLeft: '50px', marginRight: '50px', marginBottom: '80px'}}>
              <HomeLink text = "KILL PEOPLE" link = '/home'/>
            </div>
              );
            } else {
                return (
                <div style = {{marginLeft: '50px', marginRight: '50px', marginBottom: '80px'}}>
              <HomeLink text = "DON'T KILL PEOPLE" link = '/home'/>
            </div>
                    );
            }
          })()*/}
        
      {/* START: Info Section */}
        {/*<Box className={classes.title}>What We Do</Box>
      <Box mx="auto" className={classes.bar} />
      <Box 
      // display="flex"
        className="info-container"
      >
        <Box className={classes.infoSection} id="mobileInfoSection">
          <Box className={classes.infoImg}>
            <img src="./landing/vegetables_info.png" alt="vegetables info" />
          </Box>
          <div className={classes.infoTitle}>Farm to doorstep</div>
          <div className={classes.infoDesc}>
            We bring fresh produce from local farms right to our consumers'
            doorstep. It's a farmer's market experience at your fingertips
          </div>
        </Box>
        <Box className={classes.infoSection} id="mobileInfoSection">
          <Box className={classes.infoImg}>
            <img src="./landing/farmer_info.png" alt="farmer info" />
          </Box>
          <div className={classes.infoTitle}>Help local farmers</div>
          <div className={classes.infoDesc}>
            Helping farmers continue their businesses in the post pandemic
            world. Serving Fresh brings their produce to your doorstep in the
            safest way possible.
          </div>
        </Box>
        <Box className={classes.infoSection} id="mobileInfoSection">
          <Box className={classes.infoImg}>
            <img src="./landing/student_info.png" alt="student info" />
          </Box>
          <div className={classes.infoTitle}>Empower students</div>
          <div className={classes.infoDesc}>
            We help students gain real world experience by working with us on
            developing Serving Fresh.
          </div>
        </Box>
      </Box>*/}
      {/* END: Info Section */}
        
      <span>
        {this.state.windowWidth} x {this.state.windowHeight}
      </span>
        
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
            <img src = {facebookImg} style = {{marginTop: '25px', height: '75px', width: '75px'}}/>
            <img src = {googleImg} style = {{marginLeft: '25px', marginTop: '25px', height: '75px', width: '75px'}}/>
          </div>
        </div>
        
    </>
    );
  }
}
 
export default Home;