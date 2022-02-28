import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useGetBatchSummary } from './hooks/useGetBatchSummary';
import { IconComponent } from '../../../../../common/components/IconComponent';
import { FaFlask } from 'react-icons/fa';
import { Cancel, FindInPage } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  categoryInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, auto)',
    alignItems: 'center',
    gap: theme.spacing(1 / 2)
  }
}));

export const BatchSummary = () => {
  const classes = useStyles();

  const summary = useGetBatchSummary();

  return (
    <div className={classes.root}>
      <div className={classes.categoryInfo}>
        <Typography>{summary.total}</Typography>
        <IconComponent Component={FindInPage} />
      </div>

      <div className={classes.categoryInfo}>
        <Typography>{summary.synthesise}</Typography>
        <IconComponent Component={FaFlask} />
      </div>

      <div className={classes.categoryInfo}>
        <Typography>{summary.ignore}</Typography>
        <IconComponent Component={Cancel} />
      </div>
    </div>
  );
};
