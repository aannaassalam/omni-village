import axiosInstance from '../Helper/Helper';
import { endpoints } from '../Endpoints/endpoints';
export const getBusinessDropdown = async () => {
    const res = await axiosInstance.get(
        endpoints.dropdown.get_business_dropdown
    );
    return res.data;
};


export const getBusinessByUser = async (type) => {
    const res = await axiosInstance.get(
        endpoints.business_commercial.get_business_by_user
    );
    return res.data;
};

export const addBusinessByUser = async body => {
    const res = await axiosInstance.post(
        endpoints.business_commercial.add_business_by_user,
        body,
    );
    return res.data;
};

export const getBusiness = async (id) => {
    const res = await axiosInstance.get(
        endpoints.business_commercial.get_business +`?business_id=${id}`
    );
    return res.data;
};
export const editBusiness = async body => {
    const res = await axiosInstance.put(
        endpoints.business_commercial.update_business,
        body,
    );
    return res.data;
};

export const getBusinessRequirement = async (id) => {
    const res = await axiosInstance.get(
        endpoints.business_commercial.business_requirement.get_business_requirement
    );
    return res.data;
};
export const editBusinessRequirement = async body => {
    const res = await axiosInstance.put(
        endpoints.business_commercial.business_requirement.edit_business_requirement,
        body,
    );
    return res.data;
};