import React, { useState } from 'react';
import { SubmitDialog } from '../../../../../common/components/SubmitDialog';
import { DialogSection } from '../../../../../common/components/DialogSection';
import { DialogSectionHeading } from '../../../../../common/components/DialogSectionHeading';
import { Button, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, Typography } from '@material-ui/core';
import { Field, Formik, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { RadioGroup, TextField } from 'formik-material-ui';
import { makeStyles } from '@material-ui/styles';
import { useUploadProject } from './hooks/useUploadProject';

const useStyles = makeStyles(theme => ({
  csvInput: {
    display: 'none'
  }
}));

export const UploadProjectButton = () => {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutate: uploadProject } = useUploadProject();

  return (
    <>
      <Button
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        New project
      </Button>

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
          setDialogOpen(false);
        }}
        validateOnMount
      >
        {({ submitForm, isValid, isSubmitting, resetForm, setFieldValue, setFieldTouched, values }) => (
          <SubmitDialog
            id="upload-project-dialog"
            open={dialogOpen}
            title="Upload new project"
            content={
              <DialogSection>
                <DialogSectionHeading>Project information</DialogSectionHeading>
                <Typography>Please provide following information:</Typography>

                <Field
                  component={TextField}
                  label="Your name"
                  name="submitter_name"
                  variant="outlined"
                  placeholder="Your name (can include a-z, A-Z, 0-9, -, _ or space)"
                  fullWidth
                />
                <Field
                  component={TextField}
                  label="Your organisation"
                  name="submitter_organisation"
                  variant="outlined"
                  placeholder="Your organisation (can include a-z, A-Z, 0-9, -, _ or space)"
                  fullWidth
                />

                <FormControl>
                  <FormLabel>Smiles file</FormLabel>
                  <Typography>
                    The current specification version is <strong>ver_1.2</strong>.
                  </Typography>
                  <input
                    accept="text/csv"
                    className={classes.csvInput}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={event => {
                      const file = event.target.files[0];
                      setFieldValue('csv_file', file || null, true);
                      setTimeout(() => {
                        setFieldTouched('csv_file');
                      });
                    }}
                  />
                  <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary" component="span" fullWidth>
                      Select file
                    </Button>
                  </label>
                  <ErrorMessage name="csv_file">
                    {msg => <FormHelperText error={true}>{msg}</FormHelperText>}
                  </ErrorMessage>
                  {!!values.csv_file && <FormHelperText>{values.csv_file?.name}</FormHelperText>}
                </FormControl>

                <FormControl component="fieldset">
                  <FormLabel component="legend">Validate choice</FormLabel>
                  <Field component={RadioGroup} name="validate_choice">
                    <FormControlLabel value="0" control={<Radio />} label="Validate" />
                    <FormControlLabel value="1" control={<Radio />} label="Upload" />
                  </Field>
                  <ErrorMessage name="validate_choice">
                    {msg => <FormHelperText error={true}>{msg}</FormHelperText>}
                  </ErrorMessage>
                </FormControl>

                <FormControl component="fieldset">
                  <FormLabel component="legend">API choice</FormLabel>
                  <Field component={RadioGroup} name="API_choice">
                    <FormControlLabel value="0" control={<Radio />} label="Postera" />
                    <FormControlLabel value="1" control={<Radio />} label="Custom chemistry" />
                    <FormControlLabel value="2" control={<Radio />} label="Combi custom chemistry" />
                  </Field>
                  <ErrorMessage name="API_choice">
                    {msg => <FormHelperText error={true}>{msg}</FormHelperText>}
                  </ErrorMessage>
                </FormControl>
              </DialogSection>
            }
            onCancel={() => {
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
