import axios from 'axios';

export default async function createGuestAccount(data, _callback) {

    //createAccount w/ info from guest
    //=> response gives customerUid
    //=> call profile endpoint w/ new customerUid
    //=> response gives hashed_password
    //=> use hashed_password as salt in checkout JSON object

    console.log("CreateGuestAccount data: " + JSON.stringify(data));

    let streetNum = data.address.substring(0,data.address.indexOf(" "));
    let guestPassword = data.first_name + streetNum;

    console.log("password: '" + guestPassword + "'");

    data["password"] = guestPassword;

    /*let object = {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phone,
      address: data.street,
      unit: data.unit,
      city: data.city,
      state: data.state,
      zip_code: data.zip,
      latitude: data.latitude,
      longitude: data.longitude,
      referral_source: "WEB",
      role: "CUSTOMER",
      social: "FALSE",
      social_id: "NULL",
      user_access_token: "FALSE",
      user_refresh_token: "FALSE",
      mobile_access_token: "FALSE",
      mobile_refresh_token: "FALSE"
    };*/
    console.log("Guest sign up POST data: " + JSON.stringify(data));
            
            axios
              .post(process.env.REACT_APP_SERVER_BASE_URI + "createAccount", data)
              .then(res => {
                console.log("guest create account response: " + JSON.stringify(res));
                if(res.data.code >= 400 && res.data.code <= 599){
                  //_callback(res);
                  console.log("Error trying to create guest account");
                } else {
                  axios.post(process.env.REACT_APP_SERVER_BASE_URI+'email_verification', {email: data.email})
                    .then(res => {
                      console.log(res)
                    })
                    .catch(err => {
                      console.log(err)
                    });
                  console.log("guest account created successfully");
                  if (typeof(_callback) !== "undefined") {
                    console.log("guest account created, hashing password...");
                    _callback(guestPassword);
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

