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

const DEFAULT = true;
const CURRENT= false;

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
      refreshingPrice: false,
      ambassadorCode: "",
      validCode: null,
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
        cc_num: "NULL",
        cc_cvv: "NULL",
        cc_zip: "NULL",
        cc_exp_date: "NULL",
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
      differenceSummary: {
        base_amount: "0.00",
        taxes: "0.00",
        delivery_fee: "0.00",
        service_fee: "0.00",
        driver_tip: "0.00",
        discount_amount: "0.00",
        discount_rate: 0,
        ambassador_discount: "0.00",
        subtotal: "0.00",
        total: "0.00"
      },
      subscriptionsList: [],
      subscriptionsLoaded: false,
      currentPlan: {
        id: null,
        active_subscription: {},
        payment_summary: {
          base_amount: "0.00",
          taxes: "0.00",
          delivery_fee: "0.00",
          service_fee: "0.00",
          driver_tip: "2.00",
          discount_amount: "0.00",
          discount_rate: 0,
          ambassador_discount: "0.00",
          subtotal: "0.00",
          total: "0.00"
        },
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
        payment_summary: {
          base_amount: "0.00",
          taxes: "0.00",
          delivery_fee: "0.00",
          service_fee: "0.00",
          driver_tip: "2.00",
          discount_amount: "0.00",
          discount_rate: 0,
          ambassador_discount: "0.00",
          subtotal: "0.00",
          total: "0.00"
        },
        meals: null,
        deliveries: null,
        order_history: null,
        load_order: null,
        discount: null,
        next_billing_date: null
      },
      discounts: [],
      usePreviousCard: true,
      defaultSet: false,
      showErrorModal: false,
      errorModal: null,
      errorMessage: '',
      errorLink: '',
      errorLinkText: ''
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

  displayErrorModal = (message, linkText, link) => {
    if(this.state.showErrorModal === false) {
      this.setState({
        errorModal: styles.errorModalPopUpShow,
        showErrorModal: true,
        errorMessage: message,
        errorLinkText: linkText,
        errorLink: link
      });
      console.log("\nerror pop up toggled to true");
    }else{
      this.setState({
        errorModal: styles.errorModalPopUpHide,
        showErrorModal: false,
        errorMessage: message,
        errorLinkText: linkText,
        errorLink: link
      });
      console.log("\nerror pop up toggled to false");
    }
  }

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

  calculateNextBillingAmount = (orders) => {
    console.log("(CNBA) orders: ", orders);

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

  applyAmbassadorCode() {

    this.setState({
      refreshingPrice: true,
    }, () => {

      console.log("bleh");
      
    axios
      .post(API_URL + 'brandAmbassador/generate_coupon',
        {
          amb_email: this.state.ambassadorCode,
          cust_email: this.props.email
        }
      )
      .then(res => {
        let items = res.data
        console.log("ambassador code response: " + JSON.stringify(res));

        if(this.state.validCode === true) {

          this.displayErrorModal('You have already entered a valid ambassador code.', 'Go Back', 'back');

          this.setState({
            refreshingPrice: false
          });

        } else if(typeof(items) === "string") {

          console.log("Invalid code");

          this.setState({
            validCode: false,
            refreshingPrice: false
          });

          this.displayErrorModal(items, 'Go Back', 'back');


        } else {

          console.log("Valid code");
          items = items.result[0];
          console.log("result: " + JSON.stringify(items));

          this.setState(prevState => ({
            validCode: true,

            // paymentSummary: {
            //   ...prevState.paymentSummary,
            //   ambassadorDiscount: (
            //     items.discount_amount +
            //     items.discount_shipping
            //   ).toFixed(2)
            // }

            updatedPlan: {
              ...prevState.updatedPlan,
              payment_summary: {
                ...prevState.updatedPlan.payment_summary,
                ambassador_discount: (
                  items.discount_amount +
                  items.discount_shipping
                ).toFixed(2)
              }
            }

          }), () => {

            this.calculateDifference();

          });
        }
      })
      .catch(err => {
        console.log("Ambassador code error: " + err);
      });

    });
  }

  calculateDifference = () => {
    this.setState(prevState => ({
      differenceSummary: {
        base_amount: (
          parseFloat(this.state.updatedPlan.payment_summary.base_amount) -
          parseFloat(this.state.currentPlan.payment_summary.base_amount)
        ).toFixed(2),
        taxes: (
          parseFloat(this.state.updatedPlan.payment_summary.taxes) -
          parseFloat(this.state.currentPlan.payment_summary.taxes)
        ).toFixed(2),
        delivery_fee: (
          parseFloat(this.state.updatedPlan.payment_summary.delivery_fee) -
          parseFloat(this.state.currentPlan.payment_summary.delivery_fee)
        ).toFixed(2),
        service_fee: (
          parseFloat(this.state.updatedPlan.payment_summary.service_fee) -
          parseFloat(this.state.currentPlan.payment_summary.service_fee)
        ).toFixed(2),
        driver_tip: (
          parseFloat(this.state.updatedPlan.payment_summary.driver_tip) -
          parseFloat(this.state.currentPlan.payment_summary.driver_tip)
        ).toFixed(2),
        discount_amount: (
          parseFloat(this.state.updatedPlan.payment_summary.discount_amount) -
          parseFloat(this.state.currentPlan.payment_summary.discount_amount)
        ).toFixed(2),
        discount_rate: (
          this.state.updatedPlan.payment_summary.discount_rate -
          this.state.currentPlan.payment_summary.discount_rate
        ),
        ambassador_discount: (
          parseFloat(this.state.updatedPlan.payment_summary.ambassador_discount) -
          parseFloat(this.state.currentPlan.payment_summary.ambassador_discount)
        ).toFixed(2),
        subtotal: (
          parseFloat(this.state.updatedPlan.payment_summary.subtotal) -
          parseFloat(this.state.currentPlan.payment_summary.subtotal)
        ).toFixed(2),
        total: (
          parseFloat(this.state.updatedPlan.payment_summary.total) -
          parseFloat(this.state.currentPlan.payment_summary.total)
        ).toFixed(2),
      },
      refreshingPrice: false
    }));
  }

  changePlans = (meals, deliveries) => {
    console.log(" ");
    console.log("======| changePlans |======");
    console.log("meals: ", meals);
    console.log("deliveries: ", deliveries);

    let mealPlan = this.props.plans[meals][deliveries];

    console.log("meal plan: ", mealPlan);
    console.log("(old) updated plan: ", this.state.updatedPlan);

    console.log("(1) updated plan: ", this.state.updatedPlan);
    console.log("(1) current plan: ", this.state.currentPlan);
    console.log(" ");

    let newBaseAmount = mealPlan.item_price * mealPlan.num_deliveries;

    console.log("newBaseAmount: ", newBaseAmount);

    let newUpdatedPlan = {...this.state.updatedPlan};

    newUpdatedPlan.meals = meals;
    newUpdatedPlan.deliveries = deliveries;
    newUpdatedPlan.payment_summary.base_amount = newBaseAmount.toFixed(2);
    
    newUpdatedPlan.payment_summary.discount_rate = mealPlan.delivery_discount;
    newUpdatedPlan.payment_summary.total = (
      (
        parseFloat(newUpdatedPlan.payment_summary.base_amount) +
        parseFloat(newUpdatedPlan.payment_summary.taxes) + 
        parseFloat(newUpdatedPlan.payment_summary.service_fee) +
        parseFloat(newUpdatedPlan.payment_summary.delivery_fee) +
        parseFloat(newUpdatedPlan.payment_summary.driver_tip) +
        parseFloat(newUpdatedPlan.payment_summary.ambassador_discount)
      ) - (
        parseFloat(newUpdatedPlan.payment_summary.base_amount)*mealPlan.delivery_discount*0.01
      )
    ).toFixed(2);
    console.log("DISCOUNT BEFORE: ", newUpdatedPlan.payment_summary.discount_amount);
    newUpdatedPlan.payment_summary.discount_amount = (
      parseFloat(newUpdatedPlan.payment_summary.base_amount)*mealPlan.delivery_discount*0.01
    ).toFixed(2);
    console.log("DISCOUNT AFTER: ", newUpdatedPlan.payment_summary.discount_amount);

    console.log("new payment summary: ", newUpdatedPlan.payment_summary);

    console.log("(new) updated plan: ", newUpdatedPlan);
    console.log("current plan: ", this.state.currentPlan);
    console.log(" ");

    console.log("(2) updated plan: ", this.state.updatedPlan);
    console.log("(2) current plan: ", this.state.currentPlan);
    console.log(" ");

    this.setState(prevState => ({
      updatedPlan: newUpdatedPlan,
    }), () => {
      console.log(" ");
      console.log("(3) updated plan: ", this.state.updatedPlan);
      console.log("(3) current plan: ", this.state.currentPlan);
      console.log(" ");
      this.calculateDifference();
    });
  }

  loadSubscriptions = (subscriptions, discounts, setDefault) => {

    console.log("(LS) subscriptions: ", subscriptions);

    if(subscriptions.length === 0){
      console.log("NO SUBSCRIPTIONS");

      this.displayErrorModal(`
        You cannot edit any meal plans as you are not currently subscribed to any. 
      `, 
        'Choose a Plan', '/choose-plan'
      );

      return null;
    }

    let newSubList = [];
    let defaultCurrentPlan = {};
    let defaultUpdatedPlan = {};
    let defaultDeliveryInfo = {
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
    }

    subscriptions.forEach((sub, index) => {

      let subscription = {};

      let parsedItems = JSON.parse(sub.items)[0];
      let parsedMeals = parsedItems.name.substring(0,parsedItems.name.indexOf(" "));
      let parsedDeliveries = parsedItems.qty;

      let discountItem = discounts.filter( function(e) {
        return e.deliveries === parsedDeliveries;
      });

      let parsedDiscount = discountItem[0].discount;
      let parsedId = sub.purchase_id.substring(sub.purchase_id.indexOf("-")+1,sub.purchase_id.length)
      let parsedDeliveryDate = sub.sel_menu_date.substring(0,sub.sel_menu_date.indexOf(" "));
      let parsedSelection = JSON.parse(sub.meal_selection)[0].name;
      let parsedStatus = null;
      
      if(parsedSelection !== 'SURPRISE' && parsedSelection !== 'SKIP'){
        parsedStatus = 'SELECTED';
      } else {
        parsedStatus = parsedSelection;
      }

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

      let payment_summary = {
        base_amount: sub.base_amount.toFixed(2),
        taxes: sub.taxes.toFixed(2),
        delivery_fee: sub.delivery_fee.toFixed(2),
        service_fee: sub.service_fee.toFixed(2),
        driver_tip: sub.driver_tip.toFixed(2),
        discount_amount: (
          sub.base_amount *
          parsedDiscount *
          0.01
        ).toFixed(2),
        discount_rate: parsedDiscount,
        ambassador_discount: "0.00",
        subtotal: "0.00",
        total: nextBillingAmount.toFixed(2)
      }

      subscription["load_order"] = index;
      subscription["id"] = parsedId;
      subscription["meals"] = parsedMeals;
      subscription["deliveries"] = parsedDeliveries;
      subscription["discount"] = parsedDiscount;
      subscription["next_delivery_date"] = parsedDeliveryDate;
      subscription["next_delivery_status"] = parsedStatus;
      subscription["next_billing_date"] = parsedBillingDate;
      subscription["next_billing_amount"] = nextBillingAmount.toFixed(2);
      subscription["payment_summary"] = {...payment_summary};
      subscription["raw_data"] = sub;

      if(index === 0){

        defaultCurrentPlan["load_order"] = index;
        defaultCurrentPlan["id"] = parsedId;
        defaultCurrentPlan["meals"] = parsedMeals;
        defaultCurrentPlan["deliveries"] = parsedDeliveries;
        defaultCurrentPlan["discount"] = parsedDiscount;
        defaultCurrentPlan["next_delivery_date"] = parsedDeliveryDate;
        defaultCurrentPlan["next_delivery_status"] = parsedStatus;
        defaultCurrentPlan["next_billing_date"] = parsedBillingDate;
        defaultCurrentPlan["next_billing_amount"] = nextBillingAmount.toFixed(2);
        defaultCurrentPlan["payment_summary"] = {...payment_summary};
        defaultCurrentPlan["raw_data"] = sub;

        defaultUpdatedPlan["load_order"] = index;
        defaultUpdatedPlan["id"] = parsedId;
        defaultUpdatedPlan["meals"] = parsedMeals;
        defaultUpdatedPlan["deliveries"] = parsedDeliveries;
        defaultUpdatedPlan["discount"] = parsedDiscount;
        defaultUpdatedPlan["next_delivery_date"] = parsedDeliveryDate;
        defaultUpdatedPlan["next_delivery_status"] = parsedStatus;
        defaultUpdatedPlan["next_billing_date"] = parsedBillingDate;
        defaultUpdatedPlan["next_billing_amount"] = nextBillingAmount.toFixed(2);
        defaultUpdatedPlan["payment_summary"] = {...payment_summary};
        defaultUpdatedPlan["raw_data"] = sub;

        defaultDeliveryInfo = this.setDeliveryInfo(sub);

      }

      newSubList.push(subscription);

      console.log(" ");
      
    });

    newSubList.sort(function(a,b) {
      return a.load_order - b.load_order
    });

    if(setDefault === true) {
      this.setState(prevState => ({
        subscriptionsList: newSubList,
        subscriptionsLoaded: true,
        currentPlan: {...defaultCurrentPlan},
        updatedPlan: {...defaultUpdatedPlan},
        deliveryInfo: {...defaultDeliveryInfo}
      }), () => {
        this.calculateDifference();
      });
    } else {
      this.setState({
        subscriptionsList: newSubList,
        subscriptionsLoaded: true,
      });
    }

    // this.setState({
    //   subscriptionsList: newSubList,
    //   subscriptionsLoaded: true,
    //   currentPlan: {...defaultCurrentPlan},
    //   updatedPlan: {...defaultUpdatedPlan},
    //   deliveryInfo: {...defaultDeliveryInfo}
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.plans !== this.props.plans &&
      this.state.updatedPlan.meals !== null &&
      this.state.updatedPlan.deliveries !== null
    ) {
      console.log(
        "(1) plans fetched; defaulting selection to: " + 
        this.state.updatedPlan.meals + " meals, " + 
        this.state.updatedPlan.deliveries + " deliveries"
      );
      this.props.chooseMealsDelivery(
        this.state.updatedPlan.meals,
        this.state.updatedPlan.deliveries,
        this.props.plans
      );
      
      this.props.choosePaymentOption(
        this.state.updatedPlan.deliveries,
        this.state.updatedPlan.meals,
        this.props.plans
      );
      this.setState({
        defaultSet: true
      });
    } else if (
      JSON.stringify(this.props.plans) !== '{}' &&
      prevState.updatedPlan.meals === null &&
      this.state.updatedPlan.meals !== null &&
      prevState.updatedPlan.deliveries === null &&
      this.state.updatedPlan.deliveries !== null
    ) {
      console.log(
        "(2) plans fetched; defaulting selection to: " + 
        this.state.updatedPlan.meals + " meals, " + 
        this.state.updatedPlan.deliveries + " deliveries"
      );

      this.props.chooseMealsDelivery(
        this.state.updatedPlan.meals,
        this.state.updatedPlan.deliveries,
        this.props.plans
      );
      
      this.props.choosePaymentOption(
        this.state.updatedPlan.deliveries,
        this.state.updatedPlan.meals,
        this.props.plans
      );
      this.setState({
        defaultSet: true
      });
    }
  }

  discardChanges() {
    console.log("(DISCARD) currentPlan: ", this.state.currentPlan);

    let currCopy = {...this.state.currentPlan}

    // let currDeliveryInfo = {
    //   first_name: currCopy.raw_data.delivery_first_name,
    //   last_name: currCopy.raw_data.delivery_last_name,
    //   purchase_uid: currCopy.raw_data.purchase_uid,
    //   phone: currCopy.raw_data.delivery_phone_num,
    //   address: currCopy.raw_data.delivery_address,
    //   unit: currCopy.raw_data.delivery_unit,
    //   city: currCopy.raw_data.delivery_city,
    //   state: currCopy.raw_data.delivery_state,
    //   zip: currCopy.raw_data.cc_zip,
    //   cc_num: "NULL",
    //   cc_cvv: "NULL",
    //   cc_zip: "NULL",
    //   cc_exp_date: "NULL",
    //   instructions: ""
    // };

    let currDeliveryInfo = this.setDeliveryInfo(currCopy.raw_data);

    // currDeliveryInfo["first_name"] = currCopy.raw_data.delivery_first_name;
    // currDeliveryInfo["last_name"] = currCopy.raw_data.delivery_last_name;
    // currDeliveryInfo["phone"] = currCopy.raw_data.delivery_phone_num;
    // currDeliveryInfo["address"] = currCopy.raw_data.delivery_address;
    // currDeliveryInfo["unit"] = currCopy.raw_data.delivery_unit;
    // currDeliveryInfo["city"] = currCopy.raw_data.delivery_city;
    // defaultDeliveryInfo["zip"] = currCopy.raw_data.delivery_zip;
    // defaultDeliveryInfo["state"] = currCopy.raw_data.delivery_state;
    // defaultDeliveryInfo["cc_num"] = currCopy.raw_data.cc_num;
    // defaultDeliveryInfo["cc_exp_date"] = currCopy.raw_data.cc_exp_date;
    // defaultDeliveryInfo["cc_cvv"] = currCopy.raw_data.cc_cvv;
    // defaultDeliveryInfo["cc_zip"] = currCopy.raw_data.cc_zip;

    this.setState(prevState => ({
      updatedPlan: {...currCopy},
      deliveryInfo: {...currDeliveryInfo}
    }), () => {
      this.calculateDifference();
    });
  }

  confirmChanges() {
    console.log("before change_purchase: ", this.state.updatedPlan);

    let object = null;
    if(this.state.usePreviousCard){

      object = {
        cc_cvv: "",
        cc_exp_date: "",
        cc_num: "",
        cc_zip: "",
        customer_email: this.props.email,
        items: [{
          qty: this.props.selectedPlan.num_deliveries.toString(), 
          name: this.props.selectedPlan.item_name, 
          price: this.props.selectedPlan.item_price.toString(), 
          item_uid: this.props.selectedPlan.item_uid, 
          itm_business_uid: this.props.selectedPlan.itm_business_uid
        }],
        new_item_id: this.props.selectedPlan.item_uid,
        purchase_id: this.state.updatedPlan.raw_data.purchase_uid,
        start_delivery_date: ""
      }
      console.log("(old card) object for change_purchase: ", JSON.stringify(object));

    } else {

      object = {
        cc_cvv: this.state.deliveryInfo.cc_cvv,
        cc_exp_date: this.state.deliveryInfo.cc_exp_date,
        cc_num: this.state.deliveryInfo.cc_num,
        cc_zip: this.state.deliveryInfo.cc_zip,
        customer_email: this.props.email,
        items: [{
          qty: this.props.selectedPlan.num_deliveries.toString(), 
          name: this.props.selectedPlan.item_name, 
          price: this.props.selectedPlan.item_price.toString(), 
          item_uid: this.props.selectedPlan.item_uid, 
          itm_business_uid: this.props.selectedPlan.itm_business_uid
        }],
        new_item_id: this.props.selectedPlan.item_uid,
        purchase_id: this.state.updatedPlan.raw_data.purchase_id,
        start_delivery_date: ""
      }
      console.log("(new card) object for change_purchase: ", JSON.stringify(object));

    }

    axios.post(API_URL + 'change_purchase/' + this.state.updatedPlan.raw_data.purchase_id, object)
      .then(res => {
        console.log("change_purchase response: ", res);
        //this.props.history.push("/meal-plan");
        axios.get(API_URL + 'next_meal_info/' + this.state.customerUid)
          .then(res => {
            console.log("(after change) next meal info res: ", res);

            let fetchedSubscriptions = res.data.result;

            this.loadSubscriptions(fetchedSubscriptions, this.state.discounts, CURRENT);

            // fetchedSubscriptions = res.data.result;

            // if(fetchedDiscounts !== null){
            //   console.log("(4) load subscriptions");
            //   this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts);
            // }
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
        if (err.response) {
          console.log("error: " + JSON.stringify(err.response));
        }
      });
  }

  handleCheck = (cb) => {
    console.log("clicked checkbox: ", cb);
    this.setState({
      usePreviousCard: !this.state.usePreviousCard
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

            let fetchedDiscounts = null;
            let fetchedSubscriptions = null;

            fetchDiscounts((discounts) => {
              console.log("fetchDiscounts callback: ", discounts);

              fetchedDiscounts = discounts;

              this.setState({
                discounts: fetchedDiscounts
              });

              if(fetchedSubscriptions !== null){
                console.log("(1) load subscriptions");
                this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts, DEFAULT);
              }

            });

            axios.get(API_URL + 'next_meal_info/' + this.state.customerUid)
              .then(res => {
                console.log("next meal info res: ", res);

                fetchedSubscriptions = res.data.result;

                if(fetchedDiscounts !== null){
                  console.log("(2) load subscriptions");
                  this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts, DEFAULT);
                }
              })
              .catch(err => {
                console.log(err);
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
          this.setState(prevState => ({
            customerUid,
            mounted: true
          }), () => {
            this.props.fetchProfileInformation(customerUid);
            this.props.fetchPlans();

            let fetchedDiscounts = null;
            let fetchedSubscriptions = null;

            fetchDiscounts((discounts) => {
              console.log("fetchDiscounts callback: ", discounts);

              fetchedDiscounts = discounts;

              this.setState({
                discounts: fetchedDiscounts
              });

              if(fetchedSubscriptions !== null){
                console.log("(1) load subscriptions");
                this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts, DEFAULT);
              }

            });

            axios.get(API_URL + 'next_meal_info/' + this.state.customerUid)
              .then(res => {
                console.log("next meal info res: ", res);

                fetchedSubscriptions = res.data.result;

                if(fetchedDiscounts !== null){
                  console.log("(2) load subscriptions");
                  this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts, DEFAULT);
                }
              })
              .catch(err => {
                console.log(err);
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

    // Not logged in
    } else {
      // Reroute to log in page
      // console.log("edit-plan NOT LOGGED IN");
      // console.log("edit plan props.location (not logged in): ", this.props.location);
      //this.props.history.push("/choose-plan");
      this.displayErrorModal(`
        Please log in to edit your meals.
      `, 
        'Go Home', '/home'
      );
    }
  }

  deletePurchase = () => {
    axios
      .put(`${API_URL}cancel_purchase`,{
        purchase_uid: this.state.updatedPlan.raw_data.purchase_uid,
      })
      .then((response) => {
        console.log("cancel_purchase response: " + JSON.stringify(response));
        console.log("cancel_purchase customerUid: " + this.state.customerUid);
        //this.props.fetchSubscribed(this.state.customerUid);

        // let fetchedDiscounts = null;
        // let fetchedSubscriptions = null;

        // fetchDiscounts((discounts) => {
        //   console.log("fetchDiscounts callback: ", discounts);

        //   fetchedDiscounts = discounts;

        //   this.setState({
        //     discounts: fetchedDiscounts
        //   });

        //   if(fetchedSubscriptions !== null){
        //     console.log("(3) load subscriptions");
        //     this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts);
        //   }

        // });

        axios.get(API_URL + 'next_meal_info/' + this.state.customerUid)
          .then(res => {
            console.log("(after deletion) next meal info res: ", res);

            let fetchedSubscriptions = res.data.result;

            this.loadSubscriptions(fetchedSubscriptions, this.state.discounts, DEFAULT);

            // fetchedSubscriptions = res.data.result;

            // if(fetchedDiscounts !== null){
            //   console.log("(4) load subscriptions");
            //   this.loadSubscriptions(fetchedSubscriptions, fetchedDiscounts);
            // }
          })
          .catch(err => {
            console.log(err);
          });

      })
      .catch((err) => {
        if(err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  }

  setDeliveryInfo(plan) {
    let newDeliveryInfo = {
      first_name: (plan.delivery_first_name === 'NULL' ? '': plan.delivery_first_name),
      last_name: (plan.delivery_last_name === 'NULL' ? '': plan.delivery_last_name),
      purchase_uid: (plan.purchase_uid === 'NULL' ? '': plan.purchase_uid),
      phone: (plan.delivery_phone_num === 'NULL' ? '': plan.delivery_phone_num),
      address: (plan.delivery_address === 'NULL' ? '': plan.delivery_address),
      unit: (plan.delivery_unit === 'NULL' ? '': plan.delivery_unit),
      city: (plan.delivery_city === 'NULL' ? '': plan.delivery_city),
      state: (plan.delivery_state === 'NULL' ? '': plan.delivery_state),
      zip: (plan.delivery_zip === 'NULL' ? '': plan.delivery_zip),
      cc_num: "NULL",
      cc_cvv: "NULL",
      cc_zip: "NULL",
      cc_exp_date: "NULL",
      instructions: ""
    };
    return newDeliveryInfo;
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

            let newCurrentPlan = {
              deliveries: sub.deliveries,
              discount: sub.discount,
              id: sub.id,
              load_order: sub.load_order,
              meals: sub.meals,
              next_billing_amount: sub.next_billing_amount,
              next_billing_date: sub.next_billing_date,
              next_delivery_date: sub.next_delivery_date,
              next_delivery_status: sub.next_delivery_status,
              payment_summary: {...sub.payment_summary},
              raw_data: {...sub.raw_data}
            };

            let newUpdatedPlan = {
              deliveries: sub.deliveries,
              discount: sub.discount,
              id: sub.id,
              load_order: sub.load_order,
              meals: sub.meals,
              next_billing_amount: sub.next_billing_amount,
              next_billing_date: sub.next_billing_date,
              next_delivery_date: sub.next_delivery_date,
              next_delivery_status: sub.next_delivery_status,
              payment_summary: {...sub.payment_summary},
              raw_data: {...sub.raw_data}
            };

            console.log("(1) before new plan selected");
            console.log("props.plans: ", this.props.plans);
            console.log("new plan selected: ", this.props.plans[sub.meals][sub.deliveries]);

            console.log("BEFORE SET newDeliveryInfo");
            let newDeliveryInfo = this.setDeliveryInfo(newCurrentPlan.raw_data);

            this.setState(prevState => ({
              currentPlan: {...newCurrentPlan},
              updatedPlan: {...newUpdatedPlan},
              deliveryInfo: {...newDeliveryInfo}
            }), () => {
              this.calculateDifference();
            });

          }}
        >
          <div className={styles.mealButtonEdit}>
            
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

  showCardForm = () => {
    return (
      <>
        <div style={{borderTop: '1px solid'}}>

          <div className={styles.cardLabel}>
            Enter New Credit Card Details:
          </div>

          <div className={styles.cardDiv}>
            <input
              type='text'
              maxLength='16'
              placeholder='Card Number'
              className={styles.inputCard}
              value={this.state.deliveryInfo.cc_num}
              onChange={e => {
                this.setState(prevState => ({
                  deliveryInfo: {
                    ...prevState.deliveryInfo,
                    cc_num: e.target.value
                  }
                }));
              }}
            />
            <input
              type='text'
              maxLength='5'
              placeholder='MM/YY'
              className={styles.inputCardDate}
              value={this.state.deliveryInfo.cc_exp_date}
              onChange={e => {
                this.setState(prevState => ({
                  deliveryInfo: {
                    ...prevState.deliveryInfo,
                    cc_exp_date: e.target.value
                  }
                }));
              }}
            />
            <input
              type='text'
              maxLength='3'
              placeholder='CVV'
              className={styles.inputCardCvv}
              value={this.state.deliveryInfo.cc_cvv}
              onChange={e => {
                this.setState(prevState => ({
                  deliveryInfo: {
                    ...prevState.deliveryInfo,
                    cc_cvv: e.target.value
                  }
                }));
              }}
            />
            <input
              type='text'
              maxLength='5'
              placeholder='ZIP'
              className={styles.inputCardZip}
              value={this.state.deliveryInfo.cc_zip}
              onChange={e => {
                this.setState(prevState => ({
                  deliveryInfo: {
                    ...prevState.deliveryInfo,
                    cc_zip: e.target.value
                  }
                }));
              }}
            />
          </div>
        </div>
      </>
    );
  }

  showPlanDetails = () => {
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
              this.deletePurchase();
            }}
          />
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
          if(JSON.stringify(this.props.plans) !== "{}"){
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
          if(JSON.stringify(this.props.plans) !== "{}"){
            return(
              <div className='row' style={{marginTop: '20px'}}>
                {this.paymentFrequency()}
              </div>
            );
          }
        })()}
      </div>

      <div className={styles.chargeContainer}>
        <div className={styles.chargeTotal}>
          <div style={{display: 'inline-flex'}}>
            {(() => {
              let chargeOrRefund = this.state.differenceSummary.total;
              if (parseFloat(chargeOrRefund) >= 0) {
                return (
                  <>
                    <div className={styles.chargeText}>
                      {"Additional Charges "}
                    </div>
                    <div className={styles.chargeAmount}>
                      ${this.state.differenceSummary.total}
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
                      ${(-1*this.state.differenceSummary.total).toFixed(2)}
                    </div>
                  </>
                );
              }
            })()}
          </div>
        </div> 
      </div> 
    </div>
    </>
    );
  }

  saveEdits = () => {
    console.log("saving edits...");
    
    let object = {...this.state.deliveryInfo};

    // deleting since field does not currently exist in endpoint
    delete object['instructions'];

    object['email'] = this.props.email;

    console.log("edits to save: ", JSON.stringify(object));

    axios
      .post(API_URL + 'update_delivery_info', object)
      .then((res) => {
        console.log("update delivery info res: ", res);

        axios.get(API_URL + 'next_meal_info/' + this.state.customerUid)
          .then(res => {
            console.log("(after change) next meal info res: ", res);

            let fetchedSubscriptions = res.data.result;

            this.loadSubscriptions(fetchedSubscriptions, this.state.discounts, CURRENT);
          })
          .catch(err => {
            console.log(err);
          });

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

    this.setState(prevState => ({
      updatedPlan: {
        ...prevState.updatedPlan,
        payment_summary: {
          ...prevState.updatedPlan.payment_summary,
          driver_tip: newTip
        }
      }
    }),() => {
      this.changePlans(this.state.updatedPlan.meals,this.state.updatedPlan.deliveries);
      this.calculateDifference();
    });

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

            this.props.chooseMealsDelivery(
              mealIndex,
              this.state.updatedPlan.deliveries,
              this.props.plans
            );

            this.changePlans(mealIndex, this.state.updatedPlan.deliveries);
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

  paymentFrequency = () => {
    let deselectedPaymentOption = styles.deliveryButton;
    let selectedPaymentOption = styles.deliveryButton + " " + styles.deliveryButtonSelected;
    let paymentOptionButtons = [];
      
    var deliveryPlans = this.props.plans[2];
    var discount = null;

    for (const [deliveryIndex, deliveryData] of Object.entries(deliveryPlans)) {

      let discountItem = this.state.discounts.filter( function(e) {
        return e.deliveries === deliveryIndex;
      });

      discount = discountItem[0].discount;

      paymentOptionButtons.push(
        <div className={styles.sameLine} key={deliveryIndex}>
          <div style={{display: 'inline-block'}}>
            <button
              className={
                this.state.updatedPlan.deliveries === deliveryIndex
                  ? selectedPaymentOption
                  : deselectedPaymentOption
              }
              onClick={() => {
                this.props.choosePaymentOption(
                  deliveryIndex,
                  this.state.updatedPlan.meals,
                  this.props.plans
                )

                this.changePlans(this.state.updatedPlan.meals, deliveryIndex);
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
          </div> 
        </div>
      );
    }
    return paymentOptionButtons;
  };

  render() {
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
              {this.state.subscriptionsLoaded === true
                ? this.showSubscribedMeals() 
                : this.hideSubscribedMeals()}
            </div>
          </div>

        </div>

        <div className={styles.sectionHeaderUL}>
          Edit Plan
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

            {/* <input
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
            /> */}

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
                    ${this.state.updatedPlan.payment_summary.base_amount}
                  </div>

                  <div className={styles.summaryRight}>
                    ${this.state.currentPlan.payment_summary.base_amount}
                  </div>

                  <div className={styles.summaryRight}>
                    ${Math.abs(this.state.differenceSummary.base_amount).toFixed(2)}
                  </div>

              </div>

              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>

                  <div className={styles.summaryLeft}>
                  Discount
                  </div>

                  <div className={styles.summaryRight}>
                    {"-$" + this.state.updatedPlan.payment_summary.discount_amount}
                    <br />
                    {"(" + this.state.updatedPlan.payment_summary.discount_rate + "%)"}
                  </div>

                  <div className={styles.summaryRight}>
                    {"-$" + this.state.currentPlan.payment_summary.discount_amount}
                    <br />
                    {"(" + this.state.currentPlan.payment_summary.discount_rate + "%)"}
                  </div>

                  <div className={styles.summaryRight}>
                    {"$" + Math.abs(this.state.differenceSummary.discount_amount).toFixed(2)}
                    <br />
                    {"(" + Math.abs(this.state.differenceSummary.discount_rate) + "%)"}
                  </div>

              </div>

              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>

                  <div className={styles.summaryLeft}>
                    Delivery Fee
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.updatedPlan.payment_summary.delivery_fee)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.currentPlan.payment_summary.delivery_fee)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${Math.abs(this.state.differenceSummary.delivery_fee).toFixed(2)}
                  </div>

              </div>

              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>

                  <div className={styles.summaryLeft}>
                    Service Fee
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.updatedPlan.payment_summary.service_fee)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.currentPlan.payment_summary.service_fee)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${Math.abs(this.state.differenceSummary.service_fee).toFixed(2)}
                  </div>

              </div>

              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>

                  <div className={styles.summaryLeft}>
                    Taxes
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.updatedPlan.payment_summary.taxes)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.currentPlan.payment_summary.taxes)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${Math.abs(this.state.differenceSummary.taxes).toFixed(2)}
                  </div>

              </div>

              <div 
                style={{display: 'flex'}}>

                  <div className={styles.summaryLeft}>
                    Chef and Driver Tip
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.updatedPlan.payment_summary.driver_tip)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.currentPlan.payment_summary.driver_tip)}
                  </div>

                  <div className={styles.summaryRight}>
                    ${Math.abs(this.state.differenceSummary.driver_tip).toFixed(2)}
                  </div>

              </div>
              <div 
                style={{display: 'flex'}}>
                  {(() => {
                      if (this.state.updatedPlan.payment_summary.driver_tip === "0.00") {
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
                      if (this.state.updatedPlan.payment_summary.driver_tip === "2.00") {
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
                      if (this.state.updatedPlan.payment_summary.driver_tip === "3.00") {
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
                      if (this.state.updatedPlan.payment_summary.driver_tip === "5.00") {
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

              {/* <div style={{display: 'flex',borderBottom:'1px solid'}}> */}
              <div style={{display: 'flex', borderBottom:'1px solid'}}>
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
                <div className={styles.summarySubLeft}>
                  -${this.state.updatedPlan.payment_summary.ambassador_discount}
                </div>

                <div className={styles.summarySubtotal}>
                  -${this.state.currentPlan.payment_summary.ambassador_discount}
                </div>

                <div className={styles.summarySubtotal}>
                  ${this.state.differenceSummary.ambassador_discount}
                </div>
              </div>

              <div 
                style={{display: 'flex' ,marginBottom:'50px'}}>
                  <div className={styles.summaryLeft}>
                    Total
                  </div>

                  <div className={styles.summaryRight}>
                    ${this.state.updatedPlan.payment_summary.total}
                  </div>

                  <div className={styles.summaryRight}>
                    ${this.state.currentPlan.payment_summary.total}
                  </div>

                  <div className={styles.summaryRight}>
                    ${this.state.differenceSummary.total}
                  </div>
              </div>

          {/* <div className={styles.checkboxContainer}>
            <label className={styles.checkboxLabel}>
              Use Previous Credit Card
            </label>
            <input
              className={styles.checkbox}
              type="checkbox"
              checked={this.state.usePreviousCard}
              onChange={this.handleCheck}
            />
          </div> */}

          {/* { this.state.usePreviousCard ? null : this.showCardForm()} */}


          <button 
            className={styles.orangeBtn2}
            disabled={
              (!this.state.subscriptionsLoaded && 
              this.state.defaultSet === false) ||
              this.state.refreshingPrice === true
            }
            onClick={() => this.confirmChanges()}
          >
            Complete Payment
          </button>

          <button 
            className={styles.orangeBtn3}
            disabled={
              (!this.state.subscriptionsLoaded && 
              this.state.defaultSet === false) ||
              this.state.refreshingPrice === true
            }
            onClick={() => this.discardChanges()}
          >
            Keep Existing Meal Plan
          </button>

                
              <div style={{display: 'flex'}}>
                <div style = {{display: 'inline-block', width: '80%', height: '0px'}}>

                  <div className = {styles.buttonContainer}>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {(() => {
            if (this.state.showErrorModal === true) {
              return (
                <>
                  <div className = {this.state.errorModal}>
                    <div className  = {styles.errorModalContainer}>

                      <div className={styles.errorContainer}>
                        <div className={styles.errorHeader}>
                          Hmm...
                        </div>

                        <div className={styles.errorText}>
                          {this.state.errorMessage}
                        </div>

                        <br />

                        <button 
                          className={styles.chargeBtn}
                          onClick = {() => {
                            if(this.state.errorLink === 'back'){
                              this.displayErrorModal();
                            } else {
                              this.props.history.push(this.state.errorLink);
                            }
                            
                          }}
                        >
                          {this.state.errorLinkText}
                        </button>
                        
                      </div> 
                    </div>
                  </div>
                </>
              );
            }
          })()} 

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
  meals: PropTypes.string.isRequired,
  paymentOption: PropTypes.string.isRequired,
  selectedPlan: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  plans: state.subscribe.plans,
  subscribedPlans: state.subscribe.subscribedPlans,
  meals: state.subscribe.meals,
  paymentOption: state.subscribe.paymentOption,
  selectedPlan: state.subscribe.selectedPlan,
  customerId: state.subscribe.profile.customerId,
  email: state.subscribe.profile.email,
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
