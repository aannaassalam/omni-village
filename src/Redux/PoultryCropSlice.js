import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  poultryCrops: [],
  addedPoultryCrop: [],
};

export const getPoultryCrops = createAsyncThunk(
  'getpoultrycrop',
  async (_, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.poultryCrop.get_poultry_crop);
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const addPoultryCrops = createAsyncThunk(
  'getaddpoultrycrop',
  async (arg, {rejectWithValue, dispatch}) => {
    try {
      const res = await axiosInstance.post(endpoints.poultryCrop.add_poultry_crop, {
        name: arg.name,
      });
      dispatch(getPoultryCrops())
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const PoultryCropSlice = createSlice({
  name: 'poultryCropSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getPoultryCrops.pending, state => {
        state.status = 'pending';
      })
      .addCase(getPoultryCrops.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.poultryCrops = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getPoultryCrops.rejected, state => {
        state.status = 'idle';
      })
      .addCase(addPoultryCrops.pending, state => {
        state.status = 'pending';
      })
      .addCase(addPoultryCrops.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.addedPoultryCrop = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addPoultryCrops.rejected, state => {
        state.status = 'idle';
      });
  },
});
