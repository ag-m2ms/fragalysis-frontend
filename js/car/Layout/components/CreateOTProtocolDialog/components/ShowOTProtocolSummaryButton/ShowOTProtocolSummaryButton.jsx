import React from 'react';
import { useSnackbar } from 'notistack';
import { requestOtProtocolSummary } from '../../../../stores/otProtocolSummaryDialogStore';
import { SnackbarButton } from '../../../../../common/components/SnackbarButton';

export const ShowOTProtocolSummaryButton = ({ messageId, taskId }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <SnackbarButton
      onClick={() => {
        closeSnackbar(messageId);
        requestOtProtocolSummary(taskId);
      }}
    >
      Show summary
    </SnackbarButton>
  );
};
