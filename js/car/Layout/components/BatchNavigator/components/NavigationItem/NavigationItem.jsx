import React from 'react';
import { TreeItem } from '@material-ui/lab';
import { Checkbox, makeStyles, Typography } from '@material-ui/core';

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

export const NavigationItem = ({ id, name, children }) => {
  const classes = useStyles();

  return (
    <TreeItem
      classes={{ label: classes.label, content: !children && classes.leaf }}
      nodeId={id}
      label={
        <>
          <Typography noWrap>{name}</Typography>
          <Checkbox className={classes.checkbox} onClick={e => e.stopPropagation()} />
        </>
      }
    >
      {children}
    </TreeItem>
  );
};
