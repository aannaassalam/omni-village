import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

export const getHousingDropdown = async id => {
  const res = await axiosInstance.get(endpoints.dropdown.get_housing_dropdown);
  return res.data;
};

export const getHousingByUser = async () => {
  const res = await axiosInstance.get(endpoints.housing.get_housing_by_user);
  return res.data;
};

export const addHousingByUser = async body => {
  console.log('bodyyyyy housing', body);
  const res = await axiosInstance.post(
    endpoints.housing.add_housing_by_user,
    body,
  );
  return res.data;
};

export const editHousingByUser = async body => {
  const res = await axiosInstance.put(
    endpoints.housing.edit_housing_by_user,
    body,
  );
  return res.data;
};

export const editHousingRequirement = async body => {
  console.log('bodyyyyy housing specification', body);
  const res = await axiosInstance.put(
    endpoints.housing.update_housing_requirement,
    body,
  );
  return res.data;
};
export const getNumberOfHousing = async () => {
  const res = await axiosInstance.get(endpoints.housing.get_housing);
  return res.data;
};

export const deleteHousing = async id => {
  const res = await axiosInstance.delete(
    endpoints.housing.delete_housing + `id=${id}`,
  );
  return res.data;
};
export const getHousingRequirement = async () => {
  const res = await axiosInstance.get(
    endpoints.housing.get_housing_requirement,
  );
  return res.data;
};

export const editHousing = async body => {
  console.log('edit body hosuing', body);
  const res = await axiosInstance.put(endpoints.housing.update_housing, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const addHousing = async body => {
  console.log('bodyyyyy housing', body);
  const res = await axiosInstance.post(endpoints.housing.add_housing, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
export const getHousingById = async id => {
  const res = await axiosInstance.get(
    endpoints.housing.get_housing_details + `?housing_id=${id}`,
  );
  return res.data;
};
