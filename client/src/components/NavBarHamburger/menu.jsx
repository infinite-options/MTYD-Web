import React, { Component } from 'react'
import {Link} from "react-router-dom";
import forkClose from '../../images/forkClose.png'

export class MenuList extends Component {

  state = {
    width:window.innerWidth,
    height:window.innerHeight,
    crossFork : 
    {           
      width:'44px',
      height:'44px',
      position:'absolute',
      right:'100px',
      top:'25px',
      backgroundImage:`url(${forkClose})`,
      backgroundSize:'cover',
      backgroundPosition:'center',
    }

  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    if(window.innerWidth<=800){
      this.setState({
        crossFork:{
          width:'44px',
          height:'44px',
          position:'absolute',
          left:'50px',
          top:'25px',
          backgroundImage:`url(${forkClose})`,
          backgroundSize:'cover',
          backgroundPosition:'center',
        }
      })
    }else{
      this.setState({
        crossFork:{
          width:'44px',
          height:'44px',
          position:'absolute',
          right:'100px',
          top:'25px',
          backgroundImage:`url(${forkClose})`,
          backgroundSize:'cover',
          backgroundPosition:'center',
        }
      })
    }


  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {

    if(window.innerWidth<=800){
      this.setState({
        crossFork:{
          width:'44px',
          height:'44px',
          position:'absolute',
          left:'50px',
          top:'25px',
          backgroundImage:`url(${forkClose})`,
          backgroundSize:'cover',
          backgroundPosition:'center',
        }
      })
    }else{
      this.setState({
        crossFork:{
          width:'44px',
          height:'44px',
          position:'absolute',
          right:'100px',
          top:'25px',
          backgroundImage:`url(${forkClose})`,
          backgroundSize:'cover',
          backgroundPosition:'center',
        }
      })
    }

    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };



  render() {
    return (
        <div
        style={{
          position:"absolute",
          width:"100%",
          height:"430px",
          backgroundColor:"#F26522",
          left:"0px",
          top:"0px",
        }}
        >

        {/* <span>Window size: {this.state.width} x {this.state.height}</span> */}



          <div
          style={this.state.crossFork}
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
            </a>

            <a href='/'
              style ={{
                fontSize:"26px",
                height:"20px",
                color:'white'
              }}>
              Become an Ambassador
            </a>

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
