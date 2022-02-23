import React from 'react';
import { useBatchesNavigation } from './hooks/useBatchesNavigation';
import { useGetBatches } from './hooks/useGetBatches';
import { TreeView } from '@material-ui/lab';
import { ChevronRight, ExpandMore } from '@material-ui/icons';
import { useProjectContext } from '../../../common/hooks/useProjectContext';
import { NavigationItem } from './components/NavigationItem';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.action.active
  }
}));

const renderTree = nodes => {
  const { id, name } = nodes;

  return (
    <NavigationItem key={id} id={id} name={name}>
      {Array.isArray(nodes.children) ? nodes.children.map(node => renderTree(node)) : null}
    </NavigationItem>
  );
};

export const BatchNavigator = () => {
  const classes = useStyles();

  const { project } = useProjectContext();

  const { data: batches } = useGetBatches(project.id);
  const navigation = useBatchesNavigation(batches);

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore className={classes.icon} />}
      defaultExpandIcon={<ChevronRight className={classes.icon} />}
      disableSelection
      multiSelect
    >
      {navigation.map(item => renderTree(item))}
    </TreeView>
  );
};
