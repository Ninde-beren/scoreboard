import { TeamViewProps } from '@features/contest-management/domain/model/contestUi.model';
import AddTeamToContest from '@features/contest-management/ui/forms/AddTeamToContest';
import { Box, Stack, Typography } from '@mui/material';
import { Team as TeamType } from '@shared/model/Team';
import { TEAM_COLORS } from '@shared/model/teamColor';
import { colors } from '@shared/ui/styles/colors';

const TeamView = ({ contest }: TeamViewProps) => {
  const teams = contest.teams ?? [];

  return (
    <Box sx={{ backgroundColor: colors.blue, height: '100%', minHeight: 0 }}>
      <Stack spacing={{ xs: 3, md: 4 }} sx={{ px: { xs: 3, md: 8 }, py: { xs: 4, md: 6 } }}>
        <AddTeamToContest />
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          sx={{
            columnGap: { xs: 3, md: 6 },
            rowGap: { xs: 3, md: 4 },
          }}
        >
          {teams.length > 0 ? (
            teams.map((team: TeamType) => {
              const teamColor = TEAM_COLORS[team.color]?.code ?? '#2ECC71';
              return (
                <Stack key={team.id} direction="row" alignItems="center" sx={{ flex: '0 0 200px' }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: teamColor,
                      border: `3px solid ${colors.white}`,
                      boxShadow: '0 2px 0 rgba(0,0,0,0.15)',
                    }}
                  />
                  <Box
                    sx={{
                      ml: 1.5,
                      px: 2.5,
                      py: 0.7,
                      minWidth: 110,
                      backgroundColor: colors.redDark,
                      borderRadius: 1,
                      boxShadow: '0 2px 0 rgba(0,0,0,0.2)',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: colors.white, fontWeight: 700 }}>
                      {team?.name}
                    </Typography>
                  </Box>
                </Stack>
              );
            })
          ) : (
            <Typography variant="h4" sx={{ color: colors.white, fontWeight: 700 }}>
              Ajouter des équipes
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default TeamView;
