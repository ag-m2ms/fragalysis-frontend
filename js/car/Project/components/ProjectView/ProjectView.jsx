import React from 'react';
import { LoadingSpinner } from '../../../common/components/LoadingSpinner/LoadingSpinner';
import { BatchAccordion } from '../BatchAccordion';
import { useGetBatches } from './hooks/useGetBatches';
import { BatchContext } from '../../context/BatchContext';
import { useBatchesToDisplayStore } from '../../../common/stores/batchesToDisplayStore';
import { useCurrentProjectStore } from '../../../common/stores/currentProjectStore';

export const ProjectView = () => {
  const currentProject = useCurrentProjectStore();

  const { data: batches, isLoading } = useGetBatches(currentProject.id);

  const batchesToDisplay = useBatchesToDisplayStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      {batches
        ?.filter(batch => batchesToDisplay[batch.id])
        .map(batch => {
          return (
            <BatchContext.Provider key={batch.id} value={batch}>
              <BatchAccordion />
            </BatchContext.Provider>
          );
        })}
    </main>
  );
};
