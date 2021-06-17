import React, { Component } from 'react'
import PropTypes from 'prop-types'


const google = window.google;

export class MapTest extends Component {

  constructor(props){
    super(props);
    this.map = null;
    this.autocomplete = null;
  }


  componentDidMount(){
    // const map = new google.maps.Map(document.getElementById("map"), {
    //   center: { lat: 37.3382, lng: -121.893028},
    //   zoom: 13,
    // });
    // console.log(map)

    const input = document.getElementById("pac-input");

    const options = {
      componentRestrictions: { country: "us" },
      // fields: ["formatted_address", "geometry", "name"],
      // origin: map.getCenter(),
      // strictBounds: false,
    };

    const autocomplete = new google.maps.places.Autocomplete(input, options);

    console.log(autocomplete)

    // autocomplete.bindTo("bounds", map);
    // const infowindow = new google.maps.InfoWindow();
    // // const infowindowContent = document.getElementById("infowindow-content");
    // // infowindow.setContent(infowindowContent);
    // const marker = new google.maps.Marker({
    //   map,
    //   anchorPoint: new google.maps.Point(0, -29),
    // });

    autocomplete.addListener("place_changed", () => {
      // infowindow.close();
      // marker.setVisible(false);
      const place = autocomplete.getPlace();
  
      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
  
      // If the place has a geometry, then present it on a map.
      // if (place.geometry.viewport) {
      //   map.fitBounds(place.geometry.viewport);
      // } else {
      //   map.setCenter(place.geometry.location);
      //   map.setZoom(17);
      // }
      // marker.setPosition(place.geometry.location);
      // marker.setVisible(true);
      // infowindowContent.children["place-name"].textContent = place.name;
      // infowindowContent.children["place-address"].textContent =
      //   place.formatted_address;
      // infowindow.open(map, marker);
    });



  }


  render() {
    return (
      <div>
        <div id="pac-container">
          <input id="pac-input" type="text" placeholder="Enter a location" aria-label="enter a location" title="enter a location"/>
        </div>
        <div style={{ width: 1800, height: 900 }} id="map" />


      </div>
      
    )
  }
}

export default MapTest
