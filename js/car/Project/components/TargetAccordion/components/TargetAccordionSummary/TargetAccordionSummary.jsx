import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useTargetContext } from '../../../../hooks/useTargetContext';

const useStyles = makeStyles(theme => ({
  root: {
    width: 120, // The same width as target image
    display: 'grid',
    justifyContent: 'center'
  },
  name: {
    textAlign: 'center'
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

      <Typography className={classes.name} variant="caption" noWrap>
        {target.name}
      </Typography>
    </div>
  );
};
