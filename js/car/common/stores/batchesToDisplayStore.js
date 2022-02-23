import create from 'zustand';

/**
 * Dictates whether or not to display a batch in the project view. Keys are batchIds. If a batchId is missing, it's
 * considered as hidden.
 * Example:
 * {
 *   12: true,
 *   16: false,
 * }
 */
export const useBatchesToDisplayStore = create(() => ({}));

export const setDisplayBatch = (batchId, display) =>
  useBatchesToDisplayStore.setState(state => ({ ...state, [batchId]: display }));

export const clearBatchesToDisplayStore = () => useBatchesToDisplayStore.setState({}, true);
