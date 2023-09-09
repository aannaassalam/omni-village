import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  storageMethod: [],
  addStorage: [],
};

export const getStorageMethod = createAsyncThunk(
  'getstoragemethod',
  async (_, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(
        endpoints.storageMethod.get_storage_method,
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

export const addStorageMethod = createAsyncThunk(
  'addstoragemethod',
  async (arg, {rejectWithValue, dispatch}) => {
    try {
      const res = await axiosInstance.post(
        endpoints.storageMethod.add_storage_method,
        {
          name: arg.name,
        },
      );
      dispatch(getStorageMethod());
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const StorageMethodSlice = createSlice({
  name: 'storagemethod',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getStorageMethod.pending, state => {
        state.status = 'pending';
      })
      .addCase(getStorageMethod.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.storageMethod = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getStorageMethod.rejected, state => {
        state.status = 'idle';
      })
      .addCase(addStorageMethod.pending, state => {
        state.status = 'pending';
      })
      .addCase(addStorageMethod.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.addStorage = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addStorageMethod.rejected, state => {
        state.status = 'idle';
      });
  },
});
