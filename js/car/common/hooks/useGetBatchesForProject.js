import { useQuery } from 'react-query';
import { getBatchesQueryKey } from '../api/batchesQueryKeys';
import { axiosGet } from '../utils/axiosFunctions';

export const useGetBatchesForProject = projectId => {
  const queryKey = getBatchesQueryKey(projectId);

  return useQuery(queryKey, () => axiosGet(queryKey));
};
