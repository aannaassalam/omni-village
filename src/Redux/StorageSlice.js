import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

const initialState = {
  status: 'idle',
  storage: [],
  currentStorage: {},
};

export const getStorage = createAsyncThunk(
  'getStorage',
  async (_, {getState, rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.storage.fetch_storage);
      // console.log(res.data, 'ftech storage');
      return {status: res.status, data: res.data};
    } catch (err) {
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const addStorage = createAsyncThunk(
  'addStorage',
  async (storageData, {getState, rejectWithValue, dispatch}) => {
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(endpoints.storage.add_storage, {
        storages: storageData,
      });
      console.log('resss at add storage slice', res?.data);
      dispatch(getStorage());
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

export const editStorage = createAsyncThunk(
  'editstorage',
  async (storageData, {getState, rejectWithValue, dispatch}) => {
    // const {cultivationType, cropId, season} = getState().cultivation;
    try {
      const res = await axiosInstance.post(endpoints.storage.edit_storage, {
        storages: storageData,
      });
      console.log('resss at hunting edit slice', res?.data);
      dispatch(getStorage());
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

export const deleteStorage = createAsyncThunk(
  'deletestorage',
  async (id, {rejectWithValue, dispatch}) => {
    try {
      const res = await axiosInstance.delete(
        endpoints.storage.delete_storage + `/${id}`,
      );
      await dispatch(getStorage());
      console.log('res delte storage', res?.data);
      return {status: res.status, data: res.data};
    } catch (err) {
      rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);
export const StorageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get Cultivation Slice
      .addCase(getStorage.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getStorage.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.storage = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(getStorage.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      // Add Cultivation Slice
      .addCase(addStorage.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(addStorage.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(addStorage.rejected, state => {
        state.status = 'idle';
      })
      // Edit Cultivation Slice
      .addCase(editStorage.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(editStorage.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(editStorage.rejected, (state, {payload}) => {
        state.status = 'idle';
      })
      //Delete Cultivation
      .addCase(deleteStorage.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(deleteStorage.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          // state.cultivations = payload.data;
        }
        state.status = 'idle';
      })
      .addCase(deleteStorage.rejected, (state, {payload}) => {
        state.status = 'idle';
      });
  },
});
