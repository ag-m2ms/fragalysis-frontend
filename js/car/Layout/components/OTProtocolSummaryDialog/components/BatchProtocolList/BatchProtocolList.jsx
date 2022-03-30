import { Button, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React from 'react';
import { useGetProtocolsForTask } from './hooks/useGetProtocolsForTask';

export const BatchProtocolList = ({ otProtocolId }) => {
  const batchesWithOtProtocols = useGetProtocolsForTask(otProtocolId);

  return (
    <List>
      {!!batchesWithOtProtocols.length ? (
        batchesWithOtProtocols.map(({ batch, otBatchProtocol }) => {
          return (
            <ListItem key={batch.id}>
              <ListItemText primary={batch.batch_tag} />
              <ListItemSecondaryAction>
                <Button color="primary" variant="contained" href={otBatchProtocol.zipfile} download>
                  Download protocol
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })
      ) : (
        <ListItem>
          <ListItemText primary="None of the currently existing batches are left in the OT Protocol" />
        </ListItem>
      )}
    </List>
  );
};
