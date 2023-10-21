import axios from 'axios';
import {storage} from './Storage';

//let adminUrl = "https://backendapinodejsraju.herokuapp.com/api/";
let adminUrl = 'https://omnivillage.azurewebsites.net/api';
// let adminUrl = 'http://192.168.0.101:5100/api';

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
    if (token !== null || token !== undefined) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (err) {
    return Promise.reject(err);
  },
);

export default axiosInstance;
