import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { ProjectMenu } from '../ProjectMenu';
import { setCurrentProject } from '../../../../../common/stores/currentProjectStore';

export const LoadProjectButton = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  return (
    <>
      <Button onClick={event => setMenuAnchorEl(event.currentTarget)}>Load project</Button>
      <ProjectMenu
        id="load-project-menu"
        anchorEl={menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
        onSelected={project => {
          setCurrentProject(project);
          setMenuAnchorEl(null);
        }}
      />
    </>
  );
};
