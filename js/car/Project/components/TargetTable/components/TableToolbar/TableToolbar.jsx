import { Button, makeStyles, Typography } from '@material-ui/core';
import React, { useCallback } from 'react';
import { setRowsExpanded, useBatchesTableStateStore } from '../../../../../common/stores/batchesTableStateStore';
import { useBatchContext } from '../../../../hooks/useBatchContext';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 25%)'
  }
}));

export const TableToolbar = ({ tableInstance }) => {
  const classes = useStyles();

  const batch = useBatchContext();

  const { flatRows, toggleAllRowsExpanded } = tableInstance;

  const selectedMethodRowsCount = useBatchesTableStateStore(
    useCallback(state => Object.values(state.selected[batch.id] || {}).filter(value => value).length, [batch.id])
  );

  return (
    <div className={classes.root}>
      <div>
        <Typography>Selected methods: {selectedMethodRowsCount}</Typography>
      </div>
      <div>
        <Button
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
      </div>
    </div>
  );
};
