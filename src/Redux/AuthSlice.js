import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';
import {AsyncStorage} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import {storage} from '../Helper/Storage';
import FormData from 'form-data';
import {create} from 'react-test-renderer';

const initialState = {
  status: 'idle',
  user: {},
  userDetails: {},
  userToken: '',
  otp: '',
};

export const getUser = createAsyncThunk(
  'getuser',
  async (_, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(endpoints.auth.getUser);
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        data: err.response.data,
        status: err.response.status,
      });
      // return err
    }
  },
);

export const SendOTP = createAsyncThunk(
  'sendotp',
  async ({phone, type, country, currency, country_code}, {rejectWithValue}) => {
    try {
      // console.log(user,"userincoming")
      let res = await axiosInstance.post(endpoints?.auth?.otp, {
        phone,
        country_code,
        currency,
        country,
        type,
      });
      return {
        status: res.status,
        data: res.data.body,
        phone,
        country_code,
        currency,
        country,
      };
    } catch (err) {
      return rejectWithValue({
        data: err.response.data,
        status: err.response.status,
      });
    }
    // let data = {}
    // axiosInstance.post(endpoints?.auth?.otp, {...user,country_code:"+91"}).then((res)=>data=res).catch((err)=>data=err)
    // console.log(data,"data")
    // return data
  },
);

export const RegisterUser = createAsyncThunk(
  'register',
  async (user, {rejectWithValue}) => {
    try {
      let res = await axiosInstance.post(endpoints?.auth?.register, user);
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        data: err.response.data,
        status: err.response.status,
      });
    }
  },
);

export const LoginUser = createAsyncThunk(
  'login',
  async (user, {rejectWithValue}) => {
    try {
      let res = await axiosInstance.post(endpoints?.auth?.login, user);
      return {status: res.status, data: res.data};
    } catch (err) {
      return rejectWithValue({
        data: err.response.data,
        status: err.response.status,
      });
    }
  },
);

export const EditUser = createAsyncThunk(
  'edituser',
  async ({data, file}, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'members') {
          formData.append('members', JSON.stringify(data[key]));
          // data[key].forEach((item, idx) => {
          //   formData.append(`members[${idx}]`, JSON.stringify(item));
          //   // formData.append(`members[${idx}].age`, item.age);
          //   // formData.append(`members[${idx}].gender`, item.gender);
          // });
        } else {
          formData.append(key, data[key]);
        }
      });
      formData.append('address_proof', {
        uri: file?.uri || '',
        type: file?.type || '',
        filename: file?.name || '',
        name: 'address_proof',
      });
      // for (var item of formData) {
      console.log(formData);
      // }
      let res = await axiosInstance.post(endpoints?.auth?.editUser, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, error) => {
          return formData;
        },
      });
      console.log(res, 'res');
      // return {status: res.status, data: res.data};
    } catch (err) {
      console.log(err, 'errpr');
      return rejectWithValue({
        data: err.response.data,
        status: err.response.status,
      });
    }
  },
);

export const cultivationLandAllocation = createAsyncThunk(
  'cultivationLandAllocation',
  async (data, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.post(
        endpoints.auth.cultivationLandAllocation,
        data,
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

export const LandAllocation = createAsyncThunk(
  'landallocation',
  async (data, {rejectWithValue}) => {
    try {
      console.log(data, 'data from thunk');
      let res = await axiosInstance?.post(
        endpoints?.auth?.landAllocation,
        data,
      );
      return {data: res?.data, status: res?.status};
    } catch (err) {
      return rejectWithValue({
        status: err.response.status,
        data: err.response.data,
      });
    }
  },
);

export const logout = createAsyncThunk('logout', () => {
  storage.clearAll();
  return true;
});

export const AuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder

      //Get User
      .addCase(getUser.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(getUser.fulfilled, (state, {payload}) => {
        if (payload.status === 200) {
          state.user = payload.data;
          state.userDetails = payload.data;
          if (payload.data === null) {
            storage.delete('token');
            storage.delete('refresh_token');
          }
          state.status = 'idle';
        }
      })
      .addCase(getUser.rejected, (state, {payload}) => {
        state.status = 'idle';
      })

      // Register User
      .addCase(RegisterUser.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(RegisterUser.fulfilled, (state, {payload}) => {
        if (payload?.status === 200) {
          storage.set('token', payload?.data?.token);
          storage.set('refresh_token', payload?.data?.refreshToken);
          state.status = 'idle';
        }
      })
      .addCase(RegisterUser.rejected, (state, {payload}) => {
        state.status = 'idle';
      })

      // OTP
      .addCase(SendOTP.pending, (state, {payload}) => {
        state.status = 'pending';
        // console.log(state.status, 'pending');
      })
      .addCase(SendOTP.fulfilled, (state, {payload}) => {
        if (payload?.status === 200) {
          state.user = {
            ...state.user,
            phone: payload?.phone,
            country_code: payload?.country_code,
            currency: payload?.currency,
            country: payload?.country,
          };
          state.otp = payload.data.split(' - ')[1];
          state.status = 'idle';
        }
        // console.log(state.status, 'fullfilled');
      })
      .addCase(SendOTP.rejected, (state, {payload}) => {
        state.status = 'idle';
        // console.log(state.status, 'reject');
      })

      // Login User

      .addCase(LoginUser.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(LoginUser.fulfilled, (state, {payload}) => {
        if (payload?.status === 200) {
          state.userToken = payload?.data?.token;
          storage.set('token', payload?.data?.token);
          storage.set('refresh_token', payload?.data?.refreshToken);
          state.status = 'idle';
        }
      })
      .addCase(LoginUser.rejected, (state, {payload}) => {
        state.status = 'idle';
      })

      // Edit User

      .addCase(EditUser.pending, (state, {payload}) => {
        state.status = 'pending';
      })
      .addCase(EditUser.fulfilled, (state, {payload}) => {
        if (payload?.status === 200) {
          state.userDetails = payload?.data;
          state.status = 'idle';
        }
      })
      .addCase(EditUser.rejected, (state, {payload}) => {
        state.status = 'idle';
      })

      // Land Allocation

      .addCase(LandAllocation.pending, state => {
        state.status = 'pending';
      })
      .addCase(LandAllocation.fulfilled, (state, {payload}) => {
        if (payload?.status === 200) {
          state.userDetails = payload?.data;
          state.status = 'idle';
        }
      })
      .addCase(LandAllocation.rejected, state => {
        state.status = 'idle';
      })
      .addCase(logout.pending, state => {
        state.status = 'pending';
      })
      .addCase(logout.fulfilled, state => {
        state.user = {};
        state.userDetails = {};
        state.userToken = '';
        state.status = 'idle';
      })
      .addCase(logout.rejected, state => {
        state.status = 'idle';
      });
  },
});
