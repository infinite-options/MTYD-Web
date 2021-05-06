import {
  LOGOUT_SUBSCRIPTION,
  FETCH_PLAN_INFO,
  CHOOSE_MEALS_EACH_DELIVERY,
  CHOOSE_PAYMENT_OPTION,
  GET_TOTAL_PAYMENT,
  CHANGE_DELIVERY_DETAILS,
  CHANGE_PAYMENT_DETAILS,
  CHANGE_CONTACT_DETAILS,
  CHANGE_ADDRESS_FIRST_NAME,
  CHANGE_ADDRESS_LAST_NAME,
  CHANGE_ADDRESS_EMAIL,
  CHANGE_ADDRESS_STREET,
  FETCH_PROFILE_INFO,
  CHANGE_ADDRESS_UNIT,
  CHANGE_ADDRESS_CITY,
  CHANGE_ADDRESS_STATE,
  CHANGE_ADDRESS_ZIP,
  CHANGE_ADDRESS_PHONE,
  CHANGE_DELIVERY_INSTRUCTIONS,
  CHANGE_PAYMENT_PASSWORD,
  CHANGE_CARD_NUMBER,
  CHANGE_CARD_CVV,
  CHANGE_CARD_ZIP,
  CHANGE_CARD_MONTH,
  CHANGE_CARD_YEAR,
  FETCH_SUBSCRIBED_INFO,
  ADD_ERROR,
  SET_CURRENT_MEAL,
  SET_SELECTED_PLAN,
  RESET_USER_INFO,
  SET_MEALS,
  SET_PAYMENT_OPTIONS,
  SET_CURRENT_PURCHASE
} from "./actions/subscriptionTypes";

const initialState = {
  profile: {
    email: "",
    socialMedia: "",
    customerId: ""
  },
  plans: {},
  numItems: [],
  paymentFrequency: [],
  currentMeal: {},
  currentPurchase: "",
  selectedPlan: {},
  meals: "",
  paymentOption: "",
  addressInfo: {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: ""
  },
  address: {
    street: "",
    unit: "",
    city: "",
    state: "",
    zip: ""
  },
  creditCard: {
    name: "",
    number: "",
    cvv: "",
    zip: "",
    month: "",
    year: ""
  },
  subscribedPlans: [],
  deliveryInstructions: "",
  paymentPassword: "",
  errors: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGOUT_SUBSCRIPTION:
      return initialState;

    case FETCH_PLAN_INFO:
      return {
        ...state,
        plans: action.payload.items,
        numItems: action.payload.numItems,
        paymentFrequency: action.payload.paymentFrequency
      };

    case CHOOSE_MEALS_EACH_DELIVERY:
      return {
        ...state,
        meals: action.payload
      };

    case CHOOSE_PAYMENT_OPTION:
      return {
        ...state,
        paymentOption: action.payload
      };

    case GET_TOTAL_PAYMENT:
      return {
        ...state,
        selectedPlan: action.payload
      };

    case FETCH_PROFILE_INFO:
      return {
        ...state,
        profile: {
          ...state.profile,
          email: action.payload.email,
          socialMedia: action.payload.socialMedia,
          customerId: action.payload.customerId
        }
      };
    case CHANGE_DELIVERY_DETAILS:
      return {
        ...state,
        address: {
          ...state.address,
          street: action.payload.street,
          unit: action.payload.unit,
          city: action.payload.city,
          state: action.payload.state,
          zip: action.payload.zip
        },
        deliveryInstructions: action.payload.instructions
      };  
          
    case CHANGE_PAYMENT_DETAILS:
      return {
        ...state,
        creditCard: {
          ...state.creditCard,
          name: action.payload.name,
          number: action.payload.number,
          month: action.payload.month,
          year: action.payload.year,
          cvv: action.payload.cvv,
          zip: action.payload.zip
        }
      };
    case CHANGE_CONTACT_DETAILS:
      //console.log("new email: " + action.payload.email);
      return {
        ...state,
        addressInfo: {
          ...state.addressInfo,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          phoneNumber: action.payload.phone,
          email: action.payload.email
        }
      };
    case CHANGE_ADDRESS_FIRST_NAME:
      return {
        ...state,
        addressInfo: {
          ...state.addressInfo,
          firstName: action.payload
        }
      };
    case CHANGE_ADDRESS_LAST_NAME:
      return {
        ...state,
        addressInfo: {
          ...state.addressInfo,
          lastName: action.payload
        }
      };
    case CHANGE_ADDRESS_EMAIL:
      return {
        ...state,
        addressInfo: {
          ...state.addressInfo,
          email: action.payload
        }
      };
    case CHANGE_ADDRESS_STREET:
      return {
        ...state,
        address: {
          ...state.address,
          street: action.payload
        }
      };

    case CHANGE_ADDRESS_UNIT:
      return {
        ...state,
        address: {
          ...state.address,
          unit: action.payload
        }
      };

    case CHANGE_ADDRESS_CITY:
      return {
        ...state,
        address: {
          ...state.address,
          city: action.payload
        }
      };

    case CHANGE_ADDRESS_STATE:
      return {
        ...state,
        address: {
          ...state.address,
          state: action.payload
        }
      };

    case CHANGE_ADDRESS_ZIP:
      return {
        ...state,
        address: {
          ...state.address,
          zip: action.payload
        }
      };

    case CHANGE_ADDRESS_PHONE:
      return {
        ...state,
        addressInfo: {
          ...state.addressInfo,
          phoneNumber: action.payload
        }
      };

    case CHANGE_DELIVERY_INSTRUCTIONS:
      return {
        ...state,
        deliveryInstructions: action.payload
      };

    case CHANGE_PAYMENT_PASSWORD:
      return {
        ...state,
        paymentPassword: action.payload
      };
    case CHANGE_CARD_ZIP:
      return {
        ...state,
        creditCard: {
          ...state.creditCard,
          zip: action.payload
        }
      };
    case CHANGE_CARD_NUMBER:
      return {
        ...state,
        creditCard: {
          ...state.creditCard,
          number: action.payload
        }
      };

    case CHANGE_CARD_CVV:
      return {
        ...state,
        creditCard: {
          ...state.creditCard,
          cvv: action.payload
        }
      };
    case CHANGE_CARD_MONTH:
      return {
        ...state,
        creditCard: {
          ...state.creditCard,
          month: action.payload
        }
      };
    case CHANGE_CARD_YEAR:
      return {
        ...state,
        creditCard: {
          ...state.creditCard,
          year: action.payload
        }
      };
    case RESET_USER_INFO:
      return {
        ...state,
        addressInfo: {
          firstName: "",
          lastName: "",
          phoneNumber: ""
        },
        address: {
          street: "",
          unit: "",
          city: "",
          state: "",
          zip: ""
        },
        creditCard: {
          number: "",
          cvv: "",
          zip: "",
          month: "",
          year: ""
        }
      };

    case SET_CURRENT_MEAL:
      return {
        ...state,
        currentMeal: action.payload
      };
    case SET_SELECTED_PLAN: {
      return {
        ...state,
        selectedPlan: action.payload
      };
    }
    case SET_MEALS:
      return {
        ...state,
        meals: action.payload
      };
    case SET_PAYMENT_OPTIONS:
      return {
        ...state,
        paymentOption: action.payload
      };
    case SET_CURRENT_PURCHASE:
      return {
        ...state,
        currentPurchase: action.payload
      };
    case ADD_ERROR:
      return {
        ...state,
        errors: action.payload
      };
    case FETCH_SUBSCRIBED_INFO:
      //console.log("FETCH_SUBSCRIBED_INFO payload: " + JSON.stringify(action.payload));
      return {
        ...state,
        subscribedPlans: action.payload
      };

    default:
      return state;
  }
}
