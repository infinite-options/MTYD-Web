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
  newMeal: {
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
    case 'EDIT_MEAL':
      return {
        ...state,
        newMeal: action.payload
      }
    default:
      return state;
  }
}

function CreateMeal({history, ...props}) {
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
        const mealApiResult = response.data.result;
        dispatch({ type: 'FETCH_MEALS', payload: mealApiResult });
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

  const editMeal = (property,value) => {
    // Property is property changed, value is new value of that property
    const newMeal = {
      ...state.newMeal,
      [property]: value,
    };
    dispatch({ type: 'EDIT_MEAL', payload: newMeal })
  }

  const clearNewMeal = () => {
    dispatch({ type: 'EDIT_MEAL', payload: initialState.newMeal })
  }

  const saveNewMeal = () => {
    axios
      .post(`${API_URL}meals`,state.newMeal)
      .then((response) => {
        if(response.status === 201) {
          clearNewMeal();
        }
      })
      .catch((err) => {
        if(err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      })
  }

  const disableSave = () => {
    if(state.newMeal.meal_name === '') {
      return true;
    }
    if(state.newMeal.meal_category === '') {
      return true;
    }
    return false;
  }

  if (!state.mounted) {
    return null;
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Create Meals </Breadcrumb.Item>
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
                    value={state.newMeal.meal_name}
                    onChange={
                      (event) => {
                        editMeal('meal_name', event.target.value );
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
                    value={state.newMeal.meal_desc}
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
                      value={state.newMeal.meal_category}
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
                    value={state.newMeal.meal_hint}
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
                    value={state.newMeal.meal_photo_URL}
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
                    value={state.newMeal.meal_calories}
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
                    value={state.newMeal.meal_protein}
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
                    value={state.newMeal.meal_carbs}
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
                    value={state.newMeal.meal_fiber}
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
                    value={state.newMeal.meal_sugar}
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
                    value={state.newMeal.meal_fat}
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
                    value={state.newMeal.meal_sat}
                    onChange={
                      (event) => {
                        editMeal('meal_sat', event.target.value );
                      }
                    }
                  />
                </Col>
              </Form.Group>
              <Row>
                <Col sm="3">
                  <Button
                    variant="primary"
                    disabled={disableSave()}
                    onClick={saveNewMeal}
                  >
                    Save Meal
                  </Button>
                </Col>
                {/* <Col sm="3">
                  <Button
                    variant="primary"
                  >
                    Save Meal and Edit Recipe
                  </Button>
                </Col> */}
                <Col sm="2">
                  <Button
                    variant="primary"
                    onClick={clearNewMeal}
                  >
                    Cancel Meal
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default withRouter(CreateMeal);