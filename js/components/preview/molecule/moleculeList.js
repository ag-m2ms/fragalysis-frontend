/**
 * Created by abradley on 14/03/2018.
 */
import { Grid, Chip, Tooltip, makeStyles, CircularProgress, Divider, Typography } from '@material-ui/core';
import React, { useState, useEffect, memo, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MoleculeView, { colourList } from './moleculeView';
import { MoleculeListSortFilterDialog, filterMolecules, getAttrDefinition } from './moleculeListSortFilterDialog';
import InfiniteScroll from 'react-infinite-scroller';
import { Button } from '../../common/Inputs/Button';
import { Panel } from '../../common/Surfaces/Panel';
import { ComputeSize } from '../../../utils/computeSize';
import { moleculeProperty } from './helperConstants';
import { VIEWS } from '../../../constants/constants';
import { NglContext } from '../../nglView/nglProvider';
import { useDisableUserInteraction } from '../../helpers/useEnableUserInteracion';
import classNames from 'classnames';
import {
  addVector,
  removeVector,
  addProtein,
  removeProtein,
  addComplex,
  removeComplex,
  addSurface,
  removeSurface,
  addDensity,
  removeDensity,
  addLigand,
  removeLigand
} from './redux/dispatchActions';

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
    width: 'inherit',
    color: theme.palette.black
  },
  gridItemHeader: {
    height: '32px',
    fontSize: '8px',
    color: '#7B7B7B'
  },
  gridItemHeaderVert: {
    transform: 'rotate(-90deg)',
    height: 'fit-content'
  },
  gridItemHeaderHoriz: {
    width: 'fit-content'
  },
  gridItemList: {
    overflow: 'auto',
    height: `calc(100% - ${theme.spacing(6)}px)`
  },
  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    minWidth: 'unset'
  },
  buttonActive: {
    border: 'solid 1px #009000',
    color: '#009000',
    '&:hover': {
      backgroundColor: '#E3EEDA',
      borderColor: '#003f00',
      color: '#003f00'
    }
  },
  paddingProgress: {
    padding: theme.spacing(1)
  },
  filterSection: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  filterTitle: {
    transform: 'rotate(-90deg)'
  },
  molHeader: {
    marginLeft: 19,
    width: 'inherit'
  },
  rightBorder: {
    borderRight: '1px solid',
    borderRightColor: theme.palette.background.divider,
    fontWeight: 'bold',
    paddingLeft: theme.spacing(1) / 2,
    paddingRight: theme.spacing(1) / 2,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    fontSize: 8,
    width: 25,
    textAlign: 'center',
    '&:last-child': {
      borderRight: 'none',
      width: 32
    }
  },
  contButtonsMargin: {
    margin: theme.spacing(1) / 2
  },
  contColButton: {
    minWidth: 'fit-content',
    paddingLeft: theme.spacing(1) / 2,
    paddingRight: theme.spacing(1) / 2,
    paddingBottom: theme.spacing(1) / 8,
    paddingTop: theme.spacing(1) / 8,
    borderRadius: 0,
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    },
    '&:disabled': {
      borderRadius: 0,
      borderColor: 'white'
    }
  },
  contColButtonSelected: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.black
    }
  },
  contColButtonHalfSelected: {
    backgroundColor: theme.palette.primary.semidark,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.black
    }
  }
}));

export const MoleculeList = memo(
  ({
    height,
    setFilterItemsHeight,
    filterItemsHeight,
    object_selection,
    cached_mol_lists,
    moleculeDataList,
    filter,
    title,
    actions,
    sortDialogAnchorEl,
    setCurrentMolecules
  }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const moleculesPerPage = 5;
    const [currentPage, setCurrentPage] = useState(0);
    const imgHeight = 34;
    const imgWidth = 150;
    const sortDialogOpen = useSelector(state => state.previewReducers.molecule.sortDialogOpen);

    const isActiveFilter = !!(filter || {}).active;

    const { getNglView } = useContext(NglContext);
    const stage = getNglView(VIEWS.MAJOR_VIEW) && getNglView(VIEWS.MAJOR_VIEW).stage;

    const filterRef = useRef();

    let joinedMoleculeLists = moleculeDataList;

    const disableUserInteraction = useDisableUserInteraction();

    // TODO Reset Infinity scroll
    /*useEffect(() => {
      // setCurrentPage(0);
    }, [object_selection]);*/

    if (isActiveFilter) {
      joinedMoleculeLists = filterMolecules(joinedMoleculeLists, filter);
    } else {
      // default sort is by site
      joinedMoleculeLists.sort((a, b) => a.site - b.site);
    }

    const loadNextMolecules = () => {
      setCurrentPage(currentPage + 1);
    };

    const listItemOffset = (currentPage + 1) * moleculesPerPage;
    const currentMolecules = joinedMoleculeLists.slice(0, listItemOffset);
    // setCurrentMolecules(currentMolecules);
    const canLoadMore = listItemOffset < joinedMoleculeLists.length;

    useEffect(() => {
      if (isActiveFilter === false) {
        setFilterItemsHeight(0);
      }
    }, [isActiveFilter, setFilterItemsHeight]);

    const selectedAll = useRef(false);
    const proteinList = useSelector(state => state.selectionReducers.proteinList);
    const complexList = useSelector(state => state.selectionReducers.complexList);
    const surfaceList = useSelector(state => state.selectionReducers.surfaceList);
    const densityList = useSelector(state => state.selectionReducers.densityList);
    const fragmentDisplayList = useSelector(state => state.selectionReducers.fragmentDisplayList);
    const vectorOnList = useSelector(state => state.selectionReducers.vectorOnList);

    const isLigandOn = fragmentDisplayList.length > 0 || false;
    const isProteinOn = proteinList.length > 0 || false;
    const isComplexOn = complexList.length > 0 || false;
    const isSurfaceOn = surfaceList.length > 0 || false;
    const isDensityOn = densityList.length > 0 || false;
    const isVectorOn = vectorOnList.length > 0 || false;
    const hasAllValuesOn = isLigandOn && isProteinOn && isComplexOn && isSurfaceOn; // && isVectorOn;
    const hasSomeValuesOn = !hasAllValuesOn && (isLigandOn || isProteinOn || isComplexOn || isSurfaceOn || isVectorOn);

    const addType = {
      ligand: addLigand,
      protein: addProtein,
      complex: addComplex,
      surface: addSurface,
      density: addDensity,
      vector: addVector
    };

    const removeType = {
      ligand: removeLigand,
      protein: removeProtein,
      complex: removeComplex,
      surface: removeSurface,
      density: removeDensity,
      vector: removeVector
    };

    // TODO "currentMolecules" do not need to correspondent to selections in {type}List
    // TODO so this could lead to inconsistend behaviour while scrolling
    // TODO maybe change "currentMolecules.forEach" to "{type}List.forEach"

    const removeSelectedType = type => {
      joinedMoleculeLists.forEach(molecule => {
        dispatch(removeType[type](stage, molecule, colourList[molecule.id % colourList.length]));
      });
      selectedAll.current = false;
    };

    const addNewType = type => {
      joinedMoleculeLists.forEach(molecule => {
        dispatch(addType[type](stage, molecule, colourList[molecule.id % colourList.length]));
      });
    };

    const ucfirst = string => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const onButtonToggle = (type, calledFromSelectAll = false) => {
      if (calledFromSelectAll === true && selectedAll.current === true) {
        // REDO
        if (eval('is' + ucfirst(type) + 'On') === false) {
          addNewType(type);
        }
      } else if (calledFromSelectAll && selectedAll.current === false) {
        removeSelectedType(type);
      } else if (!calledFromSelectAll) {
        if (eval('is' + ucfirst(type) + 'On') === false) {
          addNewType(type);
        } else {
          removeSelectedType(type);
        }
      }
    };

    return (
      <ComputeSize
        componentRef={filterRef.current}
        setHeight={setFilterItemsHeight}
        height={filterItemsHeight}
        forceCompute={isActiveFilter}
      >
        <Panel hasHeader title={title} headerActions={actions}>
          {sortDialogOpen && (
            <MoleculeListSortFilterDialog
              open={sortDialogOpen}
              anchorEl={sortDialogAnchorEl}
              molGroupSelection={object_selection}
              cachedMolList={cached_mol_lists}
              filter={filter}
            />
          )}
          <div ref={filterRef}>
            {isActiveFilter && (
              <>
                <div className={classes.filterSection}>
                  <Grid container spacing={1}>
                    <Grid item xs={1} container alignItems="center">
                      <Typography variant="subtitle2" className={classes.filterTitle}>
                        Filters
                      </Typography>
                    </Grid>
                    <Grid item xs={11}>
                      <Grid container direction="row" justify="flex-start" spacing={1}>
                        {filter.priorityOrder.map(attr => (
                          <Grid item key={`Mol-Tooltip-${attr}`}>
                            <Tooltip
                              title={`${filter.filter[attr].minValue}-${filter.filter[attr].maxValue} ${
                                filter.filter[attr].order === 1 ? '\u2191' : '\u2193'
                              }`}
                              placement="top"
                            >
                              <Chip
                                size="small"
                                label={attr}
                                style={{ backgroundColor: getAttrDefinition(attr).color }}
                              />
                            </Tooltip>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
                <Divider />
              </>
            )}
          </div>
          <Grid
            container
            direction="column"
            justify="flex-start"
            className={classes.container}
            style={{ height: height }}
          >
            <Grid item>
              {/* Header */}
              <Grid container justify="flex-start" direction="row" className={classes.molHeader} wrap="nowrap">
                <Grid item container justify="flex-start" direction="row">
                  {Object.keys(moleculeProperty).map(key => (
                    <Grid item key={key} className={classes.rightBorder}>
                      {moleculeProperty[key]}
                    </Grid>
                  ))}
                  {currentMolecules.length > 0 && (
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        wrap="nowrap"
                        className={classes.contButtonsMargin}
                      >
                        <Tooltip title="all alls">
                          <Grid item>
                            <Button
                              variant="outlined"
                              className={classNames(
                                classes.contColButton,
                                {
                                  [classes.contColButtonSelected]: hasAllValuesOn
                                },
                                {
                                  [classes.contColButtonHalfSelected]: hasSomeValuesOn
                                }
                              )}
                              onClick={() => {
                                // TODO rework all these buttons into a separate component!
                                // always deselect all if are selected only some of options
                                selectedAll.current = hasSomeValuesOn ? false : !selectedAll.current;

                                onButtonToggle('ligand', true);
                                onButtonToggle('protein', true);
                                onButtonToggle('complex', true);
                                onButtonToggle('surface', true);
                                // onDensity(true);
                                // onVector(true);
                              }}
                              disabled={disableUserInteraction}
                            >
                              <Typography variant="subtitle2">A</Typography>
                            </Button>
                          </Grid>
                        </Tooltip>
                        <Tooltip title="all ligands">
                          <Grid item>
                            <Button
                              variant="outlined"
                              className={classNames(classes.contColButton, {
                                [classes.contColButtonSelected]: isLigandOn
                              })}
                              onClick={() => onButtonToggle('ligand')}
                              disabled={disableUserInteraction}
                            >
                              <Typography variant="subtitle2">L</Typography>
                            </Button>
                          </Grid>
                        </Tooltip>
                        <Tooltip title="all sidechains">
                          <Grid item>
                            <Button
                              variant="outlined"
                              className={classNames(classes.contColButton, {
                                [classes.contColButtonSelected]: isProteinOn
                              })}
                              onClick={() => onButtonToggle('protein')}
                              disabled={disableUserInteraction}
                            >
                              <Typography variant="subtitle2">P</Typography>
                            </Button>
                          </Grid>
                        </Tooltip>
                        <Tooltip title="all interactions">
                          <Grid item>
                            {/* C stands for contacts now */}
                            <Button
                              variant="outlined"
                              className={classNames(classes.contColButton, {
                                [classes.contColButtonSelected]: isComplexOn
                              })}
                              onClick={() => onButtonToggle('complex')}
                              disabled={disableUserInteraction}
                            >
                              <Typography variant="subtitle2">C</Typography>
                            </Button>
                          </Grid>
                        </Tooltip>
                        <Tooltip title="all surfaces">
                          <Grid item>
                            <Button
                              variant="outlined"
                              className={classNames(classes.contColButton, {
                                [classes.contColButtonSelected]: isSurfaceOn
                              })}
                              onClick={() => onButtonToggle('surface')}
                              disabled={disableUserInteraction}
                            >
                              <Typography variant="subtitle2">S</Typography>
                            </Button>
                          </Grid>
                        </Tooltip>
                        <Tooltip title="all electron densities">
                          <Grid item>
                            {/* TODO waiting for backend data */}
                            <Button
                              variant="outlined"
                              className={classNames(classes.contColButton, {
                                [classes.contColButtonSelected]: isDensityOn
                              })}
                              onClick={() => onButtonToggle('density')}
                              disabled={true || disableUserInteraction}
                            >
                              <Typography variant="subtitle2">D</Typography>
                            </Button>
                          </Grid>
                        </Tooltip>
                        <Tooltip title="all vectors">
                          <Grid item>
                            <Button
                              variant="outlined"
                              className={classNames(classes.contColButton, {
                                [classes.contColButtonSelected]: isVectorOn
                              })}
                              onClick={() => onButtonToggle('vector')}
                              disabled={true || disableUserInteraction}
                            >
                              <Typography variant="subtitle2">V</Typography>
                            </Button>
                          </Grid>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
            {currentMolecules.length > 0 && (
              <Grid item className={classes.gridItemList}>
                <InfiniteScroll
                  pageStart={0}
                  loadMore={loadNextMolecules}
                  hasMore={canLoadMore}
                  loader={
                    <div className="loader" key={0}>
                      <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        className={classes.paddingProgress}
                      >
                        <CircularProgress />
                      </Grid>
                    </div>
                  }
                  useWindow={false}
                >
                  {currentMolecules.map(data => (
                    <MoleculeView key={data.id} imageHeight={imgHeight} imageWidth={imgWidth} data={data} />
                  ))}
                </InfiniteScroll>
              </Grid>
            )}
          </Grid>
        </Panel>
      </ComputeSize>
    );
  }
);
