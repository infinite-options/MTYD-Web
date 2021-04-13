import React from "react";
import { GoogleMap, withScriptjs, withGoogleMap } from "react-google-maps";

function Map(props) {
  return (
    <GoogleMap 
      defaultZoom={10} 
      defaultCenter={{ lat: props.latitude, lng: props.longitude }} 
      center={{ lat: props.latitude, lng: props.longitude }}
    />
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export {WrappedMap};