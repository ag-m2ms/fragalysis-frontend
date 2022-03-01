import create from 'zustand';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';

const batchesTableState = create(() => ({
  expanded: {},
  // Stores only methods, not targets
  selected: {}
}));

export const useBatchesTableStateStore = createSelectorHooks(batchesTableState);

export const setRowsExpanded = (batchId, rows, expanded) =>
  useBatchesTableStateStore.setState(state => ({
    expanded: {
      ...state.expanded,
      [batchId]: {
        ...(state.expanded[batchId] || {}),
        ...Object.fromEntries(rows.map(row => [row.id, expanded]))
      }
    }
  }));

export const setRowsSelected = (batchId, rows, selected) =>
  useBatchesTableStateStore.setState(state => ({
    selected: {
      ...state.selected,
      [batchId]: {
        ...(state.selected[batchId] || {}),
        ...Object.fromEntries(rows.map(row => [row.id, selected]))
      }
    }
  }));

export const clearBatchesTableStateStore = () => useBatchesTableStateStore.setState({ expanded: {}, selected: {} });
