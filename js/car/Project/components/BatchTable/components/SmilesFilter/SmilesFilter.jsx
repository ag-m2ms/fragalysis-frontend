import { Chip, IconButton, makeStyles, TextField, Tooltip } from '@material-ui/core';
import { AddCircle, Clear, CloudUpload } from '@material-ui/icons';
import classNames from 'classnames';
import React, { useState } from 'react';
import { CanonicalizeSmilesDialog } from '../CanonicalizeSmilesDialog/CanonicalizeSmilesDialog';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing()
  },
  input: {
    padding: 9,
    paddingRight: 65,
    flexWrap: 'wrap',
    '&:hover .smiles-filter-dirty': {
      visibility: 'visible'
    }
  },
  inputField: {
    flexGrow: 1,
    minWidth: 30,
    width: 0,
    padding: '9.5px 4px'
  },
  chip: {
    margin: 3,
    maxWidth: 240
  },
  button: {
    padding: 2,
    marginRight: -2
  },
  clear: {
    visibility: 'hidden'
  },
  clearActive: {
    visibility: 'visible'
  },
  endAdornment: {
    position: 'absolute',
    right: 9,
    top: 'calc(50% - 14px)'
  }
}));

export const SmilesFilter = ({ id, label, filterValue = [], setFilter }) => {
  const classes = useStyles();

  const [inputValue, setInputValue] = useState('');
  const [active, setActive] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const dirty = !!filterValue.length;

  const addSmiles = smiles => {
    const newFilterValue = new Set([...filterValue, ...smiles]);
    setFilter([...newFilterValue]);
  };

  const addSmilesFromInput = () => {
    if (!!inputValue) {
      const smiles = inputValue.split(';').map(val => val.trim());
      addSmiles(smiles);
      setInputValue('');
    }
  };

  return (
    <>
      <div className={classes.root}>
        <TextField
          id={id}
          label={label}
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          InputProps={{
            className: classes.input,
            classes: { input: classes.inputField },
            startAdornment:
              !!filterValue.length &&
              filterValue.map(value => (
                <Chip
                  className={classes.chip}
                  key={value}
                  label={value}
                  tabindex={-1}
                  onDelete={() => {
                    const newFilterValue = [...filterValue];
                    const index = filterValue.findIndex(val => value === val);
                    newFilterValue.splice(index, 1);
                    setFilter(newFilterValue);
                  }}
                />
              )),
            endAdornment: (
              <div className={classes.endAdornment}>
                <IconButton
                  className={classNames(
                    classes.button,
                    classes.clear,
                    active && dirty && classes.clearActive,
                    dirty && 'smiles-filter-dirty'
                  )}
                  size="small"
                  title="Clear"
                  aria-label="Clear"
                  onClick={() => setFilter([])}
                >
                  <Clear fontSize="small" />
                </IconButton>
                <IconButton
                  className={classes.button}
                  size="small"
                  title="Add smiles"
                  aria-label="Add smiles"
                  onClick={addSmilesFromInput}
                >
                  <AddCircle fontSize="small" />
                </IconButton>
              </div>
            )
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              addSmilesFromInput();
            }
          }}
        />
        <Tooltip title="Upload smiles from file">
          <IconButton onClick={() => setDialogOpen(true)}>
            <CloudUpload />
          </IconButton>
        </Tooltip>
      </div>

      <CanonicalizeSmilesDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCanonicalize={smiles => addSmiles(smiles)}
      />
    </>
  );
};
