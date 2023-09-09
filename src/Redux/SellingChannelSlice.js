import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  sellingChannel: [],
};

export const getSellingChannel = createAsyncThunk(
  'getSellingChannel',
  async (_, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.sellingChannel.fetch_selling_channel);
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

export const addSellingChannel = createAsyncThunk(
  'addsellingchannel',
  async (storageData, {getState, rejectWithValue, dispatch}) => {
    console.log("storage data", storageData)
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(
        endpoints.sellingChannel.add_selling_channel,
        {
          selling_channel_methods: storageData
        },
      );
      console.log('resss at add seliing channel slice', res?.data);
      dispatch(getSellingChannel())
      return {status: res.status, data: res.data};
    } catch (err) {
      console.log(err, 'err2 at selling channel add');
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const editSellingChannel = createAsyncThunk(
  'editsellingchannel',
  async (storageData, {getState, rejectWithValue, dispatch}) => {
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(
        endpoints.sellingChannel.edit_selling_channel,
        {
          selling_channel_id: storageData?.selling_channel_id,
          selling_channel_methods: storageData?.selling_channel_methods,
        },
      );
      console.log('resss at edit seliing channel slice', res?.data);
      dispatch(getSellingChannel());
      return {status: res.status, data: res.data};
    } catch (err) {
      console.log(err, 'err2 at selling channel add');
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const SellingChannelSlice = createSlice({
  name: 'sellingchannel',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get Cultivation Slice
      .addCase(getSellingChannel.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getSellingChannel.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.sellingChannel = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getSellingChannel.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      // Add Cultivation Slice
      .addCase(addSellingChannel.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(addSellingChannel.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addSellingChannel.rejected, state => {
        state.status = 'idle';
      })
      .addCase(editSellingChannel.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(editSellingChannel.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(editSellingChannel.rejected, state => {
        state.status = 'idle';
      });
  },
});
