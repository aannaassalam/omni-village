import {createAsyncThunk , createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
};

export const RegisterUser = createAsyncThunk('register', 
async (user) => {
    try {
      let res = await axiosInstance.post(endpoints?.auth?.register, user);
      return res;
    } catch (err) {
      throw err;
    }
  });


export const AuthSlice = createSlice({
    name:"userAuth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(RegisterUser.pending,(state,{payload})=>{
            state.status = "pending"
        })
        .addCase(RegisterUser.fulfilled,(state,{payload})=>{
            state.status = "idle"
        })
        .addCase(RegisterUser.rejected,(state,{payload})=>{
            state.status = "idle"
        })
    }
})