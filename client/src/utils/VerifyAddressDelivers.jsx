import axios from 'axios';
import {BING_LOCATION_API_URL} from '../reducers/constants';
import { API_URL } from "../reducers/constants";

//TODO: Use the point field
export default async function verifyAddressDelivers(address, city, state, zip, _callback) {
  let latitude, longitude;

  // console.log("(VAD) getting lat and lon...");

  axios
    .get(BING_LOCATION_API_URL, {
      params: {
        CountryRegion: 'US',
        adminDistrict: state,
        locality: city,
        postalCode: zip,
        addressLine: address,
        key: process.env.REACT_APP_BING_LOCATION_KEY,
        strictMatch: 1
      },
    })
    .then(res => {
      console.log("(VAD) in then");

      let locationApiResult = res.data;

      console.log("(VAD) fetchAddressCoordinates res: ", res);

      if (locationApiResult.statusCode === 200) {
        let locations = locationApiResult.resourceSets[0].resources;
        /* Possible improvement: choose better location in case first one not desired */
        let location = locations[0];
        latitude = location.geocodePoints[0].coordinates[0];
        longitude = location.geocodePoints[0].coordinates[1];
        if (location.geocodePoints.length === 2) {
          latitude = location.geocodePoints[1].coordinates[0];
          longitude = location.geocodePoints[1].coordinates[1];
        }

        let api_address = location.address.addressLine.toUpperCase();
        let api_state = location.address.adminDistrict.toUpperCase();
        let api_city = location.address.locality.toUpperCase();
        let api_zip = location.address.postalCode;

        // if API found a location, but the params don't match
        if(
          api_address !== address.toUpperCase() ||
          api_state !== state.toUpperCase() ||
          api_city !== city.toUpperCase() ||
          api_zip !== zip
        ){
          console.log("input doesn't match ");
          _callback(null, null);
        } else {
          console.log("Latitude: " + latitude);
          console.log("Longitude: " + longitude);
          axios
            .get(
              `${API_URL}categoricalOptions/${longitude},${latitude}`
            )
            .then((response) => {
              console.log("(VAD) Categorical Options response: ", response);
              if (response.data.result.length !== 0) {
                _callback(latitude, longitude);
              } else {
                _callback(null, null);
              }
            })
            .catch((err) => {
              if (err.response) {
                console.log(err.response);
              }
              console.log(err);
              _callback(null, null);
            });
        }

      } else {
        console.log("(VAD) location api error");
        _callback(null, null);
      }
      
    })
    .catch(err => {
      console.log("(VAD) in catch");

      console.log("(VAD) error: ", err);
      if (err.response) {
        console.log(err.response);
      }
      _callback(null, null);
    });

}

