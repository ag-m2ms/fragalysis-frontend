import React from 'react';
import { ListItem, Menu, MenuItem } from '@material-ui/core';
import { useGetProjects } from './hooks/useGetProjects';
import { LoadingSpinner } from '../../../../../common/components/LoadingSpinner';

export const ProjectMenu = ({ id, anchorEl, handleSelected, handleClose }) => {
  const { projects, isLoading } = useGetProjects();

  return (
    <Menu
      id={id}
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      getContentAnchorEl={null}
    >
      {isLoading && (
        <ListItem>
          <LoadingSpinner />
        </ListItem>
      )}
      {projects &&
        projects.map(project => {
          return (
            <MenuItem key={project.id} onClick={() => handleSelected(project)}>
              {project.name}
            </MenuItem>
          );
        })}
    </Menu>
  );
};
