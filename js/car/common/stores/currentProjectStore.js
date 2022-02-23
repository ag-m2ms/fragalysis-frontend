import create from 'zustand';

/**
 * Stores currently selected project
 */
export const useCurrentProjectStore = create(() => null);

export const setCurrentProject = project => useCurrentProjectStore.setState(project);
