import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  poultry: [],
  currentPoultry: {},
};

export const setCurrentPoultry = createAsyncThunk('setcurrentpoultry', data => data);

export const getPoultry = createAsyncThunk(
  'getpoultry',
  async (_, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.poultry.fetch_poultry);
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

export const addPoultry = createAsyncThunk(
  'addpoultry',
  async (treeData, {getState, rejectWithValue}) => {
    console.log('add poultry', {
      ...treeData?.utilisation_information,
      personal_information:treeData?.important_information,
      income_from_sale: treeData?.income_from_sale,
      expenditure_on_inputs: treeData?.expenditure_on_inputs,
      avg_age_time_period: 'years',
      steroids: treeData?.steroids,
      status: treeData?.status,
      products: treeData?.productDetails,
      status: treeData?.status,
      poultry_crop_id: treeData?.crop_id,
    });
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(endpoints.poultry.add_poultry, {
        ...treeData?.important_information,
        personal_information: treeData?.utilisation_information,
        income_from_sale: treeData?.income_from_sale,
        expenditure_on_inputs: treeData?.expenditure_on_inputs,
        avg_age_time_period: 'years',
        steroids: treeData?.steroids,
        status: treeData?.status,
        products: treeData?.productDetails,
        status: treeData?.status,
        poultry_crop_id: treeData?.crop_id,
      });
      console.log('resss at poultry slice', res?.data);
      return {status: res.status, data: res.data};
    } catch (err) {
      console.log(err, 'err2 at poultry add');
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const editPoultry = createAsyncThunk(
  'editpoultry',
  async (treeData, {getState, rejectWithValue, dispatch}) => {
    console.log('poultry edit', {
      ...treeData?.important_information,
      personal_information: treeData?.utilisation_information,
      income_from_sale: treeData?.income_from_sale,
      expenditure_on_inputs: treeData?.expenditure_on_inputs,
      avg_age_time_period: 'years',
      steroids: treeData?.steroids,
      status: treeData?.status,
      products: treeData?.productDetails,
      status: treeData?.status,
      poultry_id: treeData?.crop_id,
    });
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(endpoints.poultry.edit_poultry, {
        ...treeData?.important_information,
        personal_information: treeData?.utilisation_information,
        income_from_sale: treeData?.income_from_sale,
        expenditure_on_inputs: treeData?.expenditure_on_inputs,
        avg_age_time_period: 'years',
        steroids: treeData?.processing_method,
        products: treeData?.productDetails,
        status: treeData?.status,
        poultry_id: treeData?.crop_id,
      });
      // console.log('resss at tree shrub edit slice', res?.data);
      dispatch(getPoultry());
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

export const deletePoultry = createAsyncThunk(
  'deletepoultry',
  async (id, {rejectWithValue, dispatch}) => {
    try {
      console.log('idddddd delete', id);
      const res = await axiosInstance.delete(
        endpoints.poultry.delete_poultry + `/${id}`,
      );
      await dispatch(getPoultry());
      return {status: res.status, data: res.data};
    } catch (err) {
      console.log('error delete', err);
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);
export const PoultrySlice = createSlice({
  name: 'poultry',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get Cultivation Slice
      .addCase(getPoultry.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getPoultry.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.poultry = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getPoultry.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      // Add Cultivation Slice
      .addCase(addPoultry.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(addPoultry.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addPoultry.rejected, state => {
        state.status = 'idle';
      })
      // Edit Cultivation Slice
      .addCase(editPoultry.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(editPoultry.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(editPoultry.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      // //Delete Cultivation
      .addCase(deletePoultry.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(deletePoultry.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(deletePoultry.rejected, (state, {payload}) => {
        state.status = 'idle';
      });
  },
});
