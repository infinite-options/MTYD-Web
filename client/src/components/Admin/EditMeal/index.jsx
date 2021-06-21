import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import {
  Breadcrumb, Container, Row, Col, Form, Button
} from 'react-bootstrap';
import {withRouter} from "react-router";

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

function EditMeal({history, ...props}) {
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

  const getMealCategories = () => {
    const mealCategories = state.mealData.map((menuItem) => menuItem.meal_category);
    const mealCategoriesUnique = mealCategories.filter(
      (elt, index) => mealCategories.indexOf(elt) === index,
    );
    return mealCategoriesUnique;
  };

  // Fetch meals
  useEffect(() => {
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

  if (!state.mounted) {
    return null;
  }

  return (
    <div>

      {/* OLD CODE */}

      <Breadcrumb>
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
      </Container>

      {/* OLD CODE */}

    </div>
  )
}

export default withRouter(EditMeal);