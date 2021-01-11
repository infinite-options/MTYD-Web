import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {WebNavBar} from "../NavBar";
import Menu from "../Menu";
import styles from "./weeklyMenu.module.css"

class WeeklyMenu extends Component {
  state = {
    menuItems: []
    }

  componentDidMount() {
    const menuUrl = "https://kur4j57ved.execute-api.us-west-1.amazonaws.com/dev/api/v2/upcoming_menu"
    fetch(menuUrl)
      .then((response) => response.json())
      .then((data) => this.processData(data.result));
  }

  processData = (data) => {
    // console.log(data)
    const date = data[0].menu_date
    // console.log(date)
    let filteredData = []
    for (var x = 0; x < data.length; x++) {
      if(data[x].menu_date === date) {
        filteredData.push(data[x])
      } else { 
        break
      }
    }

    // console.log(filteredData)
    this.setState({
      menuItems: filteredData
    })
  }
  
  menuLoop = () => {
    let menuHTML

    if (this.state.menuItems.length) {
      menuHTML = this.state.menuItems.map((item, index) =>
      <div key = {index} className = {styles.menuCard}>
        <img className = {styles.imgRescale} src = {item.meal_photo_URL}/>
        <h6>{item.meal_name}</h6>
      </div>
          
      )
    }

    return menuHTML

  }

  render() { 
    return (
      <>
        <WebNavBar />
        <Menu show={false} />
        <div>
          <div className = {styles.menuCardContainer}>
           {this.menuLoop()}
          </div>
          <Link to = "/sign-up" className = {styles.signupLink} >
            <h3 style = {{padding: '0 10px 0 10px'}}>Sign Up</h3>
          </Link>
          <Link to = "/about" className = {styles.backLink}>
            <h3 style = {{padding: '0 10px 0 10px'}}>Back</h3>
          </Link>
        </div>
      </>
    )
  }
}
 
export default WeeklyMenu;