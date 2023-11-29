import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

export const fetchStorages = async() =>{
  const res = await axiosInstance.get(
        endpoints.storage.fetch_storage
      );
return res.data;
}

export const addStorage = async(body) =>{
  const res = await axiosInstance.post(
        endpoints.storage.add_storage, {
        storages: body,
      }
      );
return res.data;
}

export const editStorage = async(body) =>{
  const res = await axiosInstance.post(
        endpoints.storage.edit_storage, {
        storages: body,
      }
      );
return res.data;
}

export const deleteStorage = async(id) =>{
  const res = await axiosInstance.delete(
        endpoints.storage.delete_storage + `/${id}`
      );
return res.data;
}
