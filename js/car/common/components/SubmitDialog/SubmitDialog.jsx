import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react';

export const SubmitDialog = ({
  open,
  onCancel,
  cancelDisabled,
  onSubmit,
  submitDisabled,
  id,
  title,
  content,
  ...other
}) => {
  return (
    <Dialog aria-labelledby={id} open={open} fullWidth {...other}>
      <DialogTitle id={id}>{title}</DialogTitle>
      <DialogContent dividers>{content}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel} color="primary" disabled={cancelDisabled}>
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary" disabled={submitDisabled}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
