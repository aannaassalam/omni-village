import axios from 'axios';
import {BASE_URL} from '../../env';
import {endpoints} from '../endpoints/endpoints';

export const get_crops = async (body: any) => {
  const res = await axios.get(
    BASE_URL + endpoints?.crops?.get_crops + `&country=${body?.country}&category=${body?.category}`,
    body,
  );
  return res.data;
};

export const add_crops = async (body: any) => {
  const res = await axios.post(
    BASE_URL +
      endpoints?.crops?.add_crops,
    body,
  );
  return res.data;
};

// NOTE:Feeds

export const get_feeds = async (body: any) => {
  const res = await axios.get(
    BASE_URL +
      endpoints?.feeds?.get_feeds +
      `&country=${body?.country}&type=${body?.category}`,
    body,
  );
  return res.data;
};

export const add_feeds = async (body: any) => {
  const res = await axios.post(BASE_URL + endpoints?.feeds?.add_feeds, body);
  return res.data;
};

// NOTE: Consumption Crop
export const get_consumption_type = async (body: any) => {
  const res = await axios.get(
    BASE_URL +
      endpoints?.food?.consumption?.get_consumption_type +
      `&language=${body?.lang}`,
    body,
  );
  return res.data;
};

export const get_consumption_crop = async (body: any) => {
  const res = await axios.get(
    BASE_URL +
      endpoints?.food?.consumption?.get_consumption_crop +
      `language=${body?.lang}&country=${body?.country}&label=${body?.label}`,
    body,
  );
  return res.data;
};

