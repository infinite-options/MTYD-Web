import React from "react";
import {Provider} from "react-redux";
import store from "./reducers/store";
import {
  BrowserRouter as Router,
  // Route, Redirect,
  Switch
} from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";

import Landing from "./components/Landing";
import SignUp from "./components/SignUp";
import SocialSignUp from "./components/SocialSignUp";
import ChoosePlan from "./components/ChoosePlan";
import MealPlan from "./components/MealPlan";
import PaymentDetails from "./components/PaymentDetails";
import Profile from "./components/Profile";
import SelectMeal from "./components/SelectMeal";
import About from "./components/About";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import "./App.css";
import AuthApi from "./components/AuthApi";
import Cookies from "js-cookie";

import createBrowserHistory from "history/createBrowserHistory";

export const history = createBrowserHistory();

function App() {
  const [auth, setAuth] = React.useState(false);
  const readCookie = () => {
    const customer = Cookies.get("customer_uid");
    // console.log(customer);
    if (customer) {
      setAuth(true);
    }
  };

  React.useEffect(() => {
    readCookie();
  }, []);

  return (
    <div className='root'>
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <AppliedRoute exact path='/home' component={Home} />
            <AppliedRoute exact path='/about' component={About} />
            <AppliedRoute exact path='/' component={Landing} />
            <AppliedRoute exact path='/sign-up' component={SignUp} />
            <AppliedRoute
              exact
              path='/social-sign-up'
              component={SocialSignUp}
            />
            <AppliedRoute exact path='/choose-plan' component={ChoosePlan} />
            <AppliedRoute exact path='/meal-plan' component={MealPlan} />
            <AppliedRoute
              exact
              path='/payment-details'
              component={PaymentDetails}
            />
            <AppliedRoute exact path='/profile' component={Profile} />
            <AppliedRoute exact path='/select-meal' component={SelectMeal} />
            <AppliedRoute path='*' component={NotFound} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
