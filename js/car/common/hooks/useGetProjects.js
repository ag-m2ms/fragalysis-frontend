import { useQuery } from 'react-query';
import { axiosGet } from '../utils/axiosFunctions';
import { getProjectsQueryKey } from '../api/projectsQueryKeys';

export const useGetProjects = () => {
  const queryKey = getProjectsQueryKey();

  return useQuery(queryKey, () => axiosGet(queryKey));
};
