import React, { Component } from "react";
import MealIndicator from "./MealIndicator";
import styles from "./selectmeal.module.css";
class Header extends Component {
  
  showDeliveryDay = () => {
    const mySet = new Set();
    this.props.data.map((menuitem) => {
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
          onClick={(e) => this.props.setDeliveryDay(e)}
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
          onClick={(e) => this.props.makeSelection(e)}
        >
          {selectionOptions}
        </button>
      );
    }
    return selections;
  };

  render() {
    const { meals, totalCount, totalMeals } = this.props;
    let mealsCount = parseInt(totalMeals);

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

    return (
      <React.Fragment>
        <div className={styles.mealHeader}>
          <p
            style={{
              flex: "6",
              textAlign: "center",
              fontSize: "24px",
              color: "black",
              fontWeight: "bold",
              paddingLeft: "50px",
            }}
          >
            MENU THIS WEEK
          </p>
          <div className={styles.avatar}></div>
        </div>
        <div className={styles.stickyHeader}>
          <select
            onChange={this.props.mealsOnChange}
            className={styles.pickers}
            id={styles.mealPlanPicker}
          >
            {meals.map((mealItem) => {
              let meal = JSON.parse(mealItem.items)[0];
              let mealName = meal.name;
              return (
                <option value={mealItem.purchase_id}>
                  {mealName.toUpperCase()}
                </option>
              );
            })}
          </select>

          <select
            onChange={this.props.filterDates}
            value={this.props.date}
            name='date'
            id={styles.date}
            className={styles.pickers}
          >
            {this.props.dates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
          <div className={styles.deliveryDays}>{this.showDeliveryDay()}</div>
          <div className={styles.supriseSkipSave}>
            {this.showSelectionOptions()}
          </div>
          <MealIndicator
            totalCount={this.props.totalCount}
            totalMeals={this.props.totalMeals}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Header;
