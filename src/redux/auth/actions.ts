import { get_user_details } from '../../apis/auth';
import {
  REQ,
  REQ_SUCCESS,
  SET_NEW_AUTH_TOKEN,
  REQ_FAILURE,
  LOGOUT,
  NET_CHECK,
  FOLLOWING,
  LAND_MEASUREMENT,
  WEIGHT_MESUREMENT,
} from './actionTypes';
import EncryptedStorage from 'react-native-encrypted-storage';

export const reqSuccess = (
  token:any,
  _id: any,
  first_name: any,
  last_name: any,
  email: any,
  phone: any,
  gender: any,
  address: any,
  country: any,
  country_code: any,
  currency: any,
  document_type: any,
  social_security_number: any,
  village_name: any,
  village_governing_body: any,
  street_address: any,
  land_measurement: any,
  land_measurement_symbol: any,
  members: any,
  number_of_members: any,
  total_land: any,
  sub_area: any,
) => ({
  type: REQ_SUCCESS,
  token,
  _id,
  first_name,
  last_name,
  email,
  phone,
  gender,
  address,
  country,
  country_code,
  currency,
  document_type,
  social_security_number,
  village_name,
  village_governing_body,
  street_address,
  land_measurement,
  land_measurement_symbol,
  members,
  number_of_members,
  total_land,
  sub_area,
});
export const land = (data: any) => ({
  type: LAND_MEASUREMENT,
  data
});
export const weight = (data: any) => ({
  type: WEIGHT_MESUREMENT,
  data,
});
export const reqFailure = (error: any) => ({
  type: REQ_FAILURE,
  error: error,
});
export const logout = () => ({type: LOGOUT});

export const tokenRetriever = () => {
  return async (dispatch: any) => {
    try {
      const userData = await EncryptedStorage.getItem('omniVillageToken');
      console.log('userDataaaaaa', userData);
      const loggedData = userData != null ? JSON.parse(userData) : null;
      if (loggedData != null) {
        dispatch(
          reqSuccess(
            loggedData?.token,
            loggedData?._id,
            loggedData?.first_name,
            loggedData?.last_name,
            loggedData?.email,
            loggedData?.phone,
            loggedData?.gender,
            loggedData?.address,
            loggedData?.country,
            loggedData?.country_code,
            loggedData?.currency,
            loggedData?.document_type,
            loggedData?.social_security_number,
            loggedData?.village_name,
            loggedData?.village_governing_body,
            loggedData?.street_address,
            loggedData?.land_measurement,
            loggedData?.land_measurement_symbol,
            loggedData?.members,
            loggedData?.number_of_members,
            loggedData?.total_land,
            loggedData?.sub_area,
          ),
        );
        get_user_details()
          .then(profile => {
            console.log("profileee", profile)
            // if (res?.data?.sucess) {
              dispatch(
                reqSuccess(
                  loggedData?.token,
                  profile?._id,
                  profile?.first_name,
                  profile?.last_name,
                  profile?.email,
                  profile?.phone,
                  profile?.gender,
                  profile?.address,
                  profile?.country,
                  profile?.country_code,
                  profile?.currency,
                  profile?.document_type,
                  profile?.social_security_number,
                  profile?.village_name,
                  profile?.village_governing_body,
                  profile?.street_address,
                  profile?.land_measurement,
                  profile?.land_measurement_symbol,
                  profile?.members,
                  profile?.number_of_members,
                  profile?.total_land,
                  profile?.sub_area,
                ),
              );
            // }
          })
          .catch(err => {
            dispatch(logUserOut())
            dispatch(reqFailure(err?.message ?? 'No error message'));
          });
        // dispatch(getUserDetails(loggedData?.token, notificationToken, null));
      }
    } catch (err) {
      console.log(
        'token retriever error: ',
        err?.message ?? 'No error message',
      );
      dispatch(reqFailure(err?.message ?? 'No error message'));
    }
  };
};

export const logUserOut = () => {
  return async (dispatch: any) => {
    try {
      await EncryptedStorage.removeItem('omniVillageToken');
      dispatch(logout())
      console.log('Encrypted Storage emptied!');
    } catch (err) {
      console.log('unable to logout: ', err.message);
      dispatch(reqFailure(err.message));
    }
  };
};
