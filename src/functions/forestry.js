import axiosInstance from '../Helper/Helper';
import { endpoints } from '../Endpoints/endpoints';
export const getForestryDropdown = async () => {
    const res = await axiosInstance.get(
        endpoints.dropdown.get_energy_dropdown
    );
    return res.data;
};


export const getForestry = async (type) => {
    const res = await axiosInstance.get(
        endpoints.forestry_timber.get_forestry_timber + `?type=${type}`
    );
    return res.data;
};

export const addForestryGeneralInformation = async body => {
    const res = await axiosInstance.post(
        endpoints.forestry_timber.general_information.add_general_information,
        body,
    );
    return res.data;
};

export const editForestryGeneralInformation = async body => {
    const res = await axiosInstance.put(
        endpoints.forestry_timber?.general_information.edit_general_information,
        body,
    );
    return res.data;
};

export const addForestryTimberNeeds = async body => {
    const res = await axiosInstance.post(
        endpoints.forestry_timber.timber_needs.add_timber_needs,
        body,
    );
    return res.data;
};

export const editForestryTimberNeeds = async body => {
    const res = await axiosInstance.put(
        endpoints.forestry_timber?.timber_needs.edit_timber_needs,
        body,
    );
    return res.data;
};

export const addForestryOtherNeeds = async body => {
    const res = await axiosInstance.post(
        endpoints.forestry_timber.other_needs.add_other_needs,
        body,
    );
    return res.data;
};

export const editForestryOtherNeeds = async body => {
    const res = await axiosInstance.put(
        endpoints.forestry_timber?.other_needs.edit_other_needs,
        body,
    );
    return res.data;
};