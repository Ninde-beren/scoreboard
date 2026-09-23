import Podium from '@features/contest-viewer/ui/components/Podium';
import Ranking from '@features/contest-viewer/ui/components/Ranking';
import ScoreboardPools from '@features/contest-viewer/ui/components/ScoreboardPools';
import ScoreBoardTournament from '@features/contest-viewer/ui/components/ScoreBoardTournament';
import TeamBuilding from '@features/contest-viewer/ui/components/TeamBuilding';
import { Box, Stack, Typography } from '@mui/material';
import { safeJsonParse } from '@shared/lib/utils';
import { Contest } from '@shared/model/Contest';
import { StageType } from '@shared/model/StageType';
import TabPanel from '@shared/ui/components/TabPanel';
import React, { useCallback, useEffect, useRef } from 'react';

import { buildScoreViewerVM } from './scoreViewer.vm';

const ScoreViewer = () => {
  const [loading, setLoading] = React.useState(true);
  const [value, setValue] = React.useState(1);

  const [contest, setContest] = React.useState<Contest | false>(false);

  const readViewerPage = useCallback(() => {
    const storedValue = localStorage.getItem('viewerPage');
    const parsed = Number(storedValue);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, []);

  const readContest = useCallback(
    () => safeJsonParse<Contest | false>(localStorage.getItem('contest'), false),
    []
  );

  // enlever les pub si don --> IP + adresse mail + code
  const onStorageUpdate = useCallback(
    (e: StorageEvent) => {
      const { key, newValue } = e;
      if (key === 'contest') {
        setContest(safeJsonParse<Contest | false>(newValue, false));
      }
      if (key === 'viewerPage') {
        setValue(readViewerPage());
      }
    },
    [readViewerPage]
  );

  useEffect(() => {
    setContest(readContest());
    setValue(readViewerPage());
    window.addEventListener('storage', onStorageUpdate);
    return () => {
      window.removeEventListener('storage', onStorageUpdate);
    };
  }, [onStorageUpdate, readContest, readViewerPage]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const vm = buildScoreViewerVM({ contest, loading, value });
  const finalMatches = contest
    ? contest.stages
        .filter((stage) => stage.type === StageType.FINAL)
        .flatMap((stage) => stage.matchs ?? [])
        .filter((match: any) => typeof match !== 'number')
    : [];
  const autoPodium =
    finalMatches.length > 0 &&
    finalMatches.every((match: any) => {
      if (typeof match.scoreTeamA !== 'number' || typeof match.scoreTeamB !== 'number') {
        return false;
      }
      return match.scoreTeamA !== 0 || match.scoreTeamB !== 0;
    });
  const autoPodiumTriggered = useRef(false);
  const contestId = contest ? contest.id : 0;

  useEffect(() => {
    autoPodiumTriggered.current = false;
  }, [contestId]);

  useEffect(() => {
    if (!autoPodium || autoPodiumTriggered.current) return;
    if (value !== 4) {
      localStorage.setItem('viewerPage', '4');
      setValue(4);
    }
    autoPodiumTriggered.current = true;
  }, [autoPodium, value]);

  if (!vm.hasContest || !contest) {
    return (
      <Stack sx={{ height: '100vh' }} justifyContent="center">
        <Typography variant="h2">Le concours n'est pas encore démarrer !</Typography>
      </Stack>
    );
  }

  return (
    <>
      <Box sx={{ p: 1, backgroundColor: '#C32533' }}>
        <Typography variant="h2" fontWeight="bold">
          {contest?.name}
        </Typography>
      </Box>
      <Stack justifyContent="center" alignItems="center" spacing={1}>
        {!vm.isLoading ? (
          <>
            <TabPanel value={vm.activeTab} index={0}>
              <TeamBuilding contest={contest} />
            </TabPanel>
            <TabPanel value={vm.activeTab} index={1}>
              <ScoreboardPools contest={contest} />
            </TabPanel>
            <TabPanel value={vm.activeTab} index={2}>
              <ScoreBoardTournament contest={contest} />
            </TabPanel>
            <TabPanel value={vm.activeTab} index={3}>
              <Ranking contest={contest} />
            </TabPanel>
            <TabPanel value={vm.activeTab} index={4}>
              <Podium contest={contest} />
            </TabPanel>
          </>
        ) : (
          <Box marginTop={30}>
            <img className="logo" width={500} src="/sit_character.png" alt="logo" />
          </Box>
        )}
      </Stack>
    </>
  );
};
export default ScoreViewer;
