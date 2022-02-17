import { useMemo } from 'react';
import { useQueries } from 'react-query';
import { axiosGet } from '../../../../../../common/utils/axiosFunctions';
import { getMethodsQueryKey } from '../../../../../../common/api/methodsQueryKeys';

export const useGetMethodsForTargets = targetsWithBatch => {
  const results = useQueries(
    targetsWithBatch.map(targetWithBatch => {
      const queryKey = getMethodsQueryKey(targetWithBatch.target.id);

      return {
        queryKey,
        queryFn: async () => {
          const methods = await axiosGet(queryKey);

          return methods.filter(method => method.target_id === targetWithBatch.target.id);
        },
        onError: err => console.error(err)
      };
    })
  );

  const areAllNotFetched = results.find(result => !result.isFetched);

  const isLoading = results.find(result => result.isLoading);

  const methodsWithTarget = useMemo(() => {
    if (areAllNotFetched) {
      return [];
    }

    return results
      .map((result, index) => ({
        result,
        ...targetsWithBatch[index]
      }))
      .filter(({ result }) => result.isSuccess)
      .map(({ result, ...rest }) =>
        result.data.map(method => ({
          ...rest,
          method
        }))
      )
      .flat();
  }, [targetsWithBatch, results, areAllNotFetched]);

  return { isLoading, methodsWithTarget };
};
