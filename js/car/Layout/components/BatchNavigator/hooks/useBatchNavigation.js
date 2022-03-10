import { useGetBatches } from '../../../../common/hooks/useGetBatches';
import { useCurrentProjectStore } from '../../../../common/stores/currentProjectStore';

export const useBatchNavigation = () => {
  const currentProject = useCurrentProjectStore.useCurrentProject();

  const { data: batches } = useGetBatches({ project_id: currentProject.id });

  if (!batches) {
    return [];
  }

  const mappedNodes = {};
  const parentNodes = [];
  batches.forEach(batch => {
    const node = { batch, children: [] };
    mappedNodes[batch.id] = node;

    if (batch.batch_id) {
      mappedNodes[batch.batch_id].children.push(node);
    } else {
      parentNodes.push(node);
    }
  });

  console.log(parentNodes);
  return parentNodes;
};
