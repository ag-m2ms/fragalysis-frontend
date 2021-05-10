import {
  setSelectedTagList,
  appendSelectedTagList,
  removeFromSelectedTagList,
  setCategoryList,
  setTagList,
  setSpecialTagList,
  appendTagList
} from '../../../../reducers/selection/actions';
import { TAG_TYPE } from '../../../../constants/constants';
import { categories, tags } from './tempData';
import { specialTags } from './data';

import {
  setProteinList,
  setDensityList,
  setDensityListCustom,
  setQualityList,
  setComplexList,
  setSurfaceList,
  setFilter,
  setFragmentDisplayList,
  setMolGroupSelection,
  setVectorList,
  setVectorOnList
} from '../../../../reducers/selection/actions';
import { setMolGroupOn } from '../../../../reducers/api/actions';
import { setSortDialogOpen } from '../../molecule/redux/actions';
import { resetCurrentCompoundsSettings } from '../../compounds/redux/actions';

export const setTagSelectorData = (categories, tags) => dispatch => {
  dispatch(setCategoryList(categories));
  dispatch(setTagList(tags));
  dispatch(setSpecialTagList(specialTags));
};

export const addSelectedTag = (tagItem, tags) => dispatch => {
  if (tagItem.text === TAG_TYPE.ALL && tags) {
    tags.forEach(tag => {
      dispatch(appendSelectedTagList(tag));
    });
  }
  dispatch(appendSelectedTagList(tagItem));
};

export const removeSelectedTag = tagItem => dispatch => {
  if (tagItem.text === TAG_TYPE.ALL && tags) {
    tags.forEach(tag => {
      dispatch(removeFromSelectedTagList(tag));
    });
  }
  dispatch(removeFromSelectedTagList(tagItem));
};

export const editTag = ({ tag, data }) => (dispatch, getState) => {
  tag.text = data.text;
  tag.color = data.color;
  tag.forumPost = data.forumPost;
  tag.category = data.category?.id;
  let newCategory = data.category?.id === null ? data.category : null;
  return Promise.resolve(null);
};

export const addTag = ({ molecule, data }) => (dispatch, getState) => {
  let tags = data.tags;
  molecule.tags = tags;
  let newTags = tags.filter(t => t.id === null);
  if (newTags) {
    newTags.forEach(tag => {
      dispatch(appendTagList(tag));
    });
  }
  return Promise.resolve(null);
};

export const clearTagSelection = () => (dispatch, getState) => {
  dispatch(setSelectedTagList([]));
  dispatch(clearSelectionState());
};

const clearSelectionState = () => (dispatch, getState) => {
  dispatch(setMolGroupOn(undefined));
  dispatch(setMolGroupSelection([]));

  dispatch(setProteinList([]));
  dispatch(setDensityList([]));
  dispatch(setDensityListCustom([]));
  dispatch(setQualityList([]));
  dispatch(setSurfaceList([]));
  dispatch(setFragmentDisplayList([]));
  dispatch(setComplexList([]));
  dispatch(setVectorOnList([]));
  dispatch(setVectorList([]));

  dispatch(setFilter(undefined));
  dispatch(setSortDialogOpen(false));
  dispatch(resetCurrentCompoundsSettings(true));
};

export const storeData = data => (dispatch, getState) => {
  const categories = data.tag_categories;
  const tags = data.tags_info;

  dispatch(setTagSelectorData(categories, tags));

  let allMolecules = [];
  data.molecules.forEach(mol => {});
};
