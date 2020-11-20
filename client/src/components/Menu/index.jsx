import React from "react";
import styles from "./menu.module.css";
import takeaway from "./static/take-away.svg";
import calendar from "./static/Calendar.svg";
import group from "./static/Group 1682.svg";
import lunch from "./static/lunch.svg";
import {Link} from "react-router-dom";

const Menu = props => {
  return (
    <div className={props.show ? styles.menu : styles.menu1}>
      {props.show && props.message}
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
          MEALS AVAILABLE
        </Link>
      </div>
    </div>
  );
};

export default Menu;
