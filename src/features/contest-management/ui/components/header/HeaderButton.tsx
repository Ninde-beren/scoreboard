import { HeaderButtonProps } from '@features/contest-management/domain/model/contestUi.model';
import { Button } from '@mui/material';
import { colors } from '@shared/ui/styles/colors';
import React from 'react';

const HeaderButton = ({ children, ...props }: HeaderButtonProps) => {
  return (
    <Button
      {...props}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        px: 3,
        py: 1,
        backgroundColor: colors.white,
        color: colors.blueDark,
        '&:hover': { backgroundColor: colors.white },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
};

export default HeaderButton;
