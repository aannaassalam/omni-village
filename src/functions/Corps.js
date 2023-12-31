import {endpoints} from '../Endpoints/endpoints';
import axiosInstance from '../Helper/Helper';
import {USER_PREFERRED_LANGUAGE} from '../i18next';

export const fetchConsumptionCorp = async id => {
  const res = await axiosInstance.get(
    endpoints.consumtionCrop.get_consumption_crop + `${id}`,
  );
  return res.data;
};

// export const addConsumptionCorp = async body => {
//   const res = await axiosInstance.post(
//     endpoints.consumtionCrop.add_consumption_crop,
//     body,
//   );
//   return res.data;
// };

export const fetchCultivationCorp = async () => {
  const res = await axiosInstance.get(endpoints.crop.getCrop);
  return res.data;
};

export const addCultivationCorp = async body => {
  const res = await axiosInstance.post(endpoints.crop.addCrop, {
    ...body,
    name: {en: body.name},
  });
  return res.data;
};

export const fetchFisheryCorp = async () => {
  const res = await axiosInstance.get(endpoints.fisheryCrop.get_fishery_crop);
  return res.data;
};

export const addFisheryCorp = async body => {
  const res = await axiosInstance.post(endpoints.fisheryCrop.add_fishery_crop, {
    ...body,
    name: {en: body.name},
  });
  return res.data;
};

export const fetchHuntingCorp = async () => {
  const res = await axiosInstance.get(endpoints.huntingCrop.get_hunting_crop);
  return res.data;
};

export const addHuntingCorp = async body => {
  const res = await axiosInstance.post(endpoints.huntingCrop.add_hunting_crop, {
    ...body,
    name: {en: body.name},
  });
  return res.data;
};

export const fetchPoultryCorp = async () => {
  const res = await axiosInstance.get(endpoints.poultryCrop.get_poultry_crop);
  return res.data;
};

export const addPoultryCorp = async body => {
  const res = await axiosInstance.post(endpoints.poultryCrop.add_poultry_crop, {
    ...body,
    name: {en: body.name},
  });
  return res.data;
};

export const fetchStorageMethod = async () => {
  const res = await axiosInstance.get(
    endpoints.storageMethod.get_storage_method,
  );
  return res.data;
};

export const addStorageMethod = async body => {
  const res = await axiosInstance.post(
    endpoints.storageMethod.add_storage_method,
    body,
  );
  return res.data;
};

export const fetchTreeCorp = async () => {
  const res = await axiosInstance.get(endpoints.treeCrop.get_tree_crop);
  return res.data;
};

export const addTreeCorp = async body => {
  const res = await axiosInstance.post(endpoints.treeCrop.add_tree_crop, {
    ...body,
    name: {en: body.name},
  });
  return res.data;
};

export const fetchSellingChannelMethods = async () => {
  const res = await axiosInstance.get(
    endpoints.sellingChannelMethod.get_selling_channel_method,
  );
  return res.data;
};

export const fetchFeed = async () => {
  const res = await axiosInstance.get(endpoints.measurement.feed);
  return res.data;
};
