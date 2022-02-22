import React from 'react';
import { colors, TableCell, TableRow, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useGetMethodsWithReactions } from './hooks/useGetMethodsWithReactions';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { LoadingSpinner } from '../../../../../common/components/LoadingSpinner';
import { ExpandMore } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    gridTemplateColumns: 'repeat(2, auto) 1fr',
    justifyContent: 'flex-start',
    backgroundColor: colors.grey[100],
    cursor: 'pointer'
  },
  name: {
    width: '100%',
    fontWeight: 500
  },
  image: {
    mixBlendMode: 'multiply'
  },
  button: {
    color: theme.palette.action.active,
    justifySelf: 'flex-end',
    transform: ({ expanded }) => `rotate(${expanded ? 180 : 0}deg)`
  }
}));

export const TargetRow = ({ row, updateTargetMethodsWitReactions, updateExpandedState }) => {
  const classes = useStyles({ expanded: row.isExpanded });

  const target = row.original;

  const { data: methodsWithReactions, isLoading } = useGetMethodsWithReactions(target.id, !!row.isExpanded);

  // useQueries always returns new array no matter what
  useDeepCompareEffect(() => {
    if (methodsWithReactions) {
      updateTargetMethodsWitReactions(target.id, methodsWithReactions);
    }
  }, [methodsWithReactions, updateTargetMethodsWitReactions, target.id]);

  return (
    <>
      <TableRow
        className={classes.root}
        onClick={() => {
          row.toggleRowExpanded();
          updateExpandedState(row.id, !row.isExpanded);
        }}
      >
        <TableCell>
          <img className={classes.image} src={target.image} width={120} height={60} alt={name} />
        </TableCell>

        <TableCell>
          <Typography className={classes.name} component="h3" noWrap>
            {target.name}
          </Typography>
        </TableCell>

        <TableCell>
          <ExpandMore className={classes.button} />
        </TableCell>
      </TableRow>

      {isLoading && row.isExpanded && (
        <TableRow>
          <TableCell>
            <LoadingSpinner />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
