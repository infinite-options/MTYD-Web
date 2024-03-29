import {Component} from "react";
import styles from "./selectmeal.module.css";
import unselect from "../../images/unselected.png"
import select from "../../images/selection.png"

class MealIndicator extends Component {

  render() {
    // console.log("(MealIndicator) props: ", this.props);
    const {totalCount} = this.props;
    const {totalMeals} = this.props;
    const {displayCount} = this.props;
    const selectCount = totalMeals - totalCount;
    let temp = 100 / totalMeals;
    const percentage = totalCount * temp;

    // console.log('total count is '+ totalCount);
    // console.log('totalmeals is ' + totalMeals)


    const myarr = [];

    for (let i = 0; i < totalCount; i++) {
      myarr.push(
        <div
          style={{
            width:"30px",
            minWidth: '30px',
            height:"30px",
            backgroundImage:`url(${select})`,
            backgroundSize:'cover',
            backgroundPosition:'center',
            margin:'10px',
            // border: '1px solid navy',
          }}
        />
      );
    }

    for (let i = 0; i < totalMeals-totalCount; i++) {
      myarr.push(
        <div
          className={styles.plateIcon}
          style={{
            // width:"30px",
            // minWidth: '30px',
            // height:"30px",
            // margin:'10px',
            // marginLeft: '20px',
            // border: '1px solid cyan',
            backgroundImage:`url(${unselect})`,
            backgroundSize:'cover',
            backgroundPosition:'center'
          }}
        />
      );
    }

    let indicatorColor = "";
    return (
      <div className={styles.indicatorWrapper}>
        {/* <h4
          style={{
            // padding: '10px', 
            fontSize: '24px', 
            display:'inline-block',
            overflow:'hidden',
            whiteSpace:'nowrap',
            color:"black",
            border: '1px solid purple'
          }}
        > */}
        <div
          className={styles.indicatorText}
          // style={{
          //   border: '1px solid purple',
          //   width: '42%',
          //   marginLeft: '8%'
          // }}
        >
          {this.props.totalMeals==null?"Select meals after signup":
            (selectCount === 0
            ? "All Meals Selected!"
            : `Select ${selectCount} Meals`)}
        </div>
        {/* </h4> */}

        {/* <div
          style={{
            position:'absolute',
            display:"flex",
            right:'200px',
            border: '1px solid green'
          }}
        > */}
        <div
          className={styles.indicatorPlates}
          // style={{
          //   border: '1px solid green',
          //   display: 'flex',
          //   flexDirection: 'row-reverse',
          //   width: '42%',
          //   float: 'right'
          // }}
        >
          {myarr}
        </div>
          {/* {myarr} */}
        {/* </div> */}
          
      </div>
    );
  }
}

export default MealIndicator;
