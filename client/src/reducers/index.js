// File for root reducer

import {combineReducers} from "redux";
import loginReducer from "./loginReducer";
import subscriptionReducer from "./subscriptionReducer";
import profileReducer from "./profileReducer";
import alertReducer from "./alertReducer";

export default combineReducers({
  //reducers
  login: loginReducer,
  subscribe: subscriptionReducer,
  profile: profileReducer,
  alert: alertReducer
});
