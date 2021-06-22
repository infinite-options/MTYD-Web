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
  },
};

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
    default:
      return state;
  }
}

var allMeals = []
var mealsGenerated = false
var allBusinesses = []
var idsGenerated = false

function EditMeal({history, ...props}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showDropdown, toggleShowDropdown] = useState(false);
  const [activeBusiness, setActiveBusiness] = useState("")
  const [showDetails, toggleDetails] = useState(false)

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
    axios
      .put(`${API_URL}meals`,savedMeal)
      .then((response) => {
        if(response.status === 201) {
          // Make sure if saved and come back to same meal, meal is changed; no need to call API again
          const changedIndex = state.mealData.findIndex((meal) => meal.meal_uid === state.selectedMeal);
          const newMealData = [...state.mealData];
          newMealData[changedIndex] = state.editedMeal;
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

  const generateMealsUI = () => {
    console.log("Generating meals")
    console.log(allMeals.length)
    let tempArray = []
    for (let i = 0; i < allMeals.length; i++) {
      let index = i
      
      if (allMeals[index].meal_business == activeBusiness){    
        tempArray.push(
          <div width = "100%" key = {allMeals[index].meal_uid}>
            <tr>
              <th style={{marginLeft: "30px", textAlign:"center", display:"inline-block", overflow:"hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}} width="101px" height="45">
                {allMeals[index].meal_name}
              </th>
              <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block"}} width="60px">
                <img src={allMeals[index].meal_photo_URL} height="45" width="45"></img>
              </th>
              <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block", overflow:"hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}} width = "142px" height="45">{allMeals[index].meal_desc}</th>
              <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "122px" height="45">{allMeals[index].meal_category}</th>
              <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block", overflow:"hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}} width = "80px" height="45">{allMeals[index].meal_hint}</th>
              <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "69px" height="45">{allMeals[index].meal_calories} Cal</th>
              <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "60px" height="45">{allMeals[index].meal_protein}g</th>            
              <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "50px" height="45">{allMeals[index].meal_carbs}g</th>
              <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "43px" height="45">{allMeals[index].meal_fiber}g</th>
              <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "50px" height="45">{allMeals[index].meal_sugar}g</th>
              <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "35px" height="45">{allMeals[index].meal_fat}%</th>
              <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "28px" height="45">{allMeals[index].meal_sat}%</th>
              <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "54px" height="45">Status</th>
              <th style={{marginLeft: "27px", textAlign:"center", display:"inline-block"}} height="45">
                <div className={styles.saveIcon}></div>
                <div className={styles.deleteIcon}></div>
              </th>
            </tr>
            <div width="100%" style={{backgroundColor: "#F8BB17", display: "block", minHeight: "2px", marginTop: "25px", marginBottom: "25px"}}></div>
          </div>
        )
      }
    }
    console.log("Done generating meals")
    return tempArray
  }

  const generateMealsList = () => {
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
    mealsGenerated = true
  }
    return null
  }

  const generateBusinessIDs = () => {
    if (idsGenerated == false && mealsGenerated == true) {
      console.log("length check")
      console.log(allMeals.length)
      for (let i = 0; i < allMeals.length; i++) {
        let temp = allMeals[i].meal_business
        console.log(temp)
        if (allBusinesses.indexOf(temp) < 0) {
          allBusinesses.push(temp)
        }
      }
    }
    console.log(allBusinesses)
    //setActiveBusiness(allBusinesses[1])
    return null
  }

  const generateDropdownButtons = () => {
    let tempDropdownButtons = []
    for (let i = 0; i < allBusinesses.length; i++) {
      let index = i
      tempDropdownButtons.push(
        <div
          key={allBusinesses[index]}
          onClick={() => {
            setActiveBusiness(allBusinesses[index])
            console.log("active business = " + activeBusiness)
            toggleShowDropdown(false)
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
        >{allBusinesses[index]}</div>
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

  return (
    <div style={{backgroundColor: '#F26522'}}>

      {/*NEW CODE*/}

      {generateMealsList()}
      {generateBusinessIDs()}
      {/* {getDropdownButtons()} */}

      <AdminNavBar currentPage={'edit-meal'}/>

      <div className={styles.containerCustomer}>
        <img alt="profile image" height="90" width="90" style={{marginTop: '15px', marginLeft: '15px'}}></img>
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
                  : activeBusiness
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
        >
          Edit Details
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
      
      </div>

      

      <div className={styles.containerMeals}>
        <div className={styles.sectionHeader} style={{display: "inline"}}>
					Meals Offered
				</div>

        <div style={{fontSize: "32px", display: "inline", marginLeft: "15px"}}>+</div>

        <table width="100%">
          <tr>
            <th style={{color: '#F26522', marginLeft: "30px", textAlign:"center", display:"inline-block", fontSize:"18px"}} width = "101px">Meal Name</th>
            <th style={{color: '#F26522', marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "60px">Picture</th>
            <th style={{color: '#F26522', marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "142px">Meal Description</th>
            <th style={{color: '#F26522', marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "122px">Meal Category</th>
            <th style={{color: '#F26522', marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "80px">Meal Hint</th>
            <th style={{color: '#F26522', marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "69px">Calories</th>
            <th style={{color: '#F26522', marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "60px">Protein</th>
            <th style={{color: '#F26522', marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "50px">Carbs</th>
            <th style={{color: '#F26522', marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "43px">Fiber</th>
            <th style={{color: '#F26522', marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "50px">Sugar</th>
            <th style={{color: '#F26522', marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "35px">Fats</th>
            <th style={{color: '#F26522', marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "28px">Sat</th>
            <th style={{color: '#F26522', marginLeft: "27px", textAlign:"center", display:"inline-block"}} width = "54px">Status</th>
            {/* <th style={{color: '#F26522', paddingLeft: "67px", textAlign:"center", display:"inline-block"}} ></th> */}
          </tr>
        </table>

        {generateMealsUI()}    

      </div>

      <br />

      {console.log()}

      {/*NEW CODE*/}

      {/*OLD CODE*/}

      {/* <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Edit Meals </Breadcrumb.Item>
      </Breadcrumb>
      <Container>
        <Row>
          <Col>
            <Form>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Meal Name
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    as="select"
                    value={state.selectedMeal}
                    onChange={
                      (event) => {
                          const newMealId = event.target.value;
                          dispatch({ type: 'SELECT_MEAL', payload: newMealId });
                          editMeal('', event.target.value );
                      }
                    }
                  >
                    <option value="" hidden>Choose Meal</option>
                    {
                      state.mealData.map(
                        (meal) => (
                          <option value={meal.meal_uid} key={meal.meal_uid}>
                            {meal.meal_name}
                          </option>
                        ),
                      )
                    }
                  </Form.Control>
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
                    onClick={saveEditedMeal}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container> */}

      {/*OLD CODE*/}

    </div>
  )
}

export default withRouter(EditMeal);