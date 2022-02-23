import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingSpinner } from '../LoadingSpinner';

export const SuspenseWithBoundary = ({ children, suspenseFallback, errorFallback }) => {
  return (
    <ErrorBoundary fallback={errorFallback ?? <></>}>
      <Suspense fallback={suspenseFallback ?? <LoadingSpinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
};
