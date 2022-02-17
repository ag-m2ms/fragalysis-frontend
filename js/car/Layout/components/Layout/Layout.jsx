import React, { useState, useMemo } from 'react';
import Project from '../../../Project';
import { Header } from '../Header';
import { ProjectContext } from '../../../common/context/ProjectContext';

export const Layout = () => {
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
      {project && <Project />}
    </ProjectContext.Provider>
  );
};
