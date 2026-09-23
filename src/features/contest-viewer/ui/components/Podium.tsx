import { ScoreboardPodiumProps } from '@features/contest-viewer/domain/model/scoreboardUi.model';
import { Box, Stack, Typography } from '@mui/material';
import { SubContest } from '@shared/model/SubContest';
import { notSkew, stageHeaderStyle } from '@shared/ui/styles/Style';
const Podium = ({ contest }: ScoreboardPodiumProps) => {
  return (
    <Stack spacing={7.5}>
      <Box sx={stageHeaderStyle}>
        <Typography variant="h3" sx={notSkew}>
          Podium
        </Typography>
      </Box>
      <Stack spacing={10}>
        {contest.winners[SubContest.PRINCIPALE] && (
          <Stack direction="row" justifyContent="space-around">
            <Stack spacing={3} justifyContent="center" alignItems="center">
              <img className="cupView2" src="/cups/second.svg" alt="logo" />
              <Typography variant="h3">
                {' '}
                {contest.winners[SubContest.PRINCIPALE].two.name}
              </Typography>
            </Stack>
            <Stack spacing={3} justifyContent="center" alignItems="center">
              <img className="cupView" src="/cups/first.svg" alt="logo" />
              <Typography variant="h3">
                {' '}
                {contest.winners[SubContest.PRINCIPALE].one.name}
              </Typography>
            </Stack>
            <Stack spacing={3} justifyContent="center" alignItems="center">
              <img className="cupView2" src="/cups/third.svg" alt="logo" />
              <Typography variant="h3">
                {' '}
                {contest.winners[SubContest.PRINCIPALE].three.name}
              </Typography>
            </Stack>
          </Stack>
        )}
        {contest.winners[SubContest.CONSOLANTE] && (
          <Stack>
            <Stack spacing={3} justifyContent="center" alignItems="center">
              <img className="cupView3" src="/cups/fourth.svg" alt="logo" />
              <Typography variant="h3">
                {' '}
                {contest.winners[SubContest.CONSOLANTE].one.name}
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default Podium;
