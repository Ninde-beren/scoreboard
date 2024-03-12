import React, {FC, useEffect, useState} from 'react';
import {Contest} from "../../_types/Contest";
import {Box, Stack, Typography} from "@mui/material";
import ItemRanking from "./Ranking/itemRanking";
import {Team} from "../../_types/Team";
import {notSkew, stageHeaderStyle} from "../../_styles/Style";

const Ranking: FC<{ contest: Contest }> = ({contest}) => {
    const [classment, setClassment] = useState<any[]>([]);

    useEffect(() => {
        let data =contest.teams.slice(0);
        data.sort(function (a: any, b: any) {
            return b.score - a.score;
        });
        setClassment(data)
    }, [contest]);


    return (
        <Stack spacing={7.5}>
            <Box sx={stageHeaderStyle}>
                <Typography variant="h3" sx={notSkew}>Classement</Typography>
            </Box>
            {contest.teams &&
                <Stack direction="row" spacing={10}>
                    <Stack spacing={3} justifyContent="center" alignItems="center" sx={{transform: 'skewX(-10deg)'}}>
                        {classment?.filter(team => classment.indexOf(team) < 8).map((team: Team, index: number) => (
                            <ItemRanking key={team.id + '-match'} team={team} index={index}/>
                        ))}
                    </Stack>
                    <Stack spacing={3} justifyContent="center" sx={{transform: 'skewX(-10deg)'}}>
                        {classment?.filter(team => classment.indexOf(team) >= 8 && classment.indexOf(team) < 16).map((team: Team, index: number) => (
                            <ItemRanking key={team.id + '-match'} team={team} index={index}/>
                        ))}
                    </Stack>
                    <Stack spacing={3} justifyContent="center" sx={{transform: 'skewX(-10deg)'}}>
                        {classment?.filter(team => classment.indexOf(team) >= 16 && classment.indexOf(team) < 24).map((team: Team, index: number) => (
                            <ItemRanking key={team.id + '-match'} team={team} index={index}/>
                        ))}
                    </Stack>
                    <Stack spacing={3} justifyContent="center" sx={{transform: 'skewX(-10deg)'}}>
                        {classment?.filter(team => classment.indexOf(team) >= 24 && classment.indexOf(team) < 33).map((team: Team, index: number) => (
                            <ItemRanking key={team.id + '-match'} team={team} index={index}/>
                        ))}
                    </Stack>
                </Stack>
            }
        </Stack>
    )
};

export default Ranking;
