import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { useBatchContext } from '../../hooks/useBatchContext';
import { BatchAccordionDetails } from './components/BatchAccordionDetails';
import { SuspenseWithBoundary } from '../../../common/components/SuspenseWithBoundary';
import { BatchSummary } from './components/BatchSummary';

const useStyles = makeStyles(theme => ({
  summary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '45% 1fr',
    gap: theme.spacing(2),
    '& > div': {
      display: 'flex',
      gap: theme.spacing()
    }
  },
  collapseIcon: {
    color: theme.palette.white
  },
  details: {
    padding: 0
  }
}));

export const BatchAccordion = () => {
  const classes = useStyles();

  const batch = useBatchContext();

  return (
    <Accordion
      TransitionProps={{ mountOnEnter: true }} // Performance
    >
      <AccordionSummary
        className={classes.summary}
        classes={{
          content: classes.content
        }}
        expandIcon={<ExpandMore className={classes.collapseIcon} />}
        aria-controls={`batch-accordion-${batch.id}-content`}
        id={`batch-accordion-${batch.id}-header`}
      >
        <Typography variant="h6" component="h2" noWrap>
          {batch.batch_tag}
        </Typography>
        {/** Since loading will be displayed for the details, there's no point displaying loading in the header as well */}
        <SuspenseWithBoundary
          SuspenseProps={{ fallback: null }}
          ErrorBoundaryProps={{ fallbackRender: () => null }}
          enableLegacySuspense
        >
          <BatchSummary />
        </SuspenseWithBoundary>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <SuspenseWithBoundary>
          <BatchAccordionDetails />
        </SuspenseWithBoundary>
      </AccordionDetails>
    </Accordion>
  );
};
