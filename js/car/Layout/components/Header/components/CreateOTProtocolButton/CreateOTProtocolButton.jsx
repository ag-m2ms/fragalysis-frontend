import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { useCurrentProjectStore } from '../../../../../common/stores/currentProjectStore';
import { CreateOTProtocolDialog } from '../../../../../OTProtocol';

export const CreateOTProtocolButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentProject = useCurrentProjectStore.useCurrentProject();

  return (
    <>
      <Button disabled={!currentProject} onClick={() => setDialogOpen(true)}>
        Create OT Protocol
      </Button>
      <CreateOTProtocolDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};
