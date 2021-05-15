import React, { Component } from 'react'

export class UnloginSkip extends Component {
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
          >

          Not at home or have other plans? Its easy to 
          <span style={{color: '#F26522'}}> Skip</span>!
          a delivery and we’ll automatically extend your subscription.
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
           onclick = {this.handleClick}
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
          >
              Sign up
          </div>




      </div>
    )
  }
}

export default UnloginSkip
