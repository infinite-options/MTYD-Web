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
import menuStyles from "../Menu/menu.module.css";
import {WebNavBar, BottomNavBar} from "../NavBar";
import PaymentDetails from "../PaymentDetails";
import Menu from "../Menu";
/*import takeaway from "./static/take-away.svg";
import chooseMeals from "./static/choose_meals.svg";
import prepay from "./static/prepay.png";
import delivery from "./static/delivery.png";
import one from "./static/one.svg";
import two from "./static/two.svg";
import three from "./static/three.svg";*/
/*import orangePlate from "./static/orange_plate.png";
import yellowPlate from "./static/yellow_plate.png";*/

/*import paymentOption1 from "./Group 2029.svg";
import paymentOption2 from "./Group 2016.svg";
import paymentOption3 from "./Group 2030.svg";*/

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
      loggedIn: false,
      deliveryDays: [],
      login_seen:false,
      signUpSeen:false,
      total: '0.00',
      numDeliveryDays: 0,
      nextBillingDate: "TBD",
      nextBillingAmount: "0.00",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      unit: "",
      instructions: "",
      latitude: "",
      longitude: "",
      selectedMeals: "",
      selectedDeliveries: "",
      selectedDiscount: "",
      selectedId: ""
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
  

  // http://localhost:2000/api/v2/delivery_weekdays
  // https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/delivery_weekdays

  componentDidMount() {

    console.log("Mounting...");

    console.log("(mount) edit plan props: ", this.props);

    console.log("google: ", google);
    console.log("after google");

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

    console.log("before id map");

    console.log(document.getElementById("map"));

    console.log("before const map");

    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: temp_lat, lng: temp_lng},
      zoom: 12,
    });

    console.log("after map");

    let queryString = this.props.location.search;
    let urlParams = new URLSearchParams(queryString);
    // Clear Query parameters
    window.history.pushState({}, document.title, window.location.pathname);

    // Logged in from Apple
    if (urlParams.has("customer_uid")) {
      let customer_uid = urlParams.get("customer_uid");
      document.cookie = "customer_uid=" + customer_uid;
      axios
        .get(API_URL + "customer_lplp", {
          params: {
            customer_uid: customer_uid
          }
        })
        .then(res => {
          //console.log(res);
          console.log("lplp res (apple): ", res);
          if (res.data.result !== undefined) {
            // this.props.history.push("/select-meal");
            this.props.fetchProfileInformation(customer_uid);
            this.props.fetchSubscribed(customer_uid);
          }
          this.props.fetchPlans();
          this.setState({
            mounted: true,
            customerUid: customer_uid,
            loggedIn: true
          });
        })
        .catch(err => {
          console.log(err);
          if (err.response) {
            console.log(err.response);
          }
        });
        axios.get(API_URL + 'Profile/' + customer_uid)
        .then(res => {
          let data = res.data.result[0]
          this.props.changeAddressFirstName(data.customer_first_name)
          this.props.changeAddressLastName(data.customer_last_name)
          this.props.changeAddressStreet(data.customer_address)
          this.props.changeAddressUnit(data.customer_unit)
          this.props.changeAddressCity(data.customer_city)
          this.props.changeAddressState(data.customer_state)
          this.props.changeAddressZip(data.customer_zip)
          this.props.changeAddressPhone(data.customer_phone_num)

          /*this.setState({
            latitude: res.data.result[0].customer_lat,
            longitude: res.data.result[0].customer_long,
          })
          console.log(this.state.latitude);
          console.log(this.state.longitude);
  
          console.log(parseFloat(this.state.latitude))
  
          const temp_position = {lat:parseFloat(this.state.latitude), lng:parseFloat(this.state.longitude)}
  
          console.log(temp_position)
  
          map.setCenter(temp_position)
  
          if(this.state.latitude!=''){
            map.setZoom(17);
            new google.maps.Marker({
              position: temp_position,
              map,
            });
          }*/

          console.log("(2) edit-plan address props: " + JSON.stringify(this.props.address));
        })
        .catch(err => {
          console.log(err)
        })

        /*const input = document.getElementById("pac-input");
        const options = {
          componentRestrictions: { country: "us" }
        };
        const autocomplete = new google.maps.places.Autocomplete(input, options);
    
        autocomplete.bindTo("bounds", map);
        const marker = new google.maps.Marker({
          map,
        });
    
        autocomplete.addListener("place_changed", () => {
          let address1 = "";
          let postcode = "";
          let city = '';
          let state = '';
          let address1Field = document.querySelector("#pac-input");
          let postalField = document.querySelector("#postcode");
    
          marker.setVisible(false);
          const place = autocomplete.getPlace();
          console.log(place)
          if (!place.geometry || !place.geometry.location) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }
          
          if (place.geometry.viewport) {
            console.log('here')
            map.fitBounds(place.geometry.viewport);
          } else {
            console.log('there')
            map.setCenter(place.geometry.location);
          }
    
          map.setZoom(17);
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
    
          for (const component of place.address_components) {
            const componentType = component.types[0];
            switch (componentType) {
              case "street_number": {
                address1 = `${component.long_name} ${address1}`;
                break;
              }
        
              case "route": {
                address1 += component.short_name;
                break;
              }
        
              case "postal_code": {
                postcode = `${component.long_name}${postcode}`;
                break;
              }
      
              case "locality":
                document.querySelector("#locality").value = component.long_name;
                city = component.long_name;
                break;
        
              case "administrative_area_level_1": {
                document.querySelector("#state").value = component.short_name;
                state= component.short_name;
                break;
              }
              
            }
          }
          address1Field.value = address1;
          postalField.value = postcode;
    
          this.setState({
            name: place.name,
            //street_address: address1,
            street: address1,
            city: city,
            state: state,
            //zip_code: postcode,
            addressZip: postcode,
            //lat:place.geometry.location.lat(),
            //lng:place.geometry.location.lng(),
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          })
        })*/
        
    // Logged in
    } else if (
      document.cookie
        .split(";")
        .some(item => item.trim().startsWith("customer_uid="))
    ) {
      let customer_uid = document.cookie
        .split("; ")
        .find(item => item.startsWith("customer_uid="))
        .split("=")[1];
      console.log("logged in!");
      this.props.fetchProfileInformation(customer_uid);
      this.props.fetchPlans();
      this.props.fetchSubscribed(customer_uid);
      // axios.get(API_URL + 'Profile/' + customer_uid)
      //   .then(res => {
      //     let data = res.data.result[0]
      //     this.props.changeAddressFirstName(data.customer_first_name)
      //     this.props.changeAddressLastName(data.customer_last_name)
      //     this.props.changeAddressStreet(data.customer_address)
      //     this.props.changeAddressUnit(data.customer_unit)
      //     this.props.changeAddressCity(data.customer_city)
      //     this.props.changeAddressState(data.customer_state)
      //     this.props.changeAddressZip(data.customer_zip)
      //     this.props.changeAddressPhone(data.customer_phone_num)
      //     console.log("(3) edit-plan address props: " + JSON.stringify(this.props.address));
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
      this.setState({
        mounted: true,
        customerUid: customer_uid,
        loggedIn: true
      });
    } else {
      // Reroute to log in page
      console.log("edit-plan NOT LOGGED IN");
      this.props.history.push("/");
      /*this.props.fetchPlans();
      this.setState({
        mounted: true,
        customerUid: "NULL",
        loggedIn: false
      });*/
    }
  }

  mealsDelivery = () => {

    let deselectedMealButton = styles.mealButton;
    let selectedMealButton =
    styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];
    let singleMealData;

    let mealPlans = this.props.plans;
    for (const [mealIndex, mealData] of Object.entries(mealPlans)) {

      singleMealData = mealData["1"];

      mealButtons.push(
        <div className={styles.mealButtonWrapper}>
        <button
          key={mealIndex}
          className={
            this.props.meals === mealIndex
              ? selectedMealButton
              : deselectedMealButton
          }
          onClick={() => {
            this.props.chooseMealsDelivery(
              mealIndex,
              this.props.paymentOption,
              this.props.plans
            );
            console.log("===== mealIndex: " + mealIndex);
            console.log("===== paymentOption: " + this.props.paymentOption);
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
    return mealButtons;
  };

  showSubscribedMeals = () => {

    let deselectedMealButton = styles.mealButton;
    let selectedMealButton =
    styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];
    //let singleMealData;

    //let mealPlans = this.props.plans;
    let subbedPlans = this.props.subscribedPlans;
    for (const [mealIndex, mealData] of Object.entries(subbedPlans)) {

      //singleMealData = mealData["1"];
      console.log("mealData: ", mealData);
      let planItems = JSON.parse(mealData.items);
      // console.log("planItems: " + JSON.stringify(planItems));
      // console.log("planItems.name: ", planItems[0].name);
      //console.log(planItems.name.substring(0,planItems.name.indexOf(" ")));
      //let planMealNum = JSON.parse(planItems[0].name.substring(0,planItems[0].name.indexOf(" ")));
      let planDeliveryNum = planItems[0].qty;
      let planId = mealData.purchase_uid.substring(
        mealData.purchase_uid.indexOf("-")+1,
        mealData.purchase_uid.length
      );

      mealButtons.push(
        <div>
        <button
          key={mealIndex}
          className={
            this.props.meals === mealIndex
              ? selectedMealButton
              : deselectedMealButton
          }
          onClick={() => {
            console.log("clicked subbed meal button");
            console.log("meal data: ", mealData);
            this.setState({
              selectedMeals: planItems[0].name.substring(0,planItems[0].name.indexOf(" ")),
              selectedDeliveries: planDeliveryNum,
              selectedDiscount: mealData.amount_discount.toFixed(2),
              selectedId: mealData.purchase_uid,
              nextBillingAmount: mealData.amount_due.toFixed(2)
            });
            this.props.chooseMealsDelivery(
              mealIndex,
              this.props.paymentOption,
              this.props.plans
            );
            console.log("calling PAD for " + mealData.purchase_uid);
            axios.get(API_URL + 'predict_autopay_day/' + mealData.purchase_uid)
              .then(res => {
                console.log("PAD date: " + JSON.stringify(res));
                if(res.data.menu_date !== undefined) {
                  this.setState({
                    nextBillingDate: res.data.menu_date.substring(
                      0, res.data.menu_date.indexOf(" ")
                    )
                  });
                } else {
                  this.setState({
                    nextBillingDate: "TBD"
                  });
                }
              })
              .catch(err => {
                console.log(err)
              })
            //https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/predict_autopay_day/400-000086
            // console.log("===== mealIndex: " + mealIndex);
            // console.log("===== paymentOption: " + this.props.paymentOption);
          }}
        >
          {planItems[0].name}, {planDeliveryNum} Deliveries: {planId}
        </button>
        </div>
      );
    }
    return mealButtons;
  };

  calculateTotal = () => {
    let calculatedTotal = (
      this.props.selectedPlan.item_price *
      this.props.selectedPlan.num_deliveries *
      (1-(this.props.selectedPlan.delivery_discount*0.01))
    ).toFixed(2);
    return calculatedTotal;
  };

  calculateDeal = () => {
    let total = parseFloat(this.calculateTotal());
    //console.log("total: " + total);

    let noDiscountPrice = parseFloat((
      this.props.selectedPlan.item_price *
      this.props.selectedPlan.num_deliveries
    ).toFixed(2));
    //console.log("noDiscountPrice: " + noDiscountPrice);

    let deal = total/noDiscountPrice;
    //console.log("deal: " + deal);

    return Math.ceil(deal);
  };

  saveEdits = () => {
    /*this.props.history.push("/update-plan");*/
  }

  updatePlan = () => {
    this.props.history.push("/update-plan");
  }

  render() {
    /*if (!this.state.mounted) {
      return null;
    }*/
    console.log("(rerender) edit plan props: ", this.props);
    return (
      /*for mobile's screen*/
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
              {this.showSubscribedMeals()}
            </div>
            <div className={styles.boxRight}>

              <div style={{textAlign: 'center'}}>
                <div>
                  Card
                </div>
                <div className={styles.iconCard}>
                  
                </div>
                <div>
                  **********90
                </div>
              </div>

              <div style={{textAlign: 'center', paddingLeft: '8%'}}>
                <div>
                  Meals
                </div>
                <div 
                  className={styles.iconMeals}
                  onClick={() => {
                    this.props.history.push("/update-plan");
                  }}
                >
                  {this.state.selectedMeals}
                </div>
              </div>

              <div style={{textAlign: 'center', paddingLeft: '8%'}}>
                <div>
                  Deliveries
                </div>
                <button 
                  className={styles.deliveryButton}
                  onClick={() => {
                    this.props.history.push("/update-plan");
                  }}
                >
                  <span style={{fontSize: '35px'}}>
                    {this.state.selectedDeliveries}
                  </span>
                  <br></br>
                  <span style={{whiteSpace: "nowrap"}}>
                    {"(Save "+this.state.selectedDiscount+"%)"}
                  </span>
                </button>
              </div>

              <div style={{textAlign: 'center', paddingLeft: '8%'}}>
                <div>
                  Cancel
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
                        console.log("cancel_purchase customerId: " + this.state.customerUid);
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

          <div className={styles.sectionHeader}>
            Plan Details
          </div>

          <div className={styles.containerSplit}>
            <div className={styles.boxPDleft}>
              <div style={{height: '30px', marginBottom: '10px', fontSize: '20px'}}>
                Next Billing Date
              </div>
              <div style={{height: '30px', marginBottom: '10px', fontSize: '20px'}}>
                Next Billing Amount
              </div>
              <div style={{height: '30px', marginBottom: '30px', fontSize: '20px'}}>
                Ambassador Code
              </div>
            </div>
            <div className={styles.boxPDright}>
              <div style={{height: '30px', marginBottom: '10px', fontSize: '20px'}}>
                {this.state.nextBillingDate}
              </div>
              <div style={{height: '30px', marginBottom: '10px', fontSize: '20px'}}>
                ${this.state.nextBillingAmount}
              </div>
              <div style={{height: '30px', marginBottom: '30px', fontSize: '20px'}}>
              <input
                    type='text'
                    placeholder='Enter Code Here'
                    className={styles.inputAmbassador}
                    onChange={e => {
                      this.setState({
                        ambassadorCode: e.target.value
                      });
                    }}
                  />
              </div>
            </div>
          </div>

          <div className={styles.sectionHeader}>
            Edit Delivery Details
          </div>

          <div style={{display: 'flex', marginLeft: '8%', width: '42%'}}>

<div style = {{display: 'inline-block', width: '100%'}}>

  <div style={{display: 'flex'}}>
    <input
      type='text'
      placeholder='First Name'
      className={styles.inputContactLeft}
      value={this.state.firstName}
      onChange={e => {
        this.setState({
          firstName: e.target.value
        });
      }}
    />

    <input
      type='text'
      placeholder='Last Name'
      className={styles.inputContactRight}
      value={this.state.lastName}
      onChange={e => {
        this.setState({
          lastName: e.target.value
        });
      }}
    />
  </div>



  {(() => {
      if (this.state.customerUid === "GUEST") {
        return (
          <input
            type='text'
            placeholder='Email'
            className={styles.input}
            value={this.state.email}
            onChange={e => {
              this.setState({
                email: e.target.value
              })
            }}
          />
        );
      } else {
        return (
          <input
            type='text'
            placeholder='Email'
            className={styles.input}
            value={this.props.email}
            onChange={e => {
        
            }}
          />
        );
      }
    })()} 

  <input
    type='text'
    placeholder='Phone Number'
    className={styles.input}
    value={this.state.phone}
    onChange={e => {
      this.setState({
        phone: e.target.value
      });
    }}
  />


  <input
    type='text'
    placeholder={this.props.address.street==''?"Address 1":this.props.address.street}
    className={styles.input}
    id="pac-input"
  />


  <div style={{display: 'flex'}}>
    <input
      type='text'
      placeholder={this.props.address.unit==''?'Unit':this.props.address.unit}
      className={styles.inputContactLeft}
      value={this.state.unit}
      onChange={e => {
        this.setState({
          unit: e.target.value
        });
      }}
    />
    <input
      type='text'
      placeholder={this.props.address.city==''?"City":this.props.address.city}
      id="locality" name="locality"

      className={styles.inputContactRight}
    />
  </div>


  <div style={{display: 'flex'}}>
    <input
      type='text'
      placeholder={this.props.address.state==''?"State":this.props.address.state}
      
      className={styles.inputContactLeft}
      id="state" name="state"
    />
    <input
      type='text'
      placeholder={this.props.address.zip==''?"Zip Code":this.props.address.zip}
      className={styles.inputContactRight}
      id="postcode" name="postcode"
    />

  </div>

  <input
    type='text'
    placeholder='Delivery Instructions'
    className={styles.input}
    value={this.state.instructions}
    onChange={e => {
      this.setState({
        instructions: e.target.value
      });
    }}
  />

  <div className = {styles.googleMap} id = "map"/>     

  <div style={{textAlign: 'center'}}>
  <button 
    style={{
      marginTop:'36px',
      marginBottom: '50px',
      backgroundColor:'#f26522',
      color:'white',
      fontSize:'20px',
      borderRadius:'15px',
      border:'none',
      height:'54px',
      width: '70%'
    }}
    onClick={()=>this.saveEdits()}
  >
        Save
  </button>
  </div>

</div>
</div>

      </>
    );
  }
}

EditPlan.propTypes = {
  fetchPlans: PropTypes.func.isRequired,
  fetchSubscribed: PropTypes.func.isRequired,
  chooseMealsDelivery: PropTypes.func.isRequired,
  choosePaymentOption: PropTypes.func.isRequired,
  numItems: PropTypes.array.isRequired,
  paymentFrequency: PropTypes.array.isRequired,
  meals: PropTypes.string.isRequired,
  paymentOption: PropTypes.string.isRequired,
  selectedPlan: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  plans: state.subscribe.plans,
  subscribedPlans: state.subscribe.subscribedPlans,
  numItems: state.subscribe.numItems,
  paymentFrequency: state.subscribe.paymentFrequency,
  meals: state.subscribe.meals,
  paymentOption: state.subscribe.paymentOption,
  selectedPlan: state.subscribe.selectedPlan,
  customerId: state.subscribe.profile.customerId,
  socialMedia: state.subscribe.profile.socialMedia,
  email: state.subscribe.profile.email,
  firstName: state.subscribe.addressInfo.firstName,
  lastName: state.subscribe.addressInfo.lastName,
  street: state.subscribe.address.street,
  unit: state.subscribe.address.unit,
  city: state.subscribe.address.city,
  state: state.subscribe.address.state,
  zip: state.subscribe.address.zip,
  cc_num: state.subscribe.creditCard.number,
  cc_cvv: state.subscribe.creditCard.cvv,
  cc_zip: state.subscribe.creditCard.zip,
  cc_month: state.subscribe.creditCard.month,
  cc_year: state.subscribe.creditCard.year,
  phone: state.subscribe.addressInfo.phoneNumber,
  instructions: state.subscribe.deliveryInstructions,
  password: state.subscribe.paymentPassword,
  address: state.subscribe.address
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
