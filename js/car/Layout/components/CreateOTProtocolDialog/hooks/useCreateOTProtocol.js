import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { axiosPost } from '../../../../common/utils/axiosFunctions';
import { addCeleryTask } from '../../../../common/stores/celeryTasksStore';
import { CloseSnackbarButton } from '../../../../common/components/CloseSnackbarButton/CloseSnackbarButton';
import { scopes } from '../../../../common/constants/scopes';
import { useProjectSnackbar } from '../../../../common/hooks/useProjectSnackbar';
import { ShowOTProtocolSummaryButton } from '../components/ShowOTProtocolSummaryButton';
import { useCurrentProjectStore } from '../../../../common/stores/currentProjectStore';
import {
  createOtProtocolKey,
  getOtProtocolsQueryKey,
  getOtProtocolTaskStatusQueryKey
} from '../../../../common/api/otProtocolsQueryKeys';
import { useGlobalSnackbar } from '../../../../common/hooks/useGlobalSnackbar';

export const useCreateOTProtocol = () => {
  const queryClient = useQueryClient();

  const currentProject = useCurrentProjectStore.useCurrentProject();

  const { enqueueSnackbarInfo, enqueueSnackbarSuccess, closeSnackbar } = useProjectSnackbar();
  const { enqueueSnackbarError } = useGlobalSnackbar();

  const otProtocolsQueryKey = getOtProtocolsQueryKey({ project_id: currentProject.id });

  return useMutation(data => axiosPost(createOtProtocolKey(), data), {
    onMutate: async () => {
      const creatingMessageId = enqueueSnackbarInfo('An OT protocol is being generated...');
      return { creatingMessageId };
    },
    onError: (err, vars, { creatingMessageId }) => {
      closeSnackbar(creatingMessageId);

      console.error(err);
      enqueueSnackbarError(err.message);
    },
    onSuccess: ({ task_id }, vars, { creatingMessageId }) => {
      addCeleryTask(task_id, {
        queryKey: getOtProtocolTaskStatusQueryKey({ task_id }),
        scope: scopes.PROJECT,
        onSuccess: ({ otprotocol_id }) => {
          closeSnackbar(creatingMessageId);

          queryClient.invalidateQueries(otProtocolsQueryKey);

          enqueueSnackbarSuccess('OT protocol has been generated successfully', {
            action: key => (
              <>
                <ShowOTProtocolSummaryButton messageId={key} otProtocolId={otprotocol_id} />
                <CloseSnackbarButton messageId={key} />
              </>
            )
          });
        },
        onError: err => {
          closeSnackbar(creatingMessageId);

          const message = err.traceback ?? err.message;
          console.error(message);
          enqueueSnackbarError(message);

          queryClient.invalidateQueries(otProtocolsQueryKey);
        }
      });
    }
  });
};
