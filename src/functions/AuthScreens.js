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
