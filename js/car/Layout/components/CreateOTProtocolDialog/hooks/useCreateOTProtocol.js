import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  createOTBatchProtocolKey,
  getOTBatchProtocolTaskStatusQueryKey
} from '../../../../common/api/otBatchProtocolsQueryKeys';
import { axiosPost } from '../../../../common/utils/axiosFunctions';
import { addCeleryTask } from '../../../../common/stores/celeryTasksStore';
import { HideNotificationButton } from '../../../../common/components/HideNotificationButton/HideNotificationButton';
import { scopes } from '../../../../common/constants/scopes';
import { useProjectSnackbar } from '../../../../common/hooks/useProjectSnackbar';
import { ShowOTProtocolSummaryButton } from '../components/ShowOTProtocolSummaryButton';
import { useCurrentProjectStore } from '../../../../common/stores/currentProjectStore';
import { getOtProtocolsQueryKey } from '../../../../common/api/otProtocolsQueryKeys';

export const useCreateOTProtocol = () => {
  const queryClient = useQueryClient();

  const currentProject = useCurrentProjectStore.useCurrentProject();

  const { enqueueSnackbar, closeSnackbar } = useProjectSnackbar();

  const otProtocolsQueryKey = getOtProtocolsQueryKey({ project_id: currentProject.id });

  return useMutation(data => axiosPost(createOTBatchProtocolKey(), data), {
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
        queryKey: getOTBatchProtocolTaskStatusQueryKey({ task_id }),
        scope: scopes.PROJECT,
        onSuccess: ({ protocol_id }) => {
          closeSnackbar(creatingMessageId);

          queryClient.invalidateQueries(otProtocolsQueryKey);

          enqueueSnackbar('OT protocol has been generated successfully', {
            variant: 'success',
            autoHideDuration: null,
            action: key => (
              <>
                <ShowOTProtocolSummaryButton messageId={key} otProtocolId={protocol_id} />
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

          queryClient.invalidateQueries(otProtocolsQueryKey);
        }
      });
    }
  });
};
