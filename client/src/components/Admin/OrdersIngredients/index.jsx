import { useEffect, useMemo, useReducer } from 'react';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { formatTime, sortedArray } from '../../../reducers/helperFuncs';
import {
  Breadcrumb, Container, Row, Col, Form
} from 'react-bootstrap';
import {
  Table, TableHead, TableSortLabel, TableBody, TableRow, TableCell
} from '@material-ui/core';
import {withRouter} from "react-router";

const initialState = {
  mounted: false,
  selectedDate: '',
  ordersData: [],
  sortedOrdersData: [],
  sortOrders: {
    field: '',
    direction: '',
  },
  ingredientsData: [],
  sortedIngredientsData: [],
  sortIngredients: {
    field: '',
    direction: '',
  }
}

function reducer(state, action) {
  switch(action.type) {
    case 'MOUNT':
      return {
        ...state,
        mounted: true,
      }
    case 'CHANGE_DATE':
      return {
        ...state,
        selectedDate: action.payload,
      }
    case 'FETCH_ORDERS':
      return {
        ...state,
        ordersData: action.payload,
      }
    case 'FILTER_ORDERS':
      return {
        ...state,
        sortedOrdersData: action.payload
      }
    case 'SORT_ORDERS':
      return {
        ...state,
        sortOrders: {
          field: action.payload.field,
          direction: action.payload.direction,
        }
      }
    case 'FETCH_INGREDIENTS':
      return {
        ...state,
        ingredientsData: action.payload,
      }
    case 'FILTER_INGREDIENTS':
      return {
        ...state,
        sortedIngredientsData: action.payload
      }
    case 'SORT_INGREDIENTS':
      return {
        ...state,
        sortIngredients: {
          field: action.payload.field,
          direction: action.payload.direction,
        }
      }
    default:
      return state;
  }
}

function OrdersIngredients({history, ...props}) {
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

  const orderDates = useMemo(() => {
    const orderDates = state.ordersData.map((orderItem) => orderItem.d_menu_date);
    const orderDatesUnique = orderDates.filter((elt, index) => orderDates.indexOf(elt) === index);
    orderDatesUnique.sort();
    const orederDatesFormatted = orderDatesUnique.map((orderDate,dateIndex) => {
      const orderDateTime = new Date(formatTime(orderDate));
      return (
        {
          value: orderDatesUnique[dateIndex],
          display: orderDateTime.toDateString()
        }
      )
    })
    return orederDatesFormatted;
  },[state.ordersData])

  const getOrderData = (date) => {
    const curOrders = state.ordersData.filter((order) => order.d_menu_date === date);
    return curOrders;
  }

  const getIngredientsData = (date) => {
    const curIngredients = state.ingredientsData.filter((ingredient) => ingredient.d_menu_date === date);
    return curIngredients;
  }

  // Fetch orders
  useEffect(() => {
    axios
      .get(`${API_URL}Orders_by_Items_total_items`)
      .then((response) => {
        const ordersApi = response.data.result;
        dispatch({ type: 'FETCH_ORDERS', payload: ordersApi});
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

  // Fetch Ingredients
  useEffect(() => {
    axios
      .get(`${API_URL}ingredients_need`)
      .then((response) => {
        const ingredientsApi = response.data.result;
        dispatch({ type: 'FETCH_INGREDIENTS', payload: ingredientsApi});
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

  const changeSortOrder = (field) => {
    const isAsc = (state.sortOrders.field === field && state.sortOrders.direction === 'asc');
    const direction = isAsc ? 'desc' : 'asc';
    dispatch({
      type: 'SORT_ORDERS',
      payload: {
        field: field,
        direction: direction,
      }
    })
    const sortedOrders = sortedArray(state.sortedOrdersData, field, direction);
    dispatch({ type: 'FILTER_ORDERS', payload: sortedOrders })
  }

  const changeSortIngredient = (field) => {
    const isAsc = (state.sortIngredients.field === field && state.sortIngredients.direction === 'asc');
    const direction = isAsc ? 'desc' : 'asc';
    dispatch({
      type: 'SORT_INGREDIENTS',
      payload: {
        field: field,
        direction: direction,
      }
    })
    const sortedIngredients = sortedArray(state.sortedIngredientsData, field, direction);
    dispatch({ type: 'FILTER_INGREDIENTS', payload: sortedIngredients })
  }

  // Change date 
  const changeDate = (newDate) => {
    dispatch({ type: 'CHANGE_DATE', payload: newDate });
    const newOrders = getOrderData(newDate);
    const sortedOrders = sortedArray(newOrders, state.sortOrders.field, state.sortOrders.direction);
    const newIngredients = getIngredientsData(newDate);
    const sortedIngredients = sortedArray(newIngredients, state.sortIngredients.field, state.sortIngredients.direction);
    dispatch({ type: 'FILTER_ORDERS', payload: sortedOrders});
    dispatch({ type: 'FILTER_INGREDIENTS', payload: sortedIngredients});
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Orders & Ingredients </Breadcrumb.Item>
      </Breadcrumb>
      <Container>
        <Row>
          <Col>
            <Form>
              <Form.Group as={Row}>
                <Form.Label column sm="2">
                  Date
                </Form.Label>
                <Col sm="6">
                  <Form.Control
                    as="select"
                    value={state.selectedDate}
                    onChange={
                      (event) => {
                        changeDate(event.target.value);
                      }
                    }
                  >
                    <option value="" hidden>Choose date</option>
                    {
                      orderDates.map(
                        (date) => (
                          <option value={date.value} key={date.value}>
                            {date.display}
                          </option>
                        ),
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
            <h5> Meals Ordered </h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Menu Date
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortOrders.field === 'jt_name'}
                      direction={state.sortOrders.field === 'jt_name' ? state.sortOrders.direction : 'asc'}
                      onClick={() => changeSortOrder('jt_name')}
                    >
                      Meal Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortOrders.field === 'sum(jt_qty)'}
                      direction={state.sortOrders.field === 'sum(jt_qty)' ? state.sortOrders.direction : 'asc'}
                      onClick={() => changeSortOrder('sum(jt_qty)')}
                    >
                      Quantity
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  state.sortedOrdersData.map(
                    (order, orderIndex) => {
                      return (
                        <TableRow
                          key={orderIndex}
                          hover
                        >
                          <TableCell> {order.d_menu_date} </TableCell>
                          <TableCell> {order.jt_name} </TableCell>
                          <TableCell> {order['sum(jt_qty)']} </TableCell>
                        </TableRow>
                      );
                    }
                  )
                }
              </TableBody>
            </Table>
          </Col>
        </Row>
        <Row
          style={{
            marginTop: '4rem',
            marginBottom: '1rem',
          }}
        >
          <Col>
            <h5> Ingredients Needed </h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Menu Date
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortIngredients.field === 'ingredient_desc'}
                      direction={state.sortIngredients.field === 'ingredient_desc' ? state.sortIngredients.direction : 'asc'}
                      onClick={() => changeSortIngredient('ingredient_desc')}
                    >
                      Ingredient Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortIngredients.field === 'sum(qty_needed)'}
                      direction={state.sortIngredients.field === 'sum(qty_needed)' ? state.sortIngredients.direction : 'asc'}
                      onClick={() => changeSortIngredient('sum(qty_needed)')}
                    >
                      Quantity
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortIngredients.field === 'units'}
                      direction={state.sortIngredients.field === 'units' ? state.sortIngredients.direction : 'asc'}
                      onClick={() => changeSortIngredient('units')}
                    >
                      Unit
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  state.sortedIngredientsData.map(
                    (ingredient, ingredientIndex) => {
                      return (
                        <TableRow
                          key={ingredientIndex}
                          hover
                        >
                          <TableCell> {ingredient.d_menu_date} </TableCell>
                          <TableCell> {ingredient.ingredient_desc} </TableCell>
                          <TableCell> {ingredient['sum(qty_needed)']} </TableCell>
                          <TableCell> {ingredient.units} </TableCell>
                        </TableRow>
                      )
                    }
                  )
                }
              </TableBody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default withRouter(OrdersIngredients);
