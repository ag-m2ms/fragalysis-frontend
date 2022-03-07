import React from 'react';
import { AppBar, Button, Toolbar, Typography, makeStyles } from '@material-ui/core';
import { DeleteProjectButton } from './components/DeleteProjectButton';
import { LoadProjectButton } from './components/LoadProjectButton';
import { setNavigationDisplayed, setProjectViewDisplayed, useLayoutStore } from '../../../common/stores/layoutStore';
import { useCurrentProjectStore } from '../../../common/stores/currentProjectStore';
import { LayoutSwitch } from './components/LayoutSwitch/LayoutSwitch';

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

  const navigationDisplayed = useLayoutStore.useNavigation();
  const projectViewDisplayed = useLayoutStore.useProjectView();

  const currentProject = useCurrentProjectStore.useCurrentProject();

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
          {!!currentProject && (
            <>
              <LayoutSwitch checked={navigationDisplayed} onChange={setNavigationDisplayed} label="Navigation" />
              <LayoutSwitch checked={projectViewDisplayed} onChange={setProjectViewDisplayed} label="Project view" />
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};
