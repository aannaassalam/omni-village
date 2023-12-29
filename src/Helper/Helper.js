import axios from 'axios';
import {storage} from './Storage';
import {USER_PREFERRED_LANGUAGE} from '../i18next';

//let adminUrl = "https://backendapinodejsraju.herokuapp.com/api/";
let adminUrl = 'https://omnivillage-server-360ba1f0adb3.herokuapp.com/api';
// let adminUrl = 'http://192.168.0.106:5100/api';

export const baseURL = adminUrl;

let axiosInstance = axios.create({
  baseURL,
});

// export const imagePath = (media) => {
//   return `https://wtsacademy.dedicateddevelopers.us/uploads/product/${media}`;
// }
// export const imagePathProfile = (media) => {
//   return `https://wtsacademy.dedicateddevelopers.us/product/${media}`
// }

axiosInstance.interceptors.request.use(
  async function (config) {
    const token = storage.getString('token');
    const user = JSON.parse(storage.getString('user') || '{}');
    if (token !== null || token !== undefined) {
      config.headers.Authorization = `Bearer ${token}`;
      config.url =
        config.url +
        `?language=${USER_PREFERRED_LANGUAGE}&country=${user.country || ''}`;
      if (config.data) {
        config.data.language = USER_PREFERRED_LANGUAGE;
      }
    }
    // console.log(config.data, 'data');
    return config;
  },
  function (err) {
    return Promise.reject(err);
  },
);

export default axiosInstance;
