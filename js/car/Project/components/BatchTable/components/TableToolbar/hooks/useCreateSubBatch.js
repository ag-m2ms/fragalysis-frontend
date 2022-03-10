import { useQueryClient, useMutation } from 'react-query';
import { createSubBatchKey, getBatchesQueryKey } from '../../../../../../common/api/batchesQueryKeys';
import { useBatchesTableStateStore } from '../../../../../../common/stores/batchesTableStateStore';
import { useCurrentProjectStore } from '../../../../../../common/stores/currentProjectStore';
import { axiosPost } from '../../../../../../common/utils/axiosFunctions';
import { useBatchContext } from '../../../../../hooks/useBatchContext';

export const useCreateSubBatch = () => {
  const queryClient = useQueryClient();

  const currentProject = useCurrentProjectStore.useCurrentProject();
  const batch = useBatchContext();

  return useMutation(
    () =>
      axiosPost(createSubBatchKey(), {
        batchtag: 'test',
        methodids: Object.entries(useBatchesTableStateStore.getState().selected[batch.id])
          .filter(([_, value]) => value)
          .map(([key]) => Number(key.split('.')[1]))
      }),
    {
      /*onMutate: async ({ reaction, successrate }) => {
        const reactionQueryKey = getReactionsQueryKey(reaction.method_id);

        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(reactionQueryKey);

        // Snapshot the previous value
        const previousReactions = queryClient.getQueryData(reactionQueryKey);

        // Optimistically update to the new value
        queryClient.setQueryData(reactionQueryKey, oldReactions => {
          const newReactions = [...oldReactions];
          const newReaction = { ...reaction, successrate };

          const reactionIndex = oldReactions.findIndex(r => r.id === reaction.id);
          newReactions.splice(reactionIndex, 1, newReaction);

          return newReactions;
        });

        // Return a context object with the snapshotted value
        return { previousReactions };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, { reaction }, context) => {
        console.error(err);

        queryClient.setQueryData(getReactionsQueryKey(reaction.method_id), context.previousReactions);
      },*/
      // Always refetch after error or success:
      onSettled: (data, error, { reaction }) => {
        queryClient.invalidateQueries(getBatchesQueryKey(currentProject.id));
      }
    }
  );
};
