import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { descendingComparator } from '../../../reducers/helperFuncs';
import {
  Breadcrumb, Container, Row, Col, Form
} from 'react-bootstrap';

import { CustomerContext } from './customerContext';
import LatestActivity from './LatestActivity';
import DeliveryInfo from './DeliveryInfo';
import WeeklyMealSelections from './WeeklyMealSelections';
import AllPayments from './AllPayments';
import {withRouter} from "react-router";

const initialState = {
  mounted: false,
  customersByName: [], // Sorted by Name
  customersById: [], // Sorted by Id
  customersByEmail: [], // Sorted by Email
  customerId: '',
  purchaseId: '',
  paymentId: '',
}

function reducer(state, action) {
  switch(action.type) {
    case 'MOUNT':
      return {
        ...state,
        mounted: true,
      }
    case 'FETCH_CUSTOMERS':
      return {
        ...state,
        customersByName: action.payload.byName,
        customersById: action.payload.byId,
        customersByEmail: action.payload.byEmail,
      }
    case 'SELECT_CUSTOMER':
      return {
        ...state,
        customerId: action.payload,
        purchaseId: '',
        paymentId: '',
      }
    case 'SELECT_PURCHASE':
      return {
        ...state,
        purchaseId: action.payload.purchaseId,
        paymentId: action.payload.paymentId,
      }
    default:
      return state
  }
}

function Customers({history, ...props}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Check for log in
  useEffect(() => {
    if (
      document.cookie
        .split(";")
        .some(item => item.trim().startsWith("customer_uid="))
    ) {
      // Logged in
      let customer_uid = document.cookie
        .split("; ")
        .find(row => row.startsWith("customer_uid"))
        .split("=")[1];
      axios
      .get(`${API_URL}Profile/${customer_uid}`)
      .then((response) => {
        const role = response.data.result[0].role.toLowerCase();
        if(role === 'admin') {
          dispatch({ type: 'MOUNT' });
        } else {
          history.push('/meal-plan');
        }
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
    } else {
      // Reroute to log in page
      history.push("/");
    }
  }, [history]);

  useEffect(() => {
    axios
      .get(`${API_URL}customer_infos`)
      .then((response) => {
        // Response should be sorted by id
        const customers_id = response.data.result;
        const customers_api = [...customers_id] ;
        // Make a copy, sort by name
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
        // Make a copy, sort by email
        const customers_email = [...customers_id];
        customers_email.sort((eltA, eltB) => {
          let result = -descendingComparator(eltA, eltB, 'customer_email');
          return result;
        })
        dispatch({ type: 'FETCH_CUSTOMERS', payload: {
          byName: customers_api,
          byId: customers_id,
          byEmail: customers_email,
         }});
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  },[])

  const selectCustomer = (customer) => {
    dispatch({ type: 'SELECT_CUSTOMER', payload: customer });
  }

  if (!state.mounted) {
    return null;
  }

  return (
    <div>
      <CustomerContext.Provider
        value={{
          state,
          dispatch
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
          <Breadcrumb.Item active> Customers </Breadcrumb.Item>
        </Breadcrumb>
        <Container
          style={{
            maxWidth: 'inherit',
          }}
        >
          <Row>
            <Col>
              <Form>
                <Form.Group as={Row}>
                  <Form.Label column sm='1'>
                    Customers
                  </Form.Label>
                  <Col sm='3'>
                    <Form.Control
                      as='select'
                      value={state.customerId}
                      onChange={
                        (event) => selectCustomer(event.target.value)
                      }
                    >
                      <option value="" hidden> Choose customer by ID</option>
                      {
                        state.customersById.map(
                          (customer) => (
                            <option
                              key={customer.customer_uid}
                              value={customer.customer_uid}
                            >
                              {`${customer.customer_uid}`}
                            </option>
                          )
                        )
                      }
                    </Form.Control>
                  </Col>
                  <Col sm='3'>
                    <Form.Control
                      as='select'
                      value={state.customerId}
                      onChange={
                        (event) => selectCustomer(event.target.value)
                      }
                    >
                      <option value="" hidden> Choose customer by name</option>
                      {
                        state.customersByName.map(
                          (customer) => (
                            <option
                              key={customer.customer_uid}
                              value={customer.customer_uid}
                            >
                              {`${customer.customer_first_name} ${customer.customer_last_name} ${customer.customer_email}`}
                            </option>
                          )
                        )
                      }
                    </Form.Control>
                  </Col>
                  <Col sm='3'>
                    <Form.Control
                      as='select'
                      value={state.customerId}
                      onChange={
                        (event) => selectCustomer(event.target.value)
                      }
                    >
                      <option value="" hidden> Choose customer by email</option>
                      {
                        state.customersByEmail.map(
                          (customer) => (
                            <option
                              key={customer.customer_uid}
                              value={customer.customer_uid}
                            >
                              {`${customer.customer_email}`}
                            </option>
                          )
                        )
                      }
                    </Form.Control>
                  </Col>
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <LatestActivity />
            </Col>
          </Row>
          <Row>
            <Col md='4' lg='2'>
              <span> Purchase Id: {state.purchaseId} </span>
              <DeliveryInfo />
            </Col>
            <Col md='8' lg='10'>
              <Row>
                <Col>
                  <WeeklyMealSelections />
                </Col>
              </Row>
              <Row>
                <Col>
                  <AllPayments />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </CustomerContext.Provider>
    </div>
  )
}

export default withRouter(Customers);
