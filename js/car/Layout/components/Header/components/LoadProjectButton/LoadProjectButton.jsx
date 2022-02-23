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
        handleClose={() => setMenuAnchorEl(null)}
        handleSelected={project => {
          setCurrentProject(project);
          setMenuAnchorEl(null);
        }}
      />
    </>
  );
};
