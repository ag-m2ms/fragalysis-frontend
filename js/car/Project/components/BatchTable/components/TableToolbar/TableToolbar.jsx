import React, { Fragment, useCallback, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  makeStyles,
  Tooltip,
  Typography
} from '@material-ui/core';
import { setRowsExpanded, useBatchesTableStateStore } from '../../../../../common/stores/batchesTableStateStore';
import { useBatchContext } from '../../../../hooks/useBatchContext';
import { ToolbarSection } from '../ToolbarSection/ToolbarSection';
import { ExpandMore } from '@material-ui/icons';
import { CreateSubBatchButton } from '../CreateSubBatchButton';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '0 !important'
  },
  heading: {
    fontWeight: 500
  },
  details: {
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

  const { flatRows, toggleAllRowsExpanded, columns, preFilteredFlatRows, setAllFilters } = tableInstance;

  const selectedMethods = useBatchesTableStateStore(
    useCallback(
      state =>
        Object.entries(state.selected[batch.id] || {})
          .filter(([_, value]) => value)
          // Method row ids are in a form targetId.methodId
          .map(([key]) => Number(key.split('.')[1])),
      [batch.id]
    )
  );

  const [accordionOpen, setAccordionOpen] = useState(false);

  const filtersApplied = flatRows.length !== preFilteredFlatRows.length;

  return (
    <Accordion
      expanded={accordionOpen}
      className={classes.root}
      elevation={0}
      onChange={(event, expanded) => setAccordionOpen(expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography className={classes.heading}>
          {accordionOpen ? 'Hide' : 'Show'} table summary, actions and filters
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <div className={classes.firstColumn}>
          <ToolbarSection title="Summary">
            <Typography>Selected methods: {selectedMethods.length}</Typography>
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
            <CreateSubBatchButton selectedMethods={selectedMethods} />
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
        </div>
        <ToolbarSection title="Filters">
          {columns
            .filter(column => column.canFilter)
            .sort((a, b) => a.filterOrder - b.filterOrder)
            .map(column => (
              <Fragment key={column.id}>{column.render('Filter')}</Fragment>
            ))}
        </ToolbarSection>
      </AccordionDetails>
    </Accordion>
  );
};
