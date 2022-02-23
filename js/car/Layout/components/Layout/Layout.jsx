import React, { useState, useMemo } from 'react';
import { ProjectView } from '../../../Project';
import { Header } from '../Header';
import { ProjectContext } from '../../../common/context/ProjectContext';
import { makeStyles } from '@material-ui/styles';
import { SuspenseWithBoundary } from '../../../common/components/SuspenseWithBoundary/SuspenseWithBoundary';
import { BatchNavigator } from '../BatchNavigator/BatchNavigator';
import { ContentBox } from '../../../common/components/ContentBox/ContentBox';

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

  const [project, setProject] = useState(null);

  const value = useMemo(
    () => ({
      project,
      setProject
    }),
    [project]
  );

  return (
    <ProjectContext.Provider value={value}>
      <Header />
      {project && (
        <div className={classes.content}>
          <aside>
            <ContentBox title="Navigation">
              <SuspenseWithBoundary>
                <BatchNavigator />
              </SuspenseWithBoundary>
            </ContentBox>
          </aside>
          <ProjectView />
        </div>
      )}
    </ProjectContext.Provider>
  );
};
