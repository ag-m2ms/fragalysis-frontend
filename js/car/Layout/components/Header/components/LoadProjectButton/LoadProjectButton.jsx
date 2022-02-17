import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { ProjectMenu } from '../ProjectMenu';
import { useProjectContext } from '../../../../../common/hooks/useProjectContext';

export const LoadProjectButton = () => {
  const { setProject } = useProjectContext();

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  return (
    <>
      <Button onClick={event => setMenuAnchorEl(event.currentTarget)}>Load project</Button>
      <ProjectMenu
        id="load-project-menu"
        anchorEl={menuAnchorEl}
        handleClose={() => setMenuAnchorEl(null)}
        handleSelected={project => {
          setProject(project);
          setMenuAnchorEl(null);
        }}
      />
    </>
  );
};
