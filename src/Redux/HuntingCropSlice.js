import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  huntingCrops: [],
  addedHuntingCrop: [],
};

export const getHuntingCrops = createAsyncThunk(
  'gethuntingcrop',
  async (_, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.huntingCrop.get_hunting_crop);
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const addHuntingCrops = createAsyncThunk(
  'getaddhuntingcrop',
  async (arg, {rejectWithValue, dispatch}) => {
    try {
      const res = await axiosInstance.post(endpoints.huntingCrop.add_hunting_crop, {
        name: arg.name,
      });
      dispatch(getHuntingCrops())
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const HuntingCropSlice = createSlice({
  name: 'huntingCropSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getHuntingCrops.pending, state => {
        state.status = 'pending';
      })
      .addCase(getHuntingCrops.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.huntingCrops = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getHuntingCrops.rejected, state => {
        state.status = 'idle';
      })
      .addCase(addHuntingCrops.pending, state => {
        state.status = 'pending';
      })
      .addCase(addHuntingCrops.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.addedHuntingCrop = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addHuntingCrops.rejected, state => {
        state.status = 'idle';
      });
  },
});
