import React from 'react';
import { BatchAccordion } from '../BatchAccordion';
import { BatchContext } from '../../context/BatchContext';
import { useBatchesToDisplayStore } from '../../../common/stores/batchesToDisplayStore';
import { useCurrentProjectStore } from '../../../common/stores/currentProjectStore';
import { useGetBatchesForProject } from '../../../common/hooks/useGetBatchesForProject';

export const ProjectView = () => {
  const currentProject = useCurrentProjectStore.useCurrentProject();

  const { data: batches } = useGetBatchesForProject(currentProject.id);

  const batchesToDisplay = useBatchesToDisplayStore.useBatchesToDisplay();

  return (
    <>
      {batches
        ?.filter(batch => batchesToDisplay[batch.id])
        .map(batch => {
          return (
            <BatchContext.Provider key={batch.id} value={batch}>
              <BatchAccordion />
            </BatchContext.Provider>
          );
        })}
    </>
  );
};
