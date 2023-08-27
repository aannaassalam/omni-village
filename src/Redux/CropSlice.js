import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  cropCategories: [],
  crops: [],
};

export const getCrops = createAsyncThunk(
  'getcrop',
  async (categoryId, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.post(endpoints.crop.getCrop, {
        categoryId,
      });
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const getCropCategories = createAsyncThunk(
  'getcropcategories',
  async (_, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.crop.getCropCategories);
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const addCrop = createAsyncThunk(
  'addcrop',
  async ({name, cropCategory}, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.post(endpoints.crop.addCrop, {
        name,
        cropCategory,
      });
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const CropSlice = createSlice({
  name: 'cropSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCropCategories.pending, state => {
        state.status = 'pending';
      })
      .addCase(getCropCategories.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.cropCategories = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getCropCategories.rejected, state => {
        state.status = 'idle';
      })
      // .addCase(getCrop.pending, state => {
      //   state.status = 'pending';
      // })
      // .addCase(getCrop.fulfilled, (state, {payload}) => {
      //   if (payload.status === 200) {
      //     state.crops = payload.data;
      //   }
      //   state.status = 'idle';
      // })
      // .addCase(getCrop.rejected, state => {
      //   state.status = 'idle';
      // })
      .addCase(getCrops.pending, state => {
        state.status = 'pending';
      })
      .addCase(getCrops.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.crops = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getCrops.rejected, state => {
        state.status = 'idle';
      })
      .addCase(addCrop.pending, state => {
        state.status = 'pending';
      })
      .addCase(addCrop.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.crops = [...state.crops, payload.data];
          state.status = 'idle';
        }
      })
      .addCase(addCrop.rejected, state => {
        state.status = 'idle';
      });
  },
});
