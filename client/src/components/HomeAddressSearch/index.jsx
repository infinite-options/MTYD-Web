import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios';
import Popsignup from '../PopSignup';
import {Redirect, withRouter} from 'react-router-dom';
import close from '../../images/closeIcon.png'

const google = window.google;

export class HomeMap extends Component {

  constructor(props){
    super(props);
    this.map = null;
    this.autocomplete = null;
    this.state={
      lat:'',
      lng:'',
      hooray:false,
      stillGrowing:false,
      signup:false,
    }
  }

  togglePopLogin = () => {
    this.setState({
     signup: !this.state.signup,
    });
   };


  componentDidMount(){

    const input = document.getElementById("pac-input");

    const options = {
      componentRestrictions: { country: "us" },
      fields: ["formatted_address", "geometry", "name"],

      strictBounds: false,
    };

    const autocomplete = new google.maps.places.Autocomplete(input, options);

    // console.log(autocomplete)

    autocomplete.addListener("place_changed", () => {

      const place = autocomplete.getPlace();

      this.setState({
        lat:place.geometry.location.lat(),
        lng:place.geometry.location.lng(),
      })

      console.log(this.state)
  
      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      axios.get(`https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/categoricalOptions/${this.state.lng},${this.state.lat}`)
      .then(res=>{
        console.log(res)
        if(res.data.result.length==0){
          // alert('cannot deliver to this address')
          this.setState({
            stillGrowing:true
          })
          console.log('cannot deliver to this address')
        }else{
          this.setState({
            hooray:true
          })
          console.log('we can deliver to this address')
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  
    });

  }



  render() {
    return (
      <div
        style={{
          display:'block',
          width:'300px',
          height:'200px'
        }}
      >
        {this.state.signup ? <Popsignup toggle={this.togglePopLogin}/> : null}


        {this.state.hooray?
        // {/* {true? */}
        <div 
          style={{
            position:'absolute',
            width:'384px',
            height:'371px',
            backgroundColor:'white',
            border:'2px solid #F26522',
            left:'65%',
            top:'40%'
          }}
        >

          <div className="close" onClick={()=>{this.setState({hooray:false})}}/>

          <div
           style={{
             position:'relative',
             top:'29px',
             left:'144px',
             width:'96px',
             height:'31px',
             fontSize:'26px',
             fontWeight:'bold',
           }}
          >
            Hooray!
          </div>

          <div
           style={{
             position:'relative',
             top:'57px',
             left:'27px',
             width:'330px',
             height:'69px',
             fontSize:'18px',
             textAlign:'center',
            //  fontWeight:'',
           }}
          >
            Looks like we deliver to your address. Click the button below to see the variety of meals we offer.
          </div>

          <div
           style={{
             position:'relative',
             top:'100px',
             left:'92px',
             width:'200px',
             height:'50px',
             fontSize:'18px',
             textAlign:'center',
             backgroundColor:'#F26522',
             color:'white',
             paddingTop:'10px',
             borderRadius:'15px'
            //  fontWeight:'',
           }}

           onClick={()=>{this.props.history.push('/select-meal')}}
          >
              Explore Meals
          </div>

          <div
           style={{
             position:'relative',
             top:'113px',
             left:'92px',
             width:'200px',
             height:'50px',
             fontSize:'18px',
             textAlign:'center',
             backgroundColor:'#F26522',
             color:'white',
             paddingTop:'10px',
             borderRadius:'15px'
            //  fontWeight:'',
           }}

           onClick={()=>{this.setState({signup:true,hooray:false})}}
          >
              Sign up
          </div>


        </div>:null}







        {this.state.stillGrowing?<div 
        style={{
          position:'absolute',
          width:'500px',
          height:'500px',
          backgroundColor:'#b942f5',
          left:'30%',
          top:'20%'
        }}
        onClick={()=>{this.setState({stillGrowing:false})}}>
          
          nope
          </div>
          :null}


        <div id="pac-container">
          <input 
          id="pac-input" 
          type="text" 
          placeholder="Enter a location" 
          style = 
          {{width: '320px', 
          height: '57px', 
          borderRadius:'10px', 
          fontSize: '25px',
          border:'1px solid',
          textAlign:'center',
          color:'black',
          marginLeft: '40px', 
          marginTop: '-30px', 
          marginBottom:'15px', 
          borderRadius:'10px'
          }}/>

          <button
            style = 
            {{width: '320px', 
            height: '57px', 
            borderRadius:'10px', 
            fontSize: '25px',
            border:'none',
            textAlign:'center',
            color:'white',
            marginLeft: '40px', 
            marginBottom:'15px', 
            borderRadius:'10px',
            backgroundColor:'#ff6505'
            }}

          >
            <a href='/select-meal'
            style={{
              color:'white',
              marginLeft:'95px',
              textAlign: 'center',
            }}
            >View Meals</a>
          </button>

        </div>
      </div>
      
    )
  }
}

export default withRouter(HomeMap)
