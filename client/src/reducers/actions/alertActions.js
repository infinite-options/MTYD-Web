import {v4 as uuidv4} from "uuid";
import {SET_ALERT, REMOVE_ALERT} from "../actions/alertTypes";
//import {setMsg} from "../../components/PopLogin/index.jsx";

export const setAlert = (type, msg) => dispatch => {
  const id = uuidv4();
  console.log("setAlert is called");
  console.log("message: ", msg);
  //setMsg(msg);
  dispatch({type: SET_ALERT, payload: {type, msg, id}});
  setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), 10000);
};
