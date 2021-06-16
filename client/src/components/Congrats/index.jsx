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
import {HomeLink, FootLink, CreateAccPWSU1} from "../Home/homeButtons"

export class Congrats extends Component {

  constructor(props){
    super();
    this.state = {
      user_id:'',
      user_address:'',
      login_seen:false,
      signUpSeen:false,
      seen: false,	  
    };
  }
    togglePop = () => {
       this.setState({
       seen: !this.state.seen
      });
    };  
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

  formatDate = (rawDate) => {

    console.log("(congrats) rawDate: ", rawDate);

    let dateElements = rawDate.split(' ');
    let yyyy_mm_dd = dateElements[0].split('-');
    let month;

    // Parse month
    switch(yyyy_mm_dd[1]){
      case "01":
        month = "January";
        break;
      case "02":
        month = "February";
        break;
      case "03":
        month = "March";
        break;
      case "04":
        month = "April";
        break;
      case "05":
        month = "May";
        break;
      case "06":
        month = "June";
        break;
      case "07":
        month = "July";
        break;
      case "08":
        month = "August";
        break;
      case "09":
        month = "September";
        break;
      case "10":
        month = "October";
        break;
      case "11":
        month = "November";
        break;
      case "12":
        month = "December";
        break;
      default:
        month = "";
    }

    let dateString = month + " " + yyyy_mm_dd[2]
    // console.log("date string: ", dateString);

    return dateString;
  }

  render() {
    console.log("(render) props: ", this.props);
    return (
      <div>
        <WebNavBar 
          poplogin = {this.togglePopLogin}
          popSignup = {this.togglePopSignup}
        />

        {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
        {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}

        <div className = {styles.howDoesContainer}>
          <div className = {styles.howDoesText}>
            <p style = {{marginLeft: '-90px', display:'inline', color: 'black'}}>Congratulations</p>
          </div>
        </div>

		{/*Change the following to medium later on, using bold for testing*/}
		<div style = {{marginTop:'80px', marginLeft: '120px', marginBottom:'0px'}}>

	    <p style = {{font: 'SF Pro', fontWeight: 'medium', fontSize: '24px' ,color:'black', textAlign:'left'}}>
        Your first delivery will arrive on:
      </p>
		  <p style = {{marginTop:'-20px', marginLeft: '40px', font: 'SF Pro', fontWeight: 'bold', fontSize: '24px' ,color:'black', textAlign:'left'}}>
        {this.formatDate(this.props.location.delivery_date)} between 4-6pm
      </p>
      
      {/*Change the following to medium later on, using bold for testing*/}
		  <br/>
        
      <p style = {{marginLeft: '80px', font: 'SF Pro', fontWeight:'medium', fontSize: '24px'}}>
        To your address:
        <br/>
      </p>

      {/* <p 
        style = {{
          marginTop:'-20px', 
          font: 'SF Pro',
          fontWeight: 'bold', 
          fontSize: '24px', 
          color:'black', 
          marginLeft:'80px'
        }}
      >
        {this.state.user_address}
      </p> */}

      <p 
        style = {{
          marginTop:'-20px', 
          font: 'SF Pro',
          fontWeight: 'bold', 
          fontSize: '24px', 
          color:'black', 
          marginLeft:'80px'
        }}
      >
        {
          this.props.location.delivery_address + ", "
        }
        <br />
        {
          this.props.location.delivery_city + ", " +
          this.props.location.delivery_state + ", " +
          this.props.location.delivery_zip
        }
      </p>

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
                     <img src = {createAnAccountImage} style = {{marginTop:'-20px',marginLeft: '-70px', marginBottom:'-10px', width:'320px', height:'50px'}} onClick={() => this.togglePop()}/>
                     {this.state.seen ? <CreateAccPWSU1 toggle={this.togglePop} /> : null}
					 <div style = {{marginTop: '10px', marginLeft:'-90px'}}>
					 <img style = {{ width:'280px', height:'120px'}} src = {pathFromCAAToSYM}/>
					 </div>
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
