import React, { Component } from 'react';
import SignUp from '../Landing/index'
import styles from './home.module.css'

class SignUpHome extends Component {
    state = { 
        displayCheck: false,
        toggleSignUp: styles.signUpPopUpHide
     }

     toggleDisplay = () => {
         if(this.state.displayCheck === false) {
            this.setState({
                toggleSignUp: styles.signUpPopUpShow,
                displayCheck: true
            })
         }else{
            this.setState({
                toggleSignUp: styles.signUpPopUpHide,
                displayCheck: false
            })
         }
         
     }

    render() { 
        return (
            <React.Fragment>
                <a className = {styles.signUpLink} onClick = {this.toggleDisplay}>Start Your Subsciption</a>  
                <div className = {this.state.toggleSignUp}>
                    <div className = {styles.signUpContainer}>
                        
                        <a  style = {{
                            color: 'black',
                            textAlign: 'center', 
                            fontSize: '45px', 
                            zIndex: '2', 
                            float: 'right', 
                            position: 'absolute', top: '0px', left: '450px', 
                            transform: 'rotate(45deg)', 
                            cursor: 'pointer'}} 
                            
                            onClick = {this.toggleDisplay}>+</a>
                        <SignUp />
                    </div>
                </div>
                
            </React.Fragment>
            
         );
    }
}
 
export default SignUpHome;