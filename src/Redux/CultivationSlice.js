import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  cultivationLandAllocation: {},
  cultivations: [],
  currentCrop: {},
  season: 0,
  cultivationType: '',
  cropId: '',
};

export const setSeason = createAsyncThunk('setseason', season => season);

export const setCultivationType = createAsyncThunk(
  'setcultivationtype',
  cultivationType => cultivationType,
);

export const setCropId = createAsyncThunk('setcropid', cropId => cropId);

export const getCultivation = createAsyncThunk(
  'getcultivation',
  async (_, {getState, rejectWithValue}) => {
    const {cultivationType, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(
        endpoints.cultivation.fetchCultivation,
        {cultivation_type: cultivationType, season},
      );
      console.log(res.data, cultivationType, season, 'is it this');
      return {status: res.status, data: res.data};
    } catch (err) {
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const addCultivation = createAsyncThunk(
  'addcultivation',
  async (cultivationData, {getState, rejectWithValue}) => {
    const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(
        endpoints.cultivation.addCultivation,
        {
          ...cultivationData,
          cultivation_type: cultivationType,
          crop_id: cropId,
          season,
        },
      );
      return {status: res.status, data: res.data};
    } catch (err) {
      console.log(err, 'err2');
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const editCultivation = createAsyncThunk(
  'editcultivation',
  async (cultivationData, {getState, rejectWithValue}) => {
    //   const {cultivationType, cropId, season} = getState();
    try {
      const res = await axiosInstance.post(
        endpoints.cultivation.editCultivation,
        cultivationData,
      );
      return {status: res.status, data: res.data};
    } catch (err) {
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const deleteCultivation = createAsyncThunk(
  'deletecultivation',
  async (id, {rejectWithValue, dispatch}) => {
    try {
      const res = await axiosInstance.post(
        endpoints.cultivation.deleteCultivation,
        {
          id,
        },
      );
      await dispatch(getCultivation());
      return {status: res.status, data: res.data};
    } catch (err) {
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const CultivationSlice = createSlice({
  name: 'cultivation',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Season Slice
      .addCase(setSeason.fulfilled, (state, {payload}) => {
        state.season = payload;
      })
      // Cultivation Type Slice
      .addCase(setCultivationType.fulfilled, (state, {payload}) => {
        state.cultivationType = payload;
      })
      // Crop Id Slice
      .addCase(setCropId.fulfilled, (state, {payload}) => {
        state.cropId = payload;
        const cultivationString = JSON.stringify(state.cultivations);
        state.currentCrop =
          JSON.parse(cultivationString).find(
            c =>
              c.crop_id === payload &&
              c.season === state.season &&
              c.cultivation_type === state.cultivationType,
          ) || {};
      })
      // Get Cultivation Slice
      .addCase(getCultivation.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getCultivation.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getCultivation.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      // Add Cultivation Slice
      .addCase(addCultivation.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(addCultivation.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addCultivation.rejected, state => {
        state.status = 'idle';
      })
      // Edit Cultivation Slice
      .addCase(editCultivation.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(editCultivation.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(editCultivation.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      //Delete Cultivation
      .addCase(deleteCultivation.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(deleteCultivation.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(deleteCultivation.rejected, (state, {payload}) => {
        state.status = 'idle';
      });
  },
});
