import axios from 'axios';
import {BING_LOCATION_API_URL} from '../reducers/constants';

//TODO: Use the point field
export default async function fetchAddressCoordinates(address, city, state, zip, _callback) {
  let latitude, longitude;

  axios
    .get(BING_LOCATION_API_URL, {
      params: {
        CountryRegion: 'US',
        adminDistrict: state,
        locality: city,
        postalCode: zip,
        addressLine: address,
        key: process.env.REACT_APP_BING_LOCATION_KEY,
      },
    })
    .then(res => {
      let locationApiResult = res.data;

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

        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);
        _callback({ latitude, longitude });
      }
      
    })
    .catch(err => {
      console.log(err);
      if (err.response) {
        console.log(err.response);
      }
      _callback(err.response);
    });

}

