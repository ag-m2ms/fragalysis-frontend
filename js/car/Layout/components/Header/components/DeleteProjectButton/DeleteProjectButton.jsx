import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import { CategoryMenu } from '../CategoryMenu';
import { ProjectMenuContents } from '../ProjectMenuContents';
import { useDeleteProject } from './hooks/useDeleteProject';
import { ConfirmationDialog } from '../../../../../common/components/ConfirmationDialog';
import { setCurrentProject, useCurrentProjectStore } from '../../../../../common/stores/currentProjectStore';

export const DeleteProjectButton = () => {
  const currentProject = useCurrentProjectStore.useCurrentProject();

  const { mutate: deleteProject } = useDeleteProject();

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [okDisabled, setOkDisabled] = useState(false);

  return (
    <>
      <Button onClick={event => setMenuAnchorEl(event.currentTarget)}>Delete Project</Button>
      <CategoryMenu id="delete-project-menu" anchorEl={menuAnchorEl} onClose={() => setMenuAnchorEl(null)}>
        <ProjectMenuContents
          onSelected={project => {
            setMenuAnchorEl(null);
            setProjectToDelete(project);
            setDialogOpen(true);
          }}
        />
      </CategoryMenu>
      <ConfirmationDialog
        id="delete-project-dialog"
        open={dialogOpen}
        title="Delete project"
        content={
          <Typography>
            Are you sure you want to delete project <b>{projectToDelete?.name}</b>?
          </Typography>
        }
        onCancel={() => setDialogOpen(false)}
        onOk={() => {
          setOkDisabled(true);

          if (currentProject?.id === projectToDelete.id) {
            setCurrentProject(null);
          }

          setDialogOpen(false);
          setMenuAnchorEl(null);
          deleteProject({ project: projectToDelete });
        }}
        okDisabled={okDisabled}
        TransitionProps={{
          onExited: () => {
            // Prevents project name from suddenly disappearing when the dialog is closing
            setProjectToDelete(null);
            setOkDisabled(false);
          }
        }}
      />
    </>
  );
};
