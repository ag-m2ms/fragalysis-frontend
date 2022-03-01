import React, { useCallback } from 'react';
import { TreeItem } from '@material-ui/lab';
import { Checkbox, Fab, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { setDisplayBatch, useBatchesToDisplayStore } from '../../../../../common/stores/batchesToDisplayStore';
import { useBatchViewsRefs } from '../../../../../common/stores/batchViewsRefsStore';
import { CgArrowsScrollV } from 'react-icons/cg';
import { IconComponent } from '../../../../../common/components/IconComponent';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  label: {
    display: 'flex',
    minWidth: 0,
    alignItems: 'center'
  },
  action: {
    padding: 0
  },
  leaf: {
    cursor: 'default'
  },
  name: {
    flexGrow: 1
  },
  button: {
    minHeight: 'unset',
    width: theme.spacing(2),
    height: theme.spacing(2),
    boxShadow: 'none'
  },
  icon: {
    width: '1.2em',
    height: '1.2em'
  }
}));

export const NavigationItem = ({ batch, children }) => {
  const classes = useStyles();

  const displayed = useBatchesToDisplayStore(
    useCallback(state => state.batchesToDisplay[batch.id] || false, [batch.id])
  );

  const elementRef = useBatchViewsRefs(useCallback(state => state.refs[batch.id], [batch.id]));

  return (
    <TreeItem
      classes={{ label: classes.label, content: !children.length && classes.leaf }}
      nodeId={String(batch.id)}
      label={
        <>
          <Typography className={classes.name} noWrap>
            {batch.batch_tag}
          </Typography>
          {!!elementRef && (
            <Tooltip title="Scroll to batch">
              <Fab
                className={classNames(classes.action, classes.button)}
                size="small"
                onClick={event => {
                  event.stopPropagation();
                  elementRef.scrollIntoView({ behavior: 'smooth' });
                }}
                color="secondary"
              >
                <IconComponent className={classes.icon} Component={CgArrowsScrollV} />
              </Fab>
            </Tooltip>
          )}
          <Tooltip title={displayed ? 'Hide batch' : 'Display batch'}>
            <Checkbox
              checked={displayed}
              className={classes.action}
              onClick={e => e.stopPropagation()}
              onChange={(_, checked) => setDisplayBatch(batch.id, checked)}
            />
          </Tooltip>
        </>
      }
    >
      {children}
    </TreeItem>
  );
};
