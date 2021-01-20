import { actionType, actionObjectType, actionDescription, actionAnnotation } from './constants';
import { constants as apiConstants } from '../api/constants';
import { CONSTANTS as nglConstants } from '../ngl/constants';
import { constants as previewCompoundConstants } from '../../components/preview/compounds/redux/constants';
import { constants as selectionConstants } from '../selection/constants';
import { constants as customDatasetConstants } from '../../components/datasets/redux/constants';
import { DJANGO_CONTEXT } from '../../utils/djangoContext';
import {NGL_PARAMS, BACKGROUND_COLOR} from '../../components/nglView/constants/index';

export const findTrackAction = (action, state) => {
  const username = DJANGO_CONTEXT['username'];
  const target_on_name = state.apiReducers.target_on_name;
  const isActionRestoring = state.trackingReducers.isActionRestoring;
  const viewParams = state.nglReducers.viewParams;

  let trackAction = null;
  if (isActionRestoring === false && action.skipTracking !== true) {
    if (action.type.includes(apiConstants.SET_TARGET_ON)) {
      if (action.target_on) {
        let targetName = getTargetName(action.target_on, state);
        trackAction = {
          type: actionType.TARGET_LOADED,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: actionObjectType.TARGET,
          object_name: targetName,
          object_id: action.target_on,
          text: `${actionDescription.TARGET} ${targetName} ${actionDescription.LOADED}`
        };
      }
    } else if (action.type.includes(apiConstants.SET_MOL_GROUP_ON)) {
      if (action.mol_group_on) {
        let molGroupSelection = state.selectionReducers.mol_group_selection;
        let currentMolGroup = molGroupSelection && molGroupSelection.find(o => o === action.mol_group_on);
        if (!currentMolGroup) {
          let molGroupName = getMolGroupName(action.mol_group_on, state);
          trackAction = {
            type: actionType.SITE_TURNED_ON,
            annotation: actionAnnotation.CHECK,
            timestamp: Date.now(),
            username: username,
            object_type: actionObjectType.SITE,
            object_name: molGroupName,
            object_id: action.mol_group_on,
            text: `${actionDescription.SITE} ${molGroupName} ${actionDescription.TURNED_ON}`
          };
        }
      }
    } else if (action.type.includes(apiConstants.SET_MOL_GROUP_OFF)) {
      const { mol_group_off, selectionGroups } = action;
      let molGroupName = getMolGroupName(mol_group_off, state);
      trackAction = {
        type: actionType.SITE_TURNED_OFF,
        timestamp: Date.now(),
        username: username,
        object_type: actionObjectType.SITE,
        object_name: molGroupName,
        object_id: mol_group_off,
        selectionGroups,
        text: `${actionDescription.SITE} ${molGroupName} ${actionDescription.TURNED_OFF}`
      };
    } else if (action.type.includes(selectionConstants.SET_OBJECT_SELECTION)) {
      let objectId = action.payload && action.payload[0];
      if (objectId) {
        let molGroupName = getMolGroupName(objectId, state);
        trackAction = {
          type: actionType.SITE_TURNED_OFF,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: actionObjectType.SITE,
          object_name: molGroupName,
          object_id: objectId,
          text: `${actionDescription.SITE} ${molGroupName} ${actionDescription.TURNED_OFF}`
        };
      }
    } else if (action.type === selectionConstants.SET_HIDE_ALL) {
      if (action.data) {
        let objectType = actionObjectType.MOLECULE;
        let description = action.isHide === true ? `` : `${actionDescription.CANCELED}`;

        trackAction = {
          type: actionType.ALL_HIDE,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          data: action.data,
          text: `${actionDescription.ALL} ${actionDescription.HIDDEN} ${description}`
        };
      }
    } else if (action.type === selectionConstants.SET_SELECTED_ALL) {
      if (action.item) {
        let objectType = action.item.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let objectName = action.item.name || getMoleculeName(action.item.id, state);

        trackAction = {
          type: actionType.ALL_TURNED_ON,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.item.id,
          isLigand: action.isLigand,
          isProtein: action.isProtein,
          isComplex: action.isComplex,
          item: action.item,
          text: `${actionDescription.ALL} ${actionDescription.TURNED_ON} ${objectType} ${getMoleculeTitle(
            objectName,
            target_on_name
          )}`
        };
      }
    } else if (action.type === selectionConstants.SET_DESELECTED_ALL) {
      if (action.item) {
        let objectType = action.item.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let objectName = action.item.name || getMoleculeName(action.item.id, state);

        trackAction = {
          type: actionType.ALL_TURNED_OFF,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.item.id,
          isLigand: action.isLigand,
          isProtein: action.isProtein,
          isComplex: action.isComplex,
          item: action.item,
          text: `${actionDescription.ALL} ${actionDescription.TURNED_OFF} ${objectType} ${getMoleculeTitle(
            objectName,
            target_on_name
          )}`
        };
      }
    } else if (action.type === selectionConstants.SET_SELECTED_ALL_BY_TYPE) {
      if (action.payload) {
        let payload = action.payload;
        let objectType = payload.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let paylodTypeDescription = getTypeDescriptionOfSelectedAllAction(payload.type);

        trackAction = {
          type: actionType.ALL_TURNED_ON_BY_TYPE,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          control_type: payload.type,
          items: payload.items,
          text: `${actionDescription.ALL} ${paylodTypeDescription} ${actionDescription.TURNED_ON} ${objectType}`
        };
      }
    } else if (action.type === selectionConstants.SET_DESELECTED_ALL_BY_TYPE) {
      if (action.payload) {
        let payload = action.payload;
        let objectType = payload.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let paylodTypeDescription = getTypeDescriptionOfSelectedAllAction(payload.type);

        trackAction = {
          type: actionType.ALL_TURNED_OFF_BY_TYPE,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          control_type: payload.type,
          items: payload.items,
          text: `${actionDescription.ALL} ${paylodTypeDescription} ${actionDescription.TURNED_OFF} ${objectType}`
        };
      }
    } else if (action.type.includes(selectionConstants.APPEND_FRAGMENT_DISPLAY_LIST)) {
      if (action.item) {
        let objectType = action.item.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let objectName = action.item.name || getMoleculeName(action.item.id, state);

        trackAction = {
          type: actionType.LIGAND_TURNED_ON,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.item.id,
          text: `${actionDescription.LIGAND} ${actionDescription.TURNED_ON} ${objectType} ${getMoleculeTitle(
            objectName,
            target_on_name
          )}`
        };
      }
    } else if (action.type.includes(selectionConstants.REMOVE_FROM_FRAGMENT_DISPLAY_LIST)) {
      if (action.item) {
        let objectType = action.item.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let objectName = action.item.name || getMoleculeName(action.item.id, state);

        trackAction = {
          type: actionType.LIGAND_TURNED_OFF,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.item.id,
          text: `${actionDescription.LIGAND} ${actionDescription.TURNED_OFF} ${objectType} ${getMoleculeTitle(
            objectName,
            target_on_name
          )}`
        };
      }
    } else if (action.type.includes(selectionConstants.APPEND_PROTEIN_LIST)) {
      if (action.item) {
        let objectType = action.item.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let objectName = action.item.name || getMoleculeName(action.item.id, state);

        trackAction = {
          type: actionType.SIDECHAINS_TURNED_ON,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.item.id,
          text: `${actionDescription.SIDECHAIN} ${actionDescription.TURNED_ON} ${objectType} ${getMoleculeTitle(
            objectName,
            target_on_name
          )}`
        };
      }
    } else if (action.type.includes(selectionConstants.REMOVE_FROM_PROTEIN_LIST)) {
      if (action.item) {
        let objectType = action.item.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let objectName = action.item.name || getMoleculeName(action.item.id, state);

        trackAction = {
          type: actionType.SIDECHAINS_TURNED_OFF,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.item.id,
          text: `${actionDescription.SIDECHAIN} ${actionDescription.TURNED_OFF} ${objectType} ${getMoleculeTitle(
            objectName,
            target_on_name
          )}`
        };
      }
    } else if (action.type.includes(selectionConstants.APPEND_COMPLEX_LIST)) {
      if (action.item) {
        let objectType = action.item.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let objectName = action.item.name || getMoleculeName(action.item.id, state);

        trackAction = {
          type: actionType.INTERACTIONS_TURNED_ON,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.item.id,
          text: `${actionDescription.INTERACTION} ${actionDescription.TURNED_ON} ${objectType} ${getMoleculeTitle(
            objectName,
            target_on_name
          )}`
        };
      }
    } else if (action.type.includes(selectionConstants.REMOVE_FROM_COMPLEX_LIST)) {
      if (action.item) {
        let objectType = action.item.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let objectName = action.item.name || getMoleculeName(action.item.id, state);

        trackAction = {
          type: actionType.INTERACTIONS_TURNED_OFF,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.item.id,
          text: `${actionDescription.INTERACTION} ${actionDescription.TURNED_OFF} ${objectType} ${getMoleculeTitle(
            objectName,
            target_on_name
          )}`
        };
      }
    } else if (action.type.includes(selectionConstants.APPEND_SURFACE_LIST)) {
      if (action.item) {
        let objectType = action.item.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let objectName = action.item.name || getMoleculeName(action.item.id, state);

        trackAction = {
          type: actionType.SURFACE_TURNED_ON,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.item.id,
          text: `${actionDescription.SURFACE} ${actionDescription.TURNED_ON} ${objectType} ${getMoleculeTitle(
            objectName,
            target_on_name
          )}`
        };
      }
    } else if (action.type.includes(selectionConstants.REMOVE_FROM_SURFACE_LIST)) {
      if (action.item) {
        let objectType = action.item.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let objectName = action.item.name || getMoleculeName(action.item.id, state);

        trackAction = {
          type: actionType.SURFACE_TURNED_OFF,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.item.id,
          text: `${actionDescription.SURFACE} ${actionDescription.TURNED_OFF} ${objectType} ${getMoleculeTitle(
            objectName,
            target_on_name
          )}`
        };
      }
    } else if (action.type.includes(selectionConstants.APPEND_VECTOR_ON_LIST)) {
      if (action.item) {
        let objectType = action.item.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let objectName = action.item.name || getMoleculeName(action.item.id, state);

        trackAction = {
          type: actionType.VECTORS_TURNED_ON,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.item.id,
          text: `${actionDescription.VECTOR} ${actionDescription.TURNED_ON} ${objectType} ${getMoleculeTitle(
            objectName,
            target_on_name
          )}`
        };
      }
    } else if (action.type.includes(selectionConstants.REMOVE_FROM_VECTOR_ON_LIST)) {
      if (action.item) {
        let objectType = action.item.isInspiration === true ? actionObjectType.INSPIRATION : actionObjectType.MOLECULE;
        let objectName = action.item.name || getMoleculeName(action.item.id, state);

        trackAction = {
          type: actionType.VECTORS_TURNED_OFF,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.item.id,
          text: `${actionDescription.VECTOR} ${actionDescription.TURNED_OFF} ${objectType} ${getMoleculeTitle(
            objectName,
            target_on_name
          )}`
        };
      }
    } else if (action.type === selectionConstants.APPEND_TO_BUY_LIST) {
      if (action.item) {
        let objectType = actionObjectType.MOLECULE;
        let objectName = action.item && action.item.vector;

        trackAction = {
          type: actionType.MOLECULE_ADDED_TO_SHOPPING_CART,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: objectName,
          item: action.item,
          text: `${actionDescription.VECTOR} ${objectName} ${actionDescription.ADDED} ${actionDescription.TO_SHOPPING_CART}`
        };
      }
    } else if (action.type === selectionConstants.REMOVE_FROM_TO_BUY_LIST) {
      if (action.item) {
        let objectType = actionObjectType.MOLECULE;
        let objectName = action.item && action.item.vector;

        trackAction = {
          type: actionType.MOLECULE_REMOVED_FROM_SHOPPING_CART,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: objectName,
          item: action.item,
          text: `${actionDescription.VECTOR} ${objectName} ${actionDescription.REMOVED} ${actionDescription.FROM_SHOPPING_CART}`
        };
      }
    } else if (action.type === selectionConstants.APPEND_TO_BUY_LIST_ALL) {
      if (action.items) {
        let items = action.items;
        let objectType = actionObjectType.COMPOUND;

        trackAction = {
          type: actionType.MOLECULE_ADDED_TO_SHOPPING_CART_ALL,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          items: items,
          text: `${actionDescription.ALL} ${actionDescription.ADDED} ${actionDescription.TO_SHOPPING_CART}`
        };
      }
    } else if (action.type === selectionConstants.REMOVE_FROM_BUY_LIST_ALL) {
      if (action.items) {
        let items = action.items;
        let objectType = actionObjectType.COMPOUND;

        trackAction = {
          type: actionType.MOLECULE_REMOVED_FROM_SHOPPING_CART_ALL,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          items: items,
          text: `${actionDescription.ALL} ${actionDescription.REMOVED} ${actionDescription.FROM_SHOPPING_CART}`
        };
      }
    } else if (action.type === previewCompoundConstants.APPEND_SHOWED_COMPOUND_LIST) {
      if (action.item && action.payload) {
        let objectType = actionObjectType.COMPOUND;
        let objectName = action.item && action.item.vector;

        trackAction = {
          type: actionType.VECTOR_COUMPOUND_ADDED,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload,
          item: action.item,
          text: `${actionDescription.COMPOUND} ${objectName} ${actionDescription.ADDED}`
        };
      }
    } else if (action.type === previewCompoundConstants.REMOVE_SHOWED_COMPOUND_LIST) {
      if (action.item && action.payload) {
        let objectType = actionObjectType.COMPOUND;
        let objectName = action.item && action.item.vector;

        trackAction = {
          type: actionType.VECTOR_COUMPOUND_REMOVED,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload,
          item: action.item,
          text: `${actionDescription.COMPOUND} ${objectName} ${actionDescription.REMOVED}`
        };
      }
    } else if (action.type.includes(selectionConstants.SET_CURRENT_VECTOR)) {
      if (action.payload) {
        let objectType = actionObjectType.MOLECULE;
        let objectName = action.payload;

        trackAction = {
          type: actionType.VECTOR_SELECTED,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload,
          text: `${actionDescription.VECTOR} ${objectName} ${actionDescription.SELECTED}`
        };
      }
    } else if (action.type === previewCompoundConstants.SET_CURRENT_COMPOUND_CLASS) {
      if (action.payload) {
        let objectType = actionObjectType.COMPOUND;
        let objectName = action.payload;
        let oldObjectName = action.oldCompoundClass;

        trackAction = {
          type: actionType.CLASS_SELECTED,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: objectName,
          oldObjectName: oldObjectName,
          text: `${actionDescription.CLASS} ${objectName} ${actionDescription.SELECTED}`
        };
      }
    } else if (action.type === previewCompoundConstants.SET_COMPOUND_CLASSES) {
      if (action.payload) {
        let objectType = actionObjectType.COMPOUND;
        let newClassDescription = action.payload;
        let objectName = JSON.stringify(action.newClassDescription);
        let oldClassDescription = action.oldCompoundClasses;

        var regex = new RegExp('"', 'g');
        objectName = objectName
          .replace(regex, '')
          .replace('{', '')
          .replace('}', '');

        trackAction = {
          type: actionType.CLASS_UPDATED,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: objectName,
          oldClassDescription: oldClassDescription,
          newClassDescription: newClassDescription,
          text: `${actionDescription.CLASS} value ${actionDescription.UPDATED}: ${objectName}`
        };
      }
    } else if (action.type.includes(customDatasetConstants.APPEND_MOLECULE_TO_COMPOUNDS_TO_BUY_OF_DATASET)) {
      if (action.payload) {
        let objectType = actionObjectType.COMPOUND;
        let objectName = action.payload.moleculeTitle;

        trackAction = {
          type: actionType.COMPOUND_SELECTED,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload.moleculeID,
          dataset_id: action.payload.datasetID,
          text: `${objectType} ${objectName} ${actionDescription.SELECTED} of dataset: ${action.payload.datasetID}`
        };
      }
    } else if (action.type.includes(customDatasetConstants.REMOVE_MOLECULE_FROM_COMPOUNDS_TO_BUY_OF_DATASET)) {
      if (action.payload) {
        let objectType = actionObjectType.COMPOUND;
        let objectName = action.payload.moleculeTitle;

        trackAction = {
          type: actionType.COMPOUND_DESELECTED,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload.moleculeID,
          dataset_id: action.payload.datasetID,
          text: `${objectType} ${objectName} ${actionDescription.DESELECTED} of dataset: ${action.payload.datasetID}`
        };
      }
    } else if (action.type === customDatasetConstants.SET_SELECTED_ALL) {
      if (action.payload && action.payload.item) {
        let objectType =
          action.payload.item.isCrossReference === true ? actionObjectType.CROSS_REFERENCE : actionObjectType.COMPOUND;
        let objectName = action.payload.item.name;

        trackAction = {
          type: actionType.ALL_TURNED_ON,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload.item.id,
          dataset_id: action.payload.datasetID,
          isLigand: action.payload.isLigand,
          isProtein: action.payload.isProtein,
          isComplex: action.payload.isComplex,
          item: action.payload.item,
          text: `${actionDescription.ALL} ${actionDescription.TURNED_ON} ${objectType} ${objectName} of dataset: ${action.payload.datasetID}`
        };
      }
    } else if (action.type === customDatasetConstants.SET_DESELECTED_ALL) {
      if (action.payload && action.payload.item) {
        let objectType =
          action.payload.item.isCrossReference === true ? actionObjectType.CROSS_REFERENCE : actionObjectType.COMPOUND;
        let objectName = action.payload.item.name;

        trackAction = {
          type: actionType.ALL_TURNED_OFF,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload.item.id,
          dataset_id: action.payload.datasetID,
          isLigand: action.payload.isLigand,
          isProtein: action.payload.isProtein,
          isComplex: action.payload.isComplex,
          item: action.payload.item,
          text: `${actionDescription.ALL} ${actionDescription.TURNED_OFF} ${objectType} ${objectName} of dataset: ${action.payload.datasetID}`
        };
      }
    } else if (action.type === customDatasetConstants.SET_SELECTED_ALL_BY_TYPE) {
      if (action.payload) {
        let payload = action.payload;
        let objectType =
          payload.isCrossReference === true ? actionObjectType.CROSS_REFERENCE : actionObjectType.COMPOUND;
        let paylodTypeDescription = getTypeDescriptionOfSelectedAllAction(payload.type);
        let datasetDescription = payload.datasetID ? `of dataset: ${payload.datasetID}` : '';

        trackAction = {
          type: actionType.ALL_TURNED_ON_BY_TYPE,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          control_type: payload.type,
          items: payload.items,
          text: `${actionDescription.ALL} ${paylodTypeDescription} ${actionDescription.TURNED_ON} ${objectType} ${datasetDescription}`
        };
      }
    } else if (action.type === customDatasetConstants.SET_DESELECTED_ALL_BY_TYPE) {
      if (action.payload) {
        let payload = action.payload;
        let objectType =
          payload.isCrossReference === true ? actionObjectType.CROSS_REFERENCE : actionObjectType.COMPOUND;
        let paylodTypeDescription = getTypeDescriptionOfSelectedAllAction(payload.type);
        let datasetDescription = payload.datasetID ? `of dataset: ${payload.datasetID}` : '';

        trackAction = {
          type: actionType.ALL_TURNED_OFF_BY_TYPE,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          control_type: payload.type,
          items: payload.items,
          text: `${actionDescription.ALL} ${paylodTypeDescription} ${actionDescription.TURNED_OFF} ${objectType} ${datasetDescription}`
        };
      }
    } else if (action.type.includes(customDatasetConstants.APPEND_LIGAND_LIST)) {
      if (action.payload && action.payload.item) {
        let objectType =
          action.payload.item.isCrossReference === true ? actionObjectType.CROSS_REFERENCE : actionObjectType.COMPOUND;
        let objectName = action.payload.item.name;

        trackAction = {
          type: actionType.LIGAND_TURNED_ON,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload.item.id,
          dataset_id: action.payload.datasetID,
          text: `${actionDescription.LIGAND} ${actionDescription.TURNED_ON} ${objectType} ${objectName} of dataset: ${action.payload.datasetID}`
        };
      }
    } else if (action.type.includes(customDatasetConstants.REMOVE_FROM_LIGAND_LIST)) {
      if (action.payload && action.payload.item) {
        let objectType =
          action.payload.item.isCrossReference === true ? actionObjectType.CROSS_REFERENCE : actionObjectType.COMPOUND;
        let objectName = action.payload.item.name;

        trackAction = {
          type: actionType.LIGAND_TURNED_OFF,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload.item.id,
          dataset_id: action.payload.datasetID,
          text: `${actionDescription.LIGAND} ${actionDescription.TURNED_OFF} ${objectType} ${objectName} of dataset: ${action.payload.datasetID}`
        };
      }
    } else if (action.type.includes(customDatasetConstants.APPEND_PROTEIN_LIST)) {
      if (action.payload && action.payload.item) {
        let objectType =
          action.payload.item.isCrossReference === true ? actionObjectType.CROSS_REFERENCE : actionObjectType.COMPOUND;
        let objectName = action.payload.item.name;

        trackAction = {
          type: actionType.SIDECHAINS_TURNED_ON,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload.item.id,
          dataset_id: action.payload.datasetID,
          text: `${actionDescription.SIDECHAIN} ${actionDescription.TURNED_ON} ${objectType} ${objectName} of dataset: ${action.payload.datasetID}`
        };
      }
    } else if (action.type.includes(customDatasetConstants.REMOVE_FROM_PROTEIN_LIST)) {
      if (action.payload && action.payload.item) {
        let objectType =
          action.payload.item.isCrossReference === true ? actionObjectType.CROSS_REFERENCE : actionObjectType.COMPOUND;
        let objectName = action.payload.item.name;

        trackAction = {
          type: actionType.SIDECHAINS_TURNED_OFF,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload.item.id,
          dataset_id: action.payload.datasetID,
          text: `${actionDescription.SIDECHAIN} ${actionDescription.TURNED_OFF} ${objectType} ${objectName} of dataset: ${action.payload.datasetID}`
        };
      }
    } else if (action.type.includes(customDatasetConstants.APPEND_COMPLEX_LIST)) {
      if (action.payload && action.payload.item) {
        let objectType =
          action.payload.item.isCrossReference === true ? actionObjectType.CROSS_REFERENCE : actionObjectType.COMPOUND;
        let objectName = action.payload.item.name;

        trackAction = {
          type: actionType.INTERACTIONS_TURNED_ON,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload.item.id,
          dataset_id: action.payload.datasetID,
          text: `${actionDescription.INTERACTION} ${actionDescription.TURNED_ON} ${objectType} ${objectName} of dataset: ${action.payload.datasetID}`
        };
      }
    } else if (action.type.includes(customDatasetConstants.REMOVE_FROM_COMPLEX_LIST)) {
      if (action.payload && action.payload.item) {
        let objectType =
          action.payload.item.isCrossReference === true ? actionObjectType.CROSS_REFERENCE : actionObjectType.COMPOUND;
        let objectName = action.payload.item.name;

        trackAction = {
          type: actionType.INTERACTIONS_TURNED_OFF,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload.item.id,
          dataset_id: action.payload.datasetID,
          text: `${actionDescription.INTERACTION} ${actionDescription.TURNED_OFF} ${objectType} ${objectName} of dataset: ${action.payload.datasetID}`
        };
      }
    } else if (action.type.includes(customDatasetConstants.APPEND_SURFACE_LIST)) {
      if (action.payload && action.payload.item) {
        let objectType =
          action.payload.item.isCrossReference === true ? actionObjectType.CROSS_REFERENCE : actionObjectType.COMPOUND;
        let objectName = action.payload.item.name;

        trackAction = {
          type: actionType.SURFACE_TURNED_ON,
          annotation: actionAnnotation.CHECK,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload.item.id,
          dataset_id: action.payload.datasetID,
          text: `${actionDescription.SURFACE} ${actionDescription.TURNED_ON} ${objectType} ${objectName} of dataset: ${action.payload.datasetID}`
        };
      }
    } else if (action.type.includes(customDatasetConstants.REMOVE_FROM_SURFACE_LIST)) {
      if (action.payload && action.payload.item) {
        let objectType =
          action.payload.item.isCrossReference === true ? actionObjectType.CROSS_REFERENCE : actionObjectType.COMPOUND;
        let objectName = action.payload.item.name;

        trackAction = {
          type: actionType.SURFACE_TURNED_OFF,
          annotation: actionAnnotation.CLEAR,
          timestamp: Date.now(),
          username: username,
          object_type: objectType,
          object_name: objectName,
          object_id: action.payload.item.id,
          dataset_id: action.payload.datasetID,
          text: `${actionDescription.SURFACE} ${actionDescription.TURNED_OFF} ${objectType} ${objectName} of dataset: ${action.payload.datasetID}`
        };
      }
    } else if (action.type.includes(nglConstants.UPDATE_COMPONENT_REPRESENTATION)) {
      let objectType = actionObjectType.REPRESENTATION;

      trackAction = {
        type: actionType.REPRESENTATION_UPDATED,
        annotation: actionAnnotation.CHECK,
        timestamp: Date.now(),
        username: username,
        object_type: actionObjectType.REPRESENTATION,
        object_name: action.objectInViewID,
        object_id: action.objectInViewID,
        representation_id: action.representationID,
        representation: action.newRepresentation,
        change: action.change,
        text: `${objectType} '${action.change?.key}' of ${action.objectInViewID} ${actionDescription.UPDATED} from value: ${action.change?.oldValue} to value: ${action.change?.value}`
      };
    } else if (action.type.includes(nglConstants.ADD_COMPONENT_REPRESENTATION)) {
      let objectType = actionObjectType.REPRESENTATION;
      let representationName = action.newRepresentation && action.newRepresentation.type;

      trackAction = {
        type: actionType.REPRESENTATION_ADDED,
        annotation: actionAnnotation.CHECK,
        timestamp: Date.now(),
        username: username,
        object_type: actionObjectType.REPRESENTATION,
        object_name: representationName,
        object_id: action.objectInViewID,
        representation: action.newRepresentation,
        text: `${objectType} '${representationName}' of ${action.objectInViewID} ${actionDescription.ADDED}`
      };
    } else if (action.type.includes(nglConstants.REMOVE_COMPONENT_REPRESENTATION)) {
      let objectType = actionObjectType.REPRESENTATION;
      let representationName = action.representation && action.representation.type;

      trackAction = {
        type: actionType.REPRESENTATION_REMOVED,
        annotation: actionAnnotation.CLEAR,
        timestamp: Date.now(),
        username: username,
        object_type: objectType,
        object_name: representationName,
        object_id: action.objectInViewID,
        representation: action.representation,
        text: `${objectType} '${representationName}' of ${action.objectInViewID} ${actionDescription.REMOVED}`
      };
    } else if (action.type.includes(nglConstants.CHANGE_COMPONENT_REPRESENTATION)) {
      let objectType = actionObjectType.REPRESENTATION;
      let oldRepresentationName = action.oldRepresentation && action.oldRepresentation.type;
      let newRepresentationName = action.newRepresentation && action.newRepresentation.type;

      trackAction = {
        type: actionType.REPRESENTATION_CHANGED,
        annotation: actionAnnotation.CHECK,
        timestamp: Date.now(),
        username: username,
        object_type: objectType,
        object_name: action.objectInViewID,
        object_id: action.objectInViewID,
        oldRepresentation: action.oldRepresentation,
        newRepresentation: action.newRepresentation,
        text: `${objectType} of ${action.objectInViewID} ${actionDescription.CHANGED} from value: ${oldRepresentationName} to value: ${newRepresentationName}`
      };
    } else if (action.type.includes(nglConstants.SET_BACKGROUND_COLOR)) {
      let oldSetting = action.payload === BACKGROUND_COLOR.white ? BACKGROUND_COLOR.black : BACKGROUND_COLOR.white;
      let newSetting = action.payload;

      trackAction = {
        type: actionType.BACKGROUND_COLOR_CHANGED,
        annotation: actionAnnotation.CHECK,
        timestamp: Date.now(),
        username: username,
        object_type: 'NGL',
        object_name: 'NGL',
        oldSetting: oldSetting,
        newSetting: newSetting,
        text: `Color of NGL ${actionDescription.CHANGED} from value: ${oldSetting} to value: ${newSetting}`
      };
    } else if (action.type.includes(nglConstants.SET_CLIP_NEAR)) {
      let oldSetting = action.payload.oldValue;
      let newSetting = action.payload.newValue;

      trackAction = {
        type: actionType.CLIP_NEAR,
        merge: true,
        annotation: actionAnnotation.CHECK,
        timestamp: Date.now(),
        username: username,
        object_type: 'NGL',
        object_name: 'NGL',
        oldSetting: oldSetting,
        newSetting: newSetting,
        getText: function() {
          return "Clip near of NGL " + actionDescription.CHANGED + " from value: " + this.oldSetting + " to value: " + this.newSetting;
        },
        text: `Clip near of NGL ${actionDescription.CHANGED} from value: ${oldSetting} to value: ${newSetting}`
      };
    }
  }
  return trackAction;
};

const getMoleculeTitle = (objectName, targetName) => {
  let title = objectName.replace(new RegExp(`${targetName}-`, 'i'), '');
  return title;
};

const getMolGroupName = (molGroupId, state) => {
  let molGroupList = state.apiReducers.mol_group_list;
  let molGroup = molGroupList.find(group => group.id === molGroupId);
  let molGroupName = (molGroup && molGroup.description) || '';
  return molGroupName;
};

const getTargetName = (targetId, state) => {
  let targetList = state.apiReducers.target_id_list;
  let target = targetList.find(target => target.id === targetId);
  let targetName = (target && target.title) || '';
  return targetName;
};

const getMoleculeName = (moleculeId, state) => {
  let moleculeList = state.apiReducers.all_mol_lists;
  let moleculeName = '';

  if (moleculeList) {
    for (const group in moleculeList) {
      let molecules = moleculeList[group];

      let molecule = molecules.find(molecule => molecule.id === moleculeId);
      if (molecule && molecule != null) {
        moleculeName = molecule.protein_code;
        break;
      }
    }
  }
  return moleculeName;
};

const getTypeDescriptionOfSelectedAllAction = type => {
  switch (type) {
    case 'ligand':
      return actionDescription.LIGANDS;
    case 'protein':
      return actionDescription.SIDECHAINS;
    case 'complex':
      return actionDescription.INTERACTIONS;
    default:
      return type;
  }
};

export const createInitAction = target_on => (dispatch, getState) => {
  const state = getState();
  const username = DJANGO_CONTEXT['username'];

  if (target_on) {
    let targetName = getTargetName(target_on, state);
    let trackAction = {
      type: actionType.TARGET_LOADED,
      timestamp: Date.now(),
      username: username,
      object_type: actionObjectType.TARGET,
      object_name: targetName,
      object_id: target_on,
      text: `${actionDescription.TARGET} ${targetName} ${actionDescription.LOADED}`
    };

    return trackAction;
  }
};
