import React, {FC} from 'react';
import {Contest} from "../../_types/Contest";
import {Box, Stack, Typography} from "@mui/material";
import {notSkew, stageHeaderStyle} from "../../_styles/Style";
import {SubContest} from "../../_types/SubContest";

const Podium: FC<{ contest: Contest }> = ({contest}) => {

    // @ts-ignore
    return (
        <Stack spacing={7.5}>
            <Box sx={stageHeaderStyle}>
                <Typography variant="h3" sx={notSkew}>Podium</Typography>
            </Box>
            <Stack spacing={10}>
                {contest.winners[SubContest.PRINCIPALE] &&
                    <Stack direction="row" justifyContent="space-around">
                        <Stack spacing={3} justifyContent="center" alignItems="center">
                            <img className="cupView2" src="/cups/second.svg" alt="logo"/>
                            <Typography variant="h3"> {contest.winners[SubContest.PRINCIPALE].one.name}</Typography>
                        </Stack>
                        <Stack spacing={3} justifyContent="center" alignItems="center">
                            <img className="cupView" src="/cups/first.svg" alt="logo"/>
                            <Typography variant="h3"> {contest.winners[SubContest.PRINCIPALE].two.name}</Typography>
                        </Stack>
                        <Stack spacing={3} justifyContent="center" alignItems="center">
                            <img className="cupView2" src="/cups/third.svg" alt="logo"/>
                            <Typography variant="h3"> {contest.winners[SubContest.PRINCIPALE].three.name}</Typography>
                        </Stack>
                    </Stack>}
                {contest.winners[SubContest.CONSOLANTE] &&
                    <Stack>
                        <Stack spacing={3} justifyContent="center" alignItems="center">
                            <img className="cupView3" src="/cups/fourth.svg" alt="logo"/>
                            <Typography variant="h3"> {contest.winners[SubContest.CONSOLANTE].one.name}</Typography>
                        </Stack>
                    </Stack>
                }
            </Stack>
        </Stack>
    )
};

export default Podium;
