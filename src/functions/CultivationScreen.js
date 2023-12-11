import {endpoints} from '../Endpoints/endpoints';
import axiosInstance from '../Helper/Helper';

export const fetchCultivations = async () => {
  const res = await axiosInstance.post(endpoints.cultivation.fetchCultivation);
  return res.data;
};

export const addCultivation = async body => {
  const res = await axiosInstance.post(
    endpoints.cultivation.addCultivation,
    body,
  );
  return res.data;
};

export const editCultivation = async body => {
  const res = await axiosInstance.post(
    endpoints.cultivation.editCultivation,
    body,
  );
  return res.data;
};

export const deleteCultivation = async id => {
  const res = await axiosInstance.delete(
    `${endpoints.cultivation.deleteCultivation}/${id}`,
  );
  return res.data;
};
