import { Typography } from '@material-ui/core';
import React from 'react';
import { DialogSection } from '../../../common/components/DialogSection';
import { DialogSectionHeading } from '../../../common/components/DialogSectionHeading';
import { SuspenseWithBoundary } from '../../../common/components/SuspenseWithBoundary';
import { CloseDialog } from '../../../common/components/CloseDialog';
import {
  setOtProtocolForSummaryDialog,
  setOtProtocolSummaryDialogOpen,
  useOtProtocolSummaryDialogStore
} from '../../../common/stores/otProtocolSummaryDialogStore';

export const OTProtocolSummaryDialog = () => {
  const dialogOpen = useOtProtocolSummaryDialogStore.useDialogOpen();
  const otProtocol = useOtProtocolSummaryDialogStore.useOtProtocol();

  return (
    <CloseDialog
      id="ot-protocol-summary-dialog"
      open={dialogOpen}
      title="OT protocol summary"
      content={
        <DialogSection>
          <DialogSectionHeading>OT protocols</DialogSectionHeading>
          <Typography>
            This is a list of batches for which OT protocols have been generated with download links:
          </Typography>
          <SuspenseWithBoundary></SuspenseWithBoundary>
        </DialogSection>
      }
      onClose={() => {
        setOtProtocolSummaryDialogOpen(false);
      }}
      TransitionProps={{
        onExited: () => setOtProtocolForSummaryDialog(null)
      }}
    />
  );
};
