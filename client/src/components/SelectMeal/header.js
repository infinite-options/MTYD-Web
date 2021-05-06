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
import { blue } from "@material-ui/core/colors";
import { SelectMealGuestPop } from "../SelectMealGuestPop/SelectMealGuestPop";

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
    let options = ["SAVE","SURPRISE", "SKIP"];
    let selections = [];
    for (const day of options) {
      let selectionOptions = day;

      let displayMessage = '';

      if(selectionOptions=="SAVE"){
        displayMessage = "Save Meals"
      }
      else if(selectionOptions == 'SURPRISE'){
        displayMessage = 'Surprise Me';
      }
      else{
        displayMessage = 'Skip this day';
      }

      let classForbutton = ''
      if(this.props.customer_uid==null){
        classForbutton = styles.selectionStyles 
      }
      else{
        classForbutton=this.props.selectValue === "" ||
        this.props.selectValue !== selectionOptions
          ? styles.selectionStyles: 
          styles.selectionStyles && styles.selectedDays
      }

      // console.log(classForbutton)

      selections.push(
        <button
          id={selectionOptions}
          key={selectionOptions}
          value={selectionOptions}
          className={classForbutton}
          onClick={e => this.props.makeSelection(e)}
        >
          {displayMessage}
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

        if(this.props.customer_uid==null){
          document.getElementById("SAVE").disabled = false;
        }else{
          document.getElementById("SAVE").disabled = true;
        }
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

    let login = this.props.customer_uid?(true):(false);

    let message = 
      <p className={menuStyles.navMessage + " text-left"}>
        Upcoming Menus
      </p>
    return (
      <>

        <WebNavBar/>

        {/* <SelectMealGuestPop message = 'message here'/> */}

        
        <MenuBar show={true} 
        message={message} 
        login = {login} 
        subscribedPlans = {this.props.subscribedPlans} 
        mealsOnChange={this.props.mealsOnChange}
        meals={meals}
        />

        <div class={styles.divider}/>

        <div
        style={{
          overflowX:'auto',
          display:'flex',
          height:'170px',
          marginLeft:'198px',
          marginRight:'200px'
        }}
        >
          {this.props.dateButtonArray}
        </div>
          

        <div className={styles.supriseSkipSave}>
          <div class={styles.divider}/>
            {this.showSelectionOptions()}
          <div class={styles.divider}/>
        </div>


        <div className={styles.stickyHeader + " px-5 "}>
          <MealIndicator
            totalCount={this.props.totalCount}
            totalMeals={this.props.totalMeals}
          />
        </div>


      </>
    );
  }
}
const mapStateToProps = state => ({
  subscribedPlans: state.subscribe.subscribedPlans
});
export default connect(mapStateToProps, {})(Header);
