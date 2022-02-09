import React, { useState } from 'react';
import Project from '../../../Project';
import { Header } from '../Header';

export const Layout = () => {
  const [project, setProject] = useState(null);

  return (
    <>
      <Header setProject={setProject} />
      {project && <Project projectId={project.id} />}
    </>
  );
};
