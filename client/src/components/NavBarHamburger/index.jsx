import React, { Component } from 'react'
import Menu from './menu'
import hamburger from './hamburger.png'

export class NavMenu extends Component {

  state = {
    popSeen:false,
    width:window.innerWidth,
    height:window.innerHeight,
  }

  togglePopMenu = () => {
    this.setState({
     popSeen: !this.state.popSeen,
    });
  };



  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };


  render() {

    return (
      <div>
        <div>

          {/* <span>Window size: {this.state.width} x {this.state.height}</span> */}
          <div
          style={{
            position:"absolute",
            width:"60px",
            height:"40px",
            left:"60px",
            top:"20px",
            backgroundImage:`url(${hamburger})`,
            backgroundSize:'cover',
          }}
          onClick={this.togglePopMenu}
          >
          </div>
          {this.state.popSeen?
          <Menu 
            close = {this.togglePopMenu}
            login = {this.props.login}
            LogoutFunction = {this.props.LogoutFunction}
            togglePopSignup = {this.props.togglePopSignup}
            togglePopLogin = {this.props.togglePopLogin}
          />:null}
        </div>

      </div>
    )
  }
}

export default NavMenu
