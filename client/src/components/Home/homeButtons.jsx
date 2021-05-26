/*Remove loginPopup and Signup popUp
  Become an ambassador for logged in user needs to be linked to the form.
*/
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
import loginButton from '../../images/Group 479.png';
import signupButton from '../../images/Group 480.png';
import negativeSign from '../../images/Group 504.png';
import positiveSign from '../../images/Group 505.png';
import continueExploring from '../../images/Group 575.png'
import heartImage from '../../images/Icon ionic-ios-heart.png'
import continueWithApple from '../../images/Group 539.png'
import continueWithFacebook from '../../images/Group 537.png'
import continueWithGoogle from '../../images/Group 538.png'
import store from "../../reducers/store";
import eyeIcon from '../../images/Icon ionic-ios-eye.png'
import SocialLogin from "../Landing"
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";

import ambassadorNotLogin from '../../images/ambassadorNotLogin.png'
import {withRouter} from "react-router";
import zIndex from '@material-ui/core/styles/zIndex';

class HomeLink extends Component {
    render() { 
        return (
          <div style = {{textAlign: 'center', marginTop: '30px', marginBottom: '50px',fontWeight: 'bold'}}>

            <a href = {this.props.link}
                style = {{height:'68px', width:'432px', marginTop:'77.66px', marginLeft:'auto', marginRight:'auto',
                backgroundImage: `url(${this.props.text})`
              }}
            >
              
            </a>
          </div>

         );
    }
}
class LoginModalLink extends Component {
    render() { 
        return (
            <Link component={LoginModal}>
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
       seen: false,
    };
    togglePop = () => {
       this.setState({
       seen: !this.state.seen
      });
    };

    render() { 
      return (		
          <div className = {styles.footerBackground}>	
            <p className = {styles.findUs}>Find us 		

              <img className = {styles.footerLogo} src = {facebookAndInstagramImg} alt="facebookAndInstagramImg" />
              <a href='https://www.facebook.com/Meals-For-Me-101737768566584' target="_blank"
              style={{
                position:'absolute',
                width:'50px',
                height:'50px',
                backgroundColor:'red',
                bottom:'0px',
                left:'200px',
                opacity:'0',
              }}/>

              <a href='https://www.instagram.com/mealsfor.me/?hl=en' target="_blank"
              style={{
                position:'absolute',
                width:'50px',
                height:'50px',
                backgroundColor:'red',
                bottom:'0px',
                left:'260px',
                opacity:'0',
              }}/>


            </p>
            <div className = {styles.footerRight}>
              <img onClick={() => this.togglePop()} style = {{width: '320px', height:'67px'}} src = {becomeAnAmbassadorImg} style = {{marginTop: '25px'}}/>			
            </div>


            {this.state.seen ? <AddMeals toggle={this.togglePop}/> : null}	



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
	  wantToLogin:false,
	  wantToSignUp:false,
	  seenForAmb: false,
    };
  }
  handleClick = () => {
    this.props.toggle();
  };
  togglePopWTL = () => {
       this.setState({
       wantToLogin: !this.state.wantToLogin
      });
  };
  togglePopWTS = () => {
       this.setState({
       wantToSignUp: !this.state.wantToSignUp
      });
  };  
  togglePopForAmb = () => {
       this.setState({
       seenForAmb: !this.state.seenForAmb
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
	/* this.setState({user_id:'anup'});
	this.setState({user_address: '214 Main Ave, San Jose, CA 91101'});*/
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
						<p style = {{font:'SF Pro', fontWeight:'bold', fontSize: '32px', textAlign: 'center', color:'black'}}>Love MealsFor.Me?</p>
						<p style = {{font:'SF Pro', fontSize: '18px', fontWeight:'bold', textAlign: 'center', color:'black'}}> Become an Ambassador</p>						
						<p className = {styles.ambassdorText} style= {{marginLeft: 'auto',marginRight:'auto', width:'437px', height:'117px', font: 'SF Pro', fontSize:'22px', fontWeight:'medium', textAlign: 'center'}}>Your friend(s) saves <span style={{color:'#F26522'}}>20%</span> on their first order and you save <span style={{color:'#F26522'}}>20%</span> on your next renewal <br/>+ <br/>Each time your friend renews, you get an additional <span style={{color:'#F26522'}}>5%</span> renewal bonus. Sign up 20 friends and eat for free!</p>
                        <br/><br/><br/><br/>			
              			<p style = {{display: 'inline', font: 'SF Pro', fontSize:'18px',fontWeight:'medium', textAlign: 'center', color: '#F26522', witdth:'50%'}}>Ambassador Name:</p>
						<p style = {{display: 'inline-block', verticalAlign: 'top', font: 'SF Pro',fontSize:'18px',fontWeight:'medium', textAlign: 'right', color: '#F26522', color:'black', marginLeft:'350px'}}>John Doe</p>
                        <form>
						<input style = {{border:'2px solid #F26522', borderRadius: '15px', width: '100%', padding: '5px'}} placeholder = "johndoe@gmail.com"/>
                        </form>
						<p style = {{font: 'SF Pro', fontSize:'18px', fontWeight:'medium', textAlign: 'center', color: '#F26522'}}>Your friends can use this email address as the Ambassador code when they sign up</p>
					</div>
				  </div>
				)} else {
					return (
					  <div className={styles.modal}>
						<div className={styles.modal_content}>
						  <span className={styles.close} onClick={this.handleClick}>
							<img src={closeIconImg}/>
						  </span>
							<p style = {{font:'SF Pro', fontSize: '32px', fontWeight:'bold', textAlign: 'center', color:'black'}}>Love MealsFor.Me?</p>
							<p style = {{font:'SF Pro', fontSize:'18px', fontWeight:'bold', textAlign: 'center', color:'black'}}> Become an Ambassador</p>
							<p style= {{marginLeft:'auto', marginRight:'auto', width:'437px', height:'117px', font: 'SF Pro', fontWeight:'medium', fontSize:'22px',textAlign: 'center'}}>Save money by helping others eat better. Become an ambassador by sharing MealsFor.Me with your friends. The more you share, the more you save.</p>
							<br/><br/>
							<img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src = {LTBAA}  onClick={this.togglePopLogin}/>
                            {this.state.wantToLogin ? <LoginModal toggle={this.togglePopWTL} /> : null}
							<p style = {{font: 'SF Pro', fontWeight:'bold', fontSize:'26px',textAlign: 'center', paddingTop:'15px'}}>OR</p>
							<img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src = {SUTBAA} onClick={() => this.togglePopSignup()}/>
                            {this.state.wantToSignUp ? <SignUpModal toggle={this.togglePopWTS} /> : null}
						</div>
					  </div>
				)}
		}) ()}
		</div>
    )
  }
}
class AddMeals extends Component {

  constructor(props){
    super();
    this.state = {
      user_id:'',
      user_address:'',
      login_seen:false,
      signUpSeen:false,
      wantToLogin:false,
      wantToSignUp:false,
	  seenForAM: false,	  
    hidden:1,
    username:''
    };
  }
  handleClick = () => {
    this.props.toggle();
  };
  togglePopWTL = () => {
       this.setState({
       wantToLogin: !this.state.wantToLogin
      });
  };
  togglePopWTS = () => {
       this.setState({
       wantToSignUp: !this.state.wantToSignUp
      });
  };  
  togglePopForAdd = () => {
       this.setState({
       seenForAM: !this.state.seenForAM
      });
    };  
  togglePopLogin = () => {

    this.setState({
     login_seen: !this.state.login_seen,
     hidden:0
    });

    if(!this.state.login_seen){
      this.setState({
        signUpSeen:false
      })
    }
  };

   togglePopSignup = () => {
    this.setState({
     signUpSeen: !this.state.signUpSeen,
     hidden:0
    });

    if(!this.state.signUpSeen){
      this.setState({
        login_seen:false
      })
    }
   };

   sendAmbassadorEmail(){
    let email = document.getElementById("becomeAmbassadorEmail").value
    // alert(document.getElementById("becomeAmbassadorEmail").value)
    axios
      .post(API_URL + 'brandAmbassador/create_ambassador',
        {
          code: email
        }).then(res=>{
          console.log(res)
        })
    
    alert('regisitered as ambassador')
    this.handleClick();


   }

  componentDidMount(){
    const customer_uid = Cookies.get("customer_uid");
    console.log(Cookies.get("customer_uid"))
    if(customer_uid){
      this.setState({user_id:customer_uid})
      axios
      .get(`${API_URL}Profile/${customer_uid}`)
      .then((response) => {

        console.log(response.data.result[0].customer_first_name)
        console.log(response.data.result[0].customer_last_name)

        const addr = response.data.result[0].customer_address.toLowerCase();
        this.setState({user_address: addr,
        username:response.data.result[0].customer_first_name+" "+ response.data.result[0].customer_last_name
        });
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
        <div
        className={styles.poploginsignup}
        >
          {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
          {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}
        </div>



        {(() => {
			if(this.state.user_id == "not login") {
					return (
              <div 
                style={{
                  opacity:this.state.hidden,
                  zIndex:4
                }}
              className={styles.becomeAnAmbassadorPopup}

              >

                <div
                style= 
                {{
                  position:'absolute',
                  width:'50px',
                  height:'50px',
                  backgroundColor:'red',
                  top:'20px',
                  right:'20px',
                  opacity:0
                }} 
                onClick={this.handleClick}
                />
                <div
                style= 
                  {{
                    position:'absolute',
                    width:'430px',
                    height:'80px',
                    backgroundColor:'#f26522',
                    top:'335px',
                    left:'78px',
                    opacity:1,
                    borderRadius:'15px',
                    textAlign:'center',
                    paddingTop:'20px',
                    color:'white',
                    fontSize:'25px'
                  }} 
                  onClick={() => this.togglePopLogin()}
                >
                  Login to become an ambassador
                  </div>

                {this.state.wantToLogin ? <LoginModal toggle={this.togglePopWTL} /> : null}

                <div 
                style={{
                  position:'absolute',
                  width:'430px',
                  height:'80px',
                  backgroundColor:'#f26522',
                  top:'473px',
                  left:'78px',
                  opacity:1,
                  borderRadius:'15px',
                  textAlign:'center',
                  paddingTop:'20px',
                  color:'white',
                  fontSize:'25px'
                }} 
                onClick={() => this.togglePopSignup()}>
                  Signup for MealsForMe    
                </div>  
                
                {this.state.wantToSignUp ? <SignUpModal toggle={this.togglePopWTS} /> : null}     

                           

              </div>
				)}else{
          return (
          <div
          className={styles.becomeAnAmbassadorPopupSignin}
          style={{
            zIndex:4
          }}
          >
            <div
              style= 
              {{
                position:'absolute',
                width:'50px',
                height:'50px',
                backgroundColor:'red',
                top:'10px',
                right:'5px',
                opacity:0
              }} 
              onClick={this.handleClick}
            />

            <div
              style= 
              {{
                position:'absolute',
                width:'200px',
                height:'30px',
                backgroundColor:'white',
                top:'390px',
                right:'40px',
                // opacity:0.5,
                color:'black',
                textAlign:'center',
                fontSize:'18px'
              }} 
              // onClick={this.handleClick}
            >
              {this.state.username}
            </div>
            <input
              style= 
              {{
                position:'absolute',
                width:'385px',
                height:'42px',
                backgroundColor:'white',
                top:'432px',
                right:'74px',
                border:'2px solid #F26522',
                borderRadius:'15px',
                outline:'none'
                // opacity:0.5
              }} 
              id='becomeAmbassadorEmail'
              placeholder="Enter your email here"
            />

            <div
              style= 
              {{
                position:'absolute',
                width:'410px',
                height:'75px',
                backgroundColor:'red',
                top:'560px',
                right:'60px',
                opacity:0
              }} 
              onClick={()=>this.sendAmbassadorEmail()}
            >
            </div>






          </div>
          )

        }
		}) ()}
		</div>
    )
  }
}
class SaveMeals extends Component {

  constructor(props){
    super();
    this.state = {
      user_id:'',
      user_address:'',
      login_seen:false,
      signUpSeen:false,
      wantToLogin:false,
      wantToSignUp:false,
	  seenForAM: false,	  
    };
  }
  handleClick = () => {
    this.props.toggle();
  };
  togglePopWTL = () => {
       this.setState({
       wantToLogin: !this.state.wantToLogin
      });
  };
  togglePopWTS = () => {
       this.setState({
       wantToSignUp: !this.state.wantToSignUp
      });
  };  
  togglePopForAdd = () => {
       this.setState({
       seenForAM: !this.state.seenForAM
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

  render() {
    return (
      <div>
        {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
        {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}
        {(() => {
			if(this.state.user_id == "not login") {
					return (
					  <div className={styles.modal}>
						<div className={styles.modal_content}>
			                <p className= {styles.ambassdorText} style = {{font:'SF Pro', fontSize: '24px', fontWeight:'medium', textAlign: 'left', color:'black'}}><span style={{color:'#F26522'}}>Save</span> allows you to select your meals up<br/> to 3 weeks in advance.</p>	
							<br/><br/>
						    <span onClick={this.handleClick}>
						       <img style = {{marginLeft:'80px'}} src={continueExploring}/>
			                </span>							
							<p style = {{marginLeft:'50px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Already a Customer?</p>
							<img style= {{display: 'block', marginLeft: '80px',marginTop:'-20px', marginRight: 'auto'}} src = {loginButton} onClick={() => this.togglePopLogin()}/>
                            {this.state.wantToLogin ? <LoginModal toggle={this.togglePopWTL} /> : null}
							<p style = {{marginLeft:'80px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Ready to start eating better?</p>
							<img style= {{display: 'block', marginLeft: '80px', marginTop:'-15px',marginRight: 'auto'}} src = {signupButton} onClick={() => this.togglePopSignup()}/>
                            {this.state.wantToSignUp ? <SignUpModal toggle={this.togglePopWTS} /> : null}                    

						</div>
					  </div>
				)}
		}) ()}
		</div>
    )
  }
}
class SurpriseMeals extends Component {

  constructor(props){
    super();
    this.state = {
      user_id:'',
      user_address:'',
      login_seen:false,
      signUpSeen:false, 
      wantToLogin:false,
      wantToSignUp:false,
	  seenForAM: false,	  
    };
  }
  handleClick = () => {
    this.props.toggle();
  };
  togglePopWTL = () => {
       this.setState({
       wantToLogin: !this.state.wantToLogin
      });
  };
  togglePopWTS = () => {
       this.setState({
       wantToSignUp: !this.state.wantToSignUp
      });
  };  
  togglePopForAdd = () => {
       this.setState({
       seenForAM: !this.state.seenForAM
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

  render() {
    return (
      <div>
        {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
        {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}

        {(() => {
			if(this.state.user_id == "not login") {
					return (
					  <div className={styles.modal}>
						<div className={styles.modal_content}>
			                <p className= {styles.ambassdorText} style = {{font:'SF Pro', fontSize: '24px', fontWeight:'medium', textAlign: 'left', color:'black'}}><span style={{color:'#F26522'}}>Surprise</span> means we’ll give you an <br/>assortment of meals on the specific <br/>delivery day.</p>	
							<br/><br/>
						    <span onClick={this.handleClick}>
						       <img style = {{marginLeft:'80px'}} src={continueExploring}/>
			                </span>	
							<p style = {{marginLeft:'50px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Already a Customer?</p>
							<img style= {{display: 'block', marginLeft: '80px',marginTop:'-20px', marginRight: 'auto'}} src = {loginButton} onClick={() => this.togglePopLogin()}/>
                            {this.state.wantToLogin ? <LoginModal toggle={this.togglePopWTL} /> : null}
							<p style = {{marginLeft:'80px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Ready to start eating better?</p>
							<img style= {{display: 'block', marginLeft: '80px', marginTop:'-15px',marginRight: 'auto'}} src = {signupButton} onClick={() => this.togglePopSignup()}/>
                            {this.state.wantToSignUp ? <SignUpModal toggle={this.togglePopWTS} /> : null}                    

						</div>
					  </div>
				)}
		}) ()}
		</div>
    )
  }
}
class SkipMeals extends Component {

  constructor(props){
    super();
    this.state = {
      user_id:'',
      user_address:'',
      login_seen:false,
      signUpSeen:false,
      wantToLogin:false,
      wantToSignUp:false,
	  seenForAM: false,	  
    };
  }
  handleClick = () => {
    this.props.toggle();
  };
  togglePopWTL = () => {
       this.setState({
       wantToLogin: !this.state.wantToLogin
      });
  };
  togglePopWTS = () => {
       this.setState({
       wantToSignUp: !this.state.wantToSignUp
      });
  };  
  togglePopForAdd = () => {
       this.setState({
       seenForAM: !this.state.seenForAM
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

  render() {
    return (
      <div>
        {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
        {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}

        {(() => {
			if(this.state.user_id == "not login") {
					return (
					  <div className={styles.modal}>
						<div className={styles.modal_content}>
			                <p className= {styles.ambassdorText} style = {{font:'SF Pro', fontSize: '24px', fontWeight:'medium', textAlign: 'left', color:'black'}}>Not at home or have other plans?<br/> Its easy to <span style={{color:'#F26522'}}>Skip</span> a delivery and we’ll<br/> automatically extend your subscription.</p>	
							<br/><br/>
						    <span onClick={this.handleClick}>
						       <img style = {{marginLeft:'80px'}} src={continueExploring}/>
			                </span>	
							<p style = {{marginLeft:'50px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Already a Customer?</p>
							<img style= {{display: 'block', marginLeft: '80px',marginTop:'-20px', marginRight: 'auto'}} src = {loginButton} onClick={() => this.togglePopLogin()}/>
                            {this.state.wantToLogin ? <LoginModal toggle={this.togglePopWTL} /> : null}
							<p style = {{marginLeft:'80px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Ready to start eating better?</p>
							<img style= {{display: 'block', marginLeft: '80px', marginTop:'-15px',marginRight: 'auto'}} src = {signupButton} onClick={() => this.togglePopSignup()}/>
                            {this.state.wantToSignUp ? <SignUpModal toggle={this.togglePopWTS} /> : null}                    
						</div>
					  </div>
				)}
		}) ()}
		</div>
    )
  }
}
class FavoriteMeal extends Component {

  constructor(props){
    super();
    this.state = {
      user_id:'',
      user_address:'',
      login_seen:false,
      signUpSeen:false, 
      wantToLogin:false,
      wantToSignUp:false,
	  seenForAM: false,
    };
  }
  handleClick = () => {
    this.props.toggle();
  };
  togglePopWTL = () => {
       this.setState({
       wantToLogin: !this.state.wantToLogin
      });
  };
  togglePopWTS = () => {
       this.setState({
       wantToSignUp: !this.state.wantToSignUp
      });
  };  
  togglePopForAdd = () => {
       this.setState({
       seenForAM: !this.state.seenForAM
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

  render() {
    return (
      <div>
        {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
        {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}

        {(() => {
			if(this.state.user_id == "not login") {
					return (
					  <div className={styles.modal}>
						<div className={styles.modal_content}>
			                <p className= {styles.ambassdorText} style = {{font:'SF Pro', fontSize: '24px', fontWeight:'medium', textAlign: 'left', color:'black'}}>Don’t forget your <span style={{color:'#F26522'}}>favorite</span> meals!<br/> Click the <img src ={heartImage}/> to easily find your favorite<br/> meals and get reminders.</p>	
							<br/><br/>
						    <span onClick={this.handleClick}>
						       <img style = {{marginLeft:'80px'}} src={continueExploring}/>
			                </span>	
							<p style = {{marginLeft:'50px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Already a Customer?</p>
							<img style= {{display: 'block', marginLeft: '80px',marginTop:'-20px', marginRight: 'auto'}} src = {loginButton} onClick={() => this.togglePopLogin()}/>
                            {this.state.wantToLogin ? <LoginModal toggle={this.togglePopWTL} /> : null}
							<p style = {{marginLeft:'80px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Ready to start eating better?</p>
							<img style= {{display: 'block', marginLeft: '80px', marginTop:'-15px',marginRight: 'auto'}} src = {signupButton} onClick={() => this.togglePopSignup()}/>
                            {this.state.wantToSignUp ? <SignUpModal toggle={this.togglePopWTS} /> : null}                    

						</div>
					  </div>
				)}
		}) ()}
		</div>
    )
  }
}
class CreateAccPWSU1 extends Component {
  constructor(props){
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
  render() {
    return (
      <div>
	    <div className={styles.modal3}>
		    <div className={styles.modal_content}>
			<p className= {styles.ambassdorText} style = {{font:'SF Pro', fontSize: '26px', fontWeight:'bold', textAlign: 'center', color:'black'}}>Create an account</p>	
			<br/>
			<img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom:'10px'}} src = {continueWithApple}/>
            <img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom:'10px'}} src = {continueWithFacebook}/>
            <img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src = {continueWithGoogle}/>
			<p style = {{font: 'SF Pro', fontWeight:'bold', fontSize:'26px',textAlign: 'center', color:'black'}}>OR</p>
            <div style= {{textAlign:'center'}}>
            <input type = 'credentials' style = {{border:'2px solid #F26522',marginBottom:'10px', width:' 428px', marginLeft: 'auto', marginRight: 'auto', borderRadius:'15px', padding:'10px'}} placeholder = "Create Password"/><br/>
            <input type = 'password' style = {{border:'2px solid #F26522', marginLeft: 'auto', width:' 428px',marginRight: 'auto', borderRadius:'15px', padding:'10px'}} placeholder = "Confirm Password"/>
			<br/><br/><br/>
			<img style= {{display: 'block', marginLeft: 'auto',marginRight: 'auto'}} src = {signupButton}/>
            </div>
			</div>
		</div>
		</div>
    )
  }	
}
class LoginModal extends Component {
  constructor(props){
    super();
  }	
  handleClick = () => {
    this.props.toggle();
  };	
  render() {
    return (
      <div>
	    <div className={styles.modal2}>
		    <div className={styles.modal_content}>
			<span className={styles.close} onClick={this.handleClick}>
			    <img src={closeIconImg}/>
			</span>
			<p className= {styles.ambassdorText} style = {{font:'SF Pro', fontSize: '26px', fontWeight:'bold', textAlign: 'center', color:'black'}}>Login</p>	
			<br/>
			<img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom:'10px'}} src = {continueWithApple}/>
            <img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom:'10px'}} src = {continueWithFacebook}/>
            <img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src = {continueWithGoogle}/>
			<p style = {{font: 'SF Pro', fontWeight:'bold', fontSize:'26px',textAlign: 'center', color:'black'}}>OR</p>
            <div style= {{textAlign:'center'}}>
            <input type = 'credentials' style = {{border:'2px solid #F26522',marginBottom:'10px', width:' 428px', marginLeft: 'auto', marginRight: 'auto', borderRadius:'15px', padding:'10px'}} placeholder = "Username"/><br/>
            <div><span>
            <input type = 'password' style = {{border:'2px solid #F26522', marginLeft: 'auto', width:' 428px',marginRight: 'auto', borderRadius:'15px', padding:'10px'}} placeholder = "Password"/>
            <a><i className='far fa-eye' id='togglePassword' style = {{color:'#F26522'}} onClick={this.viewPassword}></i></a>
            </span></div>
            <p style = {{font:'SF Pro', fontWeight:'medium', fontSize:'13px', color:'black'}}><u>Forgot password?</u></p>
			<br/>
			<img style= {{display: 'block', marginLeft: 'auto',marginRight: 'auto'}} src = {loginButton}/>
            </div>
			</div>
		</div>
		</div>
    )
  }	
}
class SignUpModal extends Component {
  constructor(props){
    super();
  }	
  handleClick = () => {
    this.props.toggle();
  };
  render() {
    return (
      <div>
	    <div className={styles.modal2}>
		    <div className={styles.modal_content}>
			<span className={styles.close} onClick={this.handleClick}>
				<img src={closeIconImg}/>
			</span>
			<p className= {styles.ambassdorText} style = {{font:'SF Pro', fontSize: '26px', fontWeight:'bold', textAlign: 'center', color:'black'}}>Sign up</p>	
			<br/>
			<img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom:'10px'}} src = {continueWithApple}/>
            <img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom:'10px'}} src = {continueWithFacebook}/>
            <img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src = {continueWithGoogle}/>
			<p style = {{font: 'SF Pro', fontWeight:'bold', fontSize:'26px',textAlign: 'center', color:'black'}}>OR</p>
            <div style= {{textAlign:'center'}}>
			<div style={{overflow: 'hidden', display:'inline-flex'}}>
            <input type = 'credentials' style = {{float:'left', border:'2px solid #F26522',marginBottom:'10px', width:' 214px', borderRadius:'15px', padding:'10px', marginRight:'10px'}} placeholder = "First Name"/><br/>
		    <input type = 'credentials' style = {{float:'right',border:'2px solid #F26522',marginBottom:'10px', width:' 214px', borderRadius:'15px', padding:'10px'}} placeholder = "Last Name"/><br/>
            </div><br/>
            <input type = 'credentials' style = {{border:'2px solid #F26522',marginBottom:'10px', width:' 428px', marginLeft: 'auto', marginRight: 'auto', borderRadius:'15px', padding:'10px'}} placeholder = "Email address"/><br/>
            <input type = 'credentials' style = {{border:'2px solid #F26522', marginLeft: 'auto', width:' 428px',marginRight: 'auto', borderRadius:'15px', padding:'10px'}} placeholder = "Confirm Email address"/><br/>
            <input type = 'credentials' style = {{border:'2px solid #F26522',marginBottom:'10px', width:' 428px', marginLeft: 'auto', marginRight: 'auto', borderRadius:'15px', padding:'10px'}} placeholder = "Create Password "/>
			<a><i className='far fa-eye' id='togglePassword' style = {{color:'#F26522'}} onClick={this.viewPassword}></i></a><br/>
            <input type = 'credentials' style = {{border:'2px solid #F26522', marginLeft: 'auto', width:' 428px',marginRight: 'auto', borderRadius:'15px', padding:'10px'}} placeholder = "Confirm Password"/>
            <a><i className='far fa-eye' id='togglePassword' style = {{color:'#F26522'}} onClick={this.viewPassword}></i></a>
            <p style = {{font:'SF Pro', fontWeight:'medium', fontSize:'13px', color:'black'}}><u>Forgot password?</u></p>
			<br/>
			<img style= {{display: 'block', marginLeft: 'auto',marginRight: 'auto'}} src = {signupButton}/>
            </div>
			</div>
		</div>
		</div>
    )
  }	
}
export {HomeLink, FootLink, AmbassadorLink, AddressLink, AddMeals, SaveMeals, SurpriseMeals, SkipMeals, FavoriteMeal, CreateAccPWSU1, LoginModal, SignUpModal};