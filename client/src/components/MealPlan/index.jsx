import React, {useEffect, Fragment} from "react";
import {connect} from "react-redux";
import {
  fetchProfileInformation,
  fetchSubscribed,
  fetchPlans
} from "../../reducers/actions/subscriptionActions";
import {withRouter} from "react-router";
import {fetchOrderHistory} from "../../reducers/actions/profileActions";
import {WebNavBar} from "../NavBar";
import styles from "./mealplan.module.css";
import Menu from "../Menu";
import chooseMeal from "../ChoosePlan/static/choose_meals.svg";
import prepay from "../ChoosePlan/static/prepay.png";
import delivery from "../ChoosePlan/static/delivery.png";
import store from "../../reducers/store";
const MealPlan = props => {
  //check for logged in user
  let customerId = null;
  if (
    document.cookie
      .split(";")
      .some(item => item.trim().startsWith("customer_uid="))
  ) {
    customerId = document.cookie
      .split("; ")
      .find(item => item.startsWith("customer_uid="))
      .split("=")[1];
  }
  let plans = null;
  useEffect(() => {
    if (!customerId) {
      props.history.push("/");
    } else {
      try {
        props.fetchProfileInformation(customerId);
        props.fetchPlans();
        props
          .fetchSubscribed(customerId)
          .then(ids => props.fetchOrderHistory(ids));
      } catch (err) {
        // props.history.push("/");
        console.log(err);
      }
    }
    //eslint-disable-next-line
  }, []);
  const loadHistory = () => {
    let items = props.orderHistory;
    let itemShow = [];
    for (let key of Object.keys(items)) {
      let name = JSON.parse(items[key][0].items)[0].name;
      let purchases = items[key];
      itemShow.push(
        <div key={key} className={"row pl-2 mb-5 " + styles.historyItemName}>
          <p className={styles.itemName + " pl-0 text-uppercase"}>{name}</p>
          {purchases.map(purchase => {
            let _date = purchase.purchase_date.split(" ");
            let date = new Date(`${_date[0]}T00:00:00`);
            let dateShow = date.toDateString().replace(" ", ", ");
            return (
              <Fragment key={purchase.purchase_uid}>
                <div className={styles.historyItemName}>
                  <p className='font-weight-bold'>{dateShow}</p>
                  <p className='mt-0'>
                    <span className={styles.title}>ORDER #:</span>{" "}
                    {purchase.purchase_uid}
                  </p>
                  <p className={styles.title}>DELIVERY ADDRESS:</p>
                  <p>{purchase.delivery_address}</p>
                  <p>
                    {
                      (purchase.delivery_city +
                        ", " +
                        purchase.delivery_state +
                        " ",
                      purchase.delivery_zip + ".")
                    }
                  </p>
                  <p className={styles.title}>PAYMENT CARD:</p>
                  <p>{purchase.cc_num}</p>
                </div>
              </Fragment>
            );
          })}
        </div>
      );
    }
    return itemShow;
  };
  return (
    <>
      <WebNavBar />
      <div className={styles.container}>
        <Menu show={false} />
        {props.subscribedPlans.length ? (
          <div className={styles.box1}>
            <div className={"row " + styles.fixedHeight}>
              <div className={"col-9 " + styles.fixedHeight}>
                <div className={styles.box}>
                  <div className='row'>
                    <input
                      type='text'
                      className={styles.logo}
                      value='SM'
                      readOnly
                    />
                  </div>
                  <div className={"row pl-5 " + styles.mealPlanImg}>
                    <img src={chooseMeal} alt='Choose Meals' />
                    <img src={prepay} alt='Prepay' />
                    <img src={delivery} alt='Delivery' />
                  </div>
                  <div className='row'>
                    <div className={"col ml-5 " + styles.textLeft}>
                      <p className={styles.header1}>YOUR MEAL PLANS</p>
                    </div>
                    <div className='col'>
                      <p className={styles.header1 + " " + styles.textLeft}>
                        PAYMENT FREQUENCY
                      </p>
                    </div>
                    <div className='col'>
                      <p className={styles.header1}>DELIVERY INFORMATION</p>
                    </div>
                  </div>
                  {props.subscribedPlans.map((plan, index) => {
                    let item = JSON.parse(plan.items)[0];
                    let cc_num = plan.cc_num;
                    let frequency = " ";
                    if (Object.keys(props.plans).length > 0) {
                      let item_desc =
                        props.plans[item.name.split(" ")[0]][item.item_uid]
                          .item_desc;
                      frequency = item_desc.split(" - ")[1].toUpperCase();
                    }

                    return (
                      <Fragment key={index}>
                        <div className='row'>
                          <div className='col-4 ml-5'>
                            <input
                              value={item.name}
                              className={styles.infoBtn}
                              readOnly
                            />
                          </div>
                          <div className='col'>
                            <div className={"row mt-3"}>
                              <div className={"col " + styles.cardInfo}>
                                <p>CARD</p>
                                <i className='fa fa-credit-card'></i>
                                <p
                                  className={styles.font10}
                                  style={{marginTop: "0px"}}
                                >
                                  {cc_num}
                                </p>
                              </div>
                              <div
                                className={
                                  "col " +
                                  styles.cardInfo +
                                  " " +
                                  styles.textCenter
                                }
                              >
                                <p>FOR {frequency}</p>
                                <input
                                  className={styles.circleInput}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                          <div className={"col  mx-5 " + styles.deliveryInfo}>
                            <p className='mt-3'>
                              {plan.delivery_first_name +
                                " " +
                                plan.delivery_last_name}
                            </p>
                            <p>{plan.delivery_address}.</p>
                            <p>
                              {plan.delivery_unit !== "NULL" && (
                                <span>
                                  Apt. {" " + plan.delivery_unit + ", "}
                                </span>
                              )}
                              {plan.delivery_city +
                                ", " +
                                plan.delivery_state +
                                " " +
                                plan.delivery_zip +
                                "."}
                            </p>

                            <p>{"Phone: " + plan.delivery_phone_num}</p>
                          </div>
                        </div>
                        {index + 1 !== props.subscribedPlans.length && (
                          <hr className={styles.separatedLine + " mx-5"} />
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </div>
              <div className={"col-3 text-left pl-5 " + styles.fixedHeight}>
                <h6 className='mb-4' style={{fontSize: "25px"}}>
                  ORDER HISTORY
                </h6>
                {loadHistory()}
              </div>
            </div>
          </div>
        ) : (
          <div className={"row " + styles.subscribeNotice}>
            <p>
              Once you purchase a subscription, you will see your subscriptions
              here
            </p>
          </div>
        )}
      </div>
    </>
  );
};
const mapStateToProps = state => ({
  subscribe: state.subscribe,
  customerId: state.subscribe.profile.customerId,
  subscribedPlans: state.subscribe.subscribedPlans,
  orderHistory: state.profile.orderHistory,
  errors: state.subscribe.errors,
  plans: state.subscribe.plans
});

export default connect(mapStateToProps, {
  fetchProfileInformation,
  fetchSubscribed,
  fetchOrderHistory,
  fetchPlans
})(withRouter(MealPlan));
