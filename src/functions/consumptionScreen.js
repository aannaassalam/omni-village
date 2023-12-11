import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

export const fetchConsumptions = async name => {
  const res = await axiosInstance.get(
    endpoints.consumtion.fetch_consumption + `/${name}`,
  );
  return res.data;
};

export const fetchConsumptionTypes = async () => {
  const res = await axiosInstance.get(
    endpoints.consumtionType.fetch_consumption_type,
  );
  return res.data;
};

export const addConsumption = async body => {
  const res = await axiosInstance.post(
    endpoints.consumtion.add_consumption,
    body,
  );
  return res.data;
};

export const editConsumption = async body => {
  const res = await axiosInstance.post(
    endpoints.consumtion.edit_consumtion,
    body,
  );
  return res.data;
};

export const deleteConsumption = async id => {
  const res = await axiosInstance.delete(
    endpoints.consumtion.delete_consumption + `/${id}`,
  );
  return res.data;
};
