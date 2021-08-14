import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import { Breadcrumb, Container, Row, Col, Form, Button } from "react-bootstrap";
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
import { act } from "react-dom/test-utils";
import testImage from "./static/test.jpeg";
import { ReactComponent as ModalCloseBtn } from "./static/modalClose.svg";
import { ReactComponent as GlobeIcon } from "./static/globe.svg";
import { ReactComponent as FacebookIcon } from "./static/facebook.svg";
import { ReactComponent as InstagramIcon } from "./static/instagram.svg";
import { ReactComponent as TwitterIcon } from "./static/twitter.svg";
import { sortedArray } from "../../../reducers/helperFuncs";
import ToggleSwitch from "./toggleSwitch.jsx";
import { convertTypeAcquisitionFromJson } from "typescript";

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
  editedBusinessData: {
    business_accepting_hours: "",
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
        activeBusiness: action.payload.active,
      };
    case "CHANGE_ACTIVE_BUSINESS":
      return {
        ...state,
        activeBusiness: action.payload.id,
        filteredMeals: action.payload.meals,
        editedBusinessData: action.payload.business,
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
  const [showDropdown, toggleShowDropdown] = useState(false);
  const [activeBusiness, setActiveBusiness] = useState(null);
  const [activeBusinessData, setActiveBusinessData] = useState({
    bus_guid_device_id_notification: "",
    bus_notification_approval: "",
    business_EIN: "",
    business_USDOT: "",
    business_WAUBI: "",
    business_accepting_hours: "",
    business_address: "",
    business_association: "",
    business_city: "",
    business_contact_first_name: "",
    business_contact_last_name: "",
    business_created_at: "",
    business_delivery_hours: "",
    business_desc: "",
    business_email: "",
    business_hours: "",
    business_image: "",
    business_latitude: "",
    business_license: "",
    business_longitude: "",
    business_name: "",
    business_password: "",
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
  });
  const [showBusinessDetails, toggleBusinessDetails] = useState(false);

  const [tempBusinessName, setTempBusinessName] = useState("");
  const [tempCusine, setTempCusine] = useState("");
  const [tempMonStart, tempSetMonStart] = useState("");
  const [tempMonFin, setMonFin] = useState("");
  const [tempTueStart, tempSetTueStart] = useState("");
  const [tempTueFin, setTueFin] = useState("");
  const [tempWedStart, tempSetWedStart] = useState("");
  const [tempWedFin, setWedFin] = useState("");
  const [tempThuStart, tempSetThuStart] = useState("");
  const [tempThuFin, setThuFin] = useState("");
  const [tempFriStart, tempSetFriStart] = useState("");
  const [tempFriFin, setFriFin] = useState("");
  const [tempSatStart, tempSetSatStart] = useState("");
  const [tempSatFin, setSatFin] = useState("");
  const [tempSunStart, tempSetSunStart] = useState("");
  const [tempSunFin, setSunFin] = useState("");

  const [selectedMeal, setSelectedMeal] = useState({});
  const [showEditMeal, toggleEditMeal] = useState(false);
  const [showNewMeal, toggleNewMeal] = useState(false);
  const [mealButtonPressed, toggleMealButtonPressed] = useState(false);
  const [deleteButtonPressed, toggleDeleteButtonPressed] = useState(false);

  const [mealsGenerated, toggleMealsGenerated] = useState(false);

  const forceUpdate = useForceUpdate();

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

  useEffect(() => {
    getBusinessData();
  }, []);

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
      console.log("TEST");
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

  const getEditedMealData = (requestType) => {
    const bodyFormData = new FormData();

    bodyFormData.append("meal_category", state.editedMeal.meal_category);
    bodyFormData.append("meal_name", state.editedMeal.meal_name);
    bodyFormData.append("meal_desc", state.editedMeal.meal_desc);
    bodyFormData.append("meal_hint", state.editedMeal.meal_hint);
    bodyFormData.append("meal_photo_url", state.selectedFile);
    bodyFormData.append("meal_calories", state.editedMeal.meal_calories);
    bodyFormData.append("meal_protein", state.editedMeal.meal_protein);
    bodyFormData.append("meal_carbs", state.editedMeal.meal_carbs);
    bodyFormData.append("meal_fiber", state.editedMeal.meal_fiber);
    bodyFormData.append("meal_sugar", state.editedMeal.meal_sugar);
    bodyFormData.append("meal_fat", state.editedMeal.meal_fat);
    bodyFormData.append("meal_sat", state.editedMeal.meal_sat);
    bodyFormData.append("meal_business", activeBusiness);
    bodyFormData.append("meal_status", state.editedMeal.meal_status);

    if (requestType === "put") {
      bodyFormData.append("meal_uid", state.editedMeal.meal_uid);
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

  const handleSaveMeal = () => {
    const requestType = state.modalMode === "NEW" ? "post" : "put";
    const bodyFormData = getEditedMealData(requestType);

    let mealStatusCode = "";

    axios({
      method: requestType,
      url: `${API_URL}create_update_meals`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        mealStatusCode = response.status;
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
            meal_id: response.data.meal_uid,
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

        if (mealStatusCode === 201) dispatch({ type: "CLOSE_MODAL" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getActiveBusinessHours = () => {
    if (
      state.editedBusinessData.business_accepting_hours == "" ||
      state.editedBusinessData.business_accepting_hours == null
    ) {
      return JSON.parse(
        '{"Friday": ["N/A", "N/A"], "Monday": ["N/A", "N/A"], "Sunday": ["N/A", "N/A"], "Tuesday": ["N/A", "N/A"], "Saturday": ["N/A0", "N/A"], "Thursday": ["N/A", "N/A"], "Wednesday": ["N/A", "N/A"]}'
      );
    }
    return JSON.parse(activeBusinessData.business_accepting_hours);
  };

  const generateMealsList = () => {
    if (mealsGenerated == false && state.mounted == true) {
      axios
        .get(`${API_URL}meals`)
        .then((response) => {
          if (response.status === 200) {
            const mealApiResult = response.data.result;
            // Convert property values to string and nulls to empty string
            for (let index = 0; index < mealApiResult.length; index++) {
              for (const property in mealApiResult[index]) {
                const value = mealApiResult[index][property];
                mealApiResult[index][property] = value ? value.toString() : "";
              }
            }
            // Sort by meal name
            mealApiResult.sort((mealA, mealB) => {
              const mealNameA = mealA.meal_name;
              const mealNameB = mealB.meal_name;
              if (mealNameA < mealNameB) {
                return -1;
              }
              if (mealNameA > mealNameB) {
                return 1;
              }
              // Use Id if same name; should not happen
              const idA = mealA.meal_uid;
              const idB = mealB.meal_uid;
              return idA < idB ? -1 : 1;
            });
            dispatch({ type: "FETCH_MEALS", payload: mealApiResult });
            allMeals = mealApiResult;
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
      toggleMealsGenerated(true);
    }
    return null;
  };

  const getBusinessDataByID = (temp) => {
    for (let i = 0; i < state.allBusinessData.length; i++) {
      if (state.allBusinessData[i].business_uid == temp) {
        return state.allBusinessData[i];
      }
    }
    return null;
  };

  const getBusinessData = () => {
    axios.get(`${API_URL}all_businesses_brandon`).then((response) => {
      const allBusinessData = response.data.result;
      if (allBusinessData.length > 0) {
        dispatch({
          type: "FETCH_ALL_BUSINESS_DATA",
          payload: {
            data: allBusinessData,
            active: allBusinessData[0].business_uid,
          },
        });
      }
    });

    return null;
  };

  const checkForDuplicateNameInBusiness = () => {
    for (let i = 0; i < allMeals.length; i++) {
      if (
        allMeals[i].meal_name == state.editedMeal.meal_name &&
        allMeals[i].meal_business == activeBusiness
      ) {
        alert("Meal of this name already exists for this business");
        return true;
      }
    }
    return false;
  };

  const checkForDuplicateNameInBusinessEditing = () => {
    for (let i = 0; i < allMeals.length; i++) {
      if (
        allMeals[i].meal_name == state.editedMeal.meal_name &&
        allMeals[i].meal_business == activeBusiness &&
        allMeals[i].meal_uid != state.editedMeal.meal_uid
      ) {
        alert("Meal of this name already exists for this business");
        return true;
      }
    }
    return false;
  };

  const displayBusinessHours = () => {
    if (activeBusiness != null && tempMonStart == "N/A") {
      setTempBusinessName(activeBusinessData.business_name);
      setTempCusine(activeBusinessData.business_type);
      tempSetMonStart(getActiveBusinessHours().Monday[0]);
      setMonFin(getActiveBusinessHours().Monday[1]);
      tempSetTueStart(getActiveBusinessHours().Tuesday[0]);
      setTueFin(getActiveBusinessHours().Tuesday[1]);
      tempSetWedStart(getActiveBusinessHours().Wednesday[0]);
      setWedFin(getActiveBusinessHours().Wednesday[1]);
      tempSetThuStart(getActiveBusinessHours().Thursday[0]);
      setThuFin(getActiveBusinessHours().Thursday[1]);
      tempSetFriStart(getActiveBusinessHours().Friday[0]);
      setFriFin(getActiveBusinessHours().Friday[1]);
      tempSetSatStart(getActiveBusinessHours().Saturday[0]);
      setSatFin(getActiveBusinessHours().Saturday[1]);
      tempSetSunStart(getActiveBusinessHours().Sunday[0]);
      setSunFin(getActiveBusinessHours().Sunday[1]);
    }
  };

  if (!state.mounted) {
    return null;
  }

  generateMealsList();

  displayBusinessHours();

  const changeActiveBusiness = (selectedBusinessID) => {
    setActiveBusiness(selectedBusinessID);
    dispatch({
      type: "CHANGE_ACTIVE_BUSINESS",
      payload: {
        id: selectedBusinessID,
        business: getBusinessDataByID(selectedBusinessID),
        meals: getMealsByBusiness(selectedBusinessID),
      },
    });
    setActiveBusinessData(getBusinessDataByID(selectedBusinessID));
    setTempBusinessName(activeBusinessData.business_name);
    setTempCusine(activeBusinessData.business_type);
    tempSetMonStart(getActiveBusinessHours().Monday[0]);
    setMonFin(getActiveBusinessHours().Monday[1]);
    tempSetTueStart(getActiveBusinessHours().Tuesday[0]);
    setTueFin(getActiveBusinessHours().Tuesday[1]);
    tempSetWedStart(getActiveBusinessHours().Wednesday[0]);
    setWedFin(getActiveBusinessHours().Wednesday[1]);
    tempSetThuStart(getActiveBusinessHours().Thursday[0]);
    setThuFin(getActiveBusinessHours().Thursday[1]);
    tempSetFriStart(getActiveBusinessHours().Friday[0]);
    setFriFin(getActiveBusinessHours().Friday[1]);
    tempSetSatStart(getActiveBusinessHours().Saturday[0]);
    setSatFin(getActiveBusinessHours().Saturday[1]);
    tempSetSunStart(getActiveBusinessHours().Sunday[0]);
    setSunFin(getActiveBusinessHours().Sunday[1]);
  };

  const updateBusiness = () => {
    let myObj = {
      business_uid: activeBusiness,
      business_created_at: activeBusinessData.business_created_at,
      business_name: tempBusinessName,
      business_type: tempCusine,
      business_desc: activeBusinessData.business_desc,
      business_association: activeBusinessData.business_association,
      business_contact_first_name:
        activeBusinessData.business_contact_first_name,
      business_contact_last_name: activeBusinessData.business_contact_last_name,
      business_phone_num: activeBusinessData.business_phone_num,
      business_phone_num2: activeBusinessData.business_phone_num2,
      business_email: activeBusinessData.business_email,
      business_hours: JSON.parse(activeBusinessData.business_hours),
      business_accepting_hours: {
        Friday: [tempFriStart, tempFriFin],
        Monday: [tempMonStart, tempMonFin],
        Sunday: [tempSunStart, tempSunFin],
        Tuesday: [tempTueStart, tempTueFin],
        Saturday: [tempSatStart, tempSatFin],
        Thursday: [tempThuStart, tempThuFin],
        Wednesday: [tempWedStart, tempWedFin],
      },
      business_delivery_hours: JSON.parse(
        activeBusinessData.business_delivery_hours
      ),
      business_address: activeBusinessData.business_address,
      business_unit: activeBusinessData.business_unit,
      business_city: activeBusinessData.business_city,
      business_state: activeBusinessData.business_state,
      business_zip: activeBusinessData.business_zip,
      business_longitude: activeBusinessData.business_longitude,
      business_latitude: activeBusinessData.business_latitude,
      business_EIN: activeBusinessData.business_EIN,
      business_WAUBI: activeBusinessData.business_WAUBI,
      business_license: activeBusinessData.business_license,
      business_USDOT: activeBusinessData.business_USDOT,
      bus_notification_approval: activeBusinessData.bus_notification_approval,
      bus_notification_device_id:
        activeBusinessData.bus_guid_device_id_notification,
      can_cancel: activeBusinessData.can_cancel.toString(),
      delivery: activeBusinessData.delivery.toString(),
      reusable: activeBusinessData.reusable.toString(),
      business_image: activeBusinessData.business_image,
      business_password: activeBusinessData.business_password,
    };

    axios
      .post(API_URL + "business_details_update/Post", myObj)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getBusinessData();
    activeBusinessData.business_type = tempCusine;

    let myObj2 = {
      Friday: [tempFriStart, tempFriFin],
      Monday: [tempMonStart, tempMonFin],
      Sunday: [tempSunStart, tempSunFin],
      Tuesday: [tempTueStart, tempTueFin],
      Saturday: [tempSatStart, tempSatFin],
      Thursday: [tempThuStart, tempThuFin],
      Wednesday: [tempWedStart, tempWedFin],
    };
    activeBusinessData.business_accepting_hours = JSON.stringify(myObj2);
    toggleBusinessDetails(false);
  };

  const updateBusinessNew = () => {
    const businessData = {
      ...state.editedBusinessData,
      can_cancel: state.editedBusinessData.can_cancel.toString(),
      delivery: state.editedBusinessData.delivery.toString(),
      reusable: state.editedBusinessData.reusable.toString(),
    };

    axios
      .post(API_URL + "business_details_update_brandon/Post", businessData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getMealsByBusiness = (id) => {
    return state.mealData.filter((meal) => meal.meal_business === id);
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
    allMeals[mealIndex] = updatedMeal;
    dispatch({ type: "UPDATE_FILTERED_MEALS", payload: allMeals });
  };

  return (
    <div style={{ backgroundColor: "#F26522" }}>
      {console.log(state)}

      <AdminNavBar currentPage={"edit-meal"} />

      <div className={styles.containerCustomer}>
        <img
          src={activeBusinessData.business_image}
          alt="profile image"
          height="90"
          width="90"
          style={{ marginTop: "15px", marginLeft: "15px" }}
        ></img>
        <div
          style={{
            position: "absolute",
            top: "145px",
            left: "166px",
            height: showDropdown ? 60 + allBusinesses.length * 42 : 60,
          }}
        >
          <form>
            <select
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
          </form>
        </div>
        <div
          style={{
            position: "absolute",
            top: "185px",
            left: "176px",
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
        <div
          style={{
            position: "absolute",
            top: "185px",
            left: "296px",
            color: "#F26522",
            textDecoration: "underline",
          }}
        >
          Send Message
        </div>

        <div
          style={{
            position: "absolute",
            top: "125px",
            left: "700px",
            color: "#F26522",
          }}
        >
          Cusines
        </div>

        <div
          style={{
            position: "absolute",
            top: "145px",
            left: "700px",
          }}
        >
          {activeBusinessData.business_type}
        </div>

        <div
          style={{
            position: "absolute",
            top: "125px",
            left: "900px",
            color: "#F26522",
          }}
        >
          Business Hours
        </div>

        <div
          style={{
            position: "absolute",
            top: "145px",
            left: "900px",
          }}
        >
          <div style={{ display: "block", fontSize: "12px" }}>Monday</div>
          <div style={{ display: "block", fontSize: "12px" }}>Tuesday</div>
          <div style={{ display: "block", fontSize: "12px" }}>Wednesday</div>
          <div style={{ display: "block", fontSize: "12px" }}>Thursday</div>
        </div>
        <div
          style={{
            position: "absolute",
            top: "145px",
            left: "975px",
          }}
        >
          <div style={{ display: "block", fontSize: "12px" }}>
            {getActiveBusinessHours().Monday[0]} -{" "}
            {getActiveBusinessHours().Monday[1]}
          </div>
          <div style={{ display: "block", fontSize: "12px" }}>
            {getActiveBusinessHours().Tuesday[0]} -{" "}
            {getActiveBusinessHours().Tuesday[1]}
          </div>
          <div style={{ display: "block", fontSize: "12px" }}>
            {getActiveBusinessHours().Wednesday[0]} -{" "}
            {getActiveBusinessHours().Wednesday[1]}
          </div>
          <div style={{ display: "block", fontSize: "12px" }}>
            {getActiveBusinessHours().Thursday[0]} -{" "}
            {getActiveBusinessHours().Thursday[1]}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: "145px",
            left: "1125px",
          }}
        >
          <div style={{ display: "block", fontSize: "12px" }}>Friday</div>
          <div style={{ display: "block", fontSize: "12px" }}>Saturday</div>
          <div style={{ display: "block", fontSize: "12px" }}>Sunday</div>
        </div>
        <div
          style={{
            position: "absolute",
            top: "145px",
            left: "1200px",
          }}
        >
          <div style={{ display: "block", fontSize: "12px" }}>
            {getActiveBusinessHours().Friday[0]} -{" "}
            {getActiveBusinessHours().Friday[1]}
          </div>
          <div style={{ display: "block", fontSize: "12px" }}>
            {getActiveBusinessHours().Saturday[0]} -{" "}
            {getActiveBusinessHours().Saturday[1]}
          </div>
          <div style={{ display: "block", fontSize: "12px" }}>
            {getActiveBusinessHours().Sunday[0]} -{" "}
            {getActiveBusinessHours().Sunday[1]}
          </div>
        </div>
      </div>

      {showBusinessDetails && (
        <div className={styles.containerEditBusiness}>
          <div
            style={{
              display: "inline-block",
              color: "#F26522",
              marginLeft: "27px",
              width: "200px",
              textAlign: "center",
              verticalAlign: "top",
              marginTop: "15px",
            }}
          >
            <div>Restaurant Name</div>
            <input
              value={tempBusinessName}
              onChange={(e) => {
                setTempBusinessName(e.target.value);
              }}
            ></input>
          </div>
          <div
            style={{
              display: "inline-block",
              color: "#F26522",
              width: "200px",
              textAlign: "center",
              verticalAlign: "top",
              marginTop: "15px",
            }}
          >
            <div>Cusine</div>
            <input
              value={tempCusine}
              onChange={(e) => {
                setTempCusine(e.target.value);
              }}
            ></input>
          </div>
          <div
            style={{
              display: "inline-block",
              color: "#F26522",
              width: "650px",
              textAlign: "center",
              marginTop: "15px",
              marginBottom: "15px",
            }}
          >
            <div style={{ display: "inline-block", width: "325px" }}>
              Business Hours
            </div>
            <div
              style={{
                display: "inline-block",
                width: "100px",
                color: "black",
              }}
            >
              Thursday
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempThuStart}
              onChange={(e) => {
                tempSetThuStart(e.target.value);
              }}
            ></input>
            <div
              style={{ display: "inline-block", width: "25px", color: "black" }}
            >
              -
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempThuFin}
              onChange={(e) => {
                setThuFin(e.target.value);
              }}
            ></input>
            <div
              style={{
                display: "inline-block",
                width: "100px",
                color: "black",
              }}
            >
              Monday
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempMonStart}
              onChange={(e) => {
                tempSetMonStart(e.target.value);
              }}
            ></input>
            <div
              style={{ display: "inline-block", width: "25px", color: "black" }}
            >
              -
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempMonFin}
              onChange={(e) => {
                setMonFin(e.target.value);
              }}
            ></input>
            <div
              style={{
                display: "inline-block",
                width: "100px",
                color: "black",
              }}
            >
              Friday
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempFriStart}
              onChange={(e) => {
                tempSetFriStart(e.target.value);
              }}
            ></input>
            <div
              style={{ display: "inline-block", width: "25px", color: "black" }}
            >
              -
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempFriFin}
              onChange={(e) => {
                setFriFin(e.target.value);
              }}
            ></input>
            <div
              style={{
                display: "inline-block",
                width: "100px",
                color: "black",
              }}
            >
              Tuesday
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempTueStart}
              onChange={(e) => {
                tempSetTueStart(e.target.value);
              }}
            ></input>
            <div
              style={{ display: "inline-block", width: "25px", color: "black" }}
            >
              -
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempTueFin}
              onChange={(e) => {
                setTueFin(e.target.value);
              }}
            ></input>
            <div
              style={{
                display: "inline-block",
                width: "100px",
                color: "black",
              }}
            >
              Saturday
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempSatStart}
              onChange={(e) => {
                tempSetSatStart(e.target.value);
              }}
            ></input>
            <div
              style={{ display: "inline-block", width: "25px", color: "black" }}
            >
              -
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempSatFin}
              onChange={(e) => {
                setSatFin(e.target.value);
              }}
            ></input>
            <div
              style={{
                display: "inline-block",
                width: "100px",
                color: "black",
              }}
            >
              Wednesday
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempWedStart}
              onChange={(e) => {
                tempSetWedStart(e.target.value);
              }}
            ></input>
            <div
              style={{ display: "inline-block", width: "25px", color: "black" }}
            >
              -
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempWedFin}
              onChange={(e) => {
                setWedFin(e.target.value);
              }}
            ></input>
            <div
              style={{
                display: "inline-block",
                width: "100px",
                color: "black",
              }}
            >
              Sunday
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempSunStart}
              onChange={(e) => {
                tempSetSunStart(e.target.value);
              }}
            ></input>
            <div
              style={{ display: "inline-block", width: "25px", color: "black" }}
            >
              -
            </div>
            <input
              style={{ display: "inline-block", width: "100px" }}
              value={tempSunFin}
              onChange={(e) => {
                setSunFin(e.target.value);
              }}
            ></input>
          </div>
          <div
            style={{
              display: "inline-block",
              color: "#F26522",
              textDecoration: "underline",
              verticalAlign: "top",
              marginTop: "60px",
              marginLeft: "60px",
            }}
            onClick={() => {
              updateBusiness();
            }}
          >
            Save
          </div>
        </div>
      )}
      {state.editBusinessDetails && (
        <div className={styles.editBusiness}>
          <div className={styles.editBusinessFormContainer}>
            <div style={{ width: "300px" }}>
              <Form.Group>
                <img
                  height="150px"
                  width="150px"
                  src={state.editedBusinessData.business_imgage}
                ></img>
                <input type="file" name="upload_file" />
              </Form.Group>
              <Form.Group>
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
              <Form.Group>
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
              <Form.Group>
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

            <div style={{ borderLeft: "2px solid #F8BB17", display: "flex" }} />

            <div>
              <Row style={{ margin: "0px" }}>
                <Form.Group>
                  <Form.Label style={{ color: "#F26522" }}>
                    First Name
                  </Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Enter First Name"
                    value={state.editedBusinessData.business_contact_first_name}
                    onChange={(event) =>
                      editBusiness(
                        "business_contact_first_name",
                        event.target.value
                      )
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label style={{ color: "#F26522" }}>
                    Last Name
                  </Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Enter Last Name"
                    value={state.editedBusinessData.business_contact_last_name}
                    onChange={(event) =>
                      editBusiness(
                        "business_contact_last_name",
                        event.target.value
                      )
                    }
                  />
                </Form.Group>
              </Row>
              <Row style={{ margin: "0px" }}>
                <Form.Group>
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
                <Form.Group>
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
              <Row style={{ margin: "0px" }}>
                <Form.Group>
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
                <Form.Group>
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
              <Form.Group>
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
              <Row style={{ margin: "0px" }}>
                <Form.Group>
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
                <Form.Group>
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

            <div style={{ borderLeft: "2px solid #F8BB17", display: "flex" }} />

            <div>
              <Form.Group>
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
              <Form.Group>
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
              <Form.Group>
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
              <Form.Group>
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

            <div style={{ borderLeft: "2px solid #F8BB17", display: "flex" }} />

            <div>
              <Form.Group>
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
                />
                <label for="reusable">Reusable</label>
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
                />
                <label for="disposable">Disposable</label>
              </Form.Group>
              <Form.Group>
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
                />
                <label for="can_cancel">
                  Allow cancellation within ordering hours
                </label>
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
                />
                <label for="no_cancel">Cancellations not allowed</label>
              </Form.Group>
              <Form.Group>
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
                />
                <label for="active">Active</label>
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
                />
                <label for="Inactive">Inactive</label>
              </Form.Group>
            </div>

            <div style={{ borderLeft: "2px solid #F8BB17", display: "flex" }} />

            <div>
              <Form.Group>
                <Form.Label style={{ color: "#F26522" }}>
                  Business Hours
                </Form.Label>
                <Row style={{ margin: "0px" }}>
                  <div style={{ width: "100px" }}>Monday</div>
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Monday[0]}
                  />{" "}
                  -
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Monday[1]}
                  />
                </Row>
                <Row style={{ margin: "0px" }}>
                  <div style={{ width: "100px" }}>Tuesday</div>
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Tuesday[0]}
                  />{" "}
                  -
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Tuesday[1]}
                  />
                </Row>
                <Row style={{ margin: "0px" }}>
                  <div style={{ width: "100px" }}>Wednesday</div>
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Wednesday[0]}
                  />{" "}
                  -
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Wednesday[1]}
                  />
                </Row>
                <Row style={{ margin: "0px" }}>
                  <div style={{ width: "100px" }}>Thursday</div>
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Thursday[0]}
                  />{" "}
                  -
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Thursday[1]}
                  />
                </Row>
                <Row style={{ margin: "0px" }}>
                  <div style={{ width: "100px" }}>Friday</div>{" "}
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Friday[0]}
                  />{" "}
                  -
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Friday[1]}
                  />
                </Row>
                <Row style={{ margin: "0px" }}>
                  <div style={{ width: "100px" }}>Saturday</div>
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Saturday[0]}
                  />{" "}
                  -
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Saturday[1]}
                  />
                </Row>
                <Row style={{ margin: "0px" }}>
                  <div style={{ width: "100px" }}>Sunday</div>{" "}
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Sunday[0]}
                  />{" "}
                  -
                  <Form.Control
                    as="input"
                    style={{ width: "100px" }}
                    value={getActiveBusinessHours().Sunday[1]}
                  />
                </Row>
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ color: "#F26522" }}>
                  <FacebookIcon />
                </Form.Label>
                <Form.Control as="input" placeholder="Enter Facebook URL" />

                <Form.Label style={{ color: "#F26522" }}>
                  <InstagramIcon />
                </Form.Label>
                <Form.Control as="input" placeholder="Enter Instagram URL" />

                <Form.Label style={{ color: "#F26522" }}>
                  <TwitterIcon />
                </Form.Label>
                <Form.Control as="input" placeholder="Enter Twitter URL" />

                <Form.Label style={{ color: "#F26522" }}>
                  <GlobeIcon />
                </Form.Label>
                <Form.Control
                  as="input"
                  placeholder="Enter Business Website URL"
                />
              </Form.Group>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
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
              onClick={() => updateBusinessNew()}
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
            style={{ fontSize: "32px", display: "inline", marginLeft: "15px" }}
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
                        {meal.meal_calories ? meal.meal_calories + " Cal" : ""}
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
                            setSelectedMeal(meal);
                            dispatch({
                              type: "SHOW_CREATE_EDIT_MEAL_MODAL",
                              payload: { show: true, mode: "EDIT" },
                            });
                            toggleMealButtonPressed(true);
                          }}
                        ></div>

                        <div
                          className={styles.deleteIcon}
                          onClick={() => {
                            toggleDeleteButtonPressed(true);
                            setSelectedMeal(allMeals[index]);
                            toggleMealButtonPressed(true);
                            axios
                              .delete(
                                API_URL + "meals?meal_uid=" + meal.meal_uid
                              )
                              .then((response) => {
                                console.log(response);
                              });
                          }}
                        ></div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      )}

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
                  // dispatch({
                  //   type: "SET_INGREDIENTS_MODIFIED",
                  //   payload: false,
                  // });
                  // dispatch({
                  //   type: "SHOW_CREATE_EDIT_MEAL_MODAL",
                  //   payload: { show: false, mode: "" },
                  // });
                  // if (state.showIngredients)
                  //   dispatch({ type: "TOGGLE_SHOW_INGREDIENTS" });
                  // dispatch({ type: "RESET_EDITED_MEAL_INGREDIENTS" });
                  // dispatch({ type: "RESET_EDITED_MEAL" });
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
                    {activeBusinessData.business_name}
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

                  forceUpdate();
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
