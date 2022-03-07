/**
 * Creates a table filter. If a parent row is being iterated, check its children if they match the supplied rowFilter
 * function and if so, mark parent as to be returned. If there's no filter value or if it's an empty array return
 * all rows.
 */
export const createTableFilter = rowFilter => (rows, ids, filterValue) => {
  if (!filterValue || !filterValue.length) {
    return [...rows];
  }

  return (
    rows
      .filter(row => {
        if (row.depth === 0) {
          return row.subRows.some(subRow => rowFilter(subRow, ids, filterValue));
        }

        return rowFilter(row, ids, filterValue);
      })
      // A bug in the library results in loosing subRows when applying filtering. To avoid it a copy of each row
      // has to be returned from the filter method.
      .map(row => ({ ...row }))
  );
};
