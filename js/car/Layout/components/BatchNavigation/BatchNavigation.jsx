import React, { useState } from 'react';
import { useBatchTree } from '../../../common/hooks/useBatchTree';
import { useDeleteBatch } from './hooks/useDeleteBatch';
import { TreeView } from '@material-ui/lab';
import { ChevronRight, ExpandMore } from '@material-ui/icons';
import { NavigationItem } from './components/NavigationItem';
import { makeStyles } from '@material-ui/core';
import { setBatchesExpanded, useBatchNavigationStore } from '../../../common/stores/batchNavigationStore';
import { ConfirmationDialog } from '../../../common/components/ConfirmationDialog';

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.action.active
  }
}));

const selectedBatchesIdsSelector = state =>
  Object.entries(state.selected)
    .filter(([_, value]) => value)
    .map(([batchId]) => String(batchId));

export const BatchNavigation = () => {
  const classes = useStyles();

  const batchTree = useBatchTree();

  const selected = useBatchNavigationStore(selectedBatchesIdsSelector);
  const expanded = useBatchNavigationStore.useExpanded();

  const [batchToDelete, setBatchToDelete] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutate: deleteBatch } = useDeleteBatch();

  const renderTree = node => {
    const { batch } = node;

    return (
      <NavigationItem
        key={batch.id}
        node={node}
        onDelete={batch => {
          setBatchToDelete(batch);
          setDialogOpen(true);
        }}
      >
        {Array.isArray(node.children) ? node.children.map(node => renderTree(node)) : null}
      </NavigationItem>
    );
  };

  return (
    <>
      <TreeView
        defaultCollapseIcon={<ExpandMore className={classes.icon} />}
        defaultExpandIcon={<ChevronRight className={classes.icon} />}
        selected={selected}
        expanded={expanded}
        onNodeToggle={(event, nodeIds) => setBatchesExpanded(nodeIds)}
        disableSelection
        multiSelect
      >
        {batchTree.map(item => renderTree(item))}
      </TreeView>

      <ConfirmationDialog
        id="delete-subbatch-dialog"
        open={dialogOpen}
        title="Delete subbatch"
        text={
          <>
            Are you sure you want to delete batch <b>{batchToDelete?.batch_tag}</b>?
          </>
        }
        onCancel={() => setDialogOpen(false)}
        onOk={() => {
          deleteBatch({ batch: batchToDelete });
          setDialogOpen(false);
        }}
        TransitionProps={{
          // Prevents batch name from suddenly disappearing when the dialog is closing
          onExited: () => setBatchToDelete(null)
        }}
      />
    </>
  );
};
