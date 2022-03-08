import React, { Fragment, useCallback } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { setRowsExpanded, useBatchesTableStateStore } from '../../../../../common/stores/batchesTableStateStore';
import { useBatchContext } from '../../../../hooks/useBatchContext';
import { ToolbarSection } from '../ToolbarSection/ToolbarSection';
import { RangeFilter } from '../RangeFilter';
import { YesNoFilter } from '../YesNoFilter';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    gap: theme.spacing(2),
    padding: `${theme.spacing()}px ${theme.spacing(2)}px`,
    '& > :nth-child(2)': {
      flexGrow: 1
    }
  },
  firstColumn: {
    flexBasis: 260
  },
  filterColumn: {
    display: 'grid',
    gap: theme.spacing(),
    width: '100%'
  }
}));

export const TableToolbar = ({ tableInstance }) => {
  const classes = useStyles();

  const batch = useBatchContext();

  const { flatRows, toggleAllRowsExpanded, columns } = tableInstance;

  const selectedMethodRowsCount = useBatchesTableStateStore(
    useCallback(state => Object.values(state.selected[batch.id] || {}).filter(value => value).length, [batch.id])
  );

  return (
    <div className={classes.root}>
      <div className={classes.firstColumn}>
        <ToolbarSection title="Summary">
          <Typography>Selected methods: {selectedMethodRowsCount}</Typography>
        </ToolbarSection>
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
        </ToolbarSection>
      </div>
      <ToolbarSection title="Filters">
        {columns
          .filter(column => column.canFilter)
          .map(column => (
            <Fragment key={column.id}>{column.render('Filter')}</Fragment>
          ))}
        <RangeFilter id="test" label="Test test test" min={10} max={25} filterValue={[10, 25]} setFilter={() => {}} />
        <YesNoFilter id="test2" label="Test2" filterValue={undefined} setFilter={() => {}} />
      </ToolbarSection>
    </div>
  );
};
