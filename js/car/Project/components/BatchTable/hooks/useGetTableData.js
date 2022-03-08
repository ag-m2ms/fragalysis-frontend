import { useMemo } from 'react';
import { useGetTargetsForBatch } from '../../../../common/hooks/useGetTargetsForBatch';
import { useBatchContext } from '../../../hooks/useBatchContext';

export const useGetTableData = () => {
  const batch = useBatchContext();

  const { data: targets } = useGetTargetsForBatch(batch.id);

  const tableData = useMemo(() => {
    if (!targets) {
      return [];
    }

    return targets;
  }, [targets]);

  return tableData;
};
