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
};
