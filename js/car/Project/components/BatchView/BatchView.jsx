import React from 'react';
import { useBatchContext } from '../../hooks/useBatchContext';
import { SuspenseWithBoundary } from '../../../common/components/SuspenseWithBoundary';
import { ContentBox } from '../../../common/components/ContentBox';
import { BatchSummary } from './components/BatchSummary';
import { TargetTable } from '../TargetTable';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  box: {
    // Title wrapper
    '& > :first-child': {
      position: 'sticky',
      top: 0,
      zIndex: 100
    }
  }
}));

export const BatchView = () => {
  const classes = useStyles();

  const batch = useBatchContext();

  return (
    <ContentBox
      title={batch.batch_tag}
      endAdornment={
        <SuspenseWithBoundary
          SuspenseProps={{ fallback: null }}
          ErrorBoundaryProps={{ fallbackRender: () => null }}
          enableLegacySuspense
        >
          <BatchSummary />
        </SuspenseWithBoundary>
      }
      PaperProps={{ className: classes.box }}
    >
      <SuspenseWithBoundary>
        <TargetTable />
      </SuspenseWithBoundary>
    </ContentBox>
  );
};
