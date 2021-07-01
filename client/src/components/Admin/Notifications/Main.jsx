import PropTypes from 'prop-types';
import { useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { descendingComparator } from '../../../reducers/helperFuncs';
import {
  Container, Row, Col, Form, Button
} from 'react-bootstrap';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  // TableSortLabel,
  Checkbox,
} from '@material-ui/core';
import styles from './notifications.module.css';

const NotificationMain = ({state, dispatch}) => {

  useEffect(() => {
    axios
      .get(`${API_URL}customer_infos`)
      .then((response) => {
        const customers_api = response.data.result;
        customers_api.sort((eltA, eltB) => {
          let result = -descendingComparator(eltA, eltB, 'customer_first_name');
          if(result !== 0) {
            return result;
          }
          result = -descendingComparator(eltA, eltB, 'customer_last_name');
          if(result !== 0) {
            return result;
          }
          result = -descendingComparator(eltA, eltB, 'customer_email');
          return result;
        })
        dispatch({ type: 'FETCH_CUSTOMERS', payload: customers_api });
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      })
  },[])

  const numCustomersSelected = state.customerSelected.length;
  const numCustomers = state.customerList.length;

  // Function to handle select all customers
  const handleSelectAllCustomersClick = (event) => {
    if (event.target.checked) {
      const newSelected = state.customerList.map(
        (customer) => customer.customer_uid
      );
      dispatch({
        type: 'SELECT_CUSTOMERS',
        payload: newSelected,
      })
    } else {
      dispatch({
        type: 'SELECT_CUSTOMERS',
        payload: [],
      })
    }
  };

  // Function to determine if customer selected
  const customerIsSelected = (customer_uid) => state.customerSelected.indexOf(customer_uid) !== -1;

  // Function to control customer selection
  const handleChangeSelection = (customer_uid) => {
    const selectedIndex = state.customerSelected.indexOf(customer_uid);
    let newSelected = [];
    if (selectedIndex === -1) {
      // Add to selected list
      newSelected = newSelected.concat(state.customerSelected, customer_uid);
    } else if (selectedIndex === 0) {
      // Remove from front
      newSelected = newSelected.concat(state.customerSelected.slice(1));
    } else if (selectedIndex === state.customerSelected.length - 1) {
      // Remove from back
      newSelected = newSelected.concat(state.customerSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      // Remove from middle
      newSelected = newSelected.concat(
        state.customerSelected.slice(0, selectedIndex),
        state.customerSelected.slice(selectedIndex + 1)
      );
    }
    dispatch({
      type: 'SELECT_CUSTOMERS',
      payload: newSelected,
    })
  };

  // Function to control changing message
  const handleMessageChange = (event) => {
    dispatch({
      type: 'EDIT_MESSAGE',
      payload: event.target.value,
    })
  }

  // Send message to selected
  const sendNotification = () => {
    // eslint-disable-next-line
    console.log('Send notification to selected');
    console.log(state.notificationType);
    console.log(state.message);
    console.log(state.customerSelected)

    let uids = ""
    for (var i = 0; i < state.customerSelected.length; i++) {
      if (i == state.customerSelected.length - 1) {
        uids = uids + state.customerSelected[i]
      } else {
        uids = uids + state.customerSelected[i] + ","
      }
    }

    console.log(uids)

    const bodyFormData = new FormData()

    bodyFormData.append('uids', uids)
    bodyFormData.append('message', state.message)

    if (state.notificationType == 'Notifications') {
      axios({
        method: "post", url: 
        `${API_URL}Send_Notification/customer`,
        data: bodyFormData,
        headers: {"Content-Type": "multipart/form-data"}
      })
        .then((response) => {
          console.log(response)
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (state.notificationType == 'SMS') {
      // SMS endpoint goes here
      console.log("SMS endpoint not implememnted")
    }

    

  }

  // Send message to all
  const sendNotificationToAll = () => {
    // eslint-disable-next-line
    console.log('Send notification to all');
    console.log(state.customerList)

    let uids = ""
    for (var i = 0; i < state.customerList.length; i++) {
      if (i == state.customerList.length - 1) {
        uids = uids + state.customerList[i].customer_uid
      } else {
        uids = uids + state.customerList[i].customer_uid + ","
      }
    }

    console.log(uids)

    const bodyFormData = new FormData()

    bodyFormData.append('uids', uids)
    bodyFormData.append('message', state.message)

    if (state.notificationType == 'Notifications') {
      axios({
        method: "post", url: 
        `${API_URL}Send_Notification/customer`,
        data: bodyFormData,
        headers: {"Content-Type": "multipart/form-data"}
      })
        .then((response) => {
          console.log(response)
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (state.notificationType == 'SMS') {
      // SMS endpoint goes here
      console.log("SMS endpoint not implememnted")
    }
  }
  
  return (
    <div>
      <Container
        style={{
          maxWidth: 'inherit',
        }}
      >
        <Row style = {{
          // width:"96%",
          // marginLeft: "1%",
          // marginRight: "1%",
        }}>
          <Col md="8" className={styles.containerList}>
          
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      indeterminate={
                        numCustomersSelected > 0 &&
                        numCustomersSelected < numCustomers
                      }
                      checked={
                        numCustomers > 0 && numCustomersSelected === numCustomers
                      }
                      onChange={handleSelectAllCustomersClick}
                      inputProps={{ 'aria-label': 'Select all customers' }}
                    />
                  </TableCell>
                  <TableCell style = {{color: "#F26522"}}>
                    Name
                  </TableCell>
                  <TableCell style = {{color: "#F26522"}}>
                    Email
                  </TableCell>
                  <TableCell style = {{color: "#F26522"}}>
                    Address
                  </TableCell>
                  <TableCell style = {{color: "#F26522"}}>
                    # Orders
                  </TableCell>
                  <TableCell style = {{color: "#F26522"}}>
                    Last Order
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  state.customerList.map(
                    (customer) => {
                      return (
                        <>
                          <TableRow
                            key={customer.customer_uid}
                          >
                            <TableCell>
                              <Checkbox
                                checked={customerIsSelected(customer.customer_uid)}
                                onChange={() => handleChangeSelection(customer.customer_uid)}
                                inputProps={{
                                  'aria-label':
                                    'Select customer id ' + customer.customer_uid,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {`${customer.customer_first_name} ${customer.customer_last_name}`}
                            </TableCell>
                            <TableCell>
                              {`${customer.customer_email}`}
                            </TableCell>
                            <TableCell>
                              {`${customer.customer_address}, ${customer.customer_city}, ${customer.customer_zip}`}
                            </TableCell>
                            <TableCell>
                              {`${customer['count(purchase_id)']}`}
                            </TableCell>
                            <TableCell>
                              {`${customer['max(purchase_date)'] ? customer['max(purchase_date)'] : ''}`}
                            </TableCell>
                          </TableRow>
                        </>
                      )
                    }
                  )
                }
              </TableBody>
            </Table>
          </Col>
          {/* <Col md="1"></Col> */}
          <Col /*md="4"*/ className={styles.containerText}>
          
            <div>
              <Row>
                <Col>
                  <Form.Control
                    as="textarea"
                    rows={20}
                    value={state.message}
                    onChange={handleMessageChange}
                    style={{marginTop: "3%"}}
                  />
                </Col>
              </Row>
              <Row
                className={styles.notificationItem}
              >
                <Col>
                  <Button
                    style={{backgroundColor:"#F26522", borderRadius: "15px"}}
                    onClick={sendNotification}
                  >
                    Send Notifications
                  </Button>
                </Col>
                <Col>
                  <Button
                    style={{
                      backgroundColor:"#F26522",
                      float:"right",
                      borderRadius: "15px"
                    }}
                    onClick={sendNotificationToAll}
                  >
                    Send to All
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

NotificationMain.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default NotificationMain;