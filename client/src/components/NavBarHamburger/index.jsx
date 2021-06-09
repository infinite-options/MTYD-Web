import React, { Component } from 'react'
import Menu from './menu'
import hamburger from './hamburger.png'
import { StylesProvider } from '@material-ui/styles';
// import styles from "../NavBar/navBar.module.css";

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
    console.log("navbar hamburgermenu props: ", this.props);
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
      <div 
        // style={{
        //   border: 'inset', 
        //   width: '40%',
        //   minWidth: '100px'
        // }}
        style={
          this.props.isAdmin && this.state.width > 900
            ? {
                // border: 'inset',
                width: '20%',
                // minWidth: '100px'
              }
            : {
                // border: 'inset',
                width: '40%',
                // minWidth: '100px'
              }
        }
      >
        <div>

          {/* <span>Window size: {this.state.width} x {this.state.height}</span> */}
          <div
            style={{
              // position:"absolute",
              width:"60px",
              height:"40px",
              marginLeft: '30px',
              // left:"60px",
              // top:"20px",
              backgroundImage:`url(${hamburger})`,
              backgroundSize:'cover',
              // border: 'solid',
              cursor: 'pointer'
            }}
            // className={styles.hamMenu}
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
            firstName = {this.props.firstName}
            lastName = {this.props.lastName}
            isAdmin = {this.props.isAdmin}
          />:null}
        </div>

      </div>
    )
  }
}

export default NavMenu
