export const useBatchesNavigation = batches => {
  if (!batches) {
    return [];
  }

  return batches.map(batch => ({
    id: String(batch.id),
    name: batch.batch_tag,
    batch,
    children: batches.map(batch => ({
      id: String(batch.id) + 'a',
      name: batch.batch_tag,
      batch,
      children: batches.map(batch => ({
        id: String(batch.id) + 'b',
        name: batch.batch_tag,
        batch
      }))
    }))
  }));
};
