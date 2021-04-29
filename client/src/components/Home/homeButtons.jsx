import React, { Component } from 'react';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import styles from './home.module.css'
import {Link} from "react-router-dom";
import becomeAnAmbassadorImg from "../../images/Group 180.png"
import facebookAndInstagramImg from "../../images/Group 68.svg"
import closeIconImg from "../../images/Icon ionic-ios-close-circle.png"
import LTBAA from "../../images/Group 450.png"
import SUTBAA from "../../images/Group 234 for Ambassador.png"
import Cookies from "js-cookie";
import { API_URL } from '../../reducers/constants';
import axios from 'axios';
import PopLogin from '../PopLogin';
import Popsignup from '../PopSignup';

class HomeLink extends Component {
    render() { 
        return (
            <Link to={this.props.link}>
              <img className = {styles.buttonsBelowTheLogo} src = {this.props.text} style = {this.props.style}/>
            </Link>
         );
    }
}

class AddressLink extends Component {
  render() { 
      return (
        <button 
          onClick={this.props.popSignup}
          className={styles.orangeButton}
        >
          {this.props.text}
        </button>
       );
  }
}

class FootLink extends Component {
    state = {
       seen: false
    };
      togglePop = () => {
       this.setState({
       seen: !this.state.seen
      });
     };
    render() { 
	    
        return (
            <div className = {styles.footerBackground}>	
			{/*<AmbassadorLink text = "Click here" link='/select-meal'>
			</AmbassadorLink>*/}	
            <p className = {styles.findUs}>Find us 			
            <img className = {styles.footerLogo} src = {facebookAndInstagramImg} alt="facebookAndInstagramImg" />
            </p>
            <div className = {styles.footerRight}>
            <img onClick={() => this.togglePop()} style = {{width: '320px', height:'67px'}} src = {becomeAnAmbassadorImg} style = {{marginTop: '25px'}}/>			
            </div>
			{this.state.seen ? <AmbassadorLink toggle={this.togglePop} /> : null}
            </div>
         );
    }
}
class AmbassadorLink extends Component {

  constructor(props){
    super();
    this.state = {
      user_id:'',
      user_address:'',
      login_seen:false,
      signUpSeen:false, 
    };
  }
  handleClick = () => {
    this.props.toggle();
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
	// this.setState({user_id:'anup'});
	/*this.setState({user_address: '214 Main Ave, San Jose, CA 91101'});*/
    }
    
  }

  render() {
    return (
      <div>
        {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
        {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}

        {(() => {
			if(this.state.user_id != "not login"){
		          return (	
				  <div className={styles.modal}>
					<div className={styles.modal_content}>
					  <span className={styles.close} onClick={this.handleClick}>
						<img src={closeIconImg}/>
					  </span>
						<p style = {{font:'normal normal bold 32px/38px SF Pro', textAlign: 'center', color:'black'}}>Love MealsFor.Me?</p>
						<p style = {{font:'normal normal bold 18px/21px SF Pro', textAlign: 'center', color:'black'}}> Become an Ambassador</p>
						
						<p className = {styles.ambassdorText} style= {{marginLeft: 'auto',marginRight:'auto', width:'437px', height:'117px', font: 'normal normal medium 22px/30px SF Pro', textAlign: 'center'}}>Your friend(s) saves <em>20%</em> on their first order and you save <em>20%</em> on your next renewal <br/>+ <br/>Each time your friend renews, you get an additional <em>5%</em> renewal bonus. Sign up 20 friends and eat for free!</p>
						<p style = {{display: 'inline', font: 'normal normal medium 18px/21px SF Pro', textAlign: 'center', color: '#F26522', witdth:'50%'}}>Ambassador Name:</p>
						<p style = {{display: 'inline-block', verticalAlign: 'top', font: 'normal normal medium 18px/21px SF Pro', textAlign: 'right', color: '#F26522', color:'black', marginLeft:'350px'}}>John Doe</p>
						<input style = {{border:'2px solid #F26522', borderRadius: '15px', width: '100%', padding: '5px'}} placeholder = "johndoe@gmail.com"/>
						<p style = {{font: 'normal normal medium 18px/21px SF Pro', textAlign: 'center', color: '#F26522'}}>Your friends can use this email address as the Ambassador code when they sign up</p>
					</div>
				  </div>
				)} else {
					return (
					  <div className={styles.modal}>
						<div className={styles.modal_content}>
						  <span className={styles.close} onClick={this.handleClick}>
							<img src={closeIconImg}/>
						  </span>
							<p style = {{font:'normal normal bold 32px/38px SF Pro', textAlign: 'center', color:'black'}}>Love MealsFor.Me?</p>
							<p style = {{font:'normal normal bold 18px/21px SF Pro', textAlign: 'center', color:'black'}}> Become an Ambassador</p>
							<p style= {{marginLeft:'auto', marginRight:'auto', width:'437px', height:'117px', font: 'normal normal medium 22px/30px SF Pro', textAlign: 'center'}}>Save money by helping others eat better. Become an ambassador by sharing MealsFor.Me with your friends. The more you share, the more you save.</p>
							<img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src = {LTBAA}/>
							<p style = {{font: 'normal normal bold 26px/31px SF Pro', textAlign: 'center', paddingTop:'15px'}}>OR</p>
							<img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src = {SUTBAA}/>
						</div>
					  </div>
				)}
		}) ()}
		</div>
    )
  }
}
export {HomeLink, FootLink, AmbassadorLink, AddressLink};