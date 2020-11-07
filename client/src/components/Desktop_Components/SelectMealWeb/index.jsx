import React from "react";
import { connect } from "react-redux";
import MenuItemList from "./menuItemList";

class SelectMealWeb extends React.Component {
  render() {
    return (
      <div style={{ backgroundColor: "black" }}>
        <MenuItemList />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  /* Put needed states from store here */
});

export default connect(mapStateToProps, {
  /* Needed functions from actions*/
})(SelectMealWeb);
