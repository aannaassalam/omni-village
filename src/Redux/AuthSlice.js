import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';
import {AsyncStorage} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import {storage} from '../Helper/Storage';
import FormData from 'form-data';

const initialState = {
  status: 'idle',
  user: {},
  userDetails: {},
  userToken: '',
  otp: '',
};

export const getUser = createAsyncThunk('getuser', async () => {
  try {
    const res = await axiosInstance.get(endpoints.auth.getUser);
    console.log(res);
    return {status: res.status, data: res.data};
  } catch (err) {
    throw err;
  }
});

export const SendOTP = createAsyncThunk('sendotp', async phone => {
  try {
    // console.log(user,"userincoming")
    let res = await axiosInstance.post(endpoints?.auth?.otp, {
      phone,
      country_code: '+91',
    });
    return {
      status: res.status,
      data: res.data.body,
      phone,
      country_code: '+91',
    };
  } catch (err) {
    console.log(err, 'ko');
    throw err;
  }
  // let data = {}
  // axiosInstance.post(endpoints?.auth?.otp, {...user,country_code:"+91"}).then((res)=>data=res).catch((err)=>data=err)
  // console.log(data,"data")
  // return data
});

export const RegisterUser = createAsyncThunk('register', async user => {
  try {
    let res = await axiosInstance.post(endpoints?.auth?.register, user);
    return {status: res.status, data: res.data};
  } catch (err) {
    throw err;
  }
});

export const LoginUser = createAsyncThunk('login', async user => {
  try {
    let res = await axiosInstance.post(endpoints?.auth?.login, user);
    return {status: res.status, data: res.data};
  } catch (err) {
    throw err;
  }
});

export const EditUser = createAsyncThunk('edituser', async ({data, file}) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    formData.append('address_proof', {
      uri: file.uri,
      type: file.type,
      filename: file.name,
      name: 'address_proof',
    });
    let res = await axiosInstance.post(endpoints?.auth?.editUser, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data, error) => {
        return formData;
      },
    });
    return {status: res.status, data: res.data};
  } catch (err) {
    throw err;
  }
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
        console.log(payload);
        if (payload.status === 200) {
          state.user = payload.data;
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
      });
  },
});
