import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

export const fetchFishery = async type => {
  const res = await axiosInstance.get(
    endpoints.fishery.fetch_fishery + `/${type}`,
  );
  return res.data;
};

export const addFishery = async body => {
  const res = await axiosInstance.post(endpoints.fishery.add_fishery, {
    important_information: body?.important_information,
    production_information: body?.utilisation_information,
    weight_measurement: body?.weight_measurement,
    processing_method: body?.processing_method,
    status: body?.status,
    fishery_crop_id: body?.crop_id,
    fishery_type: body?.fishery_type,
    pond_name: body?.pond_name,
  });
  return res.data;
};

export const editFishery = async body => {
  const res = await axiosInstance.post(endpoints.fishery.edit_fishery, {
    important_information: body?.important_information,
    production_information: body?.utilisation_information,
    weight_measurement: body?.weight_measurement,
    processing_method: body?.processing_method,
    status: body?.status,
    fishery_id: body?.crop_id,
    fishery_type: body?.fishery_type,
    pond_name: body?.pond_name,
  });
  return res.data;
};

export const deleteConsumption = async id => {
  const res = await axiosInstance.delete(
    endpoints.fishery.delete_fishery + `/${id}`,
  );
  return res.data;
};
