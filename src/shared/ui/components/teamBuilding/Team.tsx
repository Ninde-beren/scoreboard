import { Avatar, Box, Typography } from '@mui/material';
import { TeamBuildingTeamProps } from '@shared/domain/model/sharedUi.model';
import { TEAM_COLORS } from '@shared/model/teamColor';
import { avatarStyle, teamBodyStyle, teamHeaderStyle } from '@shared/ui/styles/Style';

import Member from './Member';

const Team = ({ team }: TeamBuildingTeamProps) => {
  return (
    <>
      <Box sx={teamHeaderStyle}>
        <Avatar sx={[avatarStyle, { backgroundColor: TEAM_COLORS[team.color].code }]}>
          <Box
            sx={{
              backgroundColor: TEAM_COLORS[team.color].code,
              width: '100%',
              height: '100%',
            }}
          />
        </Avatar>
        <Typography variant="h6" fontWeight="bold" sx={{ p: 1, transform: 'skewX(20deg)' }}>
          {team?.name}
        </Typography>
      </Box>
      <Box sx={teamBodyStyle}>
        <Member team={team} teamId={team.id} />
      </Box>
    </>
  );
};

export default Team;
