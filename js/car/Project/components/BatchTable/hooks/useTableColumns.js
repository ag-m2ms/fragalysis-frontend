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
import { createTableFilter } from '../utils/createTableFilter';

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

const filterByReactionName = index =>
  createTableFilter((row, ids, filterValue) => {
    const reactionClass = row.original.reactions[index]?.reactionclass;
    return filterValue.includes(reactionClass);
  });

export const useTableColumns = maxNoSteps => {
  const classes = useStyles();

  const { mutate: synthesiseMethod } = useSynthesiseMethod();
  const { mutate: adjustReactionSuccessRate } = useAdjustReactionSuccessRate();

  const columns = useMemo(() => {
    return [
      {
        id: 'cost',
        accessor: 'method.estimatecost',
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
        accessor: 'method.synthesise',
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
                  method: row.original.method,
                  synthesise: checked
                })
              }
            />
          );
        }
      },
      ...new Array(maxNoSteps).fill(0).map((_, index) => {
        return {
          id: `reaction step ${index + 1}`,
          accessor: `reactions[${index}].reactionclass`,
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
          filter: filterByReactionName(index)
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
    adjustReactionSuccessRate
  ]);

  return columns;
};
