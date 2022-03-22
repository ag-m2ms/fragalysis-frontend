import React from 'react';
import { IconButton } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import { useSnackbar } from 'notistack';

export const HideNotificationButton = ({ messageId }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(messageId)} color="inherit">
      <Cancel />
    </IconButton>
  );
};
