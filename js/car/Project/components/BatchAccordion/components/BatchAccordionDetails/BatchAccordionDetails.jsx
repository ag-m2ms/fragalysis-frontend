import { Divider, List, ListItem, makeStyles } from '@material-ui/core';
import React from 'react';
import { LoadingSpinner } from '../../../../../common/components/LoadingSpinner';
import { useBatchContext } from '../../../../hooks/useBatchContext';
import { useGetTargets } from './hooks/useGetTargets';
import { TargetContext } from '../../../../context/TargetContext';
import { TargetAccordion } from '../../../TargetAccordion';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    '& > li': {
      padding: 0
    }
  }
}));

export const BatchAccordionDetails = () => {
  const classes = useStyles();

  const batch = useBatchContext();

  const { data: targets, isLoading } = useGetTargets(batch.id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <List className={classes.list} disablePadding>
      {targets.map((target, index) => {
        return (
          <TargetContext.Provider key={index} value={target}>
            <ListItem disableGutters>
              <TargetAccordion />
            </ListItem>
            {!!(index < targets.length - 1) && <Divider />}
          </TargetContext.Provider>
        );
      })}
    </List>
  );
};
