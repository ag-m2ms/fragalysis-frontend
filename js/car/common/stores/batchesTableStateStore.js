import create from 'zustand';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';

const batchesTableState = create(() => ({ expanded: {}, selected: {} }));

export const useBatchesTableState = createSelectorHooks(batchesTableState);

export const setRowExpanded = (batchId, rowId, expanded) =>
  useBatchesTableState.setState(state => ({
    expanded: {
      ...state.expanded,
      [batchId]: {
        ...(state.expanded[batchId] || {}),
        [rowId]: expanded
      }
    }
  }));

export const setRowSelected = (batchId, rowId, selected) =>
  useBatchesTableState.setState(state => ({
    selected: {
      ...state.selected,
      [batchId]: {
        ...(state.selected[batchId] || {}),
        [rowId]: selected
      }
    }
  }));

export const setAllRowsSelected = (batchId, rows, selected) =>
  useBatchesTableState.setState(state => ({
    selected: {
      ...state.selected,
      [batchId]: Object.fromEntries(rows.map(row => [row.id, selected]))
    }
  }));

export const clearBatchesTableState = () => useBatchesTableState.setState({ expanded: {}, selected: {} });
