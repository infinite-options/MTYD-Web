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
						<input style = {{border:'2px solid #F26522', borderRadius: '15px', width: '100%', padding: '5px'}} placeholder = "johndoe@gmail.com"/>
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
							<img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src = {LTBAA}/>
							<p style = {{font: 'SF Pro', fontWeight:'bold', fontSize:'26px',textAlign: 'center', paddingTop:'15px'}}>OR</p>
							<img style= {{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src = {SUTBAA}/>
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
			                <p style = {{font:'SF Pro', fontSize: '24px', fontWeight:'medium', textAlign: 'left', color:'black'}}>Looks like you’re enjoying MealsFor.Me!<br/> The <img src = {negativeSign}/> <img src ={positiveSign}/> buttons help you add / <br/>remove meals from your meal plan.</p>	
							<br/><br/>
							<img style= {{display: 'block', marginLeft: '80px', marginRight: 'auto'}} src = {continueExploring}/>
							<p style = {{marginLeft:'50px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Already a Customer?</p>
							<img style= {{display: 'block', marginLeft: '80px',marginTop:'-20px', marginRight: 'auto'}} src = {loginButton}/>
							<p style = {{marginLeft:'80px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Ready to start eating better?</p>
							<img style= {{display: 'block', marginLeft: '80px', marginTop:'-15px',marginRight: 'auto'}} src = {signupButton}/>
						</div>
					  </div>
				)}
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
							<img style= {{display: 'block', marginLeft: '80px', marginRight: 'auto'}} src = {continueExploring}/>
							<p style = {{marginLeft:'50px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Already a Customer?</p>
							<img style= {{display: 'block', marginLeft: '80px',marginTop:'-20px', marginRight: 'auto'}} src = {loginButton}/>
							<p style = {{marginLeft:'80px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Ready to start eating better?</p>
							<img style= {{display: 'block', marginLeft: '80px', marginTop:'-15px',marginRight: 'auto'}} src = {signupButton}/>
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
							<img style= {{display: 'block', marginLeft: '80px', marginRight: 'auto'}} src = {continueExploring}/>
							<p style = {{marginLeft:'50px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Already a Customer?</p>
							<img style= {{display: 'block', marginLeft: '80px',marginTop:'-20px', marginRight: 'auto'}} src = {loginButton}/>
							<p style = {{marginLeft:'80px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Ready to start eating better?</p>
							<img style= {{display: 'block', marginLeft: '80px', marginTop:'-15px',marginRight: 'auto'}} src = {signupButton}/>
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
							<img style= {{display: 'block', marginLeft: '80px', marginRight: 'auto'}} src = {continueExploring}/>
							<p style = {{marginLeft:'50px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Already a Customer?</p>
							<img style= {{display: 'block', marginLeft: '80px',marginTop:'-20px', marginRight: 'auto'}} src = {loginButton}/>
							<p style = {{marginLeft:'80px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Ready to start eating better?</p>
							<img style= {{display: 'block', marginLeft: '80px', marginTop:'-15px',marginRight: 'auto'}} src = {signupButton}/>
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
							<img style= {{display: 'block', marginLeft: '80px', marginRight: 'auto'}} src = {continueExploring}/>
							<p style = {{marginLeft:'50px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Already a Customer?</p>
							<img style= {{display: 'block', marginLeft: '80px',marginTop:'-20px', marginRight: 'auto'}} src = {loginButton}/>
							<p style = {{marginLeft:'80px',font: 'SF Pro', fontWeight:'bold', fontSize:'18px',textAlign: 'left', paddingTop:'15px', color:'black'}}>Ready to start eating better?</p>
							<img style= {{display: 'block', marginLeft: '80px', marginTop:'-15px',marginRight: 'auto'}} src = {signupButton}/>
						</div>
					  </div>
				)}
		}) ()}
		</div>
    )
  }
}
export {HomeLink, FootLink, AmbassadorLink, AddressLink, AddMeals, SaveMeals, SurpriseMeals, SkipMeals, FavoriteMeal};