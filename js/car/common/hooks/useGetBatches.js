import { useQuery } from 'react-query';
import { getBatchesQueryKey } from '../api/batchesQueryKeys';
import { axiosGet } from '../utils/axiosFunctions';

export const useGetBatches = projectId => {
  const queryKey = getBatchesQueryKey(projectId);

  return useQuery(queryKey, () => axiosGet(queryKey), {
    suspense: true
  });
};
