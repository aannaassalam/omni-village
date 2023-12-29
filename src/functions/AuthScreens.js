import {endpoints} from '../Endpoints/endpoints';
import axiosInstance from '../Helper/Helper';

export const sentOtp = async body => {
  const res = await axiosInstance.post(endpoints?.auth?.otp, body);
  return res;
};

export const login = async body => {
  const res = await axiosInstance.post(endpoints?.auth?.login, body);
  return res;
};

export const register = async body => {
  const res = await axiosInstance.post(endpoints.auth.register, body);
  return res.data;
};

export const editUser = async body => {
  const res = await axiosInstance.post(
    endpoints.auth.editUser,
    body.data,
    !body.edit && {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data, error) => {
        return body.data;
      },
    },
  );
  return res?.data;
};
