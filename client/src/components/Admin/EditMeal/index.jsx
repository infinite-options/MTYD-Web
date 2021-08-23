import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import { Row, Col, Form, Button } from "react-bootstrap";
import {
  Table,
  TableHead,
  TableSortLabel,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { withRouter } from "react-router";
import AdminNavBar from "../AdminNavBar";
import styles from "./editMeal.module.css";
import { ReactComponent as ModalCloseBtn } from "../../../images/modalClose.svg";
import { ReactComponent as GlobeIcon } from "../../../images/globe.svg";
import { ReactComponent as FacebookIcon } from "../../../images/facebook.svg";
import { ReactComponent as InstagramIcon } from "../../../instagram.svg";
import { ReactComponent as TwitterIcon } from "../../../twitter.svg";
import { sortedArray } from "../../../reducers/helperFuncs";
import ToggleSwitch from "./toggleSwitch.jsx";

const initialState = {
  mounted: false,
  mealData: [],
  editedMeal: {
    meal_uid: "",
    meal_desc: "",
    meal_category: "",
    meal_name: "",
    meal_hint: "",
    meal_photo_URL: "",
    meal_calories: "",
    meal_protein: "",
    meal_carbs: "",
    meal_fiber: "",
    meal_sugar: "",
    meal_fat: "",
    meal_sat: "",
    meal_status: "",
  },
  selectedFile: null,
  previewLink: "",
  ingredientsData: [],
  editedMealIngredients: [],
  measureUnitsData: [],
  showIngredients: false,
  allBusinessData: [],
  activeBusinessData: null,
  editedBusinessData: {
    business_accepting_hours: null,
    business_address: "",
    business_city: "",
    business_contact_first_name: "",
    business_contact_last_name: "",
    business_desc: "",
    business_email: "",
    business_image: "",
    business_name: "",
    business_phone_num: "",
    business_phone_num2: "",
    business_state: "",
    business_status: "",
    business_type: "",
    business_uid: "",
    business_unit: "",
    business_zip: "",
    can_cancel: 0,
    delivery: 0,
    platform_fee: 0,
    profit_sharing: 0,
    reusable: 0,
    revenue_sharing: 0,
    transaction_fee: 0,
    business_facebook_url: "",
    business_instagram_url: "",
    business_twitter_url: "",
    business_website_url: "",
  },
  activeBusiness: "",
  showCreateEditMealModal: false,
  modalMode: "",
  ingredientsModified: false,
  servings: 1,
  modalError: false,
  sortMeals: {
    field: "",
    direction: "asc",
  },
  filteredMeals: [],
  editBusinessDetails: false,
};

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

function reducer(state, action) {
  switch (action.type) {
    case "MOUNT":
      return {
        ...state,
        mounted: true,
      };
    case "FETCH_MEALS":
      return {
        ...state,
        mealData: action.payload,
      };
    case "EDIT_MEAL":
      return {
        ...state,
        editedMeal: action.payload,
      };
    case "SET_PREVIEW":
      return {
        ...state,
        previewLink: action.payload,
      };
    case "FETCH_MEAL_INGREDIENTS":
      return {
        ...state,
        editedMealIngredients: action.payload,
      };
    case "FETCH_INGREDIENTS":
      return {
        ...state,
        ingredientsData: action.payload,
      };
    case "FETCH_MEASURE_UNITS":
      return {
        ...state,
        measureUnitsData: action.payload,
      };
    case "EDIT_MEAL_INGREDIENTS":
      return {
        ...state,
        editedMealIngredients: action.payload,
      };
    case "TOGGLE_SHOW_INGREDIENTS":
      return {
        ...state,
        showIngredients: !state.showIngredients,
      };
    case "FETCH_ALL_BUSINESS_DATA":
      return {
        ...state,
        allBusinessData: action.payload.data,
        // activeBusiness: action.payload.active,
        // activeBusinessData: action.payload.activeData,
      };
    case "CHANGE_ACTIVE_BUSINESS":
      return {
        ...state,
        activeBusiness: action.payload.id,
        filteredMeals: action.payload.meals,
        editedBusinessData: action.payload.business,
        activeBusinessData: action.payload.active,
      };
    case "SHOW_CREATE_EDIT_MEAL_MODAL":
      return {
        ...state,
        showCreateEditMealModal: action.payload.show,
        modalMode: action.payload.mode,
      };
    case "SET_INGREDIENTS_MODIFIED":
      return {
        ...state,
        ingredientsModified: action.payload,
      };
    case "SET_SERVINGS":
      return {
        ...state,
        servings: action.payload,
      };
    case "SET_MODAL_ERROR":
      return {
        ...state,
        modalError: action.payload,
      };

    case "CLOSE_MODAL":
      return {
        ...state,
        previewLink: "",
        showCreateEditMealModal: false,
        modalMode: "",
        showIngredients: false,
        modalError: false,
        ingredientsModified: false,
        servings: 1,
        selectedFile: null,
        editedMeal: {
          meal_uid: "",
          meal_desc: "",
          meal_category: "",
          meal_name: "",
          meal_hint: "",
          meal_photo_URL: "",
          meal_calories: "",
          meal_protein: "",
          meal_carbs: "",
          meal_fiber: "",
          meal_sugar: "",
          meal_fat: "",
          meal_sat: "",
          meal_status: "",
        },
        editedMealIngredients: [],
      };
    case "SORT_MEALS":
      return {
        ...state,
        sortMeals: {
          field: action.payload.field,
          direction: action.payload.direction,
        },
      };
    case "UPDATE_FILTERED_MEALS":
      return {
        ...state,
        filteredMeals: action.payload,
      };
    case "TOGGLE_EDIT_BUSINESS":
      return {
        ...state,
        editBusinessDetails: !state.editBusinessDetails,
      };
    case "EDIT_BUSINESS_DATA":
      return {
        ...state,
        editedBusinessData: action.payload,
      };
    default:
      return state;
  }
}

var allMeals = [];
// var mealsGenerated = false
var allBusinesses = [];
var idsGenerated = false;
// var selectedFile = null

function EditMeal({ history, ...props }) {
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

  // Fetch all ingredients
  useEffect(() => {
    axios
      .get(`${API_URL}ingredients`)
      .then((response) => {
        const ingredientApiResult = response.data.result;
        dispatch({ type: "FETCH_INGREDIENTS", payload: ingredientApiResult });
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

  // Fetch all measure units
  useEffect(() => {
    axios
      .get(`${API_URL}measure_unit`)
      .then((response) => {
        const measureUnitApiResult = response.data.result;
        dispatch({
          type: "FETCH_MEASURE_UNITS",
          payload: measureUnitApiResult,
        });
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

  // Fetch all meals and business data

  useEffect(() => {
    let mealApiResult = null;
    axios
      .get(`${API_URL}meals`)
      .then((response) => {
        if (response.status === 200) {
          mealApiResult = response.data.result;
          for (let index = 0; index < mealApiResult.length; index++) {
            for (const property in mealApiResult[index]) {
              const value = mealApiResult[index][property];
              mealApiResult[index][property] = value ? value.toString() : "";
            }
          }
          dispatch({ type: "FETCH_MEALS", payload: mealApiResult });
          return axios.get(`${API_URL}all_businesses`);
        }
      })
      .then((response) => {
        const allBusinessData = response.data.result;
        let activeBusinessData = null;
        if (allBusinessData.length > 0) {
          if (
            document.cookie
              .split(";")
              .some((item) => item.trim().startsWith("last_active_business="))
          ) {
            // Get last used business
            const saved_business_uid = document.cookie
              .split("; ")
              .find((row) => row.startsWith("last_active_business="))
              .split("=")[1];

            const savedBusinessData = allBusinessData.filter(
              (business) => business.business_uid === saved_business_uid
            )[0];
            activeBusinessData = {
              ...savedBusinessData,
              business_accepting_hours: parseBusinessHours(
                savedBusinessData.business_accepting_hours
              ),
            };
          } else {
            // use first business as active business
            activeBusinessData = {
              ...allBusinessData[0],
              business_accepting_hours: parseBusinessHours(
                allBusinessData[0].business_accepting_hours
              ),
            };
          }
          dispatch({
            type: "FETCH_ALL_BUSINESS_DATA",
            payload: {
              data: allBusinessData,
            },
          });
          dispatch({
            type: "CHANGE_ACTIVE_BUSINESS",
            payload: {
              id: activeBusinessData.business_uid,
              business: activeBusinessData,
              meals: getMealsByBusiness(
                activeBusinessData.business_uid,
                mealApiResult
              ),
              active: activeBusinessData,
            },
          });
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

  const updateMealData = (updatedMealId, action) => {
    axios
      .get(`${API_URL}meals`)
      .then((response) => {
        if (response.status === 200) {
          const mealApiResult = response.data.result;
          for (let index = 0; index < mealApiResult.length; index++) {
            for (const property in mealApiResult[index]) {
              const value = mealApiResult[index][property];
              mealApiResult[index][property] = value ? value.toString() : "";
            }
          }

          const updatedMealData = [...state.filteredMeals];

          // get updated meal info from api if put or post
          const updatedMeal =
            action !== "delete"
              ? mealApiResult.filter(
                  (meal) => meal.meal_uid === updatedMealId
                )[0]
              : null;

          // get index of meal that was edited
          const mealIndex = state.filteredMeals.findIndex(
            (meal) => meal.meal_uid === updatedMealId
          );
          // Meal exists - find it and update it
          if (action === "put") {
            updatedMealData[mealIndex] = updatedMeal;
          } else if (action === "post") {
            // meal does not exist - add it to list
            updatedMealData.push(updatedMeal);
          } else {
            // meal was deleted - remove from state
            updatedMealData.splice(mealIndex, 1);
          }

          dispatch({ type: "FETCH_MEALS", payload: mealApiResult });
          dispatch({ type: "UPDATE_FILTERED_MEALS", payload: updatedMealData });
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

  const getMealCategories = () => {
    return ["Entree", "Salad", "Soup", "Dessert", "Other"];
  };

  const editMeal = (property, value) => {
    if (property === "") {
      // Initialize edit meal form, value is meal id
      const newMeal = state.mealData.filter(
        (meal) => meal.meal_uid === value
      )[0];
      dispatch({ type: "EDIT_MEAL", payload: newMeal });
    } else {
      // Property is property changed, value is new value of that property
      const newMeal = {
        ...state.editedMeal,
        [property]: value,
      };
      dispatch({ type: "EDIT_MEAL", payload: newMeal });
    }
  };

  const editBusiness = (property, value) => {
    if (property === "") {
      const newBusiness = state.allBusinessData.filter(
        (business) => business.business_uid === value
      )[0];
      dispatch({ type: "EDIT_BUSINESS_DATA", payload: newBusiness });
    } else {
      const newBusiness = {
        ...state.editedBusinessData,
        [property]: value,
      };
      dispatch({ type: "EDIT_BUSINESS_DATA", payload: newBusiness });
    }
  };

  const getMealIngredients = () => {
    if (state.editedMeal.meal_uid !== "") {
      axios
        .get(
          `${API_URL}Ingredients_Recipe_Specific/${state.editedMeal.meal_uid}`
        )
        .then((response) => {
          const mealIngredients = response.data.result;
          dispatch({
            type: "FETCH_MEAL_INGREDIENTS",
            payload: mealIngredients ? mealIngredients : [],
          });
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

  const getMealFormData = (requestType, meal) => {
    const bodyFormData = new FormData();

    bodyFormData.append("meal_category", meal.meal_category);
    bodyFormData.append("meal_name", meal.meal_name);
    bodyFormData.append("meal_desc", meal.meal_desc);
    bodyFormData.append("meal_hint", meal.meal_hint);
    bodyFormData.append("meal_photo_url", state.selectedFile);
    bodyFormData.append("meal_calories", meal.meal_calories);
    bodyFormData.append("meal_protein", meal.meal_protein);
    bodyFormData.append("meal_carbs", meal.meal_carbs);
    bodyFormData.append("meal_fiber", meal.meal_fiber);
    bodyFormData.append("meal_sugar", meal.meal_sugar);
    bodyFormData.append("meal_fat", meal.meal_fat);
    bodyFormData.append("meal_sat", meal.meal_sat);
    bodyFormData.append("meal_business", state.activeBusiness);
    bodyFormData.append("meal_status", meal.meal_status);

    if (requestType === "put") {
      bodyFormData.append("meal_uid", meal.meal_uid);
    }
    return bodyFormData;
  };

  const verifyModalData = () => {
    if (
      !state.editedMeal.meal_name ||
      !state.editedMeal.meal_category ||
      !state.servings
    ) {
      dispatch({ type: "SET_MODAL_ERROR", payload: true });
      return false;
    }
    dispatch({ type: "SET_MODAL_ERROR", payload: false });
    return true;
  };

  const handleSaveMeal = (mealData = state.editedMeal) => {
    const requestType = state.modalMode === "NEW" ? "post" : "put";
    const bodyFormData = getMealFormData(requestType, mealData);

    let mealStatusCode = "";
    let mealId = "";
    axios({
      method: requestType,
      url: `${API_URL}create_update_meals`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        mealStatusCode = response.status;
        mealId = response.data.meal_uid;
        if (
          state.showIngredients &&
          state.ingredientsModified &&
          !state.modalError
        ) {
          console.log("POSTING MEAL + INGREDIENTS");
          const ingredientList = state.editedMealIngredients.map(
            (ingredient) => {
              return {
                ingredient_id: ingredient.ingredient_uid,
                ingredient_qty:
                  ingredient.recipe_ingredient_qty / state.servings,
                measure_id: ingredient.measure_unit_uid,
              };
            }
          );

          const recipeData = {
            meal_id: mealId,
            servings: state.servings,
            ingredients: ingredientList,
          };
          console.log(recipeData);
          return axios.put(`${API_URL}create_recipe`, recipeData);
        } else {
          console.log("POSTING MEAL");
        }
      })
      .then((response) => {
        // TODO - ADD STATUS CODE CHECK FOR INGREDIENTS API

        if (mealStatusCode === 201) {
          dispatch({ type: "CLOSE_MODAL" });
          updateMealData(mealId, requestType);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getEditedBusinessHours = () => {
    if (state.editedBusinessData.business_accepting_hours)
      return state.editedBusinessData.business_accepting_hours;
    else
      return {
        Friday: ["N/A", "N/A"],
        Monday: ["N/A", "N/A"],
        Sunday: ["N/A", "N/A"],
        Tuesday: ["N/A", "N/A"],
        Saturday: ["N/A", "N/A"],
        Thursday: ["N/A", "N/A"],
        Wednesday: ["N/A", "N/A"],
      };
  };

  const displayBusinessHours = (day, type) => {
    const index = type === "start" ? 0 : 1;
    if (state.activeBusinessData) {
      const time =
        state.activeBusinessData.business_accepting_hours[day][index];
      if (time === "") {
        return "N/A";
      } else {
        return time;
      }
    }
    return "N/A";
  };

  const getBusinessDataByID = (id) => {
    return state.allBusinessData.filter(
      (business) => business.business_uid === id
    )[0];
  };

  const parseBusinessHours = (hours) => {
    if (hours) {
      return JSON.parse(hours);
    }
    return JSON.parse(
      '{"Friday": ["N/A", "N/A"], "Monday": ["N/A", "N/A"], "Sunday": ["N/A", "N/A"], "Tuesday": ["N/A", "N/A"], "Saturday": ["N/A", "N/A"], "Thursday": ["N/A", "N/A"], "Wednesday": ["N/A", "N/A"]}'
    );
  };

  const getMealsByBusiness = (id, mealData) => {
    return mealData.filter((meal) => meal.meal_business === id);
  };

  const getBusinessData = (id) => {
    axios.get(`${API_URL}all_businesses`).then((response) => {
      const allBusinessData = response.data.result;
      if (allBusinessData.length > 0) {
        const activeBusinessData = allBusinessData.filter(
          (business) => business.business_uid === id
        )[0];
        activeBusinessData.business_accepting_hours = parseBusinessHours(
          activeBusinessData.business_accepting_hours
        );

        dispatch({
          type: "FETCH_ALL_BUSINESS_DATA",
          payload: {
            data: allBusinessData,
          },
        });
        dispatch({
          type: "CHANGE_ACTIVE_BUSINESS",
          payload: {
            id: activeBusinessData.business_uid,
            business: activeBusinessData,
            meals: getMealsByBusiness(
              activeBusinessData.business_uid,
              state.mealData
            ),
            active: activeBusinessData,
          },
        });
      }
    });

    return null;
  };

  if (!state.mounted) {
    return null;
  }

  const changeActiveBusiness = (selectedBusinessID) => {
    const businessData = {
      ...getBusinessDataByID(selectedBusinessID),
    };
    const businessHours = parseBusinessHours(
      businessData.business_accepting_hours
    );
    businessData.business_accepting_hours = businessHours;

    document.cookie = `last_active_business = ${selectedBusinessID}`;

    dispatch({
      type: "CHANGE_ACTIVE_BUSINESS",
      payload: {
        id: selectedBusinessID,
        business: businessData,
        meals: getMealsByBusiness(selectedBusinessID, state.mealData),
        active: businessData,
      },
    });
  };

  const getEditedBusinessData = (requestType) => {
    const bodyFormData = new FormData();

    const data = state.editedBusinessData;

    bodyFormData.append(
      "business_accepting_hours",
      JSON.stringify(state.editedBusinessData.business_accepting_hours)
    );
    bodyFormData.append("business_address", data.business_address);
    bodyFormData.append("business_city", data.business_city);
    bodyFormData.append(
      "business_contact_first_name",
      data.business_contact_first_name
    );
    bodyFormData.append(
      "business_contact_last_name",
      data.business_contact_last_name
    );
    bodyFormData.append("business_desc", data.business_desc);
    bodyFormData.append("business_email", data.business_email);
    bodyFormData.append("business_image", state.selectedFile);
    bodyFormData.append("business_name", data.business_name);
    bodyFormData.append("business_phone_num", data.business_phone_num);
    bodyFormData.append("business_phone_num2", data.business_phone_num2);
    bodyFormData.append("business_state", data.business_state);
    bodyFormData.append("business_status", data.business_status);
    bodyFormData.append("business_type", data.business_type);
    bodyFormData.append("business_uid", data.business_uid);
    bodyFormData.append("business_unit", data.business_unit);
    bodyFormData.append("business_zip", data.business_zip);
    bodyFormData.append("can_cancel", data.can_cancel.toString());
    bodyFormData.append("delivery", data.delivery.toString());
    bodyFormData.append("platform_fee", data.platform_fee);
    bodyFormData.append("profit_sharing", data.profit_sharing);
    bodyFormData.append("reusable", data.reusable.toString());
    bodyFormData.append("revenue_sharing", data.revenue_sharing);
    bodyFormData.append("transaction_fee", data.transaction_fee);
    bodyFormData.append("business_facebook_url", data.business_facebook_url);
    bodyFormData.append("business_instagram_url", data.business_instagram_url);
    bodyFormData.append("business_twitter_url", data.business_twitter_url);
    bodyFormData.append("business_website_url", data.business_website_url);

    return bodyFormData;
  };

  const saveBusinessData = () => {
    const businessFormData = getEditedBusinessData();

    axios({
      method: "post",
      url: `${API_URL}business_details`,
      data: businessFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          // exit modal
          dispatch({ type: "TOGGLE_EDIT_BUSINESS" });
          // get updated business info from api
          getBusinessData(state.editedBusinessData.business_uid);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeSortOptions = (field) => {
    const isAsc =
      state.sortMeals.field === field && state.sortMeals.direction === "asc";
    const direction = isAsc ? "desc" : "asc";
    dispatch({
      type: "SORT_MEALS",
      payload: {
        field: field,
        direction: direction,
      },
    });
    const sortedMeals = sortedArray(state.filteredMeals, field, direction);
    console.log(sortedMeals);
    dispatch({ type: "UPDATE_FILTERED_MEALS", payload: sortedMeals });
  };

  const changeMealStatus = (mealInfo, mealIndex) => {
    const allMeals = [...state.filteredMeals];
    const updatedMeal = {
      ...mealInfo,
    };
    if (mealInfo.meal_status === "" || mealInfo.meal_status === "0") {
      console.log("activating meal");
      updatedMeal.meal_status = "1";
    } else {
      console.log("deactivating meal");
      updatedMeal.meal_status = "0";
    }
    console.log(updatedMeal);
    allMeals[mealIndex] = updatedMeal;
    handleSaveMeal(updatedMeal);
    dispatch({ type: "UPDATE_FILTERED_MEALS", payload: allMeals });
  };

  const changeBusinessHours = (day, startTime, endTime) => {
    const newHours = {
      ...state.editedBusinessData.business_accepting_hours,
      [day]: [startTime, endTime],
    };

    // hours[day][arrayIndex] = newTime;
    editBusiness("business_accepting_hours", newHours);
  };

  const getActiveBusinessData = (field) => {
    if (state.activeBusinessData) {
      return state.activeBusinessData[field];
    } else return "";
  };

  const goToLink = (link) => {
    if (link.startsWith("http://") || link.startsWith("http://")) {
      window.open(link, "_blank");
    } else {
      window.open(`http://${link}`, "_blank");
    }
  };

  const deleteItem = (id) => {
    axios.delete(API_URL + "meals?meal_uid=" + id).then((response) => {
      updateMealData(id, "delete");
    });
  };

  return (
    <div style={{ backgroundColor: "#F26522" }}>
      {console.log(state)}

      <AdminNavBar currentPage={"edit-meal"} />

      <div className={styles.pageBody}>
        <div className={styles.containerCustomer}>
          <Row>
            <Col md="auto">
              <img
                src={
                  state.activeBusinessData
                    ? state.activeBusinessData.business_image
                    : ""
                }
                alt="profile image"
                height="90"
                width="90"
                style={{ marginTop: "15px", marginLeft: "15px" }}
              ></img>
            </Col>
            <Col md="auto" style={{ marginTop: "auto", marginBottom: "auto" }}>
              <Row>
                <form>
                  <div className={styles.dropdownArrow}>
                    <select
                      className={styles.dropdown}
                      value={state.activeBusiness ? state.activeBusiness : " "}
                      onChange={(event) => {
                        const selectedBusinessID = event.target.value;
                        changeActiveBusiness(selectedBusinessID);
                      }}
                    >
                      {state.allBusinessData.map((business, index) => {
                        return (
                          <option key={index} value={business.business_uid}>
                            {business.business_name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </form>
              </Row>
              <Row>
                <Col md="auto" style={{ padding: "0px" }}>
                  <div
                    style={{
                      color: "#F26522",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      // toggleBusinessDetails(!showBusinessDetails);
                      dispatch({ type: "TOGGLE_EDIT_BUSINESS" });
                    }}
                  >
                    Edit Details
                    <img className={styles.editIconSmall}></img>
                  </div>
                </Col>
                <Col md="auto" style={{ padding: "0px", marginLeft: "auto" }}>
                  <div
                    style={{
                      color: "#F26522",
                      textDecoration: "underline",
                    }}
                  >
                    Send Message
                  </div>
                </Col>
              </Row>
            </Col>
            <Col></Col>
            <Col>
              <div>
                <div className={styles.headerText}>Contact</div>
                <div>
                  {state.activeBusinessData
                    ? state.activeBusinessData.business_contact_first_name +
                      " " +
                      state.activeBusinessData.business_contact_last_name
                    : ""}
                </div>
                <div>
                  {state.activeBusinessData
                    ? state.activeBusinessData.business_email
                    : ""}
                </div>
                <div>
                  {state.activeBusinessData
                    ? state.activeBusinessData.business_phone_num
                    : ""}
                </div>
              </div>
            </Col>
            <Col>
              <div>
                <div className={styles.headerText}>Address</div>
                <div>
                  {state.activeBusinessData
                    ? state.activeBusinessData.business_address
                    : ""}
                  {state.activeBusinessData &&
                  state.activeBusinessData.business_unit
                    ? ", Unit " + state.activeBusinessData.business_unit + ", "
                    : ","}
                </div>
                <div>
                  {state.activeBusinessData
                    ? state.activeBusinessData.business_city +
                      ", " +
                      state.activeBusinessData.business_state +
                      ", " +
                      state.activeBusinessData.business_zip
                    : ""}
                </div>
              </div>
            </Col>
            <Col>
              <div>
                <div className={styles.headerText}>Business Type</div>
                <div>
                  {state.activeBusinessData
                    ? state.activeBusinessData.business_type
                    : ""}
                </div>
              </div>
            </Col>
            <Col md="auto">
              <Row>
                <Col className={styles.headerText}>Business Hours</Col>
              </Row>
              <Row>
                <Col md="auto">
                  <div>Monday</div>
                  <div>Tuesday</div>
                  <div>Wednesday</div>
                  <div>Thursday</div>
                </Col>
                <Col md="auto" className={styles.businessHours}>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Monday", "start")}
                  </div>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Tuesday", "start")}
                  </div>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Wednesday", "start")}
                  </div>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Thursday", "start")}
                  </div>
                </Col>
                <Col md="auto" style={{ padding: "0px 5px 0px 5px" }}>
                  <div>-</div>
                  <div>-</div>
                  <div>-</div>
                  <div>-</div>
                </Col>
                <Col md="auto" className={styles.businessHours}>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Monday", "end")}
                  </div>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Tuesday", "end")}
                  </div>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Wednesday", "end")}
                  </div>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Thursday", "end")}
                  </div>
                </Col>
                <Col md="auto">
                  <div>Friday</div>
                  <div>Saturday</div>
                  <div>Sunday</div>
                </Col>
                <Col md="auto" className={styles.businessHours}>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Friday", "start")}
                  </div>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Saturday", "start")}
                  </div>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Sunday", "start")}
                  </div>
                </Col>
                <Col md="auto" style={{ padding: "0px 5px 0px 5px" }}>
                  <div>-</div>
                  <div>-</div>
                  <div>-</div>
                </Col>
                <Col className={styles.businessHours}>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Friday", "end")}
                  </div>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Saturday", "end")}
                  </div>
                  <div className={styles.businessHoursText}>
                    {displayBusinessHours("Sunday", "end")}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md="auto">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <FacebookIcon
                  style={{ margin: "2px" }}
                  onClick={() =>
                    goToLink(getActiveBusinessData("business_facebook_url"))
                  }
                />
                <InstagramIcon
                  style={{ margin: "2px" }}
                  onClick={() =>
                    goToLink(getActiveBusinessData("business_instagram_url"))
                  }
                />
                <GlobeIcon
                  style={{ margin: "2px" }}
                  onClick={() =>
                    goToLink(getActiveBusinessData("business_website_url"))
                  }
                />
                <TwitterIcon
                  style={{ margin: "2px" }}
                  onClick={() =>
                    goToLink(getActiveBusinessData("business_twitter_url"))
                  }
                />
              </div>
            </Col>
          </Row>
        </div>

        {state.editBusinessDetails && (
          <div className={styles.editBusiness}>
            <div className={styles.editBusinessFormContainer}>
              <div style={{ width: "300px" }}>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <img
                    height="150px"
                    width="150px"
                    src={state.editedBusinessData.business_image}
                  ></img>
                  <input
                    type="file"
                    name="upload_file"
                    onChange={(e) => {
                      state.selectedFile = e.target.files[0];
                      editBusiness(
                        "business_image",
                        URL.createObjectURL(e.target.files[0])
                      );
                    }}
                  />
                </Form.Group>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#F26522" }}>
                    Business Name
                  </Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Enter Business Name"
                    value={state.editedBusinessData.business_name}
                    onChange={(event) =>
                      editBusiness("business_name", event.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#F26522" }}>
                    Business Type
                  </Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Enter Business Type"
                    value={state.editedBusinessData.business_type}
                    onChange={(event) =>
                      editBusiness("business_type", event.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group
                  style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#F26522" }}>
                    Business Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter Business Description"
                    value={state.editedBusinessData.business_desc}
                    onChange={(event) =>
                      editBusiness("business_desc", event.target.value)
                    }
                  />
                </Form.Group>
              </div>

              <div
                style={{ borderLeft: "2px solid #F8BB17", display: "flex" }}
              />

              <div>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#F26522" }}>
                      First Name
                    </Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter First Name"
                      value={
                        state.editedBusinessData.business_contact_first_name
                      }
                      onChange={(event) =>
                        editBusiness(
                          "business_contact_first_name",
                          event.target.value
                        )
                      }
                    />
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#F26522" }}>
                      Last Name
                    </Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Last Name"
                      value={
                        state.editedBusinessData.business_contact_last_name
                      }
                      onChange={(event) =>
                        editBusiness(
                          "business_contact_last_name",
                          event.target.value
                        )
                      }
                    />
                  </Form.Group>
                </Row>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#F26522" }}>
                      Phone Number 1
                    </Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Phone Number"
                      value={state.editedBusinessData.business_phone_num}
                      onChange={(event) =>
                        editBusiness("business_phone_num", event.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#F26522" }}>
                      Phone Number 2
                    </Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Phone Number"
                      value={state.editedBusinessData.business_phone_num2}
                      onChange={(event) =>
                        editBusiness("business_phone_num2", event.target.value)
                      }
                    />
                  </Form.Group>
                </Row>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "60%" }}>
                    <Form.Label style={{ color: "#F26522" }}>Street</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Street Address"
                      value={state.editedBusinessData.business_address}
                      onChange={(event) =>
                        editBusiness("business_address", event.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group style={{ width: "30%" }}>
                    <Form.Label style={{ color: "#F26522" }}>Unit</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Unit No."
                      value={state.editedBusinessData.business_unit}
                      onChange={(event) =>
                        editBusiness("business_unit", event.target.value)
                      }
                    />
                  </Form.Group>
                </Row>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#F26522" }}>City</Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Enter City"
                    value={state.editedBusinessData.business_city}
                    onChange={(event) =>
                      editBusiness("business_city", event.target.value)
                    }
                  />
                </Form.Group>
                <Row style={{ margin: "0px", justifyContent: "center" }}>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#F26522" }}>State</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter State"
                      value={state.editedBusinessData.business_state}
                      onChange={(event) =>
                        editBusiness("business_state", event.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group style={{ width: "45%" }}>
                    <Form.Label style={{ color: "#F26522" }}>Zip</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="Enter Zip"
                      value={state.editedBusinessData.business_zip}
                      onChange={(event) =>
                        editBusiness("business_zip", event.target.value)
                      }
                    />
                  </Form.Group>
                </Row>
              </div>

              <div
                style={{ borderLeft: "2px solid #F8BB17", display: "flex" }}
              />

              <div>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#F26522" }}>
                    Platform Fee
                  </Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Enter Platform Fee"
                    value={state.editedBusinessData.platform_fee}
                    onChange={(event) =>
                      editBusiness("platform_fee", event.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#F26522" }}>
                    Transaction Fee
                  </Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Enter Transaction Fee"
                    value={state.editedBusinessData.transaction_fee}
                    onChange={(event) =>
                      editBusiness("transaction_fee", event.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#F26522" }}>
                    Revenue Sharing
                  </Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Enter Revenue Sharing"
                    value={state.editedBusinessData.revenue_sharing}
                    onChange={(event) =>
                      editBusiness("revenue_sharing", event.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#F26522" }}>
                    Profit Sharing
                  </Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Enter Profit Sharing"
                    value={state.editedBusinessData.profit_sharing}
                    onChange={(event) =>
                      editBusiness("profit_sharing", event.target.value)
                    }
                  />
                </Form.Group>
              </div>

              <div
                style={{ borderLeft: "2px solid #F8BB17", display: "flex" }}
              />

              <div>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#F26522" }}>Storage</Form.Label>
                  <br />
                  <input
                    type="radio"
                    id="reusable"
                    name="storage"
                    value={1}
                    checked={state.editedBusinessData.reusable === 1}
                    onChange={(event) =>
                      editBusiness("reusable", Number(event.target.value))
                    }
                  />{" "}
                  Reusable
                  <br />
                  <input
                    type="radio"
                    id="disposable"
                    name="storage"
                    value={0}
                    checked={state.editedBusinessData.reusable === 0}
                    onChange={(event) =>
                      editBusiness("reusable", Number(event.target.value))
                    }
                  />{" "}
                  Disposable
                </Form.Group>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#F26522" }}>
                    Cancellation
                  </Form.Label>
                  <br />
                  <input
                    type="radio"
                    id="can_cancel"
                    name="cancellation"
                    value={1}
                    checked={state.editedBusinessData.can_cancel === 1}
                    onChange={(event) =>
                      editBusiness("can_cancel", Number(event.target.value))
                    }
                  />{" "}
                  Allow cancellation within ordering hours
                  <br />
                  <input
                    type="radio"
                    id="no_cancel"
                    name="cancellation"
                    value={0}
                    checked={state.editedBusinessData.can_cancel === 0}
                    onChange={(event) =>
                      editBusiness("can_cancel", Number(event.target.value))
                    }
                  />{" "}
                  Cancellations not allowed
                </Form.Group>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#F26522" }}>
                    Business Status
                  </Form.Label>
                  <br />
                  <input
                    type="radio"
                    id="active"
                    name="businessStatus"
                    value={"ACTIVE"}
                    checked={
                      state.editedBusinessData.business_status === "ACTIVE"
                    }
                    onChange={(event) =>
                      editBusiness("business_status", event.target.value)
                    }
                  />{" "}
                  Active
                  <br />
                  <input
                    type="radio"
                    id="Inactive"
                    name="businessStatus"
                    value={"INACTIVE"}
                    checked={
                      state.editedBusinessData.business_status === "INACTIVE"
                    }
                    onChange={(event) =>
                      editBusiness("business_status", event.target.value)
                    }
                  />{" "}
                  Inactive
                </Form.Group>
              </div>

              <div
                style={{ borderLeft: "2px solid #F8BB17", display: "flex" }}
              />

              <div>
                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Form.Label style={{ color: "#F26522" }}>
                    Business Hours
                  </Form.Label>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Monday
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Monday[0]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Monday",
                          event.target.value,
                          getEditedBusinessHours().Monday[1]
                        );
                      }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Monday[1]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Monday",
                          getEditedBusinessHours().Monday[0],
                          event.target.value
                        );
                      }}
                    />
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Tuesday
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Tuesday[0]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Tuesday",
                          event.target.value,
                          getEditedBusinessHours().Tuesday[1]
                        );
                      }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Tuesday[1]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Tuesday",
                          getEditedBusinessHours().Tuesday[0],
                          event.target.value
                        );
                      }}
                    />
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Wednesday
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Wednesday[0]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Wednesday",
                          event.target.value,
                          getEditedBusinessHours().Wednesday[1]
                        );
                      }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Wednesday[1]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Wednesday",
                          getEditedBusinessHours().Wednesday[0],
                          event.target.value
                        );
                      }}
                    />
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Thursday
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Thursday[0]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Thursday",
                          event.target.value,
                          getEditedBusinessHours().Thursday[1]
                        );
                      }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Thursday[1]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Thursday",
                          getEditedBusinessHours().Thursday[0],
                          event.target.value
                        );
                      }}
                    />
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Friday
                    </div>{" "}
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Friday[0]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Friday",
                          event.target.value,
                          getEditedBusinessHours().Friday[1]
                        );
                      }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Friday[1]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Friday",
                          getEditedBusinessHours().Friday[0],
                          event.target.value
                        );
                      }}
                    />
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Saturday
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Saturday[0]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Saturday",
                          event.target.value,
                          getEditedBusinessHours().Saturday[1]
                        );
                      }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Saturday[1]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Saturday",
                          getEditedBusinessHours().Saturday[0],
                          event.target.value
                        );
                      }}
                    />
                  </Row>
                  <Row style={{ margin: "0px", padding: "5px 0px 5px 0px" }}>
                    <div
                      style={{
                        width: "100px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      Sunday
                    </div>{" "}
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Sunday[0]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Sunday",
                          event.target.value,
                          getEditedBusinessHours().Sunday[1]
                        );
                      }}
                    />{" "}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        padding: "5px",
                      }}
                    >
                      -
                    </div>
                    <Form.Control
                      as="input"
                      style={{ width: "30%" }}
                      value={getEditedBusinessHours().Sunday[1]}
                      placeholder="HH:MM:SS"
                      onChange={(event) => {
                        changeBusinessHours(
                          "Sunday",
                          getEditedBusinessHours().Sunday[0],
                          event.target.value
                        );
                      }}
                    />
                  </Row>
                </Form.Group>

                <Form.Group
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <FacebookIcon style={{ fill: "#F26522", margin: "5px" }} />
                    <Form.Control
                      as="input"
                      placeholder="Enter Facebook URL"
                      value={state.editedBusinessData.business_facebook_url}
                      style={{ width: "80%" }}
                      onChange={(event) =>
                        editBusiness(
                          "business_facebook_url",
                          event.target.value
                        )
                      }
                    />
                  </Row>
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <InstagramIcon style={{ fill: "#F26522", margin: "5px" }} />
                    <Form.Control
                      as="input"
                      placeholder="Enter Instagram URL"
                      value={state.editedBusinessData.business_instagram_url}
                      style={{ width: "80%" }}
                      onChange={(event) =>
                        editBusiness(
                          "business_instagram_url",
                          event.target.value
                        )
                      }
                    />
                  </Row>
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <TwitterIcon style={{ fill: "#F26522", margin: "5px" }} />
                    <Form.Control
                      as="input"
                      placeholder="Enter Twitter URL"
                      value={state.editedBusinessData.business_twitter_url}
                      style={{ width: "80%" }}
                      onChange={(event) =>
                        editBusiness("business_twitter_url", event.target.value)
                      }
                    />
                  </Row>
                  <Row style={{ padding: "5px 0px 5px 0px" }}>
                    <GlobeIcon style={{ color: "#F26522", margin: "5px" }} />
                    <Form.Control
                      as="input"
                      placeholder="Enter Business Website URL"
                      value={state.editedBusinessData.business_website_url}
                      style={{ width: "80%" }}
                      onChange={(event) =>
                        editBusiness("business_website_url", event.target.value)
                      }
                    />
                  </Row>
                </Form.Group>
              </div>
            </div>
            <div style={{ textAlign: "center", paddingBottom: "10px" }}>
              <Button
                variant="primary"
                style={{
                  backgroundColor: "#F26522",
                  borderRadius: "15px",
                  width: "257px",
                  height: "48px",
                  fontSize: "18px",
                  margin: "5px",
                  border: "2px solid #F26522",
                }}
                onClick={() => dispatch({ type: "TOGGLE_EDIT_BUSINESS" })}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                style={{
                  backgroundColor: "#F26522",
                  borderRadius: "15px",
                  width: "257px",
                  height: "48px",
                  fontSize: "18px",
                  margin: "5px",
                  border: "2px solid #F26522",
                }}
                onClick={() => saveBusinessData()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
        {!state.editBusinessDetails && (
          <div className={styles.containerMeals}>
            <div
              style={{
                fontSize: "22px",
                display: "inline",
                marginLeft: "27px",
                fontWeight: "bold",
              }}
            >
              Meals Offered
            </div>

            <div
              style={{
                fontSize: "32px",
                display: "inline",
                marginLeft: "15px",
              }}
              onClick={() => {
                dispatch({
                  type: "SHOW_CREATE_EDIT_MEAL_MODAL",
                  payload: { show: true, mode: "NEW" },
                });
              }}
            >
              +
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    <TableSortLabel
                      style={{
                        fontWeight: "bold",
                        color: "#f26522",
                        border: "none",
                      }}
                      direction={state.sortMeals.direction}
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
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    Picture
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    Meal Description
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    <TableSortLabel
                      style={{
                        fontWeight: "bold",
                        color: "#f26522",
                        border: "none",
                      }}
                      direction={state.sortMeals.direction}
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
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    <TableSortLabel
                      style={{
                        fontWeight: "bold",
                        color: "#f26522",
                        border: "none",
                      }}
                      direction={state.sortMeals.direction}
                      onClick={() => changeSortOptions("meal_hint")}
                    >
                      Meal Hint
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    <TableSortLabel
                      style={{
                        fontWeight: "bold",
                        color: "#f26522",
                        border: "none",
                      }}
                      direction={state.sortMeals.direction}
                      onClick={() => changeSortOptions("meal_calories")}
                    >
                      Calories
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    <TableSortLabel
                      style={{
                        fontWeight: "bold",
                        color: "#f26522",
                        border: "none",
                      }}
                      direction={state.sortMeals.direction}
                      onClick={() => changeSortOptions("meal_protein")}
                    >
                      Protein
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    <TableSortLabel
                      style={{
                        fontWeight: "bold",
                        color: "#f26522",
                        border: "none",
                      }}
                      direction={state.sortMeals.direction}
                      onClick={() => changeSortOptions("meal_carbs")}
                    >
                      Carbs
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    <TableSortLabel
                      style={{
                        fontWeight: "bold",
                        color: "#f26522",
                        border: "none",
                      }}
                      direction={state.sortMeals.direction}
                      onClick={() => changeSortOptions("meal_fiber")}
                    >
                      Fiber
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    <TableSortLabel
                      style={{
                        fontWeight: "bold",
                        color: "#f26522",
                        border: "none",
                      }}
                      direction={state.sortMeals.direction}
                      onClick={() => changeSortOptions("meal_sugar")}
                    >
                      Sugar
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    <TableSortLabel
                      style={{
                        fontWeight: "bold",
                        color: "#f26522",
                        border: "none",
                      }}
                      direction={state.sortMeals.direction}
                      onClick={() => changeSortOptions("meal_fat")}
                    >
                      Fats
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    <TableSortLabel
                      style={{
                        fontWeight: "bold",
                        color: "#f26522",
                        border: "none",
                      }}
                      direction={state.sortMeals.direction}
                      onClick={() => changeSortOptions("meal_sat")}
                    >
                      Sat
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "#f26522",
                      border: "none",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.filteredMeals &&
                  state.filteredMeals.map((meal, index) => {
                    return (
                      <TableRow key={index} hover>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          {meal.meal_name}
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                          }}
                        >
                          <img
                            src={meal.meal_photo_URL}
                            height="45"
                            width="45"
                          ></img>
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                            width: "300px",
                            fontSize: "15px",
                          }}
                        >
                          {meal.meal_desc}
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          {meal.meal_category}
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          {meal.meal_hint}
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          {meal.meal_calories
                            ? meal.meal_calories + " Cal"
                            : ""}
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          {meal.meal_protein ? meal.meal_protein + "g" : ""}
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          {meal.meal_carbs ? meal.meal_carbs + "g" : ""}
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          {meal.meal_fiber ? meal.meal_fiber + "g" : ""}
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          {meal.meal_sugar ? meal.meal_sugar + "g" : ""}
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          {meal.meal_fat ? meal.meal_fat + "%" : ""}
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          {meal.meal_sat ? meal.meal_sat + "%" : ""}
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          <ToggleSwitch
                            active={Number(meal.meal_status)}
                            handleChange={() => changeMealStatus(meal, index)}
                          />
                        </TableCell>
                        <TableCell
                          style={{
                            borderBottom: "1px solid #f8bb17",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                        >
                          <div
                            className={styles.editIcon}
                            onClick={() => {
                              dispatch({ type: "EDIT_MEAL", payload: meal });
                              dispatch({
                                type: "SHOW_CREATE_EDIT_MEAL_MODAL",
                                payload: { show: true, mode: "EDIT" },
                              });
                            }}
                          ></div>
                          <div
                            className={styles.deleteIcon}
                            onClick={() => deleteItem(meal.meal_uid)}
                          ></div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      {state.showCreateEditMealModal && (
        <div
          style={{
            height: "100%",
            width: "100%",
            zIndex: "101",
            left: "0",
            top: "0",
            overflow: "auto",
            position: "fixed",
            display: "grid",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <div
            style={{
              position: "relative",
              justifySelf: "center",
              alignSelf: "center",
              display: "block",
              border: "#ff6505 solid",
              backgroundColor: "#FEF7E0",
              height: "auto",
              width: "auto",
              zIndex: "102",
              padding: "10px 0px 10px 0px",
              borderRadius: "20px",
            }}
          >
            <div style={{ textAlign: "right", padding: "10px" }}>
              <ModalCloseBtn
                style={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch({ type: "CLOSE_MODAL" });
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Form className={styles.modalForm}>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "25px",
                  }}
                >
                  Meal:
                </div>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Meal Name
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      as="input"
                      value={state.editedMeal.meal_name}
                      placeholder="Enter Meal Name"
                      onChange={(event) => {
                        editMeal("meal_name", event.target.value);
                      }}
                      className={
                        state.modalError && state.editedMeal.meal_name === ""
                          ? styles.modalError
                          : ""
                      }
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Picture
                  </Form.Label>
                  <Col sm={9}>
                    <div style={{ textAlign: "center", marginBottom: "15px" }}>
                      {state.editedMeal.meal_photo_URL && (
                        <img
                          // src={state.previewLink}
                          src={state.editedMeal.meal_photo_URL}
                          height="150px"
                          width="150px"
                        ></img>
                      )}
                    </div>

                    <input
                      type="file"
                      name="upload_file"
                      onChange={(e) => {
                        state.selectedFile = e.target.files[0];
                        dispatch({
                          type: "SET_PREVIEW",
                          payload: URL.createObjectURL(e.target.files[0]),
                        });
                        editMeal(
                          "meal_photo_URL",
                          URL.createObjectURL(e.target.files[0])
                        );
                      }}
                    />
                  </Col>
                </Form.Group>

                {/* <div>Business {activeBusinessData.business_name}</div> */}
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Business
                  </Form.Label>
                  <Form.Label column sm={9}>
                    {state.editedBusinessData.business_name}
                  </Form.Label>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Category
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      as="select"
                      value={state.editedMeal.meal_category}
                      onChange={(event) => {
                        editMeal("meal_category", event.target.value);
                      }}
                      className={
                        state.modalError &&
                        state.editedMeal.meal_category === ""
                          ? styles.modalError
                          : ""
                      }
                    >
                      <option value="" hidden>
                        {" "}
                        Select Meal Category{" "}
                      </option>
                      {getMealCategories().map((category) => (
                        <option value={category} key={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Description
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={state.editedMeal.meal_desc}
                      placeholder="Enter Meal Description"
                      onChange={(event) => {
                        editMeal("meal_desc", event.target.value);
                      }}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Hint
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      placeholder="Enter Meal Hint"
                      value={state.editedMeal.meal_hint}
                      onChange={(event) => {
                        editMeal("meal_hint", event.target.value);
                      }}
                    />
                  </Col>
                </Form.Group>
              </Form>
              <div
                style={{ borderLeft: "2px solid #F8BB17", display: "flex" }}
              />
              <Form className={styles.modalForm}>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Nutritional Facts:
                </div>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Calories
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Enter Calories"
                      value={state.editedMeal.meal_calories}
                      onChange={(event) => {
                        editMeal("meal_calories", event.target.value);
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Protein
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Enter Protein Amount"
                      value={state.editedMeal.meal_protein}
                      onChange={(event) => {
                        editMeal("meal_protein", event.target.value);
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Carbs
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Enter Carb Amount"
                      value={state.editedMeal.meal_carbs}
                      onChange={(event) => {
                        editMeal("meal_carbs", event.target.value);
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Fiber
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Enter Fiber Amount"
                      value={state.editedMeal.meal_fiber}
                      onChange={(event) => {
                        editMeal("meal_fiber", event.target.value);
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Sugar
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Enter Sugar Amount"
                      value={state.editedMeal.meal_sugar}
                      onChange={(event) => {
                        editMeal("meal_sugar", event.target.value);
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Fat
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Enter Fat Amount"
                      value={state.editedMeal.meal_fat}
                      onChange={(event) => {
                        editMeal("meal_fat", event.target.value);
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Sat
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Enter Saturated Fat Amount"
                      value={state.editedMeal.meal_sat}
                      onChange={(event) => {
                        editMeal("meal_sat", event.target.value);
                      }}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{ color: "#F26522" }}>
                    Status
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      as="input"
                      placeholder="Enter Status"
                      value={state.editedMeal.meal_status}
                      onChange={(event) => {
                        editMeal("meal_status", event.target.value);
                      }}
                    />
                  </Col>
                </Form.Group>
              </Form>
              {state.showIngredients && (
                <div
                  style={{ borderLeft: "2px solid #F8BB17", display: "flex" }}
                />
              )}
              {state.showIngredients && (
                <Form className={styles.modalForm}>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    Ingredients Needed:
                  </div>
                  <Form.Group as={Row}>
                    <Form.Label column md="auto" style={{ color: "#F26522" }}>
                      For how many servings
                    </Form.Label>
                    <Col md="auto" style={{ width: "100px" }}>
                      <Form.Control
                        type="number"
                        min="1"
                        value={state.servings}
                        onChange={(event) => {
                          dispatch({
                            type: "SET_SERVINGS",
                            payload: event.target.value,
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Row>
                    <Col md="auto" style={{ color: "#F26522" }}>
                      Ingredient Name
                    </Col>
                    <Col md="auto" style={{ width: "150px", color: "#F26522" }}>
                      Quantity
                    </Col>
                    <Col md="auto" style={{ color: "#F26522" }}>
                      Unit
                    </Col>
                  </Row>
                  <div
                    style={{
                      maxHeight: "320px",
                      overflow: "scroll",
                      padding: "10px 0px 10px 0px",
                    }}
                  >
                    {state.editedMealIngredients &&
                      state.editedMealIngredients.map(
                        (ingredient, ingredientIndex) => {
                          return (
                            <Row
                              key={ingredientIndex}
                              style={{ padding: "5px 0px 5px 0px" }}
                            >
                              <Col md="auto" style={{ width: "150px" }}>
                                <Form.Control
                                  as="select"
                                  value={ingredient.ingredient_uid}
                                  onChange={(event) => {
                                    dispatch({
                                      type: "SET_INGREDIENTS_MODIFIED",
                                      payload: true,
                                    });

                                    const newRecipe = [
                                      ...state.editedMealIngredients,
                                    ];
                                    const newIngredientId = event.target.value;
                                    const newIngredientInfo =
                                      state.ingredientsData.filter(
                                        (allIngredients) =>
                                          allIngredients.ingredient_uid ===
                                          newIngredientId
                                      )[0];
                                    const ingredientIndex = newRecipe.findIndex(
                                      (elt) =>
                                        elt.ingredient_uid ===
                                        ingredient.ingredient_uid
                                    );
                                    newRecipe[ingredientIndex] = {
                                      ...newRecipe[ingredientIndex],
                                      ...newIngredientInfo,
                                    };
                                    dispatch({
                                      type: "EDIT_MEAL_INGREDIENTS",
                                      payload: newRecipe,
                                    });
                                  }}
                                >
                                  <option value="" hidden>
                                    Select an Ingredient
                                  </option>
                                  {state.ingredientsData.map(
                                    (allIngredients) => (
                                      <option
                                        value={allIngredients.ingredient_uid}
                                        key={allIngredients.ingredient_uid}
                                      >
                                        {allIngredients.ingredient_desc}
                                      </option>
                                    )
                                  )}
                                </Form.Control>
                              </Col>
                              <Col md="auto" style={{ width: "150px" }}>
                                <Form.Control
                                  type="number"
                                  min="0"
                                  value={ingredient.recipe_ingredient_qty}
                                  onChange={(event) => {
                                    dispatch({
                                      type: "SET_INGREDIENTS_MODIFIED",
                                      payload: true,
                                    });

                                    const newRecipe = [
                                      ...state.editedMealIngredients,
                                    ];
                                    const newQuantity = event.target.value;
                                    const ingredientIndex = newRecipe.findIndex(
                                      (elt) =>
                                        elt.ingredient_uid ===
                                        ingredient.ingredient_uid
                                    );
                                    newRecipe[ingredientIndex] = {
                                      ...newRecipe[ingredientIndex],
                                      recipe_ingredient_qty: newQuantity,
                                    };
                                    dispatch({
                                      type: "EDIT_MEAL_INGREDIENTS",
                                      payload: newRecipe,
                                    });
                                  }}
                                />
                              </Col>
                              <Col md="auto" style={{ width: "150px" }}>
                                <Form.Control
                                  as="select"
                                  value={ingredient.measure_unit_uid}
                                  onChange={(event) => {
                                    dispatch({
                                      type: "SET_INGREDIENTS_MODIFIED",
                                      payload: true,
                                    });

                                    const newRecipe = [
                                      ...state.editedMealIngredients,
                                    ];
                                    const newMeasureUnitId = event.target.value;
                                    const newMeasureUnitInfo =
                                      state.measureUnitsData.filter(
                                        (allMeasureUnits) =>
                                          allMeasureUnits.measure_unit_uid ===
                                          newMeasureUnitId
                                      )[0];
                                    const ingredientIndex = newRecipe.findIndex(
                                      (elt) =>
                                        elt.ingredient_uid ===
                                        ingredient.ingredient_uid
                                    );
                                    newRecipe[ingredientIndex] = {
                                      ...newRecipe[ingredientIndex],
                                      ...newMeasureUnitInfo,
                                    };
                                    dispatch({
                                      type: "EDIT_MEAL_INGREDIENTS",
                                      payload: newRecipe,
                                    });
                                  }}
                                >
                                  <option value="" hidden>
                                    Select a Measure Unit
                                  </option>
                                  {state.measureUnitsData.map(
                                    (allMeasureUnits) => (
                                      <option
                                        value={allMeasureUnits.measure_unit_uid}
                                        key={allMeasureUnits.measure_unit_uid}
                                      >
                                        {allMeasureUnits.recipe_unit}
                                      </option>
                                    )
                                  )}
                                </Form.Control>
                              </Col>
                            </Row>
                          );
                        }
                      )}
                  </div>

                  <div
                    style={{ fontSize: "32px" }}
                    onClick={() => {
                      const newRecipe = [...state.editedMealIngredients];
                      newRecipe.push({
                        ingredient_uid: "",
                        recipe_ingredient_qty: "",
                        measure_unit_uid: "",
                      });
                      dispatch({
                        type: "EDIT_MEAL_INGREDIENTS",
                        payload: newRecipe,
                      });
                    }}
                  >
                    +
                  </div>
                </Form>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "50px",
              }}
            >
              {state.modalError && (
                <p style={{ color: "red", fontSize: "20px" }}>
                  Please fill in missing data
                </p>
              )}
              {!state.showIngredients && (
                <Button
                  variant="primary"
                  onClick={() => {
                    dispatch({ type: "TOGGLE_SHOW_INGREDIENTS" });
                    getMealIngredients();
                  }}
                  style={{
                    color: "#F26522",
                    backgroundColor: "#FEF7E0",
                    border: "2px solid #F26522",
                    borderRadius: "15px",
                    width: "257px",
                    height: "48px",
                    fontSize: "18px",
                    margin: "5px",
                    outline: "none",
                  }}
                >
                  {state.modalMode === "NEW"
                    ? "Add Ingredients +"
                    : "Edit Ingredients +"}
                </Button>
              )}
              <Button
                variant="primary"
                onClick={() => {
                  if (verifyModalData()) handleSaveMeal();
                }}
                style={{
                  backgroundColor: "#F26522",
                  borderRadius: "15px",
                  width: "257px",
                  height: "48px",
                  fontSize: "18px",
                  margin: "5px",
                  border: "2px solid #F26522",
                }}
              >
                Save Meal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withRouter(EditMeal);
