import React, {Component} from "react";
import styles from "./selectmeal.module.css";
export default class MealIndicator extends Component {
  render() {
    const {totalCount} = this.props;
    const {totalMeals} = this.props;
    const {displayCount} = this.props;
    const selectCount = totalMeals - totalCount;
    let temp = 100 / totalMeals;
    const percentage = totalCount * temp;
    const myarr = [];
    for (let i = 0; i < totalMeals; i++) {
      myarr.push(i);
    }

    let indicatorColor = "";
    return (
      <div className={styles.indicatorWrapper}>
        <div
          style={{
            border: "1px solid #ebebeb",
            borderColor: "#dbcd65",
            borderRadius: "50px 0px 50px 0px",
            padding: "0px 0px 0px 16px",
            height: "2rem",
            // margin: "0.3rem 2.5rem",
            width: "100%",
            backgroundImage: `linear-gradient(to right, ${
              selectCount === 0
                ? (indicatorColor = "#ff9900")
                : (indicatorColor = "#ff9900")
            } ${percentage}%, #e0d19e 0%)`
          }}
        >
          <p
            style={{
              margin: "auto auto",
              color: "black",
              fontSize: "1rem"
            }}
          >
            {selectCount === 0
              ? "All Meals Selected!"
              : `select ${selectCount} meals`}
          </p>
        </div>
      </div>
    );
  }
}
