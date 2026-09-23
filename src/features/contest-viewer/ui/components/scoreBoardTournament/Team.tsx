import { TournamentTeamProps } from '@features/contest-viewer/domain/model/scoreboardUi.model';
import { Divider, Paper, Stack, Typography } from '@mui/material';
import { matchTeamStyle, scoreTournamentStyle } from '@shared/ui/styles/Style';
const Team = ({ team, scoreTeam }: TournamentTeamProps) => {
  return (
    <Stack sx={matchTeamStyle} direction="row" spacing={0} alignItems="center" justifyContent="end">
      <Typography variant="body1" sx={{ p: 1 }}>
        {team?.name}
      </Typography>
      <Paper elevation={5} sx={[scoreTournamentStyle]}>
        <Typography fontSize={26}>{scoreTeam}</Typography>
      </Paper>
      <Divider />
    </Stack>
  );
};

export default Team;
