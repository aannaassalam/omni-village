import axios from 'axios'
import { BASE_URL } from '../../env';
import { endpoints } from '../endpoints/endpoints';

export const login_otp = async (body: any) => {
  const res = await axios.post(BASE_URL + endpoints?.auth?.login_otp, body);
  return res.data;
};
export const send_otp = async (body: any) => {
  const res = await axios.post(BASE_URL + endpoints?.auth?.send_otp, body);
  return res.data;
};
export const signup_otp = async (body: any) => {
    console.log("body", body)
  const res = await axios.post(BASE_URL + endpoints?.auth?.register_otp, body);
  return res.data;
};

export const get_user_details = async () => {
  const res = await axios.get(BASE_URL + endpoints?.auth?.get_user_details);
  return res.data;
};

export const edit_user_details = async (body: any) => {
  const res = await axios.put(BASE_URL + endpoints?.auth?.edit_user_details, body);
  return res.data;
};
