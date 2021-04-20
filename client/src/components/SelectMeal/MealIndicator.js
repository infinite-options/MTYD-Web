import React, {Component} from "react";
import styles from "./selectmeal.module.css";
import unselect from "./images/unselected.png"
import select from "./images/selected.png"

class MealIndicator extends Component {

  render() {
    const {totalCount} = this.props;
    const {totalMeals} = this.props;
    const {displayCount} = this.props;
    const selectCount = totalMeals - totalCount;
    let temp = 100 / totalMeals;
    const percentage = totalCount * temp;



    const myarr = [];
    for (let i = 0; i < totalMeals-totalCount; i++) {
      myarr.push(
        <div
        style={{
          width:"30px",
          height:"30px",
          margin:'10px',
          backgroundImage:`url(${unselect})`,
          backgroundSize:'cover',
          backgroundPosition:'center'
        }}
        />
      );
    }
    for (let i = 0; i < totalCount; i++) {
      myarr.push(
        <div
        style={{
          width:"30px",
          height:"30px",
          backgroundImage:`url(${select})`,
          backgroundSize:'cover',
          backgroundPosition:'center',
          margin:'10px',
        }}
        />

      );
    }





    let indicatorColor = "";
    return (
      <div className={styles.indicatorWrapper}>
        <h4
          style={{
            padding: '10px', 
            fontSize: '24px', 
            display:'inline-block',
            overflow:'hidden',
            whiteSpace:'nowrap',
            color:"black"
          }}
        >
          {selectCount === 0
            ? "All Meals Selected!"
            : `Select ${selectCount} meals`}
        </h4>

        <div
        style={{
          position:'absolute',
          display:"flex",
          right:'200px',
        }}

        >
          {myarr}
        </div>
          


        {/* <div
          style={{
            border: "1px solid #ebebeb",
            borderColor: "#dbcd65",
            borderRadius: "50px 0px 50px 0px",
            padding: "0px 0px 0px 16px",
            height: "2rem",
            width: "100%",
            backgroundImage: `linear-gradient(to right, ${
              selectCount === 0
                ? (indicatorColor = "#ff9900")
                : (indicatorColor = "#ff9900")
            } ${percentage}%, #e0d19e 0%)`
          }}
        /> */}



      </div>
    );
  }
}

export default MealIndicator;
