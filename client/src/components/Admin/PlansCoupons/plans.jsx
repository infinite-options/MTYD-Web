import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { sortedArray } from '../../../reducers/helperFuncs';
import {
  Row, Col, Modal, Form, Button
} from 'react-bootstrap';
import {
  Table, TableHead, TableSortLabel, TableBody, TableRow, TableCell,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit, 
} from '@fortawesome/free-solid-svg-icons';

const initialState = {
  mealPlans: [],
  editingPlan: false,
  sortMealPlan: {
    field: '',
    direction: '',
  },
  editedPlan: {
    item_uid: '',
    item_desc: '',
    info_headline: '',
    payment_frequency: '',
    info_footer: '',
    item_photo: '',
    num_items: '',
    info_weekly_price: '',
    item_price: '',
    shipping: '',
  },
};

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_PLANS':
      return {
        ...state,
        mealPlans: action.payload,
      }
    case 'TOGGLE_EDIT_PLAN':
      return {
        ...state,
        editingPlan: !state.editingPlan,
        editedPlan: action.payload,
      }
    case 'EDIT_PLAN':
      return {
        ...state,
        editedPlan: action.payload,
      }
    case 'SORT_PLAN':
      return {
        ...state,
        sortMealPlan: {
          field: action.payload.field,
          direction: action.payload.direction,
        }
      }
    default:
      return state;
  }
}

function Plans() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleEditPlan = (initialPlan) => {
    dispatch({ type:'TOGGLE_EDIT_PLAN', payload: initialPlan})
  }

  const editPlan = (property, value) => {
    const newEditedPlan= {
      ...state.editedPlan,
      [property]: value,
    }
    dispatch({ type: 'EDIT_PLAN', payload: newEditedPlan});
  }

  const saveMealPlan = () => {
    axios
      .put(`${API_URL}Edit_Meal_Plan`,state.editedPlan)
      .then(() => {
        const planIndex = state.mealPlans.findIndex((plan) => plan.item_uid === state.editedPlan.item_uid);
        const newMealPlans = [...state.mealPlans];
        newMealPlans[planIndex] = state.editedPlan;
        dispatch({ type:'TOGGLE_EDIT_PLAN', payload: initialState.editedPlan})
        dispatch({ type: 'FETCH_PLANS', payload: newMealPlans});
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

  const changeSortOptions = (field) => {
    const isAsc = (state.sortMealPlan.field === field && state.sortMealPlan.direction === 'asc');
    const direction = isAsc ? 'desc' : 'asc';
    dispatch({
      type: 'SORT_PLAN',
      payload: {
        field: field,
        direction: direction
      }
    })
    const sortedPlan = sortedArray(state.mealPlans,field,direction);
    dispatch({ type: 'FETCH_PLANS', payload: sortedPlan});
  }

  // Fetch Plans
  useEffect(() => {
    axios
      .get(`${API_URL}plans`,{
        params: {
          business_uid: '200-000001'
        }
      })
      .then((response) => {
        const plansApiResult = response.data.result;
        // Convert property values to string and nulls to empty string
        for(let index = 0; index < plansApiResult.length; index++) {
          for (const property in plansApiResult[index]) {
            const value = plansApiResult[index][property];
            plansApiResult[index][property] = value !== null ? value : '';
          }
        }
        dispatch({ type: 'FETCH_PLANS', payload: plansApiResult});
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  },[]);

  return (
    <>
      <Row>
        <Col>
          <h5>
            Meal Plans
          </h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={state.sortMealPlan.field === 'item_desc'}
                    direction={state.sortMealPlan.field === 'item_desc' ? state.sortMealPlan.direction : 'asc'}
                    onClick={() => changeSortOptions('item_desc')}
                  >
                    Plan
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortMealPlan.field === 'info_headline'}
                    direction={state.sortMealPlan.field === 'info_headline' ? state.sortMealPlan.direction : 'asc'}
                    onClick={() => changeSortOptions('info_headline')}
                  >
                    Plan Description
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortMealPlan.field === 'payment_frequency'}
                    direction={state.sortMealPlan.field === 'payment_frequency' ? state.sortMealPlan.direction : 'asc'}
                    onClick={() => changeSortOptions('payment_frequency')}
                  >
                    Payment Frequency
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortMealPlan.field === 'info_footer'}
                    direction={state.sortMealPlan.field === 'info_footer' ? state.sortMealPlan.direction : 'asc'}
                    onClick={() => changeSortOptions('info_footer')}
                  >
                    In Short
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  Picture
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortMealPlan.field === 'num_items'}
                    direction={state.sortMealPlan.field === 'num_items' ? state.sortMealPlan.direction : 'asc'}
                    onClick={() => changeSortOptions('num_items')}
                  >
                    Number of Meals
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortMealPlan.field === 'info_weekly_price'}
                    direction={state.sortMealPlan.field === 'info_weekly_price' ? state.sortMealPlan.direction : 'asc'}
                    onClick={() => changeSortOptions('info_weekly_price')}
                  >
                    Weekly Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortMealPlan.field === 'item_price'}
                    direction={state.sortMealPlan.field === 'item_price' ? state.sortMealPlan.direction : 'asc'}
                    onClick={() => changeSortOptions('item_price')}
                  >
                    Plan Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortMealPlan.field === 'shipping'}
                    direction={state.sortMealPlan.field === 'shipping' ? state.sortMealPlan.direction : 'asc'}
                    onClick={() => changeSortOptions('shipping')}
                  >
                    Meal Shipping
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                state.mealPlans.map(
                  (mealPlan) => {
                    return (
                      <TableRow
                        key={mealPlan.item_uid}
                        hover
                      >
                        <TableCell> {mealPlan.item_desc} </TableCell>
                        <TableCell> {mealPlan.info_headline} </TableCell>
                        <TableCell> {mealPlan.payment_frequency} </TableCell>
                        <TableCell> {mealPlan.info_footer} </TableCell>
                        <TableCell>
                          <img
                            style={{
                              maxWidth: '200px',
                              height: 'auto',
                            }}
                            src={mealPlan.item_photo}
                            alt="Meal Plan Picture"
                          />
                        </TableCell>
                        <TableCell> {mealPlan.num_items} </TableCell>
                        <TableCell> {mealPlan.info_weekly_price} </TableCell>
                        <TableCell> {mealPlan.item_price} </TableCell>
                        <TableCell> {mealPlan.shipping} </TableCell>
                        <TableCell>
                          <button
                            className={'icon-button'}
                            onClick={
                              () => {
                                toggleEditPlan(mealPlan);
                              }
                            }
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                            />
                          </button>
                        </TableCell>
                      </TableRow>
                    )
                  }
                )
              }
            </TableBody>
          </Table>
        </Col>
      </Row>
      <Modal
        show={state.editingPlan}
        onHide={() => toggleEditPlan(initialState.editedPlan)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Edit Meal Plan </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label> Plan </Form.Label>
              <Form.Control
                value={state.editedPlan.item_desc}
                onChange={
                  (event) => {
                    editPlan('item_desc',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Plan Description </Form.Label>
              <Form.Control
                value={state.editedPlan.info_headline}
                onChange={
                  (event) => {
                    editPlan('info_headline',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Payment Frequency </Form.Label>
              <Form.Control
                value={state.editedPlan.payment_frequency}
                onChange={
                  (event) => {
                    editPlan('payment_frequency',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> In Short </Form.Label>
              <Form.Control
                value={state.editedPlan.info_footer}
                onChange={
                  (event) => {
                    editPlan('info_footer',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Picture URL </Form.Label>
              <Form.Control
                value={state.editedPlan.item_photo}
                onChange={
                  (event) => {
                    editPlan('item_photo',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Number of Meals </Form.Label>
              <Form.Control
                type='number'
                value={state.editedPlan.num_items}
                onChange={
                  (event) => {
                    editPlan('num_items',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Weekly Price </Form.Label>
              <Form.Control
                type='number'
                value={state.editedPlan.info_weekly_price}
                onChange={
                  (event) => {
                    editPlan('info_weekly_price',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Plan Price </Form.Label>
              <Form.Control
                type='number'
                value={state.editedPlan.item_price}
                onChange={
                  (event) => {
                    editPlan('item_price',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Meal Shipping </Form.Label>
              <Form.Control
                type='number'
                value={state.editedPlan.shipping}
                onChange={
                  (event) => {
                    editPlan('shipping',event.target.value);
                  }
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => toggleEditPlan(initialState.editedPlan)}
          >
            Close
          </Button>
          <Button
            variant="secondary"
            onClick={
              () => saveMealPlan()
            }
          >
            Save Meal Plan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Plans;