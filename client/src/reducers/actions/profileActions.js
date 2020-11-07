import axios from 'axios';

import {
    LOGOUT_PROFILE, FETCH_ORDER_HISTORY, FETCH_PROFILE, CHANGE_NEW_CITY, CHANGE_NEW_EMAIL, CHANGE_NEW_FIRST_NAME, CHANGE_NEW_LAST_NAME, CHANGE_NEW_PHONE,
    CHANGE_NEW_STATE, CHANGE_NEW_STREET, CHANGE_NEW_UNIT, CHANGE_NEW_ZIP, SUBMIT_PROFILE_CHANGES
} from './profileTypes';

import { API_URL } from '../constants'

export const resetProfile = () => dispatch => {
    dispatch({
        type: LOGOUT_PROFILE,
    })
}

export const changeNewEmail = (newEmail) => dispatch => {
    dispatch({
        type: CHANGE_NEW_EMAIL,
        payload: newEmail,
    })
}

export const changeNewFirstName = (newfirstName) => dispatch => {
    dispatch({
        type: CHANGE_NEW_FIRST_NAME,
        payload: newfirstName,
    })
}

export const changeNewLastName = (newLastName) => dispatch => {
    dispatch({
        type: CHANGE_NEW_LAST_NAME,
        payload: newLastName,
    })
}

export const changeNewPhone = (newPhone) => dispatch => {
    dispatch({
        type: CHANGE_NEW_PHONE,
        payload: newPhone,
    })
}

export const changeNewAddress = (newAddress) => dispatch => {
    dispatch({
        type: CHANGE_NEW_STREET,
        payload: newAddress,
    })
}

export const changeNewUnit = (newUnit) => dispatch => {
    dispatch({
        type: CHANGE_NEW_UNIT,
        payload: newUnit,
    })
}

export const changeNewCity = (newCity) => dispatch => {
    dispatch({
        type: CHANGE_NEW_CITY,
        payload: newCity
    })
}

export const changeNewState = (newState) => dispatch => {
    dispatch({
        type: CHANGE_NEW_STATE,
        payload: newState,
    })
}

export const changeNewZip = (newZip) => dispatch => {
    dispatch({
        type: CHANGE_NEW_ZIP,
        payload: newZip,
    })
}

export const fetchOrderHistory = (customer_uid) => dispatch => {
    // Change 100-000001 to other customers when log in implemented
    axios
        // .get(API_URL + 'meals_selected?customer_uid=100-000001')
        .get(API_URL + 'customer_lplp',{
            params: {
                customer_uid: customer_uid,
            }
        })
        .then((res) => {
            console.log(res.data.result);
            dispatch({
                type: FETCH_ORDER_HISTORY,
                payload: res.data.result,
            })
        })
        .catch((err) => {
            console.log(err);
        })

}

export const fetchProfile = () => dispatch => {
    axios
        .get(API_URL + 'Profile/100-000082')
        /*
        .get(API_URL + 'Profile',{
            params: {
                customer_uid: customer_uid,
            }
        })
        */
        .then((res) => {
            console.log(res.data.result);
            dispatch({
                type: FETCH_PROFILE,
                payload: res.data.result[0],
            })
        })
        .catch((err) => {
            console.log(err);
        })

}

export const submitnewProfile = (
    customerId, email, firstName, lastName, phone,
    street, unit, city, state, zip, callback
) => dispatch => {
    let object = {
        uid:customerId,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        email: email,
        street: street,
        unit: unit,
        city: city,
        state: state,
        zip: zip,
        noti: "false"
    }

    axios
    .post(API_URL+'UpdateProfile',object)
    .then((res) => {
        console.log(res);
        dispatch({
            type: SUBMIT_PROFILE_CHANGES,
        })
        /*
        if(typeof callback !== 'undefined') {
            callback();
        }
        */
    })
    .catch((err) => {
        console.log(err);
        if(err.response) {
            console.log(err.response);
        }
    })
   
}




