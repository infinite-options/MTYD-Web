import { useEffect, useReducer } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import { sortedArray } from "../../../reducers/helperFuncs";
import { Breadcrumb, Form, Container, Row, Col, Button } from "react-bootstrap";
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

const initialState = {
  mounted: false,
  mealData: [],
  measureUnitsData: [],
  ingredientsData: [],
  selectedMeal: "",
  mealIngredients: [],
  editedMealIngredients: [],
  sortEditMealIngredients: {
    field: "",
    direction: "",
  },
  newIngredient: {
    ingredient_desc: "",
    package_size: "",
    package_unit: "",
    package_cost: "",
  },
  newMeasureUnit: {
    type: "",
    recipe_unit: "",
    conversion_ratio: "",
    common_unit: "",
  },
};

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
    case "FETCH_MEASURE_UNITS":
      return {
        ...state,
        measureUnitsData: action.payload,
      };
    case "FETCH_INGREDIENTS":
      return {
        ...state,
        ingredientsData: action.payload,
      };
    case "SELECT_MEAL":
      return {
        ...state,
        selectedMeal: action.payload,
      };
    case "FETCH_MEAL_INGREDIENTS":
      return {
        ...state,
        mealIngredients: action.payload,
        editedMealIngredients: action.payload,
      };
    case "SORT_MEAL_INGREDIENTS":
      return {
        ...state,
        sortEditMealIngredients: {
          field: action.payload.field,
          direction: action.payload.direction,
        },
      };
    case "EDIT_MEAL_INGREDIENTS":
      return {
        ...state,
        editedMealIngredients: action.payload,
      };
    case "EDIT_NEW_INGREDIENT":
      return {
        ...state,
        newIngredient: action.payload,
      };
    case "EDIT_NEW_MEASURE_UNIT":
      return {
        ...state,
        newMeasureUnit: action.payload,
      };
    default:
      return state;
  }
}

function EditMealRecipe({ history, ...props }) {
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

  const updateMeals = () => {
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
  };

  // Fetch meals
  useEffect(() => {
    updateMeals();
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

  // Fetch meal ingredients
  useEffect(() => {
    if (state.selectedMeal !== "") {
      axios
        .get(`${API_URL}Ingredients_Recipe_Specific/${state.selectedMeal}`)
        .then((response) => {
          const mealIngredients = response.data.result;
          // Convert property values to string and nulls to empty string
          for (let index = 0; index < mealIngredients.length; index++) {
            for (const property in mealIngredients[index]) {
              const value = mealIngredients[index][property];
              mealIngredients[index][property] = value ? value.toString() : "";
            }
          }
          const sortedMealIngredients = sortedArray(
            mealIngredients,
            state.sortEditMealIngredients.field,
            state.sortEditMealIngredients.direction
          );
          dispatch({
            type: "FETCH_MEAL_INGREDIENTS",
            payload: sortedMealIngredients,
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
    // Call when changing meal: state.selectedMeal
    // Or to retrieve recipe_uids of just added meals: state.mealData
  }, [state.selectedMeal, state.mealData]);

  const changeSortOptions = (field) => {
    const isAsc =
      state.sortEditMealIngredients.field === field &&
      state.sortEditMealIngredients.direction === "asc";
    const direction = isAsc ? "desc" : "asc";
    dispatch({
      type: "SORT_MEAL_INGREDIENTS",
      payload: {
        field: field,
        direction: direction,
      },
    });
    const sortedMealIngredients = sortedArray(
      state.editedMealIngredients,
      field,
      direction
    );
    dispatch({ type: "EDIT_MEAL_INGREDIENTS", payload: sortedMealIngredients });
  };

  const editNewIngredient = (property, value) => {
    const newIngredient = {
      ...state.newIngredient,
      [property]: value,
    };
    dispatch({ type: "EDIT_NEW_INGREDIENT", payload: newIngredient });
  };

  const saveNewIngredient = () => {
    axios
      .post(`${API_URL}ingredients`, state.newIngredient)
      .then(() => {
        dispatch({
          type: "EDIT_NEW_INGREDIENT",
          payload: initialState.newIngredient,
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
  };

  const editNewMeasureUnit = (property, value) => {
    let newMeasureUnit = {};
    // Property is property changed, value is new value of that property
    if (property === "type") {
      const measurementTypeCommonUnitMap = {
        volume: "L",
        mass: "kg",
        length: "cm",
        each: "ea",
      };
      newMeasureUnit = {
        ...state.newMeasureUnit,
        type: value,
        common_unit: measurementTypeCommonUnitMap[value],
      };
    } else {
      newMeasureUnit = {
        ...state.newMeasureUnit,
        [property]: value,
      };
    }
    dispatch({ type: "EDIT_NEW_MEASURE_UNIT", payload: newMeasureUnit });
  };

  const saveNewMeasureUnit = () => {
    axios
      .post(`${API_URL}measure_unit`, state.newMeasureUnit)
      .then((response) => {
        const newMeasureUnitId = response.data.measure_unit_uid;
        const allMeasureUnits = state.measureUnitsData;
        allMeasureUnits.push({
          measure_unit_uid: newMeasureUnitId,
          ...state.newMeasureUnit,
        });
        dispatch({
          type: "EDIT_NEW_MEASURE_UNIT",
          payload: initialState.newMeasureUnit,
        });
        dispatch({ type: "FETCH_MEASURE_UNITS", payload: allMeasureUnits });
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

  if (!state.mounted) {
    return null;
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Edit Meal Recipes </Breadcrumb.Item>
      </Breadcrumb>
      <Container>
        <Row>
          <Col>
            <h5>Edit Meal Recipes</h5>
          </Col>
        </Row>
        <Row>
          <Col sm="8">
            <Form>
              <Form.Group as={Row}>
                <Form.Label column sm="2">
                  Recipe For
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    as="select"
                    value={state.selectedMeal}
                    onChange={(event) => {
                      const newMealId = event.target.value;
                      dispatch({ type: "SELECT_MEAL", payload: newMealId });
                    }}
                  >
                    <option value="" hidden>
                      Select a Meal
                    </option>
                    {state.mealData.map((meal) => (
                      <option value={meal.meal_uid} key={meal.meal_uid}>
                        {meal.meal_name}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Form.Group>
            </Form>
          </Col>
          <Col
            sm="4"
            style={{
              textAlign: "right",
            }}
          >
            <Button
              disabled={!state.selectedMeal}
              onClick={() => {
                const newRecipe = [...state.editedMealIngredients];
                newRecipe.push({
                  ingredient_uid: "",
                  recipe_ingredient_qty: "",
                  measure_unit_uid: "",
                });
                dispatch({ type: "EDIT_MEAL_INGREDIENTS", payload: newRecipe });
              }}
            >
              Add Ingredient
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={
                        state.sortEditMealIngredients.field ===
                        "ingredient_desc"
                      }
                      direction={
                        state.sortEditMealIngredients.field ===
                        "ingredient_desc"
                          ? state.sortEditMealIngredients.direction
                          : "asc"
                      }
                      onClick={() => changeSortOptions("ingredient_desc")}
                    >
                      Ingredient
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={
                        state.sortEditMealIngredients.field ===
                        "recipe_ingredient_qty"
                      }
                      direction={
                        state.sortEditMealIngredients.field ===
                        "recipe_ingredient_qty"
                          ? state.sortEditMealIngredients.direction
                          : "asc"
                      }
                      onClick={() => changeSortOptions("recipe_ingredient_qty")}
                    >
                      Quanity
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={
                        state.sortEditMealIngredients.field === "recipe_unit"
                      }
                      direction={
                        state.sortEditMealIngredients.field === "recipe_unit"
                          ? state.sortEditMealIngredients.direction
                          : "asc"
                      }
                      onClick={() => changeSortOptions("recipe_unit")}
                    >
                      Units
                    </TableSortLabel>
                  </TableCell>
                  <TableCell> Actions </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.editedMealIngredients.map(
                  (ingredient, ingredientIndex) => {
                    return (
                      <TableRow key={ingredientIndex} hover>
                        <TableCell>
                          <Form.Control
                            as="select"
                            value={ingredient.ingredient_uid}
                            onChange={(event) => {
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
                            {state.ingredientsData.map((allIngredients) => (
                              <option
                                value={allIngredients.ingredient_uid}
                                key={allIngredients.ingredient_uid}
                              >
                                {allIngredients.ingredient_desc}
                              </option>
                            ))}
                          </Form.Control>
                        </TableCell>
                        <TableCell>
                          <Form.Control
                            type="number"
                            value={ingredient.recipe_ingredient_qty}
                            onChange={(event) => {
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
                        </TableCell>
                        <TableCell>
                          <Form.Control
                            as="select"
                            value={ingredient.measure_unit_uid}
                            onChange={(event) => {
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
                            {state.measureUnitsData.map((allMeasureUnits) => (
                              <option
                                value={allMeasureUnits.measure_unit_uid}
                                key={allMeasureUnits.measure_unit_uid}
                              >
                                {allMeasureUnits.recipe_unit}
                              </option>
                            ))}
                          </Form.Control>
                        </TableCell>
                        <TableCell>
                          <button
                            className={"icon-button"}
                            onClick={() => {
                              const removeIngredient = () => {
                                const newRecipe = [
                                  ...state.editedMealIngredients,
                                ];
                                const ingredientIndex = newRecipe.findIndex(
                                  (elt) =>
                                    elt.ingredient_uid ===
                                    ingredient.ingredient_uid
                                );
                                newRecipe.splice(ingredientIndex, 1);
                                dispatch({
                                  type: "EDIT_MEAL_INGREDIENTS",
                                  payload: newRecipe,
                                });
                                updateMeals();
                              };
                              if (ingredient.recipe_uid) {
                                // Already in database, API call to remove
                                axios
                                  .delete(`${API_URL}Delete_Recipe_Specific`, {
                                    params: {
                                      recipe_uid: ingredient.recipe_uid,
                                    },
                                  })
                                  .then((response) => {
                                    if (response.status === 202) {
                                      removeIngredient();
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
                                // Not in database, directly remove
                                removeIngredient();
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                          <button
                            className={"icon-button"}
                            onClick={() => {
                              if (ingredient.recipe_uid) {
                                // Case for Editing ingredient
                                const object = {
                                  qty: ingredient.recipe_ingredient_qty.toString(),
                                  id: ingredient.ingredient_uid,
                                  measure: ingredient.measure_unit_uid,
                                  meal_id: ingredient.recipe_meal_id,
                                  recipe_uid: ingredient.recipe_uid,
                                };
                                axios
                                  .post(`${API_URL}update_recipe`, object)
                                  .then((response) => {
                                    if (response.status === 200) {
                                      updateMeals();
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
                                // Case for Adding ingredient
                                const object = {
                                  qty: ingredient.recipe_ingredient_qty.toString(),
                                  id: ingredient.ingredient_uid,
                                  measure: ingredient.measure_unit_uid,
                                  meal_id: state.selectedMeal,
                                };
                                axios
                                  .post(
                                    `${API_URL}add_new_ingredient_recipe`,
                                    object
                                  )
                                  .then((response) => {
                                    if (response.status === 200) {
                                      updateMeals();
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
                            }}
                          >
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                        </TableCell>
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
          }}
        >
          <Col>
            <h5>Create New Ingredient</h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> Ingredient </TableCell>
                  <TableCell> Package Size </TableCell>
                  <TableCell> Package Unit </TableCell>
                  <TableCell> Package Cost </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Form.Control
                      type="text"
                      value={state.newIngredient.ingredient_desc}
                      onChange={(event) => {
                        editNewIngredient(
                          "ingredient_desc",
                          event.target.value
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Form.Control
                      type="number"
                      value={state.newIngredient.package_size}
                      onChange={(event) => {
                        editNewIngredient("package_size", event.target.value);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Form.Control
                      as="select"
                      value={state.newIngredient.package_unit}
                      onChange={(event) => {
                        editNewIngredient("package_unit", event.target.value);
                      }}
                    >
                      <option value=""> Select a Unit </option>
                      {state.measureUnitsData.map((allMeasureUnits) => (
                        <option
                          value={allMeasureUnits.measure_unit_uid}
                          key={allMeasureUnits.measure_unit_uid}
                        >
                          {allMeasureUnits.recipe_unit}
                        </option>
                      ))}
                    </Form.Control>
                  </TableCell>
                  <TableCell>
                    <Form.Control
                      type="number"
                      value={state.newIngredient.package_cost}
                      onChange={(event) => {
                        editNewIngredient("package_cost", event.target.value);
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={() => saveNewIngredient()}>
              Save New Ingredient
            </Button>
          </Col>
        </Row>
        <Row
          style={{
            marginTop: "4rem",
          }}
        >
          <Col>
            <h5>Create New Measure Unit</h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> Type </TableCell>
                  <TableCell> Unit Name </TableCell>
                  <TableCell> Conversion Ratio </TableCell>
                  <TableCell> Base Unit </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Form.Control
                      as="select"
                      value={state.newMeasureUnit.type}
                      onChange={(event) => {
                        editNewMeasureUnit("type", event.target.value);
                      }}
                    >
                      <option value=""> Select a Type </option>
                      <option value="mass"> Mass </option>
                      <option value="volume"> Volume </option>
                      <option value="length"> Length </option>
                      <option value="each"> Each </option>
                    </Form.Control>
                  </TableCell>
                  <TableCell>
                    <Row>
                      <Col sm="10">
                        <Form.Control
                          type="text"
                          value={state.newMeasureUnit.recipe_unit}
                          onChange={(event) => {
                            editNewMeasureUnit(
                              "recipe_unit",
                              event.target.value
                            );
                          }}
                        />
                      </Col>
                      <Col sm="2">=</Col>
                    </Row>
                  </TableCell>
                  <TableCell>
                    <Form.Control
                      type="number"
                      value={state.newMeasureUnit.conversion_ratio}
                      onChange={(event) => {
                        editNewMeasureUnit(
                          "conversion_ratio",
                          event.target.value
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>{state.newMeasureUnit.common_unit}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={() => saveNewMeasureUnit()}>
              Save Measure Unit
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default withRouter(EditMealRecipe);
