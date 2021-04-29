import React, { Component } from 'react'
import PropTypes from 'prop-types'


const google = window.google;

export class HomeMap extends Component {

  constructor(props){
    super(props);
    this.map = null;
    this.autocomplete = null;
  }


  componentDidMount(){

    const input = document.getElementById("pac-input");

    const options = {
      componentRestrictions: { country: "us" },
      fields: ["formatted_address", "geometry", "name"],

      strictBounds: false,
    };

    const autocomplete = new google.maps.places.Autocomplete(input, options);

    console.log(autocomplete)

    autocomplete.addListener("place_changed", () => {

      const place = autocomplete.getPlace();
  
      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
  
    });



  }


  render() {
    return (
      <div>
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

          }}


          />
        </div>
      </div>
      
    )
  }
}

export default HomeMap
