import React, { Component } from 'react';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import styles from './home.module.css'
import {Link} from "react-router-dom";

class HomeLink extends Component {
    render() { 
        let buttonStyle = this.props.style
        return (
            <Link className = {styles.orangeButton} to={this.props.link}>
              {this.props.text}
            </Link>
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
    render() { 
        return (
            <Link className = {styles.ambassadorButton} to={this.props.link}>
              {this.props.text}
            </Link>
         );
    }
}
 
export {HomeLink, FootLink, AmbassadorLink};