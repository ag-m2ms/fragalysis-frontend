import React from 'react';
import { SubmitDialog } from '../../../common/components/SubmitDialog';
import { Typography } from '@material-ui/core';
import { BatchSelector } from './components/BatchSelector';
import { useCreateOTProtocol } from './hooks/useCreateOTProtocol';
import { DialogSection } from '../../../common/components/DialogSection';
import { DialogSectionHeading } from '../../../common/components/DialogSectionHeading';
import { Form, Formik } from 'formik';
import * as yup from 'yup';

export const CreateOTProtocolDialog = ({ open, onClose }) => {
  const { mutate: createOTProtocol } = useCreateOTProtocol();

  return (
    <Formik
      initialValues={{
        selectedBatchesMap: {}
      }}
      validationSchema={yup.object().shape({
        selectedBatchesMap: yup
          .object()
          .test('one-or-more-selected', 'Select at least one batch', value => Object.values(value).some(val => val))
      })}
      onSubmit={({ selectedBatchesMap }) => {
        const selectedBatchesIds = Object.entries(selectedBatchesMap)
          .filter(([_, value]) => value)
          .map(([key]) => Number(key));

        createOTProtocol({ batchids: selectedBatchesIds });
        onClose();
      }}
      validateOnMount
    >
      {({ submitForm, isSubmitting, resetForm }) => (
        <SubmitDialog
          id="create-ot-protocol-dialog"
          open={open}
          title="Create OT protocol"
          content={
            <Form>
              <DialogSection>
                <DialogSectionHeading>Batches</DialogSectionHeading>
                <Typography>Please select batches for OT protocol:</Typography>
                <BatchSelector name="selectedBatchesMap" label="Batch selector" />
              </DialogSection>
            </Form>
          }
          onClose={onClose}
          onSubmit={submitForm}
          submitDisabled={isSubmitting}
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
