import { MenuItem } from '@material-ui/core';
import React from 'react';
import { useGetProjects } from '../../../../../common/hooks/useGetProjects';

export const OTProtocolMenuContents = ({ onSelected }) => {
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
    <MenuItem disabled>There are no OT protocols</MenuItem>
  );
};
