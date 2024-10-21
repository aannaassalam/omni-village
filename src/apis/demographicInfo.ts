import axios from "axios";
import { BASE_URL } from "../../env";
import { endpoints } from "../endpoints/endpoints";


export const get_demographic = async () => {
  const res = await axios.get(
    BASE_URL + endpoints?.demographicInfo?.get_demographic
  );
  return res.data;
};
export const add_demographic = async (body: any) => {
  console.log("bosydyydydydyd", body)
  const res = await axios.post(
    BASE_URL + endpoints?.demographicInfo?.add_demographic,
    body,
  );
  return res.data;
};
export const edit_demographic = async (body: any) => {
  const res = await axios.put(
    BASE_URL + endpoints?.demographicInfo?.edit_demographic,
    body,
  );
  return res.data;
};

export const delete_demographic = async (id: any) => {
  const res = await axios.delete(
    BASE_URL + endpoints?.demographicInfo?.delete_demographic+id
  );
  return res.data;
};