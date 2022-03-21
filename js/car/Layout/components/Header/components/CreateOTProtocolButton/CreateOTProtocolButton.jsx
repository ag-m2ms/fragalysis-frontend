import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { CreateOTProtocolDialog } from '../../../../../OTProtocol';

export const CreateOTProtocolButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>Create OT Protocol</Button>
      <CreateOTProtocolDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};
