import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { useLayoutEffect, useState } from 'react';
import { SuccessRateAccordionList } from './components/SuccessRateAccordionList';
import { useBatchContext } from '../../hooks/useBatchContext';

const useStyles = makeStyles(theme => ({
  summary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white,
    position: 'sticky',
    top: 0,
    zIndex: 3
  },
  collapseIcon: {
    color: theme.palette.white
  },
  details: {
    padding: 0
  }
}));

export const BatchAccordion = ({ open }) => {
  const classes = useStyles();

  const batch = useBatchContext();

  const [expanded, setExpanded] = useState(open);

  useLayoutEffect(() => {
    setExpanded(open);
  }, [open]);

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, expanded) => setExpanded(expanded)}
      TransitionProps={{ unmountOnExit: true }} // Performance
    >
      <AccordionSummary
        className={classes.summary}
        expandIcon={<ExpandMore className={classes.collapseIcon} />}
        aria-controls={`batch-accordion-${batch.id}-content`}
        id={`batch-accordion-${batch.id}-header`}
      >
        <Typography variant="h6" component="h2">
          {batch.batch_tag}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <SuccessRateAccordionList />
      </AccordionDetails>
    </Accordion>
  );
};
