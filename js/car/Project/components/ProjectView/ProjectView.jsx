import React from 'react';
import { BatchAccordion } from '../BatchAccordion';
import { BatchContext } from '../../context/BatchContext';
import { useBatchesToDisplayStore } from '../../../common/stores/batchesToDisplayStore';
import { useCurrentProjectStore } from '../../../common/stores/currentProjectStore';
import { useGetBatches } from '../../../common/hooks/useGetBatches';

export const ProjectView = () => {
  const currentProject = useCurrentProjectStore.useCurrentProject();

  const { data: batches } = useGetBatches(currentProject.id);

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
