import { useMutation } from 'react-query';
import { useProjectSnackbar } from '../../../../../../common/hooks/useProjectSnackbar';
import {
  canonicalizeSmilesKey,
  getCanonicalizeSmilesTaskStatusQueryKey
} from '../../../../../../common/api/batchesQueryKeys';
import { axiosPost } from '../../../../../../common/utils/axiosFunctions';
import { addCeleryTask } from '../../../../../../common/stores/celeryTasksStore';
import { scopes } from '../../../../../../common/constants/scopes';

export const useCanonicalizeSmiles = (onCanonicalizeStart, onCanonicalizeEnd) => {
  const { enqueueSnackbar } = useProjectSnackbar();

  return useMutation(
    ({ data }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      return axiosPost(canonicalizeSmilesKey(), formData);
    },
    {
      onMutate: () => {
        onCanonicalizeStart();
      },
      onError: err => {
        console.error(err);
        enqueueSnackbar(err.message, { variant: 'error' });
      },
      onSuccess: ({ task_id }) => {
        addCeleryTask(task_id, {
          queryKey: getCanonicalizeSmilesTaskStatusQueryKey({ task_id }),
          scope: scopes.PROJECT,
          onSuccess: async ({ canonicalizedsmiles }) => {
            onCanonicalizeEnd(canonicalizedsmiles);
          },
          onError: err => {
            const message = err.traceback ?? err.message;
            console.error(message);
            enqueueSnackbar(message, { variant: 'error' });
            onCanonicalizeEnd();
          }
        });
      }
    }
  );
};
