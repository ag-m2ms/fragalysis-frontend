import { useQueries } from 'react-query';
import { getReactionsQueryKey } from '../../../../../../common/api/reactionsQueryKeys';
import { axiosGet } from '../../../../../../common/utils/axiosFunctions';

export const useGetReactions = (methods, enabled) => {
  return useQueries(
    methods?.map(method => {
      const queryKey = getReactionsQueryKey(method.id);

      return {
        queryKey,
        queryFn: () => axiosGet(queryKey),
        onError: err => console.error(err)
      };
    }) || []
  );
};
