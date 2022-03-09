import React, { useMemo } from 'react';
import { Checkbox, IconButton, makeStyles, Typography } from '@material-ui/core';
import { IconComponent } from '../../../../common/components/IconComponent';
import { FaFlask } from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { IoFootsteps } from 'react-icons/io5';
import { ImSad, ImSmile } from 'react-icons/im';
import { useSynthesiseMethod } from './useSynthesiseMethod';
import { useAdjustReactionSuccessRate } from './useAdjustReactionSuccessRate';
import { AutocompleteFilter } from '../components/AutocompleteFilter';
import {
  createTableMethodAutocompleteFilter,
  createTableMethodYesNoFilter,
  createTableMethodRangeFilter
} from '../utils/createTableMethodFilters';
import {
  createTableTargetAutocompleteFilter,
  createTableTargetRangeFilter,
  createTableTargetYesNoFilter
} from '../utils/createTableTargetFilters';
import { YesNoFilter } from '../components/YesNoFilter';
import { RangeFilter } from '../components/RangeFilter';

const useStyles = makeStyles(theme => ({
  text: {
    width: '100%',
    textAlign: 'center'
  },
  flexCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1 / 2)
  },
  reactionWrapper: {
    display: 'grid'
  },
  reactionNameWrapper: {
    textAlign: 'center',
    display: 'grid',
    lineHeight: 1
  }
}));

const filterByMethodReactionName = createTableMethodAutocompleteFilter((row, ids, filterValue) =>
  filterValue.includes(row.values[ids[0]])
);

const filterByTargetCatalogEntry = createTableTargetYesNoFilter(
  (row, ids, filterValue) => !!row.values[ids[0]].length === filterValue
);

const filterByTargetVendor = createTableTargetAutocompleteFilter((row, ids, filterValue) => {
  const vendors = row.original.catalogentries.map(({ vendor }) => vendor);
  return filterValue.some(value => vendors.includes(value));
});

const filterByTargetLeadTime = createTableTargetRangeFilter((row, ids, filterValue) => {
  const leadTimes = row.original.catalogentries.map(({ leadtime }) => leadtime);
  const [min, max] = filterValue;
  return leadTimes.some(leadTime => min >= leadTime && leadTime <= max);
});

const filterByTargetPrice = createTableTargetRangeFilter((row, ids, filterValue) => {
  const prices = row.original.catalogentries.map(({ upperprice }) => upperprice);
  const [min, max] = filterValue;
  return prices.some(price => price >= min && price <= max);
});

const filterByMethodOTExecutable = createTableMethodYesNoFilter(
  (row, ids, filterValue) => row.values[ids[0]] === filterValue
);

const filterByMethodReactantVendor = index =>
  createTableMethodAutocompleteFilter((row, ids, filterValue) => {
    const vendors = (
      row.original.reactions?.[index]?.reactants?.map(({ catalogentries }) =>
        catalogentries?.map(({ vendor }) => vendor)
      ) || []
    ).flat(2);
    return filterValue.some(value => vendors.includes(value));
  });

const filterByMethodReactantLeadTime = index =>
  createTableMethodRangeFilter((row, ids, filterValue) => {
    const leadTimes = (
      row.original.reactions?.[index]?.reactants?.map(({ catalogentries }) =>
        catalogentries?.map(({ leadtime }) => leadtime)
      ) || []
    ).flat(2);
    const [min, max] = filterValue;
    return leadTimes.some(leadTime => leadTime >= min && leadTime <= max);
  });

const filterByMethodReactantPrice = index =>
  createTableMethodRangeFilter((row, ids, filterValue) => {
    const prices = (
      row.original.reactions?.[index]?.reactants?.map(({ catalogentries }) =>
        catalogentries?.map(({ upperprice }) => upperprice)
      ) || []
    ).flat(2);
    const [min, max] = filterValue;
    return prices.some(price => price >= min && price <= max);
  });

export const useTableColumns = maxNoSteps => {
  const classes = useStyles();

  const { mutate: synthesiseMethod } = useSynthesiseMethod();
  const { mutate: adjustReactionSuccessRate } = useAdjustReactionSuccessRate();

  // Since filter functions should be memoized, we can't call them directly
  const reactantVendorFilters = useMemo(() => {
    return new Array(maxNoSteps).fill(0).map((_, index) => filterByMethodReactantVendor(index));
  }, [maxNoSteps]);
  const reactantLeadTimeFilters = useMemo(() => {
    return new Array(maxNoSteps).fill(0).map((_, index) => filterByMethodReactantLeadTime(index));
  }, [maxNoSteps]);
  const reactantPriceFilters = useMemo(() => {
    return new Array(maxNoSteps).fill(0).map((_, index) => filterByMethodReactantPrice(index));
  }, [maxNoSteps]);

  const columns = useMemo(() => {
    return [
      {
        accessor: 'estimatecost',
        sortLabel: 'cost',
        disableFilters: true,
        Header: () => {
          return <IconComponent Component={GiMoneyStack} />;
        },
        Cell: ({ value }) => {
          return (
            <Typography className={classes.text} component="span" noWrap>
              {value}
            </Typography>
          );
        },
        sortType: 'number'
      },
      {
        accessor: 'synthesise',
        disableSortBy: true,
        disableFilters: true,
        Header: () => {
          return <IconComponent Component={FaFlask} />;
        },
        Cell: ({ value, row }) => {
          return (
            <Checkbox
              checked={value}
              onChange={(_, checked) =>
                synthesiseMethod({
                  method: row.original,
                  synthesise: checked
                })
              }
            />
          );
        }
      },
      ...new Array(maxNoSteps).fill(0).map((_, index) => {
        return {
          accessor: `reactions[${index}].reactionclass`,
          sortLabel: `reaction step ${index + 1}`,
          Header: () => {
            return (
              <div className={classes.flexCell}>
                <IconComponent Component={IoFootsteps} />
                <Typography component="span">{index + 1}</Typography>
              </div>
            );
          },
          Cell: ({ value, row }) => {
            const reaction = row.original.reactions[index];

            if (!reaction) {
              return null;
            }

            return (
              <div className={classes.flexCell}>
                <div className={classes.reactionWrapper}>
                  <img src={reaction.reactionimage} width={270} height={60} />
                  <div className={classes.reactionNameWrapper}>
                    <Typography variant="caption" noWrap>
                      {value}
                    </Typography>
                  </div>
                </div>
                <IconButton size="small" onClick={() => adjustReactionSuccessRate({ reaction, successrate: 0.6 })}>
                  <IconComponent Component={ImSmile} />
                </IconButton>
                <IconButton size="small" onClick={() => adjustReactionSuccessRate({ reaction, successrate: 0.4 })}>
                  <IconComponent Component={ImSad} />
                </IconButton>
              </div>
            );
          },
          Filter: ({ column: { filterValue, setFilter }, preFilteredFlatRows }) => {
            return (
              <AutocompleteFilter
                id={`reaction-${index + 1}-filter`}
                options={[
                  ...new Set(
                    preFilteredFlatRows
                      .filter(row => row.depth === 1)
                      .map(row => row.original.reactions?.[index]?.reactionclass)
                  )
                ].sort()}
                label={`Reaction type - step ${index + 1}`}
                placeholder="Reaction type"
                filterValue={filterValue}
                setFilter={setFilter}
              />
            );
          },
          filter: filterByMethodReactionName
        };
      }),
      {
        accessor: 'catalogentries',
        Filter: ({ column: { filterValue, setFilter } }) => {
          return (
            <YesNoFilter
              id="target-catalogentries-filter"
              label="Target has catalog entry"
              filterValue={filterValue}
              setFilter={setFilter}
            />
          );
        },
        filter: filterByTargetCatalogEntry
      },
      {
        id: 'target-vendor',
        defaultCanFilter: true,
        Filter: ({ column: { filterValue, setFilter }, preFilteredFlatRows }) => {
          return (
            <AutocompleteFilter
              id={`target-vendor-filter`}
              options={[
                ...new Set(
                  preFilteredFlatRows
                    .filter(row => row.depth === 0)
                    .map(row => row.original.catalogentries?.map(({ vendor }) => vendor) || [])
                    .flat()
                )
              ].sort()}
              label="Target vendor"
              placeholder="Target vendor"
              filterValue={filterValue}
              setFilter={setFilter}
            />
          );
        },
        filter: filterByTargetVendor
      },
      {
        id: 'target-leadtime',
        defaultCanFilter: true,
        Filter: ({ column: { filterValue, setFilter }, preFilteredFlatRows }) => {
          const leadTimes = preFilteredFlatRows
            .filter(row => row.depth === 0)
            .map(row => row.original.catalogentries?.map(({ leadtime }) => leadtime) || [])
            .flat();
          return (
            <RangeFilter
              id="target-leadtime"
              label="Target lead time"
              min={Math.min(...leadTimes)}
              max={Math.max(...leadTimes)}
              filterValue={filterValue}
              setFilter={setFilter}
            />
          );
        },
        filter: filterByTargetLeadTime
      },
      {
        id: 'target-price',
        defaultCanFilter: true,
        Filter: ({ column: { filterValue, setFilter }, preFilteredFlatRows }) => {
          const prices = preFilteredFlatRows
            .filter(row => row.depth === 0)
            .map(row => row.original.catalogentries?.map(({ upperprice }) => upperprice) || [])
            .flat();

          return (
            <RangeFilter
              id="target-price"
              label="Target price"
              min={Math.min(...prices)}
              max={Math.max(...prices)}
              filterValue={filterValue}
              setFilter={setFilter}
            />
          );
        },
        filter: filterByTargetPrice
      },
      {
        accessor: 'otchem',
        Filter: ({ column: { filterValue, setFilter } }) => {
          return (
            <YesNoFilter
              id="otchem-filter"
              label="Executable on OpenTrons"
              filterValue={filterValue}
              setFilter={setFilter}
            />
          );
        },
        filter: filterByMethodOTExecutable
      },
      ...new Array(maxNoSteps).fill(0).map((_, index) => {
        return {
          id: `reactant-vendor-step-${index}`,
          defaultCanFilter: true,
          Filter: ({ column: { filterValue, setFilter }, preFilteredFlatRows }) => {
            return (
              <AutocompleteFilter
                id={`reactant-vendor-${index + 1}-filter`}
                options={[
                  ...new Set(
                    preFilteredFlatRows
                      .filter(row => row.depth === 1)
                      .map(row =>
                        row.original.reactions?.[index]?.reactants.map(({ catalogentries }) =>
                          catalogentries.map(({ vendor }) => vendor)
                        )
                      )
                      .flat(2)
                      .filter(vendor => !!vendor)
                  )
                ].sort()}
                label={`Reactant vendor - step ${index + 1}`}
                placeholder="Reactant vendor"
                filterValue={filterValue}
                setFilter={setFilter}
              />
            );
          },
          filter: reactantVendorFilters[index]
        };
      }),
      ...new Array(maxNoSteps).fill(0).map((_, index) => {
        return {
          id: `reactant-leadtime-step-${index}`,
          defaultCanFilter: true,
          Filter: ({ column: { filterValue, setFilter }, preFilteredFlatRows }) => {
            const leadTimes = preFilteredFlatRows
              .filter(row => row.depth === 1)
              .map(row =>
                row.original.reactions?.[index]?.reactants.map(({ catalogentries }) =>
                  catalogentries.map(({ leadtime }) => leadtime)
                )
              )
              .flat(2)
              .filter(leadTime => Number.isFinite(leadTime));

            return (
              <RangeFilter
                id={`reactant-leadtime-${index + 1}-filter`}
                label={`Reactant lead time - step ${index + 1}`}
                min={Math.min(...leadTimes)}
                max={Math.max(...leadTimes)}
                filterValue={filterValue}
                setFilter={setFilter}
              />
            );
          },
          filter: reactantLeadTimeFilters[index]
        };
      }),
      ...new Array(maxNoSteps).fill(0).map((_, index) => {
        return {
          id: `reactant-price-step-${index}`,
          defaultCanFilter: true,
          Filter: ({ column: { filterValue, setFilter }, preFilteredFlatRows }) => {
            const prices = preFilteredFlatRows
              .filter(row => row.depth === 1)
              .map(row =>
                row.original.reactions?.[index]?.reactants.map(({ catalogentries }) =>
                  catalogentries.map(({ upperprice }) => upperprice)
                )
              )
              .flat(2)
              .filter(price => Number.isFinite(price));

            return (
              <RangeFilter
                id={`reactant-price-${index + 1}-filter`}
                label={`Reactant price - step ${index + 1}`}
                min={Math.min(...prices)}
                max={Math.max(...prices)}
                filterValue={filterValue}
                setFilter={setFilter}
              />
            );
          },
          filter: reactantPriceFilters[index]
        };
      })
    ];
  }, [
    maxNoSteps,
    classes.text,
    classes.flexCell,
    classes.reactionWrapper,
    classes.reactionNameWrapper,
    synthesiseMethod,
    adjustReactionSuccessRate,
    reactantVendorFilters,
    reactantLeadTimeFilters,
    reactantPriceFilters
  ]);

  return columns;
};
