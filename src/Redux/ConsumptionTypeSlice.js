import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  consumptionType: [],
};

export const getConsumptionType = createAsyncThunk(
  'getconsumptiontype',
  async (_, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(
        endpoints.consumtionType.fetch_consumption_type,
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

export const addConsumptionType = createAsyncThunk(
  'addconsumptiontype',
  async (treeData, {getState, rejectWithValue, dispatch}) => {
    console.log('consumption type data', treeData);
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(
        endpoints.consumtionType.add_consumption_type,
        {
          number_hunted: treeData?.important_information?.number_hunted,
          ...treeData?.utilisation_information,
          income_from_sale: treeData?.income_from_sale,
          expenditure_on_inputs: treeData?.expenditure_on_inputs,
          weight_measurement: treeData?.weight_measurement,
          yeild: treeData?.yeild,
          processing_method: treeData?.processing_method,
          status: treeData?.status,
          hunting_crop_id: treeData?.crop_id,
        },
      );
      console.log('resss at add consumption type slice', res?.data);
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

export const editConsumptionType = createAsyncThunk(
  'editconsumptionType',
  async (treeData, {getState, rejectWithValue, dispatch}) => {
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(
        endpoints.consumtionType.edit_consumtion_type,
        {
          number_hunted: treeData?.number_hunted,
          ...treeData?.utilisation_information,
          income_from_sale: treeData?.income_from_sale,
          expenditure_on_inputs: treeData?.expenditure_on_inputs,
          weight_measurement: treeData?.weight_measurement,
          yeild: treeData?.yeild,
          processing_method: treeData?.processing_method,
          status: treeData?.status,
          hunting_id: treeData?.crop_id,
        },
      );
      console.log('resss at consumption edit type slice', res?.data);
      dispatch(getHunting());
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

export const deleteConsumptionType = createAsyncThunk(
  'deleteconsumptiontype',
  async (id, {rejectWithValue, dispatch}) => {
    console.log('delte id', id);
    try {
      const res = await axiosInstance.delete(
        endpoints.consumtionType.delete_consumption_type + `/${id}`,
      );
      await dispatch(getHunting());
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
export const ConsumptionTypeSlice = createSlice({
  name: 'consumptionTtype',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get Cultivation Slice
      .addCase(getConsumptionType.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getConsumptionType.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.consumptionType = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getConsumptionType.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      // Add Cultivation Slice
      .addCase(addConsumptionType.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(addConsumptionType.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addConsumptionType.rejected, state => {
        state.status = 'idle';
      })
      // Edit Cultivation Slice
      .addCase(editConsumptionType.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(editConsumptionType.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(editConsumptionType.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      //Delete Cultivation
      .addCase(deleteConsumptionType.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(deleteConsumptionType.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(deleteConsumptionType.rejected, (state, {payload}) => {
        state.status = 'idle';
      });
  },
});
