import { useGetTableData } from './hooks/useGetTableData';

/**
 * A component which preloads data for TargetTable component. Serves as performance optimization.
 */
export const TargetTableDataLoader = ({ children }) => {
  const { tableData, isLoading } = useGetTableData();

  return children({ tableData, isLoading });
};
