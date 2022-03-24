import { Button, Tooltip } from '@material-ui/core';
import React, { useState } from 'react';
import { CreateSubBatchDialog } from '../CreateSubBatchDialog';

export const CreateSubBatchButton = ({ selectedMethodsIds }) => {
  const createSubBatchEnabled = !!selectedMethodsIds.length;

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Tooltip title={!createSubBatchEnabled ? 'In order to create a SubBatch some methods have to be selected' : ''}>
        <span>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => {
              setDialogOpen(true);
            }}
            disabled={!createSubBatchEnabled}
          >
            Create subbatch
          </Button>
        </span>
      </Tooltip>

      <CreateSubBatchDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedMethodsIds={selectedMethodsIds}
      />
    </>
  );
};
