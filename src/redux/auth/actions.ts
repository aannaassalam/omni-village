import { getProfile, logoutUser } from '../../apis/auth/auth';
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
  token:any,
  id: any,
  full_name: any,
  email: any,
  phone: any,
  dob: any,
  gender: any,
  app_notification_on: any,
) => ({
  type: REQ_SUCCESS,
  token,
  id,
  full_name,
  email,
  phone,
  dob,
  gender,
  app_notification_on,
});
export const reqFailure = (error: any) => ({
  type: REQ_FAILURE,
  error: error,
});
export const logout = () => ({type: LOGOUT});

export const tokenRetriever = (notificationToken: any) => {
  return async (dispatch: any) => {
    try {
      const userData = await EncryptedStorage.getItem('a2zCarsToken');
      console.log("userDataaaaaa", userData)
      const loggedData = userData != null ? JSON.parse(userData) : null;
      if (loggedData != null) {
        dispatch(
          reqSuccess(
            loggedData?.token,
            loggedData?.id,
            loggedData?.full_name,
            loggedData?.email,
            loggedData?.phone,
            loggedData?.dob,
            loggedData?.gender,
            loggedData?.app_notification_on,
          ),
        );
        getProfile().then((res)=>{
          if(res?.data?.sucess){
            dispatch(
              reqSuccess(
                loggedData?.token,
                res?.data?.id,
                res?.data?.full_name,
                res?.data?.email,
                res?.data?.phone,
                res?.data?.dob,
                res?.data?.gender,
                res?.data?.app_notification_on,
              ),
            );
          }
        }).catch((err)=>{
          dispatch(reqFailure(err?.message ?? 'No error message'));
        })
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
  console.log('logging out');
  return async (dispatch:any) => {
    try {
      await EncryptedStorage.removeItem('a2zCarsToken');
      logoutUser().then(()=>{
        dispatch(logout());
      })
      console.log('Encrypted Storage emptied!');
    } catch (err) {
      console.log('unable to logout: ', err.message);
      dispatch(reqFailure(err.message));
    }
  };
};
