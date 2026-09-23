import { EventTabsProps } from '@features/contest-management/domain/model/contestUi.model';
import { Button, Stack } from '@mui/material';
import { colors } from '@shared/ui/styles/colors';
import React from 'react';

const EventTabs = ({ value, items, onChange }: EventTabsProps) => {
  return (
    <Stack direction="row" spacing={2}>
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <Button
            key={item.value}
            disabled={item.disabled}
            onClick={onChange ? () => onChange(item.value) : undefined}
            sx={{
              textTransform: 'uppercase',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1.2,
              backgroundColor: isActive ? colors.blueDark : colors.blue,
              color: colors.white,
              opacity: item.disabled ? 0.5 : 1,
              '&:hover': { backgroundColor: colors.blueDark },
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );
};

export default EventTabs;
