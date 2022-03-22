import { useCallback, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useCurrentProjectStore } from '../stores/currentProjectStore';

export const useProjectSnackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const currentProject = useCurrentProjectStore.useCurrentProject();
  const currentProjectId = currentProject?.id;

  const enqueue = useCallback(
    (...rest) => {
      if (currentProjectId === useCurrentProjectStore.getState().currentProject?.id) {
        return enqueueSnackbar(...rest);
      }
    },
    [currentProjectId, enqueueSnackbar]
  );

  return useMemo(
    () => ({
      enqueueSnackbar: enqueue,
      closeSnackbar
    }),
    [enqueue, closeSnackbar]
  );
};
