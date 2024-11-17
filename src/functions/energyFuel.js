import axiosInstance from '../Helper/Helper';
import { endpoints } from '../Endpoints/endpoints';

export const getEnergyDropdown = async () => {
    const res = await axiosInstance.get(
        endpoints.dropdown.get_energy_dropdown
    );
    return res.data;
};

export const getEnergyByType = async (type) => {
    const res = await axiosInstance.get(
        endpoints.energyFuel.get_energy_by_type+`?type=${type}`
    );
    return res.data;
};

// ELECTRICITY

export const addElectricty = async body => {
    const res = await axiosInstance.post(
        endpoints.energyFuel.electricity.add_electricity,
        body,
    );
    return res.data;
};

export const editElectricty = async body => {
    const res = await axiosInstance.put(
        endpoints.energyFuel.electricity.edit_electricity,
        body,
    );
    return res.data;
};

//PETROL,DIESEL,NATURAL GAS

export const addPetrolDieselNatural = async body => {
    const res = await axiosInstance.post(
        endpoints.energyFuel.petrol_diesel_natural_gas.add_petrol_diesel_natural_gas,
        body,
    );
    return res.data;
};

export const editPetrolDieselNatural = async body => {
    const res = await axiosInstance.put(
        endpoints.energyFuel.petrol_diesel_natural_gas.edit_petrol_diesel_natural_gas,
        body,
    );
    return res.data;
};


// OTHERS

export const addOthers = async body => {
    const res = await axiosInstance.post(
        endpoints.energyFuel.other.add_other_energy,
        body,
    );
    return res.data;
};

export const editOthers = async body => {
    const res = await axiosInstance.put(
        endpoints.energyFuel.other.edit_other_energy,
        body,
    );
    return res.data;
};


// General Information
export const addGeneralInformation = async body => {
    const res = await axiosInstance.post(
        endpoints.energyFuel.general_information.add_general_information,
        body,
    );
    return res.data;
};

export const editGeneralInformation = async body => {
    const res = await axiosInstance.put(
        endpoints.energyFuel.general_information.edit_general_information,
        body,
    );
    return res.data;
};