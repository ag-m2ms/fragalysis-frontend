import { useQuery } from 'react-query';
import { getOtProtocolsQueryKey } from '../api/otProtocolsQueryKeys';
import { axiosGet } from '../utils/axiosFunctions';

export const useGetOtProtocols = params => {
  const queryKey = getOtProtocolsQueryKey(params);

  return useQuery(queryKey, async () => (await axiosGet(queryKey)).results);
};
