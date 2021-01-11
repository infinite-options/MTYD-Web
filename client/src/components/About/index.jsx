import React from "react";
import {Link} from "react-router-dom";
import {WebNavBar} from "../NavBar";
import Menu from "../Menu";
import styles from "./about.module.css"

const About = () => {
  return (
    <>
      <div className = {styles.root}>
        <WebNavBar />
        <Menu show={false} />
      
        <h1 style = {{textAlign: "center"}}>Nutrition Made Easy</h1>
        <h5 style = {{textAlign: "center", padding: "0 20% 0 20%", color: "#999"}}>
          MealsFor.me makes it easy to have highly nutritious meals curated from a variety of sources delivered strait to your door. 
          That way you are always sure to have a nutritious meal at your fingertips coupled with a wide variety of cuisines and tastes. 
          Order what you want and eat healty.
        </h5>
        <h3 style = {{textAlign: "center", color: "#ff5349"}}>
          3 Easy Steps
        </h3>
        <div className = {styles.container}>
          <div className = {styles.box}> 
            <h5 className = {styles.stepsTitle}>1) Find a subscription that works for you</h5>
            <h6 className = {styles.stepsText}>Pay weekly or get discounted pricing by pre-ordering</h6>
          </div>
          <div className = {styles.box}> 
            <h5 className = {styles.stepsTitle}>2) Select a meal you want and click save</h5>
            <h6 className = {styles.stepsText}>Nutritional facts on each meal are provided</h6>
          </div>
          <div className = {styles.box}> 
            <h5 className = {styles.stepsTitle}>3) Heat and enjoy</h5>
            <h6 className = {styles.stepsText}>Place old containers outside on your next delivery date</h6>
          </div>
        </div>
        <Link to="weekly-menu" className = {styles.centerLink}>
          <h3>Browse our menu for this week</h3>
        </Link>
        <Link to = "/sign-up" className = {styles.centerLink}>
          <h3>Sign Up</h3>
        </Link>
      </div>

    </>
  );
};

export default About;
