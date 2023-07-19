import axios from "axios";
//let adminUrl = "https://backendapinodejsraju.herokuapp.com/api/";
let adminUrl = "https://api.escuelajs.co/api/v1";

export const baseURL = adminUrl

let axiosInstance = axios.create({
  baseURL,
});

export const imagePath = (media) => {
  return `https://wtsacademy.dedicateddevelopers.us/uploads/product/${media}`;
}
export const imagePathProfile = (media) => {
  return `https://wtsacademy.dedicateddevelopers.us/product/${media}`
}


axiosInstance.interceptors.request.use(
  async function (config) {
    const token =
      localStorage.getItem("access_token");
    if (token !== null || token !== undefined) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

export default axiosInstance;
