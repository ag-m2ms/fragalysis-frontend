import React from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { createSubBatchKey, getBatchesQueryKey } from '../../../../../../common/api/batchesQueryKeys';
import { useTemporaryId } from '../../../../../../common/hooks/useTemporaryId';
import { useCurrentProjectStore } from '../../../../../../common/stores/currentProjectStore';
import { axiosPost } from '../../../../../../common/utils/axiosFunctions';
import { useBatchContext } from '../../../../../hooks/useBatchContext';
import { useSnackbar } from 'notistack';
import { DisplaySubBatchButton } from '../../DisplaySubBatchButton';

export const useCreateSubBatch = () => {
  const queryClient = useQueryClient();

  const currentProject = useCurrentProjectStore.useCurrentProject();
  const batch = useBatchContext();

  const batchesQueryKey = getBatchesQueryKey({ project_id: currentProject.id });

  const { generateId } = useTemporaryId();

  const { enqueueSnackbar } = useSnackbar();

  return useMutation(
    ({ batchtag, methodids }) =>
      axiosPost(createSubBatchKey(), {
        batchtag,
        methodids
      }),
    {
      onMutate: async ({ batchtag }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
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

        // Return a context object with the snapshotted value
        return { previousBatches, temporaryId };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, vars, { previousBatches }) => {
        console.error(err);
        enqueueSnackbar(err.message, { variant: 'error' });

        queryClient.setQueryData(batchesQueryKey, previousBatches);
      },
      onSuccess: (response, vars, { temporaryId }) => {
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
          action: key => <DisplaySubBatchButton messageId={key} batchId={batchId} />
        });
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(batchesQueryKey);
      }
    }
  );
};
