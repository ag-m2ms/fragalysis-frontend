import { constants } from './constants';

export const setSortDialogOpen = isOpen => ({
  type: constants.SET_SORT_DIALOG_OPEN,
  payload: isOpen
});
