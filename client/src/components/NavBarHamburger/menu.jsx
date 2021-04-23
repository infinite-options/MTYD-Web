import React, { Component } from 'react'
import {Link} from "react-router-dom";

export class MenuList extends Component {
  render() {
    return (
      <div>
        <div
        style={{
          position:"absolute",
          width:"150px",
          height:"100px",
          backgroundColor:"red",
          left:"60px",
          top:"85px",
        }}
        >

          <a href='/choose-plan'
            style ={{
              fontSize:"15px",
              height:"20px",
            }}>
            SUBSCRIPTION
          </a >
          <a href='/meal-plan'
            style ={{
              fontSize:"15px",
              height:"20px",
            }}>
            MEAL PLAN
          </a>
          <a href='/select-meal'
            style ={{
              fontSize:"15px",
              height:"20px",
            }}>
            SELECT MEAL
          </a>

        </div>
      </div>
    )
  }
}

export default MenuList
