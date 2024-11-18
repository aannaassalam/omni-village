export const endpoints = {
  auth: {
    otp: '/user/send_otp',
    register: '/user/register',
    login: '/user/login',
    editUser: '/user/edit_user',
    getUser: '/user/current_user',
    landAllocation: '/user/land_allocation',
    cultivationLandAllocation: '/user/cultivation_land_allocation',
  },
  cultivation: {
    fetchCultivation: '/cultivation',
    addCultivation: '/cultivation/add_cultivation',
    editCultivation: '/cultivation/edit_cultivation',
    deleteCultivation: '/cultivation/delete_cultivation',
  },
  crop: {
    getCrop: '/crop',
    getCropCategories: '/crop/crop_categories',
    editCrop: '/crop/edit_crop',
    addCrop: '/crop/add_crop',
    deleteCrop: '/crop',
  },
  treeCrop: {
    get_tree_crop: '/tree_crop/',
    add_tree_crop: '/tree_crop/add_tree_crop',
  },
  treeShrubs: {
    fetch_tree: '/trees',
    add_trees: '/trees/add_tree',
    edit_trees: '/trees/edit_tree',
    delete_trees: '/trees/delete_tree',
  },
  huntingCrop: {
    get_hunting_crop: '/hunting_crop/',
    add_hunting_crop: '/hunting_crop/add_hunting_crop',
  },
  hunting: {
    fetch_hunting: '/hunting',
    add_hunting: '/hunting/add_hunting',
    edit_hunting: '/hunting/edit_hunting',
    delete_hunting: '/hunting/delete_hunting',
  },
  poultryCrop: {
    get_poultry_crop: '/poultry_crop/',
    add_poultry_crop: '/poultry_crop/add_poultry_crop',
  },
  poultry: {
    fetch_poultry: '/poultry',
    add_poultry: '/poultry/add_poultry',
    edit_poultry: '/poultry/edit_poultry',
    delete_poultry: '/poultry/delete_poultry',
  },
  fisheryCrop: {
    get_fishery_crop: '/fishery_crop/',
    add_fishery_crop: '/fishery_crop/add_fishery_crop',
  },
  fishery: {
    fetch_fishery: '/fishery',
    add_fishery: '/fishery/add_fishery',
    edit_fishery: '/fishery/edit_fishery',
    delete_fishery: '/fishery/delete_fishery',
  },
  storageMethod: {
    get_storage_method: '/storage_method/',
    add_storage_method: '/storage_method/add_storage_method',
  },
  storage: {
    fetch_storage: '/storage',
    add_storage: '/storage/add_storage',
    edit_storage: '/storage/edit_storage',
    delete_storage: '/storage/delete_storage',
  },
  sellingChannelMethod: {
    get_selling_channel_method: '/selling_channel_method/',
  },
  sellingChannel: {
    fetch_selling_channel: '/selling_channel',
    add_selling_channel: '/selling_channel/add_selling_channel',
    edit_selling_channel: '/selling_channel/edit_selling_channel',
    delete_selling_channel: '/selling_channel/delete_selling_channel',
  },
  measurement: {
    get_measurement: '/weight_measurements/',
    fish_feed: '/fish_feeds/',
    feed: '/feeds/',
    village: '/villages/',
    landmeasurement: '/land_measurements/',
  },
  consumtionCrop: {
    get_consumption_crop: '/consumption_crop/',
    add_consumption_crop: '/consumption_crop/add_consumption_crop',
  },
  consumtionType: {
    fetch_consumption_type: '/consumption_type',
    add_consumption_type: '/consumption_type/add_consumption_type',
    edit_consumtion_type: '/consumption_type/edit_consumption_type',
    delete_consumption_type: '/consumption_type/',
  },
  consumtion: {
    fetch_consumption: '/consumption',
    add_consumption: '/consumption/add_consumption',
    edit_consumtion: '/consumption/edit_consumption',
    delete_consumption: '/consumption/delete_consumption',
  },
  dropdown: {
    get_dropdown: '/demographic_dropdown/',
    get_landholding_dropdown:'/landholding-dropdown',
    get_housing_dropdown:'/housing-dropdown',
    get_water_dropdown:'/water-dropdown',
    get_energy_dropdown:'/energy-dropdown',
    get_mobility_dropdown:'/mobility-dropdown',
    get_forestry_dropdown:'/forestry-dropdown',
    get_other_personal: '/other-personal-dropdown',
  },
  demographic: {
    add_demographic: '/demographic/add_demographic_info',
    edit_demographic: '/demographic/update_demographic_info_by_id',
    get_demographic: '/demographic/get_demographic_info_by_id',
  },
  landholding:{
    get_landholding_by_user:'/landholding-by-user/',
    add_landholding_by_user:'/landholding-by-user/add-landholding-by-user',
    get_landholding:'/landholding',
    update_landholding:'/landholding/update-landholding',
    update_landspecification: '/landholding-by-user/edit-landholding-requirements',
    get_landspecification: '/landholding-by-user/landholding-requirements'
  },
  housing:{
    get_housing_by_user:'/housing-by-user/',
    add_housing_by_user:'/housing-by-user/add-housing-by-user',
    get_housing:'/housing',
    update_housing:'/housing/update-housing',
    get_housing_requirement: '/housing-by-user/housing-requirements',
    update_housing_requirement: '/housing-by-user/edit-housing-requirements',
  },
  water:{
    get_water_by_user:'/water/get-water-by-user',
    water_usage:{
      get_water_usage:'/water/get-water-usage-info',
      add_water_usage:'/water/add-water-usage-info',
      update_water_usage:'/water/edit-water-usage-info',
    },
    water_harvesting:{
      get_water_harvesting:'/water/get-water-harvesting-capacity',
      add_water_harvesting:'/water/add-water-harvesting-capacity',
      update_water_harvesting:'/water/edit-water-harvesting-capacity',
    },
    water_disposal:{
      get_water_disposal:'/water/get-wastewater-disposal',
      add_water_disposal:'/water/add-wastewater-disposal',
      update_water_disposal:'/water/edit-wastewater-disposal',
    },
    general_information:{
      get_general_information:'/water/get-general-info',
      add_general_information: '/water/add-general-info',
      update_general_information:'/water/edit-general-info',
    }
  },
  energyFuel:{
    get_energy_by_type:'/energy/get-energy-information',
    electricity:{
      add_electricity:'/energy/add-electricity-information',
      edit_electricity:'/energy/edit-electricity-information',
    },
    petrol_diesel_natural_gas:{
      add_petrol_diesel_natural_gas:'/energy/add-petrol-diesel-information',
      edit_petrol_diesel_natural_gas:'/energy/edit-petrol-diesel-information',
    },
    other:{
      add_other_energy:'/energy/add-other-information',
      edit_other_energy:'/energy/edit-other-information',
    },
    general_information:{
      add_general_information: '/energy/add-general-info',
      edit_general_information:'/energy/edit-general-info',
    }
  },
  mobility:{
    get_mobility_by_user:'/mobility-by-user/',
    add_mobility_by_user:'/mobility-by-user/add-mobility-by-user',
    get_mobility:'/mobility',
    update_mobility:'/mobility/update-mobility',
    get_mobility_requirement: '/mobility-by-user/mobility-requirements',
    update_mobility_requirement: '/mobility-by-user/edit-mobility-requirements',
  },
  forestry_timber:{
    get_forestry_timber:'/forestry',
    general_information:{
      add_general_information: '/forestry/add-general-information',
      edit_general_information:'/forestry/edit-general-information',
    },
    timber_needs:{
      add_timber_needs:'/forestry/add-timber-needs',
      edit_timber_needs:'/forestry/edit-timber-needs',
    },
    other_needs:{
      add_other_needs:'/forestry/add-other-needs',
      edit_other_needs:'/forestry/edit-other-needs',
    }
  },
  other_personal_household:{
    get_other_personal_household:'/other-personal-household-items',
    add_other_personal_household:'/other-personal-household-items/add-personal-household-items',
    update_other_personal_household:'/other-personal-household-items/edit-personal-household-items',
  }
};
