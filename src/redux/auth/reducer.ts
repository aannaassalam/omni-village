import {
  REQ_SUCCESS,
  LOGOUT,
  LAND_MEASUREMENT,
  WEIGHT_MESUREMENT,
} from './actionTypes';

const initialState = {
  isLoggedIn: false,
  token: null,
    _id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  gender: '',
  address: '',
  country: '',
  country_code: '',
  currency: '',
  document_type: '',
  social_security_number: '',
  village_name: '',
  village_governing_body: false,
  street_address: '',
  land_measurement: '',
  land_measurement_symbol: '',
  members: '',
  number_of_members: '',
  total_land: '',
  sub_area: '',
  land_measurements: [],
  weight_measurements: [],
};

const authReducer = (
  state = initialState,
  action: {
    token:any;
    _id: any;
    first_name: any;
    last_name: any;
    email: any;
    phone: any;
    gender: any;
    address: any;
    country: any;
    country_code: any;
    currency: any;
    document_type: any;
    social_security_number: any;
    village_name: any;
    village_governing_body: any;
    street_address: any;
    land_measurement: any;
    land_measurement_symbol: any;
    members: any;
    number_of_members: any;
    total_land: any;
    sub_area: any;
    data: any;
    type: any;
  },
) => {
  switch (action.type) {
    case REQ_SUCCESS: {
      return {
        ...state,
        isLoggedIn: true,
        token: action?.token,
        id: action?._id,
        first_name: action?.first_name,
        last_name: action?.last_name,
        email: action?.email,
        phone: action?.phone,
        gender: action?.gender,
        address: action?.address,
        country: action?.country,
        country_code: action?.country_code,
        currency: action?.currency,
        document_type: action?.document_type,
        social_security_number: action?.social_security_number,
        village_name: action?.village_name,
        village_governing_body: action?.village_governing_body,
        street_address: action?.street_address,
        land_measurement: action?.land_measurement,
        land_measurement_symbol: action?.land_measurement_symbol,
        members: action?.members,
        number_of_members: action?.number_of_members,
        total_land: action?.total_land,
        sub_area: action?.sub_area,
      };
    }
    case LAND_MEASUREMENT: {
      const arr =
        action?.data?.length > 0
          ? action?.data?.map((data: ' ') => {
              return {id: data._id, label: data.name, value: data?.symbol};
            })
          : [];
      return {
        ...state,
        land_measurements: arr,
      };
    }
    case WEIGHT_MESUREMENT: {
      const arr =
        action?.data.length > 0
          ? action?.data?.map((data: ' ') => {
              return {id: data._id, label: data.name, value: data?.symbol};
            })
          : [];
      return {
        ...state,
        weight_measurements: arr,
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
