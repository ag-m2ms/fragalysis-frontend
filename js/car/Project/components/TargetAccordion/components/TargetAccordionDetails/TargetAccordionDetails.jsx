import React from 'react';
import { useTargetContext } from '../../../../hooks/useTargetContext';
import { useGetMethodsWithReactions } from './hooks/useGetMethodsWithReactions';
import { LoadingSpinner } from '../../../../../common/components/LoadingSpinner';
import { MethodTable } from '../../../MethodTable';

export const TargetAccordionDetails = () => {
  const target = useTargetContext();

  const { methodsWithReactions, isLoading, isError } = useGetMethodsWithReactions(target.id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return null;
  }

  return <MethodTable methodsWithReactions={methodsWithReactions} />;
};
