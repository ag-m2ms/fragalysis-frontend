import React from 'react';
import { ProjectView } from '../../../Project';
import { Header } from '../Header';
import { makeStyles } from '@material-ui/styles';
import { BatchNavigation } from '../BatchNavigator';
import { ContentBox } from '../../../common/components/ContentBox';
import { useClearStoresOnProjectChange } from './hooks/useClearStoresOnProjectChange';
import { useCurrentProjectStore } from '../../../common/stores/currentProjectStore';
import { SuspenseWithBoundary } from '../../../common/components/SuspenseWithBoundary';

const useStyles = makeStyles(theme => ({
  content: {
    display: 'grid',
    gridTemplateColumns: '300px minmax(0, 1fr)',
    gap: theme.spacing(2),
    padding: theme.spacing(2)
  }
}));

export const Layout = () => {
  const classes = useStyles();

  const currentProject = useCurrentProjectStore.useCurrentProject();

  useClearStoresOnProjectChange();

  return (
    <>
      <Header />
      {currentProject && (
        <div className={classes.content}>
          <aside>
            <ContentBox title="Navigation">
              <BatchNavigation />
            </ContentBox>
          </aside>
          <main>
            <SuspenseWithBoundary>
              <ProjectView />
            </SuspenseWithBoundary>
          </main>
        </div>
      )}
    </>
  );
};
