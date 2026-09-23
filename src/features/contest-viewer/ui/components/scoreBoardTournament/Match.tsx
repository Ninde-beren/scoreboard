import { TournamentMatchProps } from '@features/contest-viewer/domain/model/scoreboardUi.model';
import { Box, Paper, Stack } from '@mui/material';
import { matchStyle, matchTeamDividerStyle } from '@shared/ui/styles/Style';

import Team from './Team';

const Match = ({ match }: TournamentMatchProps) => {
  return (
    <Paper sx={matchStyle}>
      <Stack key={match.id + '-match'} direction="column" justifyContent="center">
        <Team team={match.teamA} scoreTeam={match.scoreTeamA} />
        <Box sx={matchTeamDividerStyle} />
        <Team team={match.teamB} scoreTeam={match.scoreTeamB} />
      </Stack>
    </Paper>
  );
};

export default Match;
