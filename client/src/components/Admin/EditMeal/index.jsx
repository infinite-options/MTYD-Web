import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import {
  Breadcrumb, Container, Row, Col, Form, Button
} from 'react-bootstrap';
import {withRouter} from "react-router";
import AdminNavBar from '../AdminNavBar';
import styles from "./editMeal.module.css";
import { act } from 'react-dom/test-utils';
import testImage from './static/test.jpeg'

const initialState = {
  mounted: false,
  mealData: [],
  selectedMeal: '',
  editedMeal: {
    meal_uid: '',
    meal_desc: '',
    meal_category: '',
    meal_name: '',
    meal_hint: '',
    meal_photo_URL: '',
    meal_calories: '',
    meal_protein: '',
    meal_carbs: '',
    meal_fiber: '',
    meal_sugar: '',
    meal_fat: '',
    meal_sat: '',
    meal_status: ''
  },
  selectedFile: null,
  previewLink: "",
};

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}

function reducer (state, action) {
  switch(action.type) {
    case 'MOUNT':
      return {
        ...state,
        mounted: true,
      }
    case 'FETCH_MEALS':
      return {
        ...state,
        mealData: action.payload,
      };
    case 'SELECT_MEAL':
      return {
        ...state,
        selectedMeal: action.payload,
      }
    case 'EDIT_MEAL':
      return {
        ...state,
        editedMeal: action.payload
      }
    case 'SET_PREVIEW':
      return {
        ...state,
        previewLink: action.payload
      }
    default:
      return state;
  }
}

var allMeals = []
// var mealsGenerated = false
var allBusinesses = []
var idsGenerated = false
var allBusinessData = []
// var selectedFile = null

function EditMeal({history, ...props}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showDropdown, toggleShowDropdown] = useState(false);
  const [activeBusiness, setActiveBusiness] = useState(null)
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
  })
  const [showBusinessDetails, toggleBusinessDetails] = useState(false)

  const [tempBusinessName, setTempBusinessName] = useState("")
  const [tempCusine, setTempCusine] = useState("")
  const [tempMonStart, tempSetMonStart] = useState("")
  const [tempMonFin, setMonFin] = useState("")
  const [tempTueStart, tempSetTueStart] = useState("")
  const [tempTueFin, setTueFin] = useState("")
  const [tempWedStart, tempSetWedStart] = useState("")
  const [tempWedFin, setWedFin] = useState("")
  const [tempThuStart, tempSetThuStart] = useState("")
  const [tempThuFin, setThuFin] = useState("")
  const [tempFriStart, tempSetFriStart] = useState("")
  const [tempFriFin, setFriFin] = useState("")
  const [tempSatStart, tempSetSatStart] = useState("")
  const [tempSatFin, setSatFin] = useState("")
  const [tempSunStart, tempSetSunStart] = useState("")
  const [tempSunFin, setSunFin] = useState("")

  const [selectedMeal, setSelectedMeal] = useState({})
  const [showEditMeal, toggleEditMeal] = useState(false)
  const [showNewMeal, toggleNewMeal] = useState(false)
  const [mealButtonPressed, toggleMealButtonPressed] = useState(false)
  const [deleteButtonPressed, toggleDeleteButtonPressed] = useState(false)

  const [mealsGenerated, toggleMealsGenerated] = useState(false)
  
  const forceUpdate = useForceUpdate();

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

  const getMealCategories = () => {
    const mealCategories = state.mealData.map((menuItem) => menuItem.meal_category);
    const mealCategoriesUnique = mealCategories.filter(
      (elt, index) => mealCategories.indexOf(elt) === index,
    );
    return mealCategoriesUnique;
  };

  // Fetch meals
  useEffect(() => {
    console.log("in useEffect")
    axios
      .get(`${API_URL}meals`)
      .then((response) => {
        if(response.status === 200) {
          const mealApiResult = response.data.result;
          // Convert property values to string and nulls to empty string
          for(let index = 0; index < mealApiResult.length; index++) {
            for (const property in mealApiResult[index]) {
                const value = mealApiResult[index][property];
                mealApiResult[index][property] = value ? value.toString() : '';
              } 
          }
          // Sort by meal name
          mealApiResult.sort((mealA, mealB) => {
            const mealNameA = mealA.meal_name;
            const mealNameB = mealB.meal_name;
            if(mealNameA < mealNameB) {
              return -1;
            }
            if(mealNameA > mealNameB) {
              return 1;
            }
            // Use Id if same name; should not happen
            const idA = mealA.meal_uid;
            const idB = mealB.meal_uid;
            return (idA < idB) ? -1 : 1;
          });
          dispatch({ type: 'FETCH_MEALS', payload: mealApiResult });
          //console.log(mealApiResult)
          allMeals = mealApiResult
          console.log(allMeals)
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
    // console.log("Meals")
    // console.log(state.mealData)
  }, []);

  const editMeal = (property, value) => {
    if (property === '') {
      // Initialize edit meal form, value is meal id
      const newMeal = state.mealData.filter(
        (meal) => (
          meal.meal_uid === value
        )
      )[0];
      dispatch({ type: 'EDIT_MEAL', payload: newMeal })
    } else {
      // Property is property changed, value is new value of that property
      const newMeal = {
        ...state.editedMeal,
        [property]: value,
      };
      dispatch({ type: 'EDIT_MEAL', payload: newMeal })
    }
  }

  const saveEditedMeal = () => {
    const savedMeal = state.editedMeal;
    console.log(savedMeal)
    
    axios
      .put(`${API_URL}meals`,savedMeal)
      .then((response) => {
        if(response.status === 201) {
          console.log("in axios put")
              // Make sure if saved and come back to same meal, meal is changed; no need to call API again
              const changedIndex = state.mealData.findIndex((meal) => meal.meal_uid === state.selectedMeal);
              console.log("changedIndex")
              console.log(changedIndex)
              const newMealData = [...state.mealData];
              console.log("newMealData")
              console.log(newMealData)
              newMealData[changedIndex] = state.editedMeal;
              console.log("newMealData[changedIndex")
              console.log(newMealData[changedIndex])
              dispatch({ type: 'FETCH_MEALS', payload: newMealData });
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
  }

  const saveEditedMealNew = () => {
    const bodyFormData = new FormData()

    bodyFormData.append('meal_category', state.editedMeal.meal_category)
    bodyFormData.append('meal_name', state.editedMeal.meal_name)
    bodyFormData.append('meal_desc', state.editedMeal.meal_desc)
    bodyFormData.append('meal_hint', state.editedMeal.meal_hint)
    bodyFormData.append('meal_photo_url', state.selectedFile)
    bodyFormData.append('meal_calories', state.editedMeal.meal_calories)
    bodyFormData.append('meal_protein', state.editedMeal.meal_protein)
    bodyFormData.append('meal_carbs', state.editedMeal.meal_carbs)
    bodyFormData.append('meal_fiber', state.editedMeal.meal_fiber)
    bodyFormData.append('meal_sugar', state.editedMeal.meal_sugar)
    bodyFormData.append('meal_fat', state.editedMeal.meal_fat)
    bodyFormData.append('meal_sat', state.editedMeal.meal_sat)
    bodyFormData.append('meal_business', activeBusiness)
    bodyFormData.append('meal_status', state.editedMeal.meal_status)
    bodyFormData.append('meal_uid', state.editedMeal.meal_uid)
    

    // console.log(bodyFormData.values())
    for(var pair of bodyFormData.entries()) {
      console.log(pair[0]+ ', '+ pair[1]);
    }

    console.log(state.selectedFile)

    axios({
      method: "put", url: 
      `${API_URL}create_update_meals`,
      data: bodyFormData,
      headers: {"Content-Type": "multipart/form-data"}
    })
      // .post(`${API_URL}create_update_meals`,bodyFormData)
      .then((response)=>{
        console.log(response)
        const savedMeal = state.editedMeal
        savedMeal.meal_business = activeBusiness
        savedMeal.meal_uid = response.data.meal_uid
        console.log(savedMeal)

        const changedIndex = state.mealData.findIndex((meal) => meal.meal_uid === state.selectedMeal);
        console.log("changedIndex")
        console.log(changedIndex)
        const newMealData = [...state.mealData];
        console.log("newMealData")
        console.log(newMealData)
        newMealData[changedIndex] = state.editedMeal;
        console.log("newMealData[changedIndex")
        console.log(newMealData[changedIndex])
        dispatch({ type: 'FETCH_MEALS', payload: newMealData });

        state.selectedFile = null
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  const postNewMeal = () => {
    const bodyFormData = new FormData()

    bodyFormData.append('meal_category', state.editedMeal.meal_category)
    bodyFormData.append('meal_name', state.editedMeal.meal_name)
    bodyFormData.append('meal_desc', state.editedMeal.meal_desc)
    bodyFormData.append('meal_hint', state.editedMeal.meal_hint)
    bodyFormData.append('meal_photo_url', state.selectedFile)
    bodyFormData.append('meal_calories', state.editedMeal.meal_calories)
    bodyFormData.append('meal_protein', state.editedMeal.meal_protein)
    bodyFormData.append('meal_carbs', state.editedMeal.meal_carbs)
    bodyFormData.append('meal_fiber', state.editedMeal.meal_fiber)
    bodyFormData.append('meal_sugar', state.editedMeal.meal_sugar)
    bodyFormData.append('meal_fat', state.editedMeal.meal_fat)
    bodyFormData.append('meal_sat', state.editedMeal.meal_sat)
    bodyFormData.append('meal_business', activeBusiness)
    bodyFormData.append('meal_status', state.editedMeal.meal_status)

    // console.log(bodyFormData.values())
    for(var pair of bodyFormData.entries()) {
      console.log(pair[0]+ ', '+ pair[1]);
    }

    console.log(state.selectedFile)

    axios({
      method: "post", url: 
      `${API_URL}create_update_meals`,
      data: bodyFormData,
      headers: {"Content-Type": "multipart/form-data"}
    })
      // .post(`${API_URL}create_update_meals`,bodyFormData)
      .then((response)=>{
        console.log(response)
        const savedMeal = state.editedMeal
        savedMeal.meal_business = activeBusiness
        savedMeal.meal_uid = response.data.meal_uid
        console.log(savedMeal)

        const changedIndex = state.mealData.findIndex((meal) => meal.meal_uid === state.selectedMeal);
        console.log("changedIndex")
        console.log(changedIndex)
        const newMealData = [...state.mealData];
        console.log("newMealData")
        console.log(newMealData)
        newMealData[changedIndex] = state.editedMeal;
        console.log("newMealData[changedIndex")
        console.log(newMealData[changedIndex])
        dispatch({ type: 'FETCH_MEALS', payload: newMealData });

        state.selectedFile = null
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  const getActiveBusinessHours = () => {
    // console.log("test")
    // console.log(activeBusinessData)
    if (activeBusinessData.business_accepting_hours == "" || activeBusinessData.business_accepting_hours == null){
      return JSON.parse("{\"Friday\": [\"N/A\", \"N/A\"], \"Monday\": [\"N/A\", \"N/A\"], \"Sunday\": [\"N/A\", \"N/A\"], \"Tuesday\": [\"N/A\", \"N/A\"], \"Saturday\": [\"N/A0\", \"N/A\"], \"Thursday\": [\"N/A\", \"N/A\"], \"Wednesday\": [\"N/A\", \"N/A\"]}")
    }
    return JSON.parse(activeBusinessData.business_accepting_hours)  
  }

  const generateMealsUI = () => {
    console.log("Generating meals")
    console.log(allMeals.length)
    let tempArray = []
    for (let i = 0; i < allMeals.length; i++) {
      let index = i
      
      if (allMeals[index].meal_business == activeBusiness){    
        tempArray.push(
          <div>
            <table width = "100%" key = {allMeals[index].meal_uid}
              onClick={() => {
                if (allMeals[index] != null) {
                  console.log("clicked on " + allMeals[index].meal_uid)
                  setSelectedMeal(allMeals[index])
                  console.log(selectedMeal)
                  //toggleEditMeal(true)
                  //toggleMealButtonPressed(true)
                }
                
              }}
              style={{
                backgroundColor: selectedMeal==allMeals[index] ? "#FEF7E0" : "white",
                borderStyle: "solid",
                borderColor: selectedMeal==allMeals[index] ? "#F26522" : "white",
                borderRadius: "10px",
                // marginLeft: "2%",
                // marginRight: "2%"
              }}
            >
              <tr width= "100%">
                <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block", overflow:"hidden", textOverflow: "ellipsis"}} width = "7%">
                  {allMeals[index].meal_name}
                </th>
                <th style={{textAlign:"center", display:"inline-block"}} width="7%">
                  <img src={allMeals[index].meal_photo_URL} height="45" width="45"></img>
                </th>
                <th style={{textAlign:"center", display:"inline-block", overflow:"hidden", textOverflow: "ellipsis"}} width = "7%" height="45">{allMeals[index].meal_desc}</th>
                <th style={{textAlign:"center", display:"inline-block"}} width = "7%" height="45">{allMeals[index].meal_category}</th>
                <th style={{textAlign:"center", display:"inline-block", overflow:"hidden", textOverflow: "ellipsis"}} width = "7%" height="45">{allMeals[index].meal_hint}</th>
                <th style={{textAlign:"center", display:"inline-block"}} width = "7%" height="45">{allMeals[index].meal_calories} Cal</th>
                <th style={{textAlign:"center", display:"inline-block"}} width = "7%" height="45">{allMeals[index].meal_protein}g</th>            
                <th style={{textAlign:"center", display:"inline-block"}} width = "7%" height="45">{allMeals[index].meal_carbs}g</th>
                <th style={{textAlign:"center", display:"inline-block"}} width = "7%" height="45">{allMeals[index].meal_fiber}g</th>
                <th style={{textAlign:"center", display:"inline-block"}} width = "7%" height="45">{allMeals[index].meal_sugar}g</th>
                <th style={{textAlign:"center", display:"inline-block"}} width = "7%" height="45">{allMeals[index].meal_fat}%</th>
                <th style={{textAlign:"center", display:"inline-block"}} width = "7%" height="45">{allMeals[index].meal_sat}%</th>
                <th style={{textAlign:"center", display:"inline-block"}} width = "7%" height="45">{allMeals[index].meal_status}</th>
                <th style={{textAlign:"center", display:"inline-block"}} width = "7%" height="45">
                  <div className={styles.editIcon}
                    onClick={() => {
                      console.log("clicked on " + allMeals[index].meal_uid)
                      setSelectedMeal(allMeals[index])
                      console.log(selectedMeal)
                      toggleEditMeal(true)
                      toggleMealButtonPressed(true)
                    }}
                  ></div>
                  
                  <div className={styles.deleteIcon}
                    onClick={() => {
                      console.log("clicked on delete" + allMeals[index].meal_uid)
                      toggleDeleteButtonPressed(true)
                      setSelectedMeal(allMeals[index])
                      console.log(selectedMeal)
                      // toggleEditMeal(true)
                      toggleMealButtonPressed(true)
                      axios
                        .delete(API_URL+"meals?meal_uid="+allMeals[index].meal_uid)
                        .then(response => {
                          console.log(response)
                        })
                      allMeals.splice(index, 1)
                    }}
                  ></div>
                </th>
              </tr>
              
            </table>
            <div width="100%" style={{backgroundColor: "white",display: "block", minHeight: "25px"}}></div>
            <div width="100%" style={{backgroundColor: "#F8BB17", display: "block", minHeight: "2px", marginBottom: "25px"}}></div>
          </div>
        )
      }
    }
    console.log("Done generating meals")
    return tempArray
  }

  const generateMealsListUpdate = () => {
    axios
      .get(`${API_URL}meals`)
      .then((response) => {
        if(response.status === 200) {
          const mealApiResult = response.data.result;
          // Convert property values to string and nulls to empty string
          for(let index = 0; index < mealApiResult.length; index++) {
            for (const property in mealApiResult[index]) {
                const value = mealApiResult[index][property];
                mealApiResult[index][property] = value ? value.toString() : '';
              } 
          }
          // Sort by meal name
          mealApiResult.sort((mealA, mealB) => {
            const mealNameA = mealA.meal_name;
            const mealNameB = mealB.meal_name;
            if(mealNameA < mealNameB) {
              return -1;
            }
            if(mealNameA > mealNameB) {
              return 1;
            }
            // Use Id if same name; should not happen
            const idA = mealA.meal_uid;
            const idB = mealB.meal_uid;
            return (idA < idB) ? -1 : 1;
          });
          dispatch({ type: 'FETCH_MEALS', payload: mealApiResult });
          //console.log(mealApiResult)
          allMeals = mealApiResult
          console.log(allMeals)
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
  }

  const generateMealsList = () => {
    console.log(mealsGenerated)
    if (mealsGenerated == false) {
    axios
      .get(`${API_URL}meals`)
      .then((response) => {
        if(response.status === 200) {
          const mealApiResult = response.data.result;
          // Convert property values to string and nulls to empty string
          for(let index = 0; index < mealApiResult.length; index++) {
            for (const property in mealApiResult[index]) {
                const value = mealApiResult[index][property];
                mealApiResult[index][property] = value ? value.toString() : '';
              } 
          }
          // Sort by meal name
          mealApiResult.sort((mealA, mealB) => {
            const mealNameA = mealA.meal_name;
            const mealNameB = mealB.meal_name;
            if(mealNameA < mealNameB) {
              return -1;
            }
            if(mealNameA > mealNameB) {
              return 1;
            }
            // Use Id if same name; should not happen
            const idA = mealA.meal_uid;
            const idB = mealB.meal_uid;
            return (idA < idB) ? -1 : 1;
          });
          dispatch({ type: 'FETCH_MEALS', payload: mealApiResult });
          //console.log(mealApiResult)
          allMeals = mealApiResult
          console.log(allMeals)
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
    // console.log("Meals")
    // console.log(state.mealData)
    toggleMealsGenerated(true)
  }
    return null
  }

  const generateBusinessIDs = () => {
    if (idsGenerated == false && mealsGenerated == true) {
      console.log("length check")
      console.log(allMeals.length)
      for (let i = 0; i < allMeals.length; i++) {
        let temp = allMeals[i].meal_business
        
        if (allBusinesses.indexOf(temp) < 0) { //&& temp != ""
          if (getBusinessDataByID(temp).business_status == "ACTIVE") {
            allBusinesses.push(temp)
          }
        }
        if (activeBusiness == null) {
          setActiveBusiness(allBusinesses[0])
          setActiveBusinessData(getBusinessDataByID(allBusinesses[0]))
          setTempBusinessName(activeBusinessData.business_name)
          setTempCusine(activeBusinessData.business_type)
          tempSetMonStart(getActiveBusinessHours().Monday[0])
          setMonFin(getActiveBusinessHours().Monday[1])
          tempSetTueStart(getActiveBusinessHours().Tuesday[0])
          setTueFin(getActiveBusinessHours().Tuesday[1])
          tempSetWedStart(getActiveBusinessHours().Wednesday[0])
          setWedFin(getActiveBusinessHours().Wednesday[1])
          tempSetThuStart(getActiveBusinessHours().Thursday[0])
          setThuFin(getActiveBusinessHours().Thursday[1])
          tempSetFriStart(getActiveBusinessHours().Friday[0])
          setFriFin(getActiveBusinessHours().Friday[1])
          tempSetSatStart(getActiveBusinessHours().Saturday[0])
          setSatFin(getActiveBusinessHours().Saturday[1])
          tempSetSunStart(getActiveBusinessHours().Sunday[0])
          setSunFin(getActiveBusinessHours().Sunday[1])
        }
      }

    }
    console.log(allBusinesses)
    //setActiveBusiness(allBusinesses[1])
    //setActiveBusinessData(getBusinessDataByID(allBusinesses[1]))
    
    return null
  }

  const getBusinessDataByID = (temp) => {
    for (let i = 0; i < allBusinessData.length; i++) {
      if (allBusinessData[i].business_uid == temp) {
        return allBusinessData[i];
      }
    }
    return ("Business not found")
  }

  const generateDropdownButtons = () => {
    let tempDropdownButtons = []
    for (let i = 0; i < allBusinesses.length; i++) {
      let index = i
      tempDropdownButtons.push(
        <div
          key={allBusinesses[index]}
          onClick={() => { //this is behind one
            console.log(allBusinesses[index])
            console.log(getBusinessDataByID(allBusinesses[index]))
            setActiveBusiness(allBusinesses[index])
            setActiveBusinessData(getBusinessDataByID(allBusinesses[index]))
            console.log(activeBusiness)
            console.log(activeBusinessData)
            setTempBusinessName(activeBusinessData.business_name)
            setTempCusine(activeBusinessData.business_type)
            tempSetMonStart(getActiveBusinessHours().Monday[0])
            setMonFin(getActiveBusinessHours().Monday[1])
            tempSetTueStart(getActiveBusinessHours().Tuesday[0])
            setTueFin(getActiveBusinessHours().Tuesday[1])
            tempSetWedStart(getActiveBusinessHours().Wednesday[0])
            setWedFin(getActiveBusinessHours().Wednesday[1])
            tempSetThuStart(getActiveBusinessHours().Thursday[0])
            setThuFin(getActiveBusinessHours().Thursday[1])
            tempSetFriStart(getActiveBusinessHours().Friday[0])
            setFriFin(getActiveBusinessHours().Friday[1])
            tempSetSatStart(getActiveBusinessHours().Saturday[0])
            setSatFin(getActiveBusinessHours().Saturday[1])
            tempSetSunStart(getActiveBusinessHours().Sunday[0])
            setSunFin(getActiveBusinessHours().Sunday[1])
            
            toggleShowDropdown(false)
            toggleEditMeal(false)
            toggleBusinessDetails(false)

            // console.log("test")
            // console.log(tempBusinessName)
            // console.log(tempCusine)
            //console.log(getBusinessDataByID(allBusinesses[index]))
            // console.log(activeBusinessData.business_hours)
          }}
          style={{
            borderRadius: '10px',
            backgroundColor: 'white',
            height: '32px',
            width: '96%',
            paddingLeft: '10px',
            marginLeft: '2%',
            marginTop: '10px',
            textOverflow: 'ellipsis',
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
          {/* {allBusinesses[index]} */}
          {/* {setActiveBusinessData(allBusinesses[index])} */}
          {getBusinessDataByID(allBusinesses[index]).business_name}
        </div>
      )
    }
    let dropdownTopMargin = [
      <div
        key={'space'}
        style={{
          height: '25px',
          backgroundColor: '#f26522',
        }}
      />
    ]
    console.log(tempDropdownButtons.length)
    return dropdownTopMargin.concat(tempDropdownButtons)
  }

  const getDropdownButtons = () => {
    return (
      <>
        <div
          style={{
            height: '20px',
            zIndex: '1'
          }}
        />
        <div
          style={{
            backgroundColor: '#f26522',
            width: '40%',
            minWidth: '300px',
            height: 40 + (allBusinesses.length * 42),
            position: 'absolute',
            zIndex: '1',
            boxShadow: '0px 5px 10px gray',
            borderRadius: '15px'
          }}
        >
          {generateDropdownButtons()}
          
        </div>
      </>
    )
  }

  if (!state.mounted) {
    return null;
  }

  const getBusinessData = () => {
    axios
      .get(`${API_URL}all_businesses`)
      .then((response) => {
        console.log("all_businesses")
        console.log(response.data.result)
        allBusinessData=response.data.result
      })
    
    return null
  }

  const editBusinessBox = () => {
    if (showBusinessDetails == false) {
      return null
    }
    return (
      <div className={styles.containerEditBusiness}>
        <div style={{display: "inline-block", color: "#F26522", marginLeft: "27px", width:"200px", textAlign:"center", verticalAlign:"top", marginTop:"15px"}}>
          <div>Restaurant Name</div>
          <input 
            value={tempBusinessName}
            onChange={e =>{
              setTempBusinessName(e.target.value)
              console.log(e.target.value)
            }}></input>
        </div>
        <div style={{display: "inline-block", color: "#F26522", width:"200px", textAlign:"center", verticalAlign:"top", marginTop:"15px"}}>
          <div>Cusine</div>
          <input 
            value={tempCusine}
            onChange={e =>{
              setTempCusine(e.target.value)
              console.log(e.target.value)
            }}></input>
        </div>
        <div style={{display: "inline-block", color: "#F26522", width:"650px", textAlign:"center", marginTop:"15px", marginBottom:"15px"}}>
          <div style={{display: "inline-block", width:"325px"}}>Business Hours</div>
          <div style={{display: "inline-block", width:"100px", color: "black"}}>Thursday</div>
          <input 
            style={{display: "inline-block", width:"100px"}}
            value={tempThuStart}
            onChange={e =>{
              tempSetThuStart(e.target.value)
              console.log(e.target.value)
            }}></input>
          <div style={{display: "inline-block", width:"25px", color: "black"}}>-</div>
          <input 
            style={{display: "inline-block", width:"100px"}}
            value={tempThuFin}
            onChange={e =>{
              setThuFin(e.target.value)
              console.log(e.target.value)
          }}></input>
          <div style={{display: "inline-block", width:"100px", color: "black"}}>Monday</div>
          <input style={{display: "inline-block", width:"100px"}}
          value={tempMonStart}
          onChange={e =>{
            tempSetMonStart(e.target.value)
            console.log(e.target.value)}}>

            </input>
          <div style={{display: "inline-block", width:"25px", color: "black"}}>-</div>
          <input style={{display: "inline-block", width:"100px"}}
          value={tempMonFin}
          onChange={e =>{
            setMonFin(e.target.value)
            console.log(e.target.value)}}>

          </input>
          <div style={{display: "inline-block", width:"100px", color: "black"}}>Friday</div>
          <input style={{display: "inline-block", width:"100px"}}
          value={tempFriStart}
          onChange={e =>{
            tempSetFriStart(e.target.value)
            console.log(e.target.value)}}>

          </input>
          <div style={{display: "inline-block", width:"25px", color: "black"}}>-</div>
          <input style={{display: "inline-block", width:"100px"}}
          value={tempFriFin}
          onChange={e =>{
            setFriFin(e.target.value)
            console.log(e.target.value)}}>

          </input>
          <div style={{display: "inline-block", width:"100px", color: "black"}}>Tuesday</div>
          <input style={{display: "inline-block", width:"100px"}}
          value={tempTueStart}
          onChange={e =>{
            tempSetTueStart(e.target.value)
            console.log(e.target.value)}}>

          </input>
          <div style={{display: "inline-block", width:"25px", color: "black"}}>-</div>
          <input style={{display: "inline-block", width:"100px"}}
          value={tempTueFin}
          onChange={e =>{
            setTueFin(e.target.value)
            console.log(e.target.value)}}>

          </input>
          <div style={{display: "inline-block", width:"100px", color: "black"}}>Saturday</div>
          <input style={{display: "inline-block", width:"100px"}}
          value={tempSatStart}
          onChange={e =>{
            tempSetSatStart(e.target.value)
            console.log(e.target.value)}}>

          </input>
          <div style={{display: "inline-block", width:"25px", color: "black"}}>-</div>
          <input style={{display: "inline-block", width:"100px"}}
          value={tempSatFin}
          onChange={e =>{
            setSatFin(e.target.value)
            console.log(e.target.value)}}>

          </input>
          <div style={{display: "inline-block", width:"100px", color: "black"}}>Wednesday</div>
          <input style={{display: "inline-block", width:"100px"}}
          value={tempWedStart}
          onChange={e =>{
            tempSetWedStart(e.target.value)
            console.log(e.target.value)}}>

          </input>
          <div style={{display: "inline-block", width:"25px", color: "black"}}>-</div>
          <input style={{display: "inline-block", width:"100px"}}
          value={tempWedFin}
          onChange={e =>{
            setWedFin(e.target.value)
            console.log(e.target.value)}}>

          </input>
          <div style={{display: "inline-block", width:"100px", color: "black"}}>Sunday</div>
          <input style={{display: "inline-block", width:"100px"}}
          value={tempSunStart}
          onChange={e =>{
            tempSetSunStart(e.target.value)
            console.log(e.target.value)}}>

          </input>
          <div style={{display: "inline-block", width:"25px", color: "black"}}>-</div>
          <input style={{display: "inline-block", width:"100px"}}
          value={tempSunFin}
          onChange={e =>{
            setSunFin(e.target.value)
            console.log(e.target.value)}}>

          </input>
        </div>
        <div style={{display:"inline-block",color: "#F26522",textDecoration: "underline", verticalAlign:"top", marginTop: "60px", marginLeft: "60px"}}
          onClick={() => {
            // generate JSONs as text
            // parse text to JSON
            console.log("Clicked Save")
            console.log(activeBusinessData)
            let myObj = {
              "business_uid" : activeBusiness,
              "business_created_at" : activeBusinessData.business_created_at,
              "business_name" : tempBusinessName,
              "business_type" : tempCusine, 
              "business_desc" : activeBusinessData.business_desc, 
              "business_association" : activeBusinessData.business_association, 
              "business_contact_first_name" : activeBusinessData.business_contact_first_name,
              "business_contact_last_name" : activeBusinessData.business_contact_last_name,
              "business_phone_num" : activeBusinessData.business_phone_num, 
              "business_phone_num2" : activeBusinessData.business_phone_num2, 
              "business_email" : activeBusinessData.business_email, 
              "business_hours" : JSON.parse(activeBusinessData.business_hours), 
              "business_accepting_hours" : {
                "Friday": [tempFriStart, tempFriFin], 
                "Monday": [tempMonStart, tempMonFin], 
                "Sunday": [tempSunStart, tempSunFin], 
                "Tuesday": [tempTueStart, tempTueFin], 
                "Saturday": [tempSatStart, tempSatFin], 
                "Thursday": [tempThuStart, tempThuFin], 
                "Wednesday": [tempWedStart, tempWedFin]}, 
              "business_delivery_hours" : JSON.parse(activeBusinessData.business_delivery_hours), 
              "business_address" :activeBusinessData.business_address, 
              "business_unit" : activeBusinessData.business_unit, 
              "business_city" : activeBusinessData.business_city, 
              "business_state" : activeBusinessData.business_state, 
              "business_zip" : activeBusinessData.business_zip,
              "business_longitude" : activeBusinessData.business_longitude,
              "business_latitude" : activeBusinessData.business_latitude, 
              "business_EIN" : activeBusinessData.business_EIN,
              "business_WAUBI" : activeBusinessData.business_WAUBI, 
              "business_license" : activeBusinessData.business_license, 
              "business_USDOT" : activeBusinessData.business_USDOT, 
              "bus_notification_approval" : activeBusinessData.bus_notification_approval, 
              "bus_notification_device_id" : activeBusinessData.bus_guid_device_id_notification, 
              "can_cancel" : activeBusinessData.can_cancel.toString(), 
              "delivery" : activeBusinessData.delivery.toString(), 
              "reusable" : activeBusinessData.reusable.toString(), 
              "business_image" : activeBusinessData.business_image, 
              "business_password" : activeBusinessData.business_password
            }
            console.log(JSON.stringify(myObj))
            console.log(myObj)
            console.log(myObj.business_accepting_hours)

            axios.post(API_URL+"business_details_update/Post", myObj)
            .then(response => {
              console.log(response.data)
            })
            .catch(err => {
              console.log(err)
            })
            getBusinessData()
            activeBusinessData.business_type = tempCusine
            console.log(activeBusinessData.business_accepting_hours)
            let myObj2 = {
              "Friday": [tempFriStart, tempFriFin], 
              "Monday": [tempMonStart, tempMonFin], 
              "Sunday": [tempSunStart, tempSunFin], 
              "Tuesday": [tempTueStart, tempTueFin], 
              "Saturday": [tempSatStart, tempSatFin], 
              "Thursday": [tempThuStart, tempThuFin], 
              "Wednesday": [tempWedStart, tempWedFin]}
            activeBusinessData.business_accepting_hours = JSON.stringify(myObj2)
            toggleBusinessDetails(false);
            // generate time table first
            // put time table into business JSON
            // POST via axios (test via console logs before posting)
          }}
        >Save</div>
      </div>
    )
  }

  const checkForDuplicateNameInBusiness = () => {
    for (let i = 0; i < allMeals.length; i++) {
      if (allMeals[i].meal_name == state.editedMeal.meal_name && allMeals[i].meal_business == activeBusiness) {
        alert("Meal of this name already exists for this business")
        return true
      }
    }
    return false
  }

  const checkForDuplicateNameInBusinessEditing = () => {
    for (let i = 0; i < allMeals.length; i++) {
      if (allMeals[i].meal_name == state.editedMeal.meal_name && allMeals[i].meal_business == activeBusiness && allMeals[i].meal_uid != state.editedMeal.meal_uid) {
        alert("Meal of this name already exists for this business")
        return true
      }
    }
    return false
  }

  const editMealBox = () => {
    
    if (showEditMeal == true) {
      if (mealButtonPressed == true) {
        console.log(mealButtonPressed)
        dispatch({type: 'SELECT_MEAL', payload: selectedMeal.meal_uid})
        editMeal('', selectedMeal.meal_uid )
        toggleMealButtonPressed(false)
      }
      console.log(mealButtonPressed)
      return (
        <div style={{
          height: "100%",
          width: "100%",
          zIndex: "101",
          left: "0",
          top: "0",
          overflow: "auto",
          position: "fixed",
          display: "grid",
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        }}>
          <Form style={{
            position: "relative",
            justifySelf: "center",
            alignSelf: "center",
            display: "block",
            border: "#ff6505 solid",
            backgroundColor: "#FEF7E0",
            height: "900px",
            width: "1000px",
            zIndex:"102",
            padding: "50px",
            borderRadius: "20px"
          }}>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Name
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    as="textarea"
                    disabled={!state.selectedMeal}
                    value={state.editedMeal.meal_name}
                    onChange={
                      (event) => {
                        editMeal('meal_name', event.target.value)
                      }
                    }
                  />
                </Col>
              </Form.Group>
              
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Description
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    disabled={!state.selectedMeal}
                    value={state.editedMeal.meal_desc}
                    onChange={
                      (event) => {
                        editMeal('meal_desc', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Category
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                      as="select"
                      disabled={!state.selectedMeal}
                      value={state.editedMeal.meal_category}
                      onChange={
                        (event) => {
                          console.log(event.target.value)
                          editMeal('meal_category', event.target.value );
                          
                        }
                      }
                  >
                    <option value="" hidden> Select Meal Category </option>
                    {
                      getMealCategories().map(
                        (category) => (
                          <option value={category} key={category}>
                            {category}
                          </option>
                        ),
                      )
                    }
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Hint
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    disabled={!state.selectedMeal}
                    value={state.editedMeal.meal_hint}
                    onChange={
                      (event) => {
                        editMeal('meal_hint', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Photo URL
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    disabled={!state.selectedMeal}
                    value={state.editedMeal.meal_photo_URL}
                    onChange={
                      (event) => {
                        editMeal('meal_photo_URL', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Calories
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    disabled={!state.selectedMeal}
                    value={state.editedMeal.meal_calories}
                    onChange={
                      (event) => {
                        editMeal('meal_calories', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Protein
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    disabled={!state.selectedMeal}
                    value={state.editedMeal.meal_protein}
                    onChange={
                      (event) => {
                        editMeal('meal_protein', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Carbs
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    disabled={!state.selectedMeal}
                    value={state.editedMeal.meal_carbs}
                    onChange={
                      (event) => {
                        editMeal('meal_carbs', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Fiber
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    disabled={!state.selectedMeal}
                    value={state.editedMeal.meal_fiber}
                    onChange={
                      (event) => {
                        editMeal('meal_fiber', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Sugar
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    disabled={!state.selectedMeal}
                    value={state.editedMeal.meal_sugar}
                    onChange={
                      (event) => {
                        editMeal('meal_sugar', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Fat
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    disabled={!state.selectedMeal}
                    value={state.editedMeal.meal_fat}
                    onChange={
                      (event) => {
                        editMeal('meal_fat', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Sat
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    disabled={!state.selectedMeal}
                    value={state.editedMeal.meal_sat}
                    onChange={
                      (event) => {
                        editMeal('meal_sat', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Row>
                <Col
                  style={{
                    textAlign: 'right',
                  }}
                >
                  <Button
                    variant="primary"
                    onClick={()=>{
                      saveEditedMeal()
                      // toggleMealsGenerated(false)
                      // generateMealsListUpdate()
                      
                      console.log("pog")
                      console.log(state.editedMeal)
                      for (var i = 0; i < allMeals.length; i++) {
                        if (allMeals[i].meal_uid == state.editedMeal.meal_uid) {
                          allMeals[i] = state.editedMeal
                          console.log("meal changed in allMeals")
                        }
                      }

                      forceUpdate()
                      toggleEditMeal(false)
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="primary"
                    onClick={()=>{
                      toggleEditMeal(false)
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
        </div>
      )
    } else {
      return null
    }
  }

  const editMealBoxNew = () => {
    
    if (showEditMeal == true) {
      if (mealButtonPressed == true) {
        console.log(mealButtonPressed)
        dispatch({type: 'SELECT_MEAL', payload: selectedMeal.meal_uid})
        editMeal('', selectedMeal.meal_uid )
        toggleMealButtonPressed(false)
      }
      console.log(mealButtonPressed)
      return (
          <div style={{
            height: "100%",
            width: "100%",
            zIndex: "101",
            left: "0",
            top: "0",
            overflow: "auto",
            position: "fixed",
            display: "grid",
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          }}>
            <div style={{
              position: "relative",
              justifySelf: "center",
              alignSelf: "center",
              display: "block",
              border: "#ff6505 solid",
              backgroundColor: "#FEF7E0",
              // height: "900px",
              width: "1002px",
              zIndex:"102",
              
              borderRadius: "20px"
            }}>
                <Form style={{
                position: "relative",
                // justifySelf: "center",
                // alignSelf: "center",
                display: "block",
                // border: "#ff6505 solid",
                // backgroundColor: "#FEF7E0",
                // height: "900px",
                width: "495px",
                zIndex:"102",
                paddingLeft: "50px",
                paddingRight: "25px",
                paddingTop: "50px",
                paddingBottom: "50px",
                borderRadius: "20px",
                float: "left"
              }}>
                <div style={{fontSize: "20px", fontWeight: "bold", marginBottom: "25px"}}>Meal:</div>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} style={{color: "#F26522"}}>
                      Meal Name
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        as="textarea"
                        value={state.editedMeal.meal_name}
                        placeholder="Enter Meal Name"
                        onChange={
                          (event) => {
                            editMeal('meal_name', event.target.value)
                          }
                        }
                      />
                    </Col>
                  </Form.Group>
  
                  <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Picture URL
                  </Form.Label>
                  <Col sm={9}>
                    {/* {state.editedMeal.meal_photo_URL
                      ? <div style={{textAlign: "center", marginBottom: "15px"}}><img src={state.editedMeal.meal_photo_URL} height="150px" width="150px"></img></div>
                      : null
                    } */}
                    {<div style={{textAlign: "center", marginBottom: "15px"}}><img src={state.editedMeal.meal_photo_URL} height="150px" width="150px"></img></div>}
                    {/* <Form.Control
                      disabled={!state.selectedMeal}
                      value={state.editedMeal.meal_photo_URL}
                      onChange={
                        (event) => {
                          editMeal('meal_photo_URL', event.target.value );
                        }
                      }
                    /> */}

                    <input type="file" name="upload_file" 
                      onChange={e => {
                        state.selectedFile = e.target.files[0]
                        console.log(state.selectedFile)
                        dispatch({ type: 'SET_PREVIEW', payload: URL.createObjectURL(e.target.files[0])})
                        editMeal('meal_photo_URL', URL.createObjectURL(e.target.files[0]))
                      }} 
                    />

                  </Col>
                  </Form.Group>
  
                  {/* <div>Business {activeBusinessData.business_name}</div> */}
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} style={{color: "#F26522"}}>
                      Business
                    </Form.Label>
                    <Form.Label column sm={9}>
                      {activeBusinessData.business_name}
                    </Form.Label>
                  </Form.Group>
                  
                 
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} style={{color: "#F26522"}}>
                      Category
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                          as="select"
                          
                          value={state.editedMeal.meal_category}
                          onChange={
                            (event) => {
                              console.log(event.target.value)
                              editMeal('meal_category', event.target.value );
                              
                            }
                          }
                      >
                        <option value="" hidden> Select Meal Category </option>
                        {
                          getMealCategories().map(
                            (category) => (
                              <option value={category} key={category}>
                                {category}
                              </option>
                            ),
                          )
                        }
                      </Form.Control>
                    </Col>
                  </Form.Group>
  
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} style={{color: "#F26522"}}>
                      Description
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={state.editedMeal.meal_desc}
                        placeholder="Enter Meal Description"
                        onChange={
                          (event) => {
                            editMeal('meal_desc', event.target.value );
                          }
                        }
                      />
                    </Col>
                  </Form.Group>
  
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} style={{color: "#F26522"}}>
                      Hint
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        value={state.editedMeal.meal_hint}
                        placeholder="Enter Meal Hint"
                        onChange={
                          (event) => {
                            editMeal('meal_hint', event.target.value );
                          }
                        }
                      />
                    </Col>
                  </Form.Group>


                  
                 
                </Form>
                <Form style={{
                  position: "relative",
                  // justifySelf: "center",
                  // alignSelf: "center",
                  display: "block",
                  // border: "#ff6505 solid",
                  backgroundColor: "#F8BB17",
                  minHeight: "620px",
                  
                  width: "2px",
                  zIndex:"102",
                  // paddingRight: "50px",
                  // paddingTop: "50px",
                  // paddingBottom: "50px",
                  // borderRadius: "20px",
                  marginTop: "5%",
                  float: "left"
                }}></Form>
  
                <Form style={{
                position: "relative",
                // justifySelf: "center",
                // alignSelf: "center",
                display: "block",
                // border: "#ff6505 solid",
                // backgroundColor: "#FEF7E0",
                // height: "900px",
                width: "495px",
                zIndex:"102",
                paddingRight: "50px",
                paddingTop: "50px",
                paddingBottom: "50px",
                paddingLeft: "25px",
                borderRadius: "20px",
                float: "left"
              }}>
                  <div style={{fontSize: "20px", fontWeight: "bold", marginBottom: "10px"}}>Nutritional Facts:</div>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} style={{color: "#F26522"}}>
                      Calories
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        value={state.editedMeal.meal_calories}
                        placeholder="Enter Calories"
                        onChange={
                          (event) => {
                            editMeal('meal_calories', event.target.value );
                          }
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} style={{color: "#F26522"}}>
                      Protein
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        value={state.editedMeal.meal_protein}
                        placeholder="Enter Protein Amount"
                        onChange={
                          (event) => {
                            editMeal('meal_protein', event.target.value );
                          }
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} style={{color: "#F26522"}}>
                      Carbs
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        value={state.editedMeal.meal_carbs}
                        placeholder="Enter Carb Amount"
                        onChange={
                          (event) => {
                            editMeal('meal_carbs', event.target.value );
                          }
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} style={{color: "#F26522"}}>
                      Fiber
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        value={state.editedMeal.meal_fiber}
                        placeholder="Enter Fiber Amount"
                        onChange={
                          (event) => {
                            editMeal('meal_fiber', event.target.value );
                          }
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} style={{color: "#F26522"}}>
                      Sugar
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        value={state.editedMeal.meal_sugar}
                        placeholder="Enter Sugar Amount"
                        onChange={
                          (event) => {
                            editMeal('meal_sugar', event.target.value );
                          }
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} style={{color: "#F26522"}}>
                      Fat
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        value={state.editedMeal.meal_fat}
                        placeholder="Enter Fat Amount"
                        onChange={
                          (event) => {
                            editMeal('meal_fat', event.target.value );
                          }
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} style={{color: "#F26522"}}>
                      Sat
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        value={state.editedMeal.meal_sat}
                        placeholder="Enter Saturated Fat Amount"
                        onChange={
                          (event) => {
                            editMeal('meal_sat', event.target.value );
                          }
                        }
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Status
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      as="textarea"
                      value={state.editedMeal.meal_status}
                      placeholder="Placeholder for status"
                      onChange={
                        (event) => {
                          editMeal('meal_status', event.target.value );
                        }
                      }
                    />
                  </Col>
                </Form.Group>

                  <Row>
                    <Col
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      <Button
                        variant="primary"
                        onClick={()=>{
                          if (!checkForDuplicateNameInBusinessEditing()) {
                            saveEditedMealNew()
                            // toggleMealsGenerated(false)
                            // generateMealsListUpdate()
                            
                            console.log("pog")
                            console.log(state.editedMeal)
                            for (var i = 0; i < allMeals.length; i++) {
                              if (allMeals[i].meal_uid == state.editedMeal.meal_uid) {
                                allMeals[i] = state.editedMeal
                                console.log("meal changed in allMeals")
                              }
                            }
                            toggleEditMeal(false)
                          }
                          
    
                          forceUpdate()
                          // toggleEditMeal(false)
                        }}
                        style={{
                          backgroundColor: "#F26522",
                          marginBottom: "30px",
                          marginTop: "30px",
                          borderRadius: "15px",
                          width: "200px",
                          fontSize: "18px"
                        }}
                      >
                        Save
                      </Button>
                      
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      
                      <Button
                        variant="primary"
                        onClick={()=>{
                          toggleEditMeal(false)
                        }}
                        style={{
                          backgroundColor: "#F26522",
                          borderRadius: "15px",
                          width: "200px",
                          fontSize: "18px"
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
            </div>
            
          </div>
        )
      } else {
      return null
    }
  }

  const newMealBoxOld = () => {

    if (showNewMeal == true) {
        
      return (
        <div style={{
          height: "100%",
          width: "100%",
          zIndex: "101",
          left: "0",
          top: "0",
          overflow: "auto",
          position: "fixed",
          display: "grid",
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        }}>
          <Form style={{
            position: "relative",
            justifySelf: "center",
            alignSelf: "center",
            display: "block",
            border: "#ff6505 solid",
            backgroundColor: "#FEF7E0",
            height: "900px",
            width: "1000px",
            zIndex:"102",
            padding: "50px",
            borderRadius: "20px"
          }}>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Name
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    as="textarea"
                    
                    placeholder="Enter Meal Name"
                    onChange={
                      (event) => {
                        editMeal('meal_name', event.target.value)
                      }
                    }
                  />
                </Col>
              </Form.Group>

              
              
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Description
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    
                    placeholder="Enter Meal Description"
                    onChange={
                      (event) => {
                        editMeal('meal_desc', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Category
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                      as="select"
                      
                      value={state.editedMeal.meal_category}
                      onChange={
                        (event) => {
                          console.log(event.target.value)
                          editMeal('meal_category', event.target.value );
                          
                        }
                      }
                  >
                    <option value="" hidden> Select Meal Category </option>
                    {
                      getMealCategories().map(
                        (category) => (
                          <option value={category} key={category}>
                            {category}
                          </option>
                        ),
                      )
                    }
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Hint
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    
                    placeholder="Enter Meal Hint"
                    onChange={
                      (event) => {
                        editMeal('meal_hint', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Photo URL
                </Form.Label>
                <Col sm={10}>
                  {/* <Form.File 
                    id = "upload file" 
                    label="File input"
                    onChange={(event)=>{
                      console.log(event.target.value)
                      editMeal('meal_photo_URL', event.target.value)
                    }} />*/}
                  <input type="file" className="form-control" name="upload_file" 
                    onChange={e => {
                      state.selectedFile = e.target.files[0]
                      console.log(state.selectedFile)
                    }} 
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Calories
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    
                    placeholder="Enter Calories"
                    onChange={
                      (event) => {
                        editMeal('meal_calories', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Protein
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    
                    placeholder="Enter Protein Amount"
                    onChange={
                      (event) => {
                        editMeal('meal_protein', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Carbs
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    
                    placeholder="Enter Carb Amount"
                    onChange={
                      (event) => {
                        editMeal('meal_carbs', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Fiber
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    
                    placeholder="Enter Fiber Amount"
                    onChange={
                      (event) => {
                        editMeal('meal_fiber', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Sugar
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    
                    placeholder="Enter Sugar Amount"
                    onChange={
                      (event) => {
                        editMeal('meal_sugar', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Fat
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    
                    placeholder="Enter Fat Amount"
                    onChange={
                      (event) => {
                        editMeal('meal_fat', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Sat
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    
                    placeholder="Enter Saturated Fat Amount"
                    onChange={
                      (event) => {
                        editMeal('meal_sat', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Row>
                <Col
                  style={{
                    textAlign: 'right',
                  }}
                >
                  <Button
                    variant="primary"
                    onClick={()=>{
                      postNewMeal()
                      
                      
                      console.log("edited meal data")
                      console.log(state.editedMeal)
                      // for (var i = 0; i < allMeals.length; i++) {
                      //   if (allMeals[i].meal_uid == state.editedMeal.meal_uid) {
                      //     allMeals[i] = state.editedMeal
                      //     console.log("meal changed in allMeals")
                      //   }
                      // }

                      allMeals.push(state.editedMeal)

                      forceUpdate()
                      toggleNewMeal(false)
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="primary"
                    onClick={()=>{
                      toggleNewMeal(false)
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
        </div>
      )
    } else {
      return null
    }
  }

  const newMealBoxNew = () => {

    if (showNewMeal == true) {
        
      return (
        <div style={{
          height: "100%",
          width: "100%",
          zIndex: "101",
          left: "0",
          top: "0",
          overflow: "auto",
          position: "fixed",
          display: "grid",
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        }}>
          <div style={{
            position: "relative",
            justifySelf: "center",
            alignSelf: "center",
            display: "block",
            border: "#ff6505 solid",
            backgroundColor: "#FEF7E0",
            // height: "900px",
            width: "1002px",
            zIndex:"102",
            
            borderRadius: "20px"
          }}>
              <Form style={{
              position: "relative",
              // justifySelf: "center",
              // alignSelf: "center",
              display: "block",
              // border: "#ff6505 solid",
              // backgroundColor: "#FEF7E0",
              // height: "900px",
              width: "495px",
              zIndex:"102",
              paddingLeft: "50px",
              paddingRight: "25px",
              paddingTop: "50px",
              paddingBottom: "50px",
              borderRadius: "20px",
              float: "left"
            }}>
              <div style={{fontSize: "20px", fontWeight: "bold", marginBottom: "25px"}}>Meal:</div>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Meal Name
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      as="textarea"
                      
                      placeholder="Enter Meal Name"
                      onChange={
                        (event) => {
                          editMeal('meal_name', event.target.value)
                        }
                      }
                    />
                  </Col>
                </Form.Group>

                

                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Picture
                  </Form.Label>
                  <Col sm={9}>

                    <div style={{textAlign: "center", marginBottom: "15px"}}>
                      <img src={state.previewLink} height="150px" width="150px"></img>
                    </div>
                    
                    <input type="file" name="upload_file" 
                      onChange={e => {
                        state.selectedFile = e.target.files[0]
                        console.log(state.selectedFile)
                        dispatch({ type: 'SET_PREVIEW', payload: URL.createObjectURL(e.target.files[0])})
                        editMeal('meal_photo_URL', URL.createObjectURL(e.target.files[0]))
                      }} 
                    />
                  </Col>
                </Form.Group>

                {/* <div>Business {activeBusinessData.business_name}</div> */}
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Business
                  </Form.Label>
                  <Form.Label column sm={9}>
                    {activeBusinessData.business_name}
                  </Form.Label>
                </Form.Group>
                
               
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Category
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                        as="select"
                        
                        value={state.editedMeal.meal_category}
                        onChange={
                          (event) => {
                            console.log(event.target.value)
                            editMeal('meal_category', event.target.value );
                            
                          }
                        }
                    >
                      <option value="" hidden> Select Meal Category </option>
                      {
                        getMealCategories().map(
                          (category) => (
                            <option value={category} key={category}>
                              {category}
                            </option>
                          ),
                        )
                      }
                    </Form.Control>
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Description
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      
                      placeholder="Enter Meal Description"
                      onChange={
                        (event) => {
                          editMeal('meal_desc', event.target.value );
                        }
                      }
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Hint
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      
                      placeholder="Enter Meal Hint"
                      onChange={
                        (event) => {
                          editMeal('meal_hint', event.target.value );
                        }
                      }
                    />
                  </Col>
                </Form.Group>
                
               
              </Form>
              <Form style={{
                position: "relative",
                // justifySelf: "center",
                // alignSelf: "center",
                display: "block",
                // border: "#ff6505 solid",
                backgroundColor: "#F8BB17",
                height: "620px",
                width: "2px",
                zIndex:"102",
                // paddingRight: "50px",
                // paddingTop: "50px",
                // paddingBottom: "50px",
                // borderRadius: "20px",
                marginTop: "5%",
                float: "left"
              }}></Form>

              <Form style={{
              position: "relative",
              // justifySelf: "center",
              // alignSelf: "center",
              display: "block",
              // border: "#ff6505 solid",
              // backgroundColor: "#FEF7E0",
              // height: "900px",
              width: "495px",
              zIndex:"102",
              paddingRight: "50px",
              paddingTop: "50px",
              paddingBottom: "50px",
              paddingLeft: "25px",
              borderRadius: "20px",
              float: "left"
            }}>
                <div style={{fontSize: "20px", fontWeight: "bold", marginBottom: "10px"}}>Nutritional Facts:</div>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Calories
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      
                      placeholder="Enter Calories"
                      onChange={
                        (event) => {
                          editMeal('meal_calories', event.target.value );
                        }
                      }
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Protein
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      
                      placeholder="Enter Protein Amount"
                      onChange={
                        (event) => {
                          editMeal('meal_protein', event.target.value );
                        }
                      }
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Carbs
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      
                      placeholder="Enter Carb Amount"
                      onChange={
                        (event) => {
                          editMeal('meal_carbs', event.target.value );
                        }
                      }
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Fiber
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      
                      placeholder="Enter Fiber Amount"
                      onChange={
                        (event) => {
                          editMeal('meal_fiber', event.target.value );
                        }
                      }
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Sugar
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      
                      placeholder="Enter Sugar Amount"
                      onChange={
                        (event) => {
                          editMeal('meal_sugar', event.target.value );
                        }
                      }
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Fat
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      
                      placeholder="Enter Fat Amount"
                      onChange={
                        (event) => {
                          editMeal('meal_fat', event.target.value );
                        }
                      }
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Sat
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      
                      placeholder="Enter Saturated Fat Amount"
                      onChange={
                        (event) => {
                          editMeal('meal_sat', event.target.value );
                        }
                      }
                    />
                  </Col>
                </Form.Group>
                
                <Form.Group as={Row}>
                  <Form.Label column sm={3} style={{color: "#F26522"}}>
                    Status
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      as="textarea"
                      
                      placeholder="Placeholder for status"
                      onChange={
                        (event) => {
                          editMeal('meal_status', event.target.value );
                        }
                      }
                    />
                  </Col>
                </Form.Group>

                <Row>
                  <Col
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <Button
                      variant="primary"
                      onClick={()=>{
                        if (!checkForDuplicateNameInBusiness()){
                          postNewMeal()

                          allMeals.push(state.editedMeal)
                          dispatch({ type: 'SET_PREVIEW', payload: ''})
                          toggleNewMeal(false)
                        }
                        

                        console.log("edited meal data")
                        console.log(state.editedMeal)
                        
                        

                        // axios
                        //   .get(`${API_URL}meals`)
                        //   .then((response) => {
                        //     const mealApiResult = response.data.result;
                        //     // Convert property values to string and nulls to empty string
                        //     for(let index = 0; index < mealApiResult.length; index++) {
                        //       for (const property in mealApiResult[index]) {
                        //           const value = mealApiResult[index][property];
                        //           mealApiResult[index][property] = value ? value.toString() : '';
                        //         } 
                        //     }
                        //     // Sort by meal name
                        //     mealApiResult.sort((mealA, mealB) => {
                        //       const mealNameA = mealA.meal_name;
                        //       const mealNameB = mealB.meal_name;
                        //       if(mealNameA < mealNameB) {
                        //         return -1;
                        //       }
                        //       if(mealNameA > mealNameB) {
                        //         return 1;
                        //       }
                        //       // Use Id if same name; should not happen
                        //       const idA = mealA.meal_uid;
                        //       const idB = mealB.meal_uid;
                        //       return (idA < idB) ? -1 : 1;
                        //     });
                        //     dispatch({ type: 'FETCH_MEALS', payload: mealApiResult });
                        //     //console.log(mealApiResult)
                        //     allMeals = mealApiResult
                        //     console.log(allMeals)
                        //   })
                        
                        // console.log(allMeals)
                        
                        // editMeal('meal_photo_URL', state.previewLink );

                        

                        forceUpdate()
                        // toggleNewMeal(false)
                      }}
                      style={{
                        backgroundColor: "#F26522",
                        marginBottom: "30px",
                        marginTop: "30px",
                        borderRadius: "15px",
                        width: "200px",
                        fontSize: "18px"
                      }}
                    >
                      Save
                    </Button>
                    
                  </Col>
                </Row>
                <Row>
                  <Col
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    
                    <Button
                      variant="primary"
                      onClick={()=>{
                        toggleNewMeal(false)
                        dispatch({ type: 'SET_PREVIEW', payload: ''})
                      }}
                      style={{
                        backgroundColor: "#F26522",
                        borderRadius: "15px",
                        width: "200px",
                        fontSize: "18px"
                      }}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
          </div>
          
        </div>
      )
    } else {
      return null
    }
  }

  const displayBusinessHours = () => {
    if (activeBusiness != null && tempMonStart == 'N/A') {
      setTempBusinessName(activeBusinessData.business_name)
      setTempCusine(activeBusinessData.business_type)
      tempSetMonStart(getActiveBusinessHours().Monday[0])
      setMonFin(getActiveBusinessHours().Monday[1])
      tempSetTueStart(getActiveBusinessHours().Tuesday[0])
      setTueFin(getActiveBusinessHours().Tuesday[1])
      tempSetWedStart(getActiveBusinessHours().Wednesday[0])
      setWedFin(getActiveBusinessHours().Wednesday[1])
      tempSetThuStart(getActiveBusinessHours().Thursday[0])
      setThuFin(getActiveBusinessHours().Thursday[1])
      tempSetFriStart(getActiveBusinessHours().Friday[0])
      setFriFin(getActiveBusinessHours().Friday[1])
      tempSetSatStart(getActiveBusinessHours().Saturday[0])
      setSatFin(getActiveBusinessHours().Saturday[1])
      tempSetSunStart(getActiveBusinessHours().Sunday[0])
      setSunFin(getActiveBusinessHours().Sunday[1])
    }
  }

  return (
    <div style={{backgroundColor: '#F26522'}}>

      {/*NEW CODE*/}
      {console.log("begin render")}
      {console.log("")}

      {generateMealsList()}
      {generateBusinessIDs()}
      {getBusinessData()}

      {console.log(activeBusiness)}

      {displayBusinessHours()}
      
      {/* {getDropdownButtons()} */}
      

      <AdminNavBar currentPage={'edit-meal'}/>

      <div className={styles.containerCustomer}>
        <img src={activeBusinessData.business_image} alt="profile image" height="90" width="90" style={{marginTop: '15px', marginLeft: '15px'}}></img>
        <div
          style={{
          position:"absolute",
          top:'145px',
          left:'166px',
          height: (
          showDropdown
            ? 60 + (allBusinesses.length *42)
            : 60
          )
          }}
        >
          <div
            className={styles.dropdownSelection}
            onClick={() => {
              toggleShowDropdown(!showDropdown)
              console.log("clicked")
            }}
          >
            <div
              style={{
                width: '80%',
                marginLeft: '5%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              {
                activeBusiness === null
                  ? "No Active Businesses"
                  : getBusinessDataByID(activeBusiness).business_name
              }
            </div>
            <div
              style={{
                width: '10%',
                minWidth: '24px',
                marginRight: '5%'
              }}
            >
              {
                activeBusiness === null
                  ? null
                  : <div className={styles.whiteArrowDown} /> 
              }
              {/* <div className={styles.whiteArrowDown} /> */}
            </div>  
          </div>
          {showDropdown
            ? getDropdownButtons()
            : null
          }
        </div>
        <div style={{
          position:"absolute",
          top:'185px',
          left:'176px',
          color: "#F26522",
          textDecoration: "underline"
          }}
          onClick={() => {
            console.log(activeBusiness)
            console.log(activeBusinessData)
            toggleBusinessDetails(!showBusinessDetails)
            console.log(showBusinessDetails)
            setActiveBusinessData(getBusinessDataByID(activeBusiness))
            setTempBusinessName(activeBusinessData.business_name)
            setTempCusine(activeBusinessData.business_type)
            tempSetMonStart(getActiveBusinessHours().Monday[0])
            setMonFin(getActiveBusinessHours().Monday[1])
            tempSetTueStart(getActiveBusinessHours().Tuesday[0])
            setTueFin(getActiveBusinessHours().Tuesday[1])
            tempSetWedStart(getActiveBusinessHours().Wednesday[0])
            setWedFin(getActiveBusinessHours().Wednesday[1])
            tempSetThuStart(getActiveBusinessHours().Thursday[0])
            setThuFin(getActiveBusinessHours().Thursday[1])
            tempSetFriStart(getActiveBusinessHours().Friday[0])
            setFriFin(getActiveBusinessHours().Friday[1])
            tempSetSatStart(getActiveBusinessHours().Saturday[0])
            setSatFin(getActiveBusinessHours().Saturday[1])
            tempSetSunStart(getActiveBusinessHours().Sunday[0])
            setSunFin(getActiveBusinessHours().Sunday[1])
            
          }}
        >
          Edit Details
          <img className={styles.editIconSmall}></img>
        </div>
        <div style={{
          position:"absolute",
          top:'185px',
          left:'296px',
          color: "#F26522",
          textDecoration: "underline"
          }}
        >
          Send Message
        </div>

        <div style={{
          position: "absolute",
          top: "125px",
          left: "700px",
          color: "#F26522"
        }}>
          Cusines
        </div>

        <div style={{
          position: "absolute",
          top: "145px",
          left: "700px",
        }}>
          {activeBusinessData.business_type}
          {/* {tempCusine} */}
          {/* {console.log(activeBusinessData)} */}
        </div>

        <div style={{
          position: "absolute",
          top: "125px",
          left: "900px",
          color: "#F26522"
        }}>
          Business Hours
        </div>

        <div style={{
          position: "absolute",
          top: "145px",
          left: "900px",
        }}>
          <div style={{display: "block", fontSize: "12px"}}>
            Monday
          </div>
          <div style={{display: "block", fontSize: "12px"}}>
            Tuesday
          </div>
          <div style={{display: "block", fontSize: "12px"}}>
            Wednesday
          </div>
          <div style={{display: "block", fontSize: "12px"}}>
            Thursday
          </div>
        </div>
        <div style={{
          position: "absolute",
          top: "145px",
          left: "975px",
        }}>
          <div style={{display: "block", fontSize: "12px"}}>
            {getActiveBusinessHours().Monday[0]} - {getActiveBusinessHours().Monday[1]}
          </div>
          <div style={{display: "block", fontSize: "12px"}}>
            {getActiveBusinessHours().Tuesday[0]} - {getActiveBusinessHours().Tuesday[1]}
          </div>
          <div style={{display: "block", fontSize: "12px"}}>
            {getActiveBusinessHours().Wednesday[0]} - {getActiveBusinessHours().Wednesday[1]}
          </div>
          <div style={{display: "block", fontSize: "12px"}}>
            {getActiveBusinessHours().Thursday[0]} - {getActiveBusinessHours().Thursday[1]}
          </div>
        </div>
        <div style={{
          position: "absolute",
          top: "145px",
          left: "1125px",
        }}>
          <div style={{display: "block", fontSize: "12px"}}>
            Friday
          </div>
          <div style={{display: "block", fontSize: "12px"}}>
            Saturday
          </div>
          <div style={{display: "block", fontSize: "12px"}}>
            Sunday
          </div>
        </div>
        <div style={{
          position: "absolute",
          top: "145px",
          left: "1200px",
        }}>
          <div style={{display: "block", fontSize: "12px"}}>
            {getActiveBusinessHours().Friday[0]} - {getActiveBusinessHours().Friday[1]}
          </div>
          <div style={{display: "block", fontSize: "12px"}}>
            {getActiveBusinessHours().Saturday[0]} - {getActiveBusinessHours().Saturday[1]}
          </div>
          <div style={{display: "block", fontSize: "12px"}}>
            {getActiveBusinessHours().Sunday[0]} - {getActiveBusinessHours().Sunday[1]}
          </div>
        </div>
      </div>

      {editBusinessBox()}

      

      <div className={styles.containerMeals}>
        <div style={{fontSize: "24px", display: "inline", marginLeft: "27px"}}>
					Meals Offered
				</div>

        <div style={{fontSize: "32px", display: "inline", marginLeft: "15px"}}
          onClick={()=>{toggleNewMeal(true)}}
        >+</div>

        <table width="100%">
          <tr width="100%">
            <th style={{color: '#F26522', marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "7%">Meal Name</th>
            <th style={{color: '#F26522', margin: "auto", textAlign:"center", display:"inline-block"}} width = "7%">Picture</th>
            <th style={{color: '#F26522', margin: "auto", textAlign:"center", display:"inline-block"}} width = "7%">Meal Description</th>
            <th style={{color: '#F26522', margin: "auto", textAlign:"center", display:"inline-block"}} width = "7%">Meal Category</th>
            <th style={{color: '#F26522', margin: "auto", textAlign:"center", display:"inline-block"}} width = "7%">Meal Hint</th>
            <th style={{color: '#F26522', margin: "auto", textAlign:"center", display:"inline-block"}} width = "7%">Calories</th>
            <th style={{color: '#F26522', margin: "auto", textAlign:"center", display:"inline-block"}} width = "7%">Protein</th>
            <th style={{color: '#F26522', margin: "auto", textAlign:"center", display:"inline-block"}} width = "7%">Carbs</th>
            <th style={{color: '#F26522', margin: "auto", textAlign:"center", display:"inline-block"}} width = "7%">Fiber</th>
            <th style={{color: '#F26522', margin: "auto", textAlign:"center", display:"inline-block"}} width = "7%">Sugar</th>
            <th style={{color: '#F26522', margin: "auto", textAlign:"center", display:"inline-block"}} width = "7%">Fats</th>
            <th style={{color: '#F26522', margin: "auto", textAlign:"center", display:"inline-block"}} width = "7%">Sat</th>
            <th style={{color: '#F26522', margin: "auto", textAlign:"center", display:"inline-block"}} width = "7%">Status</th>
            {/* <th style={{color: '#F26522', paddingLeft: "67px", textAlign:"center", display:"inline-block"}} ></th> */}
          </tr>
        </table>

        <div width="100%" style={{backgroundColor: "white",display: "block", minHeight: "25px"}}></div>

        {generateMealsUI()}    

      </div>

      <br />

      {console.log()}

      {editMealBoxNew()}
      {newMealBoxNew()}
      

      {/*NEW CODE*/}

    </div>
  )
}

export default withRouter(EditMeal);