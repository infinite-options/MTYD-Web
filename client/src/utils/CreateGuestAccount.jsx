import axios from 'axios';
import { API_URL } from "../reducers/constants";

export default async function createGuestAccount(data, _callback) {

    //createAccount w/ info from guest
    //=> response gives customerUid
    //=> call profile endpoint w/ new customerUid
    //=> response gives hashed_password
    //=> use hashed_password as salt in checkout JSON object

    console.log("CreateGuestAccount data: " + JSON.stringify(data));

    let streetNum = data.address.substring(0,data.address.indexOf(" "));
    console.log("Street num: " + streetNum);

    let guestPassword = data.first_name + streetNum;

    console.log("password: '" + guestPassword + "'");

    data["password"] = guestPassword;

    console.log("Guest sign up POST data: ", data);
            
    axios
      .post(API_URL + "createAccount", data)
      .then(res1 => {
        console.log("guest create account response: " + JSON.stringify(res1));
        if(res1.data.code >= 400 && res1.data.code <= 599){
          //_callback(res);
          console.log("Error trying to create guest account");
          _callback(res1.data);
        } else {
          axios.post(process.env.REACT_APP_SERVER_BASE_URI+'email_verification', {email: data.email})
            .then(res2 => {
              console.log("verification response: ", res2)
            })
            .catch(err => {
              console.log("verification error: ", err)
            });
          console.log("guest account created successfully");
          if (typeof(_callback) !== "undefined") {
            console.log("guest account created, hashing password...");
            _callback(res1);
          }
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response) {
          console.log(err.response);
        }
      });

  };

