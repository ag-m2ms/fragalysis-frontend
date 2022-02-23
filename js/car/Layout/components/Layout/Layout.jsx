import React from 'react';
import { ProjectView } from '../../../Project';
import { Header } from '../Header';
import { makeStyles } from '@material-ui/styles';
import { SuspenseWithBoundary } from '../../../common/components/SuspenseWithBoundary/SuspenseWithBoundary';
import { BatchNavigation } from '../BatchNavigator/BatchNavigation';
import { ContentBox } from '../../../common/components/ContentBox/ContentBox';
import { useClearStoresOnProjectChange } from './hooks/useClearStoresOnProjectChange';
import { useCurrentProjectStore } from '../../../common/stores/currentProjectStore';

const useStyles = makeStyles(theme => ({
  content: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
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
              <SuspenseWithBoundary>
                <BatchNavigation />
              </SuspenseWithBoundary>
            </ContentBox>
          </aside>
          <ProjectView />
        </div>
      )}
    </>
  );
};
