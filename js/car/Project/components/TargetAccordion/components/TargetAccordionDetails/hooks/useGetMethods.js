import { useQuery } from 'react-query';
import { getMethodsQueryKey } from '../../../../../../common/api/methodsQueryKeys';
import { axiosGet } from '../../../../../../common/utils/axiosFunctions';

export const useGetMethods = targetId => {
  const queryKey = getMethodsQueryKey(targetId);

  return useQuery(queryKey, () => axiosGet(queryKey), {
    onError: err => console.error(err)
  });
};
