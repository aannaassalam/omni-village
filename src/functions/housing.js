import axiosInstance from '../Helper/Helper';
import { endpoints } from '../Endpoints/endpoints';


export const getHousingDropdown = async (id) => {
    const res = await axiosInstance.get(
        endpoints.dropdown.get_housing_dropdown
    );
    return res.data;
};


export const getHousingByUser = async () => {
    const res = await axiosInstance.get(
        endpoints.housing.get_housing_by_user
    );
    return res.data;
};

export const addHousingByUser = async body => {
    console.log("bodyyyyy housing", body)
    const res = await axiosInstance.post(
        endpoints.housing.add_housing_by_user,
        body,
    );
    return res.data;
};

export const editHousingRequirement = async body => {
    console.log("bodyyyyy housing specification", body)
    const res = await axiosInstance.put(
        endpoints.housing.update_housing_requirement,
        body,
    );
    return res.data;
};

export const getHousingRequirement = async () => {
    const res = await axiosInstance.get(
        endpoints.housing.get_housing_requirement
    );
    return res.data;
};

export const editHousing = async body => {
    console.log("edit body hosuing", body)
    const res = await axiosInstance.put(
        endpoints.housing.update_housing,
        body,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return res.data;
};

export const getHousing = async (id) => {
    const res = await axiosInstance.get(
        endpoints.housing.get_housing + `?housing_id=${id}`
    );
    return res.data;
};