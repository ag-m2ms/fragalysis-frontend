import { useQuery } from 'react-query';
import { axiosGet } from '../../../../../../common/utils/axiosFunctions';
import { getProjectsQueryKey } from '../../../../../api/projectsQueryKeys';

export const useGetProjects = () => {
  const queryKey = getProjectsQueryKey();
  const { data: projects, ...rest } = useQuery(queryKey, () => axiosGet(queryKey), {
    onError: err => console.error(err)
  });

  return {
    projects,
    ...rest
  };
};
