import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {WebNavBar} from "../NavBar";
import Cookies from "js-cookie";
import axios from 'axios';
import { API_URL } from '../../reducers/constants';
import {Link} from "react-router-dom";
import SocialLogin from "../Landing/socialLogin"
import styles from "../Home/home.module.css"
import PopLogin from '../PopLogin';
import Popsignup from '../PopSignup';
import path28_top from '../../images/Path 28_top.png';
import path28_bottom from '../../images/Path 28.png';
import createAnAccountImage from  '../../images/Group 234.png';
import pathFromCAAToSYM from '../../images/Path 49.png';
import pathFromRYMToHAE from '../../images/Path 29.png';
import selectYourMealImage from '../../images/Group 114_SYM.png';

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
		<div class = {styles.howDoesContainer}>
        <div class = {styles.howDoesText}>
        <p style = {{marginLeft: '-90px', display:'inline', color: 'black'}}>Congratulations</p>
		</div> </div>
        <p style = {{font: 'normal normal medium 24px/15px SF Pro'}}>Your first delivery will arrive on<br/></p>
		<p style = {{font: 'normal normal bold 24px/15px SF Pro'}}>:March 8 between 4-6pm</p>
        <p style = {{font: 'normal normal medium 24px/15px SF Pro'}}>To your address:<br/></p>
		<p style = {{font: 'normal normal bold 24px/15px SF Pro'}}>{this.state.user_address}</p>

        <h3 style = {{font: 'normal normal bold 25px/16px SF Pro'}}> What's next?</h3>
         <img src = {path28_top}/>
         <img src = {createAnAccountImage}/>
		 <img src = {pathFromCAAToSYM}/>
		 <img src = {selectYourMealImage}/>
		 <img src = {path28_bottom}/>
		 <p style = {{font: 'normal normal medium 24px/15px SF Pro', border: '2px solid #F26522', borderRadius:'25px', padding: '20px'}}>Receive your <br/>meals</p>
		 <img src = {pathFromRYMToHAE}/>
		 <p style = {{font: 'normal normal medium 24px/15px SF Pro', border: '2px solid #F26522', borderRadius:'25px', padding: '20px'}}>Heat and <br/>enjoy!</p>
         </div>
    )
  }
}

export default Congrats
