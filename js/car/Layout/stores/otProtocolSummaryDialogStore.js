import create from 'zustand';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';

/**
 * Stores the state of OT protocol summary dialog. You can open the dialog either from the navigation menu or through
 * a notification.
 */
const otProtocolSummaryDialogStore = create(() => ({
  dialogOpen: false,
  taskId: null
}));

export const useOtProtocolSummaryDialogStore = createSelectorHooks(otProtocolSummaryDialogStore);

export const requestOtProtocolSummary = taskId =>
  useOtProtocolSummaryDialogStore.setState({ dialogOpen: true, taskId });

export const setOtProtocolSummaryDialogOpen = dialogOpen => useOtProtocolSummaryDialogStore.setState({ dialogOpen });

export const setOtProtocolForSummaryDialog = taskId => useOtProtocolSummaryDialogStore.setState({ taskId });
