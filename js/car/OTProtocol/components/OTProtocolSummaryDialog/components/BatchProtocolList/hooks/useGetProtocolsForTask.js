import { useMemo } from 'react';
import { useGetBatches } from '../../../../../../common/hooks/useGetBatches';
import { useGetOtProtocols } from '../../../../../../common/hooks/useGetOtProtocols';
import { useCurrentProjectStore } from '../../../../../../common/stores/currentProjectStore';

export const useGetProtocolsForTask = taskId => {
  const currentProject = useCurrentProjectStore.useCurrentProject();

  const { data: batches } = useGetBatches({ project_id: currentProject.id });
  const { data: otProtocols } = useGetOtProtocols({ project_id: currentProject.id, celery_task_id: taskId });

  return useMemo(() => {
    if (!batches || !otProtocols) {
      return [];
    }

    return otProtocols.map(otProtocol => ({
      otProtocol,
      batch: batches.find(batch => batch.id === otProtocol.batch_id)
    }));
  }, [batches, otProtocols]);
};
