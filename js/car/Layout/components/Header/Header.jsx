import React from 'react';
import { AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';
import { DeleteProjectButton } from './components/DeleteProjectButton';
import { LoadProjectButton } from './components/LoadProjectButton';
import { setNavigationDisplayed, setProjectViewDisplayed, useLayoutStore } from '../../../common/stores/layoutStore';
import { useCurrentProjectStore } from '../../../common/stores/currentProjectStore';
import { LayoutSwitch } from './components/LayoutSwitch/LayoutSwitch';
import { CreateOTProtocolButton } from './components/CreateOTProtocolButton/CreateOTProtocolButton';
import { OTProtocolHistoryButton } from './components/OTProtocolHistoryButton/OTProtocolHistoryButton';
import { UploadProjectButton } from './components/UploadProjectButton/UploadProjectButton';

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
          <UploadProjectButton />
          <LoadProjectButton />
          <DeleteProjectButton />
          {!!currentProject && (
            <>
              <CreateOTProtocolButton />
              <OTProtocolHistoryButton />
              <LayoutSwitch checked={navigationDisplayed} onChange={setNavigationDisplayed} label="Navigation" />
              <LayoutSwitch checked={projectViewDisplayed} onChange={setProjectViewDisplayed} label="Project view" />
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};
