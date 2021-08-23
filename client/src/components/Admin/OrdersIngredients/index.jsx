import { useEffect, useReducer, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import { formatTime, sortedArray } from "../../../reducers/helperFuncs";
import { Container, Row, Col } from "react-bootstrap";
import {
  Table,
  TableContainer,
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
import AdminNavBar from "../AdminNavBar";
import { ReactComponent as LeftArrow } from "../../../images/dateLeftArrow.svg";
import { ReactComponent as RightArrow } from "../../../images/dateRightArrow.svg";

const initialState = {
  mounted: false,
  defaultFlag: true,
  selectedDate: "",
  dateIndex: null,
  currDisplayDate: "",
  selectedBusinessID: "",
  selectedBusinessData: [],
  closestDate: "",
  ordersData: [],
  sortedOrdersData: [],
  sortOrders: {
    field: "",
    direction: "asc",
  },
  customersData: [],
  sortedCustomersData: [],
  sortRevenue: {
    field: "",
    direction: "asc",
  },
  ingredientsData: [],
  sortedIngredientsData: [],
  sortIngredients: {
    field: "",
    direction: "asc",
  },
  businessData: [],
  mealDates: [],
  revenueData: [],
  totalMeals: 0,
  totalRevenue: 0,
  carouselLoaded: false,
};

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 8,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1640 },
    items: 8,
  },
  smallDesktop: {
    breakpoint: { max: 1639, min: 1540 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1539, min: 464 },
    items: 5,
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
        ordersData: action.payload,
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
        ingredientsData: action.payload,
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
    case "FILTER_REVENUE":
      return {
        ...state,
        revenueData: action.payload,
      };
    case "SORT_REVENUE":
      return {
        ...state,
        sortRevenue: {
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
    case "LOAD_CAROUSEL":
      return {
        ...state,
        carouselLoaded: true,
      };
    case "INCREMENT_DATE_INDEX":
      return {
        ...state,
        dateIndex: state.dateIndex + 1,
      };
    case "DECREMENT_DATE_INDEX":
      return {
        ...state,
        dateIndex: state.dateIndex - 1,
      };
    default:
      return state;
  }
}

function OrdersIngredients({ history, ...props }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const carouselRef = useRef();

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
  // Fetch dates, meals, revenue & ingredients
  useEffect(() => {
    let closestDate = "";
    axios
      .get(`${API_URL}all_menu_dates`)
      .then((response) => {
        const datesApi = response.data.result;
        const closestDateIndex = getClosestDateIndex(datesApi);
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
        const filteredData = ordersApi
          ? ordersApi.filter(
              (item) => item.jt_name !== "SURPRISE" && item.jt_name !== "SKIP"
            )
          : ordersApi;
        dispatch({ type: "FETCH_ORDERS", payload: filteredData });
        return axios.get(
          `${API_URL}revenue_by_date/${closestDate.substring(0, 10)}`
        );
      })
      .then((response) => {
        const revenueApi = response.data.result;
        const filteredData = revenueApi
          ? revenueApi.filter((item) => item.meal_business !== null)
          : revenueApi;
        dispatch({ type: "FETCH_REVENUE", payload: filteredData });
        return axios.get(
          `${API_URL}ingredients_needed_by_date/${closestDate.substring(0, 10)}`
        );
      })
      .then((response) => {
        const ingredientsApi = response.data.result;
        const filteredData = ingredientsApi.filter(
          (item) => item.ingredient_desc !== null
        );
        dispatch({ type: "FETCH_INGREDIENTS", payload: filteredData });
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

  const getClosestDateIndex = (dates) => {
    if (dates) {
      let curDay = getCurrentDate();

      for (let i = 0; i < dates.length; i++) {
        const day = dates[i].menu_date;
        if (
          day.localeCompare(curDay) === 0 ||
          day.localeCompare(curDay) === 1
        ) {
          return i;
        }
      }
    }
    return 0;
  };

  const convertToDisplayDate = (date) => {
    const displayDate = new Date(formatTime(date));
    return displayDate.toDateString();
  };

  const formatToDisplayDate = (date) => {
    let formattedDate = new Date(formatTime(date));
    return formattedDate.toDateString();
  };

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
    const sortedOrders = sortedArray(state.ordersData, field, direction);
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
      state.ingredientsData,
      field,
      direction
    );
    dispatch({ type: "FILTER_INGREDIENTS", payload: sortedIngredients });
  };

  const changeSortRevenue = (field) => {
    const isAsc =
      state.sortRevenue.field === field &&
      state.sortRevenue.direction === "asc";
    const direction = isAsc ? "desc" : "asc";
    dispatch({
      type: "SORT_REVENUE",
      payload: {
        field: field,
        direction: direction,
      },
    });
    const sortedRevenue = sortedArray(state.revenueData, field, direction);
    dispatch({ type: "FILTER_REVENUE", payload: sortedRevenue });
  };

  // Change date
  const changeDate = (newDate, displayDate) => {
    axios
      .get(`${API_URL}meals_ordered_by_date/${newDate.substring(0, 10)}`)
      .then((response) => {
        const ordersApi = response.data.result;
        const filteredData = ordersApi
          ? ordersApi.filter(
              (item) => item.jt_name !== "SURPRISE" && item.jt_name !== "SKIP"
            )
          : ordersApi;
        dispatch({ type: "FETCH_ORDERS", payload: filteredData });
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
        const filteredData = revenueApi
          ? revenueApi.filter((item) => item.meal_business !== null)
          : revenueApi;
        dispatch({ type: "FETCH_REVENUE", payload: filteredData });
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
      .get(`${API_URL}ingredients_needed_by_date/${newDate.substring(0, 10)}`)
      .then((response) => {
        const ingredientsApi = response.data.result;
        const filteredData = ingredientsApi.filter(
          (item) => item.ingredient_desc !== null
        );
        dispatch({ type: "FETCH_INGREDIENTS", payload: filteredData });
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
    dispatch({
      type: "CHANGE_DATE",
      payload: { newDate: newDate, display: displayDate },
    });

    state.defaultFlag = false;
  };

  const calculateTotalMealQty = (meals) => {
    let sum = 0;
    if (meals) {
      meals.forEach((item) => {
        if (item.total_qty !== null) {
          sum += item.total_qty;
        } else {
          sum += 0;
        }
      });
    }

    return sum;
  };

  const calculateTotalRevenue = (data) => {
    let sum = 0;
    if (data) {
      data.forEach((item) => {
        if (item.total_revenue !== null) {
          sum += item.total_revenue;
        } else {
          sum += 0;
        }
      });
    }
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
    if (data && id) {
      return data.filter(
        (item) => item.business_uid === id || item.meal_business === id
      );
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

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (
    carouselRef &&
    carouselRef.current &&
    state.dateIndex &&
    !state.carouselLoaded
  ) {
    // carouselRef.current.goToSlide(state.dateIndex);
    carouselRef.current.state.currentSlide = state.dateIndex;
    dispatch({ type: "LOAD_CAROUSEL" });
  }

  return (
    <>
      <div style={{ minWidth: "1150px", backgroundColor: "#f8bb17" }}>
        <AdminNavBar currentPage={"order-ingredients"} />
      </div>

      <div className={styles.root}>
        {console.log(state)}
        <Container fluid className={styles.container}>
          <Row
            className={styles.section}
            style={{
              paddingTop: "15px",
              paddingBottom: "15px",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
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
                    <select
                      className={styles.dropdown}
                      onChange={filterBusiness}
                    >
                      <option key={0}>All Orders</option>
                      {state.businessData.map((business, index) => {
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
                <div
                  className={[styles.restaurantLinks, styles.bold].join(" ")}
                >
                  <a>Send Message</a>
                  <a>Issue Coupon</a>
                </div>
              </div>
            </Col>
            <Col md="auto" className={styles.verticallyCenter}>
              <button
                style={{ transform: "translateX(30px)" }}
                className={styles.dateCarouselArrowBtn}
                onClick={() => {
                  carouselRef.current.previous();
                  dispatch({ type: "DECREMENT_DATE_INDEX" });
                }}
              >
                <LeftArrow />
              </button>
            </Col>
            <Col md="auto" className={styles.carouselCol}>
              {state.dateIndex != null && (
                <Carousel
                  responsive={responsive}
                  ref={carouselRef}
                  arrows={false}
                  sliderClass={styles.carouselSlider}
                  keyBoardControl
                >
                  {state.mealDates.map((date) => {
                    const displayDate = convertToDisplayDate(date.menu_date);
                    const dateButtonStatus =
                      date.menu_date === state.selectedDate
                        ? styles.datebuttonSelected
                        : styles.datebuttonNotSelected;
                    return (
                      <button
                        className={[
                          styles.datebutton,
                          dateButtonStatus,
                          styles.bold,
                        ].join(" ")}
                        key={date.menu_date}
                        value={date.menu_date}
                        onClick={(e) => handleDateButtonClick(e, displayDate)}
                      >
                        {displayDate.substring(0, 3).toUpperCase()} <br />{" "}
                        {displayDate.substring(4, 10)}
                      </button>
                    );
                  })}
                </Carousel>
              )}
            </Col>
            <Col md="auto" className={styles.verticallyCenter}>
              <button
                style={{ transform: "translateX(-20px)" }}
                className={styles.dateCarouselArrowBtn}
                onClick={() => {
                  carouselRef.current.next();
                  dispatch({ type: "INCREMENT_DATE_INDEX" });
                }}
              >
                <RightArrow />
              </button>
            </Col>
            <Col
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "500px",
                alignItems: "center",
              }}
            >
              <div
                className={styles.contactInfo}
                style={{
                  marginRight: "30px",
                  textAlign: "center",
                }}
              >
                <div
                  className={styles.bold}
                  style={{ marginBottom: "10px", color: "#f26522" }}
                >
                  {state.selectedBusinessID && "Contact Info"}
                </div>
                <div>{state.selectedBusinessData.business_email}</div>
                <div>{state.selectedBusinessData.business_phone_num}</div>
              </div>
              <div
                style={{
                  marginRight: "30px",
                  textAlign: "center",
                }}
                className={styles.bold}
              >
                <div style={{ marginBottom: "10px", color: "#f26522" }}>
                  No. of Meals
                </div>
                <div style={{ fontSize: "20px" }}>
                  {calculateTotalMealQty(
                    filterDataByBusiness(
                      state.ordersData,
                      state.selectedBusinessID
                    )
                  )}
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                }}
                className={styles.bold}
              >
                <div style={{ marginBottom: "10px", color: "#f26522" }}>
                  Total Revenue
                </div>
                <div style={{ fontSize: "20px" }}>
                  {currencyFormatter.format(
                    calculateTotalRevenue(
                      filterDataByBusiness(
                        state.revenueData,
                        state.selectedBusinessID
                      )
                    )
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <Row
            className={[styles.row2].join(" ")}
            // style={{ overflow: "scroll" }}
          >
            <Col
              className={styles.section}
              style={{ marginRight: 10, maxWidth: "40%", minWidth: "30%" }}
            >
              <div
                className={styles.bold}
                style={{ padding: "15px", fontSize: "18px" }}
              >
                Upcoming Meal Orders And Revenue:{" "}
                {formatDisplayDate(formatToDisplayDate(state.selectedDate))}
              </div>
              <TableContainer className={styles.tableContainer}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortOrders.direction}
                          onClick={() => changeSortOrder("total_qty")}
                        >
                          Qty.
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortOrders.direction}
                          onClick={() => changeSortOrder("meal_name")}
                        >
                          Meal Orders
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        Meal Pictures
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortOrders.direction}
                          onClick={() => changeSortOrder("meal_cost")}
                        >
                          Meal Cost
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortOrders.direction}
                          onClick={() => changeSortOrder("total_cost")}
                        >
                          Total Cost
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortOrders.direction}
                          onClick={() =>
                            changeSortOrder("total_profit_sharing")
                          }
                        >
                          Additional Revenue
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.ordersData &&
                      filterDataByBusiness(
                        state.ordersData,
                        state.selectedBusinessID
                      ).map((item, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                fontSize: "18px",
                                borderBottom: "1px solid #f26522",
                              }}
                            >
                              {item.total_qty}
                            </TableCell>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {item.meal_name}
                            </TableCell>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              <img
                                src={item.meal_photo_URL}
                                className={styles.mealImg}
                              ></img>
                            </TableCell>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {currencyFormatter.format(item.meal_cost)}
                            </TableCell>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {currencyFormatter.format(item.total_cost)}
                            </TableCell>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {currencyFormatter.format(
                                item.total_profit_sharing
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Col>
            <Col
              md="auto"
              className={styles.section}
              style={{ marginRight: 10, maxWidth: "31%" }}
            >
              <div
                className={styles.bold}
                style={{ padding: "15px", fontSize: "18px" }}
              >
                Revenue:{" "}
                {formatDisplayDate(formatToDisplayDate(state.selectedDate))}
              </div>
              <TableContainer className={styles.tableContainer}>
                {" "}
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortRevenue.direction}
                          onClick={() => changeSortRevenue("business_name")}
                        >
                          Restaurant Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortRevenue.direction}
                          onClick={() => changeSortRevenue("total_cost")}
                        >
                          Total Cost
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortRevenue.direction}
                          onClick={() =>
                            changeSortRevenue("total_profit_sharing")
                          }
                        >
                          Additional Revenue
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortRevenue.direction}
                          onClick={() => changeSortRevenue("total_revenue")}
                        >
                          Total Revenue
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortRevenue.direction}
                          onClick={() => changeSortRevenue("total_M4ME_rev")}
                        >
                          M4ME Profits
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.revenueData &&
                      filterDataByBusiness(
                        state.revenueData,
                        state.selectedBusinessID
                      ).map((item, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {item.business_name}
                            </TableCell>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {currencyFormatter.format(item.total_cost)}
                            </TableCell>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {currencyFormatter.format(
                                item.total_profit_sharing
                              )}
                            </TableCell>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {currencyFormatter.format(item.total_revenue)}
                            </TableCell>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {currencyFormatter.format(item.total_M4ME_rev)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Col>
            <Col
              md="auto"
              className={styles.section}
              style={{ maxWidth: "29%" }}
            >
              <div
                className={styles.bold}
                style={{ padding: "15px", fontSize: "18px" }}
              >
                {" "}
                Ingredients Needed:{" "}
                {formatDisplayDate(formatToDisplayDate(state.selectedDate))}
              </div>

              <TableContainer className={styles.tableContainer}>
                {" "}
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortIngredients.direction}
                          onClick={() =>
                            changeSortIngredient("ingredient_desc")
                          }
                        >
                          Ingredient Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortIngredients.direction}
                          onClick={() => changeSortIngredient("total_qty")}
                        >
                          Qty.
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortIngredients.direction}
                          onClick={() => changeSortIngredient("package_unit")}
                        >
                          Unit
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortIngredients.direction}
                          onClick={() =>
                            changeSortIngredient("package_measure")
                          }
                        >
                          Measure
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#f26522",
                          border: "none",
                        }}
                      >
                        <TableSortLabel
                          style={{
                            fontWeight: "bold",
                            color: "#f26522",
                            border: "none",
                          }}
                          direction={state.sortIngredients.direction}
                          onClick={() => changeSortIngredient("package_cost")}
                        >
                          Cost
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.ingredientsData &&
                      filterDataByBusiness(
                        state.ingredientsData,
                        state.selectedBusinessID
                      ).map((item, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {item.ingredient_desc}
                            </TableCell>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {item.total_qty}
                            </TableCell>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {item.package_unit}
                            </TableCell>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {item.package_measure}
                            </TableCell>
                            <TableCell
                              style={{ borderBottom: "1px solid #f26522" }}
                            >
                              {currencyFormatter.format(item.package_cost)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default withRouter(OrdersIngredients);
