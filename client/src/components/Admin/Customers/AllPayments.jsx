import { useContext, useEffect, useReducer } from 'react';
import { CustomerContext } from './customerContext';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { sortedArray } from '../../../reducers/helperFuncs';
import {
  Table, TableHead, TableSortLabel, TableBody, TableRow, TableCell
} from '@material-ui/core';

const initialState = {
  payments: [],
  sortPayment: {
    field: '',
    direction: '',
  }
}

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_PAYMENTS':
      return {
        ...state,
        payments: action.payload,
      }
    case 'SORT_PAYMENTS':
      return {
        ...state,
        sortPayment: {
          field: '',
          direction: '',
        }
      }
    default:
      return state
  }
}

function AllPayments() {
  const customerContext = useContext(CustomerContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if(customerContext.state.purchaseId !== '') {
      axios
        .get(`${API_URL}payment_info_history/${customerContext.state.purchaseId}`)
        .then((response) => {
          const paymentInfo = response.data.result;
          // Parse Json object in items
          for(let index = 0; index < paymentInfo.length; index++) {
            paymentInfo[index].items = JSON.parse(paymentInfo[index].items)
          }
          dispatch({ type: 'FETCH_PAYMENTS', payload: paymentInfo});
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
  },[customerContext.state.purchaseId])

  const changeSortOptions = (field) => {
    const isAsc = (state.sortPayment.field === field && state.sortPayment.direction === 'asc');
    const direction = isAsc ? 'desc' : 'asc';
    dispatch({
      type: 'SORT_PAYMENTS',
      payload: {
        field: field,
        direction: direction,
      }
    })
    const sortedPayment = sortedArray(state.payments, field, direction);
    dispatch({ type: 'FETCH_PAYMENTS', payload: sortedPayment})
  }

  return (
    <>
      <h5> All Payments </h5>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={state.sortPayment.field === 'payment_uid'}
                direction={state.sortPayment.field === 'payment_uid' ? state.sortPayment.direction : 'asc'}
                onClick={() => changeSortOptions('payment_uid')}
              >
                Payment Id
              </TableSortLabel>
            </TableCell>
            <TableCell> Meal Plan Description </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortPayment.field === 'amount_due'}
                direction={state.sortPayment.field === 'amount_due' ? state.sortPayment.direction : 'asc'}
                onClick={() => changeSortOptions('amount_due')}
              >
                Amount Due
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortPayment.field === 'amount_paid'}
                direction={state.sortPayment.field === 'amount_paid' ? state.sortPayment.direction : 'asc'}
                onClick={() => changeSortOptions('amount_paid')}
              >
                Amount Paid
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortPayment.field === 'payment_time_stamp'}
                direction={state.sortPayment.field === 'payment_time_stamp' ? state.sortPayment.direction : 'asc'}
                onClick={() => changeSortOptions('payment_time_stamp')}
              >
                Payment Time Stamp
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortPayment.field === 'payment_type'}
                direction={state.sortPayment.field === 'payment_type' ? state.sortPayment.direction : 'asc'}
                onClick={() => changeSortOptions('payment_type')}
              >
                Payment Type
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={state.sortPayment.field === 'info_is_Addon'}
                direction={state.sortPayment.field === 'info_is_Addon' ? state.sortPayment.direction : 'asc'}
                onClick={() => changeSortOptions('info_is_Addon')}
              >
                Addon
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            state.payments.map(
              (payment) => {
                return (
                  <TableRow
                    key={payment.payment_uid}
                    hover
                  >
                    <TableCell> {payment.payment_uid} </TableCell>
                    <TableCell> {payment.items[0].name} </TableCell>
                    <TableCell> {payment.amount_due} </TableCell>
                    <TableCell> {payment.amount_paid} </TableCell>
                    <TableCell> {payment.payment_time_stamp} </TableCell>
                    <TableCell> {payment.payment_type} </TableCell>
                    <TableCell> {payment.info_is_Addon} </TableCell>
                  </TableRow>
                )
              }
            )
          }
        </TableBody>
      </Table>
    </>
  )
}

export default AllPayments;