import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import styles from "./popLogin.css"
import SocialLogin from "../Landing/socialLogin"
import {
  loginAttempt,
  changeEmail,
  changePassword,
  errMessage,
  getErrMessage
} from "../../reducers/actions/loginActions";
import { Route , withRouter} from 'react-router-dom';
import closeIcon from '../../images/closeIcon.png'


import {connect} from "react-redux";
import { Grid, Paper, Button, Typography, Box } from '@material-ui/core';
import { text } from '@fortawesome/fontawesome-svg-core';


export class PopLogin extends Component {

  constructor(){
    super();
  }

  errVal=''
  attemptLogin=false
  attemptShow=true
  attemptReload=false  

  handleClick = () => {
    this.props.toggle();
  };

  viewPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  successLogin = page => {
    console.log(page)
    this.props.history.push(`/${page}`);
  }; 

  render() {
    //this.errVal=''
    this.attemptLogin=true
    this.getError()
    this.showError()
    this.attemptReload=false
    //this.handleReload()
    return (
      <div          
        className="pop_content"
      >

          <button className="close" onClick={this.handleClick} aria-label="Click here to exit Login menu" title="Click here to exit Login menu"/>
          <p style={{
            textAlign:'center',
            height: '28px',
            letterSpacing: '0.38px',
            color: 'black',
            fontSize:'26px',
            opacity: 1,
            marginTop:'58px',
            marginBottom:'25px',
            fontWeight:'bold'
            }} 
          >
          Login
          </p>



          {/* <div
              style={{
                marginTop: "24",
                marginLeft:'68px',
                alignContent: "center",
                textAlign: "center",
                justifyContent: "space-between",
              }}
          > */}
            <SocialLogin />
          {/* </div> */}

          <div  
          style={{
            textAlign:'center',
            height: '28px',
            letterSpacing: '0.38px',
            color: 'black',
            fontSize:'26px',
            opacity: 1,
            marginTop:'28px',
            marginBottom:'25px',
            fontWeight:'bold'
          }}>
            OR
          </div>


          <input
            type='text'
            placeholder='USER NAME'
            className="loginSectionItem"
            onChange={e => {
              this.props.changeEmail(e.target.value);
              console.log(e.target.value);
            }}
            aria-label="Enter your username"
            title="Enter your username"
          />
            

          <input
            className="loginSectionItem"
            style={{marginBottom: "0px"}}
            type='password'
            id='password'
            placeholder='PASSWORD'
            size="56"
            value={this.props.password}
            onChange={e => {
              this.props.changePassword(e.target.value);
            }}
            aria-label="Enter your password"
            title="Enter your password"
          />


          <p
          style={{
            textAlign: 'center',
            letterSpacing: '0.32px',
            color: '#FFFFFF',
            opacity: 1,
            fontSize:'13px',
            color:'black',
            paddingTop:0,
            marginTop:10,
            textDecoration:"underline"
          }}
          aria-label="Click here to reset your password"
          title="Click here to reset your password">
            Forgot password?
          </p>

          <button
            className='signInBtn'
            onClick={() => {
              /*this.props.loginAttempt(
                this.props.email,
                this.props.password,
                this.successLogin
              );
              this.errVal=getErrMessage()
              this.forceUpdate();*/
              this.attemptLogin = true
              this.getError()
              this.forceUpdate()
              console.log("Login clicked, attemptLogin = " + this.attemptLogin)
            }}
            aria-label="Click here to login"
            title="Click here to login"
          >

            <p
            style={{
              textAlign: 'center',
              letterSpacing: '0.32px',
              color: '#FFFFFF',
              opacity: 1,
            }}>
              Login
            </p>
          </button>
          {/*this.getError()*/}
          {this.showError()}
          {this.handleReload()}
      </div>
    )
  }

  getError = () => {
    console.log("attemptLogin = " + this.attemptLogin)
    if (this.attemptLogin==true){ 
      this.props.loginAttempt( 
        this.props.email,
        this.props.password,
        this.successLogin
      );
      //this.errVal=getErrMessage()
      this.attemptLogin=false
      this.attemptShow=true
    }
    return null;
  }

  showError = () => {
    console.log("attemptShow = " + this.attemptShow)
    /*if (this.attemptLogin==true){
      this.props.loginAttempt(
        this.props.email,
        this.props.password,
        this.successLogin
      );
      this.errVal=getErrMessage()
      this.attemptLogin=false
      this.attemptReload=true
    }*/
    if (this.attemptShow==true){
      this.errVal=getErrMessage()
      console.log("Set error text to: "+ this.errVal)
      this.attemptShow=false
      this.attemptReload=true
    }
    
    if (this.errVal == '') {
      return null;
    }
    return <Typography style={{ color: 'red', textAlign:'center' }}>{this.errVal}</Typography>;
  }

  handleReload = () => {
    console.log("attemptReload = " + this.attemptReload)
    if (this.attemptReload == true){
      this.forceUpdate()
      //this.forceUpdate()
    }
    this.attemptReload=false
    return null;
  }
}

const mapStateToProps = state => ({
  email: state.login.email,
  password: state.login.password,
  error: state.login.error
});

const functionList = {
  loginAttempt,
  changeEmail,
  changePassword,
  loginAttempt,
};

export default connect(mapStateToProps, functionList) (withRouter(PopLogin));

