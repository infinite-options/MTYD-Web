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
import orangeUp from "./static/orange_arrow_up.png";
import orangeDown from "./static/orange_arrow_down.png";
import whiteDown from "./static/white_arrow_down.png";
import axios from 'axios';
import { API_URL } from '../../reducers/constants';

import {FootLink} from "../Home/homeButtons";
import zIndex from '@material-ui/core/styles/zIndex';
import { Ellipsis } from 'react-bootstrap/esm/PageItem';
import { lightBlue } from '@material-ui/core/colors';

const MealPlan = props => {

  const [customerId, setCustomerId] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [defaultSet, setDefault] = useState(false);
  const [dropdownButtons, setDropdownButtons] = useState([]);
  const [mealSelections, setMealSelections] = useState([]);
  const [selectionDisplay, setSelectionDisplay] = useState([]);
  const [infoLoaded, loadInfo] = useState(false);
  const [showDropdown, toggleShowDropdown] = useState(false);
  const [historyDropdowns, setHistoryDropdowns] = useState([]);

  const [placeholderState, setPlaceholderState] = useState(null);
  const [subbedPlans, updateSubbedPlans] = useState(null);

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

  useEffect(() => {

    if (!customerId) {
      props.history.push('/');
    } else {
      try {
        props.fetchProfileInformation(customerId);
        // props.fetchPlans();
        console.log("useEffect customerId: " + customerId);
        props.fetchSubscribed(customerId)
          .then(ids => {
            console.log("(mount) useEffect: " + ids);
            // props.fetchOrderHistory(ids)
            //   .then(() => {
            //     console.log("updating active/cancelled plans...");
            //   });
          });
      } catch (err) {
        console.log(err);
      }
    }

  }, []);


  // Initialize page in this render
  useEffect(() => {
    console.log("RERENDERING subscribedPlans");
    console.log("(init) subscribed plans: ", props.subscribedPlans);
    console.log("(init) subscribed plans length: ", props.subscribedPlans.length);

    let tempDropdownButtons = [];
    let plansFetched = 0;
    let tempMealSelections = [];

    props.subscribedPlans.forEach((plan, index) => {

      // Parse meals, deliveries, and id for each plan
      let parsedItems = JSON.parse(plan.items)[0];
      let parsedMeals = parsedItems.name.substring(0,parsedItems.name.indexOf(" "));
      let parsedDeliveries = parsedItems.qty;
      let parsedId = plan.purchase_id.substring(plan.purchase_id.indexOf("-")+1,plan.purchase_id.length);

      let parsedPlan = {...plan}

      parsedPlan['meals'] = parsedMeals;
      parsedPlan['deliveries'] = parsedDeliveries;
      parsedPlan['id'] = parsedId;

      console.log("(init) id before mswb: ", parsedPlan.purchase_id);

      // Fetch past billing info for each plan
      axios
        .get(API_URL + 'meals_selected_with_billing', { 
          params: { 
            customer_uid: customerId,
            purchase_id: plan.purchase_id
          } 
        })
        .then((res) => {
          console.log(' ');
          console.log("(mswb) res: ", res);
          // console.log("(mswb) parsedPlan: ", parsedPlan);

          parsedPlan["history"] = res.data.result;

          // Set default plan
          if (index === 0) {
            console.log("(mswb) setting default plan to: ", parsedPlan);
            setCurrentPlan(parsedPlan);
            setDefault(true);
          }

          // Get meal selections (later history)
          // let mealSelection = {
          //   id: plan.purchase_id,
          //   selections: res.data.result
          // }

          // Push buttons into top dropdown menu
          tempDropdownButtons.push(
            <div 
              key={index + ' : ' + plan.purchase_id}
              onClick={() => {
                console.log("pressed: ", plan.purchase_id);
                // setCurrentPlan(plan);
                // toggleShowDropdown(false);
              }}
              style={{
                borderRadius: '10px',
                backgroundColor: 'white',
                height: '32px',
                width: '96%',
                paddingLeft: '10px',
                marginLeft: '2%',
                marginTop: '10px',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {parsedPlan.meals} Meals, {parsedPlan.deliveries} Deliveries : {parsedPlan.id}
            </div>
          );

          plansFetched++;

          console.log("(mswb) plansFetched: ", plansFetched);

          // Once all plan information has been fetched, create dropdown menu
          if(plansFetched === props.subscribedPlans.length) {
            console.log("(mswb) all plans fetched!");

            // Add space to top of dropdown menu buttons
            let dropdownTopMargin = [
              <div
                key={'space'}
                style={{
                  height: '25px',
                  backgroundColor: '#f26522',
                }}
              />
            ];

            tempDropdownButtons = dropdownTopMargin.concat(tempDropdownButtons);

            // Set dropdown menu buttons
            setDropdownButtons(
              <>
                <div
                  style={{
                    height: '20px'
                  }}
                />
                <div
                  style={{
                    backgroundColor: '#f26522',
                    width: '40%',
                    minWidth: '300px',
                    height: 40 + (plansFetched * 42),
                    position: 'absolute',
                    zIndex: '1',
                    boxShadow: '0px 5px 10px gray',
                    borderRadius: '15px'
                  }}
                >
                  {tempDropdownButtons}
                </div>
              </>
            );
          }

          // Everything is loaded, so render
          loadInfo(true);

        });

    });

    // console.log("(init) subbed plans: ", tempSubbedPlans);

    // updateSubbedPlans(tempSubbedPlans)

  }, [props.subscribedPlans]);

  // const showHistory = () => {
  //   console.log("(showHistory) current plan: ", currentPlan.purchase_id);

    

  //   return(
  //     <div>
  //       STUFF
  //     </div>
  //   );
  // }

  // useEffect(() => {

  // }, []);

  // useEffect(() => {
  //   console.log("RERENDERING new selection display: ", selectionDisplay);

  //   // console.log("IS EVERYTHING LOADED??");
  //   // console.log("default set? ", defaultSet);
  //   // console.log("current plan set? ", currentPlan);
  //   // console.log("selection display set? ", selectionDisplay);

  //   if (
  //     defaultSet === true &&
  //     currentPlan !== null &&
  //     selectionDisplay.length > 0
  //   ) {
  //     loadInfo(true);
  //   }

  // }, [selectionDisplay]);


/*
  useEffect(() => {

    // console.log("RERENDER ON SUBSCRIBED PLANS CHANGE");
    // console.log("updating active/cancelled plans...");

    if(subbedPlans !== null) {

    console.log("subbedPlans initialized");

    let plansFetched = 0;

    let defaultPlanSet = false;

    let tempDropdownButtons = [];
    let tempMealSelections = [];

    let dropdownLength = 40 + (subbedPlans.length * 42);

    let dropdownTopMargin = [
      <div
        key={'space'}
        style={{
          height: '25px',
          backgroundColor: '#f26522',
        }}
      />
    ];

    subbedPlans.forEach((plan, index) => {
      // console.log("(nmi) plan " + index + " id: ", plan.purchase_id);
      // console.log("(nmi) plan: ", plan);

      axios
        .get(API_URL + 'meals_selected_with_billing', { 
          params: { 
            customer_uid: customerId,
            purchase_id: plan.purchase_id
          } 
        })
        .then((res) => {
          // console.log("(mswb) res " + index + ": ", res);

          let mealSelection = {
            id: plan.purchase_id,
            selections: res.data.result
          }

          tempDropdownButtons.push(
            <div 
              key={index + ' : ' + plan.purchase_id}
              onClick={() => {
                console.log("pressed: ", plan.purchase_id);
                setCurrentPlan(plan);
                toggleShowDropdown(false);
              }}
              style={{
                borderRadius: '10px',
                backgroundColor: 'white',
                height: '32px',
                width: '96%',
                paddingLeft: '10px',
                marginLeft: '2%',
                marginTop: '10px',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {plan.meals} Meals, {plan.deliveries} Deliveries : {plan.id}
            </div>
          );


          tempMealSelections.push(mealSelection);

          if (defaultPlanSet === false && index === 0) {
            defaultPlanSet = true;
            // console.log("setting default to: ", plan.purchase_id);
            setCurrentPlan(plan);
            setDefault(true);
          }

          plansFetched++;

          if (plansFetched === subbedPlans.length) {

            console.log("sorting menu buttons...");
            tempDropdownButtons.sort(function(a,b) {
              // console.log("a: ", a.key.substring(0,a.key.indexOf(' ')));
              // console.log("b: ", b.key.substring(0,b.key.indexOf(' ')));
              return (
                parseInt(a.key.substring(0,a.key.indexOf(' '))) - 
                parseInt(b.key.substring(0,b.key.indexOf(' ')))
              );
            });

            tempDropdownButtons = dropdownTopMargin.concat(tempDropdownButtons);

            setDropdownButtons(
              <>
                <div
                  style={{
                    height: '20px'
                  }}
                />
                <div
                  style={{
                    backgroundColor: '#f26522',
                    width: '40%',
                    minWidth: '300px',
                    height: dropdownLength,
                    position: 'absolute',
                    zIndex: '1',
                    boxShadow: '0px 5px 10px gray',
                    borderRadius: '15px'
                  }}
                >
                  {tempDropdownButtons}
                </div>
              </>
            );

            setMealSelections(tempMealSelections);

            //loadInfo(true);
          }

        })
        .catch((err) => {
          if(err.response) {
            console.log(err.response);
          }
          console.log(err);
        });

    });

    }

    // updateActivePlans(props.subscribedPlans.filter((elt) => elt.purchase_status === 'ACTIVE'));
    // updateCancelledPlans(props.subscribedPlans.filter((elt) => elt.purchase_status !== 'ACTIVE'));

  // }, [subbedPlans]);
  }, [placeholderState]);
*/

/*
  useEffect(() => {

    // console.log("=== current plan ===: ", currentPlan);
    // console.log("default set? ", defaultSet);

    if(currentPlan !== null && mealSelections.length > 0){

    let currSelections = [];

    mealSelections.forEach((item) => {
      // console.log("item id: ", item.id);
      if(item.id === currentPlan.purchase_id){
        console.log("found id: ", item.id);
        currSelections = item.selections;
      }
    });

    console.log("curr selections: ", currSelections);

    let tempSelectionDisplay = [];
    let tempDropdownArray = [];
    let index = 0;

    currSelections.forEach((sel) => {
      // console.log("sel: ", sel);

      // console.log("sel items: ", sel.items);
      
      let selectionItems = JSON.parse(sel.items)[0];

      let parsedMeals = selectionItems.name.substring(
        0, selectionItems.name.indexOf(" ")
      );

      let selectionMeals = JSON.parse(sel.meal_selection);

      // console.log("selection meals: ", selectionMeals);

      let mealsList = [];

      if(selectionMeals !== null){
        selectionMeals.forEach((meal) => {

          // console.log("meal: ", meal);

          // console.log("meal selections: ", );
          // console.log("total deliveries: ", );

          mealsList.push(
            <div 
              key={sel.purchase_uid + ' : ' + meal.item_uid}
              style={{border: 'inset'}}
            >
              <div style={{display: 'inline-flex', width: '100%'}}>
                <div className={styles.mealHeaderLeft}>
                  Meals Delivered
                </div>
                <div className={styles.mealHeaderRight}>
                  [Placeholder Date]
                </div>
              </div>
            </div>
          );
        });
      }

      tempDropdownArray.push({
        date: sel.menu_date,
        display: false
      });

      // tempSelectionDisplay.push(
      let mealInfo = (
        <div 
          key={sel.menu_date}
          style={{marginTop: '50px', marginBottom: '50px'}}
        >
          <div style={{display: 'inline-flex', width: '100%'}}>
            <div className={styles.orangeHeaderLeft}>
              Next Billing Date {" " + index}
            </div>
            <div className={styles.orangeHeaderRight}>
              {sel.menu_date}
            </div>
          </div>

          <div 
            onClick={() => {
              // console.log("show past deliveries for: ", sel.menu_date);
              // console.log("dropdown arr before press: ", dropdownArray);

              let newDropdownArr = [...dropdownArray];

              let currVal = newDropdownArr.findIndex((val) => {
                // console.log("(findIndex) val date: ", val.date);
                // console.log("(findIndex) sel date: ", sel.menu_date);
                return val.date === sel.menu_date;
              });

              console.log("currVal: ", currVal);

              newDropdownArr[currVal] = !newDropdownArr[currVal];

              setDropdownArray(newDropdownArr);

            }}
            style={{display: 'inline-flex', width: '100%'}}
          >
            <div className={styles.orangeHeaderLeft}>
              Meal Plan
            </div>
            <div className={styles.orangeHeaderRightArrow}>
              {parsedMeals} Meals, {selectionItems.qty} Deliveries
            </div>
            <div 
              style={{
                width: '1%',
                borderTop: 'solid',
                borderWidth: '1px',
                borderColor: '#f26522'
              }} 
            />
            <div
                style={{
                  width: '3%',
                  minWidth: '24px',
                  // border: 'solid',
                  // borderWidth: '1px',
                  borderTop: 'solid',
                  borderWidth: '1px',
                  borderColor: '#f26522',
                  paddingTop: '12px'
                }}
              >
              <div className={styles.orangeArrowDown} /> 
            </div>
          </div>

          {console.log("dropdownArray at " + index + ": ", dropdownArray[index])}
          {
            (typeof(dropdownArray[index]) !== 'undefined' &&
            dropdownArray[index].display)
              ? (<>[placeholder meals]</>)
              : null
          }

        </div>
      );
      // );

      tempSelectionDisplay.push(mealInfo);

      // console.log("## new temp selection display: ", tempSelectionDisplay);

      index++;

    });

    // console.log("initial dropdown array: ", tempDropdownArray);

    // console.log("## setting selection display...");
    setSelectionDisplay(tempSelectionDisplay);
    setDropdownArray(tempDropdownArray);

    }

  }, [currentPlan, mealSelections]);
*/

  return (
    <>
      <WebNavBar />

      <div className={styles.sectionHeader}>
        Select Meal Plan
      </div>

      {infoLoaded === false
        ? (
            <div
              style={{
                fontSize: '40px',
                fontWeight: 'bold',
                marginLeft: '8%',
                marginBottom: '100px',
                marginRight: '8%'
              }}
            >
              LOADING YOUR SUBSCRIPTION HISTORY...
            </div>
          )
        : (<>

      <div className={styles.container}>

        <div className={styles.box2}>

          <div
            style={{
              // border: 'inset',
              position: 'relative',
              height: (
                showDropdown
                  ? 60 + (props.subscribedPlans.length * 42)
                  : 50
              )
            }}
          >
            <div 
              className={styles.dropdownSelection}
              onClick={() => {
                // console.log("set show dropdown menu to: ", !showDropdown);
                toggleShowDropdown(!showDropdown);
              }}
            >
              <div 
                style={{
                  // border: 'solid',
                  // borderWidth: '1px',
                  width: '80%',
                  marginLeft: '5%',
                  textOverflow: 'ellipsis',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}
              >
                {/* [placeholder default meal plan] */}
                {
                  currentPlan === null
                    ? "wait..."
                    : (
                        currentPlan.meals + " Meals, " +
                        currentPlan.deliveries + " Deliveries : " +
                        currentPlan.id
                      )
                }
              </div>
              <div
                style={{
                  width: '10%',
                  minWidth: '24px',
                  marginRight: '5%'
                }}
              >
                <div className={styles.whiteArrowDown} /> 
              </div>
            </div>

            {showDropdown
              ? dropdownButtons
              : null
            }
          </div>


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
              <div className={styles.orangeHeaderRightUL}>
                {
                  currentPlan === null
                    ? "wait..."
                    : (
                      currentPlan.meals + " Meals, " +
                      currentPlan.deliveries + " Deliveries"
                    )
                }
              </div>
            </div>
          </div>

          {/* {currentPlan
            ? showHistory()
            : null} */}

          {/* {console.log("(render) selection display: ", selectionDisplay)}
          {selectionDisplay} */}

        </div>
      </div>

      </>)}

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
