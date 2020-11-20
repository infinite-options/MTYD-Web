import React, {useEffect} from "react";
import {connect, useSelector} from "react-redux";
import {
  fetchProfileInformation,
  fetchSubscribed
} from "../../reducers/actions/subscriptionActions";
import {fetchOrderHistory} from "../../reducers/actions/profileActions";
import {WebNavBar} from "../NavBar";
import styles from "./mealplan.module.css";
import Menu from "../Menu";
import chooseMeal from "../ChoosePlan/static/choose_meals.svg";
import prepay from "../ChoosePlan/static/prepay.png";
import delivery from "../ChoosePlan/static/delivery.png";

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

  useEffect(() => {
    if (!customerId) {
      props.history.push("/");
    } else {
      (async () => {
        await props.fetchProfileInformation(customerId);
        await props.fetchSubscribed(customerId);

        let purchaseIds = [];

        if (props.subscribedPlans.length > 0) {
          for (let item of props.subscribedPlans) {
            purchaseIds.push(item.purchase_id);
          }
          await props.fetchOrderHistory(purchaseIds);
        }
      })();
    }
    //eslint-disable-next-line
  }, [
    props.customerId,
    props.subscribedPlans.length,
    Object.keys(props.orderHistory).length
  ]);
  const loadHistory = () => {
    let items = props.orderHistory;
    let itemShow = [];
    for (let key of Object.keys(items)) {
      let name = JSON.parse(items[key][0].items)[0].name;
      let purchases = items[key];
      itemShow.push(
        <div className={"row pl-2 mb-5 " + styles.historyItemName}>
          <p className={styles.itemName + " pl-0 text-uppercase"}>{name}</p>
          {purchases.map(purchase => {
            let _date = purchase.purchase_date.split(" ");
            let date = new Date(_date[0]);
            let dateShow = date.toDateString().replace(" ", ", ");
            console.log("dateShow: ", dateShow);
            return (
              <>
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
              </>
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
                  let item = JSON.parse(plan.items);
                  let cc_num = plan.cc_num;
                  return (
                    <>
                      <div className='row'>
                        <div className='col-4 ml-5'>
                          <input
                            value={item[0].name}
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
                              <p>FOR 2 WEEKS</p>
                              <input className={styles.circleInput} readOnly />
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
                    </>
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
      </div>
    </>
  );
};
const mapStateToProps = state => ({
  customerId: state.subscribe.profile.customerId,
  subscribedPlans: state.subscribe.subscribedPlans,
  orderHistory: state.profile.orderHistory
});

export default connect(mapStateToProps, {
  fetchProfileInformation,
  fetchSubscribed,
  fetchOrderHistory
})(MealPlan);
