const prefix = 'REDUCERS_NGL_';

export const CONSTANTS = {
  LOAD_OBJECT: prefix + 'LOAD_OBJECT',
  DELETE_OBJECT: prefix + 'DELETE_OBJECT',
  // NGL Component Representation
  UPDATE_COMPONENT_REPRESENTATION_VISIBILITY: prefix + 'UPDATE_COMPONENT_REPRESENTATION_VISIBILITY',
  UPDATE_COMPONENT_REPRESENTATION_VISIBILITY_ALL: prefix + 'UPDATE_COMPONENT_REPRESENTATION_VISIBILITY_ALL',
  UPDATE_COMPONENT_REPRESENTATION: prefix + 'UPDATE_COMPONENT_REPRESENTATION',
  REMOVE_COMPONENT_REPRESENTATION: prefix + 'REMOVE_COMPONENT_REPRESENTATION',
  ADD_COMPONENT_REPRESENTATION: prefix + 'ADD_COMPONENT_REPRESENTATION',
  CHANGE_COMPONENT_REPRESENTATION: prefix + 'CHANGE_COMPONENT_REPRESENTATION',

  SET_NGL_VIEW_PARAMS: prefix + 'SET_NGL_VIEW_PARAMS',
  SET_ORIENTATION: prefix + 'SET_ORIENTATION',
  SET_ORIENTATION_BY_INTERACTION: prefix + 'SET_ORIENTATION_BY_INTERACTION',
  SET_NGL_STATE_FROM_CURRENT_SNAPSHOT: prefix + 'SET_NGL_STATE_FROM_CURRENT_SNAPSHOT',
  REMOVE_ALL_NGL_COMPONENTS: prefix + 'REMOVE_ALL_NGL_COMPONENTS',

  // Helper variables for marking that protein and molecule groups are successful loaded
  SET_PROTEINS_HAS_LOADED: prefix + 'SET_PROTEINS_HAS_LOADED',
  SET_COUNT_OF_REMAINING_MOLECULE_GROUPS: prefix + 'SET_COUNT_OF_REMAINING_MOLECULE_GROUPS',
  DECREMENT_COUNT_OF_REMAINING_MOLECULE_GROUPS: prefix + 'DECREMENT_COUNT_OF_REMAINING_MOLECULE_GROUPS',
  INCREMENT_COUNT_OF_PENDING_NGL_OBJECTS: prefix + 'INCREMENT_COUNT_OF_PENDING_NGL_OBJECTS',
  DECREMENT_COUNT_OF_PENDING_NGL_OBJECTS: prefix + 'DECREMENT_COUNT_OF_PENDING_NGL_OBJECTS',

  SET_MOLECULE_ORIENTATIONS: prefix + 'SET_MOLECULE_ORIENTATIONS',
  APPEND_MOLECULE_ORIENTATION: prefix + 'SET_MOLECULE_ORIENTATION',
  REMOVE_MOLECULE_ORIENTATION: prefix + 'REMOVE_MOLECULE_ORIENTATION',

  ADD_TO_PDB_CACHE: prefix + 'ADD_TO_PDB_CACHE',
  ADD_TO_QUALITY_CACHE: prefix + 'ADD_TO_QUALITY_CACHE',

  SET_BACKGROUND_COLOR: prefix + 'SET_BACKGROUND_COLOR',
  SET_CLIP_NEAR: prefix + 'SET_CLIP_NEAR',
  SET_CLIP_FAR: prefix + 'SET_CLIP_FAR',
  SET_CLIP_DIST: prefix + 'SET_CLIP_DIST',
  SET_FOG_NEAR: prefix + 'SET_FOG_NEAR',
  SET_FOG_FAR: prefix + 'SET_FOG_FAR',
  SET_ISO_LEVEL: prefix + 'SET_ISO_LEVEL',
  SET_BOX_SIZE: prefix + 'SET_BOX_SIZE',
  SET_OPACITY: prefix + 'SET_OPACITY',
  SET_CONTOUR: prefix + 'SET_CONTOUR',
  SET_WARNING_ICON: prefix + 'SET_WARNING_ICON'
};

export const SCENES = {
  defaultScene: 'defaultScene',
  sessionScene: 'sessionScene'
};
