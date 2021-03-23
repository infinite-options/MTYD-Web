import React from "react";
import { GoogleMap, withScriptjs, withGoogleMap } from "react-google-maps";

function Map() {
  return (
    <GoogleMap 
      defaultZoom={10} 
      defaultCenter={{ lat: 37.2270928, lng: -121.8866517 }} 
    />
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export {WrappedMap};