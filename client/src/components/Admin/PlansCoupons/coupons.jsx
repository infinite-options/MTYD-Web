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
  coupons: [],
  sortCoupon: {
    field: '',
    direction: '',
  },
  editingCoupon: false,
  editedCoupon: {
    coupon_uid: '',
    coupon_id: '',
    valid: 'TRUE',
    discount_percent: '',
    discount_amount: '',
    discount_shipping: '',
    expire_date: '',
    limits: '',
    notes: '',
    num_used: '0',
    recurring: 'F',
    email_id: '',
  },
};

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_COUPONS':
      return {
        ...state,
        coupons: action.payload,
      }
    case 'SORT_COUPON':
      return {
        ...state,
        sortCoupon: {
          field: action.payload.field,
          direction: action.payload.direction,
        }
      }
    case 'TOGGLE_EDIT_COUPON':
      return {
        ...state,
        editingCoupon: !state.editingCoupon,
        editedCoupon: action.payload,
      }
    case 'EDIT_COUPON':
      return {
        ...state,
        editedCoupon: action.payload,
      }
    default:
      return state;
  }
}

function Coupons() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleEditCoupon = (initialCoupon) => {
    const formattedCoupon = {
      ...initialCoupon,
      // Change expire_date to YYYY-MM-DD be able to use date input
      expire_date: initialCoupon.expire_date.slice(0,10),
      // Convert various numbers to strings
      discount_percent: initialCoupon.discount_percent.toString(),
      discount_amount: initialCoupon.discount_amount.toString(),
      discount_shipping: initialCoupon.discount_shipping.toString(),
      limits: initialCoupon.limits.toString(),
      num_used: initialCoupon.num_used.toString(),
    }
    dispatch({ type: 'TOGGLE_EDIT_COUPON', payload: formattedCoupon});
  }

  const editCoupon = (property, value) => {
    const newCoupon = {
      ...state.editedCoupon,
      [property]: value,
    }
    dispatch({ type: 'EDIT_COUPON', payload: newCoupon})
  }

  const saveCoupon = () => {
    if(state.editedCoupon.coupon_uid === '') {
      const formattedCoupon = {
        ...state.editedCoupon,
        cup_business_uid: "",
      }
      // Add New Coupon
      axios
        .post(`${API_URL}coupons`,formattedCoupon)
        .then((response) => {
          const couponUid = response.data.coupon_uid;
          formattedCoupon.coupon_uid = couponUid
          const newCoupons = [...state.coupons];
          newCoupons.push(formattedCoupon);
          dispatch({ type: 'FETCH_COUPONS', payload: newCoupons});
          dispatch({ type: 'TOGGLE_EDIT_COUPON', payload: initialState.editedCoupon});
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
    else {
      // Edited Coupon
      axios
        .put(`${API_URL}coupons`,state.editedCoupon)
        .then(() => {
          const couponIndex = state.coupons.findIndex((coupon) => coupon.coupon_uid === state.editedCoupon.coupon_uid);
          const newCoupons = [...state.coupons];
          newCoupons[couponIndex] = state.editedCoupon;
          dispatch({ type: 'FETCH_COUPONS', payload: newCoupons});
          dispatch({ type: 'TOGGLE_EDIT_COUPON', payload: initialState.editedCoupon});
          getCoupons();
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
  }

  const changeSortOptions = (field) => {
    const isAsc = (state.sortCoupon.field === field && state.sortCoupon.direction === 'asc');
    const direction = isAsc ? 'desc' : 'asc';
    dispatch({
      type: 'SORT_COUPON',
      payload: {
        field: field,
        direction: direction,
      }
    })
    const sortedCoupon = sortedArray(state.coupons,field,direction);
    dispatch({ type: 'FETCH_COUPONS', payload: sortedCoupon});
  }

  const getCoupons = () => {
    axios
      .get(`${API_URL}coupons`)
      .then((response) => {
        const couponsApiResult = response.data.result;
        // Convert property values to string and nulls to empty string
        for(let index = 0; index < couponsApiResult.length; index++) {
          for (const property in couponsApiResult[index]) {
            const value = couponsApiResult[index][property];
            couponsApiResult[index][property] = value !== null ? value : '';
          } 
        }
        dispatch({ type: 'FETCH_COUPONS', payload: couponsApiResult});
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

  // Fetch Coupons
  useEffect(() => {
    getCoupons();
  },[])

  return (
    <>
      <Row
        style={{
          marginTop: '4rem',
          marginBottom: '1rem',
        }}
      >
        <Col>
          <h5>
            Coupons
          </h5>
        </Col>
        <Col
          style={{
            textAlign: 'right'
          }}
        >
          <Button
            onClick={() => {toggleEditCoupon(initialState.editedCoupon)}}
          >
            Add New Coupon
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
                    active={state.sortCoupon.field === 'coupon_id'}
                    direction={state.sortCoupon.field === 'coupon_id' ? state.sortCoupon.direction : 'asc'}
                    onClick={() => changeSortOptions('coupon_id')}
                  >
                    Coupon ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortCoupon.field === 'valid'}
                    direction={state.sortCoupon.field === 'valid' ? state.sortCoupon.direction : 'asc'}
                    onClick={() => changeSortOptions('valid')}
                  >
                    Valid
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortCoupon.field === 'discount_percent'}
                    direction={state.sortCoupon.field === 'discount_percent' ? state.sortCoupon.direction : 'asc'}
                    onClick={() => changeSortOptions('discount_percent')}
                  >
                    Discount %
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortCoupon.field === 'discount_amount'}
                    direction={state.sortCoupon.field === 'discount_amount' ? state.sortCoupon.direction : 'asc'}
                    onClick={() => changeSortOptions('discount_percent')}
                  >
                    Discount Amonut
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortCoupon.field === 'discount_shipping'}
                    direction={state.sortCoupon.field === 'discount_shipping' ? state.sortCoupon.direction : 'asc'}
                    onClick={() => changeSortOptions('discount_shipping')}
                  >
                    Discount Shipping
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortCoupon.field === 'expire_date'}
                    direction={state.sortCoupon.field === 'expire_date' ? state.sortCoupon.direction : 'asc'}
                    onClick={() => changeSortOptions('expire_date')}
                  >
                    Expiration Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortCoupon.field === 'limits'}
                    direction={state.sortCoupon.field === 'limits' ? state.sortCoupon.direction : 'asc'}
                    onClick={() => changeSortOptions('limits')}
                  >
                    Limits
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortCoupon.field === 'num_used'}
                    direction={state.sortCoupon.field === 'num_used' ? state.sortCoupon.direction : 'asc'}
                    onClick={() => changeSortOptions('num_used')}
                  >
                    Number Used
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortCoupon.field === 'recurring'}
                    direction={state.sortCoupon.field === 'recurring' ? state.sortCoupon.direction : 'asc'}
                    onClick={() => changeSortOptions('recurring')}
                  >
                    Recurring
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={state.sortCoupon.field === 'email_id'}
                    direction={state.sortCoupon.field === 'email_id' ? state.sortCoupon.direction : 'asc'}
                    onClick={() => changeSortOptions('email_id')}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell> Action </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                state.coupons.map(
                  (coupon) => {
                    return (
                      <TableRow
                        key={coupon.coupon_uid}
                        hover
                      >
                        <TableCell> {coupon.coupon_id} </TableCell>
                        <TableCell> {coupon.valid} </TableCell>
                        <TableCell> {coupon.discount_percent} </TableCell>
                        <TableCell> {coupon.discount_amount} </TableCell>
                        <TableCell> {coupon.discount_shipping} </TableCell>
                        <TableCell> {coupon.expire_date} </TableCell>
                        <TableCell> {coupon.limits} </TableCell>
                        <TableCell> {coupon.notes} </TableCell>
                        <TableCell> {coupon.num_used} </TableCell>
                        <TableCell> {coupon.recurring} </TableCell>
                        <TableCell> {coupon.email_id} </TableCell>
                        <TableCell>
                          <button
                            className={'icon-button'}
                            onClick={() => {toggleEditCoupon(coupon)}}
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
        show={state.editingCoupon}
        onHide={() => toggleEditCoupon(initialState.editedCoupon)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Add/Edit Coupon </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label> Coupon ID </Form.Label>
              <Form.Control
                value={state.editedCoupon.coupon_id}
                onChange={
                  (event) => {
                    editCoupon('coupon_id',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Valid </Form.Label>
              <Form.Control
                as='select'
                value={state.editedCoupon.valid}
                onChange={
                  (event) => {
                    editCoupon('valid',event.target.value);
                  }
                }
              >
                <option value='' hidden> Choose True or False </option>
                <option value='TRUE'> True </option>
                <option value='FALSE'> False </option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label> Discount % </Form.Label>
              <Form.Control
                type='number'
                value={state.editedCoupon.discount_percent}
                onChange={
                  (event) => {
                    editCoupon('discount_percent',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Discount Amount </Form.Label>
              <Form.Control
                type='number'
                value={state.editedCoupon.discount_amount}
                onChange={
                  (event) => {
                    editCoupon('discount_amount',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Discount Shipping </Form.Label>
              <Form.Control
                type='number'
                value={state.editedCoupon.discount_shipping}
                onChange={
                  (event) => {
                    editCoupon('discount_shipping',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Expiration Date </Form.Label>
              <Form.Control
                type='date'
                value={state.editedCoupon.expire_date}
                onChange={
                  (event) => {
                    editCoupon('expire_date',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Limits </Form.Label>
              <Form.Control
                type='number'
                value={state.editedCoupon.limits}
                onChange={
                  (event) => {
                    editCoupon('limits',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Notes </Form.Label>
              <Form.Control
                value={state.editedCoupon.notes}
                onChange={
                  (event) => {
                    editCoupon('notes',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Used </Form.Label>
              <Form.Control
                type='number'
                value={state.editedCoupon.num_used}
                onChange={
                  (event) => {
                    editCoupon('num_used',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Recurring </Form.Label>
              <Form.Control
                as='select'
                value={state.editedCoupon.recurring}
                onChange={
                  (event) => {
                    editCoupon('recurring',event.target.value);
                  }
                }
              >
                <option value='' hidden> Choose True or False </option>
                <option value='T'> True </option>
                <option value='F'> False </option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label> Email </Form.Label>
              <Form.Control
                value={state.editedCoupon.email_id}
                onChange={
                  (event) => {
                    editCoupon('email_id',event.target.value);
                  }
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => toggleEditCoupon(initialState.editedCoupon)}
          >
            Close
          </Button>
          <Button
            variant="secondary"
            onClick={
              () => saveCoupon()
            }
          >
            Save Coupon
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Coupons;