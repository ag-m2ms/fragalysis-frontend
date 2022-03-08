import { FormControl, FormLabel, makeStyles, Slider } from '@material-ui/core';
import React, { useLayoutEffect, useState } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2)
  },
  slider: {
    margin: `0 ${theme.spacing()}px`,
    width: `calc(100% - ${theme.spacing(2)}px)`
  }
}));

export const RangeFilter = ({ id, label, min, max, filterValue, setFilter }) => {
  const classes = useStyles();

  const labelId = `${id}-label`;

  const [value, setValue] = useState(filterValue);

  useLayoutEffect(() => {
    setValue(filterValue);
  }, [filterValue]);

  return (
    <div className={classes.root}>
      <FormControl fullWidth>
        <FormLabel>{label}</FormLabel>
        <Slider
          className={classes.slider}
          value={value}
          onChange={(_, value) => setValue(value)}
          aria-labelledby={labelId}
          id={id}
          getAriaValueText={value => `${label} - ${value}`}
          min={min}
          max={max}
          marks={[min, max, ...value]
            .reduce((marks, nextValue) => {
              if (!marks.includes(nextValue)) {
                marks.push(nextValue);
              }
              return marks;
            }, [])
            .map(val => ({ value: val, label: val }))}
          onChangeCommitted={(_, value) => setFilter(value)}
        />
      </FormControl>
    </div>
  );
};
