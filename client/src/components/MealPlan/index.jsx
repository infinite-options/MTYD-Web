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
import Menu from '../Menu';
import chooseMeal from '../ChoosePlan/static/choose_meals.svg';
import prepay from '../ChoosePlan/static/prepay.png';
import delivery from '../ChoosePlan/static/delivery.png';
import ChangeMealPlan from './ChangeModals/ChangeMealPlan';
import ChangeUserInfo from './ChangeModals/ChangeUserInfo';
import ChangePassword from '../ChangePassword'
import axios from 'axios';
import { API_URL } from '../../reducers/constants';

const MealPlan = props => {
  //check for logged in user
  let customerId = null;
  if (
    document.cookie
      .split(';')
      .some(item => item.trim().startsWith('customer_uid='))
  ) {
    customerId = document.cookie
      .split('; ')
      .find(item => item.startsWith('customer_uid='))
      .split('=')[1];
  }
    
  // we can replace hooks by store.subscribe(listener)

  const [modal, setModal] = useState(null);
  /*const [changePassword, setChangePassword] = useState(
    <>
      <div>
        {(() => {
          //console.log("Social Media: " + props.socialMedia);
          if (props.socialMedia === "NULL") {
            return (
              <ChangePassword />
            );
          }
        })()}
      </div>
    </>
  );*/
  
  const activePlans = props.subscribedPlans.filter((elt) => elt.purchase_status === 'ACTIVE');
  const cancelledPlans = props.subscribedPlans.filter((elt) => elt.purchase_status !== 'ACTIVE');

  const modalShow = [
    <ChangeMealPlan isShow={true} changeOpen={() => setModal(null)} />,
    <ChangeUserInfo isShow={true} changeOpen={() => setModal(null)} />,
  ];
    
  const [changePassword, setChangePassword] = useState(null);
    
  useEffect(() => {
    setChangePassword(
      <div>
        {(() => {
          console.log("Social Media: " + props.socialMedia);
          if (props.socialMedia === "NULL") {
            return (
              <ChangePassword />
            );
          }
        })()}
      </div>
    );
  }, [props.socialMedia]);
    
    
  useEffect(() => {
    if (!customerId) {
      props.history.push('/');
    } else {
      try {
        console.log("Customer ID: " + customerId);
        props.fetchProfileInformation(customerId);
        console.log("fetch profile info: " + props.fetchProfileInformation(customerId));
        props.fetchPlans();
        props
          .fetchSubscribed(customerId)
          .then(ids => props.fetchOrderHistory(ids));
        //console.log("Meal Plan Props: " + JSON.stringify(props));
      } catch (err) {
        console.log(err);
      }
    }
    //eslint-disable-next-line
  }, []);
  const setMealChange = id => {
    console.log("Editing meal plan...");
    //get current meal
    let currentItem = JSON.parse(activePlans[id].items)[0];
    let currentItemUid = currentItem.item_uid;
    //console.log('currentItemUid: ', currentItemUid);
    for (let items of Object.values(props.plans)) {
      for (let key of Object.keys(items)) {
        if (key.toString() === currentItemUid) {
          props.setCurrentMeal(items[key]);
          const {
            cc_num,
            cc_exp_date,
            cc_cvv,
            cc_zip,
            delivery_email,
            customer_first_name,
            customer_last_name,
            delivery_address,
            delivery_unit,
            delivery_city,
            delivery_state,
            delivery_zip,
            delivery_phone_num,
          } = props.subscribedPlans[id];
          const info = {
            cc_num,
            month: cc_exp_date.split(' ')[0].split('-')[1],
            year: cc_exp_date.split(' ')[0].split('-')[0],
            delivery_email,
            cc_cvv,
            cc_zip,
            customer_first_name,
            customer_last_name,
            delivery_address,
            delivery_unit,
            delivery_city,
            delivery_state,
            delivery_zip,
            delivery_phone_num,
          };
          console.log(info);
          props.setUserInfo(info);
          props.setCurrentPurchase(activePlans[id].purchase_uid);
          // props.setSelectedMeal(items[key]);
        }
      }
    }
    setModal(0);
  };

  const setUserInfoChange = id => {
    //get current meal's info
    const {
      cc_num,
      cc_exp_date,
      cc_cvv,
      cc_zip,
      delivery_email,
      delivery_first_name,
      delivery_last_name,
      delivery_address,
      delivery_unit,
      delivery_city,
      delivery_state,
      delivery_zip,
      delivery_phone_num,
    } = activePlans[id];
    const info = {
      cc_num,
      month: cc_exp_date.split(' ')[0].split('-')[1],
      year: cc_exp_date.split(' ')[0].split('-')[0],
      delivery_email,
      cc_cvv,
      cc_zip,
      delivery_first_name,
      delivery_last_name,
      delivery_address,
      delivery_unit,
      delivery_city,
      delivery_state,
      delivery_zip,
      delivery_phone_num,
    };
    console.log(info);
    props.setUserInfo(info);
    props.setCurrentPurchase(activePlans[id].purchase_uid);
    setModal(1);
  };
  const loadLetters = () =>
    (props.firstName.charAt(0) + props.lastName.charAt(0)).toUpperCase();

  const loadHistory = () => {
    let items = props.orderHistory;
    let itemShow = [];
    //console.log("items: " + JSON.stringify(items));
      
    itemShow.push(
      <h6 className="mb-4" style={{fontSize: '25px'}}>
        ORDER HISTORY
      </h6>
    );

    for (let key of Object.keys(items)) {
      if (items[key][0]?.items) {
          
        // Endpoints where data comes from: 
        // plans?business_uid=200-000001
        // pid_history/400-000021
        
        //console.log("(1) items[" + key + "][" + 0 + "]: " + JSON.stringify(items[key][0]));
        //console.log("(2) items[" + key + "][" + 0 + "]: " + JSON.stringify(items));
          
        console.log();
        console.log("orderHistory: " + JSON.stringify(props.orderHistory));
        console.log("plans: " + JSON.stringify(props.plans));
        console.log();
          
        let status = items[key][0].purchase_status;
        let name = JSON.parse(items[key][0].items)[0].name;
        let qty = JSON.parse(items[key][0].items)[0].qty;
        console.log("qty: " + JSON.stringify(qty));
        let remaining = props.plans[name.split(' ')[0]][qty].num_deliveries;
        let purchases = items[key];
        let active_frequency = '';
        if (Object.keys(props.plans).length > 0) {
          //let item_desc = props.plans[name.split(' ')[0]][item_uid].item_desc;
          //active_frequency = item_desc.split(' - ')[1].toUpperCase();
          //active_frequency = props.plans[name.split(' ')[0]][item_uid].num_deliveries;
          active_frequency = qty;
        }
        if(status === 'ACTIVE'){
        itemShow.push(
          <div key={key} className={'row pl-2 mb-5 ' + styles.historyItemName}>
            <p className={styles.itemName + ' pl-0 text-uppercase'}>
              {name} - {active_frequency} TOTAL DELIVERIE(S)
            </p>
            {purchases.map((purchase, id) => {
              //console.log("purchase: " + JSON.stringify(purchase));
              //console.log("id: " + id);
              let _date = purchase.purchase_date.split(' ');
              let date = new Date(`${_date[0]}T00:00:00`);
              let dateShow = date.toDateString().replace(' ', ', ');
              let item_desc = '';
              let purchase_items = JSON.parse(purchase.items)[0];

              if (Object.keys(props.plans).length > 0) {
                //console.log("purchase_items:" + JSON.stringify(purchase_items));
                /*item_desc =
                  props.plans[purchase_items.name.split(' ')[0]][
                    purchase_items.qty
                  ].item_desc;*/
                item_desc = name + " for " + active_frequency + " weeks"
              }
                           
              return (
                <Fragment key={purchase.purchase_uid}>
                  <div className={styles.historyItemName}>
                    <p className="mt-0">
                      <span className={styles.title}>PURCHASE DATE:</span>{' '}
                      {dateShow}
                    </p>
                    {(() => {
                      if (active_frequency === 'WEEKLY') {
                        return (
                          <div>
                          <p className="mt-0">
                            <span className={styles.title}>NEXT CHARGE DATE:</span>{' '}
                              --
                          </p>
                          <p className="mt-0">
                            <span className={styles.title}>NEXT CHARGE AMOUNT:</span>{' '}
                              --
                          </p>
                          </div>
                        );
                      }
                    })()}
                    <p className="mt-0">
                      <span className={styles.title}>DELIVERIES REMAINING:</span>{' '}
                      {remaining}
                    </p>
                    <p className="mt-0">
                      <span className={styles.title}>ORDER #:</span>{' '}
                      {purchase.purchase_uid}
                    </p>
                    <p className="mt-0">
                      <span className={styles.title}>Item Description:</span>{' '}
                      {item_desc}
                    </p>
                    <p className={styles.title}>DELIVERY ADDRESS:</p>
                    <p>{purchase.delivery_address + ',\n '}
                       {purchase.delivery_unit !== 'NULL' && (
                         <span>
                           Apt. {' ' + purchase.delivery_unit + ', '}
                         </span>)}
                        <br></br>
                       {purchase.delivery_city + ', ' + 
                        purchase.delivery_state + ', ' +
                        purchase.delivery_zip + '.'}
                    </p>
                    <p className={styles.title}>PAYMENT CARD:</p>
                    <p>************{purchase.cc_num.substring(purchase.cc_num.length-4, purchase.cc_num.length)}</p>
                    {id + 1 !== purchases.length && (
                      <hr
                        style={{
                          borderTop: '1px solid orange',
                          width: '70%',
                          margin: '2px auto',
                        }}
                      />
                    )}
                  </div>
                </Fragment>
              );
            })}
          </div>
        );
        }
      }
    }
    return itemShow;
  };

  return (
    <>
      <WebNavBar />
      <div className={styles.container}>
            <hr
                        style={{
                          borderTop: '1px solid orange',
                          width: '1000px',
                          margin: '2px auto',
                        }}
                      />
        <Menu show={true} message={changePassword}/>
        {modal !== null && modalShow[modal]}
        {props.subscribedPlans.length ? (
          <div className={styles.box1}>
            <div className={'row ' + styles.fixedHeight}>
              <div className={'col-9 ' + styles.flexHeight}>
                <div className={styles.box}>
                  <div className="row">
                    <input
                      type="text"
                      className={styles.logo}
                      value={loadLetters(customerId)}
                      readOnly
                    />
                  </div>
                  <div className={'row pl-5 ' + styles.mealPlanImg}>
                    <img src={chooseMeal} alt="Choose Meals" />
                    <img src={prepay} alt="Prepay" />
                    <img src={delivery} alt="Delivery" />
                  </div>
                  <div className="row">
                    <div className={'col ml-5 ' + styles.textLeft}>
                      <p className={styles.header1}>YOUR MEAL PLANS</p>
                    </div>
                    <div className="col">
                      <p className={styles.header1 + ' ' + styles.textLeft}>
                        PAYMENT FREQUENCY
                      </p>
                    </div>
                    <div className="col">
                      <p className={styles.header1}>DELIVERY INFORMATION</p>
                    </div>
                  </div>
                  {activePlans.map((plan, index) => {
                        
                    // Endpoints where data comes from: 
                    // pid_history/400-000021
                        
                    console.log("activePlans: " + JSON.stringify(activePlans));
                        
                    let item = JSON.parse(plan.items)[0];
                    let cc_num = plan.cc_num;
                    let frequency = ' ';
                    if (Object.keys(props.plans).length > 0) {
                      if (props.plans[item.name.split(' ')[0]]) {

                        console.log("item name: " + item.name);
                        console.log("(1) " + item.name.split(' ')[0]);
                        console.log("(2) " + item.qty);
                        console.log("plans[" + item.name.split(' ')[0] + "][" + item.qty + "]: " + JSON.stringify(props.plans[item.name.split(' ')[0]][item.qty]));
                          
                        /*let item_desc =
                          props.plans[item.name.split(' ')[0]][item.qty]
                            .item_desc;*/
                        //frequency = item_desc.split(' - ')[1].toUpperCase();
                          
                        frequency = props.plans[item.name.split(' ')[0]][item.qty].payment_frequency;
                      }
                    }
                    return (
                      <Fragment key={index}>
                        <div className="row">
                          <div className="col-4 ml-5">
                            <input
                              value={item.name}
                              className={styles.infoBtn}
                              readOnly
                            />
                            <button
                              className={styles.iconBtn}
                              onClick={() => setMealChange(index)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                          </div>
                          <div className="col">
                            <div className={'row mt-3'}>
                              <div className={'col ' + styles.cardInfo}>
                                <div className="row">
                                  <p className="mt-0 mr-2">CARD</p>
                                  <button
                                    className={styles.iconBtn}
                                    onClick={() => setUserInfoChange(index)}
                                  >
                                    <i className="fa fa-pencil align-top ml-3"></i>
                                  </button>
                                </div>
                                <div className={'row  d-block'}>
                                  <i
                                    className="fa fa-credit-card"
                                    style={{
                                      fontSize: '50px',
                                      textAlign: 'center',
                                    }}
                                  ></i>
                                  <p
                                    className={styles.font10}
                                    style={{marginTop: '0px'}}
                                  >
                                  ************{cc_num.substring(cc_num.length-4,cc_num.length)}
                                  </p>
                                </div>
                              </div>
                              <div className={'col ' + styles.cardInfo}>
                                <div className="row">
                                  <p>EVERY {frequency} WEEK(S)</p>
                                  <button
                                    className={styles.iconBtn}
                                    onClick={() => setMealChange(index)}
                                  >
                                    <i className="fa fa-pencil align-top ml-4"></i>
                                  </button>
                                </div>
                                <input
                                  className={styles.circleInput}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                          <div className={'col  mx-5 ' + styles.deliveryInfo}>
                            <div className="row">
                              <p className="ml-3 mt-3">
                                {plan.delivery_first_name +
                                  ' ' +
                                  plan.delivery_last_name}
                              </p>
                              <button
                                className={styles.iconBtn}
                                onClick={() => setUserInfoChange(index)}
                              >
                                <i className="fa fa-pencil ml-4"></i>
                              </button>
                            
                            </div>
                            <p>{plan.delivery_address},</p>
                            <p>
                              {plan.delivery_unit !== 'NULL' && (
                                <span>
                                  Apt. {' ' + plan.delivery_unit + ', '}
                                </span>
                              )}
                              {plan.delivery_city +
                                ', ' +
                                plan.delivery_state +
                                ' ' +
                                plan.delivery_zip +
                                '.'}
                            </p>

                            <p>{'Phone: ' + plan.delivery_phone_num}</p>
                          </div>
                          <button
                            className='icon-button'
                            onClick={(_) => {
                              axios
                                .put(`${API_URL}cancel_purchase`,{
                                  purchase_uid: plan.purchase_uid,
                                })
                                .then((response) => {
                                  console.log(response);
                                  props
                                    .fetchSubscribed(customerId)
                                    .then(ids => props.fetchOrderHistory(ids));
                                })
                                .catch((err) => {
                                  if(err.response) {
                                    // eslint-disable-next-line no-console
                                    console.log(err.response);
                                  }
                                  // eslint-disable-next-line no-console
                                  console.log(err);
                                })
                            }}
                          >
                          <i className = "fa fa-trash" style = {{height: 'fit-content', fontSize: '30px', margin: 'auto'}} />
                          </button>
                        </div>
                        {index + 1 !== activePlans.length && (
                          <hr className={styles.separatedLine + ' mx-5'} />
                        )}
                      </Fragment>
                    );
                  })}
                  {cancelledPlans.length > 0 &&
                    <>
                      <div className={styles.pastSubscriptions}>
                        <p className={styles.header1}>PAST SUBSCRIPTIONS</p>
                      </div>
                      {cancelledPlans.map((plan, index) => {
                        let item = JSON.parse(plan.items)[0];
                        let cc_num = plan.cc_num;
                        let frequency = ' ';
                        if (Object.keys(props.plans).length > 0) {
                          if (props.plans[item.name.split(' ')[0]]) {
                            let item_desc =
                              props.plans[item.name.split(' ')[0]][item.qty]
                                .item_desc;
                            frequency = item_desc.split(' - ')[1].toUpperCase();
                          }
                        }
                        return (
                          <Fragment key={index}>
                            <div className="row">
                              <div className="col-4 ml-5">
                                <input
                                  value={item.name}
                                  className={styles.infoBtn}
                                  readOnly
                                />
                                {/* <button
                                  className={styles.iconBtn}
                                  onClick={() => setMealChange(index)}
                                >
                                  <i className="fa fa-pencil"></i>
                                </button> */}
                              </div>
                              <div className="col">
                                <div className={'row mt-3'}>
                                  <div className={'col ' + styles.cardInfo}>
                                    <div className="row">
                                      <p className="mt-0 mr-2">CARD</p>
                                      {/* <button
                                        className={styles.iconBtn}
                                        onClick={() => setUserInfoChange(index)}
                                      >
                                        <i className="fa fa-pencil align-top ml-3"></i>
                                      </button> */}
                                    </div>
                                    <div className={'row  d-block'}>
                                      <i
                                        className="fa fa-credit-card"
                                        style={{
                                          fontSize: '50px',
                                          textAlign: 'center',
                                        }}
                                      ></i>
                                      <p
                                        className={styles.font10}
                                        style={{marginTop: '0px'}}
                                      >
                                      ************{cc_num.substring(cc_num.length-4,cc_num.length)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={'col ' + styles.cardInfo}>
                                    <div className="row">
                                      <p>FOR {frequency}</p>
                                      {/* <button
                                        className={styles.iconBtn}
                                        onClick={() => setMealChange(index)}
                                      >
                                        <i className="fa fa-pencil align-top ml-4"></i>
                                      </button> */}
                                    </div>
                                    <input
                                      className={styles.circleInput}
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className={'col  mx-5 ' + styles.deliveryInfo}>
                                <div className="row">
                                  <p className="ml-3 mt-3">
                                    {plan.delivery_first_name +
                                      ' ' +
                                      plan.delivery_last_name}
                                  </p>
                                
                                </div>
                                <p>{plan.delivery_address}.</p>
                                <p>
                                  {plan.delivery_unit !== 'NULL' && (
                                    <span>
                                      Apt. {' ' + plan.delivery_unit + ', '}
                                    </span>
                                  )}
                                  {plan.delivery_city +
                                    ', ' +
                                    plan.delivery_state +
                                    ' ' +
                                    plan.delivery_zip +
                                    '.'}
                                </p>

                                <p>{'Phone: ' + plan.delivery_phone_num}</p>
                              </div>
                            </div>
                            {index + 1 !== activePlans.length && (
                              <hr className={styles.separatedLine + ' mx-5'} />
                            )}
                          </Fragment>
                        );
                      })}
                    </>
                  }
                </div>
              </div>
            
              <div className={'col-3 text-left pl-5 ' + styles.flexHeight}>
                <div>
                  {loadHistory()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={'row ' + styles.subscribeNotice}>
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
