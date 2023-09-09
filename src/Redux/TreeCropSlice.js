import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  cropCategories: [],
  treeCrops: [],
  addedCrop: [],
};

export const getTreeCrops = createAsyncThunk(
  'gettreecrop',
  async (_, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.treeCrop.get_tree_crop);
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const addTreeCrops = createAsyncThunk(
  'getaddtreecrop',
  async (arg, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.post(endpoints.treeCrop.add_tree_crop, {
        name: arg.name,
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

export const TreeCropSlice = createSlice({
  name: 'treeCropSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //   .addCase(getCropCategories.pending, state => {
      //     state.status = 'pending';
      //   })
      //   .addCase(getCropCategories.fulfilled, (state, {payload}) => {
      //     if (payload.status === 200) {
      //       state.cropCategories = payload.data;
      //     }
      //     state.status = 'idle';
      //   })
      //   .addCase(getCropCategories.rejected, state => {
      //     state.status = 'idle';
      //   })
      .addCase(getTreeCrops.pending, state => {
        state.status = 'pending';
      })
      .addCase(getTreeCrops.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.treeCrops = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getTreeCrops.rejected, state => {
        state.status = 'idle';
      })
      .addCase(addTreeCrops.pending, state => {
        state.status = 'pending';
      })
      .addCase(addTreeCrops.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.addedCrop = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addTreeCrops.rejected, state => {
        state.status = 'idle';
      });
  },
});
