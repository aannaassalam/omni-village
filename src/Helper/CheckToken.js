import {storage} from './Storage';

export const CheckToken = () => {
  const token = storage.getString('token');
  if (token !== undefined || token !== null) {
    return true;
  } else {
    return false;
  }
};
