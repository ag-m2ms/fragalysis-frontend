import { useSnackbar } from 'notistack';
import { useMutation } from 'react-query';
import { createOTProtocolKey, getOTTaskStatusQueryKey } from '../../../../../../common/api/otSessionQueryKeys';
import { axiosPost } from '../../../../../../common/utils/axiosFunctions';
import { addCeleryTask } from '../../../../../../common/stores/celeryTasksStore';

export const useCreateOTProtocol = () => {
  /*const queryClient = useQueryClient();

  const currentProject = useCurrentProjectStore.useCurrentProject();
  const batch = useBatchContext();

  const batchesQueryKey = getBatchesQueryKey({ project_id: currentProject.id });

  const { generateId } = useTemporaryId();*/

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return useMutation(
    ({ batchids }) =>
      axiosPost(createOTProtocolKey(), {
        batchids
      }),
    {
      onMutate: async ({ batchids }) => {
        const creatingMessageId = enqueueSnackbar('An OT protocol is being generated...', { variant: 'info' });

        /*// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(batchesQueryKey);

        // Snapshot the previous value
        const previousBatches = queryClient.getQueryData(batchesQueryKey);

        // Temporary batchId
        const temporaryId = generateId();

        // Optimistically update to the new value
        queryClient.setQueryData(batchesQueryKey, batches => {
          const newBatch = { id: temporaryId, batch_id: batch.id, project_id: currentProject.id, batch_tag: batchtag };

          return [...batches, newBatch];
        });

        // Return a context object with the snapshotted value*/
        return { creatingMessageId };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, vars, { creatingMessageId }) => {
        closeSnackbar(creatingMessageId);

        console.error(err);
        enqueueSnackbar(err.message, { variant: 'error' });

        //queryClient.setQueryData(batchesQueryKey, previousBatches);
      },
      onSuccess: (response, vars, { creatingMessageId }) => {
        const { task_id } = response;
        addCeleryTask(task_id, {
          queryKey: getOTTaskStatusQueryKey({ task_id }),
          onSuccess: ({ protocol_summary }) => {
            closeSnackbar(creatingMessageId);

            console.log(protocol_summary);

            enqueueSnackbar('OT protocol has been generated successfully', { variant: 'success' });
          }
        });
        /*closeSnackbar(creatingMessageId);

        // Real batch ID
        const batchId = response.data.id;

        // Optimistically update to the new value
        queryClient.setQueryData(batchesQueryKey, batches => {
          return batches.map(batch => {
            // Temporary ID needs to be replaced with the real one
            if (batch.id === temporaryId) {
              return { ...batch, id: batchId };
            }
            return batch;
          });
        });

        enqueueSnackbar('The subbatch was created successfully', {
          variant: 'success',
          action: key => (
            <DisplaySubBatchButton
              batches={queryClient.getQueryData(batchesQueryKey)}
              messageId={key}
              batchId={batchId}
            />
          )
        });*/
      },
      // Always refetch after error or success:
      onSettled: () => {
        /*queryClient.invalidateQueries(batchesQueryKey);*/
      }
    }
  );
};
