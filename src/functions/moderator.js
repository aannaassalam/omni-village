import axiosInstance from '../Helper/Helper';
import { endpoints } from '../Endpoints/endpoints';


//NOTE: DEMOGRAPHIC API'S

// export const getLandholdingDropdown = async (id) => {
//     const res = await axiosInstance.get(
//         endpoints.dropdown.get_landholding_dropdown
//     );
//     return res.data;
// };

export const getModeratorDemographic = async (id) => {
    const res = await axiosInstance.get(
        endpoints.moderator.demographic.get_demographic + `?village_id=${id}`
    );
    return res.data;
};

export const addModeratorDemographic = async body => {
    console.log("body at demographic", body)
    const res = await axiosInstance.post(
        endpoints.moderator.demographic.add_demographic,
        body, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }
    );
    return res.data;
};

export const editModeratorDemographic = async body => {
    const res = await axiosInstance.put(
        endpoints.moderator.demographic.edit_demographic,
        body, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }
    );
    return res.data;
};


//NOTE: LANDHOLDING API'S

// export const getLandholdingDropdown = async (id) => {
//     const res = await axiosInstance.get(
//         endpoints.dropdown.get_landholding_dropdown
//     );
//     return res.data;
// };

export const getModeratorLandholding = async (id) => {
    const res = await axiosInstance.get(
        endpoints.moderator.landholding.get_landholding + `?village_id=${id}`
    );
    return res.data;
};

export const addModeratorLandholding = async body => {
    const res = await axiosInstance.post(
        endpoints.moderator.landholding.add_landholding,
        body,
    );
    return res.data;
};

export const editModeratorLandholding = async body => {
    const res = await axiosInstance.put(
        endpoints.moderator.landholding.edit_landholding,
        body,
    );
    return res.data;
};

// NOTE: WATER API'S

// export const getLandholdingDropdown = async (id) => {
//     const res = await axiosInstance.get(
//         endpoints.dropdown.get_landholding_dropdown
//     );
//     return res.data;
// };

export const getModeratorWater = async (id) => {
    const res = await axiosInstance.get(
        endpoints.moderator.water.get_water + `?village_id=${id}`
    );
    return res.data;
};

export const addModeratorWater = async body => {
    const res = await axiosInstance.post(
        endpoints.moderator.water.add_water,
        body,
    );
    return res.data;
};

export const editModeratorWater = async body => {
    const res = await axiosInstance.put(
        endpoints.moderator.water.edit_water,
        body,
    );
    return res.data;
};

// NOTE: ENERGY API'S

// export const getLandholdingDropdown = async (id) => {
//     const res = await axiosInstance.get(
//         endpoints.dropdown.get_landholding_dropdown
//     );
//     return res.data;
// };

export const getModeratorEnergy= async (id) => {
    const res = await axiosInstance.get(
        endpoints.moderator.energy.get_energy + `?village_id=${id}`
    );
    return res.data;
};

export const addModeratorEnergy = async body => {
    const res = await axiosInstance.post(
        endpoints.moderator.energy.add_energy,
        body,
    );
    return res.data;
};

export const editModeratorEnergy = async body => {
    const res = await axiosInstance.put(
        endpoints.moderator.energy.edit_energy,
        body,
    );
    return res.data;
};

// NOTE: MOBILITY API'S

// export const getLandholdingDropdown = async (id) => {
//     const res = await axiosInstance.get(
//         endpoints.dropdown.get_landholding_dropdown
//     );
//     return res.data;
// };

export const getModeratorMobility = async (id) => {
    const res = await axiosInstance.get(
        endpoints.moderator.mobility.get_mobility + `?village_id=${id}`
    );
    return res.data;
};

export const addModeratorMobility = async body => {
    const res = await axiosInstance.post(
        endpoints.moderator.mobility.add_mobility,
        body,
    );
    return res.data;
};

export const editModeratorMobility = async body => {
    const res = await axiosInstance.put(
        endpoints.moderator.mobility.edit_mobility,
        body,
    );
    return res.data;
};

// NOTE: FORESTRY API'S

// export const getLandholdingDropdown = async (id) => {
//     const res = await axiosInstance.get(
//         endpoints.dropdown.get_landholding_dropdown
//     );
//     return res.data;
// };

export const getModeratorForestry = async (id) => {
    const res = await axiosInstance.get(
        endpoints.moderator.forestry.get_forestry + `?village_id=${id}`
    );
    return res.data;
};

export const addModeratorForestry = async body => {
    const res = await axiosInstance.post(
        endpoints.moderator.forestry.add_forestry,
        body,
    );
    return res.data;
};

export const editModeratorForestry = async body => {
    const res = await axiosInstance.put(
        endpoints.moderator.forestry.edit_forestry,
        body,
    );
    return res.data;
};

// NOTE: BUSINESS COMMERCIAL API'S

// export const getLandholdingDropdown = async (id) => {
//     const res = await axiosInstance.get(
//         endpoints.dropdown.get_landholding_dropdown
//     );
//     return res.data;
// };

export const getModeratorBusiness = async (id) => {
    const res = await axiosInstance.get(
        endpoints.moderator.business_commercial.edit_business_commercial + `?village_id=${id}`
    );
    return res.data;
};

export const addModeratorBusiness = async body => {
    const res = await axiosInstance.post(
        endpoints.moderator.business_commercial.add_business_commercial,
        body,
    );
    return res.data;
};

export const editModeratorBusiness = async body => {
    const res = await axiosInstance.put(
        endpoints.moderator.business_commercial.edit_business_commercial,
        body,
    );
    return res.data;
};

// NOTE: COMMUNITY INFRASTRUCTURE API'S

// export const getLandholdingDropdown = async (id) => {
//     const res = await axiosInstance.get(
//         endpoints.dropdown.get_landholding_dropdown
//     );
//     return res.data;
// };

export const getModeratorCommunityInfrastructure = async (id) => {
    const res = await axiosInstance.get(
        endpoints.moderator.community_infrastructure.get_community_infrastructure + `?village_id=${id}`
    );
    return res.data;
};

export const addModeratorCommunityInfrastructure = async body => {
    const res = await axiosInstance.post(
        endpoints.moderator.community_infrastructure.add_community_infrastructure,
        body,
    );
    return res.data;
};

export const editModeratorCommunityInfrastructure = async body => {
    const res = await axiosInstance.put(
        endpoints.moderator.community_infrastructure.edit_community_infrastructure,
        body,
    );
    return res.data;
};