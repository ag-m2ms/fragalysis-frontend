import React from 'react';
import { Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { DialogSection } from '../../../../../common/components/DialogSection';
import { DialogSectionHeading } from '../../../../../common/components/DialogSectionHeading';
import { FormFilePicker } from '../../../../../common/components/FormFilePicker';
import { SubmitDialog } from '../../../../../common/components/SubmitDialog';
import { useCanonicalizeSmiles } from './hooks/useCanonicalizeSmiles';

export const CanonicalizeSmilesDialog = ({ open, onClose, onCanonicalize }) => {
  const { mutate: canonicalize } = useCanonicalizeSmiles(onCanonicalize);

  return (
    <Formik
      initialValues={{
        csv_file: null
      }}
      validationSchema={yup.object().shape({
        csv_file: yup.mixed().required('Required')
      })}
      onSubmit={data => {
        canonicalize({ data });
        onClose();
      }}
    >
      {({ submitForm, isSubmitting, resetForm }) => (
        <SubmitDialog
          id="canonicalize-smiles-dialog"
          open={open}
          title="Canonicalize smiles"
          content={
            <Form id="canonicalize-smiles-form">
              <DialogSection>
                <DialogSectionHeading>Smiles</DialogSectionHeading>
                <Typography>Please select a file containing smiles for canonicalization:</Typography>

                <FormFilePicker name="csv_file" label="Smiles file" id="canonicalize-smiles-file" accept="text/csv" />
              </DialogSection>
            </Form>
          }
          onClose={onClose}
          onSubmit={submitForm}
          submitDisabled={isSubmitting}
          SubmitButtonProps={{
            type: 'submit',
            form: 'canonicalize-smiles-form'
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
