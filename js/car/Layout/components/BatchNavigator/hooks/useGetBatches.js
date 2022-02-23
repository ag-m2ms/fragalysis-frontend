import { useQuery } from 'react-query';
import { getBatchesQueryKey } from '../../../../common/api/batchesQueryKeys';
import { axiosGet } from '../../../../common/utils/axiosFunctions';

export const useGetBatches = projectId => {
  const queryKey = getBatchesQueryKey(projectId);

  return useQuery(queryKey, () => axiosGet(queryKey), {
    onError: err => console.error(err),
    suspense: true
  });
};
