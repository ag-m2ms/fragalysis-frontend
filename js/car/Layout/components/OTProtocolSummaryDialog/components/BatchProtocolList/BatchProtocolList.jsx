import { Button, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React from 'react';
import { useGetProtocolsForTask } from './hooks/useGetProtocolsForTask';

export const BatchProtocolList = ({ taskId }) => {
  const batchesWithOtProtocols = useGetProtocolsForTask(taskId);

  return (
    <List>
      {batchesWithOtProtocols.map(({ batch, otProtocol }) => {
        return (
          <ListItem key={batch.id}>
            <ListItemText primary={batch.batch_tag} />
            <ListItemSecondaryAction>
              <Button color="primary" variant="contained" href={otProtocol.zipfile} download>
                Download protocol
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
};
