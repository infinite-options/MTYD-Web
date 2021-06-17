import axios from 'axios';

//TODO: Use the point field
export default async function checkoutItems(data, _callback) {

    // POST to checkout endpoint
    console.log('===> checkout data: ', JSON.stringify(data));

    axios
      .post(
        process.env.REACT_APP_SERVER_BASE_URI + 'checkout',
        data
      )
      .then((res) => {
        console.log("Checkout complete; response: ", res);
        _callback(res, true);
      })
      .catch((err) => {
        console.log(
          'error happened while posting to checkoutapi',
          err
        );
        if(err.fakepropertythatsnotreal){
          console.log("not going to get printed");
        } else if(err.response.data.message){
          console.log("err.response.data.message: ", err.response.data.message);
          // console.log("stringified err.response: ", JSON.stringify(err.response));
          _callback(err.response.data.message, false);
        } else if(err.response){
          console.log("err.response: ", err.response);
          console.log("stringified err.response: ", JSON.stringify(err.response));
          _callback(JSON.stringify(err.response), false);
        }
        _callback(err, false);
      });

}

