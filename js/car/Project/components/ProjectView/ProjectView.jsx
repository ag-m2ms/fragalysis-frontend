import React from 'react';
import { LoadingSpinner } from '../../../common/components/LoadingSpinner/LoadingSpinner';
import { BatchAccordion } from '../BatchAccordion';
import { useGetBatches } from './hooks/useGetBatches';
import { useProjectContext } from '../../../common/hooks/useProjectContext';
import { BatchContext } from '../../context/BatchContext';

export const ProjectView = () => {
  const { project } = useProjectContext();

  const { data: batches, isLoading } = useGetBatches(project.id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      {batches?.map((batch, index) => {
        return (
          <BatchContext.Provider key={batch.id} value={batch}>
            <BatchAccordion open={index === 0} />
          </BatchContext.Provider>
        );
      })}
    </main>
  );
};
