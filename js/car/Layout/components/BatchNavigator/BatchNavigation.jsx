import React from 'react';
import { useBatchNavigation } from './hooks/useBatchNavigation';
import { TreeView } from '@material-ui/lab';
import { ChevronRight, ExpandMore } from '@material-ui/icons';
import { NavigationItem } from './components/NavigationItem';
import { makeStyles } from '@material-ui/core';
import { useBatchesToDisplayStore } from '../../../common/stores/batchesToDisplayStore';

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.action.active
  }
}));

const selectedBatchesIdsSelector = state =>
  Object.entries(state.batchesToDisplay)
    .filter(([_, value]) => value)
    .map(([batchId]) => String(batchId));

const renderTree = node => {
  const { batch } = node;

  return (
    <NavigationItem key={batch.id} node={node}>
      {Array.isArray(node.children) ? node.children.map(node => renderTree(node)) : null}
    </NavigationItem>
  );
};

export const BatchNavigation = () => {
  const classes = useStyles();

  const navigation = useBatchNavigation();

  const selectedBatchesIds = useBatchesToDisplayStore(selectedBatchesIdsSelector);

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
