import { useQuery } from 'react-query';
import { getTargetsQueryKey } from '../api/targetsQueryKeys';
import { axiosGet } from '../utils/axiosFunctions';

export const useGetTargets = params => {
  const queryKey = getTargetsQueryKey(params);

  return useQuery(queryKey, () => axiosGet(queryKey));
};
