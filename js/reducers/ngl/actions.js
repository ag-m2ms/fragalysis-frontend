/**
 * Created by abradley on 03/03/2018.
 */
import { CONSTANTS } from './constants';

export const loadNglObject = (target, representations) => ({ type: CONSTANTS.LOAD_OBJECT, target, representations });

export const deleteNglObject = target => ({
  type: CONSTANTS.DELETE_OBJECT,
  target
});

export const updateComponentRepresentation = (objectInViewID, representationID, newRepresentation, change) => ({
  type: CONSTANTS.UPDATE_COMPONENT_REPRESENTATION,
  representationID,
  newRepresentation,
  objectInViewID,
  change
});

export const addComponentRepresentation = (objectInViewID, newRepresentation, skipTracking = false) => ({
  type: CONSTANTS.ADD_COMPONENT_REPRESENTATION,
  newRepresentation,
  objectInViewID,
  skipTracking
});

export const removeComponentRepresentation = (objectInViewID, representation, skipTracking = false) => ({
  type: CONSTANTS.REMOVE_COMPONENT_REPRESENTATION,
  representation,
  objectInViewID,
  skipTracking
});

export const changeComponentRepresentation = (objectInViewID, oldRepresentation, newRepresentation) => ({
  type: CONSTANTS.CHANGE_COMPONENT_REPRESENTATION,
  oldRepresentation,
  newRepresentation,
  objectInViewID
});

export const setNglViewParams = (key, value, stage = undefined, objectId = undefined) => {
  if (stage) {
    stage.setParameters({ [key]: value });
  }
  return {
    type: CONSTANTS.SET_NGL_VIEW_PARAMS,
    key,
    value,
    object_id: objectId
  };
};

export const setBackgroundColor = (color) => {
  return {
    type: CONSTANTS.SET_BACKGROUND_COLOR,
    payload: color
  };
};

export const setNglClipNearAction = (newValue, oldValue) => {
  return {
    type: CONSTANTS.SET_CLIP_NEAR,
    payload: {
      newValue: newValue,
      oldValue: oldValue
    }
  };
};

export const setNglClipFarAction = (newValue, oldValue) => {
  return {
    type: CONSTANTS.SET_CLIP_FAR,
    payload: {
      newValue: newValue,
      oldValue: oldValue
    }
  };
};

export const setNglClipDistAction = (newValue, oldValue) => {
  return {
    type: CONSTANTS.SET_CLIP_DIST,
    payload: {
      newValue: newValue,
      oldValue: oldValue
    }
  };
};

export const setNglFogNearAction = (newValue, oldValue) => {
  return {
    type: CONSTANTS.SET_FOG_NEAR,
    payload: {
      newValue: newValue,
      oldValue: oldValue
    }
  };
};

export const setNglFogFarAction = (newValue, oldValue) => {
  return {
    type: CONSTANTS.SET_FOG_FAR,
    payload: {
      newValue: newValue,
      oldValue: oldValue
    }
  };
};

export const setNglOrientation = (orientation, div_id) => ({ type: CONSTANTS.SET_ORIENTATION, orientation, div_id });

export const setProteinLoadingState = hasLoaded => ({ type: CONSTANTS.SET_PROTEINS_HAS_LOADED, payload: hasLoaded });

export const setNglStateFromCurrentSnapshot = snapshot => ({
  type: CONSTANTS.SET_NGL_STATE_FROM_CURRENT_SNAPSHOT,
  payload: snapshot
});

export const removeAllNglComponents = (stage = undefined) => ({ type: CONSTANTS.REMOVE_ALL_NGL_COMPONENTS, stage });

export const setCountOfRemainingMoleculeGroups = count => ({
  type: CONSTANTS.SET_COUNT_OF_REMAINING_MOLECULE_GROUPS,
  payload: count
});

export const decrementCountOfRemainingMoleculeGroups = decrementedCount => ({
  type: CONSTANTS.DECREMENT_COUNT_OF_REMAINING_MOLECULE_GROUPS,
  payload: decrementedCount
});

export const incrementCountOfPendingNglObjects = NglViewId => ({
  type: CONSTANTS.INCREMENT_COUNT_OF_PENDING_NGL_OBJECTS,
  payload: NglViewId
});

export const decrementCountOfPendingNglObjects = NglViewId => ({
  type: CONSTANTS.DECREMENT_COUNT_OF_PENDING_NGL_OBJECTS,
  payload: NglViewId
});

export const appendMoleculeOrientation = (moleculeID, orientation) => ({
  type: CONSTANTS.APPEND_MOLECULE_ORIENTATION,
  payload: { moleculeID, orientation }
});

export const setMoleculeOrientations = moleculeOrientations => ({
  type: CONSTANTS.SET_MOLECULE_ORIENTATIONS,
  payload: moleculeOrientations
});

export const removeMoleculeOrientation = moleculeGroupID => ({
  type: CONSTANTS.REMOVE_MOLECULE_ORIENTATION,
  payload: moleculeGroupID
});

export const addToPdbCache = (name, cacheItem) => ({
  type: CONSTANTS.ADD_TO_PDB_CACHE,
  payload: { name: name, cacheItem: cacheItem }
});
