import create from 'zustand';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';

/**
 * Stores the state of OT protocol summary dialog. You can open the dialog either from the navigation menu or through
 * a notification.
 */
const deleteProjectDialogStore = create(() => ({
  dialogOpen: false,
  project: null
}));

export const useDeleteProjectDialogStore = createSelectorHooks(deleteProjectDialogStore);

export const requestDeleteProject = project => useDeleteProjectDialogStore.setState({ dialogOpen: true, project });

export const setDeleteProjectDialogOpen = dialogOpen => useDeleteProjectDialogStore.setState({ dialogOpen });

export const setProjectForDeleteProjectDialog = project => useDeleteProjectDialogStore.setState({ project });
