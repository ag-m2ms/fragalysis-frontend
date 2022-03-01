import { useMutation, useQueryClient } from 'react-query';
import { axiosDelete } from '../../../../../../common/utils/axiosFunctions';
import { deleteProjectKey, getProjectsQueryKey } from '../../../../../../common/api/projectsQueryKeys';

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation(({ project }) => axiosDelete(deleteProjectKey(project.id)), {
    onMutate: async ({ project }) => {
      const projectsQueryKey = getProjectsQueryKey();

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(projectsQueryKey);

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData(projectsQueryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(projectsQueryKey, oldProjects => {
        const newProjects = [...oldProjects];

        const projectIndex = oldProjects.findIndex(p => p.id === project.id);
        newProjects.splice(projectIndex, 1);

        return newProjects;
      });

      // Return a context object with the snapshotted value
      return { previousProjects };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, vars, context) => {
      console.error(err);

      queryClient.setQueryData(getProjectsQueryKey(), context.previousProjects);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(getProjectsQueryKey());
    }
  });
};
