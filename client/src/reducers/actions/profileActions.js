import axios from "axios";

import {LOGOUT_PROFILE, FETCH_ORDER_HISTORY} from "./profileTypes";

import {API_URL} from "../constants";

export const resetProfile = () => dispatch => {
  dispatch({
    type: LOGOUT_PROFILE
  });
};

export const fetchOrderHistory = purchaseId => async dispatch => {
  // Change 100-000001 to other customers when log in implemented
  try {
    let object = {};
    console.log("fetchOrderHistory purchaseId: " + purchaseId);
    for (let id of purchaseId) {
      const res = await axios(`${API_URL}pid_history/${id}`);
      object[id] = res.data.result;
    }
    //console.log("fetchOrderHistory object: " + JSON.stringify(object));
    await dispatch({
      type: FETCH_ORDER_HISTORY,
      payload: object
    });
  } catch (err) {
    console.log(err);
  }
};
