import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';


export const getLandholdingDropdown = async (id) => {
  const res = await axiosInstance.get(
    endpoints.dropdown.get_landholding_dropdown
  );
  return res.data;
};


export const getLandholdingByUser = async () => {
    const res = await axiosInstance.get(
        endpoints.landholding.get_landholding_by_user
    );
    return res.data;
};
export const getNumberOfLandholding = async () => {
    const res = await axiosInstance.get(
        endpoints.landholding.get_number_of_landholding
    );
    return res.data;
};

export const addLandholdingByUser = async body => {
    const res = await axiosInstance.post(
        endpoints.landholding.add_landholding_by_user,
        body,
    );
    return res.data;
};

export const editLandholdingByUser = async body => {
    const res = await axiosInstance.put(
        endpoints.landholding.edit_landholding_by_user,
        body,
    );
    return res.data;
};

export const editLandholdingSpecification = async body => {
    console.log("bodyyyyy landholding specification", body)
    const res = await axiosInstance.put(
        endpoints.landholding.update_landspecification,
        body,
    );
    return res.data;
};

export const getLandholdingSpecification = async () => {
    const res = await axiosInstance.get(
        endpoints.landholding.get_landspecification 
    );
    return res.data;
};

export const addLandholding = async body => {
    console.log("add body", body)
    const res = await axiosInstance.post(
        endpoints.landholding.add_landholding,
        body,
    );
    return res.data;
};

export const editLandholding = async body => {
    console.log("edit body", body)
    const res = await axiosInstance.put(
        endpoints.landholding.update_landholding,
        body,
    );
    return res.data;
};

export const getLandholding = async (id) => {
    console.log('hitting hereeeeeeee', id)
    const res = await axiosInstance.get(
        endpoints.landholding.get_landholding_details + `?landholding_id=${id}`
    );
    return res.data;
};

export const deleteLandholding = async id => {
    const res = await axiosInstance.delete(
        endpoints.landholding.delete_landholding + `?id=${id}`,
    );
    return res.data;
};