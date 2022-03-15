import { Button, makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useRef } from 'react';
import { setDisplayBatch } from '../../../../../common/stores/batchesToDisplayStore';
import { useBatchViewsRefs } from '../../../../../common/stores/batchViewsRefsStore';

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.palette.primary.contrastText
  }
}));

export const DisplaySubBatchButton = ({ messageId, batchId }) => {
  const classes = useStyles();

  // Stores the zustand subscription
  const storeSubscription = useRef();

  const { closeSnackbar } = useSnackbar();

  useEffect(() => {
    return () => {
      // In case the component gets unmounted with an active subscription, unsubscribe first
      if (storeSubscription.current) {
        storeSubscription.current();
      }
    };
  }, []);

  return (
    <Button
      className={classes.button}
      variant="outlined"
      color="inherit"
      onClick={() => {
        // Select the batch to be displayed
        setDisplayBatch(batchId, true);

        // Check if the batch has already been selected before the step above, and if so, scroll to it
        const batchRef = useBatchViewsRefs.getState().refs[batchId];
        if (!!batchRef) {
          batchRef.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Subscribe to the ref changes of the specified batch and scroll to it as soon as possible
          storeSubscription.current = useBatchViewsRefs.subscribe(
            state => state.refs[batchId],
            ref => {
              if (ref) {
                storeSubscription.current();
                ref.scrollIntoView({ behavior: 'smooth' });
              }
            }
          );
        }

        closeSnackbar(messageId);
      }}
    >
      Show subbatch
    </Button>
  );
};
