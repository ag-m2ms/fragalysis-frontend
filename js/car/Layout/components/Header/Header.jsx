import React, { useState } from 'react';
import { AppBar, Button, Toolbar, Typography, makeStyles } from '@material-ui/core';
import { ProjectMenu } from './components/ProjectMenu';
import { useDeleteProject } from './hooks/useDeleteProject';

const useStyles = makeStyles(theme => ({
  toolbar: {
    gap: theme.spacing(),
    '& button, a': {
      color: `${theme.palette.white} !important`
    }
  }
}));

export const Header = ({ setProject }) => {
  const classes = useStyles();

  const [projectMenuState, setProjectMenuState] = useState({});

  const { mutate: deleteProject } = useDeleteProject();

  const clearProjectMenuState = () => setProjectMenuState({});

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
          <Button
            onClick={event =>
              setProjectMenuState({
                id: 'load-project-menu',
                anchorEl: event.currentTarget,
                handleSelected: setProject,
                handleClose: clearProjectMenuState
              })
            }
          >
            Load project
          </Button>
          <Button
            onClick={event =>
              setProjectMenuState({
                id: 'delete-project-menu',
                anchorEl: event.currentTarget,
                handleSelected: project => deleteProject({ project }),
                handleClose: clearProjectMenuState
              })
            }
          >
            Delete Project
          </Button>
          <Button>Create OT Protocol</Button>
        </Toolbar>
      </AppBar>
      <ProjectMenu {...projectMenuState} />
    </>
  );
};
