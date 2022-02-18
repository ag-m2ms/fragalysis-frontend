import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Typography } from '@material-ui/core';
import { Cancel, ExpandMore, FindInPage } from '@material-ui/icons';
import { useLayoutEffect, useState } from 'react';
import { useBatchContext } from '../../hooks/useBatchContext';
import { FaFlask, FaRegEdit } from 'react-icons/fa';
import { IconComponent } from '../../../common/components/IconComponent';
import { BatchAccordionDetails } from './components/BatchAccordionDetails';

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
  },
  categoryInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, auto)',
    alignItems: 'center',
    gap: theme.spacing(1 / 2)
  }
}));

const temporaryData = [
  { type: 'review', CategoryIcon: FindInPage, value: 300 },
  { type: 'edit', CategoryIcon: FaRegEdit, value: 10 },
  { type: 'synthesise', CategoryIcon: FaFlask, value: 400 },
  { type: 'ignore', CategoryIcon: Cancel, value: 10 }
];

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
        <div>
          {temporaryData.map(({ value, CategoryIcon }, index) => {
            return (
              <div key={index} className={classes.categoryInfo}>
                <Typography>{value}</Typography>
                <IconComponent Component={CategoryIcon} />
              </div>
            );
          })}
        </div>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <BatchAccordionDetails />
      </AccordionDetails>
    </Accordion>
  );
};
