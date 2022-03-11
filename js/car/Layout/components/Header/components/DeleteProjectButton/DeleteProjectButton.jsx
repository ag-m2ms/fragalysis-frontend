import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { ProjectMenu } from '../ProjectMenu';
import { useDeleteProject } from './hooks/useDeleteProject';
import { ConfirmationDialog } from '../../../../../common/components/ConfirmationDialog';
import { setCurrentProject, useCurrentProjectStore } from '../../../../../common/stores/currentProjectStore';

export const DeleteProjectButton = () => {
  const currentProject = useCurrentProjectStore.useCurrentProject();

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
        onClose={() => setMenuAnchorEl(null)}
        onSelected={project => {
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
            Are you sure you want to delete project <b>{projectToDelete?.name}</b>?
          </>
        }
        onCancel={() => setDialogOpen(false)}
        onOk={() => {
          if (currentProject?.id === projectToDelete.id) {
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
