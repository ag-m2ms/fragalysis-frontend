import React from 'react';
import { useBatchContext } from '../../../../hooks/useBatchContext';
import { useGetTargets } from './hooks/useGetTargets';
import { LoadingSpinner } from '../../../../../common/components/LoadingSpinner';
import { TargetTable } from '../../../TargetTable';

export const BatchAccordionDetails = () => {
  const batch = useBatchContext();

  const { data: targets, isLoading } = useGetTargets(batch.id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <TargetTable targets={targets} />;
};
