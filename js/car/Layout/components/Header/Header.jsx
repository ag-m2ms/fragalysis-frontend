import React from 'react';
import { AppBar, Button, Toolbar, Typography, makeStyles } from '@material-ui/core';
import { DeleteProjectButton } from './components/DeleteProjectButton';
import { LoadProjectButton } from './components/LoadProjectButton';

const useStyles = makeStyles(theme => ({
  toolbar: {
    gap: theme.spacing(),
    '& button, a': {
      color: `${theme.palette.white} !important`
    }
  }
}));

export const Header = () => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" component="h1">
            Chemist Assisted Robotics
          </Typography>
          <Button href="/car/upload" component="button">
            New project
          </Button>
          <LoadProjectButton />
          <DeleteProjectButton />
          <Button>Create OT Protocol</Button>
        </Toolbar>
      </AppBar>
    </>
  );
};
