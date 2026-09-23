import { Avatar, Box, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { Match } from '@shared/model/Match';
import { TEAM_COLORS } from '@shared/model/teamColor';
import { avatarStyle, leftStyle, rightStyle, scoreItemListStyle } from '@shared/ui/styles/Style';

type MatchRowContentProps = {
  match: Match;
  scoreSx?: SxProps<Theme>;
  teamStackWidth?: number | string;
};

const MatchRowContent = ({ match, scoreSx, teamStackWidth = 375 }: MatchRowContentProps) => {
  const scoreStyles: SxProps<Theme> = scoreSx
    ? [scoreItemListStyle, ...(Array.isArray(scoreSx) ? scoreSx : [scoreSx])]
    : scoreItemListStyle;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={scoreStyles}>
        <Typography variant="h5">{match.scoreTeamA}</Typography>
      </Box>
      <Stack
        sx={{ width: teamStackWidth }}
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Avatar sx={[avatarStyle, leftStyle]}>
          <Box
            sx={{
              backgroundColor: TEAM_COLORS[match.teamA.color].code,
              width: '100%',
              height: '100%',
            }}
          />
        </Avatar>
        <Typography sx={{ width: '100px' }}>{match?.teamA?.name}</Typography>
        <Typography variant="body1">VS</Typography>
        <Typography sx={{ width: '100px' }}>{match?.teamB?.name}</Typography>
        <Avatar sx={[avatarStyle, rightStyle]}>
          <Box
            sx={{
              backgroundColor: TEAM_COLORS[match.teamB.color].code,
              width: '100%',
              height: '100%',
            }}
          />
        </Avatar>
      </Stack>
      <Box sx={scoreStyles}>
        <Typography variant="h5">{match.scoreTeamB}</Typography>
      </Box>
    </Stack>
  );
};

export default MatchRowContent;
