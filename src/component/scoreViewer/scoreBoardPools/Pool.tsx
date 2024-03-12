import React, {FC} from 'react';
import {Avatar, Box, Paper, Stack, Typography} from "@mui/material";
import {Match} from "../../../_types/Match";
import {
    avatarStyle,
    itemListStyle,
    leftStyle,
    rightStyle,
    scoreItemListStyle
} from "../../../_styles/Style";
import {Pool as PoolType} from "../../../_types/Pool";
import {TeamColor} from "../../../_types/TeamColor";

const Pool: FC<{ pool: PoolType }> = ({pool}) => {
    return (
        <>
            {pool.matchs.map((match: Match, index: number) =>
                <Paper key={index} sx={[itemListStyle]} elevation={5}>
                    <Stack key={index + '-match'} direction="row" alignItems="center" spacing={2}>
                        <Box sx={scoreItemListStyle}>
                            <Typography variant="h5">
                                {match.scoreTeamA}
                            </Typography>
                        </Box>
                        <Stack sx={{width: 375}} direction="row" justifyContent="center" alignItems="center"
                               spacing={2}>
                            <Avatar
                                sx={[avatarStyle, leftStyle]}><Box sx={{
                                backgroundColor: TeamColor[match.teamA.color].code,
                                width: '100%',
                                height: '100%'
                            }}/>
                            </Avatar>
                            <Typography sx={{width: '100px'}}>
                                {match?.teamA?.name}
                            </Typography>
                            <Typography variant="body1">VS</Typography>
                            <Typography sx={{width: '100px'}}>
                                {match?.teamB?.name}
                            </Typography>
                            <Avatar sx={[avatarStyle, rightStyle]}><Box
                                sx={{
                                    backgroundColor: TeamColor[match.teamB.color].code,
                                    width: '100%',
                                    height: '100%'
                                }}/>
                            </Avatar>
                        </Stack>
                        <Box sx={scoreItemListStyle}>
                            <Typography variant="h5">
                                {match.scoreTeamB}
                            </Typography>
                        </Box>
                 {/*        <Paper>
                <Typography>Terrain : A</Typography>
                <Typography>Heure de passage : 14h30</Typography>
            </Paper>*/}
                    </Stack>
                </Paper>
            )}
        </>
    );
};
export default Pool;



