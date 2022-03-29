import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { axiosPost } from '../../../../../../common/utils/axiosFunctions';
import { addCeleryTask } from '../../../../../../common/stores/celeryTasksStore';
import { HideNotificationButton } from '../../../../../../common/components/HideNotificationButton/HideNotificationButton';
import { scopes } from '../../../../../../common/constants/scopes';
import { useSnackbar } from 'notistack';
import {
  getProjectsQueryKey,
  getProjectUploadTaskStatusQueryKey,
  uploadProjectKey
} from '../../../../../../common/api/projectsQueryKeys';
import { ShowProjectButton } from '../components/ShowProjectButton';

export const useUploadProject = () => {
  const queryClient = useQueryClient();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return useMutation(
    ({ data }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      return axiosPost(uploadProjectKey(), formData);
    },
    {
      onMutate: async () => {
        const creatingMessageId = enqueueSnackbar('A project is being created...', { variant: 'info' });
        return { creatingMessageId };
      },
      onError: (err, vars, { creatingMessageId }) => {
        closeSnackbar(creatingMessageId);

        console.error(err);
        enqueueSnackbar(err.message, { variant: 'error' });
      },
      onSuccess: (response, vars, { creatingMessageId }) => {
        const { task_id } = response;

        addCeleryTask(task_id, {
          queryKey: getProjectUploadTaskStatusQueryKey({ task_id }),
          scope: scopes.GLOBAL,
          onSuccess: async ({ project_id }) => {
            // Load the projects again first, its used to navigate to the project in the ShowProjectButton component
            await queryClient.refetchQueries(getProjectsQueryKey());

            // Get the project from the freshly fetched data
            const projects = queryClient.getQueryData(getProjectsQueryKey());
            // Refetch may fail, in that case, don't display the Show Project button
            const project = projects?.find(project => project.id === project_id);

            closeSnackbar(creatingMessageId);

            enqueueSnackbar('Project has been created successfully', {
              variant: 'success',
              autoHideDuration: null,
              action: key => (
                <>
                  {project && <ShowProjectButton messageId={key} project={project} />}
                  <HideNotificationButton messageId={key} />
                </>
              )
            });
          },
          onError: err => {
            closeSnackbar(creatingMessageId);

            const message = err.traceback ?? err.message;
            console.error(message);
            enqueueSnackbar(message, { variant: 'error' });

            queryClient.invalidateQueries(getProjectsQueryKey());
          }
        });
      }
    }
  );
};
