import { useMemo } from 'react';
import { getMethodsQueryKey } from '../api/methodsQueryKeys';
import { axiosGet } from '../utils/axiosFunctions';
import { useGetTargetsForBatch } from './useGetTargetsForBatch';
import { useSuspendingQueries } from './useSuspendingQueries';

export const useGetMethodsForBatch = batchId => {
  const { data: targets } = useGetTargetsForBatch(batchId);

  return useSuspendingQueries(
    useMemo(() => {
      return (
        targets?.map(target => {
          const queryKey = getMethodsQueryKey(target.id);

          return {
            queryKey,
            queryFn: () => axiosGet(queryKey)
          };
        }) || []
      );
    }, [targets])
  );
};
