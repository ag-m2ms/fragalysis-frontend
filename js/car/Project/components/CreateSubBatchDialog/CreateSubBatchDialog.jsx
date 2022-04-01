import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { SubmitDialog } from '../../../common/components/SubmitDialog';
import { SuspenseWithBoundary } from '../../../common/components/SuspenseWithBoundary';
import { useCreateSubBatch } from './hooks/useCreateSubBatch';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { CreateSubBatchSelectedTargetsList } from './components/CreateSubBatchSelectedTargetsList';
import { DialogSection } from '../../..//common/components/DialogSection';
import { DialogSectionHeading } from '../../../common/components/DialogSectionHeading';
import { FormTextField } from '../../../common/components/FormTextField';

const useStyles = makeStyles(theme => ({
  form: {
    display: 'grid',
    gap: theme.spacing(2)
  }
}));

export const CreateSubBatchDialog = ({ open, onClose, selectedMethodsIds }) => {
  const classes = useStyles();

  const { mutate: createSubBatch } = useCreateSubBatch();

  return (
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
        onClose();
      }}
    >
      {({ submitForm, isSubmitting, resetForm }) => (
        <SubmitDialog
          id="create-subbatch-dialog"
          open={open}
          title="Create subbatch"
          content={
            <Form className={classes.form} id="create-subbatch-form">
              <DialogSection>
                <DialogSectionHeading>Batch information</DialogSectionHeading>
                <Typography>Please provide following information:</Typography>
                <FormTextField
                  name="batchtag"
                  label="Name"
                  placeholder="Name (can include a-z, A-Z, 0-9, -, _ or space)"
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
          onClose={onClose}
          onSubmit={submitForm}
          submitDisabled={isSubmitting}
          SubmitButtonProps={{
            type: 'submit',
            form: 'create-subbatch-form'
          }}
          TransitionProps={{
            onExited: () => {
              resetForm();
            }
          }}
        />
      )}
    </Formik>
  );
};
