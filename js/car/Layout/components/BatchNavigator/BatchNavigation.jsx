import React from 'react';
import { useBatchesNavigation } from './hooks/useBatchesNavigation';
import { useGetBatches } from './hooks/useGetBatches';
import { TreeView } from '@material-ui/lab';
import { ChevronRight, ExpandMore } from '@material-ui/icons';
import { NavigationItem } from './components/NavigationItem';
import { makeStyles } from '@material-ui/core';
import { useBatchesToDisplayStore } from '../../../common/stores/batchesToDisplayStore';
import { useCurrentProjectStore } from '../../../common/stores/currentProjectStore';

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.action.active
  }
}));

const selectedBatchesIdsSelector = state =>
  Object.entries(state)
    .filter(([_, value]) => value)
    .map(([batchId]) => String(batchId));

const renderTree = node => {
  const { batch } = node;

  return (
    <NavigationItem key={batch.id} batch={batch}>
      {Array.isArray(node.children) ? node.children.map(node => renderTree(node)) : null}
    </NavigationItem>
  );
};

export const BatchNavigation = () => {
  const classes = useStyles();

  const currentProject = useCurrentProjectStore();

  const { data: batches } = useGetBatches(currentProject.id);
  const navigation = useBatchesNavigation(batches);

  const selectedBatchesIds = useBatchesToDisplayStore(selectedBatchesIdsSelector);
  console.log(selectedBatchesIds);

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore className={classes.icon} />}
      defaultExpandIcon={<ChevronRight className={classes.icon} />}
      selected={selectedBatchesIds}
      disableSelection
      multiSelect
    >
      {navigation.map(item => renderTree(item))}
    </TreeView>
  );
};
