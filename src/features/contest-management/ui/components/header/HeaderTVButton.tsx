import { HeaderTVButtonProps } from '@features/contest-management/domain/model/contestUi.model';
import { Button } from '@mui/material';
import { colors } from '@shared/ui/styles/colors';
import React from 'react';

const HeaderTVButton = ({ children, ...props }: HeaderTVButtonProps) => {
  return (
    <Button
      {...props}
      sx={{
        textTransform: 'none',
        fontWeight: 700,
        borderRadius: 2,
        px: 3,
        py: 1,
        backgroundColor: colors.orange,
        color: colors.white,
        '&:hover': { backgroundColor: colors.orange },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
};

export default HeaderTVButton;
