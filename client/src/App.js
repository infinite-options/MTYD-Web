import React from "react";
import {Provider} from "react-redux";
import store from "./reducers/store";
import {
  BrowserRouter as Router,
  Route,
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
import Congratulations from "./components/Congratulations";
import About from "./components/About";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import ForgotPassword from "./components/RecoverPassword"
import "./App.css";
import AuthApi from "./components/AuthApi";
import Cookies from "js-cookie";

import createBrowserHistory from "history/createBrowserHistory";
import Login from "./components/Login"

import AdminNavBar from './components/Admin/AdminNavBar'
import AdminHome from './components/Admin/Home';
import AdminCreateMenu from './components/Admin/CreateMenu';
import AdminEditMeal from './components/Admin/EditMeal';
import AdminCreateMeal from './components/Admin/CreateMeal';
import AdminEditMealRecipe from './components/Admin/EditMealRecipe';
import AdminPlansCoupons from './components/Admin/PlansCoupons';
import AdminOrderIngredients from './components/Admin/OrdersIngredients';
import AdminCustomers from './components/Admin/Customers';
import AdminGoogleAnalytics from './components/Admin/GoogleAnalytics';
import AdminNotfications from './components/Admin/Notifications';
import AdminZones from './components/Admin/Zones';
import Congrats from "./components/Congrats";

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

  const adminNavBar = <AdminNavBar />;
    
  return (
    <div className='root'>
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <AppliedRoute exact path='/home' component={Home} />
            <AppliedRoute exact path='/about' component={About} />
            <AppliedRoute exact path='/' component={Home} />
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
            <AppliedRoute exact path='/congratulations' component={Congratulations} />
            <AppliedRoute exact path='/login' component={Login} />
            <AppliedRoute exact path='/forgot-password' component={ForgotPassword} />
            <AppliedRoute exact path='/congrats' component={Congrats} />
            <Route exact path="/admin">
              {adminNavBar}
              <AdminHome />
            </Route>
            <Route exact path="/admin/create-menu">
              {adminNavBar}
              <AdminCreateMenu />
            </Route>
            <Route exact path="/admin/edit-meal">
              {adminNavBar}
              <AdminEditMeal />
            </Route>
            <Route exact path="/admin/create-meal">
              {adminNavBar}
              <AdminCreateMeal />
            </Route>
            <Route exact path="/admin/edit-meal-recipe">
              {adminNavBar}
              <AdminEditMealRecipe />
            </Route>
            <Route exact path="/admin/plans-coupons">
              {adminNavBar}
              <AdminPlansCoupons />
            </Route>
            <Route exact path="/admin/order-ingredients">
              {adminNavBar}
              <AdminOrderIngredients />
            </Route>
            <Route exact path="/admin/customers">
              {adminNavBar}
              <AdminCustomers />
            </Route>
            <Route exact path="/admin/google-analytics">
              {adminNavBar}
              <AdminGoogleAnalytics />
            </Route>
            <Route exact path="/admin/notifications">
              {adminNavBar}
              <AdminNotfications />
            </Route>
            <Route exact path="/admin/zones">
              {adminNavBar}
              <AdminZones />
            </Route>
            <AppliedRoute path='*' component={NotFound} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
