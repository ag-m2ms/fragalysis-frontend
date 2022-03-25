import React from 'react';
import { ChevronRight, ExpandMore } from '@material-ui/icons';
import { FormControl, FormHelperText, FormLabel, makeStyles } from '@material-ui/core';
import { TreeView } from '@material-ui/lab';
import { useBatchTree } from '../../../../../common/hooks/useBatchTree';
import { BatchSelectorItem } from '../BatchSelectorItem';
import { ErrorMessage, useField } from 'formik';
import { OTWarningSection } from '../OTWarningSection';
import { SuspenseWithBoundary } from '../../../../../common/components/SuspenseWithBoundary';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    gap: theme.spacing()
  },
  icon: {
    color: theme.palette.action.active
  }
}));

export const BatchSelector = ({ name, label }) => {
  const classes = useStyles();

  const batchTree = useBatchTree();

  const [field, meta, helpers] = useField(name);
  const selectedBatchesMap = field.value;

  const selectedBatchesIds = Object.entries(selectedBatchesMap)
    .filter(([_, value]) => value)
    .map(([key]) => String(key));

  const renderTree = node => {
    const { batch } = node;

    return (
      <BatchSelectorItem
        key={batch.id}
        batch={batch}
        selected={!!selectedBatchesMap[batch.id]}
        onSelect={(batchId, checked) => {
          helpers.setValue({ ...selectedBatchesMap, [batchId]: checked });
          // Without timeout the setTouched would execute sooner than setValue
          setTimeout(() => {
            helpers.setTouched();
          });
        }}
      >
        {Array.isArray(node.children) ? node.children.map(node => renderTree(node)) : null}
      </BatchSelectorItem>
    );
  };

  return (
    <FormControl variant="filled" error={meta.touched && !!meta.error}>
      <FormLabel>{label}</FormLabel>

      <SuspenseWithBoundary>
        <div className={classes.container}>
          <TreeView
            defaultCollapseIcon={<ExpandMore className={classes.icon} />}
            defaultExpandIcon={<ChevronRight className={classes.icon} />}
            selected={selectedBatchesIds}
            disableSelection
            multiSelect
          >
            {batchTree.map(item => renderTree(item))}
          </TreeView>
          <OTWarningSection selectedBatchesMap={selectedBatchesMap} />
        </div>
      </SuspenseWithBoundary>

      <ErrorMessage name={name}>{error => <FormHelperText error={true}>{error}</FormHelperText>}</ErrorMessage>
    </FormControl>
  );
};
