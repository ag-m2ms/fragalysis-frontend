import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { axiosPost } from '../../../../common/utils/axiosFunctions';
import { addCeleryTask } from '../../../../common/stores/celeryTasksStore';
import { HideNotificationButton } from '../../../../common/components/HideNotificationButton/HideNotificationButton';
import { scopes } from '../../../../common/constants/scopes';
import { useSnackbar } from 'notistack';
import {
  getProjectsQueryKey,
  getProjectUploadTaskStatusQueryKey,
  uploadProjectKey
} from '../../../../common/api/projectsQueryKeys';
import { ShowProjectButton } from '../components/ShowProjectButton';
import { useTemporaryId } from '../../../../common/hooks/useTemporaryId';

export const useUploadProject = () => {
  const queryClient = useQueryClient();

  const { generateId } = useTemporaryId();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const projectsQueryKey = getProjectsQueryKey();

  return useMutation(
    ({ data }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      return axiosPost(uploadProjectKey(), formData);
    },
    {
      onMutate: async ({ data }) => {
        const creatingMessageId = enqueueSnackbar('A project is being created...', { variant: 'info' });

        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(projectsQueryKey);

        // Snapshot the previous value
        const previousProjects = queryClient.getQueryData(projectsQueryKey);

        // Optimistically update to the new value
        queryClient.setQueryData(projectsQueryKey, projects => {
          const newProject = {
            id: generateId(),
            init_date: null,
            name: data.project_name,
            submitterorganisation: data.submitter_organisation,
            submittername: data.submitter_name,
            proteintarget: data.protein_target,
            quotedcost: null,
            quoteurl: null
          };

          return [...projects, newProject];
        });

        // Return a context object with the snapshotted value
        return { previousProjects, creatingMessageId };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, vars, { previousProjects, creatingMessageId }) => {
        closeSnackbar(creatingMessageId);

        console.error(err);
        enqueueSnackbar(err.message, { variant: 'error' });

        queryClient.setQueryData(projectsQueryKey, previousProjects);

        queryClient.invalidateQueries(projectsQueryKey);
      },
      onSuccess: (response, vars, { creatingMessageId }) => {
        const { task_id } = response;

        addCeleryTask(task_id, {
          queryKey: getProjectUploadTaskStatusQueryKey({ task_id }),
          scope: scopes.GLOBAL,
          onSuccess: async ({ project_id }) => {
            /**
             * Load the projects again first, its used to navigate to the project in the ShowProjectButton component. The
             * reason why it's not completely optimistically updated is because some of the project fields are generated on the
             * server. Setting a temporary project as a current project could lead to bugs since the fields wouldn't match.
             * It would be possible to do full optimistic update by setting the temporary project and then replace it with
             * a new the original one once the data is loaded, but there's a time frame where the data wouldn't match.
             */
            await queryClient.refetchQueries(projectsQueryKey);

            closeSnackbar(creatingMessageId);

            enqueueSnackbar('Project has been created successfully', {
              variant: 'success',
              autoHideDuration: null,
              action: key => (
                <>
                  <ShowProjectButton messageId={key} projectId={project_id} queryClient={queryClient} />
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

            queryClient.invalidateQueries(projectsQueryKey);
          }
        });
      }
    }
  );
};
