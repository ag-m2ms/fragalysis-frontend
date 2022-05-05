import React from 'react';
import {
  colors,
  Link,
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
import { DialogSection } from '../../../../../common/components/DialogSection';
import { DialogSectionHeading } from '../../../../../common/components/DialogSectionHeading';
import { useReactantProductTableColumns } from './hooks/useReactantProductTableColumns';
import { useTable, useSortBy } from 'react-table';

const useStyles = makeStyles(theme => ({
  table: {
    '& tr': {
      display: 'grid',
      alignItems: 'stretch',
      gap: `0 ${theme.spacing()}px`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      gridTemplateColumns: '3fr 6fr 2fr 2fr'
    },
    '& th, td': {
      display: 'grid',
      placeItems: 'center start',
      border: 0,
      padding: 0
    }
  },
  flexCell: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1 / 2)
  },
  sortIconInactive: {
    '& svg': {
      color: `${colors.grey[400]} !important`
    }
  }
}));

export const ReactantSection = ({ reactant, index }) => {
  const classes = useStyles();

  const reactantpubcheminfo = reactant.reactantpubcheminfo || {};

  const columns = useReactantProductTableColumns();

  const { getTableProps, headerGroups, getTableBodyProps, rows, prepareRow } = useTable(
    {
      columns,
      data: reactant.catalogentries
    },
    useSortBy
  );

  return (
    <DialogSection>
      <DialogSectionHeading>Reactant {index + 1}</DialogSectionHeading>
      <Typography>
        Smiles: <strong>{reactant.smiles}</strong>
      </Typography>
      {reactantpubcheminfo.cas && (
        <Typography>
          CAS number: <strong>{reactantpubcheminfo.cas}</strong>
        </Typography>
      )}
      {!!reactantpubcheminfo.compoundsummarylink && (
        <Link href={reactantpubcheminfo.compoundsummarylink} target="_blank" rel="noreferrer">
          PubChem compound summary
        </Link>
      )}
      {!!reactantpubcheminfo.lcsslink && (
        <Link href={reactantpubcheminfo.lcsslink} target="_blank" rel="noreferrer">
          Laboratory chemical safety summary
        </Link>
      )}

      {!!reactant.catalogentries.length && (
        <>
          <Typography>Catalog information: </Typography>
          <Table className={classes.table} {...getTableProps()}>
            <TableHead>
              {headerGroups.map(headerGroup => (
                <TableRow {...headerGroup.getHeaderGroupProps()} className={classes.row}>
                  {headerGroup.headers.map(column => {
                    if (column.canSort) {
                      // Title is unused
                      const { title, ...rest } = column.getSortByToggleProps();

                      return (
                        <Tooltip title={`Sort by ${column.sortLabel}`} {...column.getHeaderProps()}>
                          <TableCell {...rest}>
                            <div className={classes.flexCell}>
                              {column.render('Header')}
                              <TableSortLabel
                                className={!column.isSorted ? classes.sortIconInactive : undefined}
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
        </>
      )}
    </DialogSection>
  );
};
