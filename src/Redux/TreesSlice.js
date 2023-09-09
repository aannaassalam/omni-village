import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  trees:[],
  currentTree: {}
};

export const setCurrentTree = createAsyncThunk('setcurrenttree', data => data);

export const getTree = createAsyncThunk(
  'gettree',
  async (_, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(
        endpoints.treeShrubs.fetch_tree
      );
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

export const addTree = createAsyncThunk(
  'addtree',
  async (treeData, {getState, rejectWithValue, dispatch}) => {
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(endpoints.treeShrubs.add_trees, {
        ...treeData?.data,
        products: treeData?.productDetails,
        status: treeData?.status,
        tree_crop_id: treeData?.crop_id,
      });
      console.log('resss at tree shrub slice', res?.data)
      dispatch(getTree())
      return {status: res.status, data: res.data};
    } catch (err) {
      console.log(err, 'err2 at treeshrub add');
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const editTree = createAsyncThunk(
  'edittree',
  async (treeData, {getState, rejectWithValue, dispatch}) => {
    console.log('treeeeeee edit', {
      ...treeData?.data,
      products: treeData?.productDetails,
      status: treeData?.status,
      tree_id: treeData?.crop_id,
    });
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(endpoints.treeShrubs.edit_trees, {
        ...treeData?.data,
        products: treeData?.productDetails,
        status: treeData?.status,
        tree_id: treeData?.crop_id,
      });
      // console.log('resss at tree shrub edit slice', res?.data);
      dispatch(getTree())
      return {status: res.status, data: res.data};
    } catch (err) {
      console.log(err, 'err2 at treeshrub edit ');
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const deleteTree = createAsyncThunk(
  'deletetree',
  async (id, {rejectWithValue, dispatch}) => {
    try {
      console.log("idddddd delete", id)
      const res = await axiosInstance.delete(
        endpoints.treeShrubs.delete_trees+`/${id}`
      );
      await dispatch(getTree());
      return {status: res.status, data: res.data};
    } catch (err) {
      console.log("error delete", err)
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);
export const TreesShrubSlice = createSlice({
  name: 'treeShrub',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get Cultivation Slice
      .addCase(getTree.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getTree.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.trees = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getTree.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      .addCase(setCurrentTree.fulfilled, (state, {payload}) => {
        state.currentTree =  payload||{};
      })
      // Add Cultivation Slice
      .addCase(addTree.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(addTree.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addTree.rejected, state => {
        state.status = 'idle';
      })
       // Edit Cultivation Slice
      .addCase(editTree.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(editTree.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(editTree.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      // //Delete Cultivation
      .addCase(deleteTree.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(deleteTree.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(deleteTree.rejected, (state, {payload}) => {
        state.status = 'idle';
      });
  },
});