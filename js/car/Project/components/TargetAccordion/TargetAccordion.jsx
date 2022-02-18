import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, colors, makeStyles } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { useBatchContext } from '../../hooks/useBatchContext';
import { useTargetContext } from '../../hooks/useTargetContext';
import { TargetAccordionSummary } from './components/TargetAccordionSummary';
import { TargetAccordionDetails } from './components/TargetAccordionDetails';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    boxShadow: 'none'
  },
  summary: {
    backgroundColor: colors.grey[100] // Might be removed
  },
  details: {
    padding: 0
  }
}));

export const TargetAccordion = () => {
  const classes = useStyles();

  const batch = useBatchContext();
  const target = useTargetContext();

  return (
    <Accordion
      className={classes.root}
      TransitionProps={{ unmountOnExit: true }} // Performance
    >
      <AccordionSummary
        className={classes.summary}
        expandIcon={<ExpandMore />}
        aria-controls={`target-accordion-${batch.id}-${target.id}-content`}
        id={`target-accordion-${batch.id}-${target.id}-header`}
      >
        <TargetAccordionSummary />
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <TargetAccordionDetails />
      </AccordionDetails>
    </Accordion>
  );
};
