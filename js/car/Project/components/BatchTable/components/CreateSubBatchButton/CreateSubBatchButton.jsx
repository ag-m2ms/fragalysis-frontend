import { Button, makeStyles, Tooltip, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { SubmitDialog } from '../../../../../common/components/SubmitDialog';
import { SuspenseWithBoundary } from '../../../../../common/components/SuspenseWithBoundary';
import { useCreateSubBatch } from './hooks/useCreateSubBatch';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import * as yup from 'yup';
import { CreateSubBatchSelectedTargetsList } from '../CreateSubBatchSelectedTargetsList';

const useStyles = makeStyles(theme => ({
  form: {
    display: 'grid',
    gap: theme.spacing(2)
  },
  section: {
    display: 'grid',
    gap: theme.spacing()
  },
  heading: {
    fontSize: '0.9rem',
    fontWeight: 500
  }
}));

export const CreateSubBatchButton = ({ selectedMethodsIds }) => {
  const classes = useStyles();

  const createSubBatchEnabled = !!selectedMethodsIds.length;

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
            Create subbatch
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
          createSubBatch({ batchtag: batchtag, methodids: selectedMethodsIds });
          setDialogOpen(false);
        }}
        validateOnMount
      >
        {({ submitForm, isValid, resetForm }) => (
          <SubmitDialog
            id="create-subbatch-dialog"
            open={dialogOpen}
            title="Create subbatch"
            content={
              <Form className={classes.form}>
                <section className={classes.section}>
                  <Typography className={classes.heading}>Batch information</Typography>
                  <Typography>Please provide following information:</Typography>
                  <Field
                    component={TextField}
                    label="Name"
                    name="batchtag"
                    variant="outlined"
                    placeholder="Name (can include a-z, A-Z, 0-9, -, _ or space)"
                    fullWidth
                  />
                </section>

                <section className={classes.section}>
                  <Typography className={classes.heading}>Targets</Typography>
                  <Typography>These targets (with methods) will be added to the batch:</Typography>
                  <SuspenseWithBoundary>
                    <CreateSubBatchSelectedTargetsList />
                  </SuspenseWithBoundary>
                </section>
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
