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

export const sentOtpModerator = async body => {
  const res = await axiosInstance.post(endpoints?.moderator?.otp, body);
  return res;
};

export const loginModerator = async body => {
  const res = await axiosInstance.post(endpoints?.moderator?.login, body);
  return res;
};

export const registerModerator = async body => {
  const res = await axiosInstance.post(endpoints.moderator.register, body);
  return res.data;
};

export const editModerator = async body => {
  const res = await axiosInstance.post(
    endpoints.moderator.editModerator,
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

export const saveLand = async body => {
  let res = await axiosInstance?.post(endpoints?.auth?.landAllocation, body);
  return res?.data;
};

export const get_dropdown_data = async () => {
  let res = await axiosInstance?.get(endpoints?.dropdown?.get_dropdown);
  return res?.data;
};

export const get_villages = async () => {
  let res = await axiosInstance?.get(endpoints?.moderator?.getVillages);
  return res?.data;
};
