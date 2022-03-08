import { useMemo } from 'react';
import { useGetTargets } from '../../../../common/hooks/useGetTargets';
import { useBatchContext } from '../../../hooks/useBatchContext';

export const useGetTableData = () => {
  const batch = useBatchContext();

  const { data: targets } = useGetTargets({ batch_id: batch.id, fetchall: 'yes' });

  const tableData = useMemo(() => {
    if (!targets) {
      return [];
    }

    return targets;
  }, [targets]);

  return tableData;
};
