import { useGetTableData } from './hooks/useGetTableData';

/**
 * A component which preloads data for TargetTable component. Serves as performance optimization.
 */
export const BatchTableDataLoader = ({ children }) => {
  const { tableData, isLoading } = useGetTableData();

  return children({ tableData, isLoading });
};
