import React, { Component } from 'react'
import {Link} from "react-router-dom";

export class MenuList extends Component {
  render() {
    return (
        <div
        style={{
          position:"absolute",
          width:"100%",
          height:"393px",
          backgroundColor:"#F26522",
          left:"0px",
          top:"0px",
        }}
        >

          <div
          style={{
            width:'44px',
            height:'44px',
            backgroundColor:'red',
            position:'absolute',
            right:'100px',
            top:'25px'
          }}
          onClick={this.props.close}
          />


          <div
          style={{
            marginTop:'150px',
          }}>
            <a href='/choose-plan'
              style ={{
                fontSize:"15px",
                height:"20px",
                color:'white'
              }}>
              SUBSCRIPTION
            </a >
            <a href='/meal-plan'
              style ={{
                fontSize:"15px",
                height:"20px",
                color:'white'
              }}>
              MEAL PLAN
            </a>
            <a href='/select-meal'
              style ={{
                fontSize:"15px",
                height:"20px",
                color:'white'
              }}>
              SELECT MEAL
            </a>
          </div>



        </div>
    )
  }
}

export default MenuList
