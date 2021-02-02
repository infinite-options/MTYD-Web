import { useContext, useEffect, useReducer } from 'react';
import { CustomerContext } from './customerContext';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';

const initialState = {
  deliveryInfo: {
    order_instructions:'',
    delivery_instruction:'',
    delivery_first_name:'',
    delivery_last_name:'',
    delivery_phone_num:'',
    delivery_email:'',
    delivery_address:'',
    delivery_unit:'',
    delivery_city:'',
    delivery_state:'',
    delivery_zip:'',
    delivery_latitude:'',
    delivery_longitude:'',
  }
};

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_DELIVERY_INFO':
      return {
        ...state,
        deliveryInfo: action.payload,
      }
    default:
      return state;
  }
}

function DeliveryInfo() {
  const customerContext = useContext(CustomerContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const selectedPurchaseId = customerContext.state.purchaseId;
    if(selectedPurchaseId !== '') {
      axios
        .get(`${API_URL}get_delivery_info/${selectedPurchaseId}`)
        .then((response) => {
          const deliveryInfoApi = response.data.result[0];
          dispatch({ type: 'FETCH_DELIVERY_INFO', payload: deliveryInfoApi});
        })
        .catch((err) => {
          if(err.response) {
            // eslint-disable-next-line no-console
            console.log(err.response);
          }
          // eslint-disable-next-line no-console
          console.log(err);
        })
    }
  },[customerContext.state.purchaseId])

  return (
    <>
      <h5> Delivery Info </h5>
      <h6> Contact Information </h6>
      <p className='novSpace'>
        Name: {`${state.deliveryInfo.delivery_first_name} 
        ${state.deliveryInfo.delivery_last_name}`}
      </p>
      <p>
        Phone: {state.deliveryInfo.delivery_phone_num}
      </p>
      <h6> Address Info </h6>
      <p className='novSpace'>
        {`${state.deliveryInfo.delivery_address} ${state.deliveryInfo.delivery_unit}`}
      </p>
      <p>
        {`${state.deliveryInfo.delivery_city}
        ${state.deliveryInfo.delivery_state} ${state.deliveryInfo.delivery_zip}`} </p>
      <h6> Instructions </h6>
      <p> {state.deliveryInfo.delivery_instructions} &nbsp; </p>
      <h6> Notes </h6>
      <p> {state.deliveryInfo.order_instructions} &nbsp; </p>
    </>
  )
}

export default DeliveryInfo;