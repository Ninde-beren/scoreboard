import React, {FC} from 'react';
import {Box, Paper, Stack} from "@mui/material";
import Team from "./Team";
import {Match as MatchType} from "../../../_types/Match"
import {matchStyle, matchTeamDividerStyle} from "../../../_styles/Style";

const Match: FC<{match: MatchType}> = ({match}) => {
    return (
        <Paper sx={matchStyle}>
            <Stack key={match.id + '-match'} direction="column" justifyContent="center">
                    <Team team={match.teamA} scoreTeam={match.scoreTeamA}/>
                <Box sx={matchTeamDividerStyle}/>
                    <Team team={match.teamB} scoreTeam={match.scoreTeamB}/>
            </Stack>
        </Paper>
    );
};

export default Match;
