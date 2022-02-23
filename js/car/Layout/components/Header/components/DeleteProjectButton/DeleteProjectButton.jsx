import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { ProjectMenu } from '../ProjectMenu';
import { useDeleteProject } from './hooks/useDeleteProject';
import { ConfirmationDialog } from '../../../../../common/components/ConfirmationDialog';
import { setCurrentProject, useCurrentProjectStore } from '../../../../../common/stores/currentProjectStore';

export const DeleteProjectButton = () => {
  const currentProject = useCurrentProjectStore();

  const { mutate: deleteProject } = useDeleteProject();

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={event => setMenuAnchorEl(event.currentTarget)}>Delete Project</Button>
      <ProjectMenu
        id="delete-project-menu"
        anchorEl={menuAnchorEl}
        handleClose={() => setMenuAnchorEl(null)}
        handleSelected={project => {
          setProjectToDelete(project);
          setDialogOpen(true);
        }}
      />
      <ConfirmationDialog
        id="delete-project-dialog"
        open={dialogOpen}
        title="Delete project"
        text={
          <>
            Are you sure you want to delete <b>{projectToDelete?.name}</b>?
          </>
        }
        handleCancel={() => setDialogOpen(false)}
        handleOk={() => {
          if (currentProject.id === projectToDelete.id) {
            setCurrentProject(null);
          }

          setDialogOpen(false);
          setMenuAnchorEl(null);
          deleteProject({ project: projectToDelete });
        }}
        TransitionProps={{
          // Prevents project name from suddenly disappearing when the dialog is closing
          onExited: () => setProjectToDelete(null)
        }}
      />
    </>
  );
};
