export const useBatchesNavigation = batches => {
  if (!batches) {
    return [];
  }

  return batches.map(batch => ({
    batch,
    children: []
  }));
};
