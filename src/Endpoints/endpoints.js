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
};
