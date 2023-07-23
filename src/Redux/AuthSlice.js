import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';
import {AsyncStorage} from 'react-native';
import { MMKV } from 'react-native-mmkv';
// import { storage } from '../Helper/Storage';


const storage  = new MMKV()



const initialState = {
  status: 'idle',
  user:{},
  otpData:{}
};


export const SendOTP = createAsyncThunk('sendotp', async (phone) => {
  try {
    // console.log(user,"userincoming")
    let res = await axiosInstance.post(endpoints?.auth?.otp, {phone,country_code:"+91"});
    return {api_payload:res,phone,country_code:"+91"};
  } catch (err) {
    console.log(err,"err")
    throw err;
  }
  // let data = {}
  // axiosInstance.post(endpoints?.auth?.otp, {...user,country_code:"+91"}).then((res)=>data=res).catch((err)=>data=err)
  // console.log(data,"data")
  // return data
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
    console.log(user,"forLogin")
    let res = await axiosInstance.post(endpoints?.auth?.login, user);
    return res;
  } catch (err) {
    throw err;
  }
});


export const EditUser = createAsyncThunk('login', async (user) => {
  try {
    console.log(user,"edituser")
    let res = await axiosInstance.post(endpoints?.auth?.editUser, user);
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
          // storage.set('token', payload?.data?.token)
          // storage.set('refresh_token',payload?.data?.refresh_token)
          state.status = 'idle';
        }
        
      })
      .addCase(RegisterUser.rejected, (state, {payload}) => {
        state.status = 'idle';
      })

      // OTP
      .addCase(SendOTP.pending, (state, {payload}) => {
        state.status = 'pending';
        console.log(state.status,'pending')
      })
      .addCase(SendOTP.fulfilled, (state, {payload}) => {
        
        if(payload?.api_payload?.status === 200){
          console.log(payload,"payload")
          state.user = {...state.user,phone:payload?.phone,country_code:payload?.country_code}
          state.otpData = payload?.api_payload?.data
          state.status = 'idle';
        }
        console.log(state.status,'fullfilled')
      })
      .addCase(SendOTP.rejected, (state, {payload}) => {
        
        state.status = 'idle';
        console.log(state.status,'reject')
      })

      // Login User

      .addCase(LoginUser.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(LoginUser.fulfilled, (state, {payload}) => {
        if(payload?.status === 200){
          console.log(typeof payload?.data?.token,"token")
         try{
          // storage.set('token', JSON.stringify(payload?.data?.token))
          // storage.set('refresh_token',JSON.stringify(payload?.data?.refresh_token))
         }
         catch(err){
          throw err
         }
          // AsyncStorage.setItem('token', payload?.data?.token)
          // AsyncStorage.setItem('refresh_token',payload?.data?.refresh_token)
          state.status = 'idle';
        }
      })
      .addCase(LoginUser.rejected, (state, {payload}) => {
        state.status = 'idle';
      })

       // Edit User

       .addCase(EditUser.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(EditUser.fulfilled, (state, {payload}) => {
        if(payload?.status === 200){
          console.log(typeof payload?.data?.token,"token")
         try{
          // storage.set('token', JSON.stringify(payload?.data?.token))
          // storage.set('refresh_token',JSON.stringify(payload?.data?.refresh_token))
         }
         catch(err){
          throw err
         }
          // AsyncStorage.setItem('token', payload?.data?.token)
          // AsyncStorage.setItem('refresh_token',payload?.data?.refresh_token)
          state.status = 'idle';
        }
      })
      .addCase(EditUser.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
  },
});
