import React from 'react';
import { useMutation } from 'react-query';
import { createOTProtocolKey, getOTTaskStatusQueryKey } from '../../../../common/api/otSessionQueryKeys';
import { axiosPost } from '../../../../common/utils/axiosFunctions';
import { addCeleryTask } from '../../../../common/stores/celeryTasksStore';
import { HideNotificationButton } from '../../../../common/components/HideNotificationButton/HideNotificationButton';
import { scopes } from '../../../../common/constants/scopes';
import { useProjectSnackbar } from '../../../../common/hooks/useProjectSnackbar';

export const useCreateOTProtocol = () => {
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
          onSuccess: ({ protocol_summary }) => {
            closeSnackbar(creatingMessageId);

            console.log(protocol_summary);

            enqueueSnackbar('OT protocol has been generated successfully', {
              variant: 'success',
              autoHideDuration: null,
              action: key => (
                <>
                  <HideNotificationButton messageId={key} />
                </>
              )
            });
          }
        });
      }
    }
  );
};
