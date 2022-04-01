import { useMutation, useQueryClient } from 'react-query';
import { axiosPatch } from '../../../../common/utils/axiosFunctions';
import { patchMethodsKey } from '../../../../common/api/methodsQueryKeys';
import { useBatchContext } from '../../../hooks/useBatchContext';
import { getTargetsQueryKey } from '../../../../common/api/targetsQueryKeys';
import { useGlobalSnackbar } from '../../../../common/hooks/useGlobalSnackbar';

export const useSynthesiseMethod = () => {
  const queryClient = useQueryClient();

  const batch = useBatchContext();

  const targetsQueryKey = getTargetsQueryKey({ batch_id: batch.id, fetchall: 'yes' });

  const { enqueueSnackbarError } = useGlobalSnackbar();

  return useMutation(({ method, synthesise }) => axiosPatch(patchMethodsKey(method.id), { synthesise }), {
    onMutate: async ({ method: methodToUpdate, synthesise }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(targetsQueryKey);

      // Snapshot the previous value
      const previousTargets = queryClient.getQueryData(targetsQueryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(targetsQueryKey, targets => {
        return targets.map(target => ({
          ...target,
          methods: target.methods.map(method => {
            if (method.id === methodToUpdate.id) {
              return { ...methodToUpdate, synthesise };
            }

            return method;
          })
        }));
      });

      // Return a context object with the snapshotted value
      return { previousTargets };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, vars, { previousTargets }) => {
      console.error(err);
      enqueueSnackbarError(err.message);

      queryClient.setQueryData(targetsQueryKey, previousTargets);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(targetsQueryKey);
    }
  });
};
