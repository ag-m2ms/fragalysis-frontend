import { Button, makeStyles, Tooltip, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { SubmitDialog } from '../../../../../common/components/SubmitDialog';
import { SuspenseWithBoundary } from '../../../../../common/components/SuspenseWithBoundary';
import { useCreateSubBatch } from './hooks/useCreateSubBatch';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import * as yup from 'yup';
import { CreateSubBatchSelectedTargetsList } from '../CreateSubBatchSelectedTargetsList';
import { DialogSection } from '../../../../../common/components/DialogSection';
import { DialogSectionHeading } from '../../../../../common/components/DialogSectionHeading';

const useStyles = makeStyles(theme => ({
  form: {
    display: 'grid',
    gap: theme.spacing(2)
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
        {({ submitForm, isValid, isSubmitting, resetForm }) => (
          <SubmitDialog
            id="create-subbatch-dialog"
            open={dialogOpen}
            title="Create subbatch"
            content={
              <Form className={classes.form}>
                <DialogSection>
                  <DialogSectionHeading>Batch information</DialogSectionHeading>
                  <Typography>Please provide following information:</Typography>
                  <Field
                    component={TextField}
                    label="Name"
                    name="batchtag"
                    variant="outlined"
                    placeholder="Name (can include a-z, A-Z, 0-9, -, _ or space)"
                    fullWidth
                  />
                </DialogSection>

                <DialogSection>
                  <DialogSectionHeading>Targets</DialogSectionHeading>
                  <Typography>These targets (with methods) will be added to the batch:</Typography>
                  <SuspenseWithBoundary>
                    <CreateSubBatchSelectedTargetsList />
                  </SuspenseWithBoundary>
                </DialogSection>
              </Form>
            }
            onClose={() => {
              setDialogOpen(false);
            }}
            onSubmit={submitForm}
            submitDisabled={isSubmitting || !isValid}
            TransitionProps={{
              onExited: () => {
                resetForm();
              }
            }}
          />
        )}
      </Formik>
    </>
  );
};
