import { useContext, useEffect, useReducer } from 'react';
import { CustomerContext } from './customerContext';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { sortedArray } from '../../../reducers/helperFuncs';
import {
  Table, TableHead, TableSortLabel, TableBody, TableRow, TableCell
} from '@material-ui/core';

const initialState = {
  customerActivity: [],
  sortActivity: {
    field: '',
    direction: '',
  },
}

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_CUSTOMER_ACTIVITY':
      return {
        ...state,
        customerActivity: action.payload,
      }
    case 'SORT_CUSTOMER':
      return {
        ...state,
        sortActivity: {
          field: action.payload.field,
          direction: action.payload.direction,
        }
      }
    default:
      return state
  }
}

function LatestActivity() {
  const customerContext = useContext(CustomerContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if(customerContext.state.customerId !== '') {
      axios
        .get(`${API_URL}customer_lplp`,{
          params: {
            customer_uid: customerContext.state.customerId
          }
        })
        .then((response) => {
          const customerActivity = response.data.result;
          if(customerActivity) {
            // Parse JSON object in items
            for(let index = 0; index < customerActivity.length; index++) {
              customerActivity[index].items = JSON.parse(customerActivity[index].items);
            }
            dispatch({ type: 'FETCH_CUSTOMER_ACTIVITY', payload: customerActivity });
          } else {
            dispatch({ type: 'FETCH_CUSTOMER_ACTIVITY', payload: initialState.customerActivity });
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
  },[customerContext.state.customerId])

  const changeSortOptions = (field) => {
    const isAsc = (state.sortActivity.field === field && state.sortActivity.direction === 'asc');
    const direction = isAsc ? 'desc' : 'asc';
    dispatch({
      type: 'SORT_CUSTOMER',
      payload: {
        field: field,
        direction: direction,
      }
    })
    const sortedActivity = sortedArray(state.customerActivity, field, direction);
    dispatch({ type: 'FETCH_CUSTOMER_ACTIVITY', payload: sortedActivity})
  }

  const selectPurchase = (activity) => {
    const payload = {
      purchaseId: activity.purchase_uid,
      paymentId: activity.payment_uid,
    }
    customerContext.dispatch({ type: 'SELECT_PURCHASE', payload: payload });
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Email
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortActivity.field === 'customer_phone_num'}
                direction={state.sortActivity.field === 'customer_phone_num' ? state.sortActivity.direction : 'asc'}
                onClick={() => changeSortOptions('customer_phone_num')}
              >
                Phone
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortActivity.field === 'purchase_uid'}
                direction={state.sortActivity.field === 'purchase_uid' ? state.sortActivity.direction : 'asc'}
                onClick={() => changeSortOptions('purchase_uid')}
              >
                Purchase Id
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortActivity.field === 'purchase_status'}
                direction={state.sortActivity.field === 'purchase_status' ? state.sortActivity.direction : 'asc'}
                onClick={() => changeSortOptions('purchase_status')}
              >
                Purchase Status
              </TableSortLabel>
            </TableCell>
            <TableCell>
              Meal Plan ID
            </TableCell>
            <TableCell>
              Meal Plan Description
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortActivity.field === 'delivery_first_name'}
                direction={state.sortActivity.field === 'delivery_first_name' ? state.sortActivity.direction : 'asc'}
                onClick={() => changeSortOptions('delivery_first_name')}
              >
                Delivery First Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortActivity.field === 'delivery_last_name'}
                direction={state.sortActivity.field === 'delivery_last_name' ? state.sortActivity.direction : 'asc'}
                onClick={() => changeSortOptions('delivery_last_name')}
              >
                Delivery Last Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortActivity.field === 'delivery_phone_num'}
                direction={state.sortActivity.field === 'delivery_phone_num' ? state.sortActivity.direction : 'asc'}
                onClick={() => changeSortOptions('delivery_phone_num')}
              >
                Delivery Phone
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortActivity.field === 'payment_uid'}
                direction={state.sortActivity.field === 'payment_uid' ? state.sortActivity.direction : 'asc'}
                onClick={() => changeSortOptions('payment_uid')}
              >
                Payment Id
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortActivity.field === 'pay_coupon_id'}
                direction={state.sortActivity.field === 'pay_coupon_id' ? state.sortActivity.direction : 'asc'}
                onClick={() => changeSortOptions('pay_coupon_id')}
              >
                Coupon
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortActivity.field === 'amount_due'}
                direction={state.sortActivity.field === 'amount_due' ? state.sortActivity.direction : 'asc'}
                onClick={() => changeSortOptions('amount_due')}
              >
                Amount Due
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortActivity.field === 'amount_paid'}
                direction={state.sortActivity.field === 'amount_paid' ? state.sortActivity.direction : 'asc'}
                onClick={() => changeSortOptions('amount_paid')}
              >
                Amount Paid
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortActivity.field === 'payment_time_stamp'}
                direction={state.sortActivity.field === 'payment_time_stamp' ? state.sortActivity.direction : 'asc'}
                onClick={() => changeSortOptions('payment_time_stamp')}
              >
                Time Paid
              </TableSortLabel>
            </TableCell>
            <TableCell> Credit Card </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            state.customerActivity.map(
              (activity) => {
                return (
                  <TableRow
                    key={activity.purchase_uid}
                    hover
                    onClick={() => {selectPurchase(activity)}}
                    selected={customerContext.state.purchaseId === activity.purchase_uid}
                  >
                    <TableCell> {activity.customer_email} </TableCell>
                    <TableCell> {activity.customer_phone_num} </TableCell>
                    <TableCell> {activity.purchase_uid} </TableCell>
                    <TableCell> {activity.purchase_status} </TableCell>
                    <TableCell> {activity.items[0].item_uid} </TableCell>
                    <TableCell> {activity.items[0].name} </TableCell>
                    <TableCell> {activity.delivery_first_name} </TableCell>
                    <TableCell> {activity.delivery_last_name} </TableCell>
                    <TableCell> {activity.delivery_phone_num} </TableCell>
                    <TableCell> {activity.payment_uid} </TableCell>
                    <TableCell> {activity.pay_coupon_id} </TableCell>
                    <TableCell> {activity.amount_due} </TableCell>
                    <TableCell> {activity.amount_paid} </TableCell>
                    <TableCell> {activity.payment_time_stamp} </TableCell>
                    <TableCell> {activity.cc_num} </TableCell>
                  </TableRow>
                )
              }
            )
          }
        </TableBody>
      </Table>
    </>
  );
}

export default LatestActivity;