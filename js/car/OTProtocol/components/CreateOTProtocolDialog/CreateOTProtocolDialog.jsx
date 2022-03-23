import React, { useState } from 'react';
import { SubmitDialog } from '../../../common/components/SubmitDialog';
import { SuspenseWithBoundary } from '../../../common/components/SuspenseWithBoundary';
import { Typography } from '@material-ui/core';
import { BatchSelector } from '../BatchSelector';
import { OTWarningSection } from './components/OTWarningSection';
import { useCreateOTProtocol } from './hooks/useCreateOTProtocol';
import { DialogSection } from '../../../common/components/DialogSection';
import { DialogSectionHeading } from '../../../common/components/DialogSectionHeading';

export const CreateOTProtocolDialog = ({ open, onClose }) => {
  const [selectedBatchesMap, setSelectedBatchesMap] = useState({});
  const selectedBatchesIds = Object.entries(selectedBatchesMap)
    .filter(([_, value]) => value)
    .map(([key]) => Number(key));

  const { mutate: createOTProtocol } = useCreateOTProtocol();
  const [submitDisabled, setSubmitDisabled] = useState(false);

  return (
    <SubmitDialog
      id="create-ot-protocol-dialog"
      open={open}
      title="Create OT protocol"
      content={
        <DialogSection>
          <DialogSectionHeading>Batches</DialogSectionHeading>
          <Typography>Please select batches for OT protocol:</Typography>
          <SuspenseWithBoundary>
            <BatchSelector
              selectedBatchesMap={selectedBatchesMap}
              onBatchSelect={(batchId, selected) => {
                setSelectedBatchesMap(prevSelected => ({ ...prevSelected, [batchId]: selected }));
              }}
            />
            <OTWarningSection selectedBatchesMap={selectedBatchesMap} />
          </SuspenseWithBoundary>
        </DialogSection>
      }
      onCancel={() => {
        onClose();
      }}
      onSubmit={() => {
        setSubmitDisabled(true);
        createOTProtocol({ batchids: selectedBatchesIds });
        onClose();
      }}
      submitDisabled={!Object.entries(selectedBatchesMap).length || submitDisabled}
      TransitionProps={{
        onExited: () => {
          // Clear the selection when dialog closes
          setSelectedBatchesMap({});
          setSubmitDisabled(false);
        }
      }}
    />
  );
};
