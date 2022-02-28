import { useEffect } from 'react';
import { clearBatchesTableState } from '../../../../common/stores/batchesTableStateStore';
import { clearBatchesToDisplayStore } from '../../../../common/stores/batchesToDisplayStore';
import { useCurrentProjectStore } from '../../../../common/stores/currentProjectStore';

/**
 * Clears zustand stores which are dependent on project's data
 */
export const useClearStoresOnProjectChange = () => {
  useEffect(
    () =>
      useCurrentProjectStore.subscribe(
        state => state.currentProject?.id,
        () => {
          clearBatchesToDisplayStore();
          clearBatchesTableState();
        }
      ),
    []
  );
};
