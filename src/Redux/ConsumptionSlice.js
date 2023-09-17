import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  consumption: [],
};

export const getConsumption = createAsyncThunk(
  'getconsumption',
  async (_, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.consumtion.fetch_consumption);
      // console.log(res.data, 'ftech consumption');
      return {status: res.status, data: res.data};
    } catch (err) {
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const addConsumption = createAsyncThunk(
  'addconsumption',
  async (treeData, {getState, rejectWithValue, dispatch}) => {
    console.log('consumption data', treeData);
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(endpoints.consumtion.add_consumption, {
       ...treeData
      });
      console.log('resss at add consumption slice', res?.data);
      dispatch(getConsumption());
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

export const editConsumption = createAsyncThunk(
  'editconsumption',
  async (treeData, {getState, rejectWithValue, dispatch}) => {
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(endpoints.consumtion.edit_consumtion, {
       ...treeData
      });
      console.log('resss at consumption edit slice', res?.data);
      dispatch(getConsumption());
      return {status: res.status, data: res.data};
    } catch (err) {
      console.log(err, 'err2 at consumption edit ');
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const deleteConsumption = createAsyncThunk(
  'deleteconsumption',
  async (id, {rejectWithValue, dispatch}) => {
    console.log('delte id', id);
    try {
      const res = await axiosInstance.delete(
        endpoints.consumtion.delete_consumption + `/${id}`,
      );
      await dispatch(getConsumption());
      console.log('res delte consumption', res?.data);
      return {status: res.status, data: res.data};
    } catch (err) {
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);
export const ConsumptionSlice = createSlice({
  name: 'consumption',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get Cultivation Slice
      .addCase(getConsumption.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getConsumption.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.consumption = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getConsumption.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      // Add Cultivation Slice
      .addCase(addConsumption.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(addConsumption.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addConsumption.rejected, state => {
        state.status = 'idle';
      })
      // Edit Cultivation Slice
      .addCase(editConsumption.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(editConsumption.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(editConsumption.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      //Delete Cultivation
      .addCase(deleteConsumption.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(deleteConsumption.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(deleteConsumption.rejected, (state, {payload}) => {
        state.status = 'idle';
      });
  },
});
