import { useMemo } from 'react';
import { useGetBatches } from '../../../../../../common/hooks/useGetBatches';
import { useCurrentProjectStore } from '../../../../../../common/stores/currentProjectStore';
import { useSuspendingQueries } from '../../../../../../common/hooks/useSuspendingQueries';
import { getTargetsQueryKey } from '../../../../../../common/api/targetsQueryKeys';
import { axiosGet } from '../../../../../../common/utils/axiosFunctions';

export const useGetIncompatibleTargets = selectedBatchesMap => {
  const currentProject = useCurrentProjectStore.useCurrentProject();
  const { data: batches } = useGetBatches({ project_id: currentProject.id });

  const allTargetsResponses = useSuspendingQueries(
    useMemo(
      () =>
        batches.map(batch => {
          const queryKey = getTargetsQueryKey({ batch_id: batch.id, fetchall: 'yes' });

          return {
            queryKey,
            queryFn: () => axiosGet(queryKey)
          };
        }),
      [batches]
    )
  );

  const allSelectedTargets = allTargetsResponses
    .map((response, index) => ({ batch: batches[index], response }))
    .filter((_, index) => !!selectedBatchesMap[batches[index].id])
    .filter(({ response }) => response.isSuccess)
    .map(({ batch, response }) => ({ batch, targets: response.data }));

  const incompatibleTargets = allSelectedTargets
    .map(({ batch, targets }) => ({
      batch,
      targets: targets.filter(target => target.methods.every(method => !method.otchem))
    }))
    .filter(({ targets }) => !!targets.length);

  return incompatibleTargets;
};
