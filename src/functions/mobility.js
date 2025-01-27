import axiosInstance from '../Helper/Helper';
import { endpoints } from '../Endpoints/endpoints';

export const getMobilityDropdown = async () => {
    const res = await axiosInstance.get(
        endpoints.dropdown.get_mobility_dropdown
    );
    return res.data;
};

export const getMobilityByUser = async () => {
    const res = await axiosInstance.get(
        endpoints.mobility.get_mobility_by_user
    );
    return res.data;
};

export const getNumberOfMobility = async () => {
    const res = await axiosInstance.get(
        endpoints.mobility.get_number_of_mobility
    );
    return res.data;
};
export const addMobilityByUser = async body => {
    const res = await axiosInstance.post(endpoints.mobility.add_mobility_by_user, body);
    return res.data;
}

export const editMobilityByUser = async body => {
    const res = await axiosInstance.put(
        endpoints.mobility.edit_mobility_by_user,
        body,
    );
    return res.data;
};

export const getMobilityById = async (id) => {
    const res = await axiosInstance.get(
        endpoints.mobility.get_mobility_details + `?mobility_id=${id}`
    );
    return res.data;
};

export const addMobility = async body => {
    const res = await axiosInstance.post(endpoints.mobility.add_mobility, body);
    return res.data;
}
export const editMobility = async body => {
    const res = await axiosInstance.put(
        endpoints.mobility.update_mobility,
        body,
    );
    return res.data;
};

export const deleteMobility = async (id) => {
    const res = await axiosInstance.delete(
        endpoints.mobility.delete_mobility + `id=${id}`
    );
    return res.data;
};
export const getMobilityRequirement = async (id) => {
    const res = await axiosInstance.get(
        endpoints.mobility.get_mobility_requirement
    );
    return res.data;
};

export const editMobilityRequirement = async body => {
    const res = await axiosInstance.put(
        endpoints.mobility.update_mobility_requirement,
        body,
    );
    return res.data;
};

