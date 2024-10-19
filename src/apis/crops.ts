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
