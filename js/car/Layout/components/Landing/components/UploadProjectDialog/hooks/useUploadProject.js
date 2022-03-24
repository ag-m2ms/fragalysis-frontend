import React from 'react';
import { useMutation } from 'react-query';
import { createOTProtocolKey, getOTTaskStatusQueryKey } from '../../../../../../common/api/otSessionQueryKeys';
import { axiosPost } from '../../../../../../common/utils/axiosFunctions';
import { addCeleryTask } from '../../../../../../common/stores/celeryTasksStore';
import { HideNotificationButton } from '../../../../../../common/components/HideNotificationButton/HideNotificationButton';
import { scopes } from '../../../../../../common/constants/scopes';
import { useSnackbar } from 'notistack';

export const useUploadProject = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return useMutation(
    ({ data }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      return axiosPost('/car/upload/', formData, { baseURL: '/' });
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
          queryKey: getOTTaskStatusQueryKey({ task_id }),
          scope: scopes.GLOBAL,
          onSuccess: todo => {
            closeSnackbar(creatingMessageId);

            //console.log(protocol_summary);

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
