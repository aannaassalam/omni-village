


import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  measurement: [],
};


export const getMeasurement = createAsyncThunk(
  'getmeasurement',
  async (_, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.measurement.get_measurement);
      // console.log(res.data, 'ftech tree');
      return {status: res.status, data: res.data};
    } catch (err) {
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);
export const OthersSlice = createSlice({
  name: 'othersslice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get Cultivation Slice
      .addCase(getMeasurement.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getMeasurement.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.measurement = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getMeasurement.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
  },
});
