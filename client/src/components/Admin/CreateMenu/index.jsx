import { useEffect, useMemo, useReducer, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import { formatTime, sortedArray } from "../../../reducers/helperFuncs";
import { ReactComponent as LeftArrow } from "./static/dateLeftArrow.svg";
import { ReactComponent as RightArrow } from "./static/dateRightArrow.svg";
import { ReactComponent as ModalCloseBtn } from "./static/modalClose.svg";

import {
  Breadcrumb,
  Form,
  Button,
  Container,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import {
  Table,
  TableHead,
  TableSortLabel,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faSave } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router";
import styles from "./createMenu.module.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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

const initialState = {
  mounted: false,
  menuData: [],
  menuDate: "",
  allMenuDates: [],
  editedMenu: [],
  sortEditMenu: {
    field: "",
    direction: "",
  },
  mealData: [],
  showAddMeal: false,
  newMeal: {
    menu_date: "",
    default_meal: "FALSE",
    meal_cat: "",
    meal_uid: "",
    menu_category: "",
    menu_type: "",
  },
  showAddDate: false,
  newDate: {
    menu_date: "",
  },
  showCopyDate: false,
  copyDate: {
    date1: "",
    date2: "",
  },
  businessData: [],
  dateIndex: null,
  carouselLoaded: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "MOUNT":
      return {
        ...state,
        mounted: true,
      };
    case "FETCH_MENU":
      return {
        ...state,
        menuData: action.payload,
      };
    case "CHANGE_DATE":
      return {
        ...state,
        menuDate: action.payload,
        newMeal: {
          ...state.newMeal,
          menu_date: action.payload,
        },
      };
    case "FETCH_MEALS":
      return {
        ...state,
        mealData: action.payload,
      };
    case "SORT_MENU":
      return {
        ...state,
        sortEditMenu: {
          field: action.payload.field,
          direction: action.payload.direction,
        },
      };
    case "EDIT_MENU":
      return {
        ...state,
        editedMenu: action.payload,
      };
    case "TOGGLE_ADD_MENU_ITEM":
      return {
        ...state,
        showAddMeal: !state.showAddMeal,
        newMeal: {
          ...initialState.newMeal,
          // Date hould be YYYY-MM-DD for date input
          menu_date: state.menuDate.slice(0, 10),
        },
      };
    case "EDIT_NEW_MEAL_MENU":
      return {
        ...state,
        newMeal: action.payload,
      };
    case "TOGGLE_ADD_MENU_DATE":
      return {
        ...state,
        showAddDate: !state.showAddDate,
        newDate: {
          ...initialState.newDate,
        },
      };
    case "EDIT_NEW_MENU_DATE":
      return {
        ...state,
        newDate: action.payload,
      };
    case "TOGGLE_COPY_MENU_DATE":
      return {
        ...state,
        showCopyDate: !state.showCopyDate,
        copyDate: {
          ...initialState.newDate,
        },
      };
    case "COPY_FROM_MENU_DATE":
      return {
        ...state,
        copyDate: action.payload,
      };
    case "FETCH_DATES":
      return {
        ...state,
        allMenuDates: action.payload.menuDates,
        dateIndex: action.payload.dateIndex,
        menuDate: action.payload.menuDate,
      };
    case "FETCH_BUSINESSES":
      return {
        ...state,
        businessData: action.payload,
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

function CreateMenu({ history, ...props }) {
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

  // Get Dates
  useEffect(() => {
    let nextMenuDate = "";
    axios
      .get(`${API_URL}all_menu_dates`)
      .then((response) => {
        const datesApiResult = response.data.result;
        const closestDateIndex = getClosestDateIndex(datesApiResult);
        nextMenuDate = datesApiResult[closestDateIndex].menu_date;
        dispatch({
          type: "FETCH_DATES",
          payload: {
            menuDates: datesApiResult,
            dateIndex: closestDateIndex,
            menuDate: nextMenuDate,
          },
        });
        return axios.get(
          `${API_URL}meals_ordered_by_date/${nextMenuDate.substring(0, 10)}`
        );
      })
      .then((response) => {
        if (response.status === 200) {
          const mealsApi = response.data.result;
          if (mealsApi !== undefined) {
            dispatch({ type: "FETCH_MENU", payload: mealsApi });
            dispatch({ type: "EDIT_MENU", payload: mealsApi });
          }
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
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}all_businesses`)
      .then((response) => {
        const businessApiResult = response.data.result;
        dispatch({ type: "FETCH_BUSINESSES", payload: businessApiResult });
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

  const menuDates = useMemo(() => {
    const menuDatesFormatted = state.allMenuDates.map((item) => {
      const menuDate = item.menu_date;
      const menuDateTime = new Date(formatTime(menuDate));
      return {
        value: menuDate,
        display: menuDateTime.toDateString(),
      };
    });
    return menuDatesFormatted;
  }, [state.allMenuDates]);

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

  const getClosestDateIndex = (dates) => {
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

    const currMonth = now.substring(4, 7);
    let currMonthVal = 0;
    const currDay = now.substring(8, 10);
    const currYear = now.substring(11, 15);

    // assign value to current month
    for (let i = 0, l = monthDict.length; i < l; i++) {
      if (currMonth === monthDict[i].key) {
        currMonthVal = monthDict[i].value;
      }
    }

    let closestDateIndex = 0;

    for (let i = 0, l = dates.length; i < l; i++) {
      var date = dates[i];
      var year = date.menu_date.substring(0, 4);
      var month = date.menu_date.substring(5, 7);
      var day = date.menu_date.substring(8, 10);

      if (currYear <= year) {
        if (currMonthVal < month) {
          if (!closestDateIndex) {
            return (closestDateIndex = i);
          }
        } else if (currMonthVal == month) {
          if (currDay <= day) {
            if (!closestDateIndex) {
              return (closestDateIndex = i);
            }
          }
        }
      }
    }
    return 0;
  };

  const getMenuData = async (date) => {
    const mealApiData = await axios.get(
      `${API_URL}meals_ordered_by_date/${date.substring(0, 10)}`
    );
    const mealApiDataResult = mealApiData.data.result;
    // await axios
    //   .get(`${API_URL}meals_ordered_by_date/${date.substring(0, 10)}`)
    //   .then((response) => {
    //     mealsApi = response.data.result;
    //   })
    //   .then((response) => {
    //     if (response.status === 200) {
    //       const mealsApi = response.data.result;
    //       if (mealsApi !== undefined) {
    //         dispatch({ type: "FETCH_MENU", payload: mealsApi });
    //         dispatch({ type: "EDIT_MENU", payload: mealsApi });
    //       }
    //     }
    //   })
    //   .catch((err) => {
    //     if (err.response) {
    //       // eslint-disable-next-line no-console
    //       console.log(err.response);
    //     }
    //     // eslint-disable-next-line no-console
    //     console.log(err);
    //   });
    return mealApiDataResult;
  };

  const getMealsByCategory = (category) => {
    const mealList = state.mealData.filter(
      (meal) => meal.meal_category === category
    );
    return mealList;
  };

  const getMealTypes = () => {
    const menuTypes = state.menuData.map((menuItem) => menuItem.menu_type);
    const menuTypesUnique = menuTypes.filter(
      (elt, index) => menuTypes.indexOf(elt) === index
    );
    return menuTypesUnique;
  };

  const getMealCategories = () => {
    const mealCategories = state.menuData.map(
      (menuItem) => menuItem.meal_category
    );
    const mealCategoriesUnique = mealCategories.filter(
      (elt, index) => mealCategories.indexOf(elt) === index && elt
    );
    return mealCategoriesUnique;
  };

  const getMenuCategories = () => {
    const menuCategories = state.menuData.map(
      (menuItem) => menuItem.menu_category
    );
    const menuCategoriesUnique = menuCategories.filter(
      (elt, index) => menuCategories.indexOf(elt) === index && elt
    );
    return menuCategoriesUnique;
  };

  const updateMenu = () => {
    axios
      .get(`${API_URL}meals_ordered_by_date/${state.menuDate.substring(0, 10)}`)
      .then((response) => {
        if (response.status === 200) {
          const fullMenu = response.data.result;
          if (fullMenu !== undefined) {
            dispatch({ type: "FETCH_MENU", payload: fullMenu });
          }
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
  };

  // Fetch menu
  // useEffect(() => {
  //   updateMenu();
  // }, []);

  // Fetch meals
  useEffect(() => {
    axios
      .get(`${API_URL}meals`)
      .then((response) => {
        const mealApiResult = response.data.result;
        dispatch({ type: "FETCH_MEALS", payload: mealApiResult });
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

  // Change Date
  const changeDate = (newDate) => {
    dispatch({ type: "CHANGE_DATE", payload: newDate });
    //const curMenu = getMenuData(newDate);
    // curMenu.then((response) => console.log(response));
    //console.log(curMenu);
    getMenuData(newDate)
      .then((curMenu) => {
        if (curMenu) {
          const sortedMenu = sortedArray(
            curMenu,
            state.sortEditMenu.field,
            state.sortEditMenu.direction
          );
          dispatch({ type: "EDIT_MENU", payload: sortedMenu });
        } else {
          dispatch({ type: "EDIT_MENU", payload: [] });
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
  };

  // useEffect(() => {
  //   changeDate("2021-06-30");
  // }, []);

  const changeSortOptions = (field) => {
    const isAsc =
      state.sortEditMenu.field === field &&
      state.sortEditMenu.direction === "asc";
    const direction = isAsc ? "desc" : "asc";
    dispatch({
      type: "SORT_MENU",
      payload: {
        field: field,
        direction: direction,
      },
    });
    const sortedMenu = sortedArray(state.editedMenu, field, direction);
    dispatch({ type: "EDIT_MENU", payload: sortedMenu });
  };

  // Save Upodate menu item
  // Save Upodate menu item
  const updateMenuItem = (menuItem) => {
    if (menuItem.menu_uid) {
      // Update previous item
      axios
        .put(`${API_URL}menu`, menuItem)
        .then(() => {
          updateMenu();
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
      // Saving item from template
      const newMenuItem = {
        ...menuItem,
        delivery_days: ["Sunday", "Monday"],
        meal_price: "10",
      };
      axios
        .post(`${API_URL}menu`, newMenuItem)
        .then((response) => {
          const newMenuId = response.data.meal_uid;
          const newMenuItemId = {
            ...newMenuItem,
            menu_uid: newMenuId,
          };
          const oldIndex = state.editedMenu.indexOf(menuItem);
          const newEditedMenu = [...state.editedMenu];
          newEditedMenu[oldIndex] = newMenuItemId;
          dispatch({ type: "EDIT_MENU", payload: newEditedMenu });
        })
        .catch((err) => {
          if (err.response) {
            // eslint-disable-next-line no-console
            console.log(err.response);
          }
          // eslint-disable-next-line no-console
          console.log(err);
        });
    }
  };

  // Delete menu item
  const deleteMenuItem = (menuItem) => {
    const menuId = menuItem.menu_uid;
    const menuIndex = state.editedMenu.indexOf(menuItem);
    if (menuId) {
      // Delete from database
      axios
        .delete(`${API_URL}menu`, {
          params: {
            menu_uid: menuId,
          },
        })
        .then(() => {
          const newMenu = [...state.editedMenu];
          newMenu.splice(menuIndex, 1);
          dispatch({ type: "EDIT_MENU", payload: newMenu });
          updateMenu();
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
      // Delete from template
      const newMenu = [...state.editedMenu];
      newMenu.splice(menuIndex, 1);
      dispatch({ type: "EDIT_MENU", payload: newMenu });
    }
  };

  const copyDate = (newDate) => {
    dispatch({ type: "CHANGE_DATE", payload: newDate });
    getMenuData(newDate)
      .then((curMenu) => {
        if (curMenu) {
          const sortedMenu = sortedArray(
            curMenu,
            state.sortEditMenu.field,
            state.sortEditMenu.direction
          );
          dispatch({ type: "EDIT_MENU", payload: sortedMenu });
        } else {
          dispatch({ type: "EDIT_MENU", payload: [] });
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
  };

  // Toggle Add Menu modal
  const toggleAddMenu = () => {
    dispatch({ type: "TOGGLE_ADD_MENU_ITEM" });
  };

  // Toggle Add Date Modal
  const toggleAddDate = () => {
    dispatch({ type: "TOGGLE_ADD_MENU_DATE" });
  };

  const toggleCopyDate = () => {
    dispatch({ type: "TOGGLE_COPY_MENU_DATE" });
  };

  const saveMenuTemplate = () => {
    const menuDate = `${state.newDate.menu_date} 00:00:00`;
    console.log(menuDate);
    const menuDateFormatted = new Date(menuDate).toDateString();
    dispatch({ type: "TOGGLE_ADD_MENU_DATE" });
    menuDates.push({
      value: menuDate,
      display: menuDateFormatted,
    });
    const menuTemplate = [
      {
        menu_type: "Weekly Entree",
        menu_date: menuDate,
        meal_uid: "",
        meal_category: "Entree",
        meal_cat: "Entree",
        menu_category: "WKLY_SPCL_1",
        default_meal: "FALSE",
      },
      {
        menu_type: "Weekly Salad",
        menu_date: menuDate,
        meal_uid: "",
        meal_category: "Salad",
        meal_cat: "Salad",
        menu_category: "WKLY_SPCL_2",
        default_meal: "FALSE",
      },
      {
        menu_type: "Weekly Soup",
        menu_date: menuDate,
        meal_uid: "",
        meal_category: "Soup",
        meal_cat: "Soup",
        menu_category: "WKLY_SPCL_3",
        default_meal: "FALSE",
      },
      {
        menu_type: "Seasonal Entree",
        menu_date: menuDate,
        meal_uid: "",
        meal_category: "Entree",
        meal_cat: "Entree",
        menu_category: "SEAS_FAVE_1",
        default_meal: "FALSE",
      },
      {
        menu_type: "Seasonal Salad",
        menu_date: menuDate,
        meal_uid: "",
        meal_category: "Salad",
        meal_cat: "Salad",
        menu_category: "SEAS_FAVE_2",
        default_meal: "FALSE",
      },
      {
        menu_type: "Breakfast",
        menu_date: menuDate,
        meal_uid: "",
        meal_category: "Breakfast",
        meal_cat: "Breakfast",
        menu_category: "SEAS_FAVE_3",
        default_meal: "FALSE",
      },
      {
        menu_type: "Smoothie",
        menu_date: menuDate,
        meal_uid: "",
        meal_category: "Smoothie",
        meal_cat: "Smoothie",
        menu_category: "SMOOTHIE_1",
        default_meal: "FALSE",
      },
      {
        menu_type: "Smoothie",
        menu_date: menuDate,
        meal_uid: "",
        meal_category: "Smoothie",
        meal_cat: "Smoothie",
        menu_category: "SMOOTHIE_2",
        default_meal: "FALSE",
      },
      {
        menu_type: "Smoothie",
        menu_date: menuDate,
        meal_uid: "",
        meal_category: "Smoothie",
        meal_cat: "Smoothie",
        menu_category: "SMOOTHIE_3",
        default_meal: "FALSE",
      },
      {
        menu_type: "Local Treat",
        menu_date: menuDate,
        meal_uid: "",
        meal_cat: "Add-On",
        menu_category: "ADD_ON_1",
        default_meal: "FALSE",
      },
      {
        menu_type: "Local Treat",
        menu_date: menuDate,
        meal_uid: "",
        meal_cat: "Add-On",
        menu_category: "ADD_ON_2",
        default_meal: "FALSE",
      },
      {
        menu_type: "Local Treat",
        menu_date: menuDate,
        meal_uid: "",
        meal_cat: "Add-On",
        menu_category: "ADD_ON_3",
        default_meal: "TRUE",
      },
    ];
    dispatch({ type: "CHANGE_DATE", payload: menuDate });
    dispatch({ type: "EDIT_MENU", payload: menuTemplate });
  };

  if (!state.mounted) {
    return null;
  }

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
    <div className={styles.root}>
      {console.log(state)}
      <Container fluid className={styles.container}>
        <Row className={styles.section}>
          <Col
            md="auto"
            className={[styles.verticallyCenter, styles.bold].join(" ")}
            style={{ fontSize: "20px" }}
          >
            Create / Edit Menu
          </Col>
          <Col md="auto" className={styles.verticallyCenter}></Col>
          <button
            style={{ transform: "translateX(10px)" }}
            className={styles.dateCarouselArrowBtn}
            onClick={() => {
              carouselRef.current.previous();
              dispatch({ type: "DECREMENT_DATE_INDEX" });
            }}
          >
            <LeftArrow />
          </button>
          <Col md="auto" style={{ width: "450px" }}>
            {state.dateIndex != null && (
              <Carousel
                responsive={responsive}
                ref={carouselRef}
                arrows={false}
                sliderClass={styles.carouselSlider}
                keyBoardControl
              >
                {menuDates.map((date) => {
                  const dateButtonStatus =
                    date.value === state.menuDate
                      ? styles.datebuttonSelected
                      : styles.datebuttonNotSelected;
                  return (
                    <button
                      className={[
                        styles.datebutton,
                        dateButtonStatus,
                        styles.bold,
                      ].join(" ")}
                      key={date.value}
                      value={date.value}
                      onClick={(e) => changeDate(e.target.value)}
                    >
                      {date.display.substring(0, 3).toUpperCase()} <br />{" "}
                      {date.display.substring(4, 10)}
                    </button>
                  );
                })}
              </Carousel>
            )}
            {/* <Form>
              <Form.Group as={Row}>
                <Col sm="6">
                  <Form.Control
                    as="select"
                    value={state.menuDate}
                    onChange={(event) => changeDate(event.target.value)}
                  >
                    <option value="" hidden>
                      Choose date
                    </option>
                    {menuDates.map((date) => (
                      <option value={date.value} key={date.value}>
                        {date.display}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Form.Group>
            </Form> */}
          </Col>
          <button
            style={{ transform: "translateX(0px)" }}
            className={styles.dateCarouselArrowBtn}
            onClick={() => {
              carouselRef.current.next();
              dispatch({ type: "INCREMENT_DATE_INDEX" });
            }}
          >
            <RightArrow />
          </button>
          <Col
            md="auto"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "500px",
              alignItems: "center",
            }}
          >
            <button onClick={toggleCopyDate} className={styles.topBtn}>
              Copy Menu
            </button>
            <button onClick={toggleAddDate} className={[styles.topBtn]}>
              Add Menu Date
            </button>
            <button onClick={toggleAddMenu} className={styles.topBtn}>
              Add Menu Item
            </button>
          </Col>
        </Row>
        <Row className={[styles.section, styles.main].join(" ")}>
          <Col>
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
                      active={state.sortEditMenu.field === "menu_type"}
                      direction={
                        state.sortEditMenu.field === "menu_type"
                          ? state.sortEditMenu.direction
                          : "asc"
                      }
                      onClick={() => changeSortOptions("menu_type")}
                    >
                      Meal Type
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
                      active={state.sortEditMenu.field === "meal_name"}
                      direction={
                        state.sortEditMenu.field === "meal_name"
                          ? state.sortEditMenu.direction
                          : "asc"
                      }
                      onClick={() => changeSortOptions("meal_name")}
                    >
                      Meal Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                    }}
                  >
                    Picture
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
                      active={state.sortEditMenu.field === "meal_business"}
                      direction={
                        state.sortEditMenu.field === "meal_business"
                          ? state.sortEditMenu.direction
                          : "asc"
                      }
                      onClick={() => changeSortOptions("meal_business")}
                    >
                      Business
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
                      active={state.sortEditMenu.field === "meal_category"}
                      direction={
                        state.sortEditMenu.field === "meal_category"
                          ? state.sortEditMenu.direction
                          : "asc"
                      }
                      onClick={() => changeSortOptions("meal_category")}
                    >
                      Meal Category
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
                      active={state.sortEditMenu.field === "menu_category"}
                      direction={
                        state.sortEditMenu.field === "menu_category"
                          ? state.sortEditMenu.direction
                          : "asc"
                      }
                      onClick={() => changeSortOptions("menu_category")}
                    >
                      Menu Category
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
                      active={state.sortEditMenu.field === "default_meal"}
                      direction={
                        state.sortEditMenu.field === "default_meal"
                          ? state.sortEditMenu.direction
                          : "asc"
                      }
                      onClick={() => changeSortOptions("default_meal")}
                    >
                      Default Meal
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                    }}
                  >
                    Actions
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
                      active={state.sortEditMenu.field === "total_qty"}
                      direction={
                        state.sortEditMenu.field === "total_qty"
                          ? state.sortEditMenu.direction
                          : "asc"
                      }
                      onClick={() => changeSortOptions("total_qty")}
                    >
                      Meals Ordered
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.editedMenu
                  .filter((item) => item.meal_name !== null)
                  .map((mealMenu, mealMenuIndex) => {
                    const otherMealCategories = mealMenu.meal_category
                      ? getMealsByCategory(mealMenu.meal_category)
                      : state.mealData;
                    return (
                      <TableRow
                        key={`${mealMenuIndex} ${mealMenu.menu_uid}`}
                        hover
                      >
                        <TableCell
                          style={{ borderBottom: "1px solid #f8bb17" }}
                        >
                          {mealMenu.menu_type}
                        </TableCell>
                        <TableCell
                          style={{ borderBottom: "1px solid #f8bb17" }}
                        >
                          <Form>
                            <Form.Control
                              as="select"
                              value={mealMenu.meal_uid}
                              onChange={(event) => {
                                const newMenu = [...state.editedMenu];
                                const newMealId = event.target.value;
                                const newMealInfo = state.mealData.filter(
                                  (meal) => meal.meal_uid === newMealId
                                )[0];
                                // const mealMenuIndex = newMenu.findIndex((elt) => elt.menu_uid === mealMenu.menu_uid);
                                newMenu[mealMenuIndex] = {
                                  ...newMenu[mealMenuIndex],
                                  ...newMealInfo,
                                  menu_meal_id: newMealId,
                                };
                                dispatch({
                                  type: "EDIT_MENU",
                                  payload: newMenu,
                                });
                              }}
                            >
                              <option value="" hidden>
                                {" "}
                                Choose Meal{" "}
                              </option>
                              {otherMealCategories.map((meal) => (
                                <option
                                  value={meal.meal_uid}
                                  key={meal.meal_uid}
                                >
                                  {meal.meal_name}
                                </option>
                              ))}
                            </Form.Control>
                          </Form>
                        </TableCell>
                        <TableCell
                          style={{ borderBottom: "1px solid #f8bb17" }}
                        >
                          <img
                            src={mealMenu.meal_photo_URL}
                            style={{ height: "60px", width: "60px" }}
                          ></img>
                        </TableCell>
                        <TableCell
                          style={{ borderBottom: "1px solid #f8bb17" }}
                        >
                          {getBusinessName(mealMenu.meal_business)}
                        </TableCell>
                        <TableCell
                          style={{ borderBottom: "1px solid #f8bb17" }}
                        >
                          {mealMenu.meal_category}
                        </TableCell>
                        <TableCell
                          style={{ borderBottom: "1px solid #f8bb17" }}
                        >
                          {mealMenu.menu_category}
                        </TableCell>
                        <TableCell
                          style={{ borderBottom: "1px solid #f8bb17" }}
                        >
                          <Form>
                            <Form.Control
                              as="select"
                              value={mealMenu.default_meal}
                              onChange={(event) => {
                                const newMenu = [...state.editedMenu];
                                const newDefaultMeal = event.target.value;
                                // const mealMenuIndex = newMenu.findIndex((elt) => elt.menu_uid === mealMenu.menu_uid);
                                newMenu[mealMenuIndex] = {
                                  ...newMenu[mealMenuIndex],
                                  default_meal: newDefaultMeal,
                                };
                                dispatch({
                                  type: "EDIT_MENU",
                                  payload: newMenu,
                                });
                              }}
                            >
                              <option value="FALSE"> FALSE </option>
                              <option value="TRUE"> TRUE </option>
                            </Form.Control>
                          </Form>
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                          }}
                        >
                          <button
                            className={"icon-button"}
                            onClick={() => {
                              deleteMenuItem(mealMenu);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                          <button
                            className={"icon-button"}
                            onClick={() => {
                              updateMenuItem(mealMenu);
                            }}
                          >
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                        </TableCell>
                        <TableCell
                          style={{ borderBottom: "1px solid #f8bb17" }}
                        >
                          {mealMenu.total_qty}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Col>
        </Row>
      </Container>
      <Modal
        show={state.showAddMeal}
        onHide={toggleAddMenu}
        animation={false}
        dialogClassName={styles.modalContainer}
      >
        <div className={styles.modalCloseBtnContainer}>
          <ModalCloseBtn
            style={{ cursor: "pointer" }}
            onClick={toggleAddMenu}
          />
        </div>
        <div
          style={{ border: "none", paddingLeft: "15px", fontWeight: "bold" }}
        >
          <Modal.Title> Add Menu Item </Modal.Title>
        </div>
        <Modal.Body>
          <Form>
            <Form.Group
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <Form.Label className={styles.modalFormLabel}>
                Menu Date
              </Form.Label>
              <Form.Control
                type="date"
                value={state.newMeal.menu_date}
                onChange={(event) => {
                  const newDate = event.target.value;
                  const newMeal = {
                    ...state.newMeal,
                    menu_date: newDate,
                  };
                  dispatch({ type: "EDIT_NEW_MEAL_MENU", payload: newMeal });
                }}
              />
            </Form.Group>
            <Form.Group
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <Form.Label className={styles.modalFormLabel}>
                Meal Type
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.meal_type}
                onChange={(event) => {
                  const newMealType = event.target.value;
                  const newMeal = {
                    ...state.newMeal,
                    menu_type: newMealType,
                  };
                  dispatch({ type: "EDIT_NEW_MEAL_MENU", payload: newMeal });
                }}
              >
                <option value="" hidden>
                  Choose Meal Type
                </option>
                {getMealTypes().map((mealType) => (
                  <option value={mealType} key={mealType}>
                    {mealType}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <Form.Label className={styles.modalFormLabel}>Meal</Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.meal_uid}
                onChange={(event) => {
                  const newMealId = event.target.value;
                  const newMeal = {
                    ...state.newMeal,
                    meal_uid: newMealId,
                  };
                  dispatch({ type: "EDIT_NEW_MEAL_MENU", payload: newMeal });
                }}
              >
                <option value="" hidden>
                  Choose Meal
                </option>
                {state.mealData.map((meal) => (
                  <option value={meal.meal_uid} key={meal.meal_uid}>
                    {meal.meal_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <Form.Label className={styles.modalFormLabel}>
                Meal Category
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.meal_cat}
                onChange={(event) => {
                  const newMealCat = event.target.value;
                  const newMeal = {
                    ...state.newMeal,
                    meal_cat: newMealCat,
                  };
                  dispatch({ type: "EDIT_NEW_MEAL_MENU", payload: newMeal });
                }}
              >
                <option value="" hidden>
                  Choose Meal Category
                </option>
                {getMealCategories().map((mealCategory) => (
                  <option value={mealCategory} key={mealCategory}>
                    {mealCategory}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <Form.Label className={styles.modalFormLabel}>
                Menu Category
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.menu_category}
                onChange={(event) => {
                  const newMenuCategory = event.target.value;
                  const newMeal = {
                    ...state.newMeal,
                    menu_category: newMenuCategory,
                  };
                  dispatch({ type: "EDIT_NEW_MEAL_MENU", payload: newMeal });
                }}
              >
                <option value="" hidden>
                  Choose Menu Category
                </option>
                {getMenuCategories().map((menuCategory) => (
                  <option value={menuCategory} key={menuCategory}>
                    {menuCategory}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <Form.Label className={styles.modalFormLabel}>
                Default Meal
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.default_meal}
                onChange={(event) => {
                  const newDefaultMeal = event.target.value;
                  const newMeal = {
                    ...state.newMeal,
                    default_meal: newDefaultMeal,
                  };
                  dispatch({ type: "EDIT_NEW_MEAL_MENU", payload: newMeal });
                }}
              >
                <option value="FALSE"> FALSE </option>
                <option value="TRUE"> TRUE </option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ border: "none", justifyContent: "center" }}>
          <button
            className={styles.modalBtn}
            onClick={() => {
              const newMenuItemInfo = state.mealData.filter(
                (meal) => meal.meal_uid === state.newMeal.meal_uid
              )[0];
              // YYYY-MM-DD seems to work for request parameter, no need to add HH:MM:SS
              const newMenuItem = {
                ...state.newMeal,
                ...newMenuItemInfo,
                menu_meal_id: state.newMeal.meal_uid,
                delivery_days: ["Sunday", "Monday"],
                meal_price: "10",
              };
              axios
                .post(`${API_URL}meals_ordered_by_date`, newMenuItem)
                .then((response) => {
                  // Save New menu item with id on screen
                  const newMenuId = response.data.meal_uid;
                  const newMenuItemId = {
                    ...newMenuItem,
                    menu_uid: newMenuId,
                  };
                  const newEditedMenu = [...state.editedMenu];
                  newEditedMenu.push(newMenuItemId);
                  dispatch({ type: "EDIT_MENU", payload: newEditedMenu });
                  // Save menu item after switching to different date and back
                  updateMenu();
                  toggleAddMenu();
                })
                .catch((err) => {
                  if (err.response) {
                    // eslint-disable-next-line no-console
                    console.log(err.response);
                  }
                  // eslint-disable-next-line no-console
                  console.log(err);
                });
            }}
          >
            Save Menu Item
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={state.showAddDate}
        onHide={toggleAddDate}
        animation={false}
        dialogClassName={styles.modalContainer}
      >
        <div className={styles.modalCloseBtnContainer}>
          <ModalCloseBtn
            style={{ cursor: "pointer" }}
            onClick={toggleAddDate}
          />
        </div>
        <div
          style={{ border: "none", paddingLeft: "15px", fontWeight: "bold" }}
        >
          <Modal.Title> Add Menu Date </Modal.Title>
        </div>
        <Modal.Body>
          <Form>
            <Form.Group
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <Form.Label className={styles.modalFormLabel}>
                Menu Date
              </Form.Label>
              <Form.Control
                type="date"
                value={state.newDate.menu_date}
                onChange={(event) => {
                  const newDate = event.target.value;
                  const newDateObject = {
                    ...state.newDate,
                    menu_date: newDate,
                  };
                  dispatch({
                    type: "EDIT_NEW_MENU_DATE",
                    payload: newDateObject,
                  });
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ border: "none", justifyContent: "center" }}>
          <button className={styles.modalBtn} onClick={saveMenuTemplate}>
            Save Menu Date with Template
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={state.showCopyDate}
        onHide={toggleCopyDate}
        animation={false}
        dialogClassName={styles.modalContainer}
      >
        <div className={styles.modalCloseBtnContainer}>
          <ModalCloseBtn
            style={{ cursor: "pointer" }}
            onClick={toggleCopyDate}
          />
        </div>
        <div
          style={{ border: "none", paddingLeft: "15px", fontWeight: "bold" }}
        >
          <Modal.Title> Copy Menu </Modal.Title>
        </div>
        <Modal.Body style={{ border: "none" }}>
          <Form>
            <Form.Group
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <Form.Label className={styles.modalFormLabel}>
                Copy From Date
              </Form.Label>
              <Form.Control
                as="select"
                type="date"
                value={state.copyDate.date1}
                onChange={(event) => {
                  copyDate(event.target.value);
                  const copyToDate = event.target.value;
                  const newDateObject = {
                    ...state.copyDate,
                    date1: copyToDate,
                  };
                  dispatch({
                    type: "COPY_FROM_MENU_DATE",
                    payload: newDateObject,
                  });
                }}
              >
                <option value="" hidden>
                  Choose date
                </option>
                {menuDates.map((date) => (
                  <option value={date.value} key={date.value}>
                    {date.display}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <Form.Label className={styles.modalFormLabel}>
                Copy To Date
              </Form.Label>
              <Form.Control
                type="date"
                value={state.copyDate.date2}
                onChange={(event) => {
                  const copyToDate = event.target.value;
                  const newDateObject = {
                    ...state.copyDate,
                    date2: copyToDate,
                  };
                  dispatch({
                    type: "COPY_FROM_MENU_DATE",
                    payload: newDateObject,
                  });
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ border: "none", justifyContent: "center" }}>
          <button
            className={styles.modalBtn}
            // this is where i will call the endpoint to copy over date1 -> date2
            onClick={() => {
              // YYYY-MM-DD seems to work for request parameter, no need to add HH:MM:SS
              const newDateObject = {
                ...state.copyDate,
                date1: state.copyDate.date1,
                date2: state.copyDate.date2,
              };
              axios
                .post(`${API_URL}Copy_Menu`, newDateObject)
                .then((response) => {
                  toggleCopyDate();
                });
            }}
          >
            Copy Menu
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default withRouter(CreateMenu);
