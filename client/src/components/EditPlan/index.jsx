import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
  fetchPlans,
  fetchSubscribed,
  chooseMealsDelivery,
  choosePaymentOption,
  fetchProfileInformation,
  changeAddressFirstName,
  changeAddressLastName,
  changeAddressStreet,
  changeAddressUnit,
  changeAddressCity,
  changeAddressState,
  changeAddressZip,
  changeAddressPhone,
  changeDeliveryInstructions,
  changePaymentPassword,
  changeCardNumber,
  changeCardCvv,
  changeCardMonth,
  changeCardYear,
  changeCardZip,
  submitPayment
} from "../../reducers/actions/subscriptionActions";

import axios from "axios";
import {API_URL} from "../../reducers/constants";
import {Link} from "react-router-dom";
import {withRouter} from "react-router";
import styles from "./editPlan.module.css";
import {WebNavBar, BottomNavBar} from "../NavBar";
import {HomeLink, FootLink, AmbassadorLink, AddressLink} from "../Home/homeButtons";

import fetchDiscounts from '../../utils/FetchDiscounts';

import PopLogin from '../PopLogin';
import Popsignup from '../PopSignup';

const google = window.google;

class EditPlan extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
      planToEdit: [],
      unlogin_plans:null,
      plansFetched: false,
      customerUid: "",
      deliveryDays: [],
      login_seen:false,
      signUpSeen:false,
      total: '0.00',
      numDeliveryDays: 0,
      fetchingNBD: true,
      fetchingNBA: true,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      unit: "",
      instructions: "",
      latitude: "",
      longitude: "",
      recalculatingPrice: false,
      selectedMealPlan: {
        delivery_first_name: "",
        delivery_last_name: "",
        delivery_phone_num: "",
        delivery_address: "",
        delivery_unit: "",
        delivery_state: "",
        delivery_city: "",
        delivery_zip: "",
        delivery_instructions: ""
      },
      deliveryInfo: {
        first_name: "",
        last_name: "",
        purchase_uid: "",
        phone: "",
        address: "",
        unit: "",
        city: "",
        state: "",
        zip: "",
        cc_num: "",
        cc_cvv: "",
        cc_zip: "",
        cc_exp_date: "",
        instructions: ""
      },
      sumFees: 0,
      paymentSummary: {
        mealSubPrice: "0.00",
        discountAmount: "0.00",
        addOns: "0.00",
        tip: "2.00",
        serviceFee: "0.00",
        deliveryFee: "0.00",
        taxRate: 0,
        taxAmount: "0.00",
        ambassadorDiscount: "0.00",
        total: "0.00",
        subtotal: "0.00"
      },
      currentSummary: {
        mealSubPrice: "0.00",
        discountAmount: "0.00",
        addOns: "0.00",
        tip: "2.00",
        serviceFee: "0.00",
        deliveryFee: "0.00",
        taxRate: 0,
        taxAmount: "0.00",
        ambassadorDiscount: "0.00",
        total: "0.00",
        subtotal: "0.00"
      },
      updatedSummary: {
        mealSubPrice: "0.00",
        discountAmount: "0.00",
        addOns: "0.00",
        tip: "2.00",
        serviceFee: "0.00",
        deliveryFee: "0.00",
        taxRate: 0,
        taxAmount: "0.00",
        ambassadorDiscount: "0.00",
        total: "0.00",
        subtotal: "0.00"
      },
      diffSummary: {
        mealSubPrice: "0.00",
        discountAmount: "0.00",
        addOns: "0.00",
        tip: "0.00",
        serviceFee: "0.00",
        deliveryFee: "0.00",
        taxRate: 0,
        taxAmount: "0.00",
        ambassadorDiscount: "0.00",
        total: "0.00",
        subtotal: "0.00"
      },
      updatedSummary: {
        mealSubPrice: "0.00",
        discountAmount: "0.00",
        addOns: "0.00",
        tip: "2.00",
        serviceFee: "0.00",
        deliveryFee: "0.00",
        taxRate: 0,
        taxAmount: "0.00",
        ambassadorDiscount: "0.00",
        total: "0.00",
        subtotal: "0.00"
      },
      subscriptionsList: [],
      subscriptionsLoaded: false,
      currentPlan: {
        id: null,
        active_subscription: {},
        summary: {},
        meals: null,
        deliveries: null,
        order_history: null,
        load_order: null,
        discount: null,
        next_billing_date: null
      },
      updatedPlan: {
        id: null,
        active_subscription: {},
        summary: {},
        meals: null,
        deliveries: null,
        order_history: null,
        load_order: null,
        discount: null,
        next_billing_date: null
      }
    };
  }

  togglePopLogin = () => {
    this.setState({
     login_seen: !this.state.login_seen,
    });

    if(!this.state.login_seen){
      this.setState({
        signUpSeen:false
      })
    }

   };

  togglePopSignup = () => {
    this.setState({
      signUpSeen: !this.state.signUpSeen
    });

    if(!this.state.signUpSeen){
      this.setState({
        login_seen:false
      })
    }
  };

  // calculateSubtotal() {
  //   let subtotal = (
  //     parseFloat(this.state.paymentSummary.mealSubPrice) -
  //     parseFloat(this.state.paymentSummary.discountAmount) + 
  //     parseFloat(this.state.paymentSummary.deliveryFee) + 
  //     parseFloat(this.state.paymentSummary.serviceFee) +
  //     parseFloat(this.state.paymentSummary.taxAmount) + 
  //     parseFloat(this.state.paymentSummary.tip)
  //   );
  //   return subtotal.toFixed(2);
  // }

  // calculateTotal() {
  //   let total = (
  //     parseFloat(this.state.paymentSummary.mealSubPrice) -
  //     parseFloat(this.state.paymentSummary.discountAmount) + 
  //     parseFloat(this.state.paymentSummary.deliveryFee) + 
  //     parseFloat(this.state.paymentSummary.serviceFee) +
  //     parseFloat(this.state.paymentSummary.taxAmount) + 
  //     parseFloat(this.state.paymentSummary.tip) -
  //     parseFloat(this.state.paymentSummary.ambassadorDiscount)
  //   );
  //   return total.toFixed(2);
  // }

  // setTotal() {
  //   let total = this.calculateTotal();
  //   let subtotal = this.calculateSubtotal();
  //   this.setState(prevState => ({
  //     recalculatingPrice: false,
  //     paymentSummary: {
  //       ...prevState.paymentSummary,
  //       total,
  //       subtotal
  //     }
  //   }), ()=>{
  //     console.log("setTotal new paymentSummary: ", this.state.paymentSummary);
  //   });
  // }

  calculateSubtotal(summary) {
    let subtotal = (
      parseFloat(summary.mealSubPrice) -
      parseFloat(summary.discountAmount) + 
      parseFloat(summary.deliveryFee) + 
      parseFloat(summary.serviceFee) +
      parseFloat(summary.taxAmount) + 
      parseFloat(summary.tip)
    );
    return subtotal.toFixed(2);
  }

  calculateTotal(summary) {
    let total = (
      parseFloat(summary.mealSubPrice) -
      parseFloat(summary.discountAmount) + 
      parseFloat(summary.deliveryFee) + 
      parseFloat(summary.serviceFee) +
      parseFloat(summary.taxAmount) + 
      parseFloat(summary.tip) -
      parseFloat(summary.ambassadorDiscount)
    );
    return total.toFixed(2);
  }

  setTotal(summary) {
    let total = this.calculateTotal(summary);
    let subtotal = this.calculateSubtotal(summary);
    let newSummary = {
      ...summary,
      total,
      subtotal
    }
    return newSummary;
  }

  updatePaymentSummary(updatedPlan) {
    console.log("changing updated plan: ", updatedPlan);
    console.log("plan to update to: ", this.props.plans[updatedPlan.meals][updatedPlan.deliveries]);
    let newPlan = this.props.plans[updatedPlan.meals][updatedPlan.deliveries];

    let newUpdatedSummary = {
      mealSubPrice: (newPlan.num_deliveries*newPlan.item_price).toFixed(2),
      discountAmount: (newPlan.num_deliveries*newPlan.item_price*newPlan.delivery_discount*0.01).toFixed(2),
      addOns: "0.00",
      tip: updatedPlan.active_subscription.driver_tip.toFixed(2),
      serviceFee: updatedPlan.active_subscription.service_fee.toFixed(2),
      deliveryFee: updatedPlan.active_subscription.delivery_fee.toFixed(2),
      taxRate: 0,
      taxAmount: updatedPlan.active_subscription.taxes.toFixed(2),
      ambassadorDiscount: "0.00",
      total: "0.00",
      subtotal: "0.00"
    };
    newUpdatedSummary = this.setTotal(newUpdatedSummary);

    let currSum = this.state.currentSummary;
    let diffMealSub = (
      parseFloat(newUpdatedSummary.mealSubPrice) -
      parseFloat(currSum.mealSubPrice)
    ).toFixed(2);
    let diffDiscount = (
      parseFloat(newUpdatedSummary.discountAmount) -
      parseFloat(currSum.discountAmount)
    ).toFixed(2);
    let diffTip = (
      parseFloat(newUpdatedSummary.tip) -
      parseFloat(currSum.tip)
    ).toFixed(2);
    let diffTotal = (
      parseFloat(newUpdatedSummary.total) -
      parseFloat(currSum.total)
    ).toFixed(2);

    let newDiffSummary = {
      ...this.state.diffSum,
      mealSubPrice: diffMealSub,
      discountAmount: diffDiscount,
      tip: diffTip,
      total: diffTotal
    }

    console.log("updated payment summary: ", newUpdatedSummary);

    this.setState({
      updatedSummary: newUpdatedSummary,
      diffSummary: newDiffSummary
    });
  }

  // calculateAdditionalCharges = () => {
  //   // let currCharge = this.state.currentBillingAmount;
  //   // let diffCharge = this.calculateTotal();
  //   // let feesCharge = this.state.sumFees

  //   let currCharge = this.state.currentPlan.amount_due;
  //   let diffCharge = this.calculateTotal();
  //   let feesCharge = this.state.sumFees

  //   /*console.log("curr charge: ", currCharge);
  //   console.log("diff charge: ", diffCharge);
  //   console.log("fees charge: ", feesCharge);*/

  //   let addCharges = -(
  //     parseFloat(currCharge) -  
  //     parseFloat(diffCharge) -
  //     feesCharge
  //   );

  //   /*console.log("add charges (float): ", addCharges);
  //   console.log("add charges (string): ", addCharges.toFixed(2));*/

  //   return addCharges.toFixed(2);
  // };

  calculateNextBillingAmount = (orders) => {
    console.log("(CNBA) orders: ", orders);

    // let pastPurchases = res.data.result;
    // let initialPurchase = pastPurchases[0];

    // console.log("pid_history response: ", pastPurchases);

    // var sumAmountDue = 0;
    // pastPurchases.forEach((pur) => {
    //   console.log(pur.purchase_uid + " amount due: " + pur.amount_due);
    //   sumAmountDue += pur.amount_due;
    // });

    // let sumFees = (
    //   initialPurchase.driver_tip + 
    //   initialPurchase.delivery_fee +
    //   initialPurchase.service_fee +
    //   initialPurchase.taxes
    // )

    // console.log("final amount due: " + sumAmountDue);
    // this.setState({
    //   nextBillingAmount: sumAmountDue.toFixed(2),
    //   sumFees,
    //   fetchingNBA: false
    // });

    let initialPurchase = orders[0];

    var sumAmountDue = 0;
    orders.forEach((pur) => {
      console.log(pur.purchase_uid + " amount due: " + pur.amount_due);
      sumAmountDue += pur.amount_due;
    });

    let sumFees = (
      initialPurchase.driver_tip + 
      initialPurchase.delivery_fee +
      initialPurchase.service_fee +
      initialPurchase.taxes
    )

    console.log("final amount due: " + sumAmountDue);

    return sumAmountDue;
  }

  loadSubscriptions = (subscriptions, discounts) => {
    let newSubList = [];
    let defaultPlan = null;

    subscriptions.forEach((sub, index) => {

      let subscription = {};

      console.log(" ");
      console.log("======| subscription " + index + " |======");
      console.log("Meal Plans: ", sub.items);
      console.log("Purchase ID: ", sub.purchase_id);
      console.log("Next Delivery Date: ", sub.sel_menu_date);
      console.log("Next Delivery Status: ", sub.meal_selection);
      console.log("Next Billing Date: ", sub.menu_date);

      console.log(" ");

      let parsedItems = JSON.parse(sub.items)[0];
      let parsedMeals = parsedItems.name.substring(0,parsedItems.name.indexOf(" "));
      let parsedDeliveries = parsedItems.qty;

      console.log("(parsed) Meals: ", parsedMeals);
      console.log("(parsed) Deliveries: ", parsedDeliveries);

      let discountItem = discounts.filter( function(e) {
        return e.deliveries === parsedDeliveries;
      });

      let parsedDiscount = discountItem[0].discount;

      console.log("(parsed) discount: ", parsedDiscount);

      let parsedId = sub.purchase_id.substring(sub.purchase_id.indexOf("-")+1,sub.purchase_id.length)

      console.log("(parsed) Purchase ID: ", parsedId);

      let parsedDeliveryDate = sub.sel_menu_date.substring(0,sub.sel_menu_date.indexOf(" "));

      console.log("(parsed) Delivery Date: ", parsedDeliveryDate);

      let parsedSelection = JSON.parse(sub.meal_selection)[0].name;
      let parsedStatus = null;
      if(parsedSelection !== 'SURPRISE' && parsedSelection !== 'SKIP'){
        parsedStatus = 'SELECTED';
      } else {
        parsedStatus = parsedSelection;
      }

      console.log("(parsed) Delivery Status: ", parsedStatus);

      let parsedBillingDate = sub.menu_date.substring(0,sub.menu_date.indexOf(" "));

      console.log("(parsed) Billing Date: ", parsedBillingDate);

      console.log(" ");
      console.log("Base Amount: ", sub.base_amount);
      console.log("Taxes: ", sub.taxes);
      console.log("Delivery Fee: ", sub.delivery_fee);
      console.log("Service Fee: ", sub.service_fee);
      console.log("Driver Tip: ", sub.driver_tip);

      let nextBillingAmount = (
        sub.base_amount + 
        sub.taxes +
        sub.delivery_fee +
        sub.service_fee + 
        sub.driver_tip
      ) - (parsedDiscount*0.01*sub.base_amount);

      console.log("Next Billing Amount: ", nextBillingAmount);

      console.log(" ");

      subscription["load_order"] = index;
      subscription["id"] = parsedId;
      subscription["meals"] = parsedMeals;
      subscription["deliveries"] = parsedDeliveries;
      subscription["discount"] = parsedDiscount;
      subscription["next_delivery_date"] = parsedDeliveryDate;
      subscription["next_delivery_status"] = parsedStatus;
      subscription["next_billing_date"] = parsedBillingDate;
      subscription["next_billing_amount"] = nextBillingAmount.toFixed(2);
      subscription["raw_data"] = sub;

      console.log("Subscription index: ", index);
      console.log("Subscription to be pushed: ", subscription);

      if(index === 0){
        defaultPlan = subscription;
      }

      newSubList.push(subscription);

      console.log(" ");
      
    });

    newSubList.sort(function(a,b) {
      return a.load_order - b.load_order
    });

    this.setState({
      subscriptionsList: newSubList,
      subscriptionsLoaded: true,
      currentPlan: defaultPlan,
      updatedPlan: defaultPlan
    });
  }

  /*loadSubscriptions = (subscriptions, discounts, deliveryDate, selections) => {
    console.log("loading subscription info...");
    console.log("(loadSubscriptions) subscriptions: ", subscriptions);
    console.log("(loadSubscriptions) discounts: ", discounts);
    console.log("(loadSubscriptions) delivery date: ", deliveryDate);
    console.log("(loadSubscriptions) selections: ", selections);



    let currentPlan = null;
    let updatedPlan = null;
    let newSummary = {};

    subscriptions.forEach((sub) => {

      let activeSub = sub.order_history.filter( function(e) {
        return e.purchase_status === "ACTIVE";
      });

      sub["active_subscription"] = activeSub[0];

      console.log("NEW ACTIVE SUBSCRIPTION: ", activeSub[0]);

      let planItems = JSON.parse(activeSub[0].items);


      let activeSubMeals = planItems[0]
        .name.substring(0,planItems[0].name.indexOf(" "));
      let activeSubDeliveries = planItems[0].qty;


      let selectionsForId = selections.filter( function(e) {
        return e.purchase_id === sub.id && e.sel_menu_date === deliveryDate;
      });

      console.log(sub.id + " meals selections: ", selectionsForId);

      let mealSelection = "";

      if(selectionsForId.length > 0){
        let mealSelectionParsed = JSON.parse(selectionsForId[0].meal_selection);
        console.log("MEAL SELECTION PARSED: ", mealSelectionParsed);
        mealSelection = mealSelectionParsed[0].name;
        console.log("NEW MEAL SELECTION: ", mealSelection);
      }


      console.log(sub.id + " order history: ", sub.order_history);
      let amountDue = this.calculateNextBillingAmount(sub.order_history);


      sub["meals"] = activeSubMeals;
      sub["deliveries"] = activeSubDeliveries;
      sub["amount_due"] = amountDue;
      sub["next_delivery_date"] = deliveryDate;
      sub["meal_selection"] = mealSelection;

      let activeSubDiscount = discounts.filter( function(e) {
        return e.deliveries === sub.deliveries;
      });

      console.log("active sub discount: ", activeSubDiscount);

      sub["discount"] = activeSubDiscount[0].discount;


      console.log(sub.id + " active subscription: ", sub.active_subscription);

      if(sub.load_order === 0){
        console.log("currentPlan set to: ", sub);
        currentPlan = sub;
        updatedPlan = sub;
        newSummary = {
          mealSubPrice: activeSub[0].subtotal.toFixed(2),
          discountAmount: (activeSubDiscount[0].discount*activeSub[0].subtotal*0.01).toFixed(2),
          addOns: "0.00",
          tip: activeSub[0].driver_tip.toFixed(2),
          serviceFee: activeSub[0].service_fee.toFixed(2),
          deliveryFee: activeSub[0].delivery_fee.toFixed(2),
          taxRate: 0,
          taxAmount: activeSub[0].taxes.toFixed(2),
          ambassadorDiscount: "0.00",
          total: "0.00",
          subtotal: "0.00"
        };
        newSummary = this.setTotal(newSummary);
        console.log("newer summary: ", newSummary);
      }
    });

    console.log("new subscriptions: ", subscriptions);

    console.log("summary saved to state: ", newSummary);

    this.setState({
      currentPlan,
      updatedPlan,
      subscriptionsLoaded: true,
      subscriptionsList: subscriptions,
      updatedSummary: newSummary,
      currentSummary: newSummary
    })

  }*/

  changePurchase() {
    let object = {
      cc_cvv: this.state.updatedPlan.cc_cvv,
      cc_exp_date: this.state.updatedPlan.cc_cvv,
      cc_num: this.state.updatedPlan.cc_cvv,
      cc_zip: this.state.updatedPlan.cc_cvv,
      customer_email: this.props.email,
      items: [{
        qty: this.props.selectedPlan.num_deliveries.toString(), 
        name: this.props.selectedPlan.item_name, 
        price: this.props.selectedPlan.item_price.toString(), 
        item_uid: this.props.selectedPlan.item_uid, 
        itm_business_uid: this.props.selectedPlan.itm_business_uid
      }],
      new_item_id: this.props.selectedPlan.item_uid,
      purchase_id: this.state.updatedPlan.id,
      start_delivery_date: this.state.updatedPlan.start_delivery_date
    }
    axios.post(API_URL + 'change_purchase/' + this.state.updatedPlan.id, object)
      .then(res => {
        console.log("change_purchase response: ", res);
        this.props.history.push("/meal-plan");
      })
      .catch(err => {
        console.log(err);
        if (err.response) {
          console.log("error: " + JSON.stringify(err.response));
        }
      });
  }

  componentDidMount() {

    // console.log("Mounting...");

    // console.log("(mount) edit plan props: ", this.props);

    // console.log("google: ", google);
    // console.log("after google");

    let temp_lat;
    let temp_lng;

    if(this.state.latitude==''){
      temp_lat = 37.3382;
    }
    else{
      temp_lat = this.state.latitude;
    }

    if(this.state.longitude==''){
      temp_lng = -121.893028
    }
    else{
      temp_lng = this.state.longitude;
    }

    //console.log("before id map");

    // console.log(document.getElementById("map"));

    //console.log("before const map");

    window.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: temp_lat, lng: temp_lng},
      zoom: 12,
    });

    //console.log("after map");

    let queryString = this.props.location.search;
    let urlParams = new URLSearchParams(queryString);
    // Clear Query parameters
    window.history.pushState({}, document.title, window.location.pathname);

    /*else if (
      document.cookie
        .split(";")
        .some(item => item.trim().startsWith("customer_uid="))
    ) {
      let customer_uid = document.cookie
        .split("; ")
        .find(item => item.startsWith("customer_uid="))
        .split("=")[1];*/

    //if (this.props.location.customerUid !== undefined) {
    // if (true === true) {
    //   console.log("edit-plan customerId: ", this.props.customerId);

    //   console.log("edit-plan LOGGED IN");
    //   //console.log("edit plan props.location (logged in): ", this.props.location);

    //   let customerUid = this.props.customerId;

    if (urlParams.has("customer_uid")) {
      let customer_uid = urlParams.get("customer_uid");
      document.cookie = "customer_uid=" + customer_uid;

      console.log("1 edit-plan customerId: ", customer_uid);
      // console.log("1 edit-plan LOGGED IN");

      let customerUid = customer_uid;

      axios
        .get(API_URL + 'Profile/' + customerUid)
        .then(res => {
          console.log("fetch profile response: ", res);

          this.setState(prevState => ({
            customerUid,
            mounted: true
          }), () => {
            this.props.fetchProfileInformation(customerUid);
            this.props.fetchPlans();
            this.props.fetchSubscribed(customerUid)
              .then((ids) => {
                console.log("fetchSubscribed purchaseIds: ", ids);
                for (const [subIndex, subData] of Object.entries(this.props.subscribedPlans)) {
                  console.log("(1)======| SUBS FETCHED |======(1)");
                  console.log("subIndex: ", subIndex);
                  console.log("subData: ", subData);
                  console.log("(2)============================(2)");
                  if(subIndex === "0"){

                  }
                }
              });
          });

        })
        .catch(err => {
          if (err.response) {
            console.log(err.response);
          } else {
            console.log(err.toString());
          }
          this.props.history.push("/meal-plan");
        });

    } else if (      
      document.cookie
        .split(";")
        .some(item => item.trim().startsWith("customer_uid="))
    ) {
      let customer_uid = document.cookie
        .split("; ")
        .find(item => item.startsWith("customer_uid="))
        .split("=")[1];

      console.log("2 edit-plan customerId: ", customer_uid);
      // console.log("2 edit-plan LOGGED IN");

      let customerUid = customer_uid;

      axios
        .get(API_URL + 'Profile/' + customerUid)
        .then(res => {

          // NOTE: the following comments outline the purpose of the
          // following section (everything contained within this "then" block)

          // OBJECTIVE:
          // Call all endpoints necessary for displaying data on page
          // (ie. purchase history, billing dates, delivery dates, etc...)

          // Challenges (why the following code here is so convoluted):
          // -- When possible, endpoints are called in parallel in order
          //    to maximize efficiency by reducing time spent awaiting responses
          // -- All necessary data has to been returned by endpoints before 
          //    the page loads (synchronization must be maintained)

          this.setState(prevState => ({
            customerUid,
            mounted: true
          }), () => {
            this.props.fetchProfileInformation(customerUid);
            //this.props.fetchPlans();

            console.log("plans before fetch: ", this.props.plans);

            this.props.fetchPlans();

            let fetchedDiscounts = null;
            let fetchedSubscriptions = null;

            fetchDiscounts((discounts) => {
              console.log("fetchDiscounts callback: ", discounts);

              fetchedDiscounts = discounts;

              if(fetchedSubscriptions !== null){
                console.log("(1) load subscriptions");
                this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts);
              }

            });

            axios.get(API_URL + 'next_meal_info/' + this.state.customerUid)
              .then(res => {
                console.log("next meal info res: ", res);

                fetchedSubscriptions = res.data.result;

                if(fetchedDiscounts !== null){
                  console.log("(2) load subscriptions");
                  this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts);
                }

                // subs.forEach((sub, index) => {
                //   console.log(" ");
                //   console.log("======| subscription " + index + " |======");
                //   console.log("Meal Plans: ", sub.items);
                //   console.log("Purchase ID: ", sub.purchase_id);
                //   console.log("Next Delivery Date: ", sub.sel_menu_date);
                //   console.log("Next Delivery Status: ", sub.meal_selection);
                //   console.log("Next Billing Date: ", sub.menu_date);
                //   console.log("Next Billing Amount: ", sub.base_amount);
                //   console.log(" ");

                //   loadSubscription(sub);

                //   if(index = subs.length){

                //   }
                // });
              })
              .catch(err => {
                console.log(err);
              });

            /*
            let subscriptionsFetched = false;
            let fetchedSubscriptions = [];
            let fetchedDiscounts = null;
            let billingDatesFetched = 0;
            let fetchedMealSelections = null;
            let nextDeliveryDate = null;

            // fetch discounts corresponding to each number of deliveries
            fetchDiscounts((discounts) => {
              console.log("fetchDiscounts callback: ", discounts);

              fetchedDiscounts = discounts;

              if(subscriptionsFetched === true && 
                nextDeliveryDate !== null && 
                fetchedMealSelections !== null){
                console.log("(1) load subscriptions");
                this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts, nextDeliveryDate, fetchedMealSelections);
              }

            });

            // fetch delivery dates
            axios.get(API_URL + 'upcoming_menu_dates')
              .then(res => {
                console.log("upcoming menu dates res: ", res);
                console.log("first date: ", res.data.result[0].menu_date);
                nextDeliveryDate = res.data.result[0].menu_date;

                if(subscriptionsFetched === true && 
                  fetchedDiscounts !== null && 
                  fetchedMealSelections !== null){
                  console.log("(2) load subscriptions");
                  this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts, nextDeliveryDate, fetchedMealSelections);
                }
              })
              .catch(err => {
                console.log(err);
              });

            // fetch meals selections
            axios.get(API_URL + 'meals_selected', {
              params: {customer_uid: this.state.customerUid}
            })
              .then(res => {
                console.log("meals_selected res: ", res);
                fetchedMealSelections = res.data.result;

                if(subscriptionsFetched === true && 
                  fetchedDiscounts !== null &&
                  nextDeliveryDate !== null){
                  console.log("(3) load subscriptions");
                  this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts, nextDeliveryDate, fetchedMealSelections);
                }
              })
              .catch(err => {
                console.log(err);
              });

            // Fetch all subscriptions
            this.props.fetchSubscribed(customerUid)              
              .then((ids) => {
                console.log("fetchSubscribed result: ", ids);

                // Use subscription IDs to get each subscription's order history and next billing date
                let load_order = 0;
                ids.forEach((id) => {

                  let currSubscription = {
                    id,
                    load_order,
                    order_history: null,
                    next_billing_date: null,
                  };

                  load_order++;

                  // fetch order history for ID
                  axios.get(API_URL + 'pid_history/' + id)
                    .then(res => {

                      console.log(id + " past purchases: ", res.data.result);

                      currSubscription.order_history = res.data.result;

                      console.log("sub histories fetched: ", fetchedSubscriptions.length);

                      if(currSubscription.next_billing_date !== null){
                        fetchedSubscriptions.push(currSubscription);
                      }

                      if(fetchedSubscriptions.length === ids.length && 
                        billingDatesFetched === ids.length) {
                        subscriptionsFetched = true;

                        if(fetchedDiscounts !== null && 
                          nextDeliveryDate !== null  && 
                          fetchedMealSelections !== null){
                          console.log("(4.1) load subscriptions");
                          this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts, nextDeliveryDate, fetchedMealSelections);
                        }

                      }

                    })
                    .catch(err => {
                      console.log(err);
                    });

                  // fetch next billing date for ID
                  axios.get(API_URL + 'predict_autopay_day/' + id)
                    .then(res => {
                      billingDatesFetched++;
                      currSubscription.next_billing_date = res.data.menu_date;

                      console.log("billing dates fetched: ", billingDatesFetched);

                      if(currSubscription.order_history !== null){
                        fetchedSubscriptions.push(currSubscription);
                      }

                      if(fetchedSubscriptions.length === ids.length && 
                        billingDatesFetched === ids.length) {
                        subscriptionsFetched = true;

                        if(fetchedDiscounts !== null && 
                          nextDeliveryDate !== null && 
                          fetchedMealSelections !== null){
                          console.log("(4.2) load subscriptions");
                          this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts, nextDeliveryDate, fetchedMealSelections);
                        }

                      }
                
                    })
                    .catch(err => {
                      console.log(err);
                    });
                });
              });
            */});

        })
        .catch(err => {
          if (err.response) {
            console.log(err.response);
          } else {
            console.log(err.toString());
          }
          this.props.history.push("/meal-plan");
        });

    // Not logged in
    } else {
      // Reroute to log in page
      // console.log("edit-plan NOT LOGGED IN");
      // console.log("edit plan props.location (not logged in): ", this.props.location);
      this.props.history.push("/choose-plan");
    }
  }

  hideSubscribedMeals = () => {
    console.log("discounts: NOTHING");
    return (
      <div 
        style={{
          textAlign: 'center', 
          paddingTop: '70px',
          fontSize: '40px', 
          fontWeight: 'bold',
          width: '100%'
        }}
      >
        Loading Subscriptions...
      </div>
    );
  }

  showSubscribedMeals = () => {

    let deselectedMealButton = styles.mealButton;
    let selectedMealButton = styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];

    this.state.subscriptionsList.forEach((sub) => {

      console.log("sub id: ", sub.id);
      console.log("curr id: ", this.state.currentPlan.id);
      mealButtons.push(
        <div
          key={sub.id}
          className={
            this.state.currentPlan.id === sub.id
              ? selectedMealButton
              : deselectedMealButton
          }
          onClick={() => {

            console.log("new current plan: ", sub);


            this.setState({
              currentPlan: sub,
              updatedPlan: sub
            });

          }}
        >
          <div className={styles.mealButtonEdit}>
            ✏️
          </div>
          <div className={styles.mealButtonPlan}>
            {sub.meals} Meals, {sub.deliveries} Deliveries
          </div>
          <div className={styles.mealButtonPlan}>
            {sub.id}
          </div>
          <div className={styles.mealButtonSection}>
            {sub.next_delivery_date}
          </div>
          <div className={styles.mealButtonSection}>
            {sub.next_delivery_status}
          </div>
          <div className={styles.mealButtonSection}>
            {sub.next_billing_date}
          </div>
          <div className={styles.mealButtonSection}>
            ${sub.next_billing_amount}
          </div>
        </div>
      );
    });

    return(
      <div style={{width: '100%'}}>
        {mealButtons}
      </div>
    );
  };

  showPlanDetails= () => {
    return (
      <>
      <div className={styles.boxPDleft}>

      <div style={{width: 'fit-content'}}>
        <div className={styles.planHeader}>
          Current Plan
        </div>

        <div style={{paddingBottom: '50px'}}>
          <div style={{paddingBottom: '10px'}}>
            MEALS
          </div>
          <div className={styles.iconMeals}>
            {this.state.currentPlan.meals}
          </div>
        </div>

        <div style={{paddingBottom: '50px'}}>
          <div style={{paddingBottom: '10px'}}>
            DELIVERIES
          </div>
          <button className={styles.deliveryButtonCurrent}>
            <span style={{fontSize: '35px'}}>
              {this.state.currentPlan.deliveries}
            </span>
            <br></br>
            <span style={{whiteSpace: "nowrap"}}>
              {"(Save "+this.state.currentPlan.discount+"%)"}
            </span>
          </button>
        </div>

        <div>
          <div style={{paddingBottom: '10px'}}>
            CANCEL
          </div>
          <div 
            className={styles.iconTrash}
            onClick={() => {
              axios
                .put(`${API_URL}cancel_purchase`,{
                  purchase_uid: this.state.selectedId,
                })
                .then((response) => {
                  console.log("cancel_purchase response: " + JSON.stringify(response));
                  console.log("cancel_purchase customerUid: " + this.state.customerUid);
                  this.props.fetchSubscribed(this.state.customerUid);
                })
                .catch((err) => {
                  if(err.response) {
                    console.log(err.response);
                  }
                  console.log(err);
                })
            }}
          >

          </div>
        </div>


          </div>

    </div>

    <div className={styles.boxPDright}>

      <div className={styles.planHeader}>
        Updated Plan
      </div>

      <div className={styles.menuSection}>
        <div className={styles.center}>
          <span className={styles.subHeader}>
            NUMBER OF MEALS PER DELIVERY
          </span>
        </div>
        {(()=>{
          if(JSON.stringify(this.props.plans) === "{}"){
            //console.log("(web) meals not yet fetched");
          } else {
            //console.log("(web) meals fetched!");
            return(
              <div className={styles.buttonWrapper}>
                {this.mealsDelivery()}
              </div>
            );
          }
        })()}
      </div>
        
      <div className={styles.menuSection}>
        <div className={styles.center}>
          <span className={styles.subHeader}>
            TOTAL NUMBER OF DELIVERIES
          </span>
        </div>
        {(()=>{
          if(JSON.stringify(this.props.plans) === "{}"){
            //console.log("(web) plans not yet fetched");
          } else {
            //console.log("(web) plans fetched!");
            return(
              <div className='row' style={{marginTop: '20px'}}>
                {this.paymentFrequency2()}
              </div>
            );
          }
        })()}
      </div>

      <div className={styles.chargeContainer}>

        <div className={styles.chargeTotal}>
          <div style={{display: 'inline-flex'}}>
            {/*(() => {
              let chargeOrRefund = this.calculateAdditionalCharges();
              if (parseFloat(chargeOrRefund) >= 0) {
                return (
                  <>
                    <div className={styles.chargeText}>
                      {"Additional Charges "}
                    </div>
                    <div className={styles.chargeAmount}>
                      ${this.calculateAdditionalCharges()}
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div className={styles.chargeText}>
                      {"You will be refunded "}
                    </div>
                    <div className={styles.chargeAmount}>
                      ${-this.calculateAdditionalCharges()}
                    </div>
                  </>
                );
              }
            })()*/}
            {(() => {
              let chargeOrRefund = -1;
              if (parseFloat(chargeOrRefund) >= 0) {
                return (
                  <>
                    <div className={styles.chargeText}>
                      {"Additional Charges "}
                    </div>
                    <div className={styles.chargeAmount}>
                      ${-1}
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div className={styles.chargeText}>
                      {"You will be refunded "}
                    </div>
                    <div className={styles.chargeAmount}>
                      ${this.state.diffSummary.total}
                    </div>
                  </>
                );
              }
            })()}
          </div>
        </div>

        <br />
        {/*<button 
          className={styles.chargeBtn}
          onClick = {() => {
            console.log("save changes clicked...");
            this.saveChanges();
          }}
        >
          Save Changes
        </button>*/}

      </div> 

    </div>
    </>
    );
  }

  saveEdits = () => {
    console.log("saving edits...");
    console.log("edits to save: ", this.state.deliveryInfo);

    axios
      .post(API_URL + 'update_delivery_info', this.state.deliveryInfo)
      .then((res) => {
        console.log("update delivery info res: ", res);
      }).catch((err) => {
        console.log(
          'error happened while updating delivery info',
          err
        );
        if(err.response){
          console.log("err.response: " + JSON.stringify(err.response));
        }
      });

  }

  changeTip(newTip) {
    console.log("attempted to change tip");
    // this.setState(prevState => ({
    //   recalculatingPrice: true,
    //   paymentSummary: {
    //     ...prevState.paymentSummary,
    //     tip: newTip
    //   }
    // }), () => {
    //   this.setTotal();
    //   console.log("changeTip new paymentSummary: ", this.state.paymentSummary);
    // });
  }

  mealsDelivery = () => {

    let deselectedPlateButton = styles.plateButton;
    let selectedPlateButton =
    styles.plateButton + " " + styles.plateButtonSelected;
    let plateButtons = [];
    let singleMealData;

    let mealPlans = this.props.plans;
    for (const [mealIndex, mealData] of Object.entries(mealPlans)) {

      singleMealData = mealData["1"];

      plateButtons.push(
        <div className={styles.plateButtonWrapper}>
        <button
          key={mealIndex}
          className={
            this.state.updatedPlan.meals === mealIndex
              ? selectedPlateButton
              : deselectedPlateButton
          }
          onClick={() => {
            console.log("(meals) updated meal before: ", this.state.updatedPlan);
            console.log("(meals) updated meal to change to: ", mealData);
            console.log("(meals) meal index: ", mealIndex);
            this.props.chooseMealsDelivery(
              mealIndex,
              this.state.updatedPlan.deliveries,
              this.props.plans
            );
            
            // console.log("===== mealIndex: " + mealIndex);
            // console.log("===== paymentOption: " + this.props.paymentOption);
            // this.setState({
            //   updatedMeals: mealIndex
            // });
            this.setState(prevState => ({
              updatedPlan: {
                ...prevState.updatedPlan,
                meals: mealIndex
              }
            }), () => {
              this.updatePaymentSummary(this.state.updatedPlan);
            });
          }}
        >
          {mealIndex}
        </button>
        <div style={{textAlign: 'center', marginTop: '10px'}}>
          ${singleMealData.item_price}
        </div>
        </div>
      );
    }
    return plateButtons;
  };

  paymentFrequency2 = () => {
    let deselectedPaymentOption = styles.deliveryButton;
    let selectedPaymentOption = styles.deliveryButton + " " + styles.deliveryButtonSelected;
    let paymentOptionButtons = [];
      
    var discounts = this.props.plans[2];
    var discount = null;

    if(typeof(discounts) !== "undefined"){
      for (const [deliveryIndex, deliveryData] of Object.entries(discounts)) {
        let active = false;
        if (this.props.meals === "") {
          active = true;
        } else {
          active = false;
        }
          
        try{
          discount = discounts[deliveryIndex].delivery_discount;
          //console.log("delivery discount: " + discount);
        } catch(e) {
          console.log("delivery discount UNDEFINED");
        }
          
        paymentOptionButtons.push(
          <div className={styles.sameLine} key={deliveryIndex}>
            {(() => {
                let tempPlan = null;
                if(this.state.unlogin_plans===null){
                  tempPlan=this.props.plans
                }
                else{
                  tempPlan = this.state.unlogin_plans
                }
                return (
                  <div style={{display: 'inline-block'}}>
                    <button
                      className={
                        this.state.updatedPlan.deliveries === deliveryIndex
                          ? selectedPaymentOption
                          : deselectedPaymentOption
                      }
                      onClick={() => {
                        console.log("(deliveries) updated meal before: ", this.state.updatedPlan);
                        console.log("(deliveries) updated meal to change to: ", deliveryData);
                        console.log("(deliveries) delivery index: ", deliveryIndex);
                        this.props.choosePaymentOption(
                          deliveryIndex,
                          this.state.updatedPlan.meals,
                          this.props.plans
                        )
                        try{
                          discount = discounts[deliveryIndex].delivery_discount;
                          //console.log("delivery discount: " + discount);
                        } catch(e) {
                          console.log("delivery discount UNDEFINED");
                        }
                        this.setState(prevState => ({
                          updatedPlan: {
                            ...prevState.updatedPlan,
                            deliveries: deliveryData.num_deliveries.toString(),
                          }
                        }));
                      }}
                    >
                    <span style={{fontSize: '35px'}}>
                      {deliveryIndex}
                    </span>
                    <br></br>
                    {(() => {
                      if (typeof(discount) !== "undefined" && discount > 0) {
                        return (
                          <span>(Save {discount}%)</span>
                        );
                      }
                    })()}  
                    </button>
                    {/*(()=>{
                      if(deliveryIndex % this.state.numDeliveryDays === 0){
                        //console.log("is 3");
                        return(
                          <div className={styles.deliverySubtext}>
                            {(() => {
                              if (deliveryIndex/this.state.numDeliveryDays === 1) {
                                return (
                                  <>
                                    {deliveryIndex/this.state.numDeliveryDays} WEEK
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    {deliveryIndex/this.state.numDeliveryDays} WEEKS
                                  </>
                                );
                              }
                            })()}
                          </div>
                        );
                      }
                    })()*/}
                  </div>
                );
            })()}     
          </div>
        );
      }
    }
    return paymentOptionButtons;
  };

  render() {
    /*if (!this.state.mounted) {
      return null;
    }*/
    //console.log("(rerender) edit plan props: ", this.props);
    console.log("(rerender) current plan: ", this.state.currentPlan);
    console.log("(rerender) updated plan: ", this.state.updatedPlan);
    return (
      <>
        <WebNavBar 
          poplogin = {this.togglePopLogin}
          popSignup = {this.togglePopSignup}
        />

        {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
        {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}

        <div className={styles.sectionHeaderScroll}>
          Select Meal Plan
        </div>

        <div className={styles.containerSplit}>
          <div className={styles.boxScroll}>
            <div className={styles.mealButtonHeader}>
              <div className={styles.mealButtonEdit}>
                
              </div>
              <div className={styles.mealButtonPlan} style={{fontWeight: 'bold', fontSize: '20px'}}>
                Meal Plans
              </div>
              <div className={styles.mealButtonSection} style={{fontWeight: 'bold', fontSize: '20px'}}>
                Purchase ID
              </div>
              <div className={styles.mealButtonSection} style={{fontWeight: 'bold', fontSize: '20px'}}>
                Next Delivery Date
              </div>
              <div className={styles.mealButtonSection} style={{fontWeight: 'bold', fontSize: '20px'}}>
                Next Delivery Status
              </div>
              <div className={styles.mealButtonSection} style={{fontWeight: 'bold', fontSize: '20px'}}>
                Next Billing Date
              </div>
              <div className={styles.mealButtonSection} style={{fontWeight: 'bold', fontSize: '20px'}}>
                Next Billing Amount
              </div>
            </div>
            <div style={{display: 'flex'}}>
              {/*JSON.stringify(this.props.plans) !== '{}' 
                ? this.showSubscribedMeals() 
                : this.hideSubscribedMeals()*/}
              {this.state.subscriptionsLoaded === true
                ? this.showSubscribedMeals() 
                : this.hideSubscribedMeals()}
            </div>
          </div>

        </div>

        <div className={styles.sectionHeader}>
          Plan Details
        </div>

        <div className={styles.containerSplit}>

            {this.state.subscriptionsLoaded === true
              ? this.showPlanDetails() 
              : this.hideSubscribedMeals()}

        </div>

        <div style={{display: 'flex'}}>
          <div className={styles.sectionHeaderLeft}>
            Edit Delivery Details
          </div>
          <div className={styles.sectionHeaderRight}>
            Payment Summary
          </div>
        </div>

        {/*<div style={{display: 'flex', marginLeft: '8%', width: '42%'}}>*/}
        <div className={styles.containerSplit}>
          <div style = {{display: 'inline-block', marginLeft: '8%', width: '40%', marginRight: '2%'}}>
            <div style={{display: 'flex'}}>
              <input
                type='text'
                placeholder='First Name'
                className={styles.inputContactLeft}
                value={this.state.deliveryInfo.first_name}
                onChange={e => {
                  this.setState(prevState => ({
                    deliveryInfo: {
                      ...prevState.deliveryInfo,
                      first_name: e.target.value
                    }
                  }));
                }}
              />

              <input
                type='text'
                placeholder='Last Name'
                className={styles.inputContactRight}
                value={this.state.deliveryInfo.last_name}
                onChange={e => {
                  this.setState(prevState => ({
                    deliveryInfo: {
                      ...prevState.deliveryInfo,
                      last_name: e.target.value
                    }
                  }));
                }}
              />
            </div>

            <input
              type='text'
              placeholder='Email'
              className={styles.input}
              value={this.props.email}
            />

            <input
              type='text'
              placeholder='Phone Number'
              className={styles.input}
              value={this.state.deliveryInfo.phone}
              onChange={e => {
                this.setState(prevState => ({
                  deliveryInfo: {
                    ...prevState.deliveryInfo,
                    phone: e.target.value
                  }
                }));
              }}
            />


            {/*<input
              type='text'
              placeholder={"Address 1"}
              className={styles.input}
              id="pac-input"
            />*/}
            <input
              type='text'
              placeholder={"Address 1"}
              className={styles.input}
              value={this.state.deliveryInfo.address}
              onChange={e => {
                this.setState(prevState => ({
                  deliveryInfo: {
                    ...prevState.deliveryInfo,
                    address: e.target.value
                  }
                }));
              }}
            />

            <div style={{display: 'flex'}}>
              <input
                type='text'
                placeholder={"Unit"}
                className={styles.inputContactLeft}
                value={this.state.deliveryInfo.unit}
                onChange={e => {
                  this.setState(prevState => ({
                    deliveryInfo: {
                      ...prevState.deliveryInfo,
                      unit: e.target.value
                    }
                  }));
                }}
              />

              <input
                type='text'
                placeholder={"City"}
                className={styles.inputContactRight}
                value={this.state.deliveryInfo.city}
                onChange={e => {
                  this.setState(prevState => ({
                    deliveryInfo: {
                      ...prevState.deliveryInfo,
                      city: e.target.value
                    }
                  }));
                }}
              />
            </div>

            <div style={{display: 'flex'}}>
              <input
                type='text'
                placeholder={"State"}
                className={styles.inputContactLeft}
                value={this.state.deliveryInfo.state}
                onChange={e => {
                  this.setState(prevState => ({
                    deliveryInfo: {
                      ...prevState.deliveryInfo,
                      state: e.target.value
                    }
                  }));
                }}
              />
              <input
                type='text'
                placeholder={"Zip Code"}
                className={styles.inputContactRight}
                value={this.state.deliveryInfo.zip}
                onChange={e => {
                  this.setState(prevState => ({
                    deliveryInfo: {
                      ...prevState.deliveryInfo,
                      zip: e.target.value
                    }
                  }));
                }}
              />
            </div>

            <input
              type={'text'}
              placeholder={'Delivery Instructions'}
              className={styles.input}
              value={this.state.deliveryInfo.instructions}
              onChange={e => {
                this.setState(prevState => ({
                  deliveryInfo: {
                    ...prevState.deliveryInfo,
                    instructions: e.target.value
                  }
                }));
              }}
            />

            <div className = {styles.googleMap} id = "map"/>     

            <div style={{textAlign: 'center'}}>
              <button 
                className={styles.orangeBtn}
                disabled={!this.state.subscriptionsLoaded}
                onClick={()=>this.saveEdits()}
              >
                    Save
              </button>
            </div>

          </div>
        <div
              style={{
                visibility: 'visible',
                // marginLeft:'100px',
                width:'40%',
                marginRight: '8%',
                marginLeft: '2%'
              }}
            > 
              <div style={{display: 'flex', borderBottom:'solid 2px black'}}>

                <div className={styles.summaryLeft} style={{fontWeight:'bold'}}></div>

                <div className={styles.summaryRight}>
                  {this.state.updatedPlan.meals} Meals,{" "}
                  {this.state.updatedPlan.deliveries} Deliveries
                </div>

                <div className={styles.summaryRight}>
                  Current
                </div>

                <div className={styles.summaryRight}>
                  Difference
                </div>

              </div>
              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>

                  <div className={styles.summaryLeft}>
                    Meal Subscription 
                  </div>

                  <div className={styles.summaryRight}>
                    ${this.state.updatedSummary.mealSubPrice}
                  </div>

                  <div className={styles.summaryRight}>
                    ${this.state.currentSummary.mealSubPrice}
                  </div>

                  <div className={styles.summaryRight}>
                    ${this.state.diffSummary.mealSubPrice}
                  </div>

              </div>

              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>

                  <div className={styles.summaryLeft}>
                  Discount
                  </div>

                  <div className={styles.summaryRight}>
                    -${this.state.updatedSummary.discountAmount}
                  </div>

                  <div className={styles.summaryRight}>
                    -${this.state.currentSummary.discountAmount}
                  </div>

                  <div className={styles.summaryRight}>
                    -${this.state.diffSummary.discountAmount}
                  </div>

              </div>

              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>

                  <div className={styles.summaryLeft}>
                    Delivery Fee
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.updatedSummary.deliveryFee)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.currentSummary.deliveryFee)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.diffSummary.deliveryFee)}
                  </div>

              </div>

              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>

                  <div className={styles.summaryLeft}>
                    Service Fee
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.updatedSummary.serviceFee)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.currentSummary.serviceFee)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.diffSummary.serviceFee)}
                  </div>

              </div>

              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>

                  <div className={styles.summaryLeft}>
                    Taxes
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.updatedSummary.taxAmount)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.currentSummary.taxAmount)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.diffSummary.taxAmount)}
                  </div>

              </div>

              <div 
                style={{display: 'flex'}}>

                  <div className={styles.summaryLeft}>
                    Chef and Driver Tip
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.updatedSummary.tip)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.currentSummary.tip)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.diffSummary.tip)}
                  </div>

              </div>
              <div 
                style={{display: 'flex'}}>
                  {(() => {
                      if (this.state.paymentSummary.tip === "0.00") {
                        return (
                          <button className={styles.tipButtonSelected} onClick={() => this.changeTip("0.00")}>
                            No Tip
                          </button>
                        );
                      } else {
                        return (
                          <button className={styles.tipButton} onClick={() => this.changeTip("0.00")}>
                            No Tip
                          </button>
                        );
                      }
                    })()}
                    {(() => {
                      if (this.state.updatedSummary.tip === "2.00") {
                        return (
                          <button className={styles.tipButtonSelected} onClick={() => this.changeTip("2.00")}>
                            $2
                          </button>
                        );
                      } else {
                        return (
                          <button className={styles.tipButton} onClick={() => this.changeTip("2.00")}>
                            $2
                          </button>
                        );
                      }
                    })()} 
                    {(() => {
                      if (this.state.updatedSummary.tip === "3.00") {
                        return (
                          <button className={styles.tipButtonSelected} onClick={() => this.changeTip("3.00")}>
                            $3
                          </button>
                        );
                      } else {
                        return (
                          <button className={styles.tipButton} onClick={() => this.changeTip("3.00")}>
                            $3
                          </button>
                        );
                      }
                    })()} 
                    {(() => {
                      if (this.state.updatedSummary.tip === "5.00") {
                        return (
                          <button className={styles.tipButtonSelected} onClick={() => this.changeTip("5.00")}>
                            $5
                          </button>
                        );
                      } else {
                        return (
                          <button className={styles.tipButton} onClick={() => this.changeTip("5.00")}>
                            $5
                          </button>
                        );
                      }
                    })()}
              </div>

              <div style={{display: 'flex',borderBottom:'1px solid'}}>
                <input
                    type='text'
                    placeholder='Enter Ambassador Code'
                    className={styles.inputAmbassador}
                    onChange={e => {
                      this.setState({
                        ambassadorCode: e.target.value
                      });
                    }}
                  />
                  <button 
                    className={styles.codeButton}
                    onClick={() => this.applyAmbassadorCode()}
                  >
                    Verify
                  </button>
              </div>

              <div 
                style={{display: 'flex' ,marginBottom:'73px'}}>
                  <div className={styles.summaryLeft}>
                    Total
                  </div>

                  <div className={styles.summaryRight}>
                    ${this.state.updatedSummary.total}
                  </div>

                  <div className={styles.summaryRight}>
                    ${this.state.currentSummary.total}
                  </div>

                  <div className={styles.summaryRight}>
                    ${this.state.diffSummary.total}
                  </div>
              </div>

                
          {/*<button 
          style={{
            backgroundColor: '#ff6505',
            width:'80%',
            height:'60px',
            marginBottom: '50px'
            // marginTop: '36px',
            // marginLeft: '60px',
          }}
          >*/}
          <button 
            className={styles.orangeBtn}
            disabled={!this.state.subscriptionsLoaded}
            onClick={() => this.changePurchase()}
          >
            Complete Payment
          </button>
                
              <div style={{display: 'flex'}}>
                <div style = {{display: 'inline-block', width: '80%', height: '0px'}}>

                  <div className = {styles.buttonContainer}>
                      {/*<StripeElement
                        stripePromise={this.state.stripePromise}
                        customerPassword={this.state.customerPassword}
                        deliveryInstructions={this.state.instructions}
                        setPaymentType={this.setPaymentType}
                        paymentSummary={this.state.paymentSummary}
                        loggedInByPassword={loggedInByPassword}
                        latitude={this.state.latitude.toString()}
                        longitude={this.state.longitude.toString()}
                        email={this.state.email}
                        customerUid={this.state.customerUid}
                        phone={this.state.phone}
                        cardInfo={this.state.cardInfo}
                      />*/}
                  </div>

                </div>
              </div>
            </div>
          </div>
        <FootLink/>
      </>
    );
  }
}

EditPlan.propTypes = {
  fetchPlans: PropTypes.func.isRequired,
  fetchSubscribed: PropTypes.func.isRequired,
  chooseMealsDelivery: PropTypes.func.isRequired,
  choosePaymentOption: PropTypes.func.isRequired,
  //numItems: PropTypes.array.isRequired,
  //paymentFrequency: PropTypes.array.isRequired,
  meals: PropTypes.string.isRequired,
  paymentOption: PropTypes.string.isRequired,
  selectedPlan: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  plans: state.subscribe.plans,
  subscribedPlans: state.subscribe.subscribedPlans,
  // numItems: state.subscribe.numItems,
  // paymentFrequency: state.subscribe.paymentFrequency,
  meals: state.subscribe.meals,
  paymentOption: state.subscribe.paymentOption,
  selectedPlan: state.subscribe.selectedPlan,
  customerId: state.subscribe.profile.customerId,
  // socialMedia: state.subscribe.profile.socialMedia,
  email: state.subscribe.profile.email,
  // firstName: state.subscribe.addressInfo.firstName,
  // lastName: state.subscribe.addressInfo.lastName,
  // street: state.subscribe.address.street,
  // unit: state.subscribe.address.unit,
  // city: state.subscribe.address.city,
  // state: state.subscribe.address.state,
  // zip: state.subscribe.address.zip,
  // cc_num: state.subscribe.creditCard.number,
  // cc_cvv: state.subscribe.creditCard.cvv,
  // cc_zip: state.subscribe.creditCard.zip,
  // cc_month: state.subscribe.creditCard.month,
  // cc_year: state.subscribe.creditCard.year,
  // phone: state.subscribe.addressInfo.phoneNumber,
  // instructions: state.subscribe.deliveryInstructions,
  // password: state.subscribe.paymentPassword,
  // address: state.subscribe.address
});

export default connect(mapStateToProps, {
  fetchPlans,
  fetchSubscribed,
  chooseMealsDelivery,
  choosePaymentOption,
  fetchProfileInformation,
  changeAddressFirstName,
  changeAddressLastName,
  changeAddressStreet,
  changeAddressUnit,
  changeAddressCity,
  changeAddressState,
  changeAddressZip,
  changeAddressPhone,
  changeDeliveryInstructions,
  changePaymentPassword,
  changeCardNumber,
  changeCardCvv,
  changeCardMonth,
  changeCardYear,
  changeCardZip,
  submitPayment
})(withRouter(EditPlan));
