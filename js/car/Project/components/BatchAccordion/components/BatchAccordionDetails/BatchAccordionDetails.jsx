import React from 'react';
import { useBatchContext } from '../../../../hooks/useBatchContext';
import { useGetTargets } from './hooks/useGetTargets';
import { TargetTable } from '../../../TargetTable';

export const BatchAccordionDetails = () => {
  const batch = useBatchContext();

  const { data: targets } = useGetTargets(batch.id);

  return <TargetTable targets={targets} />;
};
