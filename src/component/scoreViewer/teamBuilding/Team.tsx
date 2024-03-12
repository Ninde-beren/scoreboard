import React, {FC} from 'react';
import {Avatar, Box, Typography} from "@mui/material";
import {Team as TeamType} from "../../../_types/Team";
import Member from "./Member";
import {avatarStyle, teamBodyStyle, teamHeaderStyle} from "../../../_styles/Style";
import {TeamColor} from "../../../_types/TeamColor";

const Team: FC<{ team: TeamType }> = ({team}) => {

    return (
        <>
            <Box sx={teamHeaderStyle}>
                <Avatar
                    sx={[avatarStyle, {backgroundColor: TeamColor[team.color].code}]}>
                    <Box sx={{
                        backgroundColor: TeamColor[team.color].code,
                        width: '100%',
                        height: '100%'
                    }}/>
                </Avatar>
                <Typography variant="h6" fontWeight="bold" sx={{p: 1, transform: 'skewX(20deg)',}}>
                    {team?.name}
                </Typography>
            </Box>
            <Box sx={teamBodyStyle}>
            <Member team={team} teamId={team.id}/>
            </Box>
        </>
    );
};

export default Team;
