import { TvModeDialogProps } from '@features/contest-management/domain/model/contestView.model';
import { Box, Dialog, Stack } from '@mui/material';
import React from 'react';

import ActionButton from './tvModeDialog/ActionButton';

const TvModeDialog = ({ open, onClose, onSelect, actions }: TvModeDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" sx={{ borderRadius: 20 }}>
      <Box sx={{ backgroundColor: '#5B9BD5', p: 4, borderRadius: 20 }}>
        <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
          {actions.slice(0, 2).map((action) => (
            <ActionButton
              key={action.value}
              label={action.label}
              value={action.value}
              onSelect={onSelect}
              onClose={onClose}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={3}>
          {actions.slice(2, 4).map((action) => (
            <ActionButton
              key={action.value}
              label={action.label}
              value={action.value}
              onSelect={onSelect}
              onClose={onClose}
            />
          ))}
        </Stack>
        {actions.length > 4 && (
          <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
            {actions.slice(4).map((action) => (
              <ActionButton
                key={action.value}
                label={action.label}
                value={action.value}
                onSelect={onSelect}
                onClose={onClose}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Dialog>
  );
};

export default TvModeDialog;
