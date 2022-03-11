import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';

export const ConfirmationDialog = ({ open, onCancel, onOk, id, title, text, ...other }) => {
  return (
    <Dialog aria-labelledby={id} open={open} {...other}>
      <DialogTitle id={id}>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography>{text}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
