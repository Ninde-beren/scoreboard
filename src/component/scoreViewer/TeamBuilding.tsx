import React, {FC} from 'react';
import Team from "./teamBuilding/Team";
import {Box, Paper, Stack, Typography} from "@mui/material";
import {Contest} from "../../_types/Contest";
import {notSkew, paperMarginBottom, paperStyle, stageHeaderStyle} from "../../_styles/Style";

const TeamBuilding: FC<{contest: Contest}>= ({contest}) => {

    return (
        <Stack spacing={5}>
            <Box sx={stageHeaderStyle}>
            <Typography variant="h3" sx={notSkew}>Liste des équipes</Typography>
            </Box>
            <br/>
            <Stack id='list-team' direction="row" spacing={15} flexWrap="wrap" justifyContent="center" paddingLeft="6%">
                {contest.teams &&
                    contest.teams.map((team, index) => (
                        <Stack key={index} sx={paperMarginBottom} spacing={1} alignItems="center">
                        <Paper sx={paperStyle}>
                            <Team key={index} team={team}/>
                        </Paper>
                        </Stack>
                    ))}
            </Stack>
        </Stack>
    )
};

export default TeamBuilding;

