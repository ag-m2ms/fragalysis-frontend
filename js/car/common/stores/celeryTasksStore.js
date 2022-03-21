import create from 'zustand';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';

const defaultTaskOptions = {
  onSuccess: () => {},
  onError: () => {},
  queryKey: []
};

/**
 * Stores celery tasks which should be polled for completion.
 */
const celeryTasksStore = create(() => ({
  tasks: {}
}));

export const useCeleryTasksStore = createSelectorHooks(celeryTasksStore);

export const addCeleryTask = (taskId, options) =>
  useCeleryTasksStore.setState(state => ({
    tasks: {
      ...state.tasks,
      [taskId]: { ...defaultTaskOptions, ...options, id: taskId }
    }
  }));

export const removeCeleryTask = taskId =>
  useCeleryTasksStore.setState(state => {
    const tasks = { ...state.tasks };
    delete tasks[taskId];
    return { tasks };
  });

export const clearCeleryTasksStore = () => useCeleryTasksStore.setState({ tasks: {} });
