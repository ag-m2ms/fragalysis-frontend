import { Button, makeStyles, Tooltip, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { SubmitDialog } from '../../../../../common/components/SubmitDialog/SubmitDialog';
import { useCreateSubBatch } from './hooks/useCreateSubBatch';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import * as yup from 'yup';

const useStyles = makeStyles(theme => ({
  form: {
    display: 'grid',
    gap: theme.spacing()
  },
  heading: {
    fontSize: '0.9rem',
    fontWeight: 500
  }
}));

export const CreateSubBatchButton = ({ selectedMethods }) => {
  const classes = useStyles();

  const createSubBatchEnabled = !!selectedMethods.length;

  const { mutate: createSubBatch } = useCreateSubBatch();

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Tooltip title={!createSubBatchEnabled ? 'In order to create a SubBatch some methods have to be selected' : ''}>
        <span>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => {
              setDialogOpen(true);
            }}
            disabled={!createSubBatchEnabled}
          >
            Create SubBatch
          </Button>
        </span>
      </Tooltip>

      <Formik
        initialValues={{
          batchtag: ''
        }}
        validationSchema={yup.object().shape({
          batchtag: yup
            .string()
            .min(1, 'The name is too short')
            .max(20, 'The name is too long')
            .matches(/^[a-zA-Z0-9\-_ ]+$/, 'The name can only include a-z, A-Z, 0-9, -, _ or space')
            .required('Required')
        })}
        onSubmit={({ batchtag }) => {
          createSubBatch({ batchtag: batchtag, methodids: selectedMethods });
          setDialogOpen(false);
        }}
        validateOnMount
      >
        {({ submitForm, isValid, resetForm }) => (
          <SubmitDialog
            id="create-subbatch-dialog"
            open={dialogOpen}
            title="Create SubBatch"
            content={
              <Form className={classes.form}>
                <Typography className={classes.heading}>Batch information</Typography>
                <Typography>Please provide following information:</Typography>
                <Field component={TextField} label="Name" name="batchtag" variant="outlined" fullWidth />
              </Form>
            }
            onCancel={() => {
              setDialogOpen(false);
            }}
            onSubmit={submitForm}
            submitDisabled={!isValid}
            TransitionProps={{
              onExited: resetForm
            }}
          />
        )}
      </Formik>
    </>
  );
};
