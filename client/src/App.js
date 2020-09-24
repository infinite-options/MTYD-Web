import React from "react";
import { Provider } from "react-redux";
import store from "./reducers/store";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import { SideNavBar, BottomNavBar } from "./components/NavBar";
import Landing from "./components/Landing";
import SignUp from "./components/SignUp";
import SocialSignUp from "./components/SocialSignUp";
import ChoosePlan from "./components/ChoosePlan";
import PaymentDetails from "./components/PaymentDetails";
import Profile from "./components/Profile";
import SelectMeal from "./components/SelectMeal";
import NotFound from "./components/NotFound";
import "./App.css";
import AuthApi from "./components/AuthApi";
import Cookies from "js-cookie";

const ProtectedRoute = ({ auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => (auth ? <Component /> : <Redirect to='/' />)}
    />
  );
};

const Routes = () => {
  const Auth = React.useContext(AuthApi);

  return (
    <Switch>
      <AppliedRoute exact path='/' component={Landing} auth={Auth.auth} />
      <AppliedRoute
        exact
        path='/choose-plan'
        component={ChoosePlan}
        auth={Auth.auth}
      />
      <AppliedRoute exact path='/payment-details' component={PaymentDetails} />
      <AppliedRoute exact path='/profile' component={Profile} />
      <ProtectedRoute
        auth={Auth.auth}
        exact
        path='/select-meal'
        component={SelectMeal}
      />
      <AppliedRoute path='*' component={NotFound} />
    </Switch>
  );
};

function App() {
  const [auth, setAuth] = React.useState(false);
  const readCookie = () => {
    const customer = Cookies.get("customer_uid");
    console.log(customer);
    if (customer) {
      setAuth(true);
    }
  };

  React.useEffect(() => {
    readCookie();
  }, []);

  return (
    <Provider store={store}>
      <div className='root'>
        <Router>
          <div className='sideNavBar'>
            <SideNavBar />
          </div>
          <div className='mainApp'>
            <Switch>
              <AppliedRoute exact path='/' component={Landing} />
              <AppliedRoute exact path='/sign-up' component={SignUp} />
              <AppliedRoute
                exact
                path='/social-sign-up'
                component={SocialSignUp}
              />
              <AppliedRoute exact path='/choose-plan' component={ChoosePlan} />
              <AppliedRoute
                exact
                path='/payment-details'
                component={PaymentDetails}
              />
              <AppliedRoute exact path='/profile' component={Profile} />
              <AppliedRoute exact path='/select-meal' component={SelectMeal} />
              <AppliedRoute path='*' component={NotFound} />
            </Switch>
          </div>
          <div className='bottomNavBar'>
            <BottomNavBar />
          </div>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
