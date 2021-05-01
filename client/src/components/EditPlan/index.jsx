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
      nextBillingDate: "TBD",
      nextBillingAmount: "0.00",
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
      /*selectedMeals: "",
      selectedDeliveries: "",
      selectedDiscount: "",
      selectedId: "",*/
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
      subscriptionList: [],
      subscriptionsLoaded: false,
      currentPlan: null,
      updatedPlan: null
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

  calculateSubtotal() {
    let subtotal = (
      parseFloat(this.state.paymentSummary.mealSubPrice) -
      parseFloat(this.state.paymentSummary.discountAmount) + 
      parseFloat(this.state.paymentSummary.deliveryFee) + 
      parseFloat(this.state.paymentSummary.serviceFee) +
      parseFloat(this.state.paymentSummary.taxAmount) + 
      parseFloat(this.state.paymentSummary.tip)
    );
    /*this.setState(prevState => ({
      ...prevState.paymentSummary,
      subtotal: subtotal.toFixed(2)
    }));*/
    return subtotal.toFixed(2);
  }

  calculateTotal() {
    let total = (
      parseFloat(this.state.paymentSummary.mealSubPrice) -
      parseFloat(this.state.paymentSummary.discountAmount) + 
      parseFloat(this.state.paymentSummary.deliveryFee) + 
      parseFloat(this.state.paymentSummary.serviceFee) +
      parseFloat(this.state.paymentSummary.taxAmount) + 
      parseFloat(this.state.paymentSummary.tip) -
      parseFloat(this.state.paymentSummary.ambassadorDiscount)
    );
    /*this.setState(prevState => ({
      ...prevState.paymentSummary,
      total: total.toFixed(2)
    }));*/
    return total.toFixed(2);
  }

  setTotal() {
    let total = this.calculateTotal();
    let subtotal = this.calculateSubtotal();
    /*console.log("setTotal total: " + total);
    console.log("setTotal subtotal: " + subtotal);*/
    this.setState(prevState => ({
      recalculatingPrice: false,
      paymentSummary: {
        ...prevState.paymentSummary,
        total,
        subtotal
      }
    }), ()=>{
      console.log("setTotal new paymentSummary: ", this.state.paymentSummary);
    });
  }

  calculateAdditionalCharges = () => {
    let currCharge = this.state.currentBillingAmount;
    let diffCharge = this.calculateTotal();
    let feesCharge = this.state.sumFees

    /*console.log("curr charge: ", currCharge);
    console.log("diff charge: ", diffCharge);
    console.log("fees charge: ", feesCharge);*/

    let addCharges = -(
      parseFloat(currCharge) -  
      parseFloat(diffCharge) -
      feesCharge
    );

    /*console.log("add charges (float): ", addCharges);
    console.log("add charges (string): ", addCharges.toFixed(2));*/

    return addCharges.toFixed(2);
  };

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
          //console.log("fetch profile response: ", res);

          this.setState(prevState => ({
            customerUid,
            mounted: true
          }), () => {
            this.props.fetchProfileInformation(customerUid);
            this.props.fetchPlans();
            this.props.fetchSubscribed(customerUid)              
              .then((ids) => {
                console.log("fetchSubscribed purchaseIds: ", ids);
                console.log("# of IDs: ", ids.length);
                let newSubList = [];
                let subsLoaded = 0;

                for (const [subIndex, subData] of Object.entries(this.props.subscribedPlans)) {
                  console.log(" ");
                  console.log("\n(1)======| SUBS FETCHED |======(1)");
                  console.log("subIndex: ", subIndex);
                  console.log("subData: ", subData);
                  let planItems = JSON.parse(subData.items);
                  let planId = subData.purchase_uid.substring(
                    subData.purchase_uid.indexOf("-")+1,
                    subData.purchase_uid.length
                  );
                  let selectedMeals = planItems[0].name.substring(0,planItems[0].name.indexOf(" "));
                  let selectedDeliveries = planItems[0].qty;
                  let discount = "";

                  let mealPlan2 = this.props.plans[2];

                  try{
                    discount = mealPlan2[selectedDeliveries].delivery_discount;
                    //console.log("discount: ", discount);
                  } catch(e) {
                    console.log("discount UNDEFINED");
                  }
 
                  console.log("uid for PAD: ", subData.purchase_uid);
                  axios.get(API_URL + 'predict_autopay_day/' + subData.purchase_uid)
                    .then(res => {
                      //console.log("PAD date: " + JSON.stringify(res));
                      console.log("(2)=======| PAD LOADED |=======(2)");
                      

                        subData["next_billing_date"] = res.data.menu_date
                        subData["meals"] = selectedMeals;
                        subData["deliveries"] = selectedDeliveries;

                        newSubList.push(subData);

                        subsLoaded++;

                        if(subIndex === "0"){
                          this.setState({
                            currentPlan: subData,
                            updatedPlan: subData
                          })
                        }
                        if(subsLoaded === ids.length){
                          console.log("subscriptions loaded: ", newSubList);
                          this.setState({
                            subscriptionList: newSubList,
                            subscriptionsLoaded: true
                          })
                        }
                      
                      console.log("(3)============================(3)\n");
                      console.log(" ");
                    })
                    .catch(err => {
                      console.log(err);
                      // this.setState({
                      //   fetchingNBD: false
                      // });
                    });


                  
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
        Loading Subscriptions 💩...
      </div>
    );
  }

  /*getNextBillingInfo = (mealData) => {
    //console.log("calling PAD for " + mealData.purchase_uid);
    axios.get(API_URL + 'predict_autopay_day/' + mealData.purchase_uid)
      .then(res => {
        //console.log("PAD date: " + JSON.stringify(res));
        if(res.data.menu_date !== undefined) {
          this.setState({
            nextBillingDate: res.data.menu_date.substring(
              0, res.data.menu_date.indexOf(" ")
            ),
            fetchingNBD: false
          });
        } else {
          this.setState({
            nextBillingDate: "TBD",
            fetchingNBD: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          fetchingNBD: false
        });
      });

    // console.log("mealData for PID_HISTORY: ", mealData);
    // console.log("purchase UID: " + mealData.purchase_uid);
    // console.log("purchase ID:  " + mealData.purchase_id);

    axios.get(API_URL + 'pid_history/' + mealData.purchase_id)
      .then(res => {
        let pastPurchases = res.data.result;
        let initialPurchase = pastPurchases[0];

        // console.log("pid_history response: ", pastPurchases);

        var sumAmountDue = 0;
        pastPurchases.forEach((pur) => {
          // console.log(pur.purchase_uid + " amount due: " + pur.amount_due);
          sumAmountDue += pur.amount_due;
        });

        let sumFees = (
          initialPurchase.driver_tip + 
          initialPurchase.delivery_fee +
          initialPurchase.service_fee +
          initialPurchase.taxes
        )

        //console.log("final amount due: " + sumAmountDue);
        this.setState({
          nextBillingAmount: sumAmountDue.toFixed(2),
          sumFees,
          fetchingNBA: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          fetchingNBA: false
        });
      });
  }*/

  /*showSubscribedMeals = () => {

    let deselectedMealButton = styles.mealButton;
    let selectedMealButton =
    styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];
    let subbedPlans = this.props.subscribedPlans;

    for (const [mealIndex, mealData] of Object.entries(subbedPlans)) {

      let planItems = JSON.parse(mealData.items);
      let planId = mealData.purchase_uid.substring(
        mealData.purchase_uid.indexOf("-")+1,
        mealData.purchase_uid.length
      );

      let selectedMeals = planItems[0].name.substring(0,planItems[0].name.indexOf(" "));
      let selectedDeliveries = planItems[0].qty;

      let mealPlan2 = this.props.plans[2];
      let discount = null;

      try{
        discount = mealPlan2[selectedDeliveries].delivery_discount;
        //console.log("discount: ", discount);
      } catch(e) {
        console.log("discount UNDEFINED");
      }

      // if(this.state.mealPlanDefaulted === false && mealIndex === "0"){
      //   this.getNextBillingInfo(mealData);
      //   this.setState({
      //     mealPlanDefaulted: true,
      //     selectedMeals,
      //     selectedDeliveries,
      //     selectedDiscount: discount,
      //     selectedId: mealData.purchase_uid,
      //     nextBillingAmount: mealData.amount_due.toFixed(2),
      //     selectedMealPlan: mealData,
      //     latitude: mealData.delivery_latitude,
      //     longitude: mealData.delivery_longitude,
      //   });
      // }

      mealButtons.push(
          <div
            key={mealData.purchase_uid}
            className={
              this.state.selectedId === mealData.purchase_uid 
                ? selectedMealButton
                : deselectedMealButton
            }
            onClick={() => {
              console.log("(1)======| SUB CLICKED |======(1)");

              console.log("mealData: ", mealData);

              // NEED:
              // -- surpise/canceled/skipped/selected value
              // -- 

              this.setState({
                selectedMeals,
                selectedDeliveries,
                selectedDiscount: discount,
                selectedId: mealData.purchase_uid,
                selectedMealPlan: mealData,
                latitude: mealData.delivery_latitude,
                longitude: mealData.delivery_longitude,
                fetchingNBD: true,
                fetchingNBA: true
              });

              // console.log("lat: ", this.state.latitude);
              // console.log("lon: ", this.state.longitude);

              //console.log(parseFloat(this.state.latitude))

              const temp_position = {lat:parseFloat(this.state.latitude), lng:parseFloat(this.state.longitude)}

              //console.log(temp_position)

              window.map.setCenter(temp_position)

              if(this.state.latitude!=''){
                window.map.setZoom(17);
                new google.maps.Marker({
                  position: temp_position,
                  map: window.map
                });
              }
    
              this.props.chooseMealsDelivery(
                selectedMeals,
                selectedDeliveries,
                this.props.plans
              );

              //this.getNextBillingInfo(mealData);

              console.log("(2)===========================(2)");

            }}
          >
            <div className={styles.mealButtonEdit}>
              ✏️
            </div>
            <div className={styles.mealButtonPlan}>
              {selectedMeals} Meals, {selectedDeliveries} Deliveries
            </div>
            <div className={styles.mealButtonPlan}>
              {planId}
            </div>
            <div className={styles.mealButtonSection}>
              {this.state.nextBillingDate}
            </div>
            <div className={styles.mealButtonSection}>
              Selected
            </div>
            <div className={styles.mealButtonSection}>
              {this.state.nextBillingDate}
            </div>
            <div className={styles.mealButtonSection}>
              ${this.state.nextBillingAmount}
            </div>

          </div>
      );
    }
    return(
      <div style={{width: '100%'}}>
        {mealButtons}
      </div>
    );
  };*/
  showSubscribedMeals = () => {

    let deselectedMealButton = styles.mealButton;
    let selectedMealButton = styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];

    var sumAmountDue = 0;

    console.log("all subs: ", this.state.subscriptionList);

    this.state.subscriptionList.slice().reverse().forEach((sub) => {
      // console.log(pur.purchase_uid + " amount due: " + pur.amount_due);
      console.log("sub: ", sub);
      mealButtons.push(
        <div
          key={sub.purchase_uid}
          className={
            this.state.currentPlan.purchase_uid === sub.purchase_uid 
              ? selectedMealButton
              : deselectedMealButton
          }
          onClick={() => {
            console.log("(1)======| SUB CLICKED |======(1)");

            console.log("new current plan: ", sub);

            // NEED:
            // -- surpise/canceled/skipped/selected value
            // -- 

            this.setState({
              currentPlan: sub
            });

            //const temp_position = {lat:parseFloat(this.state.latitude), lng:parseFloat(this.state.longitude)}

            //console.log(temp_position)

            //window.map.setCenter(temp_position)

            // if(this.state.latitude!=''){
            //   window.map.setZoom(17);
            //   new google.maps.Marker({
            //     position: temp_position,
            //     map: window.map
            //   });
            // }
  
            // this.props.chooseMealsDelivery(
            //   selectedMeals,
            //   selectedDeliveries,
            //   this.props.plans
            // );

            //this.getNextBillingInfo(mealData);

            console.log("(2)===========================(2)");

          }}
        >
          <div className={styles.mealButtonEdit}>
            ✏️
          </div>
          <div className={styles.mealButtonPlan}>
            {sub.meals} Meals, {sub.deliveries} Deliveries
          </div>
          <div className={styles.mealButtonPlan}>
            {sub.purchase_uid}
          </div>
          <div className={styles.mealButtonSection}>
            {sub.next_billing_date}
          </div>
          <div className={styles.mealButtonSection}>
            {sub.purchase_status}
          </div>
          <div className={styles.mealButtonSection}>
            {sub.next_billing_date}
          </div>
          <div className={styles.mealButtonSection}>
            ${sub.amount_due.toFixed(2)}
          </div>
        </div>
      );
    });

      /*mealButtons.push(
          <div
            key={mealData.purchase_uid}
            className={
              this.state.selectedId === mealData.purchase_uid 
                ? selectedMealButton
                : deselectedMealButton
            }
            onClick={() => {
              console.log("(1)======| SUB CLICKED |======(1)");

              console.log("mealData: ", mealData);

              // NEED:
              // -- surpise/canceled/skipped/selected value
              // -- 

              this.setState({
                selectedMeals,
                selectedDeliveries,
                selectedDiscount: discount,
                selectedId: mealData.purchase_uid,
                selectedMealPlan: mealData,
                latitude: mealData.delivery_latitude,
                longitude: mealData.delivery_longitude,
                fetchingNBD: true,
                fetchingNBA: true
              });

              const temp_position = {lat:parseFloat(this.state.latitude), lng:parseFloat(this.state.longitude)}

              //console.log(temp_position)

              window.map.setCenter(temp_position)

              if(this.state.latitude!=''){
                window.map.setZoom(17);
                new google.maps.Marker({
                  position: temp_position,
                  map: window.map
                });
              }
    
              this.props.chooseMealsDelivery(
                selectedMeals,
                selectedDeliveries,
                this.props.plans
              );

              //this.getNextBillingInfo(mealData);

              console.log("(2)===========================(2)");

            }}
          >
            <div className={styles.mealButtonEdit}>
              ✏️
            </div>
            <div className={styles.mealButtonPlan}>
              {selectedMeals} Meals, {selectedDeliveries} Deliveries
            </div>
            <div className={styles.mealButtonPlan}>
              {planId}
            </div>
            <div className={styles.mealButtonSection}>
              {this.state.nextBillingDate}
            </div>
            <div className={styles.mealButtonSection}>
              Selected
            </div>
            <div className={styles.mealButtonSection}>
              {this.state.nextBillingDate}
            </div>
            <div className={styles.mealButtonSection}>
              ${this.state.nextBillingAmount}
            </div>

          </div>
      );
    }*/
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

      <div style={{border: 'double', width: 'fit-content'}}>
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
              {"(Save "+this.state.currentDiscount+"%)"}
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
            {(() => {
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
            })()}
          </div>
        </div>

        <br />
        <button 
          className={styles.chargeBtn}
          onClick = {() => {
            console.log("save changes clicked...");
            this.saveChanges();
          }}
        >
          Save Changes
        </button>

      </div> 

    </div>
    </>
    );
  }

  saveEdits = () => {
    console.log("saving edits...");
    /*this.props.history.push("/update-plan");*/
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
              this.state.updatedDeliveries,
              this.props.plans
            );
            console.log("===== mealIndex: " + mealIndex);
            console.log("===== paymentOption: " + this.props.paymentOption);
            this.setState({
              updatedMeals: mealIndex
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
                        this.state.updatedDeliveries === deliveryIndex
                          ? selectedPaymentOption
                          : deselectedPaymentOption
                      }
                      onClick={() => {
                        this.props.choosePaymentOption(
                          deliveryIndex,
                          this.state.updatedMeals,
                          this.props.plans
                        )
                        try{
                          discount = discounts[deliveryIndex].delivery_discount;
                          //console.log("delivery discount: " + discount);
                        } catch(e) {
                          console.log("delivery discount UNDEFINED");
                        }
                        this.setState({
                          updatedDeliveries: deliveryIndex,
                          selectedDiscount: discount
                        });
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
                    {(()=>{
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
                    })()}
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

          {/*<div className={styles.boxPDleft}>

            <div style={{border: 'double', width: 'fit-content'}}>
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
                    {"(Save "+this.state.currentDiscount+"%)"}
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
                  {(() => {
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
                  })()}
                </div>
              </div>

              <br />
              <button 
                className={styles.chargeBtn}
                onClick = {() => {
                  console.log("save changes clicked...");
                  this.saveChanges();
                }}
              >
                Save Changes
              </button>

            </div> 

              </div>*/}

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
          <div style = {{display: 'inline-block', marginLeft: '8%', width: '42%', marginRight: '12%'}}>
            <div style={{display: 'flex'}}>
              <input
                type='text'
                placeholder='First Name'
                className={styles.inputContactLeft}
                value={this.state.selectedMealPlan.delivery_first_name}
                onChange={e => {
                  this.setState(prevState => ({
                    selectedMealPlan: {
                      ...prevState.selectedMealPlan,
                      delivery_first_name: e.target.value
                    }
                  }));
                }}
              />

              <input
                type='text'
                placeholder='Last Name'
                className={styles.inputContactRight}
                value={this.state.selectedMealPlan.delivery_last_name}
                onChange={e => {
                  this.setState(prevState => ({
                    selectedMealPlan: {
                      ...prevState.selectedMealPlan,
                      delivery_last_name: e.target.value
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
              value={this.state.selectedMealPlan.delivery_phone_num}
              onChange={e => {
                this.setState(prevState => ({
                  selectedMealPlan: {
                    ...prevState.selectedMealPlan,
                    delivery_phone_num: e.target.value
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
              value={this.state.selectedMealPlan.delivery_address}
              onChange={e => {
                this.setState(prevState => ({
                  selectedMealPlan: {
                    ...prevState.selectedMealPlan,
                    delivery_address: e.target.value
                  }
                }));
              }}
            />

            <div style={{display: 'flex'}}>
              <input
                type='text'
                placeholder={"Unit"}
                className={styles.inputContactLeft}
                value={this.state.selectedMealPlan.delivery_unit}
                onChange={e => {
                  this.setState(prevState => ({
                    selectedMealPlan: {
                      ...prevState.selectedMealPlan,
                      delivery_unit: e.target.value
                    }
                  }));
                }}
              />
              {/*<input
                type='text'
                placeholder={"City"}
                id="locality" name="locality"

                className={styles.inputContactRight}
              />*/}
              <input
                type='text'
                placeholder={"City"}
                className={styles.inputContactRight}
                value={this.state.selectedMealPlan.delivery_city}
                onChange={e => {
                  this.setState(prevState => ({
                    selectedMealPlan: {
                      ...prevState.selectedMealPlan,
                      delivery_city: e.target.value
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
                value={this.state.selectedMealPlan.delivery_state}
                onChange={e => {
                  this.setState(prevState => ({
                    selectedMealPlan: {
                      ...prevState.selectedMealPlan,
                      delivery_state: e.target.value
                    }
                  }));
                }}
              />
              <input
                type='text'
                placeholder={"Zip Code"}
                className={styles.inputContactRight}
                value={this.state.selectedMealPlan.delivery_zip}
                onChange={e => {
                  this.setState(prevState => ({
                    selectedMealPlan: {
                      ...prevState.selectedMealPlan,
                      delivery_zip: e.target.value
                    }
                  }));
                }}
              />
            </div>

            <input
              type={'text'}
              placeholder={'Delivery Instructions'}
              className={styles.input}
              value={this.state.selectedMealPlan.delivery_instructions}
              onChange={e => {
                this.setState(prevState => ({
                  selectedMealPlan: {
                    ...prevState.selectedMealPlan,
                    delivery_instructions: e.target.value
                  }
                }));
              }}
            />

            <div className = {styles.googleMap} id = "map"/>     

            <div style={{textAlign: 'center'}}>
              <button 
                className={styles.saveBtn}
                disabled={(
                  this.state.fetchingNBD ||
                  this.state.fetchingNBA
                )}
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
                width:'30%',
                marginRight: '8%'
              }}
            > 
              <div 
              style=
              {{
                display: 'flex',
                borderBottom:'solid 2px black'
              }}
              >
                <div 
                  className={styles.summaryLeft}
                  style={{
                    fontWeight:'bold'
                  }}

                >Your box</div>
                <div className={styles.summaryRight}>
                  {
                    this.props.selectedPlan.num_items
                  } Meals for {
                    this.props.selectedPlan.num_deliveries
                  } Deliveries</div>

              </div>
              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>
                  <div className={styles.summaryLeft}>
                    Meal Subscription 
                    <br/>({
                      this.props.selectedPlan.num_items
                    } Meals for {
                      this.props.selectedPlan.num_deliveries
                    } Deliveries):
                  </div>

                  <div className={styles.summaryRight}>
                    ${this.state.paymentSummary.mealSubPrice}
                  </div>
              </div>

              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>
                  <div className={styles.summaryLeft}>
                  Discount ({this.props.selectedPlan.delivery_discount}%):
                  </div>

                  <div className={styles.summaryRight}>
                    -${this.state.paymentSummary.discountAmount}
                  </div>
              </div>

              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>
                  <div className={styles.summaryLeft}>
                    Total Delivery Fee For All {
                        this.props.selectedPlan.num_deliveries
                      } Deliveries:
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.paymentSummary.deliveryFee)}
                  </div>
              </div>

              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>
                  <div className={styles.summaryLeft}>
                    Service Fee:
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.paymentSummary.serviceFee)}
                  </div>
              </div>

              <div 
                style={{display: 'flex',borderBottom:'1px solid'}}>
                  <div className={styles.summaryLeft}>
                    Taxes:
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.paymentSummary.taxAmount)}
                  </div>
              </div>

              <div 
                style={{display: 'flex'}}>
                  <div className={styles.summaryLeft}>
                    Chef and Driver Tip:
                  </div>

                  <div className={styles.summaryRight}>
                    ${(this.state.paymentSummary.tip)}
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
                      if (this.state.paymentSummary.tip === "2.00") {
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
                      if (this.state.paymentSummary.tip === "3.00") {
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
                      if (this.state.paymentSummary.tip === "5.00") {
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
                    APPLY CODE
                  </button>
              </div>

              <div 
                style={{display: 'flex' ,marginBottom:'73px'}}>
                  <div className={styles.summaryLeft}>
                    Total:
                  </div>

                  <div className={styles.summaryRight}>
                    ${this.calculateTotal()}
                  </div>
              </div>


              {/* <div style={{display: 'flex'}}> */}
              {/* <div className={styles.summaryRight2}>
                    ${this.calculateSubtotal()}
                  </div> */}
                  {/* <div className={styles.summaryRight2}>
                    {console.log("ambassador discount: " + this.state.ambassadorDiscount)}
                    -${this.state.paymentSummary.ambassadorDiscount}
                  </div> */}
                {/* </div> */}

                
          <button 
          style={{
            backgroundColor: '#ff6505',
            width:'80%',
            height:'60px',
            marginBottom: '50px'
            // marginTop: '36px',
            // marginLeft: '60px',
          }}
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
