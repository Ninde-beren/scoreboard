import { HeaderBarProps } from '@features/contest-management/domain/model/contestUi.model';
import { Box, Stack } from '@mui/material';
import { colors } from '@shared/ui/styles/colors';
import { spacing } from '@shared/ui/styles/spacing';
import React from 'react';

const HeaderBar = ({ left, center, right }: HeaderBarProps) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      width="100%"
      justifyContent="space-between"
      sx={{
        minHeight: spacing.headerHeight,
        px: spacing.headerPaddingX,
        py: spacing.headerPaddingY,
        backgroundColor: colors.red,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {left}
      </Stack>
      <Box>{center}</Box>
      <Stack direction="row" spacing={2} alignItems="center">
        {right}
      </Stack>
    </Stack>
  );
};

export default HeaderBar;
