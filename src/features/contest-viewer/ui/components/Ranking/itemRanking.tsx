import { ItemRankingProps } from '@features/contest-viewer/domain/model/scoreboardUi.model';
import { Avatar, Box, Paper, Stack, Typography } from '@mui/material';
import { TEAM_COLORS } from '@shared/model/teamColor';
import { avatarStyle, itemListStyle, scoreStyle } from '@shared/ui/styles/Style';
const ItemRanking = ({ team, index }: ItemRankingProps) => {
  return (
    <Paper sx={[itemListStyle, { width: 385 }]} elevation={5}>
      <Stack
        key={index + '-match'}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Stack
          sx={{ width: '-webkit-fill-available' }}
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={2}
        >
          <Avatar
            sx={[avatarStyle, { backgroundColor: TEAM_COLORS[team.color].code, left: '-23px' }]}
          >
            <Box
              sx={{
                backgroundColor: TEAM_COLORS[team.color].code,
                width: '100%',
                height: '100%',
              }}
            />
          </Avatar>
          <Typography sx={{ width: '100px' }}>{team?.name}</Typography>
        </Stack>
        <Paper elevation={5} sx={scoreStyle}>
          <Typography variant="h5">{team.score ? team.score : 0}</Typography>
        </Paper>
      </Stack>
    </Paper>
  );
};
export default ItemRanking;
