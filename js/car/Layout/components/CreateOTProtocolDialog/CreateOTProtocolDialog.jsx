import React from 'react';
import { SubmitDialog } from '../../../common/components/SubmitDialog';
import { Typography } from '@material-ui/core';
import { useCreateOTProtocol } from './hooks/useCreateOTProtocol';
import { DialogSection } from '../../../common/components/DialogSection';
import { DialogSectionHeading } from '../../../common/components/DialogSectionHeading';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { FormBatchSelector } from './components/FormBatchSelector';
import { FormTextField } from '../../../common/components/FormTextField';

export const CreateOTProtocolDialog = ({ open, onClose }) => {
  const { mutate: createOTProtocol } = useCreateOTProtocol();

  return (
    <Formik
      initialValues={{
        protocol_name: '',
        selectedBatchesMap: {}
      }}
      validationSchema={yup.object().shape({
        protocol_name: yup
          .string()
          .min(1, 'The name is too short')
          .max(100, 'The name is too long')
          .matches(/^[a-zA-Z0-9\-_ ]+$/, 'The name can only include a-z, A-Z, 0-9, -, _ or space')
          .required('Required'),
        selectedBatchesMap: yup
          .object()
          .test('one-or-more-selected', 'Select at least one batch', value => Object.values(value).some(val => val))
      })}
      onSubmit={({ protocol_name, selectedBatchesMap }) => {
        const selectedBatchesIds = Object.entries(selectedBatchesMap)
          .filter(([_, value]) => value)
          .map(([key]) => Number(key));

        createOTProtocol({ protocol_name, batchids: selectedBatchesIds });
        onClose();
      }}
    >
      {({ isSubmitting, resetForm }) => (
        <SubmitDialog
          id="create-ot-protocol-dialog"
          open={open}
          title="Create OT protocol"
          content={
            <Form id="create-ot-protocol-form">
              <DialogSection>
                <DialogSectionHeading>Batches</DialogSectionHeading>
                <Typography>Please provide name and select batches for OT protocol:</Typography>

                <FormTextField
                  name="protocol_name"
                  label="Protocol name"
                  placeholder="Protocol name (can include a-z, A-Z, 0-9, -, _ or space)"
                />

                <FormBatchSelector name="selectedBatchesMap" label="Batch selector" />
              </DialogSection>
            </Form>
          }
          onClose={onClose}
          submitDisabled={isSubmitting}
          SubmitButtonProps={{
            type: 'submit',
            form: 'create-ot-protocol-form'
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
