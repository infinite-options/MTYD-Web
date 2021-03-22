import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from "./popLogin.css"

export class PopLogin extends Component {
  handleClick = () => {
    this.props.toggle();
  };

  render() {
    return (
      <div>
        <div className="modal_content">
          <span className="close" onClick={this.handleClick}>
            &times;
          </span>
          <h3>login</h3>

        </div>

      </div>
    )
  }
}

export default PopLogin

