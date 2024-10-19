import { useSelector } from "react-redux";
import { USER_PREFERRED_LANGUAGE } from "../i18next";
export const endpoints = {
  auth: {
    login_otp: '/user/login',
    register_otp: '/user/register',
    get_user_details: '/user/current_user',
    edit_user_details: '/user/edit_user',
    send_otp: '/user/send_otp',
    weight_measurement: '/weight_measurements',
    land_measurement: '/land_measurements/',
    village: '/villages/',
  },
  crops: {
    get_crops: `/crop?language=${USER_PREFERRED_LANGUAGE}`,
  },
  food: {
    production: {
      total_land: '/user/land_allocation',
      get_cultivation: '/cultivation',
      add_cultivation: '/cultivation/add_cultivation',
      edit_cultivation: '/cultivation/edit_cultivation',
      delete_cultivation: '/cultivation/delete_cultivation',
    },
  },
};