import create from 'zustand';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';

/**
 * Stores the state of OT protocol summary dialog. You can open the dialog either from the navigation menu or through
 * a notification.
 */
const otProtocolSummaryDialogStore = create(() => ({
  dialogOpen: false,
  otProtocol: null
}));

export const useOtProtocolSummaryDialogStore = createSelectorHooks(otProtocolSummaryDialogStore);

export const requestOtProtocolSummary = otProtocol =>
  useOtProtocolSummaryDialogStore.setState({ dialogOpen: true, otProtocol });

export const setOtProtocolSummaryDialogOpen = dialogOpen => useOtProtocolSummaryDialogStore.setState({ dialogOpen });

export const setOtProtocolForSummaryDialog = otProtocol => useOtProtocolSummaryDialogStore.setState({ otProtocol });
