import { useEffect, useMemo, useReducer } from 'react';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { formatTime, sortedArray } from '../../../reducers/helperFuncs';
import {
  Breadcrumb, Form, Button, Container, Row, Col, Modal,
} from 'react-bootstrap';
import {
  Table, TableHead, TableSortLabel, TableBody, TableRow, TableCell
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt, faSave
} from '@fortawesome/free-solid-svg-icons';
import {withRouter} from "react-router";

const initialState = {
  mounted: false,
  menuData: [],
  menuDate: '',
  editedMenu: [],
  sortEditMenu: {
    field: '',
    direction: '',
  },
  mealData: [],
  showAddMeal: false,
  newMeal: {
    menu_date: '',
    default_meal: 'FALSE',
    meal_cat: '',
    meal_uid: '',
    menu_category: '',
    menu_type: '',
  },
  showAddDate: false,
  newDate: {
    menu_date: '',
  },
  showCopyDate: false,
  copyDate: {
    date1: '',
    date2: '',
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'MOUNT':
      return {
        ...state,
        mounted: true,
      }
    case 'FETCH_MENU':
      return {
        ...state,
        menuData: action.payload,
      };
    case 'CHANGE_DATE':
      return {
        ...state,
        menuDate: action.payload,
        newMeal: {
          ...state.newMeal,
          menu_date: action.payload,
        }
      };
    case 'FETCH_MEALS':
      return {
        ...state,
        mealData: action.payload,
      };
    case 'SORT_MENU':
      return {
        ...state,
        sortEditMenu: {
          field: action.payload.field,
          direction: action.payload.direction,
        }
      }
    case 'EDIT_MENU':
      return {
        ...state,
        editedMenu: action.payload,
      };
    case 'TOGGLE_ADD_MENU_ITEM':
      return {
        ...state,
        showAddMeal: !(state.showAddMeal),
        newMeal: {
          ...initialState.newMeal,
          // Date hould be YYYY-MM-DD for date input
          menu_date: state.menuDate.slice(0,10),
        }
      };
    case 'EDIT_NEW_MEAL_MENU':
      return {
        ...state,
        newMeal: action.payload,
      };
    case 'TOGGLE_ADD_MENU_DATE':
      return {
        ...state,
        showAddDate: !(state.showAddDate),
        newDate: {
          ...initialState.newDate,
        },
      }
    case 'EDIT_NEW_MENU_DATE':
      return {
        ...state,
        newDate: action.payload,
      }
    case 'TOGGLE_COPY_MENU_DATE':
      return {
        ...state,
        showCopyDate: !(state.showCopyDate),
        copyDate: {
          ...initialState.newDate,
        },
      }
    case 'COPY_FROM_MENU_DATE':
      return {
        ...state,
        copyDate: action.payload,
      }
    default:
      return state;
  }
}

function CreateMenu({history, ...props}) {
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

  const menuDates = useMemo(() => {
    const menuDates = state.menuData.map((menuItem) => menuItem.menu_date);
    const menuDatesUnique = menuDates.filter((elt, index) => menuDates.indexOf(elt) === index);
    menuDatesUnique.sort();
    const menuDatesFormatted = menuDatesUnique.map((menuDate,dateIndex) => {
      const menuDateTime = new Date(formatTime(menuDate));
      return (
        {
          value: menuDatesUnique[dateIndex],
          display: menuDateTime.toDateString()
        }
      )
    })
    return menuDatesFormatted;
  },[state.menuData]);

  

  const getMenuData = (date) => {
    const curMenu = state.menuData.filter((item) => item.menu_date === date);
    return curMenu;
  };

  const getMealsByCategory = (category) => {
    const mealList = state.mealData.filter((meal) => meal.meal_category === category);
    return mealList;
  };

  const getMealTypes = () => {
    const menuTypes = state.menuData.map((menuItem) => menuItem.menu_type);
    const menuTypesUnique = menuTypes.filter((elt, index) => menuTypes.indexOf(elt) === index);
    return menuTypesUnique;
  };

  const getMealCategories = () => {
    const mealCategories = state.menuData.map((menuItem) => menuItem.meal_cat);
    const mealCategoriesUnique = mealCategories.filter(
      (elt, index) => mealCategories.indexOf(elt) === index,
    );
    return mealCategoriesUnique;
  };

  const getMenuCategories = () => {
    const menuCategories = state.menuData.map((menuItem) => menuItem.menu_category);
    const menuCategoriesUnique = menuCategories.filter(
      (elt, index) => menuCategories.indexOf(elt) === index,
    );
    return menuCategoriesUnique;
  };

  const updateMenu = () => {
    axios
      .get(`${API_URL}menu`)
      .then((response) => {
        if(response.status === 200) {
          const fullMenu = response.data.result;
          if(fullMenu !== undefined) {
            dispatch({ type: 'FETCH_MENU', payload: fullMenu });
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response)
        }
        // eslint-disable-next-line no-console
        console.log(err)
      });
  }

  // Fetch menu
  useEffect(() => {
    updateMenu();
  }, []);

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

  // Change Date
  const changeDate = (newDate) => {
    dispatch({ type: 'CHANGE_DATE', payload: newDate });
    const curMenu = getMenuData(newDate);
    const sortedMenu = sortedArray(curMenu, state.sortEditMenu.field, state.sortEditMenu.direction);
    dispatch({ type: 'EDIT_MENU', payload: sortedMenu });
  };  

  const changeSortOptions = (field) => {
    const isAsc = (state.sortEditMenu.field === field && state.sortEditMenu.direction === 'asc');
    const direction = isAsc ? 'desc' : 'asc';
    dispatch({
      type: 'SORT_MENU',
      payload: {
        field: field,
        direction: direction,
      }
    });
    const sortedMenu = sortedArray(state.editedMenu, field, direction);
    dispatch({ type: 'EDIT_MENU', payload: sortedMenu });
  }

  // Save Upodate menu item
  const updateMenuItem = (menuItem) => {
    if(menuItem.menu_uid) {
      // Update previous item
      axios
        .put(`${API_URL}menu`,menuItem)
        .then(() => {
            updateMenu();
        })
        .catch((err) => {
          if(err.response) {
            // eslint-disable-next-line no-console
            console.log(err.response)
          }
          // eslint-disable-next-line no-console
          console.log(err)
        })
    } else {
      // Saving item from template
      const newMenuItem = {
        ...menuItem,
        delivery_days:['Sunday', 'Monday'],
        meal_price:'10',
      };
      axios
        .post(`${API_URL}menu`,newMenuItem)
        .then((response) => {
          const newMenuId = response.data.meal_uid;
          const newMenuItemId = {
            ...newMenuItem,
            menu_uid: newMenuId,
          }
          const oldIndex = state.editedMenu.indexOf(menuItem);
          const newEditedMenu = [...state.editedMenu];
          newEditedMenu[oldIndex] = newMenuItemId;
          dispatch({ type: 'EDIT_MENU', payload: newEditedMenu });
        })
        .catch((err) => {
          if(err.response) {
            // eslint-disable-next-line no-console
            console.log(err.response)
          }
          // eslint-disable-next-line no-console
          console.log(err)
        })
    }
  }

  // Delete menu item
  const deleteMenuItem = (menuItem) => {
    const menuId = menuItem.menu_uid;
    const menuIndex = state.editedMenu.indexOf(menuItem);
    if(menuId) {
      // Delete from database
      axios
        .delete(`${API_URL}menu`,{
          params: {
            menu_uid: menuId,
          }
        })
        .then(() => {
          const newMenu = [...state.editedMenu];
          newMenu.splice(menuIndex, 1);
          dispatch({ type: 'EDIT_MENU', payload: newMenu });
          updateMenu();
        })
        .catch((err) => {
          if(err.response) {
            // eslint-disable-next-line no-console
            console.log(err.response)
          }
          // eslint-disable-next-line no-console
          console.log(err)
        })
    } else {
      // Delete from template
      const newMenu = [...state.editedMenu];
      newMenu.splice(menuIndex, 1);
      dispatch({ type: 'EDIT_MENU', payload: newMenu });
    }
  }

  const copyDate = (newDate) => {
    dispatch({ type: 'CHANGE_DATE', payload: newDate });
    const curMenu = getMenuData(newDate);
    const sortedMenu = sortedArray(curMenu, state.sortEditMenu.field, state.sortEditMenu.direction);
    dispatch({ type: 'EDIT_MENU', payload: sortedMenu });
  };

  // Toggle Add Menu modal
  const toggleAddMenu = () => {
    dispatch({ type: 'TOGGLE_ADD_MENU_ITEM' });
  };

  // Toggle Add Date Modal
  const toggleAddDate = () => {
    dispatch({ type: 'TOGGLE_ADD_MENU_DATE'})
  }

  const toggleCopyDate = () => {
    dispatch({ type: 'TOGGLE_COPY_MENU_DATE'})
  }

  const saveMenuTemplate = () => {
    const menuDate = `${state.newDate.menu_date} 00:00:00`;
    console.log(menuDate);
    const menuDateFormatted = new Date(menuDate).toDateString();
    dispatch({ type: 'TOGGLE_ADD_MENU_DATE'})
    menuDates.push({
      value: menuDate,
      display: menuDateFormatted,
    });
    const menuTemplate = [
      {
        menu_type: 'Weekly Entree',
        menu_date: menuDate,
        meal_uid: '',
        meal_category: 'Entree',
        meal_cat: 'Entree',
        menu_category: 'WKLY_SPCL_1',
        default_meal: 'FALSE',
      },
      {
        menu_type: 'Weekly Salad',
        menu_date: menuDate,
        meal_uid: '',
        meal_category: 'Salad',
        meal_cat: 'Salad',
        menu_category: 'WKLY_SPCL_2',
        default_meal: 'FALSE',
      },
      {
        menu_type: 'Weekly Soup',
        menu_date: menuDate,
        meal_uid: '',
        meal_category: 'Soup',
        meal_cat: 'Soup',
        menu_category: 'WKLY_SPCL_3',
        default_meal: 'FALSE',
      },
      {
        menu_type: 'Seasonal Entree',
        menu_date: menuDate,
        meal_uid: '',
        meal_category: 'Entree',
        meal_cat: 'Entree',
        menu_category: 'SEAS_FAVE_1',
        default_meal: 'FALSE',
      },
      {
        menu_type: 'Seasonal Salad',
        menu_date: menuDate,
        meal_uid: '',
        meal_category: 'Salad',
        meal_cat: 'Salad',
        menu_category: 'SEAS_FAVE_2',
        default_meal: 'FALSE',
      },
      {
        menu_type: 'Breakfast',
        menu_date: menuDate,
        meal_uid: '',
        meal_category: 'Breakfast',
        meal_cat: 'Breakfast',
        menu_category: 'SEAS_FAVE_3',
        default_meal: 'FALSE',
      },
      {
        menu_type: 'Smoothie',
        menu_date: menuDate,
        meal_uid: '',
        meal_category: 'Smoothie',
        meal_cat: 'Smoothie',
        menu_category: 'SMOOTHIE_1',
        default_meal: 'FALSE',
      },
      {
        menu_type: 'Smoothie',
        menu_date: menuDate,
        meal_uid: '',
        meal_category: 'Smoothie',
        meal_cat: 'Smoothie',
        menu_category: 'SMOOTHIE_2',
        default_meal: 'FALSE',
      },
      {
        menu_type: 'Smoothie',
        menu_date: menuDate,
        meal_uid: '',
        meal_category: 'Smoothie',
        meal_cat: 'Smoothie',
        menu_category: 'SMOOTHIE_3',
        default_meal: 'FALSE',
      },
      {
        menu_type: 'Local Treat',
        menu_date: menuDate,
        meal_uid: '',
        meal_cat: 'Add-On',
        menu_category: 'ADD_ON_1',
        default_meal: 'FALSE',
      },
      {
        menu_type: 'Local Treat',
        menu_date: menuDate,
        meal_uid: '',
        meal_cat: 'Add-On',
        menu_category: 'ADD_ON_2',
        default_meal: 'FALSE',
      },
      {
        menu_type: 'Local Treat',
        menu_date: menuDate,
        meal_uid: '',
        meal_cat: 'Add-On',
        menu_category: 'ADD_ON_3',
        default_meal: 'TRUE',
      },
    ]
    dispatch({ type: 'CHANGE_DATE', payload: menuDate });
    dispatch({ type: 'EDIT_MENU', payload: menuTemplate });
  }

  if (!state.mounted) {
    return null;
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Create or Edit Menu </Breadcrumb.Item>
      </Breadcrumb>
      <Container
        style={{
          maxWidth: 'inherit',
          padding: '0 8rem',
        }}
      >
        <Row>
          <Col sm="6">
            <Form>
              <Form.Group as={Row}>
                <Form.Label column sm="2">
                  Date
                </Form.Label>
                <Col sm="6">
                  <Form.Control
                    as="select"
                    value={state.menuDate}
                    onChange={(event) => changeDate(event.target.value)}
                  >
                    <option value="" hidden>Choose date</option>
                    {
                      menuDates.map(
                        (date) => (
                          <option value={date.value} key={date.value}>
                            {date.display}
                          </option>
                        ),
                      )
                    }
                  </Form.Control>
                </Col>
              </Form.Group>
            </Form>
          </Col>
          <Col
            sm="2"
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              variant="primary"
              onClick={toggleCopyDate}
            >
              Copy Menu
            </Button>
          </Col>
          <Col
            sm="2"
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              variant="primary"
              onClick={toggleAddDate}
            >
              Add Menu Date
            </Button>
          </Col>
          <Col
            sm="2"
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              variant="primary"
              onClick={toggleAddMenu}
            >
              Add Menu Item
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
                      active={state.sortEditMenu.field === 'menu_type'}
                      direction={state.sortEditMenu.field === 'menu_type' ? state.sortEditMenu.direction: 'asc'}
                      onClick={() => changeSortOptions('menu_type')}
                    >
                      Meal Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell> Meal </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortEditMenu.field === 'meal_cat'}
                      direction={state.sortEditMenu.field === 'meal_cat' ? state.sortEditMenu.direction : 'asc'}
                      onClick={() => changeSortOptions('meal_cat')}
                    >
                      Meal Category
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortEditMenu.field === 'menu_category'}
                      direction={state.sortEditMenu.field === 'menu_category' ? state.sortEditMenu.direction : 'asc'}
                      onClick={() => changeSortOptions('menu_category')}
                    >
                      Menu Category
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={state.sortEditMenu.field === 'default_meal'}
                      direction={state.sortEditMenu.field === 'default_meal' ? state.sortEditMenu.direction : 'asc'}
                      onClick={() => changeSortOptions('default_meal')}
                    >
                      Default Meal
                    </TableSortLabel>
                  </TableCell>
                  <TableCell> Actions </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  state.editedMenu.map(
                    (mealMenu, mealMenuIndex) => {
                      const otherMealCategories = mealMenu.meal_category ?getMealsByCategory(mealMenu.meal_category) : state.mealData;
                      return (
                        <TableRow
                          key={`${mealMenuIndex} ${mealMenu.menu_uid}`}
                          hover
                        >
                          <TableCell>
                            {mealMenu.menu_type}
                          </TableCell>
                          <TableCell>
                            <Form>
                              <Form.Control
                                as="select"
                                value={mealMenu.meal_uid}
                                onChange={
                                  (event) => {
                                    const newMenu = [...state.editedMenu];
                                    const newMealId = event.target.value;
                                    const newMealInfo = state.mealData
                                      .filter((meal) => meal.meal_uid === newMealId)[0];
                                    // const mealMenuIndex = newMenu.findIndex((elt) => elt.menu_uid === mealMenu.menu_uid);
                                    newMenu[mealMenuIndex] = {
                                      ...newMenu[mealMenuIndex],
                                      ...newMealInfo,
                                      menu_meal_id: newMealId,
                                    };
                                    dispatch({ type: 'EDIT_MENU', payload: newMenu });
                                  }
                                }
                              >
                                <option value="" hidden> Choose Meal </option>
                                {
                                  otherMealCategories.map(
                                    (meal) => (
                                      <option value={meal.meal_uid} key={meal.meal_uid}>
                                        {meal.meal_name}
                                      </option>
                                    ),
                                  )
                                }
                              </Form.Control>
                            </Form>
                          </TableCell>
                          <TableCell>
                            {mealMenu.meal_cat}
                          </TableCell>
                          <TableCell>
                            {mealMenu.menu_category}
                          </TableCell>
                          <TableCell>
                            <Form>
                              <Form.Control
                                as="select"
                                value={mealMenu.default_meal}
                                onChange={
                                  (event) => {
                                    const newMenu = [...state.editedMenu];
                                    const newDefaultMeal = event.target.value;
                                    // const mealMenuIndex = newMenu.findIndex((elt) => elt.menu_uid === mealMenu.menu_uid);
                                    newMenu[mealMenuIndex] = {
                                      ...newMenu[mealMenuIndex],
                                      default_meal: newDefaultMeal,
                                    };
                                    dispatch({ type: 'EDIT_MENU', payload: newMenu });
                                  }
                                }
                              >
                                <option value="FALSE"> FALSE </option>
                                <option value="TRUE"> TRUE </option>
                              </Form.Control>
                            </Form>
                          </TableCell>
                          <TableCell>
                            <button
                              className={'icon-button'}
                              onClick={
                                () => {
                                  deleteMenuItem(mealMenu);
                                }
                              }
                            >
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                              />
                            </button>
                            <button
                              className={'icon-button'}
                              onClick={
                                () => {
                                  updateMenuItem(mealMenu);
                                }
                              }
                            >
                              <FontAwesomeIcon
                                icon={faSave}
                              />
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    },
                  )
                }
              </TableBody>
            </Table>
          </Col>
        </Row>
      </Container>
      <Modal
        show={state.showAddMeal}
        onHide={toggleAddMenu}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Add Menu Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Menu Date
              </Form.Label>
              <Form.Control
                type="date"
                value={state.newMeal.menu_date}
                onChange={
                  (event) => {
                    const newDate = event.target.value;
                    const newMeal = {
                      ...state.newMeal,
                      menu_date: newDate,
                    }
                    dispatch({ type: 'EDIT_NEW_MEAL_MENU', payload: newMeal });
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Meal Type
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.meal_type}
                onChange={
                  (event) => {
                    const newMealType = event.target.value;
                    const newMeal = {
                      ...state.newMeal,
                      menu_type: newMealType,
                    };
                    dispatch({ type: 'EDIT_NEW_MEAL_MENU', payload: newMeal });
                  }
                }
              >
                <option value="" hidden>Choose Meal Type</option>
                {
                  getMealTypes().map(
                    (mealType) => (
                      <option value={mealType} key={mealType}>
                        {mealType}
                      </option>
                    ),
                  )
                }
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Meal
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.meal_uid}
                onChange={
                  (event) => {
                    const newMealId = event.target.value;
                    const newMeal = {
                      ...state.newMeal,
                      meal_uid: newMealId,
                    };
                    dispatch({ type: 'EDIT_NEW_MEAL_MENU', payload: newMeal });
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
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Meal Category
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.meal_cat}
                onChange={
                  (event) => {
                    const newMealCat = event.target.value;
                    const newMeal = {
                      ...state.newMeal,
                      meal_cat: newMealCat,
                    };
                    dispatch({ type: 'EDIT_NEW_MEAL_MENU', payload: newMeal });
                  }
                }
              >
                <option value="" hidden>Choose Meal Category</option>
                {
                  getMealCategories().map(
                    (mealCategory) => (
                      <option value={mealCategory} key={mealCategory}>
                        {mealCategory}
                      </option>
                    ),
                  )
                }
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Menu Category
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.menu_category}
                onChange={
                  (event) => {
                    const newMenuCategory = event.target.value;
                    const newMeal = {
                      ...state.newMeal,
                      menu_category: newMenuCategory,
                    };
                    dispatch({ type: 'EDIT_NEW_MEAL_MENU', payload: newMeal });
                  }
                }
              >
                <option value="" hidden>Choose Menu Category</option>
                {
                 getMenuCategories().map(
                   (menuCategory) => (
                     <option value={menuCategory} key={menuCategory}>
                       {menuCategory}
                     </option>
                   ),
                 )
               }
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Default Meal
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.default_meal}
                onChange={
                  (event) => {
                    const newDefaultMeal = event.target.value;
                    const newMeal = {
                      ...state.newMeal,
                      default_meal: newDefaultMeal,
                    };
                    dispatch({ type: 'EDIT_NEW_MEAL_MENU', payload: newMeal });
                  }
                }
              >
                <option value="FALSE"> FALSE </option>
                <option value="TRUE"> TRUE </option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleAddMenu}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={
              () => {
                const newMenuItemInfo = state.mealData.filter(
                  (meal) => meal.meal_uid === state.newMeal.meal_uid)[0];
                // YYYY-MM-DD seems to work for request parameter, no need to add HH:MM:SS
                const newMenuItem = {
                  ...state.newMeal,
                  ...newMenuItemInfo,
                  menu_meal_id: state.newMeal.meal_uid,
                  delivery_days:['Sunday', 'Monday'],
                  meal_price:'10',
                };
                axios
                  .post(`${API_URL}menu`,newMenuItem)
                  .then((response) => {
                    // Save New menu item with id on screen
                    const newMenuId = response.data.meal_uid;
                    const newMenuItemId = {
                      ...newMenuItem,
                      menu_uid: newMenuId,
                    }
                    const newEditedMenu = [...state.editedMenu];
                    newEditedMenu.push(newMenuItemId)
                    dispatch({ type: 'EDIT_MENU', payload: newEditedMenu });
                    // Save menu item after switching to different date and back
                    updateMenu();
                    toggleAddMenu()
                  })
                  .catch((err) => {
                    if(err.response) {
                      // eslint-disable-next-line no-console
                      console.log(err.response)
                    }
                    // eslint-disable-next-line no-console
                    console.log(err)
                  })
              }
            }
          >
            Save Menu Item
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={state.showAddDate}
        onHide={toggleAddDate}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Add Menu Date </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Menu Date
              </Form.Label>
              <Form.Control
                type="date"
                value={state.newDate.menu_date}
                onChange={
                  (event) => {
                    const newDate = event.target.value;
                    const newDateObject = {
                      ...state.newDate,
                      menu_date: newDate,
                    }
                    dispatch({ type: 'EDIT_NEW_MENU_DATE', payload: newDateObject });
                  }
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleAddDate}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={saveMenuTemplate}
          >
            Save Menu Date with Template
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={state.showCopyDate}
        onHide={toggleCopyDate}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Copy Menu </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Copy From Date
              </Form.Label>
                <Form.Control
                as="select"
                type="date"
                value={state.copyDate.date1}
                onChange={
                  (event) => {copyDate(event.target.value)
                    const copyToDate = event.target.value;
                    const newDateObject = {
                      ...state.copyDate,
                      date1: copyToDate,
                    }
                    dispatch({ type: 'COPY_FROM_MENU_DATE', payload: newDateObject });
                  }
                }
              >
                <option value="" hidden>Choose date</option>
                {
                  menuDates.map(
                    (date) => (
                      <option value={date.value} key={date.value}>
                        {date.display}
                      </option>
                    ),
                  )
                }
              </Form.Control>
              </Form.Group>
              <Form.Group>
              <Form.Label>
                Copy To Date
              </Form.Label>
              <Form.Control
                type="date"
                value={state.copyDate.date2}
                onChange={
                  (event) => {
                    const copyToDate = event.target.value;
                    const newDateObject = {
                      ...state.copyDate,
                      date2: copyToDate,
                    }
                    dispatch({ type: 'COPY_FROM_MENU_DATE', payload: newDateObject });
                  }
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleCopyDate}>
            Close
          </Button>
          <Button
            variant="primary"
            // this is where i will call the endpoint to copy over date1 -> date2
            onClick={
              () => {
                // YYYY-MM-DD seems to work for request parameter, no need to add HH:MM:SS
                const newDateObject = {
                  ...state.copyDate,
                  date1: state.copyDate.date1,
                  date2: state.copyDate.date2,
                };
              axios.post(`${API_URL}Copy_Menu`, newDateObject)
              .then((response) => {
                toggleCopyDate()
              })
            }
          }
          >
            Copy Menu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default withRouter(CreateMenu);
