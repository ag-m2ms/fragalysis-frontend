import React from 'react';
import { ProjectView } from '../../../Project';
import { Header } from '../Header';
import { makeStyles } from '@material-ui/styles';
import { BatchNavigation } from '../BatchNavigator';
import { ContentBox } from '../../../common/components/ContentBox';
import { useClearStoresOnProjectChange } from './hooks/useClearStoresOnProjectChange';
import { useCurrentProjectStore } from '../../../common/stores/currentProjectStore';
import { SuspenseWithBoundary } from '../../../common/components/SuspenseWithBoundary';
import { useLayoutStore } from '../../../common/stores/layoutStore';

const useStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    gap: theme.spacing(2),
    padding: theme.spacing(2)
  },
  navigation: {
    flex: '1 0 300px'
  },
  navigationBox: {
    position: 'sticky',
    top: theme.spacing(2)
  },
  project: {
    flex: '1 1 100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2)
  }
}));

export const Layout = () => {
  const classes = useStyles();

  const navigationDisplayed = useLayoutStore.useNavigation();
  const projectViewDisplayed = useLayoutStore.useProjectView();

  const currentProject = useCurrentProjectStore.useCurrentProject();

  useClearStoresOnProjectChange();

  return (
    <>
      <Header />
      {currentProject && (
        <div className={classes.content}>
          {navigationDisplayed && (
            <aside className={classes.navigation}>
              <ContentBox title="Navigation" PaperProps={{ className: classes.navigationBox }}>
                <BatchNavigation />
              </ContentBox>
            </aside>
          )}
          {projectViewDisplayed && (
            <main className={classes.project}>
              <SuspenseWithBoundary>
                <ProjectView />
              </SuspenseWithBoundary>
            </main>
          )}
        </div>
      )}
    </>
  );
};
