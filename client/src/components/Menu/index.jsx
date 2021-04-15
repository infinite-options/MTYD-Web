import React from "react";
import styles from "./menu.module.css";
import takeaway from "./static/take-away.svg";
import calendar from "./static/Calendar.svg";
import group from "./static/Group 1682.svg";
import lunch from "./static/lunch.svg";
import {Link} from "react-router-dom";

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};


const Menu = props => {
  return (
    <div className={props.show ? styles.menu : styles.menu1}>

      {/*console.log("Menu message: " + props.message)}
      {console.log("Menu show?: " + props.show)}
      {console.log("Menu login: " + props.login)*/}

        {(props.login===3)?
          <div>
            {props.show && props.message}
            
            {/* <button class={styles.subscribe}>
              <a href="/choose-plan" style={{
                color:"black",
              }}>
              Click to subscribe
              </a>
            </button> */}
          </div>
          :(
          <div className={styles.selectBtn + " " + (!props.show && styles.w5)}>
          <Link to='/choose-plan'>
            <img src={group} alt='Subscription' />
            SUBSCRIPTION
          </Link>
          <Link to='/meal-plan'>
            <img src={lunch} alt='MEAL PLAN' />
            MEAL PLAN
          </Link>
          <Link to='/select-meal'>
            <img src={calendar} alt='MEALS AVAILABLE' />
            SELECT MEAL
          </Link>
        </div>)
        }
        

      
    </div>
  );
};

export default Menu;
