import { Button, Tooltip } from '@material-ui/core';
import React, { useState } from 'react';
import { setRowsExpanded } from '../../../../../common/stores/batchesTableStateStore';
import { useBatchContext } from '../../../../hooks/useBatchContext';
import { ToolbarSection } from '../ToolbarSection';
import { CreateSubBatchDialog } from '../../../CreateSubBatchDialog';

export const ButtonSection = ({ tableInstance, selectedMethodsIds }) => {
  const { flatRows, toggleAllRowsExpanded, preFilteredFlatRows, setAllFilters } = tableInstance;

  const batch = useBatchContext();

  const filtersApplied = flatRows.length !== preFilteredFlatRows.length;

  const createSubBatchEnabled = !!selectedMethodsIds.length;

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <ToolbarSection title="Actions">
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={() => {
            toggleAllRowsExpanded(true);
            setRowsExpanded(
              batch.id,
              flatRows.filter(row => row.depth === 0),
              true
            );
          }}
        >
          Expand rows
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={() => {
            toggleAllRowsExpanded(false);
            setRowsExpanded(
              batch.id,
              flatRows.filter(row => row.depth === 0),
              false
            );
          }}
        >
          Collapse rows
        </Button>

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

        <Tooltip title={!filtersApplied ? 'No filters are active' : ''}>
          <span>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => {
                setAllFilters([]);
              }}
              disabled={!filtersApplied}
            >
              Clear filters
            </Button>
          </span>
        </Tooltip>
      </ToolbarSection>

      <CreateSubBatchDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedMethodsIds={selectedMethodsIds}
      />
    </>
  );
};
