import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useTargetContext } from '../../../../hooks/useTargetContext';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
    gap: theme.spacing()
  },
  name: {
    fontWeight: 500
  },
  image: {
    mixBlendMode: 'multiply'
  }
}));

export const TargetAccordionSummary = () => {
  const classes = useStyles();

  const target = useTargetContext();

  return (
    <div className={classes.root}>
      <img className={classes.image} src={target.image} width={120} height={60} alt={target.name} />

      <Typography className={classes.name} component="h3" noWrap>
        {target.name}
      </Typography>
    </div>
  );
};
