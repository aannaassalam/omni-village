import { storage } from './Storage';

export const GetVillageId = () => {
    const village_id = storage.getString('village_id');
    if (village_id !== undefined || village_id !== null) {
        return village_id;
    } else {
        return null;
    }
};
