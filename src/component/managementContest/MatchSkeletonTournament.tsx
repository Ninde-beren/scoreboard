import React, {FC} from 'react';
import {Box, Divider, Paper, Skeleton, Stack, Typography} from "@mui/material";
import {matchStyle, matchTeamDividerStyle, matchTeamStyle, scoreTournamentStyle} from "../../_styles/Style";

const MatchSkeletonTournament: FC = () => {
    return (
        <Paper sx={matchStyle}>
            <Stack direction="column" justifyContent="center">
                <Stack sx={matchTeamStyle} direction="row" spacing={0} alignItems="center" justifyContent="end">
                    <Skeleton variant="rectangular" width={210} height={60}/>
                    <Paper elevation={5} sx={[scoreTournamentStyle]}>
                        <Typography fontSize={26}>
                            0
                        </Typography>
                    </Paper>
                    <Divider/>
                </Stack>
                <Box sx={matchTeamDividerStyle}/>
                <Stack sx={matchTeamStyle} direction="row" spacing={0} alignItems="center" justifyContent="end">
                    <Typography variant="body1" sx={{p: 1}}>
                        <Skeleton variant="rectangular" width={210} height={60}/>
                    </Typography>
                    <Paper elevation={5} sx={[scoreTournamentStyle]}>
                        <Typography fontSize={26}>
                           0
                        </Typography>
                    </Paper>
                    <Divider/>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default MatchSkeletonTournament;
