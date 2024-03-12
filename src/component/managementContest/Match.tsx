import React, {FC, useState} from 'react';
import {Avatar, Box, Button, Paper, Stack, Typography} from "@mui/material";
import {Match as MatchType} from "../../_types/Match";
import {avatarStyle, itemListStyle, leftStyle, rightStyle, scoreItemListStyle} from "../../_styles/Style";
import {TeamColor} from "../../_types/TeamColor";
import AddMatchScore from "../../forms/AddMatchScore";

const Match: FC<{ match: MatchType, noNumber?: boolean }> = ({match, noNumber}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Paper sx={itemListStyle} elevation={5}>
                    <Stack key={match.id + '-match'} direction="row" alignItems="center" spacing={2}>
                        <Box sx={[scoreItemListStyle, {p: '0 14px'}]}>
                            <Typography variant="h5">
                                {match.scoreTeamA}
                            </Typography>
                        </Box>
                        <Stack sx={{width: 375}} direction="row" justifyContent="center" alignItems="center"
                               spacing={2}>
                            <Avatar
                                sx={[avatarStyle, leftStyle]}>
                                <Box sx={{
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
                        <Box sx={[scoreItemListStyle, {p: '0 14px'}]}>
                            <Typography variant="h5">
                                {match.scoreTeamB}
                            </Typography>
                        </Box>
                        {!noNumber &&
                            <Paper>
                                <Box justifyContent="center">
                                    <Typography variant="h5">{match.id}</Typography>
                                </Box>
                            </Paper>
                        }
                    </Stack>
                </Paper>
            </Button>
            <AddMatchScore match={match} openAction={open} setOpenAction={setOpen}/>
        </>
    );
};
export default Match;



