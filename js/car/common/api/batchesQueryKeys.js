export const getBatchesQueryKey = params => ['/batches/', params];

export const createSubBatchKey = () => '/batches/';

export const deleteBatchKey = batchId => `/batches/${batchId}/`;
