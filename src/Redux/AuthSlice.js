import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';
import {AsyncStorage} from 'react-native';



const initialState = {
  status: 'idle',
  user:{}
};

export const SendOTP = createAsyncThunk('sendotp', async (user) => {
  try {
    let res = await axiosInstance.post(endpoints?.auth?.otp, {...user,country_code:"+91"});
    return {api_payload:res,...user,country_code:"+91"};
  } catch (err) {
    throw err;
  }
});

export const RegisterUser = createAsyncThunk('register', async user => {
  try {
    let res = await axiosInstance.post(endpoints?.auth?.register, user);
    return res?.data;
  } catch (err) {
    throw err;
  }
});

export const LoginUser = createAsyncThunk('login', async user => {
  try {
    let res = await axiosInstance.post(endpoints?.auth?.login, user);
    return res;
  } catch (err) {
    throw err;
  }
});

export const AuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder

    // Register User
      .addCase(RegisterUser.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(RegisterUser.fulfilled, (state, {payload}) => {
        if(payload?.status === 200){
          AsyncStorage.setItem('token', payload?.data?.token)
          AsyncStorage.setItem('refresh_token',payload?.data?.refresh_token)
          state.status = 'idle';
        }
        
      })
      .addCase(RegisterUser.rejected, (state, {payload}) => {
        state.status = 'idle';
      })

      // OTP
      .addCase(SendOTP.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(SendOTP.fulfilled, (state, {payload}) => {
        if(payload?.status === 200){
          state.user = {...state.user,phone:payload?.phone,country_code:payload?.country_code}
          state.status = 'idle';
        }
        
      })
      .addCase(SendOTP.rejected, (state, {payload}) => {
        state.status = 'idle';
      })

      // Login User

      .addCase(LoginUser.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(LoginUser.fulfilled, (state, {payload}) => {
        if(payload?.status === 200){
          AsyncStorage.setItem('token', payload?.data?.token)
          AsyncStorage.setItem('refresh_token',payload?.data?.refresh_token)
          state.status = 'idle';
        }
      })
      .addCase(LoginUser.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
  },
});
