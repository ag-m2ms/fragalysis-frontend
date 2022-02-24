import React from 'react';
import { Menu } from '@material-ui/core';
import { SuspenseWithBoundary } from '../../../../../common/components/SuspenseWithBoundary';
import { ProjectMenuContents } from '../ProjectMenuContents';

export const ProjectMenu = ({ id, anchorEl, onSelected, onClose }) => {
  return (
    <Menu
      id={id}
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      getContentAnchorEl={null}
    >
      <SuspenseWithBoundary>
        <ProjectMenuContents onSelected={onSelected} />
      </SuspenseWithBoundary>
    </Menu>
  );
};
