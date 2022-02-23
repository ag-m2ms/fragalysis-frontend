import { useEffect } from 'react';
import { clearBatchesToDisplayStore } from '../../../../common/stores/batchesToDisplayStore';
import { useCurrentProjectStore } from '../../../../common/stores/currentProjectStore';

/**
 * Clears zustand stores which are dependent on project's data
 */
export const useClearStoresOnProjectChange = () => {
  useEffect(
    () =>
      useCurrentProjectStore.subscribe((currentProject, previousProject) => {
        if (currentProject?.id !== previousProject?.id) {
          clearBatchesToDisplayStore();
        }
      }),
    []
  );
};
