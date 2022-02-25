import React from 'react';
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
import { useTable, useSortBy, useExpanded, useRowSelect } from 'react-table';
import { IconComponent } from '../../../common/components/IconComponent';
import { FaFlask } from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { IoFootsteps } from 'react-icons/io5';
import { ImSad, ImSmile } from 'react-icons/im';
import { useSynthesiseMethod } from './hooks/useSynthesiseMethod';
import { useAdjustReactionSuccessRate } from './hooks/useAdjustReactionSuccessRate';
import { TargetRow } from './components/TargetRow/TargetRow';
import { useTableExpandedState } from './hooks/useTableExpandedState';
import { useGetTableData } from './hooks/useGetTableData';

const useStyles = makeStyles(theme => ({
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
  }
}));

export const TargetTable = () => {
  const { mutate: synthesiseMethod } = useSynthesiseMethod();
  const { mutate: adjustReactionSuccessRate } = useAdjustReactionSuccessRate();

  const { expandedState, updateExpandedState } = useTableExpandedState();

  const tableData = useGetTableData();

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
        accessor: 'method.estimatecost',
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
          accessor: `reactions[${index}].reactionimage`,
          disableSortBy: true,
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
                <img src={value} width={270} height={60} />
                <IconButton size="small" onClick={() => adjustReactionSuccessRate({ reaction, successrate: 0.6 })}>
                  <IconComponent Component={ImSmile} />
                </IconButton>
                <IconButton size="small" onClick={() => adjustReactionSuccessRate({ reaction, successrate: 0.4 })}>
                  <IconComponent Component={ImSad} />
                </IconButton>
              </div>
            );
          }
        };
      })
    ];
  }, [maxNoSteps, classes.text, classes.flexCell, synthesiseMethod, adjustReactionSuccessRate]);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data: tableData,
      initialState: { expanded: expandedState }
    },
    useSortBy,
    useExpanded,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => <Checkbox {...getToggleAllRowsSelectedProps()} />,
          Cell: ({ row }) => (
            <Checkbox {...row.getToggleRowSelectedProps()} onClick={event => event.stopPropagation()} />
          )
        },
        ...columns
      ]);
    }
  );

  return (
    <Table className={classes.table} {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()} className={classes.row}>
            {headerGroup.headers.map(column => {
              if (column.canSort) {
                // Title is unused
                const { title, ...rest } = column.getSortByToggleProps();

                return (
                  <Tooltip title="Sort by cost" {...column.getHeaderProps()}>
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
            return <TargetRow {...row.getRowProps()} row={row} updateExpandedState={updateExpandedState} />;
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
  );
};
