import React, { Component } from 'react';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import styles from './home.module.css'

class HomeLink extends Component {
    render() { 
        return (
            <React.Fragment>
                <a className = {styles.orangeButton}>{this.props.text}</a>     
            </React.Fragment>
         );
    }
}

class FootLink extends Component {
    render() { 
        return (
            <React.Fragment>
                <a className = {styles.footerButton}>{this.props.text}</a>     
            </React.Fragment>
         );
    }
}

class AmbassadorLink extends Component {
    render() { 
        return (
            <React.Fragment>
                <a className = {styles.ambassadorButton}>{this.props.text}</a>     
            </React.Fragment>
         );
    }
}
 
export {HomeLink, FootLink, AmbassadorLink};