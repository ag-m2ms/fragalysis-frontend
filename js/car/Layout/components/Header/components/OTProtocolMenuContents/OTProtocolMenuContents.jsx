import { MenuItem } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useGetOtProtocols } from '../../../../../common/hooks/useGetOtProtocols';
import { useGetProjects } from '../../../../../common/hooks/useGetProjects';
import { useCurrentProjectStore } from '../../../../../common/stores/currentProjectStore';

export const OTProtocolMenuContents = ({ onSelected }) => {
  const currentProject = useCurrentProjectStore.useCurrentProject();

  const { data: otProtocols } = useGetOtProtocols({ project_id: currentProject.id });

  const uniqueProtocols = useMemo(() => {
    if (!otProtocols) {
      return [];
    }

    return [...otProtocols.reduce((uniqueSet, otProtocol) => uniqueSet.add(otProtocol.celery_task_id), new Set())];
  }, [otProtocols]);

  return !!uniqueProtocols.length ? (
    uniqueProtocols.map(taskId => {
      return (
        <MenuItem key={taskId} onClick={() => onSelected(taskId)}>
          {taskId}
        </MenuItem>
      );
    })
  ) : (
    <MenuItem disabled>There are no OT protocols</MenuItem>
  );
};
