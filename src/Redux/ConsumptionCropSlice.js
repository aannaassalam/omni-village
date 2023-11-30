import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  consumptionCrops: [],
  addedConsumptionCrop: [],
};

export const getConsumptionCrops = createAsyncThunk(
  'getconsumptioncrop',
  async (id, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(
        endpoints.consumtionCrop.get_consumption_crop + `${id}`,
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

export const addConsumptionCrops = createAsyncThunk(
  'addconsumptioncrop',
  async (arg, {rejectWithValue, dispatch}) => {
    try {
      const res = await axiosInstance.post(
        endpoints.consumtionCrop.add_consumption_crop,
        {
          name: arg.name,
          consumption_type_id: arg.type_id,
        },
      );
      dispatch(getConsumptionCrops());
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const ConsumptionCropSlice = createSlice({
  name: 'consumptionCropSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getConsumptionCrops.pending, state => {
        state.status = 'pending';
      })
      .addCase(getConsumptionCrops.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.consumptionCrops = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getConsumptionCrops.rejected, state => {
        state.status = 'idle';
      })
      .addCase(addConsumptionCrops.pending, state => {
        state.status = 'pending';
      })
      .addCase(addConsumptionCrops.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.addedConsumptionCrop = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addConsumptionCrops.rejected, state => {
        state.status = 'idle';
      });
  },
});
