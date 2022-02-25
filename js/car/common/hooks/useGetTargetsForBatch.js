import { useQuery } from 'react-query';
import { getTargetsQueryKey } from '../api/targetsQueryKeys';
import { axiosGet } from '../utils/axiosFunctions';

export const useGetTargetsForBatch = batchId => {
  const queryKey = getTargetsQueryKey(batchId);

  return useQuery(queryKey, () => axiosGet(queryKey), {
    onError: err => console.error(err)
  });
};
