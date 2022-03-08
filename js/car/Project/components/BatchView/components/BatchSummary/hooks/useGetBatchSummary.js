import { useGetTargetsForBatch } from '../../../../../../common/hooks/useGetTargetsForBatch';
import { useBatchContext } from '../../../../../hooks/useBatchContext';

export const useGetBatchSummary = () => {
  const batch = useBatchContext();

  const { data: targets } = useGetTargetsForBatch(batch.id);

  const methods = targets?.map(({ methods }) => methods).flat() || [];

  const total = methods.length;
  const synthesise = methods.filter(method => method.synthesise).length;
  const ignore = methods.filter(method => !method.synthesise).length;

  return {
    total,
    synthesise,
    ignore
  };
};
