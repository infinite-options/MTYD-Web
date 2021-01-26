import React, { Component } from 'react';
import PropTypes from "prop-types";
import {WebNavBar} from '../NavBar'
import {connect} from "react-redux";
import {
  changeEmail,
} from "../../reducers/actions/loginActions";
import {API_URL} from "../../reducers/constants";
import axios from 'axios'

class RecoverPassword extends Component {

     sendEmail = () => {
         console.log(this.props.email)
         axios.get(API_URL + 'reset_password?email=' + this.props.email)
         .then(res =>{
             console.log(res)
         })
         .catch(err => {
             console.log(err)
         })
     }

    render() { 
        return (
            <> 
            <div>
                <WebNavBar />
                <div style = {{display: 'grid', justifyContent: 'center', alignItems: 'center'}}>
                    <h6 style = {{margin: '10px', textAlign: 'center'}}>Enter Your Email</h6>
                    <input 
                        type = 'email'
                        placeholder = 'email'
                        value = {this.props.email}
                        onChange={e => {
                            this.props.changeEmail(e.target.value);
                          }}
                        style ={{marginTop: '20px'}}
                        >
                    </input>
                    <button onClick = {this.sendEmail}>
                        Submit
                    </button>
                </div>
            </div>

            </>
         );
    }
}

RecoverPassword.propTypes = {
    changeEmail: PropTypes.func.isRequired,
  };

const mapStateToProps = state => ({
    email: state.login.email,
  });
  
  const functionList = {
    changeEmail,
  };
  
  export default connect(mapStateToProps, functionList)(RecoverPassword);