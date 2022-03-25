import React from 'react';
import { SubmitDialog } from '../../../../../common/components/SubmitDialog';
import { DialogSection } from '../../../../../common/components/DialogSection';
import { DialogSectionHeading } from '../../../../../common/components/DialogSectionHeading';
import { Typography } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { useUploadProject } from './hooks/useUploadProject';
import { FormTextField } from '../../../../../common/components/FormTextField';
import { FormRadioGroup } from '../../../../../common/components/FormRadioGroup';
import { FormFilePicker } from '../../../../../common/components/FormFilePicker';

export const UploadProjectDialog = ({ open, onClose }) => {
  const { mutate: uploadProject } = useUploadProject();

  return (
    <Formik
      initialValues={{
        submitter_name: '',
        submitter_organisation: '',
        csv_file: null,
        validate_choice: '',
        API_choice: ''
      }}
      validationSchema={yup.object().shape({
        submitter_name: yup
          .string()
          .min(1, 'The name is too short')
          .max(100, 'The name is too long')
          .matches(/^[a-zA-Z0-9\-_ ]+$/, 'The name can only include a-z, A-Z, 0-9, -, _ or space')
          .required('Required'),
        submitter_organisation: yup
          .string()
          .min(1, 'The name is too short')
          .max(100, 'The name is too long')
          .matches(/^[a-zA-Z0-9\-_ ]+$/, 'The name can only include a-z, A-Z, 0-9, -, _ or space')
          .required('Required'),
        csv_file: yup.mixed().required('Required'),
        validate_choice: yup
          .string()
          .oneOf(['0', '1'])
          .required('Required'),
        API_choice: yup
          .string()
          .oneOf(['0', '1', '2'])
          .required('Required')
      })}
      onSubmit={data => {
        console.log(data);
        //uploadProject({ data });
        onClose();
      }}
      validateOnMount
    >
      {({ submitForm, isSubmitting, resetForm }) => (
        <SubmitDialog
          id="upload-project-dialog"
          open={open}
          title="Upload new project"
          content={
            <Form>
              <DialogSection>
                <DialogSectionHeading>Project information</DialogSectionHeading>
                <Typography>Please provide following information:</Typography>

                <FormTextField
                  name="submitter_name"
                  label="Your name"
                  placeholder="Your name (can include a-z, A-Z, 0-9, -, _ or space)"
                />

                <FormTextField
                  name="submitter_organisation"
                  label="Your organisation"
                  placeholder="Your organisation (can include a-z, A-Z, 0-9, -, _ or space)"
                />

                <FormFilePicker
                  name="csv_file"
                  label="Smiles file"
                  description={
                    <Typography>
                      The current specification version is <strong>ver_1.2</strong>.
                    </Typography>
                  }
                  id="upload-project-smiles-file"
                  accept="text/csv"
                />

                <FormRadioGroup
                  name="validate_choice"
                  label="Validate choice"
                  options={[
                    { value: '0', label: 'Validate' },
                    { value: '1', label: 'Upload' }
                  ]}
                />

                <FormRadioGroup
                  name="API_choice"
                  label="API choice"
                  options={[
                    { value: '0', label: 'Postera' },
                    { value: '1', label: 'Custom chemistry' },
                    { value: '2', label: 'Combi custom chemistry' }
                  ]}
                />
              </DialogSection>
            </Form>
          }
          onClose={() => {
            onClose();
          }}
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
