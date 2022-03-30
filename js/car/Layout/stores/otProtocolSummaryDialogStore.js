import create from 'zustand';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';

/**
 * Stores the state of OT protocol summary dialog. You can open the dialog either from the navigation menu or through
 * a notification.
 */
const otProtocolSummaryDialogStore = create(() => ({
  dialogOpen: false,
  otProtocolId: null
}));

export const useOtProtocolSummaryDialogStore = createSelectorHooks(otProtocolSummaryDialogStore);

export const requestOtProtocolSummary = otProtocolId =>
  useOtProtocolSummaryDialogStore.setState({ dialogOpen: true, otProtocolId });

export const setOtProtocolSummaryDialogOpen = dialogOpen => useOtProtocolSummaryDialogStore.setState({ dialogOpen });

export const setOtProtocolForSummaryDialog = otProtocolId => useOtProtocolSummaryDialogStore.setState({ otProtocolId });
