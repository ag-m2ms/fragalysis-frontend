import { useSnackbar } from 'notistack';
import React from 'react';
import { SnackbarButton } from '../../../../../../../common/components/SnackbarButton';
import { setCurrentProject } from '../../../../../../../common/stores/currentProjectStore';

export const ShowProjectButton = ({ messageId, project }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <SnackbarButton
      onClick={() => {
        closeSnackbar(messageId);

        setCurrentProject(project);
      }}
    >
      Show project
    </SnackbarButton>
  );
};
