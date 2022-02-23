import React, { useCallback } from 'react';
import { TreeItem } from '@material-ui/lab';
import { Checkbox, makeStyles, Typography } from '@material-ui/core';
import { setDisplayBatch, useBatchesToDisplayStore } from '../../../../../common/stores/batchesToDisplayStore';

const useStyles = makeStyles(theme => ({
  label: {
    display: 'grid',
    gridTemplateColumns: '1fr auto'
  },
  checkbox: {
    padding: 0
  },
  leaf: {
    cursor: 'default'
  }
}));

export const NavigationItem = ({ batch, children }) => {
  const classes = useStyles();

  const displayed = useBatchesToDisplayStore(useCallback(state => state[batch.id] || false, [batch.id]));

  return (
    <TreeItem
      classes={{ label: classes.label, content: !children.length && classes.leaf }}
      nodeId={String(batch.id)}
      label={
        <>
          <Typography noWrap>{batch.batch_tag}</Typography>
          <Checkbox
            checked={displayed}
            className={classes.checkbox}
            onClick={e => e.stopPropagation()}
            onChange={(_, checked) => setDisplayBatch(batch.id, checked)}
          />
        </>
      }
    >
      {children}
    </TreeItem>
  );
};
