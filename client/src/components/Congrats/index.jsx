import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {WebNavBar} from "../NavBar";
import Cookies from "js-cookie";
import axios from 'axios';
import { API_URL } from '../../reducers/constants';
import {Link} from "react-router-dom";
import SocialLogin from "../Landing/socialLogin"

import PopLogin from '../PopLogin';
import Popsignup from '../PopSignup';

export class Congrats extends Component {

  constructor(props){
    super();
    this.state = {
      user_id:'',
      user_address:'',
      login_seen:false,
      signUpSeen:false, 
    };
  }
  togglePopLogin = () => {
    this.setState({
     login_seen: !this.state.login_seen,
    });

    if(!this.state.login_seen){
      this.setState({
        signUpSeen:false
      })
    }

   };

   togglePopSignup = () => {
    this.setState({
     signUpSeen: !this.state.signUpSeen
    });

    if(!this.state.signUpSeen){
      this.setState({
        login_seen:false
      })
    }
   };

  componentDidMount(){
    const customer_uid = Cookies.get("customer_uid");
    console.log(Cookies.get("customer_uid"))
    if(customer_uid){
      this.setState({user_id:customer_uid})
      axios
      .get(`${API_URL}Profile/${customer_uid}`)
      .then((response) => {
        const addr = response.data.result[0].customer_address.toLowerCase();
        this.setState({user_address: addr});
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
      
    }else{
      this.setState({user_id:'not login'})
      this.setState({user_address: 'not login yet'});
    }
    
  }

  render() {
    return (
      <div>
        <WebNavBar 
          poplogin = {this.togglePopLogin}
          popSignup = {this.togglePopSignup}
        />
        {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
        {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}
        <h1>CONGRATULATIONS</h1>
        <h2>YOUR FIRST DELIVERY WILL ARRIVE ON:March 8 between 4-6pm</h2>
        <h2>TO YOUR ADDRESS:{this.state.user_address}</h2>
        <br/>
        <br/>
        <br/>
        <h3> what to expect</h3>
        <div>
          <Link to='/home'>
            <button>place holder</button>
          </Link>
          <Link to='/home'>
            <button>place holder</button>
          </Link>
          <Link to='/home'>
            <button>place holder</button>
          </Link>
        </div>
        <br/>
        <br/>
        <br/>
        <h3> create an account</h3>
        <h3>You are one step away from creating an account and saving time and money!</h3>
        <h3>USE SOCIAL MEDIA (RECOMMENDED)</h3>
        <SocialLogin/>
        <br/>
        <br/>
        <br/>
        <h3>OR CREATE PASSWORD</h3>

        <form>
          <label>
            <input type="text" placeholder="password" />
          </label>
          <label>
            <input type="text" placeholder="confirm password" />
          </label>
          <br/>
        </form>
          <input type="submit" value="Finish" />




      </div>
    )
  }
}

export default Congrats
