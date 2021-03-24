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
        className="model_content"
      >
        <div>
          <span className="close" onClick={this.handleClick}>
            &times;
          </span>
          <div>
            <p style={{
              textAlign:'center',
              color:'black'
              }} 
            >
            Login
            </p>
          </div>

          <div className="loginSectionItem">
            <input
              type='text'
              placeholder='USER NAME'
              className="loginSectionInput"
              size="56"
              onChange={e => {
                this.props.changeEmail(e.target.value);
                console.log(e.target.value);
              }}
            />
          </div>

          <div className="loginSectionItem">
              <input
                className="loginSectionInput"
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
          </div>
          <div
          styles={{
            margin: 0,
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          >
            <button
              className='signInBtn'
              onClick={() => {
                this.props.loginAttempt(
                  this.props.email,
                  this.props.password,
                  this.successLogin
                );
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
            <Button
              style={{
                background: '#FF8500 0% 0% no-repeat padding-box',
                borderRadius: '8px',
                opacity: 1,
                top: '19px',
                left: '45px',
                width: '362px',
                height: '61px',
              }}>
                Login
            </Button>
          </div>



          <div
              style={{
                marginTop: "3.5rem",
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

