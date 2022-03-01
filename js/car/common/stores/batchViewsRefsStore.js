import create from 'zustand';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';

const batchesRefs = create(() => ({
  refs: {}
}));

export const useBatchViewsRefs = createSelectorHooks(batchesRefs);

export const setBatchViewRef = (batchId, element) =>
  useBatchViewsRefs.setState(state => ({
    refs: {
      ...state.refs,
      [batchId]: element
    }
  }));

export const clearBatchViewsRefsStore = () => useBatchViewsRefs.setState({ expanded: {}, selected: {} });
