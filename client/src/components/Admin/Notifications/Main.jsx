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
  }

  // Send message to all
  const sendNotificationToAll = () => {
    // eslint-disable-next-line
    console.log('Send notification to all');
  }
  
  return (
    <div>
      <Container
        style={{
          maxWidth: 'inherit',
        }}
      >
        <Row>
          <Col md="8">
            <Table>
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
                  <TableCell>
                    Name
                  </TableCell>
                  <TableCell>
                    Email
                  </TableCell>
                  <TableCell>
                    Address
                  </TableCell>
                  <TableCell>
                    # Orders
                  </TableCell>
                  <TableCell>
                    Last Order
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  state.customerList.map(
                    (customer) => {
                      return (
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
                      )
                    }
                  )
                }
              </TableBody>
            </Table>
          </Col>
          <Col md="4">
            <Row>
              <Col>
                <Form.Control
                  as="textarea"
                  rows={20}
                  value={state.message}
                  onChange={handleMessageChange}
                />
              </Col>
            </Row>
            <Row
              className={styles.notificationItem}
            >
              <Col>
                <Button
                  onClick={sendNotification}
                >
                  Send Notifications
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={sendNotificationToAll}
                >
                  Send to All
                </Button>
              </Col>
            </Row>
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