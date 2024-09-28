import {
  REQ,
  REQ_SUCCESS,
  SET_NEW_AUTH_TOKEN,
  REQ_FAILURE,
  LOGOUT,
  NET_CHECK,
  FOLLOWING,
} from './actionTypes';
import EncryptedStorage from 'react-native-encrypted-storage';

export const reqSuccess = (
  // token:any,
  // id: any,
  // full_name: any,
  // email: any,
  // phone: any,
  // dob: any,
  // gender: any,
  // app_notification_on: any,
) => ({
  type: REQ_SUCCESS,
  // token,
  // id,
  // full_name,
  // email,
  // phone,
  // dob,
  // gender,
  // app_notification_on,
});
export const reqFailure = (error: any) => ({
  type: REQ_FAILURE,
  error: error,
});
export const logout = () => ({type: LOGOUT});

export const tokenRetriever = (notificationToken: any) => {
  return async (dispatch: any) => {
    try {
      const userData = await EncryptedStorage.getItem('omnivillageToken');
      const loggedData = userData != null ? JSON.parse(userData) : null;
      if (loggedData != null) {
       
      }
    } catch (err) {
      dispatch(reqFailure(err?.message ?? 'No error message'));
    }
  };
};

export const logUserOut = () => {
  return async (dispatch:any) => {
    try {
      await EncryptedStorage.removeItem('a2zCarsToken');
      console.log('Encrypted Storage emptied!');
    } catch (err) {
      console.log('unable to logout: ', err.message);
      dispatch(reqFailure(err.message));
    }
  };
};
