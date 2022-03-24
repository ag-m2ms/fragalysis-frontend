import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { CategoryMenu } from '../CategoryMenu';
import { OTProtocolMenuContents } from '../OTProtocolMenuContents';
import { OTProtocolSummaryDialog } from '../../../../../OTProtocol';
import { requestOtProtocolSummary } from '../../../../../common/stores/otProtocolSummaryDialogStore';

export const OTProtocolHistoryButton = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  return (
    <>
      <Button onClick={event => setMenuAnchorEl(event.currentTarget)}>OT protocol history</Button>
      <CategoryMenu id="ot-protocol-history-menu" anchorEl={menuAnchorEl} onClose={() => setMenuAnchorEl(null)}>
        <OTProtocolMenuContents
          onSelected={otProtocol => {
            setMenuAnchorEl(null);
            requestOtProtocolSummary(otProtocol);
          }}
        />
      </CategoryMenu>

      <OTProtocolSummaryDialog />
    </>
  );
};
