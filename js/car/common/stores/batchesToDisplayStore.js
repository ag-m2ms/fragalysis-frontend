import create from 'zustand';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';

/**
 * Dictates whether or not to display a batch in the project view. Keys are batchIds. If a batchId is missing, it's
 * considered as hidden.
 * Example:
 * {
 *   batchesToDisplay: {
 *     12: true,
 *     16: false,
 *   }
 * }
 */
const batchesToDisplayStore = create(() => ({ batchesToDisplay: {} }));

export const useBatchesToDisplayStore = createSelectorHooks(batchesToDisplayStore);

export const setDisplayBatch = (batchId, display) =>
  useBatchesToDisplayStore.setState(state => ({ batchesToDisplay: { ...state.batchesToDisplay, [batchId]: display } }));

export const clearBatchesToDisplayStore = () => useBatchesToDisplayStore.setState({ batchesToDisplay: {} });
