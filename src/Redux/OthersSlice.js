


import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  measurement: [],
  fishFeed:[],
  feed: [],
  village:[],
  landmeasurement:[]
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

export const getFishFeed = createAsyncThunk(
  'getfishfeed',
  async (_, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.measurement.fish_feed);
      // console.log(res.data, 'ftech fish');
      return {status: res.status, data: res.data};
    } catch (err) {
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const getFeed = createAsyncThunk(
  'getfeed',
  async (_, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.measurement.feed);
      // console.log(res.data, 'ftech fish');
      return {status: res.status, data: res.data};
    } catch (err) {
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const getVillage = createAsyncThunk(
  'getvillage',
  async (village, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(
        endpoints.measurement.village + `${village}`,
      );
      // console.log(res.data, 'ftech fish');
      return {status: res.status, data: res.data};
    } catch (err) {
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const getLandmeasurement = createAsyncThunk(
  'getlandmeasurement',
  async (village, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(
        endpoints.measurement.landmeasurement,
      );
      // console.log(res.data, 'ftech fish');
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
      .addCase(getFishFeed.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getFishFeed.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.fishFeed = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getFishFeed.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      .addCase(getFeed.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getFeed.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.feed = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getFeed.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      .addCase(getVillage.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getVillage.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.feed = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getVillage.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      .addCase(getLandmeasurement.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getLandmeasurement.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.landmeasurement = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getLandmeasurement.rejected, (state, {payload}) => {
        state.status = 'idle';
      });
  },
});
