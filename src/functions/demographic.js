import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

export const getDemographic = async () => {
  const res = await axiosInstance.get(
    endpoints.demographic.get_demographic
  );
  return res.data;
};

export const addDemographic = async body => {
  console.log("bodyyyyy", body)
  const res = await axiosInstance.post(
    endpoints.demographic.add_demographic,
    body,
  );
  return res.data;
};

export const editDemographic = async body => {
  console.log("edit body", body)
  const res = await axiosInstance.put(
    endpoints.demographic.edit_demographic,
    body,
  );
  return res.data;
};