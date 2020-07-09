/**
 * Created by abradley on 14/04/2018.
 */

import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { Grid, makeStyles, useTheme, ButtonGroup, Button } from '@material-ui/core';
import NGLView from '../nglView/nglView';
import HitNavigator from './molecule/hitNavigator';
import { CustomDatasetList } from '../datasets/customDatasetList';
import MolGroupSelector from './moleculeGroups/molGroupSelector';
import { SummaryView } from './summary/summaryView';
import { CompoundList } from './compounds/compoundList';
import { ViewerControls } from './viewerControls';
import { ComputeSize } from '../../utils/computeSize';
import { withUpdatingTarget } from '../target/withUpdatingTarget';
import { VIEWS } from '../../constants/constants';
import { withLoadingProtein } from './withLoadingProtein';
import { withSnapshotManagement } from '../snapshot/withSnapshotManagement';
import { useDispatch, useSelector } from 'react-redux';
import { ProjectHistory } from './projectHistory';
import { ProjectDetailDrawer } from '../projects/projectDetailDrawer';
import { NewSnapshotModal } from '../snapshot/modals/newSnapshotModal';
import { HeaderContext } from '../header/headerContext';
import { unmountPreviewComponent } from './redux/dispatchActions';
import { NglContext } from '../nglView/nglProvider';
import { SaveSnapshotBeforeExit } from '../snapshot/modals/saveSnapshotBeforeExit';
import { ModalShareSnapshot } from '../snapshot/modals/modalShareSnapshot';
//import HotspotList from '../hotspot/hotspotList';
import { TabPanel } from '../common/Tabs';
import { loadDatasetCompoundsWithScores, loadDataSets } from '../datasets/redux/dispatchActions';
import { SelectedCompoundList } from '../datasets/selectedCompoundsList';
import { DatasetSelectorMenuButton } from '../datasets/datasetSelectorMenuButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { setMoleculeListIsLoading } from '../datasets/redux/actions';

const hitNavigatorWidth = 504;

/* 48px is tabs header height */
const TABS_HEADER_HEIGHT = 48;

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: 'inherit'
  },
  inheritWidth: {
    width: 'inherit'
  },
  nglViewWidth: {
    // padding: 0,
    width: 'inherit'
  },
  hitColumn: {
    minWidth: hitNavigatorWidth,
    [theme.breakpoints.up('md')]: {
      width: hitNavigatorWidth
    },
    [theme.breakpoints.only('sm')]: {
      width: '100%'
    }
  },
  nglColumn: {
    [theme.breakpoints.up('lg')]: {
      width: `calc(100vw - ${2 * hitNavigatorWidth}px - ${theme.spacing(2)}px)`
    },
    [theme.breakpoints.only('md')]: {
      width: `calc(100vw - ${hitNavigatorWidth}px - ${theme.spacing(4)}px)`
    }
  },
  rightSideColumn: {
    minWidth: hitNavigatorWidth,
    [theme.breakpoints.up('lg')]: {
      width: hitNavigatorWidth
    }
  },
  tabHeader: {
    maxWidth: hitNavigatorWidth - theme.spacing(1)
  },
  tabButtonGroup: {
    maxWidth: hitNavigatorWidth - theme.spacing(2),
    height: 48
  }
}));

const Preview = memo(({ isStateLoaded, hideProjects }) => {
  const classes = useStyles();
  const theme = useTheme();

  const { headerHeight } = useContext(HeaderContext);
  const { nglViewList } = useContext(NglContext);
  const nglViewerControlsRef = useRef(null);
  const dispatch = useDispatch();

  const customDatasets = useSelector(state => state.datasetsReducers.datasets);
  const [selectedDatasetIndex, setSelectedDatasetIndex] = useState();
  const currentDataset = customDatasets[selectedDatasetIndex];
  const target_on_name = useSelector(state => state.apiReducers.target_on_name);

  /*
     Loading datasets
   */
  useEffect(() => {
    if (customDatasets.length === 0) {
      dispatch(setMoleculeListIsLoading(true));
      dispatch(loadDataSets(target_on_name))
        .then(results => {
          if (Array.isArray(results) && results.length > 0) {
            setSelectedDatasetIndex(0);
          }
          return dispatch(loadDatasetCompoundsWithScores());
        })
        .catch(error => {
          throw new Error(error);
        })
        .finally(() => {
          dispatch(setMoleculeListIsLoading(false));
        });
    }
  }, [customDatasets.length, dispatch]);

  const [molGroupsHeight, setMolGroupsHeight] = useState(0);
  const [filterItemsHeight, setFilterItemsHeight] = useState(0);

  /* Hit navigator list height */
  const moleculeListHeight = `calc(100vh - ${headerHeight}px - ${theme.spacing(2)}px - ${molGroupsHeight}px - ${
    filterItemsHeight > 0 ? filterItemsHeight + theme.spacing(1) / 2 : 0
  }px - ${theme.spacing(8)}px)`;

  /* Custom dataset list height */
  const customMoleculeListHeight = `calc(100vh - ${headerHeight}px - ${theme.spacing(hideProjects ? 1 : 2)}px - ${
    hideProjects ? 0 : molGroupsHeight
  }px - ${filterItemsHeight > 0 ? filterItemsHeight + theme.spacing(1) / 2 : 0}px - ${theme.spacing(
    8
  )}px - ${TABS_HEADER_HEIGHT}px)`;

  const [viewControlsHeight, setViewControlsHeight] = useState(0);

  const screenHeight = `calc(100vh - ${headerHeight}px - ${theme.spacing(2)}px - ${viewControlsHeight}px )`;

  const [summaryViewHeight, setSummaryViewHeight] = useState(0);

  const [projectHistoryHeight, setProjectHistoryHeight] = useState(0);

  const compoundHeight = `calc(100vh - ${headerHeight}px - ${theme.spacing(
    hideProjects ? 10 : 11
  )}px - ${summaryViewHeight}px  - ${projectHistoryHeight}px - ${TABS_HEADER_HEIGHT}px )`;
  const [showHistory, setShowHistory] = useState(false);

  const [tabValue, setTabValue] = useState(0);
  const getTabValue = () => {
    if (tabValue === 2) {
      return tabValue + selectedDatasetIndex;
    }
    return tabValue;
  };

  useEffect(() => {
    // Unmount Preview - reset NGL state
    return () => {
      dispatch(unmountPreviewComponent(nglViewList));
    };
  }, [dispatch, nglViewList]);

  const anchorRefDatasetDropdown = useRef(null);
  const [openDatasetDropdown, setOpenDatasetDropdown] = useState(false);

  return (
    <>
      <Grid container justify="space-between" className={classes.root} spacing={1}>
        <Grid item container direction="column" spacing={1} className={classes.hitColumn}>
          {/* Hit cluster selector */}
          <Grid item>
            <MolGroupSelector
              isStateLoaded={isStateLoaded}
              hideProjects={hideProjects}
              handleHeightChange={setMolGroupsHeight}
            />
          </Grid>
          {/* Hit navigator */}
          <Grid item>
            <HitNavigator
              height={moleculeListHeight}
              setFilterItemsHeight={setFilterItemsHeight}
              filterItemsHeight={filterItemsHeight}
              hideProjects={hideProjects}
            />
          </Grid>
        </Grid>
        <Grid item className={classes.nglColumn}>
          <Grid container direction="column">
            <Grid item className={classes.nglViewWidth}>
              <NGLView div_id={VIEWS.MAJOR_VIEW} height={screenHeight} />
            </Grid>
            <Grid item ref={nglViewerControlsRef} className={classes.inheritWidth}>
              <ComputeSize
                componentRef={nglViewerControlsRef.current}
                height={viewControlsHeight}
                setHeight={setViewControlsHeight}
              >
                <ViewerControls />
              </ComputeSize>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container direction="column" spacing={1} className={classes.rightSideColumn}>
          <Grid item className={classes.tabHeader}>
            <ButtonGroup
              color="primary"
              variant="contained"
              aria-label="outlined primary button group"
              className={classes.tabButtonGroup}
            >
              <Button size="small" variant={getTabValue() === 0 ? 'contained' : 'text'} onClick={() => setTabValue(0)}>
                Vector selector
              </Button>
              <Button size="small" variant={getTabValue() === 1 ? 'contained' : 'text'} onClick={() => setTabValue(1)}>
                Selected compounds
              </Button>
              <Button size="small" variant={getTabValue() >= 2 ? 'contained' : 'text'} onClick={() => setTabValue(2)}>
                {currentDataset?.title}
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setOpenDatasetDropdown(prevOpen => !prevOpen);
                }}
                ref={anchorRefDatasetDropdown}
                className={classes.dropDown}
              >
                <ArrowDropDownIcon />
              </Button>
              <ButtonGroup />
            </ButtonGroup>
            <DatasetSelectorMenuButton
              anchorRef={anchorRefDatasetDropdown}
              open={openDatasetDropdown}
              setOpen={setOpenDatasetDropdown}
              customDatasets={customDatasets}
              selectedDatasetIndex={selectedDatasetIndex}
              setSelectedDatasetIndex={setSelectedDatasetIndex}
            />
            <TabPanel value={getTabValue()} index={0}>
              {/* Vector selector */}
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <SummaryView setSummaryViewHeight={setSummaryViewHeight} summaryViewHeight={summaryViewHeight} />
                </Grid>
                <Grid item>
                  <CompoundList height={compoundHeight} />
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={getTabValue()} index={1}>
              <SelectedCompoundList height={customMoleculeListHeight} />
            </TabPanel>
            {customDatasets.map((dataset, index) => {
              return (
                <TabPanel key={index + 2} value={getTabValue()} index={index + 2}>
                  <Grid item>
                    <CustomDatasetList
                      dataset={dataset}
                      height={customMoleculeListHeight}
                      setFilterItemsHeight={setFilterItemsHeight}
                      filterItemsHeight={filterItemsHeight}
                      hideProjects={hideProjects}
                      isActive={index === selectedDatasetIndex}
                    />
                  </Grid>
                </TabPanel>
              );
            })}
          </Grid>
          {!hideProjects && (
            <Grid item>
              <ProjectHistory
                setHeight={setProjectHistoryHeight}
                showFullHistory={() => setShowHistory(!showHistory)}
              />
            </Grid>
          )}
        </Grid>
        {/*<Grid item xs={12} sm={6} md={4} >
          <HotspotList />
        </Grid>*/}
      </Grid>
      <NewSnapshotModal />
      <ModalShareSnapshot />
      <SaveSnapshotBeforeExit />
      {!hideProjects && <ProjectDetailDrawer showHistory={showHistory} setShowHistory={setShowHistory} />}
    </>
  );
});

export default withSnapshotManagement(withUpdatingTarget(withLoadingProtein(Preview)));
