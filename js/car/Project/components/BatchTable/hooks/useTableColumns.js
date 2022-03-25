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
import { createTableMethodAutocompleteFilter, createTableMethodYesNoFilter } from '../utils/createTableMethodFilters';
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

const PREFERRED_VENDORS = ['mcule'];
const PREFERRED_LEAD_TIME = 4;
const PREFERRED_PRICE = 200;

const filterByMethodReactionName = createTableMethodAutocompleteFilter((row, ids, filterValue) =>
  filterValue.includes(row.values[ids[0]])
);

const filterByMethodOTExecutable = createTableMethodYesNoFilter(
  (row, ids, filterValue) => row.values[ids[0]] === filterValue
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

const filterByMethodPreferredReactantVendor = index =>
  createTableMethodYesNoFilter((row, ids, filterValue) => {
    const reactantVendors1 =
      row.original.reactions?.[index]?.reactants?.[0].catalogentries?.map(({ vendor }) => vendor) || [];
    const reactantVendors2 =
      row.original.reactions?.[index]?.reactants?.[1].catalogentries?.map(({ vendor }) => vendor) || [];

    const presentInBoth =
      reactantVendors1.some(vendor => PREFERRED_VENDORS.includes(vendor)) &&
      reactantVendors2.some(vendor => PREFERRED_VENDORS.includes(vendor));

    return filterValue ? presentInBoth : !presentInBoth;
  });

const filterByMethodPreferredReactantLeadTime = index =>
  createTableMethodYesNoFilter((row, ids, filterValue) => {
    const reactantLeadTimes1 =
      row.original.reactions?.[index]?.reactants?.[0]?.catalogentries?.map(({ leadtime }) => leadtime) || [];
    const reactantLeadTimes2 =
      row.original.reactions?.[index]?.reactants?.[1]?.catalogentries?.map(({ leadtime }) => leadtime) || [];

    if (!reactantLeadTimes1.length || !reactantLeadTimes2.length) {
      return !filterValue;
    }

    const minimalLeadTime1 = Math.min(...reactantLeadTimes1);
    const minimalLeadTime2 = Math.min(...reactantLeadTimes2);
    const sum = minimalLeadTime1 + minimalLeadTime2;

    const withinRange = sum <= PREFERRED_LEAD_TIME;

    return filterValue ? withinRange : !withinRange;
  });

const filterByMethodPreferredReactantPrice = index =>
  createTableMethodYesNoFilter((row, ids, filterValue) => {
    const reactantPrices1 =
      row.original.reactions?.[index]?.reactants?.[0]?.catalogentries?.map(({ upperprice }) => upperprice) || [];
    const reactantPrices2 =
      row.original.reactions?.[index]?.reactants?.[1]?.catalogentries?.map(({ upperprice }) => upperprice) || [];

    if (!reactantPrices1.length || !reactantPrices2.length) {
      return !filterValue;
    }

    const minimalPrice1 = Math.min(...reactantPrices1);
    const minimalPrice2 = Math.min(...reactantPrices2);
    const sum = minimalPrice1 + minimalPrice2;

    const withinRange = sum <= PREFERRED_PRICE;

    return filterValue ? withinRange : !withinRange;
  });

const formatPreferredVendorsString = vendors => {
  if (vendors.length === 1) {
    return vendors[0];
  }

  const lastVendor = vendors.at(-1);
  const remainingVendors = vendors.slice(0, -1);

  return `${remainingVendors.join(', ')} or ${lastVendor}`;
};

export const useTableColumns = maxNoSteps => {
  const classes = useStyles();

  const { mutate: synthesiseMethod } = useSynthesiseMethod();
  const { mutate: adjustReactionSuccessRate } = useAdjustReactionSuccessRate();

  // Since filter functions should be memoized, we can't call them directly
  const preferredReactantVendorFilters = useMemo(() => {
    return new Array(maxNoSteps).fill(0).map((_, index) => filterByMethodPreferredReactantVendor(index));
  }, [maxNoSteps]);
  const preferredReactantLeadTimeFilters = useMemo(() => {
    return new Array(maxNoSteps).fill(0).map((_, index) => filterByMethodPreferredReactantLeadTime(index));
  }, [maxNoSteps]);
  const preferredReactantPriceFilters = useMemo(() => {
    return new Array(maxNoSteps).fill(0).map((_, index) => filterByMethodPreferredReactantPrice(index));
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
          filterOrder: 6,
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
        accessor: 'otchem',
        filterOrder: 1,
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
      {
        accessor: 'catalogentries',
        filterOrder: 2,
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
        filterOrder: 3,
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
        filterOrder: 4,
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
        filterOrder: 5,
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
      ...new Array(maxNoSteps).fill(0).map((_, index) => {
        return {
          id: `reactant-vendor-step-${index}`,
          defaultCanFilter: true,
          filterOrder: 7,
          Filter: ({ column: { filterValue, setFilter } }) => {
            return (
              <YesNoFilter
                id={`reactant-vendor-${index + 1}-filter`}
                label={`Reactant vendor is ${formatPreferredVendorsString(PREFERRED_VENDORS)} - step ${index + 1}`}
                filterValue={filterValue}
                setFilter={setFilter}
              />
            );
          },
          filter: preferredReactantVendorFilters[index]
        };
      }),
      ...new Array(maxNoSteps).fill(0).map((_, index) => {
        return {
          id: `reactant-leadtime-step-${index}`,
          defaultCanFilter: true,
          filterOrder: 8,
          Filter: ({ column: { filterValue, setFilter } }) => {
            return (
              <YesNoFilter
                id={`reactant-leadtime-${index + 1}-filter`}
                label={`Reactant lead time within ${PREFERRED_LEAD_TIME} weeks - step ${index + 1}`}
                filterValue={filterValue}
                setFilter={setFilter}
              />
            );
          },
          filter: preferredReactantLeadTimeFilters[index]
        };
      }),
      ...new Array(maxNoSteps).fill(0).map((_, index) => {
        return {
          id: `reactant-price-step-${index}`,
          defaultCanFilter: true,
          filterOrder: 9,
          Filter: ({ column: { filterValue, setFilter } }) => {
            return (
              <YesNoFilter
                id={`reactant-price-${index + 1}-filter`}
                label={`Reactant price within ${PREFERRED_PRICE} - step ${index + 1}`}
                filterValue={filterValue}
                setFilter={setFilter}
              />
            );
          },
          filter: preferredReactantPriceFilters[index]
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
    preferredReactantVendorFilters,
    preferredReactantLeadTimeFilters,
    preferredReactantPriceFilters
  ]);

  return columns;
};
