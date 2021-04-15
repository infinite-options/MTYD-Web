import React, {Component} from "react";
import MealIndicator from "./MealIndicator";
import styles from "./selectmeal.module.css";
import menuStyles from "../Menu/menu.module.css";
import {WebNavBar} from "../NavBar";
import MenuBar from "../Menu";
import {connect} from "react-redux";
import Moment from 'react-moment';
import moment from 'moment';

import PopLogin from '../PopLogin';
import Popsignup from '../PopSignup';

class Header extends Component {

  state = {     
    login_seen:false,
    signUpSeen:false, 
    firstDate:null,
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
  showDeliveryDay = () => {
    const mySet = new Set();
    this.props.data.map(menuitem => {
      if (menuitem.menu_date === this.props.myDate) {
        mySet.add(menuitem.delivery_days);
      }
      return menuitem;
    });
    const myarr = [...mySet];
    let str = "";
    let temp = "";
    if (myarr.length > 0) {
      str = myarr[0];
      temp = str.replace(/[^a-zA-Z ]/g, "").split(" ");
    }

    let mealdays = [];
    for (const day of temp) {
      let dayselector = day;
      mealdays.push(
        <button
          key={dayselector}
          value={dayselector}
          className={
            this.props.deliveryDay !== dayselector ||
            this.props.deliveryDay === ""
              ? styles.selectionStyles
              : styles.selectionStyles && styles.selectedDays
          }
          onClick={e => this.props.setDeliveryDay(e)}
        >
          {dayselector}
        </button>
      );
    }
    return mealdays;
  };

  showSelectionOptions = () => {
    let options = ["SURPRISE", "SKIP", "SAVE"];
    let selections = [];
    for (const day of options) {
      let selectionOptions = day;
      selections.push(
        <button
          id={selectionOptions}
          key={selectionOptions}
          value={selectionOptions}
          className={
            this.props.selectValue === "" ||
            this.props.selectValue !== selectionOptions
              ? styles.selectionStyles
              : styles.selectionStyles && styles.selectedDays
          }
          onClick={e => this.props.makeSelection(e)}
        >
          {selectionOptions}
        </button>
      );
    }
    return selections;
  };


  render() {
    const {meals, totalCount, totalMeals} = this.props;
    let mealsCount = parseInt(totalMeals);

    // console.log(this.props.dates)

    //To disable and enable save button
    if (document.getElementById("SAVE") !== null) {
      if (totalCount !== totalMeals) {
        document.getElementById("SAVE").disabled = true;
      } else {
        document.getElementById("SAVE").disabled = false;
      }
    }

    //To disable and enable date picker
    if (document.getElementById("date") !== null) {
      if (totalCount > 0 && totalCount != totalMeals) {
        document.getElementById("date").disabled = true;
      } else {
        document.getElementById("date").disabled = false;
      }
    }

    //To disable and enable meal-plan picker
    if (document.getElementById("meal-plan-picker") !== null) {
      if (
        totalCount > 0 &&
        totalCount != totalMeals &&
        this.props.selectValue !== "Skip"
      ) {
        document.getElementById("meal-plan-picker").disabled = true;
      } else {
        document.getElementById("meal-plan-picker").disabled = false;
      }
    }

    let login = this.props.subscribedPlans.length?(1):(3);

    let message = this.props.subscribedPlans.length ? (
      <p className={menuStyles.navMessage}>
        Please Complete Your Meal Selection For Your Meal Subscriptions
      </p>
    ) : (
      <p className={menuStyles.navMessage + " text-left"}>
        Below are this weeks Meals.{" "}
        {/* <span style={{display: "block"}}>
          Please buy a Subscription before selecting meals
        </span> */}
        
      </p>
    );
    return (
      <>
        <WebNavBar 
          poplogin = {this.togglePopLogin}
          popSignup = {this.togglePopSignup}
        />
        {this.state.login_seen ? <PopLogin toggle={this.togglePopLogin} /> : null}
        {this.state.signUpSeen ? <Popsignup toggle={this.togglePopSignup} /> : null}
        
        <MenuBar show={true} message={message} login = {login}/>

        <div class={styles.divider}
          
        ></div>
        {this.props.dateButtonArray}
        

        
        <div>
        {this.props.subscribedPlans.length ? (
          <select
              onChange={this.props.mealsOnChange}
              className={styles.pickers}
              id={styles.mealPlanPicker}
            >
              {meals.map(mealItem => {
                let meal = JSON.parse(mealItem.items)[0];
                let mealName = meal.name;
                return (
                  <option
                    value={mealItem.purchase_id}
                    key={mealItem.purchase_uid}
                  >
                    {mealName.toUpperCase()}
                  </option>
                );
              })}
        </select>
        ) : (""
        )}
          
        </div>



        {this.props.subscribedPlans.length ? (
          
          <div className={styles.stickyHeader + " px-5 "}>
            <h4 style = {{padding: '10px 90px', fontSize: '30px', display:'inline-block',overflow:'hidden',whiteSpace:'nowrap'}}>Featured Meals</h4>

            <MealIndicator
              totalCount={this.props.totalCount}
              totalMeals={this.props.totalMeals}
            />
            <div className={styles.supriseSkipSave}>
              {this.showSelectionOptions()}
            </div>
          </div>
        ) : (""
        )}
      </>
    );
  }
}
const mapStateToProps = state => ({
  subscribedPlans: state.subscribe.subscribedPlans
});
export default connect(mapStateToProps, {})(Header);
