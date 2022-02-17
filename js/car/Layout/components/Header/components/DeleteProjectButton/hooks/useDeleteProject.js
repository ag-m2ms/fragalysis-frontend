import { useMutation, useQueryClient } from 'react-query';
import { axiosDelete } from '../../../../../../common/utils/axiosFunctions';
import { deleteProjectQueryKey, getProjectsQueryKey } from '../../../../../../common/api/projectsQueryKeys';

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation(({ project }) => axiosDelete(deleteProjectQueryKey(project.id)), {
    onMutate: async ({ project }) => {
      const projectsQueryKey = getProjectsQueryKey();

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(projectsQueryKey);

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData(projectsQueryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(projectsQueryKey, oldProjects => {
        const newProjects = [...oldProjects];

        const projectIndex = oldProjects.findIndex(p => p === project);
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
