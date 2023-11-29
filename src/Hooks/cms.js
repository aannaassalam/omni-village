import {useQuery} from '@tanstack/react-query';
import axiosInstance from '../Helper/Helper';
import {endpoints} from '../Endpoints/endpoints';

export const useLandMeasurement = () => {
  return useQuery({
    queryKey: ['land_measurement'],
    queryFn: async () => {
      const res = await axiosInstance.get(
        endpoints.measurement.landmeasurement,
      );
      return res.data;
    },
    refetchOnWindowFocus: true,
  });
};

export const useVillages = village => {
  return useQuery({
    queryKey: ['villages'],
    queryFn: async () => {
      const res = await axiosInstance.get(
        endpoints.measurement.village + `${village}`,
      );
      return res?.data;
    },
    refetchOnWindowFocus: true,
  });
};
