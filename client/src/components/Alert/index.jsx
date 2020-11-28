import React from "react";
import {connect} from "react-redux";

const Alert = props => {
  return (
    <div className='d-flex align-items-center justify-content-center'>
      {props.alerts.length > 0 &&
        props.alerts.map(alert => (
          <div key={alert.id}>
            <p className='text-light bg-danger' style={{fontSize: "20px"}}>
              {alert.msg}
            </p>
          </div>
        ))}
    </div>
  );
};
const mapStateToProps = state => ({
  alerts: state.alert
});
export default connect(mapStateToProps, {})(Alert);
