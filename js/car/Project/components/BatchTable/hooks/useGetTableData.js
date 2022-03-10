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

    // There's a bug in react-table library which prevents subRows from being selected when parent is being selected if
    // the subRows aren't located in the subRows field.
    return targets.map(target => {
      const { methods, ...rest } = target;
      return { ...rest, subRows: methods };
    });
  }, [targets]);

  return tableData;
};
