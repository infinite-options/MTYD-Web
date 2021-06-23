import { useEffect, useMemo, useReducer } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import { formatTime, sortedArray } from "../../../reducers/helperFuncs";
import { Breadcrumb, Container, Row, Col, Form } from "react-bootstrap";
import {
  Table,
  TableHead,
  TableSortLabel,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { withRouter } from "react-router";
import styles from "./ordersIngredients.module.css";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

const initialState = {
  mounted: false,
  defaultFlag: true,
  selectedDate: "",
  closestDate: "",
  ordersData: [],
  sortedOrdersData: [],
  sortOrders: {
    field: "",
    direction: "",
  },
  customersData: [],
  sortedCustomersData: [],
  sortCustomers: {
    field: "",
    direction: "",
  },
  ingredientsData: [],
  sortedIngredientsData: [],
  sortIngredients: {
    field: "",
    direction: "",
  },
  businessData: [],
  mealDates: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "MOUNT":
      return {
        ...state,
        mounted: true,
      };
    case "CHANGE_DATE":
      return {
        ...state,
        selectedDate: action.payload,
      };
    case "DISPLAY_DATE":
      return {
        ...state,
        closestDate: action.payload,
      };
    case "FETCH_ORDERS":
      return {
        ...state,
        ordersData: action.payload,
      };
    case "FILTER_ORDERS":
      return {
        ...state,
        sortedOrdersData: action.payload,
      };
    case "SORT_ORDERS":
      return {
        ...state,
        sortOrders: {
          field: action.payload.field,
          direction: action.payload.direction,
        },
      };
    case "FETCH_INGREDIENTS":
      return {
        ...state,
        ingredientsData: action.payload,
      };
    case "FILTER_INGREDIENTS":
      return {
        ...state,
        sortedIngredientsData: action.payload,
      };
    case "SORT_INGREDIENTS":
      return {
        ...state,
        sortIngredients: {
          field: action.payload.field,
          direction: action.payload.direction,
        },
      };
    case "FETCH_CUSTOMERS":
      return {
        ...state,
        customersData: action.payload,
      };
    case "FILTER_CUSTOMERS":
      return {
        ...state,
        sortedCustomersData: action.payload,
      };
    case "SORT_CUSTOMERS":
      return {
        ...state,
        sortCustomers: {
          field: action.payload.field,
          direction: action.payload.direction,
        },
      };
    case "FETCH_BUSINESSES":
      return {
        ...state,
        businessData: action.payload,
      };
    case "FETCH_MEAL_DATES":
      return {
        ...state,
        mealDates: action.payload,
      };
    default:
      return state;
  }
}

function OrdersIngredients({ history, ...props }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Check for log in
  useEffect(() => {
    if (
      document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("customer_uid="))
    ) {
      // Logged in
      let customer_uid = document.cookie
        .split("; ")
        .find((row) => row.startsWith("customer_uid"))
        .split("=")[1];
      axios
        .get(`${API_URL}Profile/${customer_uid}`)
        .then((response) => {
          const role = response.data.result[0].role.toLowerCase();
          if (role === "admin") {
            dispatch({ type: "MOUNT" });
          } else {
            history.push("/meal-plan");
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

  // Fetch Businesses
  useEffect(() => {
    axios
      .get(`${API_URL}all_businesses`)
      .then((response) => {
        const businessesApi = response.data.result;
        dispatch({ type: "FETCH_BUSINESSES", payload: businessesApi });
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }, []);

  // Fetch Businesses
  useEffect(() => {
    axios
      .get(`${API_URL}all_menu_dates`)
      .then((response) => {
        const datesApi = response.data.result;
        dispatch({ type: "FETCH_MEAL_DATES", payload: datesApi });
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }, []);

  // Fetch Meals
  useEffect(() => {
    axios
      .get(`${API_URL}Meal_Detail/2021-06-21+00:00:00`)
      .then((response) => {
        const ordersApi = response.data.result.result;
        dispatch({ type: "FETCH_ORDERS", payload: ordersApi });
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }, []);

  // Fetch Ingredients
  useEffect(() => {
    axios
      .get(`${API_URL}ingredients_need`)
      .then((response) => {
        const ingredientsApi = response.data.result;
        dispatch({ type: "FETCH_INGREDIENTS", payload: ingredientsApi });
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }, []);

  const orderDates = useMemo(() => {
    console.log("dates from state");
    console.log(state.mealDates);
    const orderDates = state.mealDates.map((menuDate) => menuDate.menu_date);
    console.log("MealDates");
    console.log(orderDates);
    const orderDatesUnique = orderDates.filter(
      (elt, index) => orderDates.indexOf(elt) === index
    );
    orderDatesUnique.sort();
    const orederDatesFormatted = orderDatesUnique.map(
      (orderDate, dateIndex) => {
        const orderDateTime = new Date(formatTime(orderDate));
        return {
          value: orderDatesUnique[dateIndex],
          display: orderDateTime.toDateString(),
        };
      }
    );
    return orederDatesFormatted;
  }, [state.ordersData]);

  // const nowTest1 = new Date('May 06, 2021');
  // const nowTest = nowTest1.toString();
  var now = Date().toLocaleString();
  var monthDict = [];

  monthDict.push({
    key: "Jan",
    value: "01",
  });
  monthDict.push({
    key: "Feb",
    value: "02",
  });
  monthDict.push({
    key: "Mar",
    value: "03",
  });
  monthDict.push({
    key: "Apr",
    value: "04",
  });
  monthDict.push({
    key: "May",
    value: "05",
  });
  monthDict.push({
    key: "Jun",
    value: "06",
  });
  monthDict.push({
    key: "Jul",
    value: "07",
  });
  monthDict.push({
    key: "Aug",
    value: "08",
  });
  monthDict.push({
    key: "Sep",
    value: "09",
  });
  monthDict.push({
    key: "Oct",
    value: "10",
  });
  monthDict.push({
    key: "Nov",
    value: "11",
  });
  monthDict.push({
    key: "Dec",
    value: "12",
  });

  var currMonth = now.substring(4, 7);
  var currMonthVal = 0;
  var currDay = now.substring(8, 10);
  var currYear = now.substring(11, 15);

  // assign value to current month
  for (let i = 0, l = monthDict.length; i < l; i++) {
    if (currMonth === monthDict[i].key) {
      currMonthVal = monthDict[i].value;
    }
  }

  // remove futureDays?
  var futureDaysList = [];
  var futureDaysListValues = [];

  let closestDateIndex = 0;

  for (let i = 0, l = orderDates.length; i < l; i++) {
    var date = orderDates[i].value;
    var dateDisplay = orderDates[i].display;
    var year = date.substring(0, 4);
    var month = date.substring(5, 7);
    var day = date.substring(8, 10);

    if (currYear <= year) {
      if (currMonthVal < month) {
        if (!closestDateIndex) {
          closestDateIndex = i;
        }
        futureDaysListValues.push(orderDates[i].value);
        futureDaysList.push(dateDisplay);
      } else if (currMonthVal == month) {
        if (currDay <= day) {
          if (!closestDateIndex) {
            closestDateIndex = i;
          }
          futureDaysListValues.push(orderDates[i].value);
          futureDaysList.push(dateDisplay);
        }
      }
    }
  }

  const getDateButtonRange = (startDateIndex) => {
    let dateRange = [];
    for (let i = startDateIndex; i <= startDateIndex + 5; i++) {
      dateRange.push(orderDates[i]);
    }
    return dateRange;
  };

  var closestToCurrDay = futureDaysList[0];
  var closestToCurrDayVal = futureDaysListValues[0];

  // DEPRECATED
  const getOrderData = (date) => {
    const curOrders = state.ordersData.filter(
      (order) => order.d_menu_date === date
    );
    return curOrders;
  };

  const getIngredientsData = (date) => {
    const curIngredients = state.ingredientsData.filter(
      (ingredient) => ingredient.d_menu_date === date
    );
    return curIngredients;
  };

  // DEPCRECATED
  const getCustomerData = (date) => {
    const curCustomers = state.customersData.filter(
      (customer) => customer.d_menu_date === date
    );
    return curCustomers;
  };

  ////// DEPRECATED API CALLS //////
  // Fetch orders
  useEffect(() => {
    axios
      .get(`${API_URL}Orders_by_Items_total_items`)
      .then((response) => {
        const ordersApi = response.data.result;
        dispatch({ type: "FETCH_ORDERS", payload: ordersApi });
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }, []);

  // Fetch Customer Names
  useEffect(() => {
    axios
      .get(`${API_URL}orders_by_customers`)
      .then((response) => {
        const customersApi = response.data.result;
        dispatch({ type: "FETCH_CUSTOMERS", payload: customersApi });
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }, []);

  ////// END DEPRECATED API CALLS //////

  const changeSortOrder = (field) => {
    const isAsc =
      state.sortOrders.field === field && state.sortOrders.direction === "asc";
    const direction = isAsc ? "desc" : "asc";
    dispatch({
      type: "SORT_ORDERS",
      payload: {
        field: field,
        direction: direction,
      },
    });
    const sortedOrders = sortedArray(state.sortedOrdersData, field, direction);
    dispatch({ type: "FILTER_ORDERS", payload: sortedOrders });
  };

  const changeSortIngredient = (field) => {
    const isAsc =
      state.sortIngredients.field === field &&
      state.sortIngredients.direction === "asc";
    const direction = isAsc ? "desc" : "asc";
    dispatch({
      type: "SORT_INGREDIENTS",
      payload: {
        field: field,
        direction: direction,
      },
    });
    const sortedIngredients = sortedArray(
      state.sortedIngredientsData,
      field,
      direction
    );
    dispatch({ type: "FILTER_INGREDIENTS", payload: sortedIngredients });
  };

  const changeSortCustomer = (field) => {
    const isAsc =
      state.sortCustomers.field === field &&
      state.sortCustomers.direction === "asc";
    const direction = isAsc ? "desc" : "asc";
    dispatch({
      type: "SORT_CUSTOMERS",
      payload: {
        field: field,
        direction: direction,
      },
    });
    const sortedCustomers = sortedArray(
      state.sortedCustomersData,
      field,
      direction
    );
    dispatch({ type: "FILTER_CUSTOMERS", payload: sortedCustomers });
  };

  // Change date
  const changeDate = (newDate) => {
    dispatch({ type: "CHANGE_DATE", payload: newDate });
    state.defaultFlag = false;
    const newOrders = getOrderData(newDate);
    const sortedOrders = sortedArray(
      newOrders,
      state.sortOrders.field,
      state.sortOrders.direction
    );
    const newIngredients = getIngredientsData(newDate);
    const sortedIngredients = sortedArray(
      newIngredients,
      state.sortIngredients.field,
      state.sortIngredients.direction
    );
    const newCustomers = getCustomerData(newDate);
    const sortedCustomers = sortedArray(
      newCustomers,
      state.sortCustomers.field,
      state.sortCustomers.direction
    );
    dispatch({ type: "FILTER_ORDERS", payload: sortedOrders });
    dispatch({ type: "FILTER_INGREDIENTS", payload: sortedIngredients });
    dispatch({ type: "FILTER_CUSTOMERS", payload: sortedCustomers });
  };
  // display the default order/ingredient/customer data to the closest date we have in dropdown list based on todays day
  if (state.defaultFlag) {
    const newOrders = getOrderData(closestToCurrDayVal);
    const sortedOrders = sortedArray(
      newOrders,
      state.sortOrders.field,
      state.sortOrders.direction
    );
    const newIngredients = getIngredientsData(closestToCurrDayVal);
    const sortedIngredients = sortedArray(
      newIngredients,
      state.sortIngredients.field,
      state.sortIngredients.direction
    );
    const newCustomers = getCustomerData(closestToCurrDayVal);
    const sortedCustomers = sortedArray(
      newCustomers,
      state.sortCustomers.field,
      state.sortCustomers.direction
    );

    state.sortedOrdersData = sortedOrders;
    state.sortedIngredientsData = sortedIngredients;
    state.sortedCustomersData = sortedCustomers;
  }

  const filterBusiness = (event) => {
    console.log("New Business: " + event.target.value);
  };

  const handleDateButtonClick = (event) => {
    const newDate = event.target.value;
    console.log("New Date: " + newDate);
    changeDate(newDate);
  };

  return (
    <div className={styles.root}>
      {/* <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> & Ingredients </Breadcrumb.Item>
      </Breadcrumb> */}
      <Container fluid className={styles.container}>
        <Row className={[styles.section, styles.row1].join(" ")}>
          <Col md="auto" className={styles.restaurantSelector}>
            <div className={styles.restaurantImg}>Image</div>
            <div style={{ marginLeft: "10px" }}>
              <form>
                <div className={styles.dropdownArrow}>
                  <select className={styles.dropdown} onChange={filterBusiness}>
                    <option key={0}>All Orders</option>
                    {state.businessData.map((business) => {
                      if (business) {
                        return (
                          <option
                            key={business.business_uid}
                            value={business.business_uid}
                          >
                            {business.business_name}
                          </option>
                        );
                      }
                    })}
                  </select>
                </div>
              </form>
              <div className={styles.restaurantLinks}>
                <a>Send Message</a>
                <a>Issue Coupon</a>
              </div>
            </div>
          </Col>
          <Col className={styles.dateSelector}>
            {
              ((console.log("dates:"), console.log(orderDates)),
              console.log("now: " + now.substring(0, 15)))
            }
            <button className={styles.dateLeft}></button>
            {getDateButtonRange(closestDateIndex).map((date) => {
              if (date) {
                const dayName = date.display.substring(0, 3);
                const day = date.display.substring(4, 10);
                return (
                  <button
                    className={[
                      styles.datebutton,
                      styles.datebuttonNotSelected,
                    ].join(" ")}
                    key={date.value}
                    value={date.value}
                    onClick={handleDateButtonClick}
                  >
                    {dayName} <br /> {day}
                  </button>
                );
              }
            })}

            <button className={styles.dateRight}></button>
          </Col>
          <Col
            md="auto"
            style={{
              paddingTop: "10px",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "10px", color: "#f26522" }}>
              Contact Info
            </div>
            <div>pmarathay@gmail.com</div>
            <div>(686) 908-9080</div>
          </Col>
          <Col
            md="auto"
            style={{
              paddingTop: "10px",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "10px", color: "#f26522" }}>
              No. of Meals
            </div>
            <div>5</div>
          </Col>
          <Col
            md="auto"
            style={{
              paddingTop: "10px",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "10px", color: "#f26522" }}>
              Total Revenue
            </div>
            <div>$95.90</div>
          </Col>
        </Row>
        <Row className={styles.row2}>
          <Col xs={5} className={styles.section} style={{ marginRight: 10 }}>
            Upcoming Meal Orders And Revenue
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Qty.</TableCell>
                  <TableCell>Meal Orders</TableCell>
                  <TableCell>Meal Pictures</TableCell>
                  <TableCell>Meal Cost</TableCell>
                  <TableCell>Total Cost</TableCell>
                  <TableCell>Additional Revenue</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </Col>
          <Col xs={4} className={styles.section} style={{ marginRight: 10 }}>
            Revenue
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Restaurant Name</TableCell>
                  <TableCell>Total Cost</TableCell>
                  <TableCell>Additional Revenue</TableCell>
                  <TableCell>Total Revenue</TableCell>
                  <TableCell>M4Me Profits</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </Col>
          <Col className={styles.section}>
            Ingredients
            <Table>
              <TableHead>
                <TableCell>Ingredient Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit</TableCell>
              </TableHead>
              <TableBody>
                {getIngredientsData("2021-06-23 00-00-00").map((ingredient) => {
                  if (ingredient.ingredient_desc) {
                    return (
                      <TableRow>
                        <TableCell>{ingredient.ingredient_desc}</TableCell>
                        <TableCell>{ingredient.qty_needed}</TableCell>
                        <TableCell>{ingredient.units}</TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </Col>
        </Row>

        {/* <Row>
          <Col>
            <Form>
              <Form.Group as={Row}>
                <Form.Label column sm="2">
                  Date
                </Form.Label>
                <Col sm="6">
                  <Form.Control
                    as="select"
                    defaultValue={state.selectedDate}
                    onChange={(event) => {
                      changeDate(event.target.value);
                    }}
                  >
                    <option value="" hidden>
                      {closestToCurrDay}
                    </option>
                    {orderDates.map((date) => (
                      <option value={date.value} key={date.value}>
                        {date.display}
                      </option>
                    ))}
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
                  <TableCell>Menu Date</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortOrders.field === "jt_name"}
                      direction={
                        state.sortOrders.field === "jt_name"
                          ? state.sortOrders.direction
                          : "asc"
                      }
                      onClick={() => changeSortOrder("jt_name")}
                    >
                      Meal Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortOrders.field === "sum(jt_qty)"}
                      direction={
                        state.sortOrders.field === "sum(jt_qty)"
                          ? state.sortOrders.direction
                          : "asc"
                      }
                      onClick={() => changeSortOrder("sum(jt_qty)")}
                    >
                      Quantity
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.sortedOrdersData.map((order, orderIndex) => {
                  return (
                    <TableRow key={orderIndex} hover>
                      <TableCell> {order.d_menu_date} </TableCell>
                      <TableCell> {order.jt_name} </TableCell>
                      <TableCell> {order["sum(jt_qty)"]} </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Col>
        </Row>
        <Row
          style={{
            marginTop: "4rem",
            marginBottom: "1rem",
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
                  <TableCell>Menu Date</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortIngredients.field === "ingredient_desc"}
                      direction={
                        state.sortIngredients.field === "ingredient_desc"
                          ? state.sortIngredients.direction
                          : "asc"
                      }
                      onClick={() => changeSortIngredient("ingredient_desc")}
                    >
                      Ingredient Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortIngredients.field === "sum(qty_needed)"}
                      direction={
                        state.sortIngredients.field === "sum(qty_needed)"
                          ? state.sortIngredients.direction
                          : "asc"
                      }
                      onClick={() => changeSortIngredient("sum(qty_needed)")}
                    >
                      Quantity
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortIngredients.field === "units"}
                      direction={
                        state.sortIngredients.field === "units"
                          ? state.sortIngredients.direction
                          : "asc"
                      }
                      onClick={() => changeSortIngredient("units")}
                    >
                      Unit
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.sortedIngredientsData.map(
                  (ingredient, ingredientIndex) => {
                    return (
                      <TableRow key={ingredientIndex} hover>
                        <TableCell> {ingredient.d_menu_date} </TableCell>
                        <TableCell> {ingredient.ingredient_desc} </TableCell>
                        <TableCell> {ingredient["sum(qty_needed)"]} </TableCell>
                        <TableCell> {ingredient.units} </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </Col>
        </Row>
        <Row
          style={{
            marginTop: "4rem",
            marginBottom: "1rem",
          }}
        ></Row>
        <Row>
          <Col>
            <h5> Meals Ordered By Customer </h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Menu Date</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortCustomers.field === "jt_name"}
                      direction={
                        state.sortCustomers.field === "jt_name"
                          ? state.sortCustomers.direction
                          : "asc"
                      }
                      onClick={() => changeSortCustomer("jt_name")}
                    >
                      Meal Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortCustomers.field === "First_Name"}
                      direction={
                        state.sortCustomers.field === "First_Name"
                          ? state.sortCustomers.direction
                          : "asc"
                      }
                      onClick={() => changeSortCustomer("First_Name")}
                    >
                      Customer
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel>Customer UID</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel>Purchase UID</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel>Quantity</TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.sortedCustomersData.map((customer, customerIndex) => {
                  return (
                    <TableRow key={customerIndex} hover>
                      <TableCell> {customer.d_menu_date} </TableCell>
                      <TableCell> {customer.jt_name} </TableCell>
                      <TableCell>
                        {" "}
                        {customer.First_Name} {customer.Last_Name}{" "}
                      </TableCell>
                      <TableCell> {customer.customer_uid} </TableCell>
                      <TableCell> {customer.lplpibr_purchase_id} </TableCell>
                      <TableCell> {customer.Qty} </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Col>
        </Row> */}
      </Container>
    </div>
  );
}

export default withRouter(OrdersIngredients);
