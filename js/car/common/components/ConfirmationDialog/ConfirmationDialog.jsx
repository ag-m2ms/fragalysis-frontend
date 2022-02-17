import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';

export const ConfirmationDialog = ({ open, handleCancel, handleOk, id, title, text, ...other }) => {
  return (
    <Dialog aria-labelledby={id} open={open} {...other}>
      <DialogTitle id={id}>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography>{text}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
