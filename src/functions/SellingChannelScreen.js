import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

export const fetchSellingChannels = async () => {
  const res = await axiosInstance.get(
    endpoints.sellingChannel.fetch_selling_channel,
  );
  return res.data;
};

export const addSellingChannel = async body => {
  const res = await axiosInstance.post(
    endpoints.sellingChannel.add_selling_channel,
    {
      selling_channel_names: body,
    },
  );
  return res.data;
};

export const editSellingChannel = async body => {
  const res = await axiosInstance.post(
    endpoints.sellingChannel.edit_selling_channel,
    {
      selling_channel_id: body?.selling_channel_id,
      selling_channel_names: body?.selling_channel_names,
    },
  );
  return res.data;
};
