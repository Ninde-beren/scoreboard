import React, {FC} from 'react';
import {Box, Divider, Paper, Stack, Typography} from "@mui/material";
import {Team as TeamType} from "../../../_types/Team";
import {matchTeamStyle, scoreStyle, scoreTournamentStyle} from "../../../_styles/Style";


const Team: FC<{ team: TeamType, scoreTeam: number }> = ({team, scoreTeam}) => {

    return (
        <Stack sx={matchTeamStyle} direction="row" spacing={0} alignItems="center" justifyContent="end">
            <Typography variant="body1" sx={{p: 1}}>
                {team?.name}
            </Typography>
            <Paper elevation={5} sx={[scoreTournamentStyle]}>
            <Typography fontSize={26}>
                {scoreTeam}
            </Typography>
            </Paper>
            <Divider/>
        </Stack>
    );
};

export default Team;
