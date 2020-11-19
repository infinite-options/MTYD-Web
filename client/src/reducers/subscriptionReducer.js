import {
  LOGOUT_SUBSCRIPTION,
  FETCH_PLAN_INFO,
  CHOOSE_MEALS_EACH_DELIVERY,
  CHOOSE_PAYMENT_OPTION,
  GET_TOTAL_PAYMENT,
  CHANGE_ADDRESS_FIRST_NAME,
  CHANGE_ADDRESS_LAST_NAME,
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
  SUBMIT_PAYMENT
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
  selectedPlan: {},
  meals: "",
  paymentOption: "",
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
  },
  deliveryInstructions: "",
  paymentPassword: ""
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
    default:
      return state;
  }
}
