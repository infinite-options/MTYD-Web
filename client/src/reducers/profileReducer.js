import {
    LOGOUT_PROFILE, FETCH_ORDER_HISTORY, FETCH_PROFILE, CHANGE_NEW_CITY, CHANGE_NEW_EMAIL, CHANGE_NEW_FIRST_NAME, CHANGE_NEW_LAST_NAME, CHANGE_NEW_PHONE,
    CHANGE_NEW_STATE, CHANGE_NEW_STREET, CHANGE_NEW_UNIT, CHANGE_NEW_ZIP, SUBMIT_PROFILE_CHANGES
} from "./actions/profileTypes";


const initialState = {
    orderHistory: [],
    profileInfo: [],
    newProfileInfo: {
        customerId: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        street: '',
        unit: '',
        city: '',
        state: '',
        zip: '',
        noti: '',
    }
}

export default function (state=initialState, action) {
    switch(action.type) {

        case LOGOUT_PROFILE:
            return initialState;

        case FETCH_ORDER_HISTORY:
            return {
                ...state,
                orderHistory: action.payload
            }
        case FETCH_PROFILE:
            return {
                ...state,
                profileInfo: action.payload
            }

        case CHANGE_NEW_FIRST_NAME:
            return {
                ...state,
                newProfileInfo: {
                    ...state.newProfileInfo,
                    firstName: action.payload,
                }
            }

        case CHANGE_NEW_LAST_NAME:
            return {
                ...state,
                newProfileInfo: {
                    ...state.newProfileInfo,
                    lastName: action.payload,
                }
            }

        case CHANGE_NEW_EMAIL:
            return {
                ...state,
                newProfileInfo: {
                    ...state.newProfileInfo,
                    email: action.payload,
                }
            }

        case CHANGE_NEW_PHONE:
            return {
                ...state,
                newProfileInfo: {
                    ...state.newProfileInfo,
                    phone: action.payload,
                }
            }

        case CHANGE_NEW_STREET:
            return {
                ...state,
                newProfileInfo: {
                    ...state.newProfileInfo,
                    address: action.payload,
                }
            }

        case CHANGE_NEW_UNIT:
            return {
                ...state,
                newProfileInfo: {
                    ...state.newProfileInfo,
                    unit: action.payload,
                }
            }

        case CHANGE_NEW_CITY:
            return {
                ...state,
                newProfileInfo: {
                    ...state.newProfileInfo,
                    city: action.payload
                }
            }

        case CHANGE_NEW_STATE:
            return {
                ...state,
                newProfileInfo: {
                    ...state.newProfileInfo,
                    state: action.payload
                }
            }

        case CHANGE_NEW_ZIP:
            return {
                ...state,
                newProfileInfo: {
                    ...state.newProfileInfo,
                    zip: action.payload
                }
            }
    
        case SUBMIT_PROFILE_CHANGES:
            return {
                ...state,
                newProfileInfo: {
                    ...state.newUserInfo,
                    email: action.payload.email,
                    platform: action.payload.platform,
                    accessToken: action.payload.accessToken,
                    refreshToken: action.payload.refreshToken,
                }
            }
        
        default:
            return state;
        
    }
}