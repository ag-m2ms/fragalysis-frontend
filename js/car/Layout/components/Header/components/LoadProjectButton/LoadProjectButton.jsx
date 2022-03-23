import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { CategoryMenu } from '../CategoryMenu';
import { ProjectMenuContents } from '../ProjectMenuContents';
import { setCurrentProject } from '../../../../../common/stores/currentProjectStore';

export const LoadProjectButton = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  return (
    <>
      <Button onClick={event => setMenuAnchorEl(event.currentTarget)}>Load project</Button>
      <CategoryMenu
        id="load-project-menu"
        anchorEl={menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
        onSelected={project => {
          setCurrentProject(project);
          setMenuAnchorEl(null);
        }}
      >
        <ProjectMenuContents
          onSelected={project => {
            setCurrentProject(project);
            setMenuAnchorEl(null);
          }}
        />
      </CategoryMenu>
    </>
  );
};
