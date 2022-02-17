import { useQuery } from 'react-query';
import { axiosGet } from '../../../../../../common/utils/axiosFunctions';
import { getProjectsQueryKey } from '../../../../../../common/api/projectsQueryKeys';

export const useGetProjects = () => {
  const queryKey = getProjectsQueryKey();

  return useQuery(queryKey, () => axiosGet(queryKey), {
    onError: err => console.error(err)
  });
};
