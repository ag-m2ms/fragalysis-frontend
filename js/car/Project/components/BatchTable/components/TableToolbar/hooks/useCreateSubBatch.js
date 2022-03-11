import { useQueryClient, useMutation } from 'react-query';
import { createSubBatchKey, getBatchesQueryKey } from '../../../../../../common/api/batchesQueryKeys';
import { useTemporaryId } from '../../../../../../common/hooks/useTemporaryId';
import { useBatchesTableStateStore } from '../../../../../../common/stores/batchesTableStateStore';
import { useCurrentProjectStore } from '../../../../../../common/stores/currentProjectStore';
import { axiosPost } from '../../../../../../common/utils/axiosFunctions';
import { useBatchContext } from '../../../../../hooks/useBatchContext';

export const useCreateSubBatch = () => {
  const queryClient = useQueryClient();

  const currentProject = useCurrentProjectStore.useCurrentProject();
  const batch = useBatchContext();

  const batchesQueryKey = getBatchesQueryKey({ project_id: currentProject.id });

  const { generateId } = useTemporaryId();

  return useMutation(
    ({ batchtag, methodids }) =>
      axiosPost(createSubBatchKey(), {
        batchtag: 'test',
        methodids: Object.entries(useBatchesTableStateStore.getState().selected[batch.id])
          .filter(([_, value]) => value)
          .map(([key]) => Number(key.split('.')[1]))
      }),
    {
      onMutate: async ({ batchtag, methodids }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(batchesQueryKey);

        // Snapshot the previous value
        const previousBatches = queryClient.getQueryData(batchesQueryKey);

        // Optimistically update to the new value
        queryClient.setQueryData(batchesQueryKey, batches => {
          const newBatch = { id: generateId(), batch_id: batch.id, project_id: currentProject.id, batch_tag: 'test' };

          return [...batches, newBatch];
        });

        // Return a context object with the snapshotted value
        return { previousBatches };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, vars, context) => {
        console.error(err);

        queryClient.setQueryData(batchesQueryKey, context.previousBatches);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(batchesQueryKey);
      }
    }
  );
};
