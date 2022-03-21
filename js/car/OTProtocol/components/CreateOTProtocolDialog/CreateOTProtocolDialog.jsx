import React, { useState } from 'react';
import { SubmitDialog } from '../../../common/components/SubmitDialog';
import { SuspenseWithBoundary } from '../../../common/components/SuspenseWithBoundary';
import { makeStyles, Typography } from '@material-ui/core';
import { BatchSelector } from '../BatchSelector';
import { OTWarningSection } from './components/OTWarningSection';
import { useCreateOTProtocol } from './components/OTWarningSection/hooks/useCreateOTProtocol';

const useStyles = makeStyles(theme => ({
  section: {
    display: 'grid',
    gap: theme.spacing()
  },
  heading: {
    fontSize: '0.9rem',
    fontWeight: 500
  }
}));

export const CreateOTProtocolDialog = ({ open, onClose }) => {
  const classes = useStyles();

  const [selectedBatchesMap, setSelectedBatchesMap] = useState({});
  const selectedBatchesIds = Object.entries(selectedBatchesMap)
    .filter(([_, value]) => value)
    .map(([key]) => Number(key));

  const { mutate: createOTProtocol } = useCreateOTProtocol();

  return (
    <SubmitDialog
      id="create-ot-protocol-dialog"
      open={open}
      title="Create OT protocol"
      content={
        <section className={classes.section}>
          <Typography className={classes.heading}>Batches</Typography>
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
        </section>
      }
      onCancel={() => {
        onClose();
      }}
      onSubmit={() => createOTProtocol({ batchids: selectedBatchesIds })}
      submitDisabled={!Object.entries(selectedBatchesMap).length}
      TransitionProps={{
        // Clear the selection when dialog closes
        onExited: () => setSelectedBatchesMap({})
      }}
    />
  );
};
