import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  fisheryCrop: [],
  addedFisheryCrop: [],
};

export const getFisheryCrops = createAsyncThunk(
  'getfisherycrop',
  async (_, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(
        endpoints.fisheryCrop.get_fishery_crop
      );
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const addFisherycrop = createAsyncThunk(
  'addfisherycrop',
  async (arg, {rejectWithValue, dispatch}) => {
    try {
      const res = await axiosInstance.post(
        endpoints.fisheryCrop.add_fishery_crop,
        {
          name: arg.name,
        },
      );
      console.log("adding fishery crop", res.data)
      dispatch(getFisheryCrops());
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const FisheryCropSlice = createSlice({
  name: 'fisheryCropSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getFisheryCrops.pending, state => {
        state.status = 'pending';
      })
      .addCase(getFisheryCrops.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.fisheryCrop = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getFisheryCrops.rejected, state => {
        state.status = 'idle';
      })
      .addCase(addFisherycrop.pending, state => {
        state.status = 'pending';
      })
      .addCase(addFisherycrop.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.addedFisheryCrop = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addFisherycrop.rejected, state => {
        state.status = 'idle';
      });
  },
});
