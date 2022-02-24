import { MenuItem } from '@material-ui/core';
import React from 'react';
import { useGetProjects } from './hooks/useGetProjects';

export const ProjectMenuContents = ({ onSelected }) => {
  const { data: projects } = useGetProjects();

  return !!projects.length ? (
    projects.map(project => {
      return (
        <MenuItem key={project.id} onClick={() => onSelected(project)}>
          {project.name}
        </MenuItem>
      );
    })
  ) : (
    <MenuItem disabled>There are no projects</MenuItem>
  );
};
