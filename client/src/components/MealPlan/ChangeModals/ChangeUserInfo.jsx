import React, {useState, useEffect} from "react";
import {Modal, Button} from "react-bootstrap";
import {connect} from "react-redux";

import styles from "../../ChoosePlan/choosePlan.module.css";
import modalStyle from "./changeModal.module.css";

import {setUserInfo} from "../../../reducers/actions/subscriptionActions";
import Axios from "axios";

const ChangeUserInfo = props => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    props.setUserInfo({});
    props.changeOpen();
  };
  const customer_uid = props.customer_uid;
  const {firstName, lastName, phoneNumber, email} = props.addressInfo;
  const {street, unit, city, state, zip} = props.address;
  const {number, cvv, month, year} = props.creditCard;
  const cc_zip = props.creditCard.zip;

  const handleChangeInput = e => {
    props.setUserInfo({[e.target.name]: e.target.value});
  };

  const submitChange = () => {
    const data = {
      customer_uid: customer_uid,
      purchase_uid: props.purchase_uid,
      first_name: firstName,
      last_name: lastName,
      phone: phoneNumber,
      email,
      address: street,
      unit,
      city,
      state,
      zip,
      cc_num: props.creditCard.number.toString(),
      cc_cvv: props.creditCard.cvv.toString(),
      cc_zip: props.creditCard.zip.toString(),
      cc_exp_date:
        props.creditCard.year + "-" + props.creditCard.month + "-" + "01"
    };
    console.log("data sending: ", data);
    Axios.post(
      "https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/update_delivery_info",
      data
    )
      .then(res => {
        //should update state right here
        console.log(res);
        window.location.reload(false);
      })
      .catch(err => {
        console.log("Error happened when changing user info.");
        console.log(err);
      });
  };
  useEffect(() => {
    if (props.isShow) {
      setShow(!show);
    }
  }, []);
  return (
    <>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header className={modalStyle.modalTitle} closeButton>
          <Modal.Title>CHANGE DELIVERY INFORMATION</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={modalStyle.modalContainer}>
            <p>DELIVERY ADDRESS</p>
            <div className={modalStyle.sameLine2Input + " row"}>
              <input
                type='text'
                placeholder='First Name'
                value={firstName}
                name='customer_first_name'
                onChange={handleChangeInput}
              />
              <input
                type='text'
                placeholder='Last Name'
                value={lastName}
                name='customer_last_name'
                onChange={handleChangeInput}
              />
            </div>

            <div className={"row " + modalStyle.sameLine1Input}>
              <input
                type='text'
                placeholder='Email'
                value={email}
                name='delivery_email'
                onChange={handleChangeInput}
              />
            </div>
            <div className={"row " + modalStyle.sameLine1Input}>
              <input
                type='text'
                placeholder='Street'
                value={street}
                name='delivery_address'
                onChange={handleChangeInput}
              />
            </div>
            <div className={"row " + modalStyle.sameLine3Input}>
              <input
                type='text'
                placeholder='Unit'
                value={unit}
                name='delivery_unit'
                onChange={handleChangeInput}
              />
              <input
                type='text'
                placeholder='City'
                value={city}
                name='delivery_city'
                onChange={handleChangeInput}
              />
              <input
                type='text'
                placeholder='State'
                value={state}
                name='delivery_state'
                onChange={handleChangeInput}
              />
            </div>

            <div className={"row " + modalStyle.sameLine2Input}>
              <input
                type='text'
                placeholder='zip'
                value={zip}
                name='delivery_zip'
                onChange={handleChangeInput}
              />
              <input
                type='text'
                placeholder='Phone Number'
                value={phoneNumber}
                name='delivery_phone_num'
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <div className={modalStyle.modalContainer}>
            <p>BILLING INFORMATION</p>
            <div className={"row " + modalStyle.sameLine1Input}>
              <input
                type='text'
                placeholder='Credit Card Number'
                value={number}
                name='cc_num'
                onChange={handleChangeInput}
                aria-label="Enter your card number"
                title="Enter your card number"
              />
            </div>
            <div className={"row " + modalStyle.sameLine2Input}>
              <input
                type='text'
                placeholder='CVV/CVC'
                value={cvv}
                name='cc_cvv'
                onChange={handleChangeInput}
                aria-label="Enter your card's CVV/CVC"
                title="Enter your card's CVV/CVC"
              />
              <input
                type='text'
                placeholder='Card Zip code'
                value={cc_zip}
                name='cc_zip'
                onChange={handleChangeInput}
                aria-label="Enter your card zip code"
                title="Enter your card zip code"
              />
            </div>

            <div className={"row " + modalStyle.sameLine2Input}>
              <input
                type='text'
                placeholder='Credit Card Month Expire'
                value={month}
                name='month'
                onChange={handleChangeInput}
                aria-label="Enter the month your card expires"
                title="Enter the month your card expires"
              />
              <input
                type='text'
                placeholder='Credit Card Year Expire'
                value={year}
                name='year'
                onChange={handleChangeInput}
                aria-label="Enter the year your card expires"
                title="Enter the year your card expires"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={submitChange}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
const mapStateToProps = state => ({
  customer_uid: state.login.userInfo.customerId,
  purchase_uid: state.subscribe.currentPurchase,
  addressInfo: state.subscribe.addressInfo,
  address: state.subscribe.address,
  creditCard: state.subscribe.creditCard
});
export default connect(mapStateToProps, {setUserInfo})(ChangeUserInfo);
