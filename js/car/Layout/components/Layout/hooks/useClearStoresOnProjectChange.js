import { useEffect } from 'react';
import { clearBatchViewsRefsStore } from '../../../../common/stores/batchViewsRefsStore';
import { clearBatchesTableStateStore } from '../../../../common/stores/batchesTableStateStore';
import { clearBatchNavigationStore } from '../../../../common/stores/batchNavigationStore';
import { useCurrentProjectStore } from '../../../../common/stores/currentProjectStore';
import { clearLayoutStore } from '../../../../common/stores/layoutStore';

/**
 * Clears zustand stores which are dependent on project's data
 */
export const useClearStoresOnProjectChange = () => {
  useEffect(
    () =>
      useCurrentProjectStore.subscribe(
        state => state.currentProject?.id,
        () => {
          clearBatchNavigationStore();
          clearBatchesTableStateStore();
          clearBatchViewsRefsStore();
          clearLayoutStore();
        }
      ),
    []
  );
};
