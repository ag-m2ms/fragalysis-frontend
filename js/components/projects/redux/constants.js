const prefix = 'PROJECTS_';

export const constants = {
  SET_CURRENT_PROJECT: prefix + 'SET_CURRENT_PROJECT',
  SET_CURRENT_PROJECT_PROPERTY: prefix + 'SET_CURRENT_PROJECT_PROPERTY',
  RESET_CURRENT_PROJECT_STATE: prefix + 'RESET_CURRENT_PROJECT_STATE',
  SET_PROJECT_MODAL_OPEN: prefix + 'SET_PROJECT_MODAL_OPEN',
  SET_PROJECT_MODAL_IS_LOADING: prefix + 'SET_PROJECT_MODAL_IS_LOADING',
  SET_SNAPSHOT: prefix + 'SET_SNAPSHOT',
  SET_CURRENT_SNAPSHOT_PROPERTY: prefix + 'SET_CURRENT_SNAPSHOT_PROPERTY',
  RESET_SNAPSHOT: prefix + 'RESET_SNAPSHOT',
  SET_IS_LOADING_CURRENT_SNAPSHOT: prefix + 'SET_IS_LOADING_CURRENT_SNAPSHOT',

  RESET_PROJECTS_REDUCER: prefix + 'RESET_PROJECTS_REDUCER',
  SET_LIST_OF_PROJECTS: prefix + 'SET_LIST_OF_PROJECTS',
  SET_IS_LOADING_LIST_OF_PROJECTS: prefix + 'SET_IS_LOADING_LIST_OF_PROJECTS',
  SET_IS_LOADING_TREE: prefix + 'SET_IS_LOADING_TREE',
  SET_CURRENT_SNAPSHOT_TREE: prefix + 'SET_CURRENT_SNAPSHOT_TREE',
  SET_CURRENT_SNAPSHOT_LIST: prefix + 'SET_CURRENT_SNAPSHOT_LIST',

  RESET_LOADED_SNAPSHOTS: prefix + 'RESET_LOADED_SNAPSHOTS',

  SET_FORCE_CREATE_PROJECT: prefix + 'SET_FORCE_CREATE_PROJECT',
  SET_FORCE_PROJECT_CREATED: prefix + 'SET_FORCE_PROJECT_CREATED'
};

export const ProjectCreationType = {
  NEW: 'NEW',
  FROM_SNAPSHOT: 'FROM_SNAPSHOT',
  READ_ONLY: 'READ_ONLY'
};

export const SnapshotType = {
  INIT: 'INIT', // Initial snapshot generated by system
  AUTO: 'AUTO', //Automatic generated by system
  MANUAL: 'MANUAL' //Manual generated by user action
};

export const SnapshotProjectType = {
  NOT_ASSIGNED: 'Not assigned to project'
};
