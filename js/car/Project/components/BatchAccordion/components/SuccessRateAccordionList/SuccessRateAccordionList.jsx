import React, { Fragment } from 'react';
import { Divider, List, ListItem, makeStyles } from '@material-ui/core';
import { useGetMethodsReactions } from './hooks/useGetMethodsReactions';
import { useGetTargets } from './hooks/useGetTargets';
import { useCategorizeMethodsDataBySuccessRate } from './hooks/useCategorizeMethodsDataBySuccessRate';
import { LoadingSpinner } from '../../../../../common/components/LoadingSpinner';
import { SuccessRateAccordion } from '../../../SuccessRateAccordion';
import { useGetMethodsForTargets } from './hooks/useGetMethodsForTargets';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    '& > li': {
      padding: 0
    }
  }
}));

// Separated from StepAccordion to enable loading reactions only when StepAccordion's details are open
export const SuccessRateAccordionList = ({ batch }) => {
  const classes = useStyles();

  const { targetsWithBatch, isLoading: isLoadingTargets } = useGetTargets(batch);
  const { methodsWithTarget, isLoading: isLoadingMethodsWithTargets } = useGetMethodsForTargets(targetsWithBatch);
  const { methodsData, isLoading: isLoadingMethodsReactions } = useGetMethodsReactions(methodsWithTarget);
  const categorizedMethodsData = useCategorizeMethodsDataBySuccessRate(methodsData);

  if (isLoadingTargets || isLoadingMethodsWithTargets || isLoadingMethodsReactions) {
    return <LoadingSpinner />;
  }

  return (
    <List className={classes.list} disablePadding>
      {Object.entries(categorizedMethodsData)
        .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
        .sort(([keyA], [keyB]) => keyA.length - keyB.length)
        .map(([successString, methodData], index) => {
          return (
            <Fragment key={successString}>
              <ListItem disableGutters>
                <SuccessRateAccordion batch={batch} successString={successString} methodData={methodData} />
              </ListItem>
              {!!(index < methodData.length - 1) && <Divider />}
            </Fragment>
          );
        })}
    </List>
  );
};
