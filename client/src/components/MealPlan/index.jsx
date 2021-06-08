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
import { parse } from '@fortawesome/fontawesome-svg-core';

const MealPlan = props => {

  const [customerId, setCustomerId] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [defaultSet, setDefault] = useState(false);
  const [dropdownButtons, setDropdownButtons] = useState([]);
  const [mealSelections, setMealSelections] = useState([]);
  const [selectionDisplay, setSelectionDisplay] = useState([]);
  const [infoLoaded, loadInfo] = useState(false);
  const [showDropdown, toggleShowDropdown] = useState(false);
  const [historyDropdowns, setHistoryDropdowns] = useState(null);

  const [placeholderState, setPlaceholderState] = useState(null);
  const [subbedPlans, updateSubbedPlans] = useState(null);

  const [buttonClicked, setButtonClicked] = useState(false);

  const [billingInfo, setBillingInfo] = useState(null);

  const [subHistory, setSubHistory] = useState([]);

  const [uniquePlans, setUniquePlans] = useState(null);

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

  // (1) Fetch profile info and subscription history info
  useEffect(() => {

    if (!customerId) {
      props.history.push('/');
    } else {
      try {
        props.fetchProfileInformation(customerId);
        
        console.log("useEffect customerId: " + customerId);
        // props.fetchSubscribed(customerId)
        //   .then(ids => {
        //     console.log("(mount) useEffect: " + ids);
        //     // props.fetchOrderHistory(ids)
        //     //   .then(() => {
        //     //     console.log("updating active/cancelled plans...");
        //     //   });
        //   });

        axios.get(API_URL + 'subscription_history/' + customerId)
          .then((res) => {
            console.log("(sh) res: ", res.data.result);

            setSubHistory(res.data.result);
          })
          .catch((err) => {
            if(err.response) {
              console.log(err.response);
            }
            console.log(err);
          });

        axios.get(API_URL + 'predict_next_billing_date/' + customerId)
          .then((res) => {
            console.log("(pnbd) res: ", res.data.result);

            setBillingInfo(res.data.result);
          })
          .catch((err) => {
            if(err.response) {
              console.log(err.response);
            }
            console.log(err);
          });
        
      } catch (err) {
        console.log(err);
      }
    }

  }, []);


  // (3) Set default plan and associated dropdowns
  useEffect(() => {
    console.log("(UE currentPlan) current plan set: ", currentPlan);
    console.log("(UE currentPlan) unique plans: ", uniquePlans);


  }, [currentPlan, uniquePlans]);


  // (2) Set default plan
  useEffect(() => {
    console.log("RERENDERING subscribedPlans");
    console.log("(init) subscribed plans: ", props.subscribedPlans);
    console.log("(init) subscribed plans length: ", props.subscribedPlans.length);

    let tempDropdownButtons = [];
    // let plansFetched = 0;
    let uniquePlansFetched = 0;

    // let dropdownStatusArray = [];

    // let tempSubbedPlans = [];
    // var defaultSub = null;
    let defaultSub = false;

    let tempUniquePlans = [];

    let dropdownIndex = 0;

    subHistory.forEach((sub) => {
      // console.log(' ');
      // console.log("(init) sub: ", sub);
      // console.log("(init) current plan: ", currentPlan);
      
      // let el = tempUniquePlans.find(element => element.id === sub.purchase_id);
      let elIndex = tempUniquePlans.findIndex(element => element.id === sub.purchase_id);

      console.log(' ');
      console.log('(1) ==============================');
      console.log("sub: ", sub);
      // console.log("el: ", el);
      // console.log("el index: ", elIndex);

      // if (typeof(el) === 'undefined') {
      if (elIndex === -1) {

        console.log("-- (1.1) UNIQUE PLAN FOUND: ", sub.purchase_id);
        // console.log("-- element: ", el);

        let tempUniquePlan = {
          id: sub.purchase_id,
          history: []
        };

        console.log("-- (1.2) plan to be pushed: ", tempUniquePlan);

        tempUniquePlans.push(tempUniquePlan);

        elIndex = tempUniquePlans.findIndex(element => element.id === sub.purchase_id);

        console.log("-- (1.3) element index: ", elIndex);
        console.log("-- (1.4) adding to plan: ", sub);
        
        // tempUniquePlans[elIndex].history.push(sub);
        let historyTab = {
          date: sub.payment_time_stamp,
          show_dropdown: false,
          deliveries: []
        };
        tempUniquePlans[elIndex].history.push(historyTab);
        tempUniquePlans[elIndex].history[0].deliveries.push(sub);

        // console.log("-- new unique plan array: ", JSON.parse(JSON.stringify(tempUniquePlans)));

        uniquePlansFetched++;

        // Parse meals, deliveries, and id for each plan
        let parsedItems = JSON.parse(sub.items)[0];
        // console.log("(parse) parsedItems: ", parsedItems);

        let parsedMeals = parsedItems.name.substring(
          0,
          parsedItems.name.indexOf(" ")
        );
        // console.log("(parse) parsedMeals ", parsedMeals);

        let parsedDeliveries = parsedItems.qty;
        // console.log("(parse) parsedDeliveries: ", parsedDeliveries);

        let parsedId = sub.purchase_id.substring(
          sub.purchase_id.indexOf("-")+1,
          sub.purchase_id.length
        );

        let parsedPlan = {...sub}

        parsedPlan['meals'] = parsedMeals;
        parsedPlan['deliveries'] = parsedDeliveries;
        parsedPlan['id'] = parsedId;

        if(defaultSub === false) {
          defaultSub = true;
          setCurrentPlan(parsedPlan);
        }

        // Push buttons into top dropdown menu
        tempDropdownButtons.push(
          <div 
            key={dropdownIndex + ' : ' + sub.purchase_id}
            onClick={() => {
              console.log("pressed: ", sub.purchase_id);
              setCurrentPlan(parsedPlan);
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
              cursor: 'pointer'
            }}
          >
            {parsedPlan.meals} Meals, {parsedPlan.deliveries} Deliveries : {parsedPlan.id}
          </div>
        );

        dropdownIndex++;

      } else {
        // sub.display = false;
        // console.log("-- (2.1) adding to plan: ", sub);
        console.log("-- (2.1) data before: ", JSON.parse(JSON.stringify(tempUniquePlans[elIndex].history)));
        let dateIndex = tempUniquePlans[elIndex].history.findIndex(
          element => element.date === sub.payment_time_stamp
        );
        console.log("-- (2.2) date index: ", dateIndex);
        if(dateIndex === -1) {
          console.log("---- (2A) deliveries for date not found; creating new tab...");
          let historyTab = {
            date: sub.payment_time_stamp,
            show_dropdown: false,
            deliveries: []
          };
          tempUniquePlans[elIndex].history.push(historyTab);
          console.log("----      history length: ", tempUniquePlans[elIndex].history.length);
          tempUniquePlans[elIndex].history[(tempUniquePlans[elIndex].history.length)-1].deliveries.push(sub);
        } else {
          console.log("---- (2B) deliveries for date found at " + dateIndex + "! adding to tab...");
          tempUniquePlans[elIndex].history[dateIndex].deliveries.push(sub);
        }
        console.log("-- (2.3) data after: ", JSON.parse(JSON.stringify(tempUniquePlans[elIndex].history)));

      }

      console.log("-- new unique plan array: ", JSON.parse(JSON.stringify(tempUniquePlans)));
      console.log('(2) ==============================');

    });

    console.log(' ');
    console.log("(init) final temp unique plans: ", tempUniquePlans);

    setUniquePlans(tempUniquePlans);

    // setCurrentPlan(defaultSub);
    // setDropdownButtons(tempDropdownButtons);

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

    console.log("dropdown buttons before set: ", dropdownButtons);

    // Set dropdown menu buttons
    setDropdownButtons(
      <>
        <div
          style={{
            height: '20px',
            zIndex: '1'
          }}
        />
        <div
          style={{
            backgroundColor: '#f26522',
            width: '40%',
            minWidth: '300px',
            height: 40 + (uniquePlansFetched * 42),
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

    // setHistoryDropdowns([]);

    console.log("(init) current plan set: ", currentPlan);

    // props.subscribedPlans.forEach((plan, index) => {

      // Parse meals, deliveries, and id for each plan
      // let parsedItems = JSON.parse(plan.items)[0];
      // let parsedMeals = parsedItems.name.substring(0,parsedItems.name.indexOf(" "));
      // let parsedDeliveries = parsedItems.qty;
      // let parsedId = plan.purchase_id.substring(plan.purchase_id.indexOf("-")+1,plan.purchase_id.length);

      // let parsedPlan = {...plan}

      // parsedPlan['meals'] = parsedMeals;
      // parsedPlan['deliveries'] = parsedDeliveries;
      // parsedPlan['id'] = parsedId;

      // console.log("(init) id before mswb: ", parsedPlan.purchase_id);

      // console.log("(init) parsed plan: ", parsedPlan);
      // setCurrentPlan(parsedPlan);

      // Fetch past billing info for each plan
      /*axios.get(API_URL + 'subscription_history/' + customerId)
        .then((res) => {
          console.log(" ");
          console.log("(sh) res: ", res);

          parsedPlan["history"] = res.data.result;

          dropdownStatusArray = dropdownStatusArray.concat(res.data.result);

          // Set default plan
          if (index === 0) {
            console.log("(mswb) setting default plan to: ", parsedPlan);
            setCurrentPlan(parsedPlan);
            setDefault(true);
          }

          // Push buttons into top dropdown menu
          tempDropdownButtons.push(
            <div 
              key={index + ' : ' + plan.purchase_id}
              onClick={() => {
                console.log("pressed: ", plan.purchase_id);
                setCurrentPlan(parsedPlan);
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
                cursor: 'pointer'
              }}
            >
              {parsedPlan.meals} Meals, {parsedPlan.deliveries} Deliveries : {parsedPlan.id}
            </div>
          );

          plansFetched++;

          console.log("(sh) plansFetched: ", plansFetched);

          // Once all plan information has been fetched, create dropdown menu
          if(plansFetched === props.subscribedPlans.length) {
            console.log("(mswb) all plans fetched!");

            dropdownStatusArray.forEach((e) => {
              e.display = false
            });

            console.log("(mswb) dropdown status array: ", dropdownStatusArray);

            setHistoryDropdowns(dropdownStatusArray);

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

        })
        .catch((err) => {
          if(err.response) {
            console.log(err.response);
          }
          console.log(err);
        });*/

    // });

  }, [subHistory]);

  const formatDate = (rawDate) => {

    // let timestamp = new Date(rawDate.substring);
    // console.log("raw date: ", rawDate);
    // console.log("time stamp: ", timestamp);

    // let sampleDate = "2021-04-27 00-19-03";
    let dateElements = rawDate.split(' ');
    // console.log("date elements: ", dateElements);

    // let timestamp = new Date(dateElements[0]);
    // console.log("raw date: ", rawDate);
    // console.log("time stamp: ", timestamp);
    // console.log("unix time: ", Date.parse(dateElements[0]));

    let yyyy_mm_dd = dateElements[0].split('-');
    // console.log("yyyy_mm_dd: ", yyyy_mm_dd);

    let month;

    // Parse month
    switch(yyyy_mm_dd[1]){
      case "01":
        month = "January";
        break;
      case "02":
        month = "February";
        break;
      case "03":
        month = "March";
        break;
      case "04":
        month = "April";
        break;
      case "05":
        month = "May";
        break;
      case "06":
        month = "June";
        break;
      case "07":
        month = "July";
        break;
      case "08":
        month = "August";
        break;
      case "09":
        month = "September";
        break;
      case "10":
        month = "October";
        break;
      case "11":
        month = "November";
        break;
      case "12":
        month = "December";
        break;
      default:
        month = "";
    }

    let dateString = month + " " + yyyy_mm_dd[2] + ", " + yyyy_mm_dd[0];
    // console.log("date string: ", dateString);

    return dateString;
  }

  /*const getDisplayStatus = (date, id) => {
    console.log("(getDisplayStatus) history dropdown statuses before: ", historyDropdowns);

    let index = historyDropdowns.findIndex((dropdown) => {
      return dropdown.menu_date === date && dropdown.purchase_id === id;
    });

    console.log("(getDisplayStatus) status index: ", index);

    console.log("(getDisplayStatus) current dropdown: ", historyDropdowns[index]);

    console.log("(getDisplayStatus) dropdown display status: ", historyDropdowns[index].display);

    return historyDropdowns[index].display;
  }

  const toggleDeliveryDisplay = (date, id) => {
    console.log("(toggleDeliveryDisplay) history dropdown statuses before: ", historyDropdowns);

    let index = historyDropdowns.findIndex((dropdown) => {
      return dropdown.menu_date === date && dropdown.purchase_id === id;
    });

    console.log("(toggleDeliveryDisplay) status index: ", index);

    console.log("(toggleDeliveryDisplay) current dropdown: ", historyDropdowns[index]);

    console.log("(toggleDeliveryDisplay) dropdown display status: ", historyDropdowns[index].display);

    // let newStatus = !historyDropdowns[index].display;

    let historyDropdownsCopy = [...historyDropdowns];

    historyDropdownsCopy[index].display = !historyDropdowns[index].display;

    setHistoryDropdowns(historyDropdownsCopy);
  }*/

  const showMealsForDelivery = (totalMeals) => {
    console.log("(showMealsForDelivery) total meals: ", totalMeals);
    let mealsForDelivery = [];
    for(var i = 0; i < totalMeals; i++) {
      mealsForDelivery.push(
        <div style={{display: 'inline-flex', width: '100%', height: '110px'}}>
          <div
            style={{
              // border: 'inset',
              width: '8%',
              fontSize: '40px',
              fontWeight: '600',
              paddingTop: '15px'
            }}
          >
            3
          </div>
          <div
            style={{
              // border: 'inset',
              width: '92%',
              fontWeight: '600',
              paddingTop: '33px'
            }}
          >
            Chicken Teriyaki Bowl
          </div>
          <div
            style={{
              display: 'flex',
              // border: 'inset',
              width: '0%',
              minWidth: '100px',
              textAlign: 'right',
              float: 'right',
              fontWeight: '600'
            }}
          >
            <div
              style={{
                border: 'dashed',
                width: '100px',
                height: '100px',
                marginTop: '5px'
              }}
            >
              {"<image goes here>"}
            </div>
          </div>
        </div>
      );
    }
    return mealsForDelivery;
  }

  const displayMealInfo = (data) => {
    console.log("(displayMealInfo) data: ", data);
    // console.log("(showMealsForDelivery) total meals: ", totalMeals);
    let mealsForDelivery = [];
    // for(var i = 0; i < totalMeals; i++) {
    if(data.meal_uid !== null){
      mealsForDelivery.push(
        <div style={{display: 'inline-flex', width: '100%', height: '110px'}}>
          <div
            style={{
              // border: 'inset',
              width: '8%',
              fontSize: '40px',
              fontWeight: '600',
              paddingTop: '15px'
            }}
          >
            {data.meal_qty}
          </div>
          <div
            style={{
              // border: 'inset',
              width: '92%',
              fontWeight: '600',
              paddingTop: '33px'
            }}
          >
            {data.meal_name}
          </div>
          <div
            style={{
              display: 'flex',
              // border: 'inset',
              width: '0%',
              minWidth: '100px',
              textAlign: 'right',
              float: 'right',
              fontWeight: '600'
            }}
          >
            <div
              style={{
                // border: 'dashed',
                width: '100px',
                height: '100px',
                marginTop: '5px',
                backgroundImage: `url(${data.meal_photo_URL})`,
                backgroundSize: 'cover'
              }}
            >
              {/* {data.meal_photo_URL} */}
            </div>
          </div>
        </div>
      );
    } else if (data.meal_desc === "SURPRISE") {
      mealsForDelivery.push(
        <div style={{display: 'inline-flex', width: '100%', height: '110px'}}>
          <div
            style={{
              // border: 'inset',
              width: '8%',
              fontSize: '40px',
              fontWeight: '600',
              paddingTop: '15px'
            }}
          >
            {currentPlan.meals}
          </div>
          <div
            style={{
              // border: 'inset',
              width: '92%',
              fontWeight: '600',
              paddingTop: '33px'
            }}
          >
            {"Surprises"}
          </div>
          <div
            style={{
              display: 'flex',
              // border: 'inset',
              width: '0%',
              minWidth: '100px',
              textAlign: 'right',
              float: 'right',
              fontWeight: '600'
            }}
          >
            <div
              style={{
                border: 'dashed',
                width: '100px',
                height: '100px',
                marginTop: '5px',
                borderWidth: '2px',
                // backgroundColor: 'whitesmoke',
                fontSize: '50px',
                paddingRight: '33px',
                paddingTop: '10px'
              }}
            >
              ?
            </div>
          </div>
        </div>
      );
    } else if (data.meal_desc === "SKIP") {
      mealsForDelivery.push(
        <div style={{display: 'inline-flex', width: '100%', height: '110px'}}>
          <div
            style={{
              // border: 'inset',
              width: '8%',
              fontSize: '40px',
              fontWeight: '600',
              paddingTop: '15px'
            }}
          >
            0
          </div>
          <div
            style={{
              // border: 'inset',
              width: '92%',
              fontWeight: '600',
              paddingTop: '33px'
            }}
          >
            {"(Skip)"}
          </div>
          {/* <div
            style={{
              display: 'flex',
              // border: 'inset',
              width: '0%',
              minWidth: '100px',
              textAlign: 'right',
              float: 'right',
              fontWeight: '600'
            }}
          >
            <div
              style={{
                border: 'dashed',
                width: '100px',
                height: '100px',
                marginTop: '5px',
                borderWidth: '2px',
                // backgroundColor: 'whitesmoke',
                fontSize: '50px',
                paddingRight: '33px',
                paddingTop: '10px'
              }}
            >
              ?
            </div>
          </div> */}
        </div>
      );
    }
    /*} else {
      mealsForDelivery.push(
        <div style={{display: 'inline-flex', width: '100%', height: '110px'}}>
          <div
            style={{
              // border: 'inset',
              width: '8%',
              fontSize: '40px',
              fontWeight: '600',
              paddingTop: '15px'
            }}
          >
            {currentPlan.meals}
          </div>
          <div
            style={{
              // border: 'inset',
              width: '92%',
              fontWeight: '600',
              paddingTop: '33px'
            }}
          >
            {"Surprises"}
          </div>
          <div
            style={{
              display: 'flex',
              // border: 'inset',
              width: '0%',
              minWidth: '100px',
              textAlign: 'right',
              float: 'right',
              fontWeight: '600'
            }}
          >
            <div
              style={{
                border: 'dashed',
                width: '100px',
                height: '100px',
                marginTop: '5px',
                borderWidth: '2px',
                // backgroundColor: 'whitesmoke',
                fontSize: '50px',
                paddingRight: '33px',
                paddingTop: '10px'
              }}
            >
              ?
            </div>
          </div>
        </div>
      );
    }*/
    return mealsForDelivery;
  }

  const showMealsDelivered = () => {
    return (
      <div
        style={{
          // border: 'solid',
          display: 'flex',
          // marginBottom: '10px'
        }}
      >

        <div style={{display: 'inline-block', width: '100%'}}>
    
          <div style={{display: 'inline-flex', width: '100%'}}>
            <div
              style={{
                // border: 'inset',
                width: '50%',
                fontWeight: '600'
              }}
            >
              Meals Delivered
            </div>
            <div
              style={{
                // border: 'inset',
                width: '50%',
                textAlign: 'right',
                fontWeight: '600'
              }}
            >
              May 31, 2028
            </div>
          </div>

          {showMealsForDelivery(2)}

        </div>

      </div>
    );
  }  

  const isFutureCycle = (rawDate, billDate) => {

    console.log("raw date: ", rawDate);
    console.log("bill date: ", billDate);

    let dateElements = rawDate.split(' ');
    let billDateElements = billDate.split(' ');

    console.log("date elements: ", dateElements);
    console.log("bill date elements: ", billDateElements);

    let parsedDate = Date.parse(dateElements[0]);
    let parsedBillDate = Date.parse(billDateElements[0]);

    console.log("parsed date: ", parsedDate);
    console.log("parsed bill date: ", parsedBillDate);

    if (parsedDate > parsedBillDate) {
      return true;
    } else {
      return false;
    }
  }

  const isFutureDate = (rawDate) => {
    let dateElements = rawDate.split(' ');
    // console.log("date elements: ", dateElements);

    // let timestamp = new Date(dateElements[0]);
    // console.log("raw date: ", rawDate);
    // console.log("time stamp: ", timestamp);
    // console.log("unix time: ", Date.parse(dateElements[0]));

    // console.log("date now: ", Date.now());

    if(Date.parse(dateElements[0]) > Date.now()) {
      return true;
    } else {
      return false;
    }
  }
  
  const showPastMeals = (data) => {
    console.log("(showPastMeals) data: ", data);

    let uniqueDates = [];

    let mealsDisplay = [];

    data.deliveries.forEach((del) => {
      console.log("del: ", del);
      if(!isFutureCycle(del.sel_menu_date, nextBillingDate(currentPlan.purchase_id))) {
      if(uniqueDates.includes(del.sel_menu_date)){
        mealsDisplay.push(
          <div
            style={{
              // border: 'solid',
              display: 'flex'
              // marginBottom: '10px'
            }}
          >
  
            <div style={{display: 'inline-block', width: '100%'}}>
        
              {/* <div style={{display: 'inline-flex', width: '100%'}}>
                <div
                  style={{
                    // border: 'inset',
                    width: '50%',
                    fontWeight: '600'
                  }}
                >
                  Meals Delivered
                </div>
                <div
                  style={{
                    // border: 'inset',
                    width: '50%',
                    textAlign: 'right',
                    fontWeight: '600'
                  }}
                >
                  {formatDate(del.sel_menu_date)}
                </div>
              </div> */}
  
              {displayMealInfo(del)}
  
            </div>
  
          </div>
        );
      } else {
        uniqueDates.push(del.sel_menu_date);
        mealsDisplay.push(
          <div
            style={{
              // border: 'solid',
              display: 'flex',
              marginTop: '15px'
              // marginBottom: '10px'
            }}
          >
  
            <div style={{display: 'inline-block', width: '100%'}}>
        
              <div style={{display: 'inline-flex', width: '100%'}}>
                <div
                  style={{
                    // border: 'inset',
                    width: '50%',
                    fontWeight: '600'
                  }}
                >
                  {
                    isFutureDate(del.sel_menu_date)
                      ? "Meals Delivered (Future)"
                      : "Meals Delivered"
                  }
                </div>
                <div
                  style={{
                    // border: 'inset',
                    width: '50%',
                    textAlign: 'right',
                    fontWeight: '600'
                  }}
                >
                  {formatDate(del.sel_menu_date)}
                </div>
              </div>
  
              {displayMealInfo(del)}
  
            </div>
  
          </div>
        );
      }
      }
      /*mealsDisplay.push(
        <div
          style={{
            // border: 'solid',
            display: 'flex',
            marginBottom: '10px'
          }}
        >

          <div style={{display: 'inline-block', width: '100%'}}>
      
            <div style={{display: 'inline-flex', width: '100%'}}>
              <div
                style={{
                  // border: 'inset',
                  width: '50%',
                  fontWeight: '600'
                }}
              >
                Meals Delivered
              </div>
              <div
                style={{
                  // border: 'inset',
                  width: '50%',
                  textAlign: 'right',
                  fontWeight: '600'
                }}
              >
                {formatDate(del.sel_menu_date)}
              </div>
            </div>

            {displayMealInfo(del)}

          </div>

        </div>
      );*/
    });

    /*return (
      <div
        style={{
          border: 'solid',
          display: 'flex',
          marginBottom: '10px'
        }}
      >

        <div style={{display: 'inline-block', width: '100%'}}>
    
          <div style={{display: 'inline-flex', width: '100%'}}>
            <div
              style={{
                border: 'inset',
                width: '50%',
                fontWeight: '600'
              }}
            >
              Meals Delivered
            </div>
            <div
              style={{
                border: 'inset',
                width: '50%',
                textAlign: 'right',
                fontWeight: '600'
              }}
            >
              {data.sel_menu_date}
            </div>
          </div>

          {displayMealInfo(data)}

        </div>

      </div>
    );*/
    return (
      <div>{mealsDisplay}</div>
    );
  }

  const nextBillingDate = (id) => {
    console.log("(nbd) id: ", id);
    let billInfo = billingInfo.find((plan) => {
      return plan.purchase_id === id;
    });
    console.log("(nbd) bill info: ", billInfo);
    // let nextBillDate = formatDate(billInfo.next_billing_date);
    // return nextBillDate;
    return billInfo.next_billing_date;
  }

  const showHistory = () => {
    // console.log(" ");
    // console.log("(showHistory) current plan: ", currentPlan);
    // console.log("(showHistory) current plan -- id: ", currentPlan.purchase_id);
    // console.log("(showHistory) current plan -- time stamp: ", currentPlan.payment_time_stamp);
    // console.log("(showHistory) unique plans: ", uniquePlans);
    // console.log(" ");

    // Process data into divs for rendering
    console.log("############################## (1)");
    let deliveryDropdowns = [];

    let planHistory = uniquePlans.find((plan) => {
      return plan.id === currentPlan.purchase_id;
    });

    console.log("plan history: ", planHistory);

    let historyTabs = [];

    planHistory.history.forEach((sel) => {
      historyTabs.push(
        <div    
          key={sel.date}
          style={{marginTop: '50px', marginBottom: '50px'}}
        >
          <div style={{display: 'inline-flex', width: '100%'}}>
            <div className={styles.orangeHeaderLeft}>
              Billing Date
            </div>
            <div className={styles.orangeHeaderRight}>
              {formatDate(sel.date)}
            </div>
          </div>
          <div 
            onClick={() => {
              // console.log("(showHistory) orange dropdown clicked for: ", sel);
              // console.log("display status before: ", sel.showDropdown);

              let uniquePlanCopy = [...uniquePlans];

              // console.log("(showHistory) unique plan copy: ", uniquePlanCopy);

              let index1 = uniquePlans.findIndex((plan) => {
                return plan.id === currentPlan.purchase_id;
              });
              // console.log("index 1: ", index1);

              let index2 = uniquePlanCopy[index1].history.findIndex((tab) => {
                // console.log("tab date: ", tab.date);
                // console.log("sel date: ", sel.date);
                return tab.date === sel.date;
              });
              // console.log("index 2: ", index2);

              // console.log("stuff 1: ", uniquePlanCopy[index1]);
              // console.log("stuff 2: ", uniquePlanCopy[index1].history[index2]);

              uniquePlanCopy[index1].history[index2].show_dropdown = !uniquePlanCopy[index1].history[index2].show_dropdown;

              setUniquePlans(uniquePlanCopy);

              // console.log("display status after: ", sel.showDropdown);
            }}
            style={{display: 'inline-flex', width: '100%', cursor: 'pointer'}}
          >
            <div className={styles.orangeHeaderLeft}>
              Meal Plan
            </div>
            <div className={styles.orangeHeaderRightArrow}>
              {currentPlan.meals} Meals, {currentPlan.deliveries} Deliveries
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
              {/* {console.log("(showHistory) (1) show dropdown? ", sel.show_dropdown)} */}
              {sel.show_dropdown
                ? <div className={styles.orangeArrowUp} />
                : <div className={styles.orangeArrowDown} />}

            </div>
          </div>
          {/* {console.log("(showHistory) (2) show dropdown? ", sel.show_dropdown)} */}
          {sel.show_dropdown
            ? <>{showPastMeals(sel)}</>
            : null}
        </div>
      );
    });

    console.log("############################## (2)");
    console.log(" ");

    return(
      <div>
        {historyTabs.reverse()}
      </div>
    );
  }

  /*const showHistory = () => {
    console.log("(showHistory) current plan id: ", currentPlan.purchase_id);
    console.log("(showHistory) current plan data: ", currentPlan);

    // console.log("(showHistory) current plan history: ", currentPlan.history);

    let currentHistory = uniquePlans.find(element => element.id === currentPlan.purchase_id);
    let currentHistoryIndex = uniquePlans.findIndex(element => element.id === currentPlan.purchase_id);

    console.log("(showHistory) current history: ", currentHistory);

    let historyTabs = [];

    console.log(' ');
    console.log("#################### (1)");

    currentHistory.history.forEach((sel, index) => {
      // let deliveriesForDate = [];
      console.log("========================================|");
      console.log("selection: ", sel);
      console.log("payment time stamp: ", sel.payment_time_stamp);
      let sameDateTab = historyTabs.find(element => element.purchase_time === sel.payment_time_stamp);
      let sameDateIndex = historyTabs.findIndex(element => element.purchase_time === sel.payment_time_stamp);
      console.log("-- same date tab: ", sameDateTab);

      if (typeof(sameDateTab) === 'undefined') {
        console.log("-- (1.1) date not found; pushing new one...");
        historyTabs.push({
          date: sel.start_delivery_date,
          purchase_time: sel.payment_time_stamp,
          show_dropdown: false,
          deliveries: []
        });
        sameDateIndex = historyTabs.findIndex(element => element.purchase_time === sel.payment_time_stamp);
        // historyTabs[sameDateIndex].deliveries.push(sel.meal_desc);
        historyTabs[sameDateIndex].deliveries.push(sel);
        console.log("-- (1.2) new deliveries: ", historyTabs[sameDateIndex].deliveries);
      } else {
        console.log("-- (2.1) date found! adding delivery to tab...");
        // historyTabs[sameDateIndex].deliveries.push(sel.meal_desc);
        historyTabs[sameDateIndex].deliveries.push(sel);
        console.log("-- (2.2) new deliveries: ", historyTabs[sameDateIndex].deliveries);
      }
      // historyTabs.push(
      //   <div>
          
      //   </div>
      // );
    });

    console.log("final history tabs: ", historyTabs);

    console.log("#################### (2)");
    console.log(' ');
    
    // return(
    //   <div>
    //     {historyTabs}
    //   </div>
    // );


    // Process data into divs for rendering
    console.log("#################### (3)");
    let deliveryDropdowns = [];

    historyTabs.forEach((cycle) => {
      // let deliveriesForDropdown = [];
      // cycle.deliveries.forEach((del) => {

      // });
      console.log("==============================");
      console.log("cycle: ", cycle);
      deliveryDropdowns.push(
        <div 
          key={cycle.date}
          style={{marginTop: '50px', marginBottom: '50px'}}
        >

          <div style={{display: 'inline-flex', width: '100%'}}>
            <div className={styles.orangeHeaderLeft}>
              Next Billing Date
            </div>
            <div className={styles.orangeHeaderRight}>
              {cycle.date}
            </div>
          </div>

          <div 
            onClick={() => {
              // console.log("(showHistory) orange dropdown clicked for: ", sel.sel_menu_date);
              console.log("(showHistory) orange dropdown clicked for: ", cycle.start_delivery_date);
              // console.log("(showHistory) index 1: ", currentHistoryIndex);
              // console.log("(showHistory) index 2: ", index);

              let uniquePlanCopy = [...uniquePlans];

              console.log("(showHistory) unique plan copy: ", uniquePlanCopy);

              // uniquePlanCopy[currentHistoryIndex].history[index].display = !uniquePlanCopy[currentHistoryIndex].history[index].display;
              // setUniquePlans(uniquePlanCopy);
              // toggleDeliveryDisplay(sel.menu_date, currentPlan.purchase_id);

              // let uniquePlanCopy = [...uniquePlans];

              // console.log("(showHistory) unique plan copy: ", uniquePlanCopy);

              // uniquePlanCopy[currentHistoryIndex].history[index].display = !uniquePlanCopy[currentHistoryIndex].history[index].display;

              // console.log("(showHistory) curr: ", uniquePlanCopy[currentHistoryIndex].history[index]);
              // console.log("(showHistory) display set to: ", uniquePlanCopy[currentHistoryIndex].history[index].display);

              // setUniquePlans(uniquePlanCopy);

              // toggleDeliveryDisplay(sel.menu_date, currentPlan.purchase_id);
            }}
            style={{display: 'inline-flex', width: '100%', cursor: 'pointer'}}
          >
            <div className={styles.orangeHeaderLeft}>
              Meal Plan
            </div>
            <div className={styles.orangeHeaderRightArrow}>
              {currentPlan.meals} Meals, {currentPlan.deliveries} Deliveries
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
              {console.log("(showHistory) display? ", cycle.display)}

            </div>
          </div>
        </div>
      );
    });

    console.log("#################### (4)");

    return(
      <div>
        {deliveryDropdowns}
      </div>
    );
  }*/

  

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

      {/* {infoLoaded === false */}
      {/* {currentPlan === null || historyDropdowns === null */}
      {currentPlan === null || uniquePlans === null || billingInfo === null
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
                  : 60
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

          {console.log("current plan (before bill date): ", currentPlan)}
          <div style={{marginTop: '50px', marginBottom: '50px', /*border: 'solid'*/}}>
            <div style={{display: 'inline-flex', width: '100%'}}>
              <div className={styles.orangeHeaderLeft}>
                Next Billing Date
              </div>
              <div className={styles.orangeHeaderRight}>
                {formatDate(nextBillingDate(currentPlan.purchase_id))}
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

          {showHistory()}

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
