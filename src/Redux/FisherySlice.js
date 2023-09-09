import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  fishery: [],
  currentFishery: {},
};

export const setCurrentFishery = createAsyncThunk('setcurrentfishery', data => data);

export const getFishery = createAsyncThunk(
  'getfishery',
  async (fisheryType, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.fishery.fetch_fishery+`/${fisheryType}` );
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

export const addFishery = createAsyncThunk(
  'addfishery',
  async (treeData, {getState, rejectWithValue, dispatch}) => {
    console.log('fishery', {
      important_information: treeData?.important_information,
      production_information: treeData?.utilisation_information,
      weight_measurement: treeData?.weight_measurement,
      processing_method: treeData?.processing_method,
      status: treeData?.status,
      fishery_crop_id: treeData?.crop_id,
      fishery_type: treeData?.fishery_type,
      pond_name: treeData?.pond_name,
    });
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(endpoints.fishery.add_fishery, {
        important_information: treeData?.important_information,
        production_information: treeData?.utilisation_information,
        weight_measurement: treeData?.weight_measurement,
        processing_method: treeData?.processing_method,
        status: treeData?.status,
        fishery_crop_id: treeData?.crop_id,
        fishery_type: treeData?.fishery_type,
        pond_name: treeData?.pond_name,
      });
      console.log('resss at add fishery slice', res?.data);
      // dispatch(getFishery(treeData?.pond_name));
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

export const editFishery = createAsyncThunk(
  'editfishery',
  async (treeData, {getState, rejectWithValue, dispatch}) => {
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(endpoints.fishery.edit_fishery, {
        important_information: treeData?.important_information,
        production_information: treeData?.utilisation_information,
        weight_measurement: treeData?.weight_measurement,
        processing_method: treeData?.processing_method,
        status: treeData?.status,
        fishery_id: treeData?.crop_id,
        fishery_type: treeData?.fishery_type,
        pond_name: treeData?.pond_name,
      });
      console.log('resss at hunting edit slice', res?.data);
      dispatch(getFishery(treeData?.pond_name));
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

export const deleteFishery = createAsyncThunk(
  'deletefishery',
  async (id, {rejectWithValue, dispatch}) => {
    console.log('delte id', id);
    try {
      const res = await axiosInstance.delete(
        endpoints.fishery.delete_fishery+ `/${id}`,
      );
      // await dispatch(getFishery());
      console.log('res delte hnting', res?.data);
      return {status: res.status, data: res.data};
    } catch (err) {
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);
export const FisherySlice = createSlice({
  name: 'fishery',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get Cultivation Slice
      .addCase(getFishery.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getFishery.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.fishery = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getFishery.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      .addCase(setCurrentFishery.fulfilled, (state, {payload}) => {
        state.currentFishery = payload || {};
      })
      // Add Cultivation Slice
      .addCase(addFishery.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(addFishery.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addFishery.rejected, state => {
        state.status = 'idle';
      })
      // Edit Cultivation Slice
      .addCase(editFishery.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(editFishery.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(editFishery.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      //Delete Cultivation
      .addCase(deleteFishery.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(deleteFishery.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(deleteFishery.rejected, (state, {payload}) => {
        state.status = 'idle';
      });
  },
});
