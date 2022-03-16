import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';

export const ConfirmationDialog = ({ open, onCancel, cancelDisabled, onOk, okDisabled, id, title, text, ...other }) => {
  return (
    <Dialog aria-labelledby={id} open={open} {...other}>
      <DialogTitle id={id}>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography>{text}</Typography>
      </DialogContent>
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
