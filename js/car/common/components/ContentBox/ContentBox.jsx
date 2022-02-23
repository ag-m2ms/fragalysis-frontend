import React from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  title: {
    minHeight: theme.spacing(6),
    padding: `0 ${theme.spacing(2)}px`,
    display: 'grid',
    alignItems: 'center',
    color: theme.palette.white,
    backgroundColor: theme.palette.primary.main
  }
}));

export const ContentBox = ({ title, children }) => {
  const classes = useStyles();

  return (
    <Paper square>
      <div className={classes.title}>
        <Typography variant="h6" component="h2" noWrap>
          {title}
        </Typography>
      </div>
      {children}
    </Paper>
  );
};
