import React from 'react';
import { useSnackbar } from 'notistack';
import { requestOtProtocolSummary } from '../../../../stores/otProtocolSummaryDialogStore';
import { SnackbarButton } from '../../../../../common/components/SnackbarButton';

export const ShowOTProtocolSummaryButton = ({ messageId, otProtocolId }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <SnackbarButton
      onClick={() => {
        closeSnackbar(messageId);
        requestOtProtocolSummary(otProtocolId);
      }}
    >
      Show summary
    </SnackbarButton>
  );
};
