import React, { memo, useCallback, useLayoutEffect } from 'react';
import {
  Checkbox,
  colors,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography
} from '@material-ui/core';
import { useMemo } from 'react';
import { useTable, useSortBy, useExpanded, useRowSelect, useFilters } from 'react-table';
import { IconComponent } from '../../../common/components/IconComponent';
import { FaFlask } from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { IoFootsteps } from 'react-icons/io5';
import { ImSad, ImSmile } from 'react-icons/im';
import { useSynthesiseMethod } from './hooks/useSynthesiseMethod';
import { useAdjustReactionSuccessRate } from './hooks/useAdjustReactionSuccessRate';
import { TargetRow } from './components/TargetRow';
import { setFilters, setRowsSelected, useBatchesTableStateStore } from '../../../common/stores/batchesTableStateStore';
import { useBatchContext } from '../../hooks/useBatchContext';
import { TableToolbar } from './components/TableToolbar';
import { AutocompleteFilter } from './components/AutocompleteFilter/AutocompleteFilter';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    width: '100%'
  },
  table: {
    display: 'grid',
    overflowX: 'auto',
    '& tr': {
      display: 'grid',
      alignItems: 'stretch',
      gap: `0 ${theme.spacing()}px`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    '& th, td': {
      display: 'grid',
      placeItems: 'center',
      border: 0,
      padding: 0
    }
  },
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
  row: {
    gridTemplateColumns: ({ maxNoSteps }) => {
      if (!maxNoSteps) {
        return '40px 60px 40px';
      }
      return `40px 60px 40px repeat(${maxNoSteps}, 338px)`;
    }
  },
  sortIconInactive: {
    '& svg': {
      color: `${colors.grey[400]} !important`
    }
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

const filterByReactionName = index => (rows, ids, filterValue) => {
  if (!filterValue || !filterValue.length) {
    return [...rows];
  }

  return (
    rows
      .filter(row => {
        const { original, depth } = row;
        if (depth === 0) {
          return original.subRows.some(subRow => {
            const reactionClass = subRow.reactions[index]?.reactionclass;
            return filterValue.includes(reactionClass);
          });
        }

        const reactionClass = original.reactions[index]?.reactionclass;
        return filterValue.includes(reactionClass);
      })
      // A bug in the library results in loosing subRows when applying filtering. To avoid it a copy of each row
      // has to be returned from the filter method.
      .map(row => ({ ...row }))
  );
};

export const BatchTable = memo(({ tableData }) => {
  const { mutate: synthesiseMethod } = useSynthesiseMethod();
  const { mutate: adjustReactionSuccessRate } = useAdjustReactionSuccessRate();

  const batch = useBatchContext();

  const expanded = useBatchesTableStateStore(useCallback(state => state.expanded[batch.id] || {}, [batch.id]));
  const selected = useBatchesTableStateStore(useCallback(state => state.selected[batch.id] || {}, [batch.id]));
  const filters = useBatchesTableStateStore(useCallback(state => state.filters[batch.id] || [], [batch.id]));

  const maxNoSteps = Math.max(
    ...tableData
      .map(({ subRows }) => {
        if (subRows.length) {
          return subRows.map(({ reactions }) => reactions.length);
        }
        return 0;
      })
      .flat()
  );

  const classes = useStyles({ maxNoSteps });

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

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      getRowId: useCallback((row, relativeIndex, parent) => {
        const rowId = !parent ? row.target.id : row.method.id;
        return parent ? [parent.id, rowId].join('.') : String(rowId);
      }, []),
      initialState: { expanded, selectedRowIds: selected, filters }
    },
    useFilters,
    useSortBy,
    useExpanded,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps, flatRows, isAllRowsSelected }) => {
            const { onChange, ...rest } = getToggleAllRowsSelectedProps();

            return (
              <Checkbox
                {...rest}
                onChange={event => {
                  onChange(event);
                  setRowsSelected(
                    batch.id,
                    flatRows.filter(row => row.depth === 1),
                    !isAllRowsSelected
                  );
                }}
              />
            );
          },
          Cell: ({ row }) => {
            const { onChange, ...rest } = row.getToggleRowSelectedProps();

            return (
              <Checkbox
                {...rest}
                onClick={event => event.stopPropagation()}
                onChange={event => {
                  onChange(event);
                  // If this is a target row, select only its subRows
                  setRowsSelected(batch.id, row.depth === 0 ? row.subRows : [row], !row.isSelected);
                }}
              />
            );
          }
        },
        ...columns
      ]);
    }
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, state } = tableInstance;

  useLayoutEffect(() => {
    setFilters(batch.id, state.filters);
  }, [batch.id, state.filters]);

  return (
    <div className={classes.root}>
      <TableToolbar tableInstance={tableInstance} />
      <Table className={classes.table} {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()} className={classes.row}>
              {headerGroup.headers.map(column => {
                if (column.canSort) {
                  // Title is unused
                  const { title, ...rest } = column.getSortByToggleProps();

                  return (
                    <Tooltip title={`Sort by ${column.id}`} {...column.getHeaderProps()}>
                      <TableCell {...rest}>
                        <div className={classes.flexCell}>
                          {column.render('Header')}
                          <TableSortLabel
                            className={!column.isSorted && classes.sortIconInactive}
                            active={true}
                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                          />
                        </div>
                      </TableCell>
                    </Tooltip>
                  );
                }
                return <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>;
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);

            if (row.depth === 0) {
              return <TargetRow {...row.getRowProps()} row={row} />;
            }

            return (
              <TableRow {...row.getRowProps()} className={classes.row}>
                {row.cells.map(cell => (
                  <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
});

BatchTable.displayName = 'BatchTable';
