import React from 'react';
import { ErrorMessage, useFormikContext } from 'formik';
import { Button, FormControl, FormHelperText, FormLabel, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  input: {
    display: 'none'
  }
}));

export const FormFilePicker = ({ name, label, description, id, buttonText, accept }) => {
  const classes = useStyles();

  const { setFieldValue, setFieldTouched, values } = useFormikContext();

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      {description}
      <input
        accept={accept}
        className={classes.input}
        id={id}
        type="file"
        onChange={event => {
          const file = event.target.files[0];
          setFieldValue(name, file || null, true);
          // Without timeout the setFieldTouched would execute sooner than setFieldValue
          setTimeout(() => {
            setFieldTouched(name);
          });
        }}
      />
      <label htmlFor={id}>
        <Button variant="contained" color="primary" component="span" fullWidth>
          {buttonText ?? 'Select file'}
        </Button>
      </label>
      <ErrorMessage name={name}>{msg => <FormHelperText error={true}>{msg}</FormHelperText>}</ErrorMessage>
      {!!values[name] && <FormHelperText>{values[name]?.name}</FormHelperText>}
    </FormControl>
  );
};
