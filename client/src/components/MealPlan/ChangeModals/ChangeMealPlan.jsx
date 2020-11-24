import React, {useState, useEffect} from "react";
import {Modal, Button} from "react-bootstrap";
import {connect} from "react-redux";

import styles from "../../ChoosePlan/choosePlan.module.css";
import modalStyle from "./changeModal.module.css";
import {
  setSelectedPlan,
  setCurrentMeal,
  setMeals,
  setPaymentOption,
  chooseMealsDelivery,
  choosePaymentOption,
  setCurrentPurchase
} from "../../../reducers/actions/subscriptionActions";

import paymentOption1 from "../../ChoosePlan/Group 2029.svg";
import paymentOption2 from "../../ChoosePlan/Group 2016.svg";
import paymentOption3 from "../../ChoosePlan/Group 2030.svg";
import axios from "axios";
import {auto} from "@popperjs/core";

const ChangeMealPlan = props => {
  const [show, setShow] = useState(false);
  const [subShow, setSubShow] = useState(null);
  const [msg, setMsg] = useState(null);
  const [errorShow, setErrorShow] = useState(null);

  const [refundAmount, setRefundAmount] = useState(null);
  // need to called Salting to get this password instead get it directly from endpoint.
  const [password, setPassword] = useState("");

  /*RESET FUNCTION.
  --Theses functions are used for reseting all showed off states. These functions will be called when component did mount and CLOSE button clicked.
  */
  const reset = () => {
    setShow(false);
    setSubShow(false);
    setMsg(null);
    setRefundAmount(null);
    props.setCurrentMeal({});
    props.setSelectedPlan({});
    props.setMeals("");
    props.setPaymentOption("");
    props.setCurrentPurchase("");
  };
  const resetPriceCheck = () => {
    setSubShow(false);
    setRefundAmount(null);
    setMsg(null);
  };
  const handleClose = () => {
    reset();
    props.changeOpen();
  };
  const handleErrorShow = () => {
    setSubShow(!errorShow);
    setShow(!show);
  };

  /* IMPLEMENTING FUNCTIONS
  // should move these functions to actions instead of leaving it here.
  these functions handle showing Modal and send requests to server. These codes need to be cleaned and the runtime of props' functions need to be improved.
  */
  const checkPrice = () => {
    axios(`http://127.0.0.1:2000/api/v2/refund_calculator`, {
      params: {purchase_uid: props.currentPurchase}
    })
      .then(res => {
        console.log(res);
        if (res.data !== undefined) {
          let refund = 0;
          if (Object.keys(props.selectedPlan).length > 0) {
            refund = parseFloat(
              (
                props.selectedPlan.item_price - res.data.result[0].refund_amount
              ).toFixed(2)
            );
          }
          setSubShow(true);
          if (refund >= 0) setMsg("charged");
          else setMsg("refunded");

          setRefundAmount(Math.abs(refund));
        }

        console.log("res after calling refund calculator");
      })
      .catch(err => {
        console.log("Error happened when calling refund calculator.", err);
      });
  };
  const submitChangeMealPlan = () => {
    //get password salt and
    axios
      .get(`http://127.0.0.1:2000/api/v2/Profile/${props.customerId}`)
      .then(res => {
        console.log("res when submit: ", res);
        setPassword(res.data.result[0].password_hashed);
        let items = props.selectedPlan;
        const data = {
          customer_email: props.profile.email,
          password,
          purchase_id: props.currentPurchase,
          items: [
            {
              qty: 1,
              name: items.item_name,
              price: items.item_price,
              item_uid: items.item_uid,
              pur_business_uid: items.itm_business_uid,
              start_delivery_date: "2020-11-30 12:00:00"
            }
          ],
          cc_num: props.creditCard.number,
          cc_exp_date: `${props.creditCard.year}-${props.creditCard.month}-01`,
          cc_cvv: props.creditCard.cvv,
          cc_zip: props.creditCard.zip,
          new_item_id: props.selectedPlan.item_uid
        };
        console.log("data sending: ", data);
        axios
          .post("http://localhost:2000/api/v2/change_purchase", data)
          .then(res => {
            console.log("Response after post: ", res);
          })
          .catch(err => {
            console.log("ChangeMealPlan modal error happened.");
            console.log(
              "Error happened on the second axios call in submitChangePlan function.",
              err
            );
            setErrorShow(true);
            setShow(false);
          });
      })
      .catch(err => {
        console.log("ChangeMealPlan modal error happened.");
        console.log(
          "Error happened on the first axios call in submitChangePlan function.",
          err
        );
      });
  };

  const mealsDelivery = () => {
    let deselectedMealButton = styles.mealButton;
    let selectedMealButton =
      styles.mealButton + " " + styles.mealButtonSelected;
    let mealButtons = [];
    for (const plan of props.numItems) {
      let planStr = plan.toString();
      mealButtons.push(
        <button
          key={planStr}
          className={
            props.meals === planStr ? selectedMealButton : deselectedMealButton
          }
          onClick={() => {
            props.chooseMealsDelivery(
              planStr,
              props.paymentOption,
              props.plans
            );
            resetPriceCheck();
          }}
        >
          {planStr} MEALS
        </button>
      );
    }
    return mealButtons;
  };

  const paymentFrequency = () => {
    let myArr = [
      {image: paymentOption1, desc: "WEEKLY"},
      {image: paymentOption2, desc: "FOR 2 WEEKS"},
      {image: paymentOption3, desc: "FOR 4 WEEKS"}
    ];
    let deselectedPaymentOption = styles.box2;
    let selectedPaymentOption = styles.box2 + " " + styles.ButtonSelected;
    let paymentOptionButtons = [];

    for (const [i, option] of props.paymentFrequency.entries()) {
      let active = false;
      let optionStr = option.toString();
      if (props.meals === "") {
        active = true;
      } else {
        active = false;
      }
      paymentOptionButtons.push(
        <div className={styles.sameLine} key={i}>
          <button
            disabled={active}
            className={
              (props.paymentOption === optionStr
                ? selectedPaymentOption
                : deselectedPaymentOption) +
              " " +
              (active && styles.disabledBtn)
            }
            onClick={() => {
              props.choosePaymentOption(optionStr, props.meals, props.plans);
              resetPriceCheck();
            }}
          >
            <img src={myArr[i].image} />
            <p>{myArr[i].desc}</p>
          </button>
        </div>
      );
    }
    return paymentOptionButtons;
  };

  // Component did mount.
  useEffect(() => {
    if (props.isShow) {
      setShow(!show);
      setSubShow(false);
      setRefundAmount(0);
      setMsg("");
      //get current meal
      props.chooseMealsDelivery(
        props.currentMeal.num_items.toString(),
        props.paymentOption,
        props.plans
      );
      props.choosePaymentOption(
        props.currentMeal.payment_frequency.toString(),
        props.meals,
        props.plans
      );
    }
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header className={modalStyle.modalTitle} closeButton>
          <Modal.Title>Change Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row justify-content-center'>
            <p
              className=''
              style={{
                color: "black",
                fontSize: "20px",
                fontWeight: "bold",
                padding: "0px",
                display: "block",
                widht: "100%"
              }}
            >
              NUMBER OF MEALS PER DELIVERY
            </p>
          </div>

          <div className='row'>{mealsDelivery()}</div>
          <hr className={modalStyle.hline} />
          <div className='row justify-content-center'>
            <p
              className=''
              style={{
                color: "black",
                fontSize: "20px",
                fontWeight: "bold",
                padding: "0px",
                display: "block",
                widht: "100%"
              }}
            >
              PREPAY OPTIONS
            </p>
          </div>
          <div className='row'>{paymentFrequency()}</div>
        </Modal.Body>
        <Modal.Footer>
          {subShow && (
            <p
              style={{
                color: "black",
                fontSize: "15px",
                padding: "0px",
                fontWeight: "600",
                marginRight: "auto"
              }}
            >
              You will be {msg} ${refundAmount}
            </p>
          )}
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          {subShow ? (
            <Button variant='primary' onClick={submitChangeMealPlan}>
              Save Changes
            </Button>
          ) : (
            <Button variant='primary' onClick={checkPrice}>
              Check Price
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Modal show={errorShow} onHide={handleErrorShow} animation={true}>
        <Modal.Header className={modalStyle.modalTitle} closeButton>
          <Modal.Title>Oops...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          SOME THING WENT WRONG. SORRY ABOUT THIS. WE'LL FIX IT ASAP.
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleErrorShow}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = state => ({
  customerId: state.subscribe.profile.customerId,
  currentMeal: state.subscribe.currentMeal,
  creditCard: state.subscribe.creditCard,
  plans: state.subscribe.plans,
  numItems: state.subscribe.numItems,
  selectedPlan: state.subscribe.selectedPlan,
  meals: state.subscribe.meals,
  paymentOption: state.subscribe.paymentOption,
  paymentFrequency: state.subscribe.paymentFrequency,
  profile: state.subscribe.profile,
  currentPurchase: state.subscribe.currentPurchase
});
export default connect(mapStateToProps, {
  chooseMealsDelivery,
  choosePaymentOption,
  setCurrentMeal,
  setSelectedPlan,
  setPaymentOption,
  setMeals,
  setCurrentPurchase
})(ChangeMealPlan);
