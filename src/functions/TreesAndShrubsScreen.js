import {endpoints} from '../Endpoints/endpoints';
import axiosInstance from '../Helper/Helper';

export const fetchTrees = async () => {
  const res = await axiosInstance.post(endpoints.treeShrubs.fetch_tree);
  return res.data;
};

export const addTree = async body => {
  const res = await axiosInstance.post(endpoints.treeShrubs.add_trees, body);
  return res.data;
};

export const editTree = async body => {
  const res = await axiosInstance.post(endpoints.treeShrubs.edit_trees, body);
  return res.data;
};

export const deleteTree = async id => {
  const res = await axiosInstance.post(endpoints.treeShrubs.delete_trees, {
    id,
  });
  return res.data;
};
