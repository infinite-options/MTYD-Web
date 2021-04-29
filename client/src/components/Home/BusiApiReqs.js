import axios from 'axios';
import Cookies from 'universal-cookie';
import {API_URL} from "../../reducers/constants";

export default class BusiApiReqs {
  /*BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;*/
  BASE_URL = `${API_URL}upcoming_menu`;
  cookies = new Cookies();

  /*getItems = async function () {
    return await axios
      .get(this.BASE_URL)
      .then((response) => {
        return Promise.resolve(response.length !== 0 ? response.data : {});
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };*/

  getItems = async function () {
    return await axios
      .get(this.BASE_URL)
      .then((response) => {
        console.log('getMeals API: ', response);
        if (response.data.result.length !== 0)
          return Promise.resolve(response.data.result);
        else return Promise.resolve([]);
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  /*getItems = async function () {
	/*itemTypes, businessIds*/
    /*let reqBody = {
      type: itemTypes,
      ids: businessIds,
    };
    return await axios
      .get(this.BASE_URL)
      .then((response) => {
        console.log('getMeals API: ', response);
        if (response.data.result.length !== 0)
          return Promise.resolve(response.data.result);
        else return Promise.resolve([]);
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  }; */ 
}
