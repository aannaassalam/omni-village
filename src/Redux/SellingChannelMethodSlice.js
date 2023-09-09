import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  sellingChannelMethod: [],
};

export const getSellingChannelMethod = createAsyncThunk(
  'getSellingChannelMethod',
  async (_, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(
        endpoints.sellingChannelMethod.get_selling_channel_method,
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

export const SellingChannelMethodSlice = createSlice({
  name: 'sellingchannelmethod',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getSellingChannelMethod.pending, state => {
        state.status = 'pending';
      })
      .addCase(getSellingChannelMethod.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.sellingChannelMethod = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getSellingChannelMethod.rejected, state => {
        state.status = 'idle';
      })
  },
});
