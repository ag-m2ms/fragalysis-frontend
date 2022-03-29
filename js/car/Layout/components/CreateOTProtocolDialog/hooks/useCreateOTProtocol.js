import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  createOTProtocolKey,
  getOtProtocolsQueryKey,
  getOTTaskStatusQueryKey
} from '../../../../common/api/otProtocolsQueryKeys';
import { axiosPost } from '../../../../common/utils/axiosFunctions';
import { addCeleryTask } from '../../../../common/stores/celeryTasksStore';
import { HideNotificationButton } from '../../../../common/components/HideNotificationButton/HideNotificationButton';
import { scopes } from '../../../../common/constants/scopes';
import { useProjectSnackbar } from '../../../../common/hooks/useProjectSnackbar';
import { ShowOTProtocolSummaryButton } from '../components/ShowOTProtocolSummaryButton';
import { useCurrentProjectStore } from '../../../../common/stores/currentProjectStore';

export const useCreateOTProtocol = () => {
  const queryClient = useQueryClient();

  const currentProject = useCurrentProjectStore.useCurrentProject();

  const { enqueueSnackbar, closeSnackbar } = useProjectSnackbar();

  return useMutation(
    ({ batchids }) =>
      axiosPost(createOTProtocolKey(), {
        batchids
      }),
    {
      onMutate: async () => {
        const creatingMessageId = enqueueSnackbar('An OT protocol is being generated...', { variant: 'info' });
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
          queryKey: getOTTaskStatusQueryKey({ task_id }),
          scope: scopes.PROJECT,
          onSuccess: () => {
            closeSnackbar(creatingMessageId);

            queryClient.invalidateQueries(getOtProtocolsQueryKey({ project_id: currentProject.id }));

            enqueueSnackbar('OT protocol has been generated successfully', {
              variant: 'success',
              autoHideDuration: null,
              action: key => (
                <>
                  <ShowOTProtocolSummaryButton messageId={key} taskId={task_id} />
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

            queryClient.invalidateQueries(getOtProtocolsQueryKey({ project_id: currentProject.id }));
          }
        });
      }
    }
  );
};
