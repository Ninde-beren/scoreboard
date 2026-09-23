import { TvModeActionButtonProps } from '@features/contest-management/domain/model/contestUi.model';
import { Button } from '@mui/material';
import React from 'react';

const ActionButton = ({ label, value, onSelect, onClose }: TvModeActionButtonProps) => {
  return (
    <Button
      onClick={() => {
        onSelect(value);
        onClose();
      }}
      sx={{
        width: 300,
        backgroundColor: '#F39A3D',
        color: '#fff',
        fontWeight: 800,
        fontSize: 28,
        borderRadius: 4,
        px: 6,
        py: 3,
        textTransform: 'none',
        '&:hover': { backgroundColor: '#ec7e0b' },
      }}
    >
      {label}
    </Button>
  );
};

export default ActionButton;
