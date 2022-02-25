import { useQueries } from 'react-query';
import { useDeepCompareMemoize } from 'use-deep-compare-effect';
// This breaks the encapsulation of files but it hides a suspense mechanism nobody should tinker with or use anywhere else
import { useLegacySuspenseWithBoundary } from '../components/SuspenseWithBoundary/hooks/useLegacySuspenseWithBoundary';

/**
 * useQueries doesn't support Suspense yet. Use this hook instead.
 */
export const useSuspendedQueries = queries => {
  useLegacySuspenseWithBoundary(queries);
  return useDeepCompareMemoize(useQueries(queries));
};
