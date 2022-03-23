import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';

export const CloseDialog = ({ open, onClose, id, title, content, ...other }) => {
  return (
    <Dialog aria-labelledby={id} open={open} {...other}>
      <DialogTitle id={id}>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
