import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  hunting: [],
  currentTree: {},
};

export const setCurrentTree = createAsyncThunk('setcurrenttree', data => data);

export const getHunting = createAsyncThunk(
  'gettree',
  async (_, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.hunting.fetch_hunting);
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

export const addHunting = createAsyncThunk(
  'addhunting',
  async (treeData, {getState, rejectWithValue}) => {
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(endpoints.hunting.add_hunting, {
        number_hunted: treeData?.number_hunted,
        ...treeData?.utilisation_information,
        income_from_sale: treeData?.income_from_sale,
        expenditure_on_inputs: treeData?.expenditure_on_inputs,
        weight_measurement: treeData?.weight_measurement,
        yeild: treeData?.yeild,
        processing_method: treeData?.processing_method,
        status: treeData?.status,
        hunting_crop_id: treeData?.crop_id,
      });
      console.log('resss at add hunitng slice', res?.data);
      dispatch(getHunting());
      return {status: res.status, data: res.data};
    } catch (err) {
      console.log(err, 'err2 at hunting add');
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const editHunting = createAsyncThunk(
  'edithunting',
  async (treeData, {getState, rejectWithValue, dispatch}) => {
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(endpoints.hunting.edit_hunting, {
        number_hunted: treeData?.number_hunted,
        ...treeData?.utilisation_information,
        income_from_sale: treeData?.income_from_sale,
        expenditure_on_inputs: treeData?.expenditure_on_inputs,
        weight_measurement: treeData?.weight_measurement,
        yeild: treeData?.yeild,
        processing_method: treeData?.processing_method,
        status: treeData?.status,
        hunting_id: treeData?.crop_id,
      });
      console.log('resss at hunting edit slice', res?.data);
      dispatch(getHunting());
      return {status: res.status, data: res.data};
    } catch (err) {
      console.log(err, 'err2 at huting edit ');
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const deleteHunting = createAsyncThunk(
  'deletehunting',
  async (id, {rejectWithValue, dispatch}) => {
    console.log('delte id', id);
    try {
      const res = await axiosInstance.delete(
        endpoints.hunting.delete_hunting + `/${id}`,
      );
      await dispatch(getHunting());
      console.log("res delte hnting", res?.data)
      return {status: res.status, data: res.data};
    } catch (err) {
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);
export const HuntingSlice = createSlice({
  name: 'hunting',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get Cultivation Slice
      .addCase(getHunting.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getHunting.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.hunting = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getHunting.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
    //   .addCase(setCurrentTree.fulfilled, (state, {payload}) => {
    //     state.currentTree = payload || {};
    //   })
      // Add Cultivation Slice
      .addCase(addHunting.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(addHunting.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addHunting.rejected, state => {
        state.status = 'idle';
      })
      // Edit Cultivation Slice
      .addCase(editHunting.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(editHunting.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(editHunting.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      //Delete Cultivation
      .addCase(deleteHunting.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(deleteHunting.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(deleteHunting.rejected, (state, {payload}) => {
        state.status = 'idle';
      });
  },
});
