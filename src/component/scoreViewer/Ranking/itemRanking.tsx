import React, {FC} from 'react';
import {Avatar, Box, Paper, Stack, Typography} from "@mui/material";
import {
    avatarStyle,
    itemListStyle,
    scoreStyle
} from "../../../_styles/Style";
import {Team} from "../../../_types/Team";
import {TeamColor} from "../../../_types/TeamColor";

const ItemRanking: FC<{team: Team, index: number}> = ({team, index}) => {
    return (
        <Paper sx={[itemListStyle, {width: 385}]} elevation={5}>
            <Stack key={index + '-match'} direction="row" alignItems="center"  justifyContent="space-between" spacing={2}>
                <Stack sx={{width: '-webkit-fill-available'}} direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
                    <Avatar
                        sx={[avatarStyle, {backgroundColor: TeamColor[team.color].code, left: '-23px'}]}>
                        <Box sx={{
                            backgroundColor: TeamColor[team.color].code,
                            width: '100%',
                            height: '100%'
                        }}/>
                    </Avatar>
                    <Typography sx={{width: '100px'}}>
                        {team?.name}
                    </Typography>
                </Stack>
                <Paper elevation={5} sx={scoreStyle}>
                    <Typography variant="h5">
                        {team.score ?team.score: 0}
                    </Typography>
                </Paper>
            </Stack>
        </Paper>
    );
};
export default ItemRanking;



