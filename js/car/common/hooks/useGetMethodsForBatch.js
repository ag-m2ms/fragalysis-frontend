import { useMemo } from 'react';
import { getMethodsQueryKey } from '../api/methodsQueryKeys';
import { axiosGet } from '../utils/axiosFunctions';
import { useGetTargetsForBatch } from './useGetTargetsForBatch';
import { useSuspendedQueries } from './useSuspendedQueries';

export const useGetMethodsForBatch = batchId => {
  const { data: targets } = useGetTargetsForBatch(batchId);

  return useSuspendedQueries(
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
