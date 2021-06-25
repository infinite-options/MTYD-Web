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
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import AdminNavBar from '../AdminNavBar'

const initialState = {
  mounted: false,
  defaultFlag: true,
  selectedDate: "",
  dateIndex: 0,
  currDisplayDate: "",
  selectedBusinessID: "",
  selectedBusinessData: [],
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
  revenueData: [],
};

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 8,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
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
        selectedDate: action.payload.newDate,
        currDisplayDate: action.payload.display,
      };
    case "FILTER_BUSINESS":
      return {
        ...state,
        selectedBusinessID: action.payload.newBusinessID,
        selectedBusinessData: action.payload.newBusinessData,
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
    case "FETCH_REVENUE":
      return {
        ...state,
        revenueData: action.payload,
      };
    case "INITIALIZE_DATES":
      return {
        ...state,
        selectedDate: action.payload.selectedDate,
        dateIndex: action.payload.dateIndex,
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
  // Fetch dates
  useEffect(() => {
    let closestDate = "";
    axios
      .get(`${API_URL}all_menu_dates`)
      .then((response) => {
        const datesApi = response.data.result;
        const curDay = getCurrentDate();
        const closestDateIndex = getClosestDateIndex();
        closestDate = datesApi[closestDateIndex].menu_date;

        dispatch({ type: "FETCH_MEAL_DATES", payload: datesApi });
        dispatch({
          type: "INITIALIZE_DATES",
          payload: {
            selectedDate: closestDate,
            dateIndex: closestDateIndex,
          },
        });
        return axios.get(
          `${API_URL}meals_ordered_by_date/${closestDate.substring(0, 10)}`
        );
      })
      .then((response) => {
        const ordersApi = response.data.result;
        dispatch({ type: "FETCH_ORDERS", payload: ordersApi });
        return axios.get(
          `${API_URL}revenue_by_date/${closestDate.substring(0, 10)}`
        );
      })
      .then((response) => {
        const revenueApi = response.data.result;
        dispatch({ type: "FETCH_REVENUE", payload: revenueApi });
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
  // useEffect(() => {
  //   axios
  //     .get(`${API_URL}meals_ordered_by_date/2021-06-25`)
  //     .then((response) => {
  //       const ordersApi = response.data.result;
  //       dispatch({ type: "FETCH_ORDERS", payload: ordersApi });
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         // eslint-disable-next-line no-console
  //         console.log(err.response);
  //       }
  //       // eslint-disable-next-line no-console
  //       console.log(err);
  //     });
  // }, []);

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

  const getCurrentDate = () => {
    const currentDate = new Date();
    let day = currentDate.getDate();
    if (day < 10) {
      day = ["0", day].join("");
    }
    let month = currentDate.getMonth() + 1;
    if (month < 10) {
      month = ["0", month].join("");
    }
    let year = currentDate.getFullYear();
    return [[year, month, day].join("-"), "00-00-00"].join(" ");
  };

  const getClosestDateIndex = () => {
    return 48;
  };

  const convertToDisplayDate = (date) => {
    const displayDate = new Date(formatTime(date));
    return displayDate.toDateString();
  };

  const orderDates = useMemo(() => {
    const orderDates = state.mealDates.map((menuDate) => menuDate.menu_date);
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

  const formatToDisplayDate = (date) => {
    let formattedDate = new Date(formatTime(date));
    return formattedDate.toDateString();
  };

  formatToDisplayDate(state.selectedDate);
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
  // useEffect(() => {
  //   axios
  //     .get(`${API_URL}Orders_by_Items_total_items`)
  //     .then((response) => {
  //       const ordersApi = response.data.result;
  //       dispatch({ type: "FETCH_ORDERS", payload: ordersApi });
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         // eslint-disable-next-line no-console
  //         console.log(err.response);
  //       }
  //       // eslint-disable-next-line no-console
  //       console.log(err);
  //     });
  // }, []);

  // Fetch Customer Names
  // useEffect(() => {
  //   axios
  //     .get(`${API_URL}orders_by_customers`)
  //     .then((response) => {
  //       const customersApi = response.data.result;
  //       dispatch({ type: "FETCH_CUSTOMERS", payload: customersApi });
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         // eslint-disable-next-line no-console
  //         console.log(err.response);
  //       }
  //       // eslint-disable-next-line no-console
  //       console.log(err);
  //     });
  // }, []);
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
  const changeDate = (newDate, displayDate) => {
    axios
      .get(`${API_URL}meals_ordered_by_date/${newDate.substring(0, 10)}`)
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

    axios
      .get(`${API_URL}revenue_by_date/${newDate.substring(0, 10)}`)
      .then((response) => {
        console.log(response);
        const revenueApi = response.data.result;
        dispatch({ type: "FETCH_REVENUE", payload: revenueApi });
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });

    dispatch({
      type: "CHANGE_DATE",
      payload: { newDate: newDate, display: displayDate },
    });
    state.defaultFlag = false;
    // const newOrders = getOrderData(newDate);
    // const sortedOrders = sortedArray(
    //   newOrders,
    //   state.sortOrders.field,
    //   state.sortOrders.direction
    // );
    // const newIngredients = getIngredientsData(newDate);
    // const sortedIngredients = sortedArray(
    //   newIngredients,
    //   state.sortIngredients.field,
    //   state.sortIngredients.direction
    // );
    // const newCustomers = getCustomerData(newDate);
    // const sortedCustomers = sortedArray(
    //   newCustomers,
    //   state.sortCustomers.field,
    //   state.sortCustomers.direction
    // );
    // dispatch({ type: "FILTER_ORDERS", payload: sortedOrders });
    // dispatch({ type: "FILTER_INGREDIENTS", payload: sortedIngredients });
    // dispatch({ type: "FILTER_CUSTOMERS", payload: sortedCustomers });
  };
  // display the default order/ingredient/customer data to the closest date we have in dropdown list based on todays day
  // if (state.defaultFlag) {
  //   const newOrders = getOrderData(closestToCurrDayVal);
  //   const sortedOrders = sortedArray(
  //     newOrders,
  //     state.sortOrders.field,
  //     state.sortOrders.direction
  //   );
  //   const newIngredients = getIngredientsData(closestToCurrDayVal);
  //   const sortedIngredients = sortedArray(
  //     newIngredients,
  //     state.sortIngredients.field,
  //     state.sortIngredients.direction
  //   );
  //   const newCustomers = getCustomerData(closestToCurrDayVal);
  //   const sortedCustomers = sortedArray(
  //     newCustomers,
  //     state.sortCustomers.field,
  //     state.sortCustomers.direction
  //   );

  //   state.sortedOrdersData = sortedOrders;
  //   state.sortedIngredientsData = sortedIngredients;
  //   state.sortedCustomersData = sortedCustomers;
  // }

  const calculateTotalMealQty = (meals) => {
    let sum = 0;
    meals.forEach((item) => {
      if (item.total_qty !== null) {
        sum += item.total_qty;
      } else {
        sum += 0;
      }
    });
    return sum;
  };

  const calculateTotalRevenue = (data) => {
    let sum = 0;
    data.forEach((item) => {
      if (item.total_revenue !== null) {
        sum += item.total_revenue;
      } else {
        sum += 0;
      }
    });
    return sum;
  };

  const filterBusiness = (event) => {
    const newBusinessID = event.target.value;
    if (newBusinessID === "All Orders") {
      dispatch({
        type: "FILTER_BUSINESS",
        payload: {
          newBusinessID: "",
          newBusinessData: [],
        },
      });
    } else {
      const newBusinessData = state.businessData.filter(
        (business) => business.business_uid === newBusinessID
      );
      dispatch({
        type: "FILTER_BUSINESS",
        payload: {
          newBusinessID: newBusinessID,
          newBusinessData: newBusinessData[0],
        },
      });
    }
    state.defaultFlag = false;
  };

  const filterDataByBusiness = (data, id) => {
    if (id) {
      return data.filter((item) => item.meal_business === id);
    }
    return data;
  };

  const handleDateButtonClick = (event, displayDate) => {
    const newDate = event.target.value;
    changeDate(newDate, displayDate);
  };

  const formatDisplayDate = (displayDate) => {
    return displayDate.substring(4, 10) + "," + displayDate.substring(10);
  };

  const getBusinessName = (id) => {
    if (id) {
      if (state.businessData.length > 0) {
        return state.businessData.filter(
          (business) => business.business_uid === id
        )[0].business_name;
      } else {
        return "";
      }
    }
    return "";
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <>
    <AdminNavBar currentPage={'order-ingredients'}/>
    <div className={styles.root}>
      {console.log(state)}
      <Container fluid className={styles.container}>
        <Row className={[styles.section, styles.row1].join(" ")}>
          <Col md="auto" className={styles.restaurantSelector}>
            {state.selectedBusinessID ? (
              <img
                src={state.selectedBusinessData.business_image}
                className={styles.restaurantImg}
              ></img>
            ) : (
              <div className={styles.restaurantImg}></div>
            )}
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
          <Col xs={6}>
            <Carousel responsive={responsive}>
              {state.mealDates.map((date) => {
                const displayDate = convertToDisplayDate(date.menu_date);
                return (
                  <button
                    className={[
                      styles.datebutton,
                      styles.datebuttonNotSelected,
                    ].join(" ")}
                    key={date.menu_date}
                    value={date.menu_date}
                    onClick={(e) => handleDateButtonClick(e, displayDate)}
                  >
                    {displayDate.substring(0, 3)} <br />{" "}
                    {displayDate.substring(4, 10)}
                  </button>
                );
              })}
            </Carousel>
            {/* <button className={styles.dateLeft}></button> */}
            {/* {getDateButtonRange(closestDateIndex).map((date) => {
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
                    onClick={(e) => handleDateButtonClick(e, date.display)}
                  >
                    {dayName} <br /> {day}
                  </button>
                );
              } */}
            {/* })} */}
            {/* <button className={styles.dateRight}></button> */}
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
            <div>{state.selectedBusinessData.business_email}</div>
            <div>{state.selectedBusinessData.business_phone_num}</div>
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
            Upcoming Meal Orders And Revenue:{" "}
            {formatDisplayDate(formatToDisplayDate(state.selectedDate))}
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
              <TableBody>
                {state.ordersData && filterDataByBusiness(
                  state.ordersData,
                  state.selectedBusinessID
                ).map((item) => {
                  return (
                    <TableRow>
                      <TableCell>{item.total_qty}</TableCell>
                      <TableCell>{item.jt_name}</TableCell>
                      <TableCell>
                        <img
                          src={item.meal_photo_URL}
                          className={styles.mealImg}
                        ></img>
                      </TableCell>
                      <TableCell>
                        {currencyFormatter.format(item.meal_cost)}
                      </TableCell>
                      <TableCell>
                        {currencyFormatter.format(item.total_cost)}
                      </TableCell>
                      <TableCell>?</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Col>
          <Col xs={4} className={styles.section} style={{ marginRight: 10 }}>
            Revenue:{" "}
            {formatDisplayDate(formatToDisplayDate(state.selectedDate))}
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
              <TableBody>
                {state.revenueData && filterDataByBusiness(
                  state.revenueData,
                  state.selectedBusinessID
                ).map((item) => {
                  return (
                    <TableRow>
                      <TableCell>
                        {getBusinessName(item.meal_business)}
                      </TableCell>
                      <TableCell>
                        {currencyFormatter.format(item.total_cost)}
                      </TableCell>
                      <TableCell>?</TableCell>
                      <TableCell>
                        {currencyFormatter.format(item.total_revenue)}
                      </TableCell>
                      <TableCell>?</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Col>
          <Col className={styles.section}>
            Ingredients Needed:{" "}
            {formatDisplayDate(formatToDisplayDate(state.selectedDate))}
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
    </>
  );
}

export default withRouter(OrdersIngredients);
