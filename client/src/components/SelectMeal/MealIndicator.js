import { number } from "prop-types";
import React, { Component } from "react";
import mealicon from "../ChoosePlan/dish.png";

export default class MealIndicator extends Component {
  render() {
    const { totalCount } = this.props;
    const { totalMeals } = this.props;
    // var colorPicker = "";
    // cartItems.length === 0
    //   ? (colorPicker = "meal-selection-indicator")
    //   : (colorPicker = `meal-selection-indicator meal-selection-indicator:nth-child(${cartItems.length}`);
    const selectCount = totalMeals - totalCount;

    let temp = 100 / totalMeals;
    const percentage = totalCount * temp;
    const myarr = [];
    for (let i = 0; i < totalMeals; i++) {
      myarr.push(i);
    }
    let indicatorColor = "";
    return (
      <div>
        {/* <div className='indicator-wrapper'>
          <div id='left-indicator' className={colorPicker}>
            <img className='dishicon' src={mealicon} alt='something.jpg' />
          </div>
          <div className={colorPicker}>
            <img className='dishicon' src={mealicon} alt='something.jpg' />
          </div>
          <div className={colorPicker}>
            <img className='dishicon' src={mealicon} alt='something.jpg' />
          </div>
          <div id='right-indicator' className={colorPicker}>
            <img className='dishicon' src={mealicon} alt='something.jpg' />
          </div>
        </div> */}
        <div className='indicator-wrapper'>
          <div
            style={{
              border: "1px solid #ebebeb",
              borderRadius: "50px 0px 50px 0px",
              padding: "0px 0px 0px 14px",
              height: "3rem",
              width: "100%",
              background: `-moz-linear-gradient(left,  ${
                selectCount === 0
                  ? (indicatorColor = "#42d4a8")
                  : (indicatorColor = "#dbcd65")
              } ${percentage}%, white 0%)`,
            }}
          >
            <p
              style={{
                display: this.props.displayCount,
                marginBottom: "20px",
                color: selectCount === 0 ? "white" : "black",
              }}
            >
              {selectCount === 0
                ? "All Meals Selected!"
                : `select ${selectCount} meals`}
            </p>
          </div>
        </div>
      </div>
    );
  }
}