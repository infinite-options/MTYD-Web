import React from "react";
import { connect } from "react-redux";
import SelectPlan from "./selectPlan";
// Import needed actions

class ChoosePlan extends React.Component {
  render() {
    return (
      <div>
        <SelectPlan />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  /* Put needed states from store here */
});

export default connect(mapStateToProps, {
  /* Needed functions from actions*/
})(ChoosePlan);
