import React, { Component } from 'react'
import Menu from './menu'
import hamburger from './hamburger.png'

export class NavMenu extends Component {

  state = {
    popSeen:false,
  }

  togglePopMenu = () => {
    this.setState({
     popSeen: !this.state.popSeen,
    });
   };


  render() {

    return (
      <div>
        <div>
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
          <Menu close = {this.togglePopMenu}/>:null}
        </div>

      </div>
    )
  }
}

export default NavMenu
