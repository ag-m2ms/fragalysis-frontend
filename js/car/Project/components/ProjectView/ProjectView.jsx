import React from 'react';
import { makeStyles } from '@material-ui/core';
import { LoadingSpinner } from '../../../common/components/LoadingSpinner/LoadingSpinner';
import { BatchAccordion } from '../BatchAccordion';
import { useGetBatches } from './hooks/useGetBatches';
import { useProjectContext } from '../../../common/hooks/useProjectContext';
import { BatchContext } from '../../context/BatchContext';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}));

export const ProjectView = () => {
  const classes = useStyles();

  const { project } = useProjectContext();

  const { batches, isLoading } = useGetBatches(project.id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className={classes.root}>
      {batches.map((batch, index) => {
        return (
          <BatchContext.Provider key={batch.id} value={batch}>
            <BatchAccordion open={index === 0} />
          </BatchContext.Provider>
        );
      })}
    </main>
  );
};
