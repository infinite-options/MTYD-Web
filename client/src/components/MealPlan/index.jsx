import React, {useEffect, useState, Fragment} from 'react';
import {connect} from 'react-redux';
import {
  fetchProfileInformation,
  fetchSubscribed,
  fetchPlans,
  setCurrentMeal,
  setSelectedPlan,
  chooseMealsDelivery,
  choosePaymentOption,
  setUserInfo,
  setCurrentPurchase,
} from '../../reducers/actions/subscriptionActions';
import {withRouter} from 'react-router';
import {fetchOrderHistory} from '../../reducers/actions/profileActions';
import {WebNavBar} from '../NavBar';
import styles from './mealplan.module.css';
import Menu from '../Menu';
import chooseMeal from '../ChoosePlan/static/choose_meals.svg';
import prepay from '../ChoosePlan/static/prepay.png';
import delivery from '../ChoosePlan/static/delivery.png';
import ChangeMealPlan from './ChangeModals/ChangeMealPlan';
import ChangeUserInfo from './ChangeModals/ChangeUserInfo';
import ChangePassword from '../ChangePassword'
import axios from 'axios';
import { API_URL } from '../../reducers/constants';

import {FootLink} from "../Home/homeButtons";

const MealPlan = props => {

  const [customerId, setCustomerId] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [defaultSet, setDefault] = useState(false);
  const [menuButtons, setMenuButtons] = useState([]);
  const [mealSelections, setMealSelections] = useState([]);
  const [selectionDisplay, setSelectionDisplay] = useState();
  const [infoLoaded, loadInfo] = useState(false);

  //check for logged in user
  //let customerId = null;
  if (
    document.cookie
      .split(';')
      .some(item => item.trim().startsWith('customer_uid=')) && customerId === null
  ) {
    setCustomerId(
      document.cookie
        .split('; ')
        .find(item => item.startsWith('customer_uid='))
        .split('=')[1]
    );
  }
    

  const [modal, setModal] = useState(null);

  const [activePlans, updateActivePlans] = useState(props.subscribedPlans.filter((elt) => elt.purchase_status === 'ACTIVE'));
  const [cancelledPlans, updateCancelledPlans] = useState(props.subscribedPlans.filter((elt) => elt.purchase_status !== 'ACTIVE'));

  useEffect(() => {
    console.log("current plan before endpoint: ", currentPlan);

  }, [currentPlan]);

  useEffect(() => {
    console.log("(mswb) customerId: ", customerId);

    // if(customerId !== null && defaultSet === false) {

    //   axios.get(API_URL + 'next_meal_info/' + customerId)
    //     .then(res => {
    //       console.log("(nmi) res: ", res);

    //       res.data.result.forEach((plan, index) => {
    //         console.log("(nmi) plan " + index + " id: ", plan.purchase_id);

    //       });

    //     })
    //     .catch(err => {
    //       if(err.response) {
    //         console.log(err.response);
    //       }
    //       console.log(err);
    //     });

    // }

  }, [customerId]);

  useEffect(() => {

    console.log("RERENDER ON SUBSCRIBED PLANS CHANGE");
    console.log("updating active/cancelled plans...");

    console.log("subscribed plans: ", props.subscribedPlans);
    console.log("plans length: ", props.subscribedPlans.length);

    let plansFetched = 0;

    let tempMenuButtons = [];
    let tempMealSelections = [];

    props.subscribedPlans.forEach((plan, index) => {
      console.log("(nmi) plan " + index + " id: ", plan.purchase_id);

      axios
        .get(API_URL + 'meals_selected_with_billing', { 
          params: { 
            customer_uid: customerId,
            purchase_id: plan.purchase_id
          } 
        })
        .then((res) => {
          console.log("(mswb) res " + index + ": ", res);

          let mealSelection = {
            id: plan.purchase_id,
            selections: res.data.result
          }

          tempMenuButtons.push(
            <div 
              onClick={() => {
                console.log("pressed: ", plan.purchase_id);
                setCurrentPlan(plan.purchase_id);
              }}
              style={{border: 'solid'}}
            >
              {index} : {plan.purchase_id}
            </div>
          );

          tempMealSelections.push(mealSelection);

          if (defaultSet === false) {
            console.log("setting default to: ", plan.purchase_id);
            setCurrentPlan(plan.purchase_id);
            setDefault(true);
          }

          plansFetched++;

          if (plansFetched === props.subscribedPlans.length) {
            setMenuButtons(tempMenuButtons);
            setMealSelections(tempMealSelections);
            loadInfo(true);
          }

        })
        .catch((err) => {
          if(err.response) {
            console.log(err.response);
          }
          console.log(err);
        })


      // tempMenuButtons.push(
      //   <div 
      //     onClick={() => {
      //       console.log("pressed: ", plan.purchase_id);
      //       setCurrentPlan(plan.purchase_id);
      //     }}
      //     style={{border: 'solid'}}
      //   >
      //     {index} : {plan.purchase_id}
      //   </div>
      // );

    });

    //setMenuButtons(tempMenuButtons);

    updateActivePlans(props.subscribedPlans.filter((elt) => elt.purchase_status === 'ACTIVE'));
    updateCancelledPlans(props.subscribedPlans.filter((elt) => elt.purchase_status !== 'ACTIVE'));

  }, [props.subscribedPlans]);

  useEffect(() => {

    console.log("current plan: ", currentPlan);

    let currSelections = [];

    mealSelections.forEach((item) => {
      console.log("item id: ", item.id);
      if(item.id === currentPlan){
        console.log("found id: ", item.id);
        currSelections = item.selections;
      }
    });

    console.log("curr selections: ", currSelections);

    let tempSelectionDisplay = [];

    currSelections.forEach((sel) => {
      console.log("sel: ", sel);

      console.log("sel items: ", sel.items);
      
      let selectionItems = JSON.parse(sel.items);

      let selectionMeals = JSON.parse(sel.meal_selection);

      console.log("selection meals: ", selectionMeals);

      let mealsList = [];

      selectionMeals.forEach((meal) => {
        mealsList.push(
          <div style={{border: 'inset'}}>
            Quantity: {meal.qty}
            <br />
            Name: {meal.name}
          </div>
        );
      });

      tempSelectionDisplay.push(
        <div style={{marginTop: '50px', marginBottom: '50px', border: 'solid'}}>
          <div style={{display: 'inline-flex', width: '100%'}}>
            <div className={styles.orangeHeaderLeft}>
              Next Billing Date
            </div>
            <div className={styles.orangeHeaderRight}>
              {sel.sel_menu_date}
            </div>
          </div>

          <div style={{display: 'inline-flex', width: '100%'}}>
            <div className={styles.orangeHeaderLeft}>
              Meal Plan
            </div>
            <div className={styles.orangeHeaderRight}>
              {currentPlan}
            </div>
          </div>

          {mealsList}

        </div>
      );

    });

    setSelectionDisplay(tempSelectionDisplay);

  }, [currentPlan]);

  useEffect(() => {
    if (infoLoaded === true) {
      mealSelections.forEach((item) => {
        console.log("meal selection item: ", item);

      });
    }
  }, [infoLoaded]);


  useEffect(() => {
    console.log("RERENDER ON ACTIVE PLANS CHANGE");
    for (let activePlan of activePlans) {

      console.log("active plan id: ", activePlan.purchase_id);

      //console.log("(1) id: " + activePlan.purchase_id + "\nstatus: " + activePlan.purchase_status + "\nitems: " + activePlan.items);
      //console.log("whole plan: " + JSON.stringify(activePlan));
    }
  }, [activePlans]);

  useEffect(() => {
    console.log("RERENDER ON CANCELLED PLANS CHANGE");
  }, [cancelledPlans]);

  useEffect(() => {
    console.log("RERENDER WHEN PLANS FETCHED");
  }, [props.plans]);
    
    
  useEffect(() => {
    console.log("\n");
    if (!customerId) {
      props.history.push('/');
    } else {
      try {
        props.fetchProfileInformation(customerId);
        props.fetchPlans();
        console.log("useEffect customerId: " + customerId);
        props
          .fetchSubscribed(customerId)
          .then(ids => {
            console.log("useEffect: " + ids);
            props.fetchOrderHistory(ids)
              .then(() => {
                console.log("updating active/cancelled plans...");
                //updateActivePlans(props.subscribedPlans.filter((elt) => elt.purchase_status === 'ACTIVE'));
                //updateCancelledPlans(props.subscribedPlans.filter((elt) => elt.purchase_status !== 'ACTIVE'));
              });
          });
        //updateActivePlans(props.subscribedPlans.filter((elt) => elt.purchase_status === 'ACTIVE'));
        //updateCancelledPlans(props.subscribedPlans.filter((elt) => elt.purchase_status !== 'ACTIVE'));
      } catch (err) {
        console.log(err);
      }
    }
    //console.log("subbed plans: " + JSON.stringify(props.subscribedPlans));
    //eslint-disable-next-line
    console.log("\n");
  }, []);


  return (
    <>
      <WebNavBar />

      <div className={styles.sectionHeader}>
        Select Meal Plan
      </div>

      <div className={styles.container}>

        <div className={styles.box2}>

          {menuButtons}

          <div style={{marginTop: '50px', marginBottom: '50px', border: 'solid'}}>
            <div style={{display: 'inline-flex', width: '100%'}}>
              <div className={styles.orangeHeaderLeft}>
                Next Billing Date
              </div>
              <div className={styles.orangeHeaderRight}>
                May 16, 2021
              </div>
            </div>

            <div style={{display: 'inline-flex', width: '100%'}}>
              <div className={styles.orangeHeaderLeft}>
                Meal Plan
              </div>
              <div className={styles.orangeHeaderRight}>
                {currentPlan}
              </div>
            </div>
          </div>

          {selectionDisplay}

        </div>
      </div>


      <FootLink />
    </>
  );
};

const mapStateToProps = state => ({
  subscribe: state.subscribe,
  customerId: state.subscribe.profile.customerId,
  subscribedPlans: state.subscribe.subscribedPlans,
  orderHistory: state.profile.orderHistory,
  errors: state.subscribe.errors,
  meals: state.subscribe.meals,
  plans: state.subscribe.plans,
  firstName: state.login.userInfo.firstName,
  lastName: state.login.userInfo.lastName,
  socialMedia: state.subscribe.profile.socialMedia
});

export default connect(mapStateToProps, {
  fetchProfileInformation,
  fetchSubscribed,
  fetchOrderHistory,
  fetchPlans,
  setCurrentMeal,
  setSelectedPlan,
  chooseMealsDelivery,
  choosePaymentOption,
  setUserInfo,
  setCurrentPurchase,
})(withRouter(MealPlan));
