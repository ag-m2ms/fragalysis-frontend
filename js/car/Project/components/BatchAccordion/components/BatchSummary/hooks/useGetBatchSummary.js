import { useGetMethodsForBatch } from '../../../../../../common/hooks/useGetMethodsForBatch';
import { useBatchContext } from '../../../../../hooks/useBatchContext';

export const useGetBatchSummary = () => {
  const batch = useBatchContext();

  const methodResults = useGetMethodsForBatch(batch.id);

  const methods = methodResults
    .map(result => result.data)
    .filter(method => !!method)
    .flat();

  const total = methods.length;
  const synthesise = methods.filter(method => method.synthesise).length;
  const ignore = methods.filter(method => !method.synthesise).length;

  return {
    total,
    synthesise,
    ignore
  };
};
