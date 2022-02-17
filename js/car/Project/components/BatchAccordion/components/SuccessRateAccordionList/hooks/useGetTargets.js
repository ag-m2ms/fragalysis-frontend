import { useQuery } from 'react-query';
import { getTargetsQueryKey } from '../../../../../../common/api/targetsQueryKeys';
import { axiosGet } from '../../../../../../common/utils/axiosFunctions';

export const useGetTargets = batchId => {
  const queryKey = getTargetsQueryKey(batchId);

  return useQuery(queryKey, () => axiosGet(queryKey), {
    onError: err => console.error(err)
  });
};
