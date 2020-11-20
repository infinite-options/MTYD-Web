import React from "react";
import {connect} from "react-redux";
import MenuItemList from "./menuItemList";

class SelectMeal extends React.Component {
  render() {
    return <MenuItemList />;
  }
}

const mapStateToProps = state => ({
  /* Put needed states from store here */
});

export default connect(mapStateToProps, {
  /* Needed functions from actions*/
})(SelectMeal);
