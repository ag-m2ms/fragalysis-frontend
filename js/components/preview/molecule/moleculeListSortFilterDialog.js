import React, { memo, useState, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Popper, Tooltip, IconButton } from '@material-ui/core';
import { Close, Delete } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import MoleculeListSortFilterItem from './moleculeListSortFilterItem';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { MOL_ATTRIBUTES } from './redux/constants';
import { setFilter } from '../../../reducers/selection/actions';
import { Panel } from '../../common/Surfaces/Panel';
import { setSortDialogOpen } from './redux/actions';
import { moleculeProperty } from './helperConstants';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: 22
  },
  numberOfHits: {
    flexGrow: 1
  },
  gridItemHeader: {
    height: '32px',
    fontSize: '12px',
    lineHeight: 1,
    color: '#7B7B7B',
    fontWeight: 'bold'
  },
  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  property: {
    fontSize: '10px',
    color: '#000'
  },
  min: {
    fontSize: '10px',
    color: '#7B7B7B'
  },
  warningIcon: {
    color: '#FFC107',
    position: 'relative',
    top: 2
  },
  paper: {
    width: 570,
    overflow: 'none'
  }
}));

const widthPrio = 50;
const widthOrder = 60;
const widthProperty = 212;
const widthMin = 30;
const widthSlider = 170;

export const getFilteredMoleculesCount = (molecules, filter) => {
  let count = 0;
  for (let molecule of molecules) {
    let add = true; // By default molecule passes filter
    for (let attr of MOL_ATTRIBUTES) {
      const lowAttr = attr.key.toLowerCase();
      const attrValue = molecule[lowAttr];
      if (attrValue < filter.filter[attr.key].minValue || attrValue > filter.filter[attr.key].maxValue) {
        add = false;
        break; // Do not loop over other attributes
      }
    }
    if (add) {
      count = count + 1;
    }
  }
  return count;
};

export const getAttrDefinition = attr => {
  return MOL_ATTRIBUTES.find(molAttr => molAttr.key === attr);
};

export const filterMolecules = (molecules, filter) => {
  // 1. Filter
  let filteredMolecules = [];
  for (let molecule of molecules) {
    let add = true; // By default molecule passes filter
    for (let attr of MOL_ATTRIBUTES) {
      if (!attr.filter) continue;
      const lowAttr = attr.key.toLowerCase();
      const attrValue = molecule[lowAttr];
      if (attrValue < filter.filter[attr.key].minValue || attrValue > filter.filter[attr.key].maxValue) {
        add = false;
        break; // Do not loop over other attributes
      }
    }
    if (add) {
      filteredMolecules.push(molecule);
    }
  }

  // 2. Sort
  let sortedAttributes = filter.priorityOrder.map(attr => attr);

  return filteredMolecules.sort((a, b) => {
    for (let prioAttr of sortedAttributes) {
      const order = filter.filter[prioAttr].order;

      const attrLo = prioAttr.toLowerCase();
      let aVal;
      let bVal;
      if (prioAttr === moleculeProperty.mw || prioAttr === moleculeProperty.tpsa) {
        aVal = Math.round(a[attrLo]);
        bVal = Math.round(b[attrLo]);
      } else if (prioAttr === moleculeProperty.logP) {
        aVal = Math.round(a[attrLo]) /*.toPrecision(1)*/;
        bVal = Math.round(b[attrLo]) /*.toPrecision(1)*/;
      } else {
        aVal = a[attrLo];
        bVal = b[attrLo];
      }
      let diff = order * (aVal - bVal);
      if (diff !== 0) {
        return diff;
      }
    }
  });
};

export const MoleculeListSortFilterDialog = memo(
  ({
    molGroupSelection,
    cachedMolList,
    filter,
    anchorEl,
    open,
    parentID = 'default',
    placement = 'right-start',
    setSortDialogAnchorEl
  }) => {
    let classes = useStyles();
    const dispatch = useDispatch();
    const moleculeGroupList = useSelector(state => state.apiReducers.mol_group_list);

    const getListedMolecules = useMemo(() => {
      let molecules = [];
      for (let molGroupId of molGroupSelection) {
        // Selected molecule groups
        const molGroup = cachedMolList[molGroupId];
        if (molGroup) {
          molecules = molecules.concat(molGroup);
        } else {
          console.log(`Molecule group ${molGroupId} not found in cached list`);
        }
      }

      return molecules;
    }, [molGroupSelection, cachedMolList]);

    const initialize = useCallback(() => {
      let initObject = {
        active: false,
        predefined: 'none',
        filter: {},
        priorityOrder: MOL_ATTRIBUTES.map(molecule => molecule.key)
      };

      for (let attr of MOL_ATTRIBUTES) {
        const lowAttr = attr.key.toLowerCase();
        let minValue = -999999;
        let maxValue = 0;
        const moleculeList = getListedMolecules;

        moleculeList.forEach(molecule => {
          const attrValue = molecule[lowAttr];
          if (attrValue > maxValue) maxValue = attrValue;
          if (minValue === -999999) minValue = maxValue;
          if (attrValue < minValue) minValue = attrValue;
        });

        initObject.filter[attr.key] = {
          priority: 0,
          order: 1,
          minValue: minValue,
          maxValue: maxValue,
          isFloat: attr.isFloat
        };
      }
      return initObject;
    }, [getListedMolecules]);

    const [initState] = useState(initialize());
    const [filteredCount, setFilteredCount] = useState(getFilteredMoleculesCount(getListedMolecules, filter));
    const [predefinedFilter, setPredefinedFilter] = useState(filter.predefined);

    const handleFilterChange = useCallback(filter => {
      const filterSet = Object.assign({}, filter);
      for (let attr of MOL_ATTRIBUTES) {
        if (filterSet.filter[attr.key].priority === undefined || filterSet.filter[attr.key].priority === '') {
          filterSet.filter[attr.key].priority = 0;
        }
      }
      dispatch(setFilter(filterSet));
    }, [dispatch]);

    useEffect(() => {
      if (!filter.active) {
        const init = initialize();
        dispatch(setFilter(init));
        setFilteredCount(getFilteredMoleculesCount(getListedMolecules, init));
        handleFilterChange(init);
      }
    }, [initialize, dispatch, getListedMolecules, handleFilterChange, filter.active]);

    const handleItemChange = key => setting => {
      let newFilter = Object.assign({}, filter);
      newFilter.filter[key] = setting;
      newFilter.active = true;
      dispatch(setFilter(newFilter));
      setFilteredCount(getFilteredMoleculesCount(getListedMolecules, newFilter));
      handleFilterChange(newFilter);
    };

    const handlePrioChange = key => inc => () => {
      const maxPrio = MOL_ATTRIBUTES.length - 1;
      const minPrio = 0;
      let priorityOrder = filter.priorityOrder;
      const index = filter.priorityOrder.indexOf(key);
      if (index > -1 && index + inc >= minPrio && index <= maxPrio) {
        priorityOrder.splice(index, 1);
        priorityOrder.splice(index + inc, 0, key);
        let newFilter = Object.assign({}, filter);
        newFilter.priorityOrder = priorityOrder;
        newFilter.active = true;
        dispatch(setFilter(newFilter));
        handleFilterChange(newFilter);
      }
    };

    const handleClear = () => {
      const resetFilter = initialize();
      setPredefinedFilter('none');
      dispatch(setFilter(resetFilter));
      setFilteredCount(getFilteredMoleculesCount(getListedMolecules, resetFilter));
      handleFilterChange(resetFilter);
    };

    // Check for multiple attributes with same sorting priority
    let prioWarning = false;
    let prioWarningTest = {};
    for (const attr of MOL_ATTRIBUTES) {
      const prioKey = filter.filter[attr.key].priority;
      if (prioKey > 0) {
        prioWarningTest[prioKey] = prioWarningTest[prioKey] ? prioWarningTest[prioKey] + 1 : 1;
        if (prioWarningTest[prioKey] > 1) prioWarning = true;
      }
    }

    const id = open ? 'simple-popover-' + parentID : undefined;

    return (
      <Popper id={id} open={open} anchorEl={anchorEl} placement={placement}>
        <Panel
          hasHeader
          bodyOverflow
          secondaryBackground
          title={`Left filter: ${filteredCount} matches`}
          className={classes.paper}
          headerActions={[
            <Tooltip title="Clear filter">
              <IconButton onClick={handleClear} color="inherit" className={classes.headerButton}>
                <Delete />
              </IconButton>
            </Tooltip>,
            <Tooltip title="Close filter">
              <IconButton
                onClick={() => {
                  setSortDialogAnchorEl(null);
                  dispatch(setSortDialogOpen(false));
                }}
                color="inherit"
                className={classes.headerButton}
              >
                <Close />
              </IconButton>
            </Tooltip>
          ]}
        >
          {prioWarning && (
            <div>
              <WarningIcon className={classes.warningIcon} /> multiple attributes with same sorting priority
            </div>
          )}
          <Grid container>
            <Grid container item className={classes.gridItemHeader}>
              <Grid item className={classes.centered} style={{ width: widthPrio }}>
                priority
              </Grid>
              <Grid item className={classes.centered} style={{ width: widthOrder }}>
                <div style={{ textAlign: 'center' }}>
                  order
                  <br />
                  <span style={{ fontSize: 'smaller' }}>(up/down)</span>
                </div>
              </Grid>
              <Grid item className={classes.centered} style={{ width: widthProperty }}>
                property
              </Grid>
              <Grid item className={classes.centered} style={{ width: widthMin }}>
                min
              </Grid>
              <Grid item className={classes.centered} style={{ width: widthSlider }} />
              <Grid item className={classes.centered} style={{ width: widthMin }}>
                max
              </Grid>
            </Grid>

            {filter.priorityOrder.map(attr => {
              let attrDef = getAttrDefinition(attr);

              return (
                <MoleculeListSortFilterItem
                  key={attr}
                  property={attrDef.name}
                  order={filter.filter[attr].order}
                  minValue={filter.filter[attr].minValue}
                  maxValue={filter.filter[attr].maxValue}
                  min={initState.filter[attr].minValue}
                  max={initState.filter[attr].maxValue}
                  isFloat={initState.filter[attr].isFloat}
                  color={attrDef.color}
                  disabled={predefinedFilter !== 'none'}
                  onChange={handleItemChange(attr)}
                  onChangePrio={handlePrioChange(attr)}
                  filter={attrDef.filter}
                />
              );
            })}
          </Grid>
        </Panel>
      </Popper>
    );
  }
);

MoleculeListSortFilterDialog.propTypes = {
  molGroupSelection: PropTypes.arrayOf(PropTypes.number).isRequired,
  cachedMolList: PropTypes.object.isRequired,
  filter: PropTypes.object,
  setFilter: PropTypes.func,
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired
};
