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

export const editBusinessByUser = async body => {
    const res = await axiosInstance.put(
        endpoints.business_commercial.edit_business_by_user,
        body,
    );
    return res.data;
};
export const getNumberOfBusiness = async () => {
    const res = await axiosInstance.get(
        endpoints.business_commercial.get_number_of_business
    );
    return res.data;
};
export const getBusinessById = async (id) => {
    const res = await axiosInstance.get(
        endpoints.business_commercial.get_business_details +`?business_id=${id}`
    );
    return res.data;
};

export const addBusiness = async body => {
    const res = await axiosInstance.post(
        endpoints.business_commercial.add_business,
        body,
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
export const deleteBusiness = async (id) => {
    const res = await axiosInstance.delete(
        endpoints.business_commercial.delete_business + `id=${id}`
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