import axios from 'axios';
import fetchAddressCoordinates from './FetchAddressCoordinates';
import hashPassword from './HashPassword';

//TODO: Use the point field
export default async function checkoutItems(data, _callback) {

    // POST to checkout endpoint
    /*const checkoutData = {
      customer_uid: data.customerId,
      business_uid: '200-000001',
      items,
      salt: "",
      order_instructions: 'fast',
      delivery_instructions: props.deliveryInstructions,
      delivery_first_name: props.firstName,
      delivery_last_name: props.lastName,
      delivery_phone: props.phone,
      delivery_email: props.email,
      delivery_address: props.address.street,
      delivery_unit: props.unit,
      delivery_city: props.city,
      delivery_state: props.state,
      delivery_zip: props.zip,
      delivery_latitude: '37.2270928',
      delivery_longitude: '-121.8866517',
      purchase_notes: 'purchase_notes',
      amount_due: '1',
      amount_discount: '0',
      amount_paid: '1',
      cc_num: 'NULL',
      cc_exp_year: 'NULL',
      cc_exp_month: 'NULL',
      cc_cvv: 'NULL',
      cc_zip: 'NULL',
      charge_id: 'testRun',
      payment_type: 'PAYPAL',
      service_fee: '2',
      delivery_fee: '3',
      tip: '4',
      tax: '5',
      subtotal: '2'
    };*/
    console.log('checkout data: ', data);

    axios
      .post(
        process.env.REACT_APP_SERVER_BASE_URI + 'checkout',
        data
      )
      .then(() => {
        console.log("Checkout complete");
        _callback();
      }).catch((err) => {
        console.log(
          'error happened while posting to checkoutapi',
          err
        );
        if(err.response){
          console.log("err.response: " + JSON.stringify(err.response));
        }
      });

}

