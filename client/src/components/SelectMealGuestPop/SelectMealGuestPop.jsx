import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';

export class SelectMealGuestPop extends Component {
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
        <div
            style={{
              position:'absolute',
              top:'43px',
              left:'20px',
              width:'344px',
              height:'69px',
              fontSize:'18px',
              // backgroundColor:'gray',
              fontWeight:'500'
            }}
          >
            {/* {this.props.message} */}
            Looks like you're enjoying
            <span style={{color: '#F26522'}}>MealsFor.me</span>!
            The  
            <div style={{border:'1px solid', 
            height:'20px', 
            width:'30px',
            display:'inline-block',
            marginLeft:'5px',
            textAlign:'center',
            verticalAlign:'normal'
            // position:'abso'
            // marginTop:'2px'
            }}/>
            + 
            buttons help add / remove meals from your meal plan.
          </div>

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
             top:'330px',
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
          >
              Sign up
          </div>




      </div>
    )
  }
}

export default (withRouter(SelectMealGuestPop))
