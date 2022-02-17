import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { getBatchesQueryKey } from '../../../../common/api/batchesQueryKeys';
import { axiosGet } from '../../../../common/utils/axiosFunctions';

export const useGetBatches = projectId => {
  const queryKey = getBatchesQueryKey(projectId);

  const { data, ...rest } = useQuery(queryKey, () => axiosGet(queryKey), {
    onError: err => console.error(err)
  });

  const batches = useMemo(() => {
    if (!data) {
      return [];
    }
    return data;
  }, [data]);

  return {
    batches,
    ...rest
  };
};
