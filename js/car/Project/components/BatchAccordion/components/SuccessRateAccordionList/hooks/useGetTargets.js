import { useQuery } from 'react-query';
import { getTargetsQueryKey } from '../../../../../../common/api/targetsQueryKeys';
import { axiosGet } from '../../../../../../common/utils/axiosFunctions';
import { useMemo } from 'react';

export const useGetTargets = batch => {
  const queryKey = getTargetsQueryKey(batch.id);

  const { data, ...rest } = useQuery(queryKey, () => axiosGet(queryKey), {
    onError: err => console.error(err)
  });

  const targetsWithBatch = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map(target => ({
      batch,
      target
    }));
  }, [data, batch]);

  return {
    targetsWithBatch,
    ...rest
  };
};
