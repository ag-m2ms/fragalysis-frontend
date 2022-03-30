import { MenuItem } from '@material-ui/core';
import React from 'react';
import { useGetOtProtocols } from '../../../../../common/hooks/useGetOtProtocols';
import { useCurrentProjectStore } from '../../../../../common/stores/currentProjectStore';

export const OTProtocolMenuContents = ({ onSelected }) => {
  const currentProject = useCurrentProjectStore.useCurrentProject();

  const { data: otProtocols } = useGetOtProtocols({ project_id: currentProject.id });

  return !!otProtocols.length ? (
    otProtocols.map(otProtocol => {
      return (
        <MenuItem key={otProtocol.id} onClick={() => onSelected(otProtocol)}>
          {otProtocol.name}
        </MenuItem>
      );
    })
  ) : (
    <MenuItem disabled>There are no OT protocols</MenuItem>
  );
};
