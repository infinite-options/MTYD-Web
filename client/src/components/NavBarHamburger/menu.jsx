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
    },
    showLogout : 'none',
    showSigninSignup : 'none',
    heightOfBlock:'330px'

  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    if(window.innerWidth<=900){
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
      if(this.props.login == true){
        this.setState({
          showLogout :'flex',
          showSigninSignup:'none',
          heightOfBlock:'360px'
        })
      }else{
        this.setState({
          showLogout :'none',
          showSigninSignup:'flex',
          heightOfBlock:'400px'
        })
      }
      
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

    if(window.innerWidth<=900){
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

      if(this.props.login == true){
        this.setState({
          showLogout :'flex',
          showSigninSignup:'none',
          heightOfBlock:'360px'
        })
      }else{
        this.setState({
          showLogout :'none',
          showSigninSignup:'flex',
          heightOfBlock:'400px'
        })
      }

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
        },
        showLogout :'none',
        showSigninSignup:'none',
        heightOfBlock:'330px'
      })
    }

    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  showPopSignup = ()=>{
    this.props.close();
    this.props.togglePopSignup();
  }

  showPopLogin = ()=>{
    this.props.close();
    this.props.togglePopLogin();
  }



  render() {
    return (
        <div
          style={{
            position:"absolute",
            width:"100%",
            height:this.state.heightOfBlock,
            backgroundColor:"#F26522",
            left:"0px",
            top:"0px",
          }}
        >

        {/* <span>Window size: {this.state.width} x {this.state.height}</span> */}



          <div
          style={{
            width:'44px',
            height:'44px',
            position:'absolute',
            left:'50px',
            top:'25px',
            backgroundImage:`url(${forkClose})`,
            backgroundSize:'cover',
            backgroundPosition:'center',
          }}
          onClick={this.props.close}
          />


          <div
          style={{
            marginTop:'100px',
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

            <a href='/home'
              style ={{
                fontSize:"26px",
                height:"20px",
                color:'white',
                display:this.state.showLogout
              }}
              onClick = {this.props.LogoutFunction}
              >
              Log out
            </a>

            <a
              style ={{
                fontSize:"26px",
                height:"20px",
                color:'white',
                display:this.state.showSigninSignup
              }}
              onClick = {this.showPopLogin}
            >
              Sign In
            </a>

            <a
              style ={{
                fontSize:"26px",
                height:"20px",
                color:'white',
                display:this.state.showSigninSignup
              }}
              onClick = {this.showPopSignup}
            >
              Sign up
            </a>


          </div>



        </div>
    )
  }
}

export default MenuList
