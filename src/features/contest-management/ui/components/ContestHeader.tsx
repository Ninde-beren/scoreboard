import MatchOutPoolGenerator from '@features/contest-management/application/utils/MatchOutPoolGenerator';
import PoolGenerator from '@features/contest-management/application/utils/PoolGenerator';
import {
  ContestHeaderProps,
  ViewMode,
} from '@features/contest-management/domain/model/contestView.model';
import EventTabs from '@features/contest-management/ui/components/header/EventTabs';
import HeaderBar from '@features/contest-management/ui/components/header/HeaderBar';
import HeaderButton from '@features/contest-management/ui/components/header/HeaderButton';
import HeaderTVButton from '@features/contest-management/ui/components/header/HeaderTVButton';
import { Stack } from '@mui/material';
import React from 'react';

import TvModeDialog from './TvModeDialog';

const ContestHeader = ({
  tabs,
  onTabChange,
  tvModes,
  onReset,
  onOpenWindow,
  onSelectViewerPage,
  view,
  setView,
  contest,
}: ContestHeaderProps) => {
  const [tvOpen, setTvOpen] = React.useState(false);

  return (
    <>
      <Stack direction="row" spacing={2}>
        <HeaderBar
          left={
            <Stack direction="column" spacing={2}>
              <HeaderButton
                onClick={onOpenWindow}
                sx={{ fontSize: 20, px: 4, py: 1, borderRadius: 4 }}
              >
                open Window
              </HeaderButton>
              <HeaderButton onClick={onReset} sx={{ fontSize: 20, px: 4, py: 1, borderRadius: 4 }}>
                Reset
              </HeaderButton>
            </Stack>
          }
          center={
            <EventTabs
              value={tabs.find((tab) => tab.selected)?.value ?? 'team'}
              items={tabs}
              onChange={(v) => onTabChange(v as ViewMode)}
            />
          }
          right={
            <>
              <HeaderTVButton
                onClick={() => setTvOpen(true)}
                sx={{ fontSize: 22, px: 6, py: 2, borderRadius: 4 }}
              >
                TV
              </HeaderTVButton>
              <Stack direction="row" spacing={2} padding={2} justifyContent="space-evenly">
                {view[1] && <PoolGenerator contest={contest} nextStep={setView} />}
                {view[2] && view[0] === 'pool' && (
                  <MatchOutPoolGenerator step={view} nextStep={setView} />
                )}
              </Stack>
            </>
          }
        />
      </Stack>

      <TvModeDialog
        open={tvOpen}
        onClose={() => setTvOpen(false)}
        onSelect={onSelectViewerPage}
        actions={tvModes}
      />
    </>
  );
};

export default ContestHeader;
