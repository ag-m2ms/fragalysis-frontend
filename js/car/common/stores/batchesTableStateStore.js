import create from 'zustand';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';

const batchesTableState = create(() => ({
  expanded: {},
  // Stores only methods, not targets
  selected: {}
}));

export const useBatchesTableState = createSelectorHooks(batchesTableState);

export const setRowsExpanded = (batchId, rows, expanded) =>
  useBatchesTableState.setState(state => ({
    expanded: {
      ...state.expanded,
      [batchId]: {
        ...(state.expanded[batchId] || {}),
        ...Object.fromEntries(rows.map(row => [row.id, expanded]))
      }
    }
  }));

export const setRowsSelected = (batchId, rows, selected) =>
  useBatchesTableState.setState(state => ({
    selected: {
      ...state.selected,
      [batchId]: {
        ...(state.selected[batchId] || {}),
        ...Object.fromEntries(rows.map(row => [row.id, selected]))
      }
    }
  }));

export const clearBatchesTableState = () => useBatchesTableState.setState({ expanded: {}, selected: {} });
