import React, { Component } from 'react';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import styles from './home.module.css'
import {Link} from "react-router-dom";

class HomeLink extends Component {
    render() { 
        return (
            <Link className = {styles.orangeButton} to={this.props.link}>
              {this.props.text}
            </Link>
         );
    }
}

class AddressLink extends Component {
  render() { 
      return (
        <button 
          onClick={this.props.popSignup}
          className={styles.orangeButton}
        >
          {this.props.text}
        </button>
       );
  }
}

class FootLink extends Component {
    render() { 
        return (
            <Link className = {styles.footerButton} to={this.props.link}>
              {this.props.text}
            </Link>
         );
    }
}

class AmbassadorLink extends Component {
    state = {
       seen: false
       };
    togglePop = () => {
       this.setState({
       seen: !this.state.seen
       });
     };	
    render() { 
        return (
            <Link className = {styles.ambassadorButton} to={this.props.link}>
              {this.props.text}
            </Link>
         );
    }
}
class AppForAmbassador extends Component {
    state = {
       seen: false
    };
    togglePop = () => {
       this.setState({
       seen: !this.state.seen
    });
    };
    render() {
         return (
             <div>
               <div className="btn" onClick={this.togglePop}>
               <button>New User?</button>
               </div>
              {this.state.seen ? <PopUp toggle={this.togglePop} /> : null}
             </div>
            );
        }
}
class PopUp extends Component {
    handleClick = () => {
        this.props.toggle();
    };
    render() {
        return (
          <div className="modal">
          <div className="modal_content">
          <span className="close" onClick={this.handleClick}>&times;    </span>
     <p>I'm A Pop Up!!!</p>
    </div>
   </div>
  );
 }
}
export {PopUp, HomeLink, FootLink, AmbassadorLink, AddressLink, AppForAmbassador};