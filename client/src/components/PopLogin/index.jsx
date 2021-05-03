import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from "./popLogin.css"
import SocialLogin from "../Landing/socialLogin"
import {
  loginAttempt,
  changeEmail,
  changePassword,
} from "../../reducers/actions/loginActions";
import { Route , withRouter} from 'react-router-dom';
import closeIcon from '../../images/closeIcon.png'


import {connect} from "react-redux";
import { Grid, Paper, Button, Typography, Box } from '@material-ui/core';


export class PopLogin extends Component {

  constructor(){
    super();
  }

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
    this.props.history.push(`/${page}`);
  }; 

  render() {
    return (
      <div          
        className="pop_content"
      >

          <div className="close" onClick={this.handleClick}/>
          <p style={{
            textAlign:'center',
            height: '28px',
            letterSpacing: '0.38px',
            color: 'black',
            fontSize:'26px',
            opacity: 1,
            marginTop:'58px',
            marginBottom:'25px',
            fontWeight:'bold',
			font:'SF Pro'
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
            fontWeight:'bold',
			font:'SF Pro'
          }}>
            OR
          </div>


          <input
            type='SFProtext'
            placeholder='Username'
            className="loginSectionItem"
            onChange={e => {
              this.props.changeEmail(e.target.value);
              console.log(e.target.value);
            }}
          />
            

          <input
            className="loginSectionItem"
            style={{marginBottom: "0px"}}
            type='password'
            id='password'
            placeholder='Password'
            size="56"
            value={this.props.password}
            onChange={e => {
              this.props.changePassword(e.target.value);
            }}
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
            textDecoration:"underline",
			font:'SF Pro',
			fontWeight:'medium'
          }}>
            Forgot password?
          </p>

          <button
            className='signInBtn'
            onClick={() => {
              this.props.loginAttempt(
                this.props.email,
                this.props.password,
                this.successLogin
              );
              console.log(this.props.email)
              console.log(this.props.password)
            }}
          >

            <p
            style={{
              textAlign: 'center',
              letterSpacing: '0.32px',
              color: '#FFFFFF',
              opacity: 1,
			  font:'SF Pro',
			  fontSize:'25px'
            }}>
              Login
            </p>
          </button>

      </div>
    )
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

