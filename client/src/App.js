import React from "react";
import { Provider } from "react-redux";
import store from "./reducers/store";
import {
  BrowserRouter as Router,
   Route, Redirect,
  Switch,
} from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Landing from "./components/Mobile_Components/Landing";
import SignUp from "./components/Mobile_Components/SignUp";
import SocialSignUp from "./components/Mobile_Components/SocialSignUp";
import ChoosePlan from "./components/Mobile_Components/ChoosePlan";
import PaymentDetails from "./components/Mobile_Components/PaymentDetails";
import Profile from "./components/Mobile_Components/Profile";
import SelectMeal from "./components/Mobile_Components/SelectMeal";
import NotFound from "./components/Mobile_Components/NotFound";
import "./App.css";
import AuthApi from "./components/AuthApi";
import Cookies from "js-cookie";
import SelectPlanWeb from "./components/Desktop_Components/SelectPlanWeb";
import SelectMealWeb from "./components/Desktop_Components/SelectMealWeb";
import LoginWeb from "./components/Desktop_Components/LoginWeb";
import SignUpWeb from "./components/Desktop_Components/SignUpWeb";

const viewportContext = React.createContext({});

const ViewportProvider = ({ children }) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);
  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <viewportContext.Provider value={{ width, height }}>
      {children}
    </viewportContext.Provider>
  );
};

const useViewport = () => {
  const { width, height } = React.useContext(viewportContext);
  return { width, height };
};

const MobileComponent = () => {
  return (
    <Provider store={store}>
      <div className='root'>
        <Router>
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
        </Router>
      </div>
    </Provider>
  );
};

const DesktopComponent = () => {
  return(
    <Provider store={store}>
      <div className='root'>
        <Router>
          <div className='mainApp'>
            <Route exact path="/">
              <Redirect to="/login-web" />
            </Route>
            <Switch>
              <AppliedRoute exact path='/login-web' component={LoginWeb} />
              <AppliedRoute exact path='/sign-up-web' component={SignUpWeb} />
              <AppliedRoute exact path='/select-plan-web' component={SelectPlanWeb} />
              <AppliedRoute exact path='/select-meal-web' component={SelectMealWeb} />
              <AppliedRoute path='*' component={NotFound} />
            </Switch>
          </div>
        </Router>
      </div>
    </Provider>
  );
};

const MyComponent = () => {
  const { width } = useViewport();
  const breakpoint = 375;
  return  width <= breakpoint ? <MobileComponent /> : <DesktopComponent />;
};

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
    <ViewportProvider>
      <MyComponent />
    </ViewportProvider>
  );
}

export default App;
