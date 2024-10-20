import axios from "axios";
import { BASE_URL } from "../../env";
import { endpoints } from "../endpoints/endpoints";

export const add_total_land = async (body: any) => {
  const res = await axios.put(BASE_URL + endpoints?.food?.production?.total_land, body);
  return res.data;
};
// NOTE: CULTIVATION
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

// NOTE: TREES

export const get_trees = async () => {
  const res = await axios.get(BASE_URL + endpoints?.food?.production?.get_trees);
  return res.data
}

export const add_trees = async (body: any) => {
  console.log("datata", body)
  const res = await axios.post(
    BASE_URL + endpoints?.food?.production?.add_tress,
    body,
  );
  return res.data;
};
export const edit_trees = async (body: any) => {
  const res = await axios.put(
    BASE_URL + endpoints?.food?.production?.edit_trees,
    body,
  );
  return res.data;
};

export const delete_trees = async (id: any) => {
  const res = await axios.delete(
    BASE_URL + endpoints?.food?.production?.delete_trees + id,
  );
  return res.data;
};

// NOTE:POULTRY
export const get_poultry = async () => {
  const res = await axios.get(
    BASE_URL + endpoints?.food?.production?.get_poultry,
  );
  return res.data;
};

export const add_poultry = async (body: any) => {
  console.log("body", body)
  const res = await axios.post(
    BASE_URL + endpoints?.food?.production?.add_poultry,
    body,
  );
  return res.data;
};
export const edit_poultry = async (body: any) => {
  const res = await axios.put(
    BASE_URL + endpoints?.food?.production?.edit_poultry,
    body,
  );
  return res.data;
};

export const delete_poultry = async (id: any) => {
  const res = await axios.delete(
    BASE_URL + endpoints?.food?.production?.delete_poultry + id,
  );
  return res.data;
};

// NOTE:FISHERY

export const get_fishery = async (type:any) => {
  const res = await axios.get(
    BASE_URL + endpoints?.food?.production?.get_fishery+type,
  );
  return res.data;
};

export const add_fishery = async (body: any) => {
  console.log('body', body);
  const res = await axios.post(
    BASE_URL + endpoints?.food?.production?.add_fishery,
    body,
  );
  return res.data;
};
export const edit_fishery = async (body: any) => {
  const res = await axios.put(
    BASE_URL + endpoints?.food?.production?.edit_fishery,
    body,
  );
  return res.data;
};

export const delete_fishery = async (id: any) => {
  const res = await axios.delete(
    BASE_URL + endpoints?.food?.production?.delete_fishery + id,
  );
  return res.data;
};
// NOTE:HUNTING
export const get_hunting = async () => {
  const res = await axios.get(
    BASE_URL + endpoints?.food?.production?.get_hunting,
  );
  return res.data;
};

export const add_hunting = async (body: any) => {
  const res = await axios.post(
    BASE_URL + endpoints?.food?.production?.add_hunting,
    body,
  );
  return res.data;
};
export const edit_hunting= async (body: any) => {
  const res = await axios.put(
    BASE_URL + endpoints?.food?.production?.edit_hunting,
    body,
  );
  return res.data;
};

export const delete_hunting = async (id: any) => {
  const res = await axios.delete(
    BASE_URL + endpoints?.food?.production?.delete_hunting + id,
  );
  return res.data;
};
// NOTE:SELLING CHANNEL
export const get_selling_channel = async () => {
  const res = await axios.get(
    BASE_URL + endpoints?.food?.production?.get_selling_channel,
  );
  return res.data;
};

export const add_selling_channel = async (body: any) => {
  const res = await axios.post(
    BASE_URL + endpoints?.food?.production?.add_selling_channel,
    body,
  );
  return res.data;
};
export const edit_selling_channel = async (body: any) => {
  const res = await axios.put(
    BASE_URL + endpoints?.food?.production?.edit_selling_channel,
    body,
  );
  return res.data;
};

export const delete_selling_channel = async (id: any) => {
  const res = await axios.delete(
    BASE_URL + endpoints?.food?.production?.delete_selling_channel + id,
  );
  return res.data;
};

// NOTE:STORAGE
export const get_storage = async () => {
  const res = await axios.get(
    BASE_URL + endpoints?.food?.production?.get_storage,
  );
  return res.data;
};

export const add_storage = async (body: any) => {
  console.log('body', body);
  const res = await axios.post(
    BASE_URL + endpoints?.food?.production?.add_storage,
    body,
  );
  return res.data;
};
export const edit_storage = async (body: any) => {
  const res = await axios.put(
    BASE_URL + endpoints?.food?.production?.edit_storage,
    body,
  );
  return res.data;
};

export const delete_storage = async (id: any) => {
  const res = await axios.delete(
    BASE_URL + endpoints?.food?.production?.delete_storage + id,
  );
  return res.data;
};

// NOTE:STORAGE METHOD
export const get_storage_method = async () => {
  const res = await axios.get(
    BASE_URL + endpoints?.food?.production?.get_storage_method,
  );
  return res.data;
};

export const add_storage_method = async (body: any) => {
  console.log('body', body);
  const res = await axios.post(
    BASE_URL + endpoints?.food?.production?.add_storage_method,
    body,
  );
  return res.data;
};

// NOTE:CONSUMPTION
export const get_consumption = async (id:any) => {
  const res = await axios.get(
    BASE_URL + endpoints?.food?.consumption?.get_consumption+id,
  );
  return res.data;
};
export const add_consumption = async (body: any) => {
  const res = await axios.post(
    BASE_URL + endpoints?.food?.consumption?.add_consumption,
    body,
  );
  return res.data;
};
export const edit_consumption = async (body: any) => {
  const res = await axios.put(
    BASE_URL + endpoints?.food?.consumption?.edit_consumption,
    body,
  );
  return res.data;
};

export const delete_consumption = async (id: any) => {
  const res = await axios.delete(
    BASE_URL + endpoints?.food?.consumption?.delete_consumption + id,
  );
  return res.data;
};