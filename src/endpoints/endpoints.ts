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
    add_crops: `/crop/add_crop?language=${USER_PREFERRED_LANGUAGE}`,
  },
  feeds: {
    get_feeds: `/feeds?language=${USER_PREFERRED_LANGUAGE}`,
    add_feeds: `/feeds/add_feed?language=${USER_PREFERRED_LANGUAGE}`,
  },
  food: {
    production: {
      total_land: '/user/land_allocation',
      // NOTE:CULTIVATION
      get_cultivation: '/cultivation',
      add_cultivation: '/cultivation/add_cultivation',
      edit_cultivation: '/cultivation/edit_cultivation',
      delete_cultivation: '/cultivation/delete_cultivation/',
      // NOTE:TREES
      get_trees: '/trees',
      add_tress: '/trees/add_tree',
      edit_trees: '/trees/edit_tree',
      delete_trees: '/trees/delete_tree/',
      // NOTE:POULTRY
      get_poultry: '/poultry',
      add_poultry: '/poultry/add_poultry',
      edit_poultry: '/poultry/edit_poultry',
      delete_poultry: '/poultry/delete_poultry/',
      // NOTE:FISHERY
      get_fishery: '/fishery/',
      add_fishery: '/fishery/add_fishery',
      edit_fishery: '/fishery/edit_fishery',
      delete_fishery: '/fishery/delete_fishery/',
      // NOTE:HUNTING
      get_hunting: '/hunting',
      add_hunting: '/hunting/add_hunting',
      edit_hunting: '/hunting/edit_hunting',
      delete_hunting: '/hunting/delete_hunting/',
      // NOTE:SELLING CHANNEL
      add_selling_channel: '/selling_channel/add_selling_channel',
      get_selling_channel: '/selling_channel',
      edit_selling_channel: '/selling_channel/edit_selling_channel',
      delete_selling_channel: '/selling_channel/delete_selling_channel/',
      // NOTE:STORAGE
      get_storage: '/storage',
      add_storage: '/storage/add_storage',
      edit_storage: '/storage/edit_storage',
      delete_storage: '/storage/delete_storage/',
      // NOTE:STORAGE METHOD
      get_storage_method: '/storage_method',
      add_storage_method: '/storage/add_storage_method',
    },
    consumption: {
      get_consumption_type: '/consumption_type?',
      get_consumption_crop: '/crop/consumption_crops?',
      get_consumption: '/consumption/',
      add_consumption: '/consumption/add_consumption',
      edit_consumption: '/consumption/edit_consumption',
      delete_consumption: '/consumption/delete_consumption/',
    },
  },
};