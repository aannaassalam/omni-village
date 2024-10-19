import axios from "axios";
import { BASE_URL } from "../../env";
import { endpoints } from "../endpoints/endpoints";

export const add_total_land = async (body: any) => {
  const res = await axios.put(BASE_URL + endpoints?.food?.production?.total_land, body);
  return res.data;
};
export const get_cultivation = async () => {
  const res = await axios.get(
    BASE_URL + endpoints?.food?.production?.get_cultivation
  );
  return res.data;
};
export const add_cultivation = async (body: any) => {
  const res = await axios.post(
    BASE_URL + endpoints?.food?.production?.add_cultivation,
    body,
  );
  return res.data;
};
export const edit_cultivation = async (body: any) => {
  console.log("bodyyyyy", body)
  const res = await axios.put(
    BASE_URL + endpoints?.food?.production?.edit_cultivation,
    body,
  );
  return res.data;
};

export const delete_cultivation = async (id: any) => {
  const res = await axios.delete(
    BASE_URL + endpoints?.food?.production?.delete_cultivation+id
  );
  return res.data;
};
