import React from 'react';
import { ChevronRight, ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';
import { TreeView } from '@material-ui/lab';
import { useBatchTree } from '../../../common/hooks/useBatchTree';
import { SelectorItem } from './components/SelectorItem/SelectorItem';

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.action.active
  }
}));

export const BatchSelector = ({ selectedBatchesMap, onBatchSelect }) => {
  const classes = useStyles();

  const batchTree = useBatchTree();

  const selectedBatchesIds = Object.entries(selectedBatchesMap)
    .filter(([_, value]) => value)
    .map(([key]) => String(key));

  const renderTree = node => {
    const { batch } = node;

    return (
      <SelectorItem key={batch.id} batch={batch} selected={!!selectedBatchesMap[batch.id]} onSelect={onBatchSelect}>
        {Array.isArray(node.children) ? node.children.map(node => renderTree(node)) : null}
      </SelectorItem>
    );
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore className={classes.icon} />}
      defaultExpandIcon={<ChevronRight className={classes.icon} />}
      selected={selectedBatchesIds}
      disableSelection
      multiSelect
    >
      {batchTree.map(item => renderTree(item))}
    </TreeView>
  );
};
