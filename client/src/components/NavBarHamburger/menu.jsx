import React, { Component } from 'react'
import {Link} from "react-router-dom";
import forkClose from '../../images/forkClose.png'

export class MenuList extends Component {
  render() {
    return (
        <div
        style={{
          position:"absolute",
          width:"100%",
          // height:"393px",
          height: '430px',
          backgroundColor:"#F26522",
          left:"0px",
          top:"0px",
        }}
        >

          <div
          style={{
            width:'44px',
            height:'44px',
            position:'absolute',
            right:'100px',
            top:'25px',
            backgroundImage:`url(${forkClose})`,
            backgroundSize:'cover',
            backgroundPosition:'center',
          }}
          onClick={this.props.close}
          />


          <div
          style={{
            marginTop:'150px',
          }}>

            <a href='/home'
              style ={{
                fontSize:"26px",
                height:"20px",
                color:'white'
              }}>
              Home
            </a >

            <a href='/select-meal'
              style ={{
                fontSize:"26px",
                height:"20px",
                color:'white'
              }}>
              Select Meals
            </a>

            <a href='/meal-plan'
              style ={{
                fontSize:"26px",
                height:"20px",
                color:'white'
              }}>
              Change Meal Plans
            </a>

            <a href='/choose-plan'
              style ={{
                fontSize:"26px",
                height:"20px",
                color:'white'
              }}>
              Add Subscriptions
            </a >

            <a href='/subscription-history'
              style ={{
                fontSize:"26px",
                height:"20px",
                color:'white'
              }}>
              Subscription History
            </a >

             <a 
              style ={{
                fontSize:"26px",
                height:"20px",
                color:'white'
              }}>
              Become an Ambassador
            </a >

            <a href='/meal-plan'
              style ={{
                fontSize:"26px",
                height:"20px",
                color:'white'
              }}>
              Log out
            </a>

          </div>



        </div>
    )
  }
}

export default MenuList
