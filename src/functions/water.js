import axiosInstance from '../Helper/Helper';
import { endpoints } from '../Endpoints/endpoints';

export const getWaterDropdown = async () => {
    const res = await axiosInstance.get(
        endpoints.dropdown.get_water_dropdown
    );
    return res.data;
};

export const getWaterByUser = async () => {
    const res = await axiosInstance.get(
        endpoints.water.get_water_by_user
    );
    return res.data;
};

// USAGE
export const getWaterUsage = async (id) => {
    const res = await axiosInstance.get(
        endpoints.water.water_usage.get_water_usage + `?water_id=${id}`
    );
    return res.data;
};

export const addWaterUsage = async body => {
    const res = await axiosInstance.post(
        endpoints.water.water_usage.add_water_usage,
        body,
    );
    return res.data;
};

export const editWaterUsage = async body => {
    const res = await axiosInstance.put(
        endpoints.water.water_usage.update_water_usage,
        body,
    );
    return res.data;
};

// Water Harvesting
export const getWaterHarvesting = async (id) => {
    const res = await axiosInstance.get(
        endpoints.water.water_harvesting.get_water_harvesting + `?water_id=${id}`
    );
    return res.data;
};

export const addWaterHarvesting = async body => {
    const res = await axiosInstance.post(
        endpoints.water.water_harvesting.add_water_harvesting,
        body,
    );
    return res.data;
};

export const editWaterHarvesting = async body => {
    const res = await axiosInstance.put(
        endpoints.water.water_harvesting.update_water_harvesting,
        body,
    );
    return res.data;
};


// Water Disposal

export const getWaterDisposal = async (id) => {
    const res = await axiosInstance.get(
        endpoints.water.water_disposal.get_water_disposal + `?water_id=${id}`
    );
    return res.data;
};

export const addWaterDisposal = async body => {
    const res = await axiosInstance.post(
        endpoints.water.water_disposal.add_water_disposal,
        body,
    );
    return res.data;
};

export const editWaterDisposal = async body => {
    const res = await axiosInstance.put(
        endpoints.water.water_disposal.update_water_disposal,
        body,
    );
    return res.data;
};

// General Information
export const getWaterGeneralInfo = async (id) => {
const res = await axiosInstance.get(
    endpoints.water.general_information.get_general_information + `?water_id=${id}`
);
return res.data;
};

export const addWaterGeneralInfo = async body => {
    const res = await axiosInstance.post(
        endpoints.water.general_information.add_general_information,
        body,
    );
    return res.data;
};

export const editWaterGeneralInfo = async body => {
    const res = await axiosInstance.put(
        endpoints.water.general_information.update_general_information,
        body,
    );
    return res.data;
};