import React, { useMemo } from 'react';
import { useCallback } from 'react';
import { HideNotificationButton } from '../components/HideNotificationButton/HideNotificationButton';

/**
 * Serves as a base for useProjectSnackbar and useGlobalSnackbar. This file should not be used directly. Use
 * useProjectSnackbar or useGlobalSnackbar instead.
 */
export const useSnackbarBase = snackbarBase => {
  const { enqueueSnackbar, closeSnackbar } = snackbarBase;

  const enqueueSnackbarSuccess = useCallback(
    (message, options = {}) => {
      return enqueueSnackbar(message, {
        variant: 'success',
        autoHideDuration: null,
        action: key => <HideNotificationButton messageId={key} />,
        ...options
      });
    },
    [enqueueSnackbar]
  );

  const enqueueSnackbarError = useCallback(
    (message, options = {}) => {
      return enqueueSnackbar(message, {
        variant: 'error',
        autoHideDuration: null,
        action: key => <HideNotificationButton messageId={key} />,
        ...options
      });
    },
    [enqueueSnackbar]
  );

  return useMemo(
    () => ({
      enqueueSnackbar,
      enqueueSnackbarSuccess,
      enqueueSnackbarError,
      closeSnackbar
    }),
    [enqueueSnackbar, enqueueSnackbarSuccess, enqueueSnackbarError, closeSnackbar]
  );
};
