import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';
import {AsyncStorage} from 'react-native';
import { storage } from '../Helper/Storage';



const initialState = {
  status: 'idle',
  user:{}
};

export const SendOTP = createAsyncThunk('sendotp', async (user) => {
  try {
    console.log(user,"user")
    let res = await axiosInstance.post(endpoints?.auth?.otp, {...user,country_code:"+91"});
    console.log(res,"respond")
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
        if(payload?.api_payload?.status === 200){
          storage.set('token', payload?.api_payload?.data?.token)
          storage.set('refresh_token',payload?.api_payload?.data?.refresh_token)
          state.status = 'idle';
        }
        
      })
      .addCase(RegisterUser.rejected, (state, {payload}) => {
        state.status = 'idle';
      })

      // OTP
      .addCase(SendOTP.pending, (state, {payload}) => {
        state.status = 'pending';
        console.log(state,'pending')
      })
      .addCase(SendOTP.fulfilled, (state, {payload}) => {
        console.log(state,'fullfilled')
        if(payload?.api_payload?.status === 200){
          console.log(payload,"payload")
          state.user = {...state.user,phone:payload?.phone,country_code:payload?.country_code}
          state.status = 'idle';
        }
        
      })
      .addCase(SendOTP.rejected, (state, {payload}) => {
        console.log(state,'reject')
        state.status = 'idle';
      })

      // Login User

      .addCase(LoginUser.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(LoginUser.fulfilled, (state, {payload}) => {
        if(payload?.api_payload?.status === 200){
          storage.set('token', payload?.api_payload?.data?.token)
          storage.set('refresh_token',payload?.api_payload?.data?.refresh_token)
          // AsyncStorage.setItem('token', payload?.data?.token)
          // AsyncStorage.setItem('refresh_token',payload?.data?.refresh_token)
          state.status = 'idle';
        }
      })
      .addCase(LoginUser.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
  },
});
