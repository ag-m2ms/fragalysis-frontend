import React from 'react';
import {
  Checkbox,
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
import { useTable, useSortBy } from 'react-table';
import { IconComponent } from '../../../common/components/IconComponent';
import { FaFlask } from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { IoFootsteps } from 'react-icons/io5';
import { ImSad, ImSmile } from 'react-icons/im';
import { useSynthesiseMethod } from './hooks/useSynthesiseMethod';
import { useAdjustReactionSuccessRate } from './hooks/useAdjustReactionSuccessRate';

const useStyles = makeStyles(theme => ({
  table: {
    '& thead > tr': {
      paddingTop: theme.spacing(),
      paddingBottom: theme.spacing()
    },
    '& tr': {
      display: 'grid',
      gridTemplateColumns: ({ maxNoSteps }) => `60px 40px repeat(${maxNoSteps}, 338px)`,
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
  }
}));

export const MethodTable = ({ methodsWithReactions }) => {
  const maxNoSteps = Math.max(...methodsWithReactions.map(({ reactions }) => reactions.length));

  const classes = useStyles({ maxNoSteps });

  const { mutate: synthesiseMethod } = useSynthesiseMethod();
  const { mutate: adjustReactionSuccessRate } = useAdjustReactionSuccessRate();

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
        }
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
      data: methodsWithReactions
    },
    useSortBy
  );

  return (
    <Table className={classes.table} {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
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
                          active={column.isSorted}
                          // react-table has a unsorted state which is not treated here
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
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map(cell => (
                <TableCell className={classes.cell} {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
