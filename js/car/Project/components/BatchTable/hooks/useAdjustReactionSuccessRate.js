import { useMutation, useQueryClient } from 'react-query';
import { axiosPatch } from '../../../../common/utils/axiosFunctions';
import { patchReactionKey } from '../../../../common/api/reactionsQueryKeys';
import { getTargetsQueryKey } from '../../../../common/api/targetsQueryKeys';
import { useBatchContext } from '../../../hooks/useBatchContext';
import { useGlobalSnackbar } from '../../../../common/hooks/useGlobalSnackbar';

export const useAdjustReactionSuccessRate = () => {
  const queryClient = useQueryClient();

  const batch = useBatchContext();

  const targetsQueryKey = getTargetsQueryKey({ batch_id: batch.id, fetchall: 'yes' });

  const { enqueueSnackbarError } = useGlobalSnackbar();

  return useMutation(
    ({ reaction, successrate }) =>
      axiosPatch(patchReactionKey(reaction.id), {
        successrate
      }),
    {
      onMutate: async ({ reaction: reactionToUpdate, successrate }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(targetsQueryKey);

        // Snapshot the previous value
        const previousTargets = queryClient.getQueryData(targetsQueryKey);

        // Optimistically update to the new value
        queryClient.setQueryData(targetsQueryKey, targets => {
          return targets.map(target => ({
            ...target,
            methods: target.methods.map(method => ({
              ...method,
              reactions: method.reactions.map(reaction => {
                if (reaction.id === reactionToUpdate.id) {
                  return { ...reactionToUpdate, successrate };
                }

                return reaction;
              })
            }))
          }));
        });

        // Return a context object with the snapshotted value
        return { previousTargets };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, _, { previousTargets }) => {
        console.error(err);
        enqueueSnackbarError(err.message);

        queryClient.setQueryData(targetsQueryKey, previousTargets);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(targetsQueryKey);
      }
    }
  );
};
