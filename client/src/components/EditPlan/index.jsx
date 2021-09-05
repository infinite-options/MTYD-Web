import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  fetchPlans,
  fetchSubscribed,
  chooseMealsDelivery,
  choosePaymentOption,
  fetchProfileInformation,
} from "../../reducers/actions/subscriptionActions";

import axios from "axios";
import { API_URL } from "../../reducers/constants";
import { withRouter } from "react-router";
import styles from "./editPlan.module.css";
// import styles from "../../EditPlan/editPlan.module.css";
import styles_admin from "../Admin/AdminEditModal/adminEditModal.module.css";
import { WebNavBar } from "../NavBar";
import { FootLink } from "../Home/homeButtons";

import fetchDiscounts from "../../utils/FetchDiscounts";
import fetchAddressCoordinates from "../../utils/FetchAddressCoordinates";

import PopLogin from "../PopLogin";
import Popsignup from "../PopSignup";

import m4me_logo from "../../images/LOGO_NoBG_MealsForMe.png";

const google = window.google;

var map;
var autocomplete;

const DEFAULT = 0;
const CURRENT = 1;
const UPDATED = 2;

class EditPlan extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
      planToEdit: [],
      unlogin_plans: null,
      plansFetched: false,
      customerUid: "",
      deliveryDays: [],
      login_seen: false,
      signUpSeen: false,
      numDeliveryDays: 0,
      latitude: "",
      longitude: "",
      refreshingPrice: false,
      ambassadorCode: "",
      validCode: false,
      selectedMealPlan: {
        delivery_first_name: "",
        delivery_last_name: "",
        delivery_phone_num: "",
        delivery_address: "",
        delivery_unit: "",
        delivery_state: "",
        delivery_city: "",
        delivery_zip: "",
        delivery_instructions: "",
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
        instructions: "",
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
        subtotal: "0.00",
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
        total: "0.00",
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
          total: "0.00",
        },
        meals: null,
        deliveries: null,
        order_history: null,
        load_order: null,
        discount: null,
        next_billing_date: null,
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
          total: "0.00",
        },
        meals: null,
        deliveries: null,
        order_history: null,
        load_order: null,
        discount: null,
        next_billing_date: null,
      },
      discounts: [],
      usePreviousCard: true,
      defaultSet: false,
      showErrorModal: false,
      errorModal: null,
      errorMessage: "",
      errorLink: "",
      errorLinkText: "",
      errorHeader: "",
      showConfirmModal: false,
      confirmModal: null,
      deletingPurchase: false,
      deleteSuccess: null,
      processingChanges: false,
      windowHeight: undefined,
      windowWidth: undefined,
      refundAmount: 0,
      refundError: "Error attempting to refund subscription",
      // narrowView: true
    };

    // this.updateView = this.updateView.bind(this);
  }

  // updateView() {
  //   this.setState({ narrowView: window.innerWidth <= 800 },
  //   () => {
  //     console.log(
  //       "narrowView changed to: ", this.state.narrowView,
  //       " (width = " + window.innerWidth + "px)"
  //     );
  //   });
  // }

  handleResize = () =>
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });

  togglePopLogin = () => {
    this.setState({
      login_seen: !this.state.login_seen,
    });

    if (!this.state.login_seen) {
      this.setState({
        signUpSeen: false,
      });
    }
  };

  togglePopSignup = () => {
    this.setState({
      signUpSeen: !this.state.signUpSeen,
    });

    if (!this.state.signUpSeen) {
      this.setState({
        login_seen: false,
      });
    }
  };

  // Display pop up message
  displayErrorModal = (header, message, linkText, link) => {
    if (this.state.showErrorModal === false) {
      this.setState({
        errorModal: styles.errorModalPopUpShow,
        showErrorModal: true,
        errorMessage: message,
        errorLinkText: linkText,
        errorLink: link,
        errorHeader: header,
      });
      console.log("\nerror pop up toggled to true");
    } else {
      this.setState({
        errorModal: styles.errorModalPopUpHide,
        showErrorModal: false,
        // errorMessage: message,
        // errorLinkText: linkText,
        // errorLink: link,
        // errorHeader: header
      });
      console.log("\nerror pop up toggled to false");
    }
  };

  // displayError = (type, message) => {

  //   if(type === CLOSED) {
  //     this.setState({
  //       errorModal: styles.errorModalPopUpHide,
  //       errorType: type,
  //       errorMessage: ''
  //     });
  //   } else {
  //     this.setState({
  //       errorModal: styles.errorModalPopUpShow,
  //       errorType: type,
  //       errorMessage: message
  //     });
  //   }

  //   console.log("\npop up error toggled to " + type + "\n\n");
  // }

  // Confirm box for cancellations
  displayConfirmation = () => {
    if (this.state.showConfirmModal === false) {
      this.setState({
        showConfirmModal: true,
        confirmModal: styles.errorModalPopUpShow,
      });
      console.log("\nconfirm pop up toggled to true");
    } else {
      this.setState({
        showConfirmModal: false,
        confirmModal: styles.errorModalPopUpHide,
      });
      console.log("\nconfirm pop up toggled to false");
    }
  };

  // calculateSubtotal(summary) {
  //   let subtotal =
  //     parseFloat(summary.mealSubPrice) -
  //     parseFloat(summary.discountAmount) +
  //     parseFloat(summary.deliveryFee) +
  //     parseFloat(summary.serviceFee) +
  //     parseFloat(summary.taxAmount) +
  //     parseFloat(summary.tip);
  //   return subtotal.toFixed(2);
  // }

  // calculateTotal(summary) {
  //   let total =
  //     parseFloat(summary.mealSubPrice) -
  //     parseFloat(summary.discountAmount) +
  //     parseFloat(summary.deliveryFee) +
  //     parseFloat(summary.serviceFee) +
  //     parseFloat(summary.taxAmount) +
  //     parseFloat(summary.tip) -
  //     parseFloat(summary.ambassadorDiscount);
  //   return total.toFixed(2);
  // }

  // setTotal(summary) {
  //   let total = this.calculateTotal(summary);
  //   let subtotal = this.calculateSubtotal(summary);
  //   let newSummary = {
  //     ...summary,
  //     total,
  //     subtotal,
  //   };
  //   return newSummary;
  // }

  // calculateNextBillingAmount = (orders) => {
  //   console.log("(CNBA) orders: ", orders);

  //   let initialPurchase = orders[0];

  //   var sumAmountDue = 0;
  //   orders.forEach((pur) => {
  //     console.log(pur.purchase_uid + " amount due: " + pur.amount_due);
  //     sumAmountDue += pur.amount_due;
  //   });

  //   let sumFees =
  //     initialPurchase.driver_tip +
  //     initialPurchase.delivery_fee +
  //     initialPurchase.service_fee +
  //     initialPurchase.taxes;

  //   console.log("final amount due: " + sumAmountDue);

  //   return sumAmountDue;
  // };

  applyAmbassadorCode() {
    this.setState(
      {
        refreshingPrice: true,
      },
      () => {
        axios
          .post(API_URL + "brandAmbassador/discount_checker", {
            code: this.state.ambassadorCode,
            info: this.props.email,
            IsGuest: "False",
          })
          .then((res) => {
            console.log("(CUST) ambassador code response: ", res);

            if (res.data.code !== 200) {
              console.log("(CUST) Invalid code");

              this.displayErrorModal(
                "Hmm...",
                res.data.message,
                "Go Back",
                "back"
              );

              this.setState(
                (prevState) => ({
                  updatedPlan: {
                    ...prevState.updatedPlan,
                    payment_summary: {
                      ...prevState.updatedPlan.payment_summary,
                      ambassador_discount: "0.00",
                    },
                  },
                }),
                () => {
                  this.changePlans(
                    this.state.updatedPlan.meals,
                    this.state.updatedPlan.deliveries
                  );
                }
              );
            } else {
              console.log("(CUST) Valid code");

              console.log("(CUST) result: ", res.data);

              this.setState(
                (prevState) => ({
                  updatedPlan: {
                    ...prevState.updatedPlan,
                    payment_summary: {
                      ...prevState.updatedPlan.payment_summary,
                      ambassador_discount: (
                        res.data.sub.discount_amount +
                        res.data.sub.discount_shipping
                      ).toFixed(2),
                    },
                  },
                }),
                () => {
                  this.changePlans(
                    this.state.updatedPlan.meals,
                    this.state.updatedPlan.deliveries
                  );
                }
              );
            }
          })
          .catch((err) => {
            console.log("Ambassador code error: " + err);
          });
      }
    );
  }

  // Calculate values for difference column of payment summary.
  // Call whenever current or updated plan are changed.
  calculateDifference = () => {
    this.setState((prevState) => ({
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
        discount_rate:
          this.state.updatedPlan.payment_summary.discount_rate -
          this.state.currentPlan.payment_summary.discount_rate,
        ambassador_discount: (
          parseFloat(
            this.state.updatedPlan.payment_summary.ambassador_discount
          ) -
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
      refreshingPrice: false,
    }));
  };

  // Change updated plan
  changePlans = (meals, deliveries) => {
    let mealPlan = this.props.plans[meals][deliveries];
    let newBaseAmount = mealPlan.item_price * mealPlan.num_deliveries;
    let newUpdatedPlan = { ...this.state.updatedPlan };

    newUpdatedPlan.meals = meals;
    newUpdatedPlan.deliveries = deliveries;
    newUpdatedPlan.payment_summary.base_amount = newBaseAmount.toFixed(2);
    newUpdatedPlan.payment_summary.discount_rate = mealPlan.delivery_discount;
    newUpdatedPlan.payment_summary.total = (
      parseFloat(newUpdatedPlan.payment_summary.base_amount) +
      parseFloat(newUpdatedPlan.payment_summary.taxes) +
      parseFloat(newUpdatedPlan.payment_summary.service_fee) +
      parseFloat(newUpdatedPlan.payment_summary.delivery_fee) +
      parseFloat(newUpdatedPlan.payment_summary.driver_tip) -
      parseFloat(newUpdatedPlan.payment_summary.ambassador_discount) -
      parseFloat(newUpdatedPlan.payment_summary.base_amount) *
        mealPlan.delivery_discount *
        0.01
    ).toFixed(2);

    newUpdatedPlan.payment_summary.discount_amount = (
      parseFloat(newUpdatedPlan.payment_summary.base_amount) *
      mealPlan.delivery_discount *
      0.01
    ).toFixed(2);

    this.setState(
      (prevState) => ({
        updatedPlan: newUpdatedPlan,
      }),
      () => {
        this.calculateDifference();
      }
    );
  };

  // Gets called whenever subscriptions are fetched, modified, or deleted.
  // Parses user subscriptions for display and sorts them, sets default selection,
  // updates map, and updates payment summary.
  loadSubscriptions = (subscriptions, discounts, setDefault) => {
    if (subscriptions.length === 0) {
      console.log("NO SUBSCRIPTIONS");

      this.displayErrorModal(
        "Hmm...",
        `
        Please purchase a subscription. Once you have a subscription, you can manage it from here.
      `,
        "Choose a Plan",
        "/choose-plan"
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
      instructions: "",
    };

    subscriptions.forEach((sub, index) => {
      console.log("(loadSubscriptions) sub: ", sub);

      let subscription = {};

      let parsedItems = JSON.parse(sub.items)[0];
      let parsedMeals = parsedItems.name.substring(
        0,
        parsedItems.name.indexOf(" ")
      );
      let parsedDeliveries = parsedItems.qty;

      let discountItem = discounts.filter(function (e) {
        return e.deliveries === parsedDeliveries;
      });

      console.log("PNDA info before parse: ", sub);

      let parsedDiscount = discountItem[0].discount;
      let parsedId = sub.purchase_id.substring(
        sub.purchase_id.indexOf("-") + 1,
        sub.purchase_id.length
      );
      console.log("Parsed ID: " + parsedId);
      // let parsedDeliveryDate = "TBD";
      // let parsedSelection = "N/A";
      let parsedDeliveryDate = sub.next_delivery.substring(
        0,
        sub.next_delivery.indexOf(" ")
      );
      let parsedSelection = sub.final_selection;
      let parsedStatus = null;

      if (parsedSelection !== "SURPRISE" && parsedSelection !== "SKIP") {
        parsedStatus = "SELECTED";
      } else {
        parsedStatus = parsedSelection;
      }

      parsedStatus = "N/A";

      let parsedBillingDate = sub.menu_date.substring(
        0,
        sub.menu_date.indexOf(" ")
      );

      console.log("(parsed) Billing Date: ", parsedBillingDate);

      console.log(" ");
      console.log("Base Amount: ", sub.subtotal);
      console.log("Taxes: ", sub.taxes);
      console.log("Delivery Fee: ", sub.delivery_fee);
      console.log("Service Fee: ", sub.service_fee);
      console.log("Driver Tip: ", sub.driver_tip);
      console.log("Ambassador Code/Discount: ", sub.ambassador_code);

      let nextBillingAmount =
        sub.subtotal +
        sub.taxes +
        sub.delivery_fee +
        sub.service_fee +
        sub.driver_tip -
        parsedDiscount * 0.01 * sub.subtotal -
        sub.ambassador_code;

      console.log("Next Billing Amount: ", nextBillingAmount);

      console.log(" ");

      let payment_summary = {
        base_amount: sub.subtotal.toFixed(2),
        taxes: sub.taxes.toFixed(2),
        delivery_fee: sub.delivery_fee.toFixed(2),
        service_fee: sub.service_fee.toFixed(2),
        driver_tip: sub.driver_tip.toFixed(2),
        discount_amount: (sub.subtotal * parsedDiscount * 0.01).toFixed(2),
        discount_rate: parsedDiscount,
        ambassador_discount: sub.ambassador_code.toFixed(2),
        subtotal: "0.00",
        total: nextBillingAmount.toFixed(2),
      };

      subscription["load_order"] = index;
      subscription["id"] = parsedId;
      subscription["meals"] = parsedMeals;
      subscription["deliveries"] = parsedDeliveries;
      subscription["discount"] = parsedDiscount;
      subscription["next_delivery_date"] = parsedDeliveryDate;
      // subscription["next_delivery_status"] = parsedStatus;
      subscription["next_delivery_status"] = sub.final_selection;
      subscription["next_billing_date"] = parsedBillingDate;
      subscription["next_billing_amount"] = nextBillingAmount.toFixed(2);
      subscription["payment_summary"] = { ...payment_summary };
      subscription["raw_data"] = sub;

      if (index === 0) {
        defaultCurrentPlan["load_order"] = index;
        defaultCurrentPlan["id"] = parsedId;
        defaultCurrentPlan["meals"] = parsedMeals;
        defaultCurrentPlan["deliveries"] = parsedDeliveries;
        defaultCurrentPlan["discount"] = parsedDiscount;
        defaultCurrentPlan["next_delivery_date"] = parsedDeliveryDate;
        // defaultCurrentPlan["next_delivery_status"] = parsedStatus;
        defaultCurrentPlan["next_delivery_status"] = sub.final_selection;
        defaultCurrentPlan["next_billing_date"] = parsedBillingDate;
        defaultCurrentPlan["next_billing_amount"] =
          nextBillingAmount.toFixed(2);
        defaultCurrentPlan["payment_summary"] = { ...payment_summary };
        defaultCurrentPlan["raw_data"] = sub;

        defaultUpdatedPlan["load_order"] = index;
        defaultUpdatedPlan["id"] = parsedId;
        defaultUpdatedPlan["meals"] = parsedMeals;
        defaultUpdatedPlan["deliveries"] = parsedDeliveries;
        defaultUpdatedPlan["discount"] = parsedDiscount;
        defaultUpdatedPlan["next_delivery_date"] = parsedDeliveryDate;
        // defaultUpdatedPlan["next_delivery_status"] = parsedStatus;
        defaultUpdatedPlan["next_delivery_status"] = sub.final_selection;
        defaultUpdatedPlan["next_billing_date"] = parsedBillingDate;
        defaultUpdatedPlan["next_billing_amount"] =
          nextBillingAmount.toFixed(2);
        defaultUpdatedPlan["payment_summary"] = { ...payment_summary };
        defaultUpdatedPlan["raw_data"] = sub;

        console.log("sub at index 0: ", sub);

        document.getElementById("locality").value = sub.delivery_city;
        document.getElementById("state").value = sub.delivery_state;
        document.getElementById("pac-input").value = sub.delivery_address;
        document.getElementById("postcode").value = sub.delivery_zip;

        fetchAddressCoordinates(
          sub.delivery_address,
          sub.delivery_city,
          sub.delivery_state,
          sub.delivery_zip,
          (coords) => {
            console.log(
              "(default) Fetched coordinates: " + JSON.stringify(coords)
            );

            this.setState({
              latitude: coords.latitude,
              longitude: coords.longitude,
            });

            const temp_position = {
              lat: parseFloat(coords.latitude),
              lng: parseFloat(coords.longitude),
            };

            console.log(temp_position);

            map.setCenter(temp_position);

            if (coords.latitude !== "") {
              map.setZoom(17);
              new google.maps.Marker({
                position: temp_position,
                map,
              });
            }
          }
        );

        const input = document.getElementById("pac-input");
        const options = {
          componentRestrictions: { country: "us" },
        };
        autocomplete = new google.maps.places.Autocomplete(input, options);

        autocomplete.bindTo("bounds", map);
        const marker = new google.maps.Marker({
          map,
        });

        autocomplete.addListener("place_changed", () => {
          let address1 = "";
          let postcode = "";
          let city = "";
          let state = "";

          let address1Field = document.querySelector("#pac-input");
          let postalField = document.querySelector("#postcode");

          marker.setVisible(false);
          const place = autocomplete.getPlace();
          console.log(place);
          if (!place.geometry || !place.geometry.location) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert(
              "No details available for input: '" + place.name + "'"
            );
            return;
          }

          if (place.geometry.viewport) {
            console.log("here");
            map.fitBounds(place.geometry.viewport);
          } else {
            console.log("there");
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
                state = component.short_name;
                break;
              }
            }
          }
          address1Field.value = address1;
          postalField.value = postcode;

          this.setState({
            name: place.name,
            street: address1,
            city: city,
            state: state,
            addressZip: postcode,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          });
        });

        defaultDeliveryInfo = this.setDeliveryInfo(sub);
      }

      newSubList.push(subscription);

      console.log(" ");
    });

    newSubList.sort(function (a, b) {
      return a.load_order - b.load_order;
    });

    if (setDefault === DEFAULT) {
      this.setState(
        (prevState) => ({
          subscriptionsList: newSubList,
          subscriptionsLoaded: true,
          currentPlan: { ...defaultCurrentPlan },
          updatedPlan: { ...defaultUpdatedPlan },
          deliveryInfo: { ...defaultDeliveryInfo },
        }),
        () => {
          this.calculateDifference();
        }
      );
    } else if (setDefault === UPDATED) {
      console.log("(UPDATED) current Plan: ", this.state.currentPlan);
      console.log("(UPDATED) updated Plan: ", this.state.updatedPlan);
      console.log("(UPDATED) deliveryInfo: ", this.state.deliveryInfo);

      console.log("(DEFAULT) current Plan: ", defaultCurrentPlan);
      console.log("(DEFAULT) updated Plan: ", defaultUpdatedPlan);
      console.log("(DEFAULT) deliveryInfo: ", defaultDeliveryInfo);

      this.setState(
        (prevState) => ({
          subscriptionsList: newSubList,
          subscriptionsLoaded: true,
          currentPlan: { ...defaultCurrentPlan },
          updatedPlan: { ...defaultUpdatedPlan },
          deliveryInfo: { ...defaultDeliveryInfo },
          processingChanges: false,
        }),
        () => {
          this.calculateDifference();
        }
      );
    } else {
      this.setState({
        subscriptionsList: newSubList,
        subscriptionsLoaded: true,
      });
    }
  };

  // Make sure plans have been fetched
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.plans !== this.props.plans &&
      this.state.updatedPlan.meals !== null &&
      this.state.updatedPlan.deliveries !== null
    ) {
      console.log(
        "(1) plans fetched; defaulting selection to: " +
          this.state.updatedPlan.meals +
          " meals, " +
          this.state.updatedPlan.deliveries +
          " deliveries"
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
        defaultSet: true,
      });
    } else if (
      JSON.stringify(this.props.plans) !== "{}" &&
      prevState.updatedPlan.meals === null &&
      this.state.updatedPlan.meals !== null &&
      prevState.updatedPlan.deliveries === null &&
      this.state.updatedPlan.deliveries !== null
    ) {
      console.log(
        "(2) plans fetched; defaulting selection to: " +
          this.state.updatedPlan.meals +
          " meals, " +
          this.state.updatedPlan.deliveries +
          " deliveries"
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
        defaultSet: true,
      });
    }
  }

  discardChanges() {
    console.log("(DISCARD) currentPlan: ", this.state.currentPlan);

    this.changePlans(
      this.state.currentPlan.meals,
      this.state.currentPlan.deliveries
    );

    let currDeliveryInfo = this.setDeliveryInfo(
      this.state.currentPlan.raw_data
    );

    this.changeTip(this.state.currentPlan.payment_summary.driver_tip);

    this.setState(
      (prevState) => ({
        deliveryInfo: { ...currDeliveryInfo },
      }),
      () => {
        this.calculateDifference();
      }
    );
  }

  confirmChanges() {
    console.log("before change_purchase: ", this.state.updatedPlan);

    console.log(
      "(new change_purchase) driver_tip: ",
      this.state.updatedPlan.payment_summary.driver_tip
    );

    let object = null;
    if (this.state.usePreviousCard) {
      object = {
        cc_cvv: "",
        cc_exp_date: "",
        cc_num: "",
        cc_zip: "",
        customer_email: this.props.email,
        items: [
          {
            qty: this.props.selectedPlan.num_deliveries.toString(),
            name: this.props.selectedPlan.item_name,
            price: this.props.selectedPlan.item_price.toString(),
            item_uid: this.props.selectedPlan.item_uid,
            itm_business_uid: this.props.selectedPlan.itm_business_uid,
          },
        ],
        purchase_uid: this.state.updatedPlan.raw_data.purchase_uid,
        driver_tip: this.state.updatedPlan.payment_summary.driver_tip,
        start_delivery_date: "",
      };
      console.log("(old card) object for change_purchase: ", object);
    } else {
      object = {
        cc_cvv: this.state.deliveryInfo.cc_cvv,
        cc_exp_date: this.state.deliveryInfo.cc_exp_date,
        cc_num: this.state.deliveryInfo.cc_num,
        cc_zip: this.state.deliveryInfo.cc_zip,
        customer_email: this.props.email,
        items: [
          {
            qty: this.props.selectedPlan.num_deliveries.toString(),
            name: this.props.selectedPlan.item_name,
            price: this.props.selectedPlan.item_price.toString(),
            item_uid: this.props.selectedPlan.item_uid,
            itm_business_uid: this.props.selectedPlan.itm_business_uid,
          },
        ],
        purchase_uid: this.state.updatedPlan.raw_data.purchase_uid,
        driver_tip: this.state.updatedPlan.payment_summary.driver_tip,
        start_delivery_date: "",
      };
      console.log("(new card) object for change_purchase: ", object);
    }

    this.setState(
      {
        processingChanges: true,
      },
      () => {
        console.log(
          "===> ID: ",
          JSON.stringify(this.state.updatedPlan.raw_data.purchase_uid)
        );
        console.log("===> change_purchase: ", JSON.stringify(object));
        axios
          // .put(API_URL + "change_purchase", object)
          .put('http://localhost:2000/api/v2/change_purchase', object)
          .then((res) => {
            console.log("change_purchase response: ", res);
            axios
              .get(
                API_URL + "predict_next_billing_date/" + this.state.customerUid
              )
              .then((res) => {
                console.log("(after change) next meal info res: ", res);

                let fetchedSubscriptions = res.data.result;

                this.displayErrorModal(
                  "Success!",
                  `
              OLD MEAL PLAN: ${this.state.currentPlan.meals} meals, ${this.state.currentPlan.deliveries} deliveries
              NEW MEAL PLAN: ${this.state.updatedPlan.meals} meals, ${this.state.updatedPlan.deliveries} deliveries
            `,
                  "OK",
                  "back"
                );

                console.log(
                  "subscriptions loaded? ",
                  this.state.subscriptionsLoaded
                );
                console.log(this.state.defaultSet === false);
                console.log(this.state.refreshingPrice);
                console.log(this.activeChanges());

                this.loadSubscriptions(
                  fetchedSubscriptions,
                  this.state.discounts,
                  UPDATED
                );
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
            if (err.response) {
              console.log("error: " + JSON.stringify(err.response));
            }
          });
      }
    );
  }

  // Change state of new credit card checkbox (not currently used)
  handleCheck = (cb) => {
    console.log("clicked checkbox: ", cb);
    this.setState({
      usePreviousCard: !this.state.usePreviousCard,
    });
  };

  componentDidMount() {
    console.log("(mount) props: ", this.props);

    this.handleResize();
    window.addEventListener("resize", this.handleResize);

    // this.updateView();
    // window.addEventListener("resize", this.updateView);

    let temp_lat;
    let temp_lng;

    if (this.state.latitude == "") {
      temp_lat = 37.3382;
    } else {
      temp_lat = this.state.latitude;
    }

    if (this.state.longitude == "") {
      temp_lng = -121.893028;
    } else {
      temp_lng = this.state.longitude;
    }

    console.log("before var map");

    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: temp_lat, lng: temp_lng },
      zoom: 12,
    });

    let queryString = this.props.location.search;
    let urlParams = new URLSearchParams(queryString);
    // Clear Query parameters
    window.history.pushState({}, document.title, window.location.pathname);

    if (urlParams.has("customer_uid")) {
      let customer_uid = urlParams.get("customer_uid");
      document.cookie = "customer_uid=" + customer_uid;

      console.log("1 edit-plan customerId: ", customer_uid);

      let customerUid = customer_uid;

      axios
        .get(API_URL + "Profile/" + customerUid)
        .then((res) => {
          console.log("fetch profile response: ", res);

          this.setState(
            (prevState) => ({
              customerUid,
              mounted: true,
            }),
            () => {
              this.props.fetchProfileInformation(customerUid);
              this.props.fetchPlans();

              let fetchedDiscounts = null;
              let fetchedSubscriptions = null;

              fetchDiscounts((discounts) => {
                console.log("fetchDiscounts callback: ", discounts);

                fetchedDiscounts = discounts;

                this.setState({
                  discounts: fetchedDiscounts,
                });

                if (fetchedSubscriptions !== null) {
                  console.log("(1) load subscriptions");
                  this.loadSubscriptions(
                    fetchedSubscriptions,
                    fetchedDiscounts,
                    DEFAULT
                  );
                }
              });

              axios
                .get(
                  API_URL +
                    "predict_next_billing_date/" +
                    this.state.customerUid
                )
                .then((res) => {
                  console.log("(1) next meal info res: ", res);

                  fetchedSubscriptions = res.data.result;

                  if (fetchedDiscounts !== null) {
                    console.log("(1) load subscriptions");
                    this.loadSubscriptions(
                      fetchedSubscriptions,
                      fetchedDiscounts,
                      DEFAULT
                    );
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          );
        })
        .catch((err) => {
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
        .some((item) => item.trim().startsWith("customer_uid="))
    ) {
      let customer_uid = document.cookie
        .split("; ")
        .find((item) => item.startsWith("customer_uid="))
        .split("=")[1];

      console.log("2 edit-plan customerId: ", customer_uid);

      let customerUid = customer_uid;

      axios
        .get(API_URL + "Profile/" + customerUid)
        .then((res) => {
          this.setState(
            (prevState) => ({
              customerUid,
              mounted: true,
            }),
            () => {
              this.props.fetchProfileInformation(customerUid);
              this.props.fetchPlans();

              let fetchedDiscounts = null;
              let fetchedSubscriptions = null;

              fetchDiscounts((discounts) => {
                console.log("fetchDiscounts callback: ", discounts);

                fetchedDiscounts = discounts;

                this.setState({
                  discounts: fetchedDiscounts,
                });

                if (fetchedSubscriptions !== null) {
                  console.log("(1) load subscriptions");
                  this.loadSubscriptions(
                    fetchedSubscriptions,
                    fetchedDiscounts,
                    DEFAULT
                  );
                }
              });

              axios
                .get(
                  API_URL +
                    "predict_next_billing_date/" +
                    this.state.customerUid
                )
                .then((res) => {
                  fetchedSubscriptions = res.data.result;

                  if (fetchedDiscounts !== null) {
                    console.log("(2) load subscriptions");
                    this.loadSubscriptions(
                      fetchedSubscriptions,
                      fetchedDiscounts,
                      DEFAULT
                    );
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          );
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          } else {
            console.log(err.toString());
          }
          this.props.history.push("/meal-plan");
        });

      // Not logged in
    } else {
      this.displayErrorModal(
        "Hmm...",
        `
        Please log in to edit your meals.
      `,
        "Go Home",
        "/home"
      );
    }
  }

  confirmDelete = () => {
    console.log("in confirm delete");
    this.displayConfirmation();
  };

  deletePurchase = () => {
    console.log("plan to cancel: ", this.state.updatedPlan);

    this.setState(
      {
        refundAmount: this.state.currentPlan.payment_summary.total,
      },
      () => {
        axios
          .put(`${API_URL}cancel_purchase`, {
            //purchase_uid: this.state.updatedPlan.raw_data.purchase_uid,
            //purchase_uid: this.state.updatedPlan.raw_data.purchase_uid
            purchase_uid: this.state.updatedPlan.raw_data.purchase_uid,
          })
          .then((response) => {
            console.log("cancel_purchase response: ", response);
            console.log(
              "cancel_purchase customerUid: " + this.state.customerUid
            );

            // axios.get(API_URL + 'next_meal_info/' + this.state.customerUid)
            axios
              .get(
                API_URL + "predict_next_billing_date/" + this.state.customerUid
              )
              .then((res) => {
                console.log("(after deletion) next meal info res: ", res);

                let fetchedSubscriptions = res.data.result;

                this.setState({
                  deletingPurchase: false,
                  deleteSuccess: true,
                });

                this.loadSubscriptions(
                  fetchedSubscriptions,
                  this.state.discounts,
                  DEFAULT
                );
              })
              .catch((err) => {
                console.log("refund error: ", err);
                this.setState({
                  deletingPurchase: false,
                  deleteSuccess: false,
                  refundError:
                    err.response.data.message &&
                    typeof err.response.data.message === "string"
                      ? err.response.data.message
                      : "Error attempting to refund subscription",
                });
                console.log(err);
              });
          })
          .catch((err) => {
            console.log("refund error: ", err);
            this.setState({
              deletingPurchase: false,
              deleteSuccess: false,
              refundError:
                err.response.data.message &&
                typeof err.response.data.message === "string"
                  ? err.response.data.message
                  : "Error attempting to refund subscription",
            });
            if (err.response) {
              console.log(err.response);
            }
            console.log(err);
          });
      }
    );
  };

  setDeliveryInfo(plan) {
    let newDeliveryInfo = {
      first_name:
        plan.delivery_first_name === "NULL" ? "" : plan.delivery_first_name,
      last_name:
        plan.delivery_last_name === "NULL" ? "" : plan.delivery_last_name,
      purchase_uid: plan.purchase_uid === "NULL" ? "" : plan.purchase_uid,
      phone: plan.delivery_phone_num === "NULL" ? "" : plan.delivery_phone_num,
      address: plan.delivery_address === "NULL" ? "" : plan.delivery_address,
      unit: plan.delivery_unit === "NULL" ? "" : plan.delivery_unit,
      city: plan.delivery_city === "NULL" ? "" : plan.delivery_city,
      state: plan.delivery_state === "NULL" ? "" : plan.delivery_state,
      zip: plan.delivery_zip === "NULL" ? "" : plan.delivery_zip,
      cc_num: "NULL",
      cc_cvv: "NULL",
      cc_zip: "NULL",
      cc_exp_date: "NULL",
      instructions:
        plan.delivery_isntructions === "NULL" ? "" : plan.delivery_instructions,
    };

    return newDeliveryInfo;
  }

  // Display when initial information has not been loaded on first page render
  hideSubscribedMeals = (config) => {
    // For select meal plan section
    if (config === "plan") {
      return (
        <div
          style={{
            textAlign: "center",
            paddingTop: "80px",
            fontSize: "40px",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          Loading Subscriptions...
        </div>
      );

      // For edit plan section
    } else {
      return (
        <div
          style={{
            textAlign: "center",
            paddingTop: "70px",
            fontSize: "40px",
            fontWeight: "bold",
            width: "100%",
            marginBottom: "100px",
          }}
        >
          Loading Subscriptions...
        </div>
      );
    }
  };

  // Used to render menu at top showing all current meals plans
  showSubscribedMeals = () => {
    let deselectedMealButton = styles.mealButton;
    let selectedMealButton =
      styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];

    this.state.subscriptionsList.forEach((sub) => {
      // console.log("sub id: ", sub.id);
      // console.log("curr id: ", this.state.currentPlan.id);
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
              payment_summary: { ...sub.payment_summary },
              raw_data: { ...sub.raw_data },
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
              payment_summary: { ...sub.payment_summary },
              raw_data: { ...sub.raw_data },
            };

            console.log("(1) before new plan selected");
            console.log("props.plans: ", this.props.plans);
            console.log(
              "new plan selected: ",
              this.props.plans[sub.meals][sub.deliveries]
            );

            let rawData = newCurrentPlan.raw_data;

            console.log("BEFORE SET newDeliveryInfo");
            let newDeliveryInfo = this.setDeliveryInfo(rawData);

            document.getElementById("locality").value = rawData.delivery_city;
            document.getElementById("state").value = rawData.delivery_state;
            document.getElementById("pac-input").value =
              rawData.delivery_address;
            document.getElementById("postcode").value = rawData.delivery_zip;

            fetchAddressCoordinates(
              rawData.delivery_address,
              rawData.delivery_city,
              rawData.delivery_state,
              rawData.delivery_zip,
              (coords) => {
                console.log(
                  "(click) Fetched coordinates: " + JSON.stringify(coords)
                );

                this.setState({
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                });

                const temp_position = {
                  lat: parseFloat(coords.latitude),
                  lng: parseFloat(coords.longitude),
                };

                console.log(temp_position);

                map.setCenter(temp_position);

                if (coords.latitude !== "") {
                  map.setZoom(17);
                  new google.maps.Marker({
                    position: temp_position,
                    map,
                  });
                }
              }
            );

            this.setState(
              (prevState) => ({
                currentPlan: { ...newCurrentPlan },
                updatedPlan: { ...newUpdatedPlan },
                deliveryInfo: { ...newDeliveryInfo },
              }),
              () => {
                this.calculateDifference();
              }
            );
          }}
          tabIndex="0"
          aria-label={
            "Click to select Purchase ID: " +
            sub.id +
            ", " +
            sub.meals +
            "Meals," +
            sub.deliveries +
            "Deliveries"
          }
          title={
            "Click to select Purchase ID: " +
            sub.id +
            ", " +
            sub.meals +
            "Meals," +
            sub.deliveries +
            "Deliveries"
          }
        >
          <div className={styles.mealButtonEdit}></div>
          <div className={styles.mealButtonPlan}>
            {sub.meals} Meals, {sub.deliveries} Deliveries
          </div>
          <div className={styles.mealButtonPlan}>{sub.id}</div>
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

    return <div style={{ width: "100%" }}>{mealButtons}</div>;
  };

  showCardForm = () => {
    return (
      <>
        <div style={{ borderTop: "1px solid" }}>
          <div className={styles.cardLabel}>Enter New Credit Card Details:</div>

          <div className={styles.cardDiv}>
            <input
              type="text"
              maxLength="16"
              placeholder="Card Number"
              className={styles.inputCard}
              value={this.state.deliveryInfo.cc_num}
              onChange={(e) => {
                this.setState((prevState) => ({
                  deliveryInfo: {
                    ...prevState.deliveryInfo,
                    cc_num: e.target.value,
                  },
                }));
              }}
              aria-label="Enter your card number"
              title="Enter your card number"
            />
            <input
              type="text"
              maxLength="5"
              placeholder="MM/YY"
              className={styles.inputCardDate}
              value={this.state.deliveryInfo.cc_exp_date}
              onChange={(e) => {
                this.setState((prevState) => ({
                  deliveryInfo: {
                    ...prevState.deliveryInfo,
                    cc_exp_date: e.target.value,
                  },
                }));
              }}
              aria-label="Enter your card expiration date"
              title="Enter your card expiration date"
            />
            <input
              type="text"
              maxLength="3"
              placeholder="CVV"
              className={styles.inputCardCvv}
              value={this.state.deliveryInfo.cc_cvv}
              onChange={(e) => {
                this.setState((prevState) => ({
                  deliveryInfo: {
                    ...prevState.deliveryInfo,
                    cc_cvv: e.target.value,
                  },
                }));
              }}
              aria-label="Enter your card's cvv"
              title="Enter your card's cvv"
            />
            <input
              type="text"
              maxLength="5"
              placeholder="ZIP"
              className={styles.inputCardZip}
              value={this.state.deliveryInfo.cc_zip}
              onChange={(e) => {
                this.setState((prevState) => ({
                  deliveryInfo: {
                    ...prevState.deliveryInfo,
                    cc_zip: e.target.value,
                  },
                }));
              }}
              aria-label="Enter your zip"
              title="Enter your zip"
            />
          </div>
        </div>
      </>
    );
  };

  // Used to render everything in "Plan Details" section
  // showPlanDetails = (width) => {
  //   let ariaTag = "Your current meal plan currently contains "+ this.state.currentPlan.meals + " meals per delivery and" + this.state.currentPlan.deliveries + " deliveries"
  //   if(width < 800) {
  //     return (
  //       <div style={{display: 'flex'}}>
  //       <div style={{display: 'inline-block'}}>
  //         <div className={styles.boxPDnarrowTop}>

  //           <div className={styles.planHeader}>
  //             Current Plan
  //           </div>

  //           <div style={{paddingBottom: '50px'}}>
  //             <div style={{paddingBottom: '10px'}}>
  //               MEALS
  //             </div>
  //             <div className={styles.iconMeals}>
  //               {this.state.currentPlan.meals}
  //             </div>
  //           </div>

  //           <div style={{paddingBottom: '50px'}}>
  //             <div style={{paddingBottom: '10px'}}>
  //               DELIVERIES
  //             </div>
  //             <button className={styles.deliveryButtonCurrent} aria-label={ariaTag} title={ariaTag}>
  //               <span style={{fontSize: '35px'}}>
  //                 {this.state.currentPlan.deliveries}
  //               </span>
  //               <br></br>
  //               <span style={{whiteSpace: "nowrap"}}>
  //                 {"(Save "+this.state.currentPlan.discount+"%)"}
  //               </span>
  //             </button>
  //           </div>

  //           <div>
  //             <div style={{paddingBottom: '10px'}}>
  //               CANCEL
  //             </div>
  //             <div
  //               className={styles.iconTrash}
  //               onClick={() => {
  //                 // this.deletePurchase();
  //                 this.confirmDelete();
  //               }}
  //               tabIndex="0"
  //               aria-label="Click here to cancel this meal plan"
  //               title="Click here to cancel this meal plan"
  //             />
  //           </div>

  //         </div>

  //         <div className={styles.boxPDnarrowBottom}>

  //           <div className={styles.planHeader}>
  //             Updated Plan
  //           </div>

  //           <div className={styles.menuSection}>
  //             <div className={styles.center}>
  //               <span className={styles.subHeader}>
  //                 NUMBER OF MEALS PER DELIVERY
  //               </span>
  //             </div>
  //             {(()=>{
  //               if(JSON.stringify(this.props.plans) !== "{}"){
  //                 return(
  //                   <div className={styles.buttonWrapper}>
  //                     {this.mealsDelivery()}
  //                   </div>
  //                 );
  //               }
  //             })()}
  //           </div>

  //           <div className={styles.menuSection}>
  //             <div className={styles.center}>
  //               <span className={styles.subHeader}>
  //                 TOTAL NUMBER OF DELIVERIES
  //               </span>
  //             </div>
  //             {(()=>{
  //               if(JSON.stringify(this.props.plans) !== "{}"){
  //                 return(
  //                   <div
  //                     className='row'
  //                     style={{
  //                       marginTop: '20px',
  //                       marginBottom: '30px',
  //                     }}
  //                   >
  //                     {/* <div
  //                       style={{
  //                         width: 'auto',
  //                         flex: '0 0 auto'
  //                       }}
  //                     > */}
  //                       {this.paymentFrequency()}
  //                     {/* </div> */}
  //                   </div>
  //                 );
  //               }
  //             })()}
  //           </div>

  //           <div className={styles.chargeContainerNarrow}>
  //             <div className={styles.chargeTotal}>
  //               <div style={{display: 'inline-flex'}} >
  //                 {(() => {
  //                   let chargeOrRefund = this.state.differenceSummary.total;
  //                   if (parseFloat(chargeOrRefund) >= 0) {
  //                     return (
  //                       <>
  //                         <div className={styles.chargeText}>
  //                           {"Additional Charges "}
  //                         </div>
  //                         <div className={styles.chargeAmount}>
  //                           ${this.state.differenceSummary.total}
  //                         </div>
  //                       </>
  //                     );
  //                   } else {
  //                     return (
  //                       <>
  //                         <div className={styles.chargeText}>
  //                           {"You will be refunded "}
  //                         </div>
  //                         <div className={styles.chargeAmount}>
  //                           ${(-1*this.state.differenceSummary.total).toFixed(2)}
  //                         </div>
  //                       </>
  //                     );
  //                   }
  //                 })()}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <>
  //         <div className={styles.boxPDleft}>

  //         <div style={{width: 'fit-content'}}>
  //           <div className={styles.planHeader}>
  //             Current Plan
  //           </div>

  //           <div style={{paddingBottom: '50px'}}>
  //             <div style={{paddingBottom: '10px'}}>
  //               MEALS
  //             </div>
  //             <div className={styles.iconMeals}>
  //               {this.state.currentPlan.meals}
  //             </div>
  //           </div>

  //           <div style={{paddingBottom: '50px'}}>
  //             <div style={{paddingBottom: '10px'}}>
  //               DELIVERIES
  //             </div>
  //             <button className={styles.deliveryButtonCurrent} aria-label={ariaTag} title={ariaTag}>
  //               <span style={{fontSize: '35px'}}>
  //                 {this.state.currentPlan.deliveries}
  //               </span>
  //               <br></br>
  //               <span style={{whiteSpace: "nowrap"}}>
  //                 {"(Save "+this.state.currentPlan.discount+"%)"}
  //               </span>
  //             </button>
  //           </div>

  //           <div>
  //             <div style={{paddingBottom: '10px'}}>
  //               CANCEL
  //             </div>
  //             <div
  //               className={styles.iconTrash}
  //               onClick={() => {
  //                 // this.deletePurchase();
  //                 this.confirmDelete();
  //               }}
  //               tabIndex="0"
  //               aria-label="Click here to cancel this meal plan"
  //               title="Click here to cancel this meal plan"
  //             />
  //           </div>

  //             </div>

  //         </div>

  //         <div className={styles.boxPDright}>

  //           <div className={styles.planHeader}>
  //             Updated Plan
  //           </div>

  //           <div className={styles.menuSection}>
  //             <div className={styles.center}>
  //               <span className={styles.subHeader}>
  //                 NUMBER OF MEALS PER DELIVERY
  //               </span>
  //             </div>
  //             {(()=>{
  //               if(JSON.stringify(this.props.plans) !== "{}"){
  //                 return(
  //                   <div className={styles.buttonWrapper}>
  //                     {this.mealsDelivery()}
  //                   </div>
  //                 );
  //               }
  //             })()}
  //           </div>

  //           <div className={styles.menuSection}>
  //             <div className={styles.center}>
  //               <span className={styles.subHeader}>
  //                 TOTAL NUMBER OF DELIVERIES
  //               </span>
  //             </div>
  //             {(()=>{
  //               if(JSON.stringify(this.props.plans) !== "{}"){
  //                 return(
  //                   <div className='row' style={{marginTop: '20px'}}>
  //                     {this.paymentFrequency()}
  //                   </div>
  //                 );
  //               }
  //             })()}
  //           </div>

  //           <div className={styles.chargeContainer}>
  //             <div className={styles.chargeTotal}>
  //               <div style={{display: 'inline-flex'}} tabIndex="0" >
  //                 {(() => {
  //                   let chargeOrRefund = this.state.differenceSummary.total;
  //                   if (parseFloat(chargeOrRefund) >= 0) {
  //                     return (
  //                       <>
  //                         <div className={styles.chargeText}>
  //                           {"Additional Charges "}
  //                         </div>
  //                         <div className={styles.chargeAmount}>
  //                           ${this.state.differenceSummary.total}
  //                         </div>
  //                       </>
  //                     );
  //                   } else {
  //                     return (
  //                       <>
  //                         <div className={styles.chargeText}>
  //                           {"You will be refunded "}
  //                         </div>
  //                         <div className={styles.chargeAmount}>
  //                           ${(-1*this.state.differenceSummary.total).toFixed(2)}
  //                         </div>
  //                       </>
  //                     );
  //                   }
  //                 })()}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </>
  //     );
  //   }
  // }
  showPlanDetails = (width) => {
    let ariaTag =
      "Your current meal plan currently contains " +
      this.state.currentPlan.meals +
      " meals per delivery and" +
      this.state.currentPlan.deliveries +
      " deliveries";
    if (width < 800) {
      return (
        <div style={{ display: "flex" }}>
          <div style={{ display: "inline-block" }}>
            <div className={styles.boxPDnarrowTop}>
              <div className={styles_admin.planHeader}>Current Plan</div>

              <div style={{ paddingBottom: "50px" }}>
                <span className={styles_admin.subHeader2}>MEALS</span>
                <div className={styles_admin.plateButtonWrapper2}>
                  <button
                    className={styles_admin.plateButtonCurrent}
                    // aria-label={"Click to switch to " +mealIndex+ " meals per delivery for $" + singleMealData.item_price}
                    // title={"Click to switch to " +mealIndex+ " meals per delivery for $" + singleMealData.item_price}
                  >
                    {this.state.currentPlan.meals}
                  </button>
                </div>
              </div>

              <div style={{ paddingBottom: "50px" }}>
                <span className={styles_admin.subHeader2}>DELIVERIES</span>
                <div className={styles_admin.plateButtonWrapper2}>
                  <button className={styles_admin.deliveryButtonCurrent}>
                    <span style={{ fontSize: "2em" }}>
                      {this.state.currentPlan.deliveries}
                    </span>
                    <br />
                    {(() => {
                      if (
                        typeof this.state.currentPlan.discount !==
                          "undefined" &&
                        this.state.currentPlan.discount > 0
                      ) {
                        return (
                          <span
                            style={{
                              fontSize: "0.8em",
                            }}
                          >
                            (Save {this.state.currentPlan.discount}%)
                          </span>
                        );
                      }
                    })()}
                  </button>
                </div>
              </div>

              <div>
                <span className={styles_admin.subHeader2}>CANCEL</span>
                <div className={styles_admin.plateButtonWrapper3}>
                  <div
                    className={styles.iconTrash}
                    onClick={() => {
                      this.confirmDelete();
                    }}
                    tabIndex="0"
                    aria-label="Click here to cancel this meal plan"
                    title="Click here to cancel this meal plan"
                  />
                </div>
              </div>
            </div>

            <div className={styles.boxPDnarrowBottom}>
              <div className={styles_admin.planHeader}>Updated Plan</div>

              <div className={styles.menuSection}>
                <div className={styles.center}>
                  <span className={styles.subHeader}>
                    NUMBER OF MEALS PER DELIVERY
                  </span>
                </div>
                {(() => {
                  if (JSON.stringify(this.props.plans) !== "{}") {
                    return (
                      <div className={styles_admin.buttonWrapper}>
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
                {(() => {
                  if (JSON.stringify(this.props.plans) !== "{}") {
                    return (
                      <div
                        className="row"
                        style={{
                          marginTop: "20px",
                          marginBottom: "30px",
                        }}
                        // style={{
                        //   margin: 'auto',
                        //   // display: 'flex',
                        //   verticalAlign: 'middle',
                        //   border: '1px purple solid',
                        //   float: 'center'
                        // }}
                      >
                        {this.paymentFrequency()}
                      </div>
                    );
                  }
                })()}
              </div>

              <div
                style={{
                  width: "100%",
                  // border: 'dashed',
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div className={styles_admin.chargeContainer} tabIndex="0">
                  {(() => {
                    let chargeOrRefund = this.state.differenceSummary.total;
                    if (parseFloat(chargeOrRefund) >= 0) {
                      return (
                        <>
                          <div className={styles_admin.chargeText}>
                            {"Additional Charges "}
                          </div>
                          <div className={styles_admin.chargeAmount}>
                            ${this.state.differenceSummary.total}
                          </div>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <div className={styles_admin.chargeText}>
                            {"You will be refunded "}
                          </div>
                          <div className={styles_admin.chargeAmount}>
                            $
                            {(-1 * this.state.differenceSummary.total).toFixed(
                              2
                            )}
                          </div>
                        </>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className={styles_admin.boxPDleft}>
            <div>
              <div className={styles_admin.planHeader}>Current Plan</div>

              <div style={{ paddingBottom: "50px" }}>
                <span className={styles_admin.subHeader2}>MEALS</span>
                <div className={styles_admin.plateButtonWrapper2}>
                  <button
                    className={styles_admin.plateButtonCurrent}
                    // aria-label={"Click to switch to " +mealIndex+ " meals per delivery for $" + singleMealData.item_price}
                    // title={"Click to switch to " +mealIndex+ " meals per delivery for $" + singleMealData.item_price}
                  >
                    {this.state.currentPlan.meals}
                  </button>
                </div>
              </div>

              <div style={{ paddingBottom: "50px" }}>
                <span className={styles_admin.subHeader2}>DELIVERIES</span>

                <div className={styles_admin.plateButtonWrapper2}>
                  <button className={styles_admin.deliveryButtonCurrent}>
                    <span style={{ fontSize: "2em" }}>
                      {this.state.currentPlan.deliveries}
                    </span>
                    <br />
                    {(() => {
                      if (
                        typeof this.state.currentPlan.discount !==
                          "undefined" &&
                        this.state.currentPlan.discount > 0
                      ) {
                        return (
                          <span
                            style={{
                              fontSize: "0.8em",
                            }}
                          >
                            (Save {this.state.currentPlan.discount}%)
                          </span>
                        );
                      }
                    })()}
                  </button>
                </div>
              </div>

              <div>
                <span className={styles_admin.subHeader2}>CANCEL</span>
                {/* <div 
                className={styles.iconTrash}
                onClick={() => {
                  // this.deletePurchase();
                  this.confirmDelete();
                }}
                tabIndex="0"
                aria-label="Click here to cancel this meal plan"
                title="Click here to cancel this meal plan"
              /> */}
                <div className={styles_admin.plateButtonWrapper3}>
                  <div
                    className={styles.iconTrash}
                    onClick={() => {
                      this.confirmDelete();
                    }}
                    tabIndex="0"
                    aria-label="Click here to cancel this meal plan"
                    title="Click here to cancel this meal plan"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.boxPDright}>
            <div className={styles_admin.planHeader}>Updated Plan</div>

            <div className={styles_admin.menuSection}>
              <span className={styles.subHeader}>
                NUMBER OF MEALS PER DELIVERY
              </span>
              {(() => {
                if (JSON.stringify(this.props.plans) !== "{}") {
                  return (
                    <div className={styles_admin.buttonWrapper}>
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
              {(() => {
                if (JSON.stringify(this.props.plans) !== "{}") {
                  return (
                    <div
                      className={styles_admin.buttonWrapper}
                      style={{
                        marginBottom: "50px",
                      }}
                    >
                      {this.paymentFrequency()}
                    </div>
                  );
                }
              })()}
            </div>

            <div className={styles_admin.chargeContainer} tabIndex="0">
              {(() => {
                let chargeOrRefund = this.state.differenceSummary.total;
                if (parseFloat(chargeOrRefund) >= 0) {
                  return (
                    <>
                      <div className={styles_admin.chargeText}>
                        {"Additional Charges "}
                      </div>
                      <div className={styles_admin.chargeAmount}>
                        ${this.state.differenceSummary.total}
                      </div>
                    </>
                  );
                } else {
                  return (
                    <>
                      <div className={styles_admin.chargeText}>
                        {"You will be refunded "}
                      </div>
                      <div className={styles_admin.chargeAmount}>
                        ${(-1 * this.state.differenceSummary.total).toFixed(2)}
                      </div>
                    </>
                  );
                }
              })()}
            </div>
          </div>
        </>
      );
    }
  };

  // Update user information specified for current delivery.
  saveEdits = () => {
    console.log("saving edits...");

    let object = { ...this.state.deliveryInfo };

    // Deleting since instructions field does not currently exist in endpoint
    delete object["instructions"];

    object["email"] = this.props.email;

    let city = document.getElementById("locality").value;
    let state = document.getElementById("state").value;
    let address = document.getElementById("pac-input").value;
    let zip = document.getElementById("postcode").value;

    console.log("2 pac-input: ", document.getElementById("pac-input").value);

    console.log("actual edits to save: ", {
      first_name: object.first_name,
      last_name: object.last_name,
      purchase_uid: object.purchase_uid,
      phone: object.phone,
      address,
      unit: object.unit,
      city,
      state,
      zip,
      email: object.email,
    });

    axios
      .post(API_URL + "Update_Delivery_Info_Address", {
        first_name: object.first_name,
        last_name: object.last_name,
        purchase_uid: object.purchase_uid,
        phone: object.phone,
        address,
        unit: object.unit,
        city,
        state,
        zip,
        email: object.email,
      })
      .then((res) => {
        console.log("update delivery info res: ", res);

        axios
          .get(API_URL + "predict_next_billing_date/" + this.state.customerUid)
          .then((res) => {
            console.log("(after change) next meal info res: ", res);

            let fetchedSubscriptions = res.data.result;

            this.loadSubscriptions(
              fetchedSubscriptions,
              this.state.discounts,
              CURRENT
            );
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log("error happened while updating delivery info", err);
        if (err.response) {
          console.log("err.response: " + JSON.stringify(err.response));
        }
      });
  };

  // Called when tip is changed
  changeTip(newTip) {
    this.setState(
      (prevState) => ({
        updatedPlan: {
          ...prevState.updatedPlan,
          payment_summary: {
            ...prevState.updatedPlan.payment_summary,
            driver_tip: newTip,
          },
        },
      }),
      () => {
        this.changePlans(
          this.state.updatedPlan.meals,
          this.state.updatedPlan.deliveries
        );
        this.calculateDifference();
      }
    );
  }

  // Used to determine if buttons and payment information should be
  // grayed out/disabled due to lack of edits.
  activeChanges = () => {
    let updatedSummary = this.state.updatedPlan.payment_summary;
    let currentSummary = this.state.currentPlan.payment_summary;

    if (
      updatedSummary.base_amount === currentSummary.base_amount &&
      updatedSummary.discount_amount === currentSummary.discount_amount &&
      updatedSummary.delivery_fee === currentSummary.delivery_fee &&
      updatedSummary.service_fee === currentSummary.service_fee &&
      updatedSummary.driver_tip === currentSummary.driver_tip &&
      updatedSummary.ambassador_discount ===
        currentSummary.ambassador_discount &&
      updatedSummary.subtotal === currentSummary.subtotal &&
      updatedSummary.total === currentSummary.total &&
      updatedSummary.taxes === currentSummary.taxes
    ) {
      return false;
    }
    return true;
  };

  // Call to render buttons for changing number of meals in updated plan
  // mealsDelivery = () => {

  //   let deselectedPlateButton = styles.plateButton;
  //   let selectedPlateButton =
  //   styles.plateButton + " " + styles.plateButtonSelected;
  //   let plateButtons = [];
  //   let singleMealData;

  //   let mealPlans = this.props.plans;

  //   for (const [mealIndex, mealData] of Object.entries(mealPlans)) {

  //     singleMealData = mealData["1"];

  //     plateButtons.push(
  //       <div className={styles.plateButtonWrapper} >
  //       <button
  //         key={mealIndex}
  //         className={
  //           this.state.updatedPlan.meals === mealIndex
  //             ? selectedPlateButton
  //             : deselectedPlateButton
  //         }
  //         onClick={() => {

  //           this.props.chooseMealsDelivery(
  //             mealIndex,
  //             this.state.updatedPlan.deliveries,
  //             this.props.plans
  //           );

  //           this.changePlans(mealIndex, this.state.updatedPlan.deliveries);
  //         }}
  //         aria-label={"Click to switch to " +mealIndex+ " meals per delivery for $" + singleMealData.item_price}
  //         title={"Click to switch to " +mealIndex+ " meals per delivery for $" + singleMealData.item_price}
  //       >
  //         {mealIndex}
  //       </button>
  //         <div style={{textAlign: 'center', marginTop: '10px'}}>
  //           ${singleMealData.item_price}
  //         </div>
  //       </div>
  //     );
  //   }
  //   return plateButtons;
  // };
  mealsDelivery = () => {
    let deselectedPlateButton = styles_admin.plateButton;
    let selectedPlateButton =
      styles_admin.plateButton + " " + styles_admin.plateButtonSelected;
    let plateButtons = [];
    let singleMealData;

    let mealPlans = this.props.plans;

    for (const [mealIndex, mealData] of Object.entries(mealPlans)) {
      singleMealData = mealData["1"];

      plateButtons.push(
        <div>
          <div className={styles_admin.plateButtonWrapper}>
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
              aria-label={
                "Click to switch to " +
                mealIndex +
                " meals per delivery for $" +
                singleMealData.item_price
              }
              title={
                "Click to switch to " +
                mealIndex +
                " meals per delivery for $" +
                singleMealData.item_price
              }
            >
              {mealIndex}
            </button>
          </div>
          <div
            style={{
              textAlign: "center",
              // marginTop: '10px',
              // border: '1px solid violet'
            }}
          >
            ${singleMealData.item_price}
          </div>
        </div>
      );
    }
    return plateButtons;
  };

  // Call to render buttons for changing number of deliveries in updated plan
  // paymentFrequency = () => {
  //   let deselectedPaymentOption = styles.deliveryButton;
  //   let selectedPaymentOption = styles.deliveryButton + " " + styles.deliveryButtonSelected;
  //   let paymentOptionButtons = [];

  //   var deliveryPlans = this.props.plans[2];
  //   var discount = null;

  //   for (const [deliveryIndex, deliveryData] of Object.entries(deliveryPlans)) {

  //     let discountItem = this.state.discounts.filter( function(e) {
  //       return e.deliveries === deliveryIndex;
  //     });

  //     discount = discountItem[0].discount;

  //     let ariaTag = ""

  //     if (deliveryIndex == 1) {
  //       ariaTag = "click here to switch to " + deliveryIndex + " delivery"
  //     } else {
  //       ariaTag = "click here to switch to " + deliveryIndex + " deliveries and save " +discount+"%"
  //     }

  //     paymentOptionButtons.push(
  //       <div className={styles.sameLine} key={deliveryIndex}>
  //         <div style={{display: 'inline-block'}}>
  //           <button
  //             className={
  //               this.state.updatedPlan.deliveries === deliveryIndex
  //                 ? selectedPaymentOption
  //                 : deselectedPaymentOption
  //             }
  //             onClick={() => {
  //               this.props.choosePaymentOption(
  //                 deliveryIndex,
  //                 this.state.updatedPlan.meals,
  //                 this.props.plans
  //               )

  //               this.changePlans(this.state.updatedPlan.meals, deliveryIndex);
  //             }}
  //             aria-label={ariaTag}
  //             title={ariaTag}
  //           >
  //           <span style={{fontSize: '35px'}}>
  //             {deliveryIndex}
  //           </span>
  //           <br></br>
  //           {(() => {
  //             if (typeof(discount) !== "undefined" && discount > 0) {
  //               return (
  //                 <span>(Save {discount}%)</span>
  //               );
  //             }
  //           })()}
  //           </button>
  //         </div>
  //       </div>
  //     );
  //   }
  //   return paymentOptionButtons;
  // };
  paymentFrequency = () => {
    let deselectedPaymentOption = styles_admin.deliveryButton;
    let selectedPaymentOption =
      styles_admin.deliveryButton + " " + styles_admin.deliveryButtonSelected;
    let paymentOptionButtons = [];

    var deliveryPlans = this.props.plans[2];
    var discount = null;

    for (const [deliveryIndex, deliveryData] of Object.entries(deliveryPlans)) {
      let discountItem = this.state.discounts.filter(function (e) {
        return e.deliveries === deliveryIndex;
      });

      discount = discountItem[0].discount;

      let ariaTag = "";

      if (deliveryIndex == 1) {
        ariaTag = "click here to switch to " + deliveryIndex + " delivery";
      } else {
        ariaTag =
          "click here to switch to " +
          deliveryIndex +
          " deliveries and save " +
          discount +
          "%";
      }

      paymentOptionButtons.push(
        <div className={styles_admin.sameLine} key={deliveryIndex}>
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
              );
              this.changePlans(this.state.updatedPlan.meals, deliveryIndex);
            }}
            aria-label={ariaTag}
            title={ariaTag}
          >
            <span style={{ fontSize: "2em" }}>{deliveryIndex}</span>
            <br />
            {(() => {
              if (typeof discount !== "undefined" && discount > 0) {
                return (
                  <span
                    style={{
                      fontSize: "0.8em",
                    }}
                  >
                    (Save {discount}%)
                  </span>
                );
              }
            })()}
          </button>
        </div>
      );
    }
    return paymentOptionButtons;
  };

  render() {
    // const narrowView = this.state.narrowView;

    return (
      <>
        {/* For debugging window size */}
        {/* <span 
          style={{
            zIndex: '101',
            position: 'fixed',
            backgroundColor: 'white',
            border: 'solid',
            borderWidth: '1px',
            borderColor: 'red',
            width: '150px'
          }}
        >
          Height: {this.state.windowHeight}px
          <br />
          Width: {this.state.windowWidth}px
        </span> */}

        <WebNavBar
          poplogin={this.togglePopLogin}
          popSignup={this.togglePopSignup}
        />

        {this.state.login_seen ? (
          <PopLogin toggle={this.togglePopLogin} />
        ) : null}
        {this.state.signUpSeen ? (
          <Popsignup toggle={this.togglePopSignup} />
        ) : null}

        <div className={styles.sectionHeaderScroll}>Select Meal Plan</div>

        <div className={styles.containerSplit}>
          <div className={styles.boxScroll}>
            <div className={styles.mealButtonHeader}>
              <div className={styles.mealButtonEdit}></div>
              <div
                className={styles.mealButtonPlan}
                style={{ fontWeight: "bold", fontSize: "20px" }}
              >
                Meal Plans
              </div>
              <div
                className={styles.mealButtonSection}
                style={{ fontWeight: "bold", fontSize: "20px" }}
              >
                Purchase ID
              </div>
              <div
                className={styles.mealButtonSection}
                style={{ fontWeight: "bold", fontSize: "20px" }}
              >
                Next Delivery Date
              </div>
              <div
                className={styles.mealButtonSection}
                style={{ fontWeight: "bold", fontSize: "20px" }}
              >
                Next Delivery Status
              </div>
              <div
                className={styles.mealButtonSection}
                style={{ fontWeight: "bold", fontSize: "20px" }}
              >
                Next Billing Date
              </div>
              <div
                className={styles.mealButtonSection}
                style={{ fontWeight: "bold", fontSize: "20px" }}
              >
                Next Billing Amount
              </div>
            </div>
            <div style={{ display: "flex" }}>
              {
                this.state.subscriptionsLoaded === true &&
                typeof this.props.plans !== "undefined" ? (
                  this.showSubscribedMeals()
                ) : (
                  <div
                    style={{
                      color: "red",
                      zIndex: "99",
                      height: "100vh",
                      width: "100vw",
                      // height: '50vh',
                      // width: '50vw',
                      // border: 'inset',
                      position: "fixed",
                      top: "0",
                      backgroundColor: "#F7F4E5",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img src={m4me_logo} />
                  </div>
                )
                // : this.hideSubscribedMeals('plan')}
              }
            </div>
          </div>
        </div>

        <div className={styles.sectionHeaderUL}>Edit Plan</div>

        <div className={styles.containerSplit}>
          {
            this.state.subscriptionsLoaded === true ? (
              this.showPlanDetails(this.state.windowWidth)
            ) : (
              <div
                style={{
                  color: "red",
                  zIndex: "99",
                  height: "100vh",
                  width: "100vw",
                  // height: '50vh',
                  // width: '50vw',
                  // border: 'inset',
                  position: "fixed",
                  top: "0",
                  backgroundColor: "#F7F4E5",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={m4me_logo} />
              </div>
            )
            // : this.hideSubscribedMeals('delivery_details')}
          }
        </div>

        {/* {narrowView ? ( */}
        {this.state.windowWidth < 800 ? (
          <>
            <div className={styles.sectionHeader}>Edit Delivery Details</div>
          </>
        ) : (
          <>
            <div style={{ display: "flex" }}>
              <div className={styles.sectionHeaderLeft}>
                Edit Delivery Details
              </div>
              <div className={styles.sectionHeaderRight}>Payment Summary</div>
            </div>
          </>
        )}

        <div className={styles.containerSplit}>
          <div
            style={
              // narrowView
              this.state.windowWidth < 800
                ? {
                    display: "inline-block",
                    // border: 'solid',
                    // borderColor: 'red',
                    width: "100%",
                  }
                : {
                    display: "inline-flex",
                    // border: 'solid',
                    // borderColor: 'red',
                    width: "100%",
                  }
            }
          >
            <div
              style={
                // narrowView
                this.state.windowWidth < 800
                  ? {
                      display: "inline-block",
                      marginLeft: "8%",
                      width: "84%",
                      marginRight: "8%",
                      // border: 'solid'
                    }
                  : {
                      display: "inline-block",
                      marginLeft: "8%",
                      width: "40%",
                      marginRight: "2%",
                      // border: 'solid'
                    }
              }
            >
              <div style={{ display: "flex" }}>
                <input
                  type="text"
                  placeholder="First Name"
                  className={styles.inputContactLeft}
                  value={this.state.deliveryInfo.first_name}
                  onChange={(e) => {
                    this.setState((prevState) => ({
                      deliveryInfo: {
                        ...prevState.deliveryInfo,
                        first_name: e.target.value,
                      },
                    }));
                  }}
                  aria-label="Confirm your first name"
                  title="Confirm your first name"
                />

                <input
                  type="text"
                  placeholder="Last Name"
                  className={styles.inputContactRight}
                  value={this.state.deliveryInfo.last_name}
                  onChange={(e) => {
                    this.setState((prevState) => ({
                      deliveryInfo: {
                        ...prevState.deliveryInfo,
                        last_name: e.target.value,
                      },
                    }));
                  }}
                  aria-label="Confirm your last name"
                  title="Confirm your last name"
                />
              </div>

              <input
                type="text"
                placeholder="Email"
                className={styles.input}
                value={this.props.email}
                aria-label="Confirn your email"
                title="Confirn your email"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className={styles.input}
                value={this.state.deliveryInfo.phone}
                onChange={(e) => {
                  this.setState((prevState) => ({
                    deliveryInfo: {
                      ...prevState.deliveryInfo,
                      phone: e.target.value,
                    },
                  }));
                }}
                aria-label="Confirm your phone number"
                title="Confirm your phone number"
              />

              <input
                type="text"
                placeholder={"Address 1"}
                className={styles.input}
                id="pac-input"
                name="pac-input"
                aria-label="Confirm your address"
                title="Confirm your address"
              />

              <div style={{ display: "flex" }}>
                <input
                  type="text"
                  placeholder={"Unit"}
                  className={styles.inputContactLeft}
                  value={this.state.deliveryInfo.unit}
                  onChange={(e) => {
                    this.setState((prevState) => ({
                      deliveryInfo: {
                        ...prevState.deliveryInfo,
                        unit: e.target.value,
                      },
                    }));
                  }}
                  aria-label="Confirm your unit"
                  title="Confirm your unit"
                />

                <input
                  type="text"
                  placeholder={"City"}
                  id="locality"
                  name="locality"
                  className={styles.inputContactRight}
                  aria-label="Confirm your city"
                  title="Confirm your city"
                />
              </div>

              <div style={{ display: "flex" }}>
                <input
                  type="text"
                  placeholder={"State"}
                  className={styles.inputContactLeft}
                  id="state"
                  name="state"
                  aria-label="Confirm your state"
                  title="Confirm your state"
                />
                <input
                  type="text"
                  placeholder={"Zip Code"}
                  className={styles.inputContactRight}
                  id="postcode"
                  name="postcode"
                  aria-label="Confirm your zip code"
                  title="Confirm your zip code"
                />
              </div>

              <input
                type={"text"}
                placeholder={"Delivery Instructions"}
                className={styles.input}
                value={this.state.deliveryInfo.instructions}
                onChange={(e) => {
                  this.setState((prevState) => ({
                    deliveryInfo: {
                      ...prevState.deliveryInfo,
                      instructions: e.target.value,
                    },
                  }));
                }}
                aria-label="Confirm your delivery instructions"
                title="Confirm your delivery instructions"
              />

              <div className={styles.googleMap} id="map" />

              <div style={{ textAlign: "center" }}>
                <button
                  className={styles.orangeBtn}
                  disabled={!this.state.subscriptionsLoaded}
                  onClick={() => this.saveEdits()}
                  aria-label="Click to save delivery changes"
                  title="Click to save delivery changes"
                >
                  Save
                </button>
              </div>
            </div>

            {/* {narrowView ? ( */}
            {this.state.windowWidth < 800 ? (
              <>
                <div style={{ marginTop: "20px" }} />
                <div className={styles.sectionHeader}>Payment Summary</div>
              </>
            ) : null}

            {/* {narrowView ? (
            <>
              <div className={styles.sectionHeader}>
                Edit Delivery Details
              </div>
            </>
          ) : (
            <>
              <div style={{display: 'flex'}}>
                <div className={styles.sectionHeaderLeft}>
                  Edit Delivery Details
                </div>
                <div className={styles.sectionHeaderRight}>
                  Payment Summary
                </div>
              </div>
            </>
          )} */}

            <div
              //   style={{
              //     visibility: 'visible',
              //     width:'40%',
              //     marginRight: '8%',
              //     marginLeft: '2%',
              //     border: 'solid'
              //   }}
              // >

              style={
                // narrowView
                this.state.windowWidth < 800
                  ? {
                      display: "inline-block",
                      marginLeft: "8%",
                      width: "84%",
                      marginRight: "8%",
                      // border: 'solid'
                    }
                  : {
                      display: "inline-block",
                      marginLeft: "8%",
                      width: "40%",
                      marginRight: "2%",
                      // border: 'solid'
                    }
              }
            >
              <div style={{ display: "flex", borderBottom: "solid 2px black" }}>
                <div
                  className={styles.summaryLeft}
                  style={{ fontWeight: "bold" }}
                ></div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  {this.state.updatedPlan.meals} Meals,{" "}
                  {this.state.updatedPlan.deliveries} Deliveries
                </div>

                <div className={styles.summaryRight}>Current</div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  Difference
                </div>
              </div>
              <div style={{ display: "flex", borderBottom: "1px solid" }}>
                <div className={styles.summaryLeft}>Meal Subscription</div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  ${this.state.updatedPlan.payment_summary.base_amount}
                </div>

                <div className={styles.summaryRight}>
                  ${this.state.currentPlan.payment_summary.base_amount}
                </div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  $
                  {Math.abs(this.state.differenceSummary.base_amount).toFixed(
                    2
                  )}
                </div>
              </div>

              <div style={{ display: "flex", borderBottom: "1px solid" }}>
                <div className={styles.summaryLeft}>Discount</div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  {"-$" +
                    this.state.updatedPlan.payment_summary.discount_amount}
                  <br />
                  {"(" +
                    this.state.updatedPlan.payment_summary.discount_rate +
                    "%)"}
                </div>

                <div className={styles.summaryRight}>
                  {"-$" +
                    this.state.currentPlan.payment_summary.discount_amount}
                  <br />
                  {"(" +
                    this.state.currentPlan.payment_summary.discount_rate +
                    "%)"}
                </div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  {"$" +
                    Math.abs(
                      this.state.differenceSummary.discount_amount
                    ).toFixed(2)}
                  <br />
                  {"(" +
                    Math.abs(this.state.differenceSummary.discount_rate) +
                    "%)"}
                </div>
              </div>

              <div style={{ display: "flex", borderBottom: "1px solid" }}>
                <div className={styles.summaryLeft}>Delivery Fee</div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  ${this.state.updatedPlan.payment_summary.delivery_fee}
                </div>

                <div className={styles.summaryRight}>
                  ${this.state.currentPlan.payment_summary.delivery_fee}
                </div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  $
                  {Math.abs(this.state.differenceSummary.delivery_fee).toFixed(
                    2
                  )}
                </div>
              </div>

              <div style={{ display: "flex", borderBottom: "1px solid" }}>
                <div className={styles.summaryLeft}>Service Fee</div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  ${this.state.updatedPlan.payment_summary.service_fee}
                </div>

                <div className={styles.summaryRight}>
                  ${this.state.currentPlan.payment_summary.service_fee}
                </div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  $
                  {Math.abs(this.state.differenceSummary.service_fee).toFixed(
                    2
                  )}
                </div>
              </div>

              <div style={{ display: "flex", borderBottom: "1px solid" }}>
                <div className={styles.summaryLeft}>Taxes</div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  ${this.state.updatedPlan.payment_summary.taxes}
                </div>

                <div className={styles.summaryRight}>
                  ${this.state.currentPlan.payment_summary.taxes}
                </div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  ${Math.abs(this.state.differenceSummary.taxes).toFixed(2)}
                </div>
              </div>

              <div style={{ display: "flex" }}>
                <div className={styles.summaryLeft}>Chef and Driver Tip</div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  ${this.state.updatedPlan.payment_summary.driver_tip}
                </div>

                <div className={styles.summaryRight}>
                  ${this.state.currentPlan.payment_summary.driver_tip}
                </div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  $
                  {Math.abs(this.state.differenceSummary.driver_tip).toFixed(2)}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                {(() => {
                  if (
                    this.state.updatedPlan.payment_summary.driver_tip === "0.00"
                  ) {
                    return (
                      <button
                        className={styles.tipButtonSelected}
                        onClick={() => this.changeTip("0.00")}
                        aria-label={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip
                        }
                        title={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip
                        }
                      >
                        No Tip
                      </button>
                    );
                  } else {
                    return (
                      <button
                        className={styles.tipButton}
                        onClick={() => this.changeTip("0.00")}
                        aria-label={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip +
                          ". Click here to remove tip."
                        }
                        title={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip +
                          ". Click here to remove tip."
                        }
                      >
                        No Tip
                      </button>
                    );
                  }
                })()}
                {(() => {
                  if (
                    this.state.updatedPlan.payment_summary.driver_tip === "2.00"
                  ) {
                    return (
                      <button
                        className={styles.tipButtonSelected}
                        onClick={() => this.changeTip("2.00")}
                        aria-label={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip
                        }
                        title={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip
                        }
                      >
                        $2
                      </button>
                    );
                  } else {
                    return (
                      <button
                        className={styles.tipButton}
                        onClick={() => this.changeTip("2.00")}
                        aria-label={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip +
                          ". Click here change tip to $2."
                        }
                        title={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip +
                          ". Click here to change tip to $2."
                        }
                      >
                        $2
                      </button>
                    );
                  }
                })()}
                {(() => {
                  if (
                    this.state.updatedPlan.payment_summary.driver_tip === "3.00"
                  ) {
                    return (
                      <button
                        className={styles.tipButtonSelected}
                        onClick={() => this.changeTip("3.00")}
                        aria-label={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip
                        }
                        title={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip
                        }
                      >
                        $3
                      </button>
                    );
                  } else {
                    return (
                      <button
                        className={styles.tipButton}
                        onClick={() => this.changeTip("3.00")}
                        aria-label={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip +
                          ". Click here to change tip to $3."
                        }
                        title={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip +
                          ". Click here to change tip to $3."
                        }
                      >
                        $3
                      </button>
                    );
                  }
                })()}
                {(() => {
                  if (
                    this.state.updatedPlan.payment_summary.driver_tip === "5.00"
                  ) {
                    return (
                      <button
                        className={styles.tipButtonSelected}
                        onClick={() => this.changeTip("5.00")}
                        aria-label={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip
                        }
                        title={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip
                        }
                      >
                        $5
                      </button>
                    );
                  } else {
                    return (
                      <button
                        className={styles.tipButton}
                        onClick={() => this.changeTip("5.00")}
                        aria-label={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip +
                          ". Click here to change tip to $5."
                        }
                        title={
                          "Current tip is: $" +
                          this.state.updatedPlan.payment_summary.driver_tip +
                          ". Click here to change tip to $5."
                        }
                      >
                        $5
                      </button>
                    );
                  }
                })()}
              </div>

              <div style={{ display: "flex", borderBottom: "1px solid" }}>
                <input
                  type="text"
                  placeholder="Enter Ambassador Code"
                  className={styles.inputAmbassador}
                  onChange={(e) => {
                    this.setState({
                      ambassadorCode: e.target.value,
                    });
                  }}
                  aria-label="Enter your ambassador code here"
                  title="Enter your ambassador code here"
                />
                <button
                  className={styles.codeButton}
                  // disabled={
                  //   this.state.refreshingPrice ||
                  //   parseFloat(this.state.currentPlan.payment_summary.ambassador_discount) > 0 ||
                  //   parseFloat(this.state.updatedPlan.payment_summary.ambassador_discount) > 0
                  // }
                  disabled={this.state.refreshingPrice}
                  onClick={() => this.applyAmbassadorCode()}
                  aria-label="Click here to verify your ambassador code"
                  title="Click here to verify your ambassador code"
                >
                  Verify
                </button>
                <div
                  className={
                    this.activeChanges()
                      ? styles.summarySubLeft
                      : styles.summarySubLeftGray
                  }
                >
                  -${this.state.updatedPlan.payment_summary.ambassador_discount}
                </div>

                <div className={styles.summarySubtotal}>
                  -${this.state.currentPlan.payment_summary.ambassador_discount}
                </div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summarySubtotal
                      : styles.summarySubGray
                  }
                >
                  ${this.state.differenceSummary.ambassador_discount}
                </div>
              </div>

              <div style={{ display: "flex", marginBottom: "50px" }}>
                <div className={styles.summaryLeft}>Total</div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
                  ${this.state.updatedPlan.payment_summary.total}
                </div>

                <div className={styles.summaryRight}>
                  ${this.state.currentPlan.payment_summary.total}
                </div>

                <div
                  className={
                    this.activeChanges()
                      ? styles.summaryRight
                      : styles.summaryGray
                  }
                >
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
                  this.state.refreshingPrice === true ||
                  !this.activeChanges() ||
                  this.state.processingChanges
                }
                onClick={() => this.confirmChanges()}
                aria-label={
                  "Your new plan will cost " +
                  this.state.updatedPlan.payment_summary.total +
                  ". Click here to save your new delivery plan"
                }
                title={
                  "Your new plan will cost " +
                  this.state.updatedPlan.payment_summary.total +
                  ". Click here to save your new delivery plan"
                }
              >
                Update Meal Plan
              </button>

              <button
                className={styles.orangeBtn3}
                disabled={
                  (!this.state.subscriptionsLoaded &&
                    this.state.defaultSet === false) ||
                  this.state.refreshingPrice === true ||
                  !this.activeChanges() ||
                  this.state.processingChanges
                }
                onClick={() => this.discardChanges()}
                aria-label={
                  "Your new plan will cost " +
                  this.state.updatedPlan.payment_summary.total +
                  ". Click here to keep your previous meal plan"
                }
                title={
                  "Your new plan will cost " +
                  this.state.updatedPlan.payment_summary.total +
                  ". Click here to keep your previous meal plan"
                }
              >
                Keep Existing Meal Plan
              </button>
            </div>
          </div>
        </div>

        {(() => {
          if (this.state.showErrorModal === true) {
            return (
              <>
                <div className={this.state.errorModal}>
                  <div className={styles.errorModalContainer}>
                    <div className={styles.errorContainer}>
                      <div className={styles.errorHeader}>
                        {this.state.errorHeader}
                      </div>

                      <div className={styles.errorText}>
                        {this.state.errorMessage}
                      </div>

                      <br />

                      <button
                        className={styles.chargeBtn}
                        onClick={() => {
                          if (this.state.errorLink === "back") {
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

        {(() => {
          if (this.state.showConfirmModal === true) {
            return (
              <>
                <div className={styles.errorModalPopUpShow}>
                  <div className={styles.confirmModalContainer}>
                    <div className={styles.confirmContainer}>
                      <div className={styles.confirmHeader}>
                        Confirm Cancellation
                      </div>

                      <div className={styles.errorText}>
                        Are you sure you want to delete
                        <br />
                        the following meal plan:
                        <br />
                        <strong>
                          {" " + this.state.currentPlan.meals} meals,
                          {" " + this.state.currentPlan.deliveries} deliveries
                          (ID: {this.state.currentPlan.id})
                        </strong>
                        ?
                      </div>

                      <br />

                      <div
                        style={{
                          // border: 'solid',
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className={styles.confirmBtn}
                          onClick={() => {
                            console.log("deleting purchase...");
                            this.setState(
                              {
                                deletingPurchase: true,
                                showConfirmModal: false,
                                // confirmModal: styles.errorModalPopUpHide
                              },
                              () => {
                                this.deletePurchase();
                              }
                            );
                          }}
                        >
                          Yes
                        </button>

                        <button
                          className={styles.confirmBtn}
                          onClick={() => {
                            this.displayConfirmation();
                          }}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          }
        })()}

        {(() => {
          if (this.state.deletingPurchase === true) {
            return (
              <>
                <div className={styles.errorModalPopUpShow}>
                  <div className={styles.confirmModalContainer}>
                    <div className={styles.deletingContainer}>
                      <div className={styles.deletingHeader}>
                        Deleting Purchase
                      </div>

                      <div className={styles.errorText}>Please wait...</div>
                    </div>
                  </div>
                </div>
              </>
            );
          }
        })()}

        {(() => {
          if (this.state.deleteSuccess === true) {
            return (
              <>
                <div className={styles.errorModalPopUpShow}>
                  <div className={styles.confirmModalContainer}>
                    <div className={styles.confirmContainer}>
                      <div className={styles.cancelledHeader}>
                        Cancellation Success!
                      </div>

                      <div className={styles.errorText}>
                        You have been refunded ${this.state.refundAmount}.
                      </div>

                      <button
                        className={styles.cancelledBtn}
                        onClick={() => {
                          this.setState({
                            deleteSuccess: null,
                            confirmModal: styles.errorModalPopUpHide,
                          });
                        }}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </>
            );
          } else if (this.state.deleteSuccess === false) {
            return (
              <>
                <div className={styles.errorModalPopUpShow}>
                  <div className={styles.confirmModalContainer}>
                    <div className={styles.confirmContainer}>
                      <div className={styles.cancelledHeader}>
                        Cancellation Error
                      </div>

                      <div className={styles.errorText}>
                        {this.state.refundError}
                      </div>

                      <button
                        className={styles.cancelledBtn}
                        onClick={() => {
                          this.setState({
                            deleteSuccess: null,
                            confirmModal: styles.errorModalPopUpHide,
                          });
                        }}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </>
            );
          }
        })()}

        <FootLink />
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
  selectedPlan: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
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
})(withRouter(EditPlan));
