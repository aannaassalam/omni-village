import {
  REQ_SUCCESS,
  LOGOUT,
} from './actionTypes';

const initialState = {
  isLoggedIn: false,
  token: null,
  id:'',
  full_name: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  app_notification_on: '',
};

const authReducer = (state = initialState, action: {
  token: any;
  id: any;
  full_name: any;
  email: any;
  phone: any;
  dob: any;
  gender: any;
  app_notification_on: any; type: any; 
}) => {
  switch (action.type) {
    case REQ_SUCCESS: {
      return {
        ...state,
        isLoggedIn: true,
        token: action.token,
        id: action.id,
        full_name: action.full_name,
        email: action.email,
        phone: action.phone,
        dob: action.dob,
        gender: action.gender,
        app_notification_on: action.app_notification_on,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isLoggedIn: false,
      };
    }
    default:
      return state;
  }
};

export default authReducer;
