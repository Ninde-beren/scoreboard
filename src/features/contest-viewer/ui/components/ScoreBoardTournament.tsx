import { ScoreboardTournamentProps } from '@features/contest-viewer/domain/model/scoreboardUi.model';
import { Box, Divider, Stack, Typography, Zoom } from '@mui/material';
import { useTimeouts } from '@shared/lib/useTimeouts';
import { Stage } from '@shared/model/Stage';
import { StageType } from '@shared/model/StageType';
import { SubContest } from '@shared/model/SubContest';
import TabPanel from '@shared/ui/components/TabPanel';
import { notSkew, stageHeaderStyle } from '@shared/ui/styles/Style';
import { useEffect, useState } from 'react';

import EditMatchScore from './scoreBoardTournament/EditMatchScore';

const ScoreBoardTournament = ({ contest }: ScoreboardTournamentProps) => {
  const { setSafeTimeout } = useTimeouts();
  const [value, setValue] = useState(0);
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    let innerTimeoutId: ReturnType<typeof setTimeout> | undefined;
    const outerTimeoutId = setSafeTimeout(() => {
      setChecked(false);
      innerTimeoutId = setSafeTimeout(() => {
        setValue((prev) => (prev === 1 ? 0 : prev + 1));
      }, 250);
    }, 20000);
    setChecked(true);
    return () => {
      if (innerTimeoutId !== undefined) clearTimeout(innerTimeoutId);
      clearTimeout(outerTimeoutId);
    };
  }, [setSafeTimeout, value]);

  return (
    <>
      {[SubContest.PRINCIPALE, SubContest.CONSOLANTE].map((subContest, index) => (
        <TabPanel key={index} value={value} index={index}>
          <Zoom in={checked} timeout={250}>
            <Box>
              <Box sx={[stageHeaderStyle, { mt: -5, mb: 5 }]}>
                <Typography variant="h3" sx={notSkew}>
                  {subContest}
                </Typography>
              </Box>
              <Stack direction="row" spacing={20}>
                {contest?.stages.map(
                  (stage: Stage, stageIndex: number) =>
                    stage.type !== StageType.POOL &&
                    stage.subContest === subContest && (
                      <Stack key={stageIndex + '-stage'} spacing={4} alignItems="center">
                        <Box sx={[stageHeaderStyle, { mt: 7, width: 285 }]}>
                          <Typography variant="h4" sx={notSkew}>
                            {stage?.type}
                          </Typography>
                        </Box>
                        <Stack spacing={2} alignItems="center">
                          <EditMatchScore stage={stage} />
                        </Stack>
                        <Divider />
                      </Stack>
                    )
                )}
              </Stack>
            </Box>
          </Zoom>
        </TabPanel>
      ))}
    </>
  );
};

export default ScoreBoardTournament;
