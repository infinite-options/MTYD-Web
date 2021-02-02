import { useContext, useEffect, useReducer } from 'react';
import { CustomerContext } from './customerContext';
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import { sortedArray } from '../../../reducers/helperFuncs';
import PropTypes from 'prop-types';
import {
  Table, TableHead, TableSortLabel, TableBody, TableRow, TableCell
} from '@material-ui/core';

function MealSelectionRow ({data}) {
  const numItems = data['group_concat(jt_name)'].length;
  const mealSelectionRows = [];
  for (let itemIndex=0; itemIndex < numItems; itemIndex++) {
    mealSelectionRows.push(
      <TableRow
        hover
      >
        <TableCell> {data.d_menu_date} </TableCell>
        <TableCell> {data['group_concat(jt_name)'][itemIndex]} </TableCell>
        <TableCell> {data['group_concat(jt_qty)'][itemIndex]} </TableCell>
      </TableRow>
    )
  }
  return (
    <>
      {mealSelectionRows}
    </>
  )
}

MealSelectionRow.propTypes = {
  data: PropTypes.object,
}

const initialState = {
  mealSelections: [],
  sortSelections: {
    field: '',
    direction: '',
  },
}

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_MEAL_SELECTIONS':
      return {
        ...state,
        mealSelections: action.payload,
      }
    case 'SORT_SELECTION':
      return {
        ...state,
        sortSelections: {
          field: action.payload.field,
          direction: action.payload.direction,
        }
      }
    default:
      return state
  }
}

function WeeklyMealSelections() {
  const customerContext = useContext(CustomerContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if(customerContext.state.purchaseId !== '') {
      axios
        .get(`${API_URL}Orders_by_Purchase_Id_with_Pid/${customerContext.state.purchaseId}`)
        .then((response) => {
          const mealSelections = response.data.result;
          // Parse Json object in sub properties
          for(let index = 0; index < mealSelections.length; index++) {
            // Convert name and qty to lists
            const nameList = mealSelections[index]['group_concat(jt_name)']
            const qtyList = mealSelections[index]['group_concat(jt_qty)']
            if(nameList !== 'SKIP') {
              mealSelections[index]['group_concat(jt_name)'] = nameList.split(',');
              mealSelections[index]['group_concat(jt_qty)'] = qtyList.split(',');
            } else {
              mealSelections[index]['group_concat(jt_name)'] = ['SKIP'];
              mealSelections[index]['group_concat(jt_qty)'] = ['N/A'];
            }
          }
          dispatch({ type: 'FETCH_MEAL_SELECTIONS', payload: mealSelections });
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
    const isAsc = (state.sortSelections.field === field && state.sortSelections.direction === 'asc');
    const direction = isAsc ? 'desc' : 'asc';
    dispatch({
      type: 'SORT_SELECTION',
      payload: {
        field: field,
        direction: direction,
      }
    })
    const sortedPayment = sortedArray(state.mealSelections, field, direction);
    dispatch({ type: 'FETCH_MEAL_SELECTIONS', payload: sortedPayment})
  }

  return (
    <>
      <h5> Weekly Meal Selections </h5>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={state.sortSelections.field === 'd_menu_date'}
                direction={state.sortSelections.field === 'd_menu_date' ? state.sortSelections.direction : 'asc'}
                onClick={() => changeSortOptions('d_menu_date')}
              >
                Menu Day
              </TableSortLabel>
            </TableCell>
            <TableCell>
              Meal Name
            </TableCell>
            <TableCell>
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            state.mealSelections.map(
              (mealSelection,mealSelectionIndex) => {
                return (
                  <MealSelectionRow key={mealSelectionIndex} data={mealSelection}/>
                )
              }
            )
          }
        </TableBody>
      </Table>
    </>
  )
}

export default WeeklyMealSelections;