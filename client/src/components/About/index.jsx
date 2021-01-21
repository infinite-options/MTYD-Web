import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {WebNavBar} from "../NavBar";
import Menu from "../Menu";
import styles from "./about.module.css"
import oliveGLogo from "./oliveGarden.png"
import paradiseBayLogo from "./paradiseBay.png"

class About extends Component {
  state = {  }
  render() { 
    return ( 
      <>
      <div className = {styles.top}>
        <WebNavBar />
        <div className = {styles.centerBox}>
          <h2 style = {{fontWeight: 'bold'}}>OUR STORY</h2>
          <p style = {{color: 'black', fontSize: '23px', textAlign: 'left', padding: '0px ', marginTop: '60px'}}> 
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco poriti laboris nisi ut aliquip ex ea commodo consequat.
           Duis aute irure dolor in reprehenderit in uienply voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
           Excepteur sint occaecat cupidatat norin proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
           Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. 
           Ut enim ad minim veniam, quis nostrud exercitation ullamco poriti laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
      <div style = {{width: '80%', margin: '410px auto 0px auto'}}>
        <h2  >OUR CHEFS</h2>
      </div>
      <div className = {styles.centerPageBar}>
        <div style = {{backgroundColor: 'white', height: '500px', width: '860px', float: 'left', margin: '75px 80px'}}></div>
        <div style = {{float: 'left', marginTop: '75px', marginLeft: '20px'}}>
          <h3 style = {{fontWeight: 'bold'}}>CHEF RAMANAND</h3>
          <p style = {{color: 'black', fontSize: '23px', padding: '0px ', marginTop: '60px', width: '800px'}}> 
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco poriti laboris nisi ut aliquip ex ea commodo consequat.
           Duis aute irure dolor in reprehenderit in uienply voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
           Excepteur sint occaecat cupidatat norin proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
           Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. 
           Ut enim ad minim veniam, quis nostrud exercitation ullamco poriti laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
      <div style = {{height: '70vh', width: '100%'}}>
        <div style = {{backgroundColor: 'black', height: '500px', width: '860px', float: 'right', margin: '75px 80px'}}></div>
        <div style = {{float: 'left', marginTop: '75px', marginLeft: '80px'}}>
          <h3 style = {{fontWeight: 'bold'}}>CHEF RAMANAND</h3>
          <p style = {{color: 'black', fontSize: '23px', padding: '0px ', marginTop: '60px', width: '800px'}}> 
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco poriti laboris nisi ut aliquip ex ea commodo consequat.
           Duis aute irure dolor in reprehenderit in uienply voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
           Excepteur sint occaecat cupidatat norin proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
           Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. 
           Ut enim ad minim veniam, quis nostrud exercitation ullamco poriti laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>

      <div style = {{width: '90%', margin: '0px 80px'}}>
        <h3 style = {{fontWeight: 'bold'}}>OUR PARTNER</h3>
        <img src = {oliveGLogo} style = {{display: 'inline-block', height: '100px', margin: '30px'}}></img>
        <img src = {paradiseBayLogo} style = {{display: 'inline-block', height: '100px', margin: '30px'}}></img>
      </div>
      <div style = {{width: '90%', margin: '0px 80px'}}>
        <h3 style = {{fontWeight: 'bold'}}>PARTNER PROFILES</h3>
        <div>
          
          <div className = {styles.partnerProfileContainer}>
            <div style = {{display: 'grid'}}>
              <img src = {oliveGLogo} className = {styles.partnerProfileLogo}></img>
              <div style = {{backgroundColor: 'black', height: '315px', width: '515px', margin: 'auto'}}></div>
              <p style = {{color: 'black', fontSize: '18px', padding: '0px ', margin: '40px auto 0 auto', width: '515px'}}> 
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco poriti laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in uienply voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat norin proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
              </p>
            </div>
          </div>
          <div className = {styles.partnerProfileContainer}>
            <div style = {{display: 'grid'}}>
              <img src = {oliveGLogo} className = {styles.partnerProfileLogo}></img>
              <div style = {{backgroundColor: 'black', height: '315px', width: '515px', margin: 'auto'}}></div>
              <p style = {{color: 'black', fontSize: '18px', padding: '0px ', margin: '40px auto 0 auto', width: '515px'}}> 
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco poriti laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in uienply voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat norin proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className= {styles.questionsPageBar}>
        <div style = {{width: '80%', margin: '410px auto 0px auto', display: 'grid'}}>
        <h3 style = {{fontWeight: 'bold', margin: '80px 0px'}}>ASK A QUESTION</h3>
        <textarea className = {styles.questionBox} placeholder = 'Type your question'>

        </textarea>
          <div style = {{display: 'inline-block', width: '50%'}}>
            <input className = {styles.emailBox} type = 'email' placeholder = 'Email'>

            </input>
            <button className = {styles.sendButton}> Send </button>
          </div>
        
        </div>
        
      </div>
    </>
     );
  }
}
 
export default About;
