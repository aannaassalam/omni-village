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
  const res = await axios.put(
    BASE_URL + endpoints?.auth?.edit_user_details,
    body,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return res.data;
};

export const get_land_measurement = async () => {
  const res = await axios.get(BASE_URL + endpoints?.auth?.land_measurement);
  return res.data;
};

export const get_weight_measurement = async () => {
  const res = await axios.get(BASE_URL + endpoints?.auth?.weight_measurement);
  return res.data;
};

export const get_village = async (params:any) => {
  console.log("paramsss", params)
  const res = await axios.get(BASE_URL + endpoints?.auth?.village+params?.country);
  return res.data;
};
