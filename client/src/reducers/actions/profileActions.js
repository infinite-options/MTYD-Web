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
    console.log("here: ", purchaseId);
    for (let id of purchaseId) {
      console.log("there and here");
      const res = await axios(`${API_URL}pid_history/${id}`);
      await dispatch({
        type: FETCH_ORDER_HISTORY,
        payload: {[id]: res.data.result}
      });
    }
  } catch (err) {
    console.log(err);
  }
};
