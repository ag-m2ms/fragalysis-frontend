import React from 'react';
import { makeStyles } from '@material-ui/core';
import { LoadingSpinner } from '../../../common/components/LoadingSpinner/LoadingSpinner';
import { BatchAccordion } from '../BatchAccordion';
import { useGetBatches } from './hooks/useGetBatches';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}));

export const ProjectView = ({ projectId }) => {
  const classes = useStyles();

  const { batches, isLoading } = useGetBatches(projectId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className={classes.root}>
      {batches.map((batch, index) => {
        return <BatchAccordion key={batch.id} open={index === 0} batch={batch} />;
      })}
    </main>
  );
};
