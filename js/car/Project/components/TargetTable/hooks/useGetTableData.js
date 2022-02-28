import { useMemo } from 'react';
import { getMethodsQueryKey } from '../../../../common/api/methodsQueryKeys';
import { getReactionsQueryKey } from '../../../../common/api/reactionsQueryKeys';
import { useGetTargetsForBatch } from '../../../../common/hooks/useGetTargetsForBatch';
import { useSuspendingQueries } from '../../../../common/hooks/useSuspendingQueries';
import { axiosGet } from '../../../../common/utils/axiosFunctions';
import { useBatchContext } from '../../../hooks/useBatchContext';

export const useGetTableData = () => {
  const batch = useBatchContext();

  const { data: targets } = useGetTargetsForBatch(batch.id);

  const methodsResponses = useSuspendingQueries(
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

  const targetsMethods = useMemo(() => {
    return methodsResponses.filter(result => result.isSuccess).map(result => result.data);
  }, [methodsResponses]);

  const reactionsResponses = useSuspendingQueries(
    useMemo(() => {
      return (
        targetsMethods?.flat().map(method => {
          const queryKey = getReactionsQueryKey(method.id);

          return {
            queryKey,
            queryFn: () => axiosGet(queryKey)
          };
        }) || []
      );
    }, [targetsMethods])
  );

  const methodsReactions = useMemo(() => {
    return reactionsResponses.filter(result => result.isSuccess).map(result => result.data);
  }, [reactionsResponses]);

  const tableData = useMemo(() => {
    let methodsCounter = 0;

    return targets.map((target, index) => {
      return {
        target,
        subRows:
          targetsMethods[index]?.map(targetMethods => {
            return { method: targetMethods, reactions: methodsReactions[methodsCounter++] || [] };
          }) || []
      };
    });
  }, [methodsReactions, targets, targetsMethods]);

  return tableData;
};
