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
import {HomeLink, FootLink} from "../Home/homeButtons"

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
	/*Use the following for setting the user */ 
	/*this.setState({user_id:'anup'});
	this.setState({user_address: '214 Main Ave, San Jose, CA 91101'});*/
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
		{/*Change the following to medium later on, using bold for testing*/}
		<div style = {{marginTop:'80px', marginLeft: '120px', marginBottom:'0px'}}>
		<p style = {{font: 'SF Pro', fontWeight: 'medium', fontSize: '24px' ,color:'black', textAlign:'left'}}>Your first delivery will arrive on:</p>
		<p style = {{marginTop:'-20px', marginLeft: '40px', font: 'SF Pro', fontWeight: 'bold', fontSize: '24px' ,color:'black', textAlign:'left'}}>March 8 between 4-6pm</p>
        {/*Change the following to medium later on, using bold for testing*/}
		<br/>
        <p style = {{marginLeft: '80px', font: 'SF Pro', fontWeight:'medium', fontSize: '24px'}}>To your address:<br/></p>
		<p style = {{marginTop:'-20px', font: 'SF Pro',fontWeight: 'bold', fontSize: '24px' , color:'black', marginLeft:'80px'}}>{this.state.user_address}</p>
        </div>
       {(() => {
			if(this.state.user_id != "not login"){
		          return (	
				  <div style = {{marginLeft: '65%', marginBottom:'50px', marginTop:'-185px'}}>
					<div style = {{display:'inline-flex'}}> 
					<p style = {{font: 'SF Pro', fontWeight: 'bold', fontSize: '25px' , marginTop: '-30px', marginRight:'-400px', color:'black'}}> What's next?</p>
					 <div style = {{textAlign:'center'}}>
					 <br/>
					 <HomeLink text = {selectYourMealImage} link = "/select-meal"/>
					 <img src = {path28_bottom} style = {{marginTop: '-10px'}}/>
					 <br/>
                     {/*Change the following to medium later on, using bold for testing*/}
				     <div style = {{width:'207px', height:'116px'}}>
					 <p style = {{font: 'SF Pro', fontWeight: 'medium', fontSize: '24px', border: '2px solid #F26522', borderRadius:'25px', padding: '5px', color:'black'}}>Receive your <br/>meals</p>                     
                     </div>
				     <div style = {{marginTop:'-120px', marginLeft: '300px',  width:'207px', height:'116px'}}>
					 <p style = {{font: 'SF Pro', fontSize: '24px', fontWeight:'medium', border: '2px solid #F26522', borderRadius:'25px', padding: '5px', color:'black'}}>Heat and <br/>enjoy!</p>		
                     </div>
                 	 <img style = {{marginTop: '-55px'}} src = {pathFromRYMToHAE}/>				
					 </div>
					</div>
					</div>
				)} else {
					return (
					<div style = {{marginLeft: '75%', marginBottom:'50px', marginTop:'-160px'}}>
					<div style = {{display:'inline-flex'}}> 
					<h3 style = {{font: ' SF Pro', fontWeight:'bold',fontSize: '25px', marginTop: '-30px', marginRight:'-380px', color:'black'}}> What's next?</h3>
					 <div style = {{textAlign:'center'}}>
					 <img style = {{marginLeft: '-20%'}} src = {path28_bottom}/>
					 <br/>
					 <HomeLink text = {createAnAccountImage} link = "/home" style = {{marginLeft: '50px', marginBottom:'-10px'}}/>
					 <img style = {{marginLeft:'-50px', width:'280px', height:'120px'}} src = {pathFromCAAToSYM}/>
					 <br/>
					 <HomeLink text = {selectYourMealImage} link = "/select-meal" style = {{marginLeft: '80px', marginBottom:'-10px'}}/>
					 <img style = {{marginLeft:'-50px', width:'280px', height:'120px'}} src = {path28_top}/>
					 <br/>
                     {/*Change the following to medium later on, using bold for testing*/}
				     <div style = {{width:'207px', height:'115px'}}>
					 <p style = {{font: 'SF Pro', fontSize: '24px', fontWeight:'medium',border: '2px solid #F26522', borderRadius:'25px', padding: '5px', color:'black'}}>Receive your <br/>meals</p>                     
                     </div>
				     <div style = {{marginTop:'-120px', marginLeft: '300px',  width:'207px', height:'115px'}}>
					 <p style = {{font: 'SF Pro', fontSize: '24px', fontWeight: 'medium',border: '2px solid #F26522', borderRadius:'25px', padding: '5px', color:'black'}}>Heat and <br/>enjoy!</p>		
                     </div>
                 	 <img style = {{marginTop: '-50px'}} src = {pathFromRYMToHAE}/>				
					 </div>
					</div>
					</div>
				)}
		}) ()}
		<FootLink/>
		</div>
    )
  }
}

export default Congrats
