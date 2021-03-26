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
        <div>
          <div className="close" onClick={this.handleClick}>
            &times;
          </div>

          <p style={{
            textAlign:'center',
            top: '25px',
            // left: '217px',
            // width: '194px',
            height: '28px',
            letterSpacing: '0.38px',
            color: '#136D74',
            fontSize:'24px',
            opacity: 1,
            marginTop:'15px',
            }} 
          >
          Login
          </p>
          <div class="inputContainer">
            <input
              type='text'
              placeholder='USER NAME'
              className="loginSectionItem"
              onChange={e => {
                this.props.changeEmail(e.target.value);
                console.log(e.target.value);
              }}
            />
            
          </div>
          





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
          />

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
            }}>
              Login
            </p>
          </button>

          <p
          style={{
            textAlign: 'center',
            letterSpacing: '0.32px',
            color: '#FFFFFF',
            opacity: 1,
            fontSize:14,
            color:'#6D7278',
            paddingTop:0,
            marginTop:10,
          }}>
            Reset password
          </p>

          <p
            style={{
              textAlign: 'center',
              letterSpacing: '0.32px',
              color: '#FFFFFF',
              opacity: 1,
              fontSize:24,
              color:'#136D74',
              fontWeight:'500',
              paddingTop:0,
              marginTop:10,
            }}
          >
            Or login with
          </p>


          <div
              style={{
                marginTop: "24",
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                textAlign: "center",
                justifyContent: "space-between",
                padding: "0rem 8.5rem"
              }}
          >
            <SocialLogin />
          </div>


        </div>

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

