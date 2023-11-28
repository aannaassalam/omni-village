import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

export const fetchHuntings = async(name) =>{
  const res = await axiosInstance.get(
        endpoints.hunting.fetch_hunting
      );
return res.data;
}

export const addHunting = async(body) =>{
  const res = await axiosInstance.post(
        endpoints.hunting.add_hunting, {
        number_hunted: body?.number_hunted,
        ...body?.utilisation_information,
        income_from_sale: body?.income_from_sale,
        expenditure_on_inputs: body?.expenditure_on_inputs,
        weight_measurement: body?.weight_measurement,
        yeild: body?.yeild,
        processing_method: body?.processing_method,
        status: body?.status,
        hunting_crop_id: body?.crop_id,
      }
      );
return res.data;
}

export const editHunting = async(body) =>{
  const res = await axiosInstance.post(
        endpoints.hunting.edit_hunting, {
        number_hunted: body?.number_hunted,
        ...body?.utilisation_information,
        income_from_sale: body?.income_from_sale,
        expenditure_on_inputs: body?.expenditure_on_inputs,
        weight_measurement: body?.weight_measurement,
        yeild: body?.yeild,
        processing_method: body?.processing_method,
        status: body?.status,
        hunting_id: body?.crop_id,
      }
      );
return res.data;
}

export const deleteHunting = async(id) =>{
  const res = await axiosInstance.delete(
         endpoints.hunting.delete_hunting + `/${id}`
      );
return res.data;
}
