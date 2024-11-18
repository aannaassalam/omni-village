import axiosInstance from '../Helper/Helper';
import { endpoints } from '../Endpoints/endpoints';
export const getOtherPersonalDropdown = async () => {
    const res = await axiosInstance.get(
        endpoints.dropdown.get_other_personal
    );
    return res.data;
};


export const getOtherPersonal = async (type) => {
    const res = await axiosInstance.get(
        endpoints.other_personal_household.get_other_personal_household + `?type=${type}`
    );
    return res.data;
};

export const addOtherPersonal = async body => {
    const res = await axiosInstance.post(
        endpoints.other_personal_household.add_other_personal_household,
        body,
    );
    return res.data;
};

export const editOtherPersonal = async body => {
    const res = await axiosInstance.put(
        endpoints.other_personal_household.update_other_personal_household,
        body,
    );
    return res.data;
};