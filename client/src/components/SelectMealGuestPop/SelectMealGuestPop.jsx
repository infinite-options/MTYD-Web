import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
import negativeSign from '../../images/Group 504.png';
import positiveSign from '../../images/Group 505.png';

export class SelectMealGuestPop extends Component {
  constructor(props){
    super();
    this.handleClick= this.handleClick.bind(this)
  }

  handleClick () {
    this.props.closeFunction();
  };

  render() {
    return (
      <div 
      style={{
        position:'absolute',
        width:'384px',
        height:'445px',
        backgroundColor:'white',
        border:'2px solid #F26522',
        left:'40%',
        top:'30%',
        zIndex:99
      }}
      >
        <p 
          style = {{
            font:'SF Pro',
            fontSize: '18px', 
            fontWeight:'normal', 
            textAlign: 'left', 
            color:'black',
            paddingLeft:'20px',
            paddingRight:'20px',
            paddingTop:'43px'

          }}
          >Looks like you’re enjoying 
          <span style={{color: '#F26522'}}>MealsFor.me</span>!
          <br/> 
          The <img style={{width:'30px',height:'26px'}}src = {negativeSign}/> <img style={{width:'30px',height:'18px'}}src ={positiveSign}/> buttons 
          help you add / <br/>remove meals from your meal plan.
        </p>


          <div
           style={{
             position:'absolute',
             top:'144px',
             left:'32px',
             width:'320px',
             height:'50px',
             fontSize:'18px',
             textAlign:'center',
             backgroundColor:'#F26522',
             color:'white',
             paddingTop:'10px',
             borderRadius:'15px'
            //  fontWeight:'',
           }}
           onClick = {this.handleClick}
          >
              Continue Exploring
          </div>

          <div
           style={{
             position:'absolute',
             top:'214px',
             left:'32px',
             width:'150px',
             height:'20px',
             fontSize:'14px',
             textAlign:'center',
             borderRadius:'15px'
            //  fontWeight:'',
           }}
          >
              Already a Customer?
          </div>

          <div
           style={{
             position:'absolute',
             top:'237px',
             left:'32px',
             width:'320px',
             height:'50px',
             fontSize:'18px',
             textAlign:'center',
             backgroundColor:'#F26522',
             color:'white',
             paddingTop:'10px',
             borderRadius:'15px'
            //  fontWeight:'',
           }}
           onClick = {this.props.login}
          >
              Login
          </div>

          <div
           style={{
             position:'absolute',
             top:'307px',
             left:'32px',
             width:'200px',
             height:'20px',
             fontSize:'14px',
             textAlign:'center',
             borderRadius:'15px'
            //  fontWeight:'',
           }}
          >
              Ready to start eating better?
          </div>

          <div
           style={{
             position:'relative',
             top:'200px',
             left:'32px',
             width:'320px',
             height:'50px',
             fontSize:'18px',
             textAlign:'center',
             backgroundColor:'#F26522',
             color:'white',
             paddingTop:'10px',
             borderRadius:'15px'
            //  fontWeight:'',
           }}
           onClick = {this.props.signup}
          >
              Sign up
          </div>




      </div>
    )
  }
}

export default (withRouter(SelectMealGuestPop))
