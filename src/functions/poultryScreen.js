import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

export const fetchPoultries = async(name) =>{
  const res = await axiosInstance.get(endpoints.poultry.fetch_poultry);
return res.data;
}

export const addPoultry = async(body) =>{
  const res = await axiosInstance.post(
        endpoints.poultry.add_poultry, {
        ...body?.important_information,
        personal_information: body?.utilisation_information,
        income_from_sale: body?.income_from_sale,
        expenditure_on_inputs: body?.expenditure_on_inputs,
        avg_age_time_period: 'years',
        steroids: body?.steroids,
        status: body?.status,
        products: body?.productDetails,
        status: body?.status,
        poultry_crop_id: body?.crop_id,
      }
      );
return res.data;
}

export const editPoultry = async(body) =>{
  const res = await axiosInstance.post(
        endpoints.poultry.edit_poultry, {
        ...body?.important_information,
        personal_information: body?.utilisation_information,
        income_from_sale: body?.income_from_sale,
        expenditure_on_inputs: body?.expenditure_on_inputs,
        avg_age_time_period: 'years',
        steroids: body?.processing_method,
        products: body?.productDetails,
        status: body?.status,
        poultry_id: body?.crop_id,
      }
      );
return res.data;
}

export const deletePoultry = async(id) =>{
  const res = await axiosInstance.delete(
        endpoints.poultry.delete_poultry + `/${id}`
      );
return res.data;
}
