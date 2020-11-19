import React from "react";
import Subscribe from "../NavBar/subscribe.png";
import Select from "../NavBar/select.png";
import Profile from "../NavBar/profile.png";
import More from "../NavBar/more.png";
import {Link} from "react-router-dom";

import styles from "./navBar.module.css";

class SideNavBar extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.navContainer}>
          <Link to='/choose-plan'>
            <div className={styles.navElt}>
              <img src={Subscribe} alt='Subscribe' />
            </div>
          </Link>
          <Link to='/profile'>
            <div className={styles.navElt}>
              <img src={Profile} alt='Profile' />
            </div>
          </Link>
          <Link to='/select-meal'>
            <div className={styles.navElt}>
              <img src={Select} alt='Select' />
            </div>
          </Link>
          <div className={styles.navElt}>
            <img src={More} alt='More' />
          </div>
        </div>
      </div>
    );
  }
}

class BottomNavBar extends React.Component {
  render() {
    return (
      <div className='navbar'>
        <div className='meal-footer'>
          <Link to='/choose-plan'>
            <div className='footer-icon-tray'>
              <img src={Subscribe} alt='Subscribe' className='footer-icons' />
              <p>Subscribe</p>
            </div>
          </Link>
          <Link to='/select-meal'>
            <div className='footer-icon-tray'>
              <img src={Select} alt='Select' className='footer-icons' />
              <p>Select</p>
            </div>
          </Link>
          <Link to='/profile'>
            <div className='footer-icon-tray'>
              <img src={Profile} alt='Profile' className='footer-icons' />
              <p>Profile</p>
            </div>
          </Link>
          <div className='footer-icon-tray'>
            <img src={More} alt='More' className='footer-icons' />
            <p>More</p>
          </div>
        </div>
      </div>
    );
  }
}

class WebNavBar extends React.Component {
  render() {
    return (
      <div className={styles.navbar}>
        <div>
          <h4 style={{color: "orange", fontSize: "20px"}}>LOGO</h4>
        </div>
        <ul>
          <Link to='/'>HOME</Link>
          <Link to='/about'>ABOUT</Link>
          <Link to='/profile'>PROFILE</Link>
        </ul>
      </div>
    );
  }
}

export {WebNavBar, BottomNavBar, SideNavBar};
