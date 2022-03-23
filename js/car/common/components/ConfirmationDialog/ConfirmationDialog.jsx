import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

export const ConfirmationDialog = ({
  open,
  onCancel,
  cancelDisabled,
  onOk,
  okDisabled,
  id,
  title,
  content,
  ...other
}) => {
  return (
    <Dialog aria-labelledby={id} open={open} {...other}>
      <DialogTitle id={id}>{title}</DialogTitle>
      <DialogContent dividers>{content}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel} disabled={cancelDisabled} color="primary">
          Cancel
        </Button>
        <Button onClick={onOk} disabled={okDisabled} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
