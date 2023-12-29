import {useQuery} from '@tanstack/react-query';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';
import {storage} from '../Helper/Storage';

export const useUser = () => {
  const token = storage.getString('token');
  // console.log(token, 'token');
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoints.auth.getUser);
      return res.data;
    },
    enabled: !!token,
    refetchOnWindowFocus: true,
    staleTime: 0,
    // gcTime: 0,
  });
};
