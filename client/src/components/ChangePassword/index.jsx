import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {
    changeOldPassword
  } from "../../reducers/actions/loginActions";
import Alert from '../Alert'
import styles from "./changePassword.module.css";
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';

class ChangePassword extends Component {
    constructor() {
        super();
        this.state = {
          mounted: false,
          customer_uid: '',
          oldPassword: '',
          newPassword: '',
          newPassword2: '',
          toggleChangePassword: styles.changePasswordPopUpHide,
          displayCheck: false,
        };
      }

    componentDidMount() {
        console.log(document.cookie);
        if (
          document.cookie
            .split(";")
            .some(item => item.trim().startsWith("customer_uid="))
        ) {
          // Logged in
          let customer_uid = document.cookie
            .split("; ")
            .find(row => row.startsWith("customer_uid"))
            .split("=")[1];
          console.log(customer_uid);
          // console.log(customerFirstName)
          //this.props.fetchOrderHistory(customer_uid);
          this.setState({
            mounted: true,
            customer_uid: customer_uid
          });
        } else {
          // Reroute to log in page
          this.props.history.push("/");
        }
      }

      toggleDisplay = () => {
            if(this.state.displayCheck === false) {
            this.setState({
                toggleChangePassword: styles.changePasswordPopUpShow,
                displayCheck: true,
            })
            }else{
            this.setState({
                toggleChangePassword: styles.changePasswordPopUpHide,
                displayCheck: false,
                oldPassword: '',
                newPassword: '',
                newPassword2: '',
            })
            }
        
        }

      changePassword = (value, x) => {

        if(x === 1) {
          this.setState({
            oldPassword: value
          })
        }
        if(x ===2) {
          this.setState({
            newPassword: value
          })
        }
        if(x === 3) {
          this.setState({
            newPassword2: value
          })
        }
    
        // console.log(this.state.oldPassword)
        // console.log(this.state.newPassword)
      }

    render() { 
        return ( 
        <>
        
        <a className = {styles.changePasswordButtonMenu} onClick = {this.toggleDisplay}> <i className='fa fa-lock' style = {{margin: '4px 7px'}}> </i> Change Password</a>  
        <div className = {this.state.toggleChangePassword}>
            <div className  = {styles.changePasswordContainer}>
                    <a  style = {{
                            color: 'black',
                            textAlign: 'center', 
                            fontSize: '45px', 
                            zIndex: '2', 
                            float: 'right', 
                            position: 'absolute', top: '0px', left: '350px', 
                            transform: 'rotate(45deg)', 
                            cursor: 'pointer'}} 
                            
                            onClick = {this.toggleDisplay}>+</a>

                <div style = {{display: 'block', width: '300px', margin: '40px auto 0px'}}>
                    <h6 style = {{margin: '5px', color: 'orange', fontWeight: 'bold', fontSize: '25px'}}>Change Password</h6>
                    <input 
                    className = {styles.changePasswordInput}
                    type = 'password'
                    placeholder = 'Old Password'
                    value = {this.state.oldPassword}
                    onChange={e => {
                        this.changePassword(e.target.value, 1);
                    }}
                    />

                    <input 
                    className = {styles.changePasswordInput}
                    type = 'password'
                    placeholder = 'New Password'
                    value = {this.state.newPassword}
                    onChange={e => {
                        this.changePassword(e.target.value, 2);
                    }}
                    />

                    <input 
                    className = {styles.changePasswordInput}
                    type = 'password'
                    placeholder = 'Confirm New Password'
                    value = {this.state.newPassword2}
                    onChange={e => {
                        this.changePassword(e.target.value, 3);
                    }}
                    />

                    <button className = {styles.changePasswordButton} 
                    onClick = {() => {
                        this.props.changeOldPassword(
                        this.state.customer_uid,
                        this.state.oldPassword,
                        this.state.newPassword,
                        this.state.newPassword2
                        );
                    }}
                    > Submit </button>
                    
                </div>
                <Alert/>    
            </div>
        </div>
        </>
         );
    }
}
 
ChangePassword.propTypes = {
    changeOldPassword: PropTypes.func.isRequired
  };
  
  const mapStateToProps = state => ({
  });
  
  const functionList = {
    changeOldPassword
  };
  
  export default connect(mapStateToProps, functionList)(withRouter(ChangePassword));