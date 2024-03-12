import React, {FC} from 'react';
import {Box, Typography} from "@mui/material";
import {Member as MemberType} from "../../../_types/Member";
import {Team} from "../../../_types/Team";

const Member: FC<{ team: Team, teamId: number }>
    = ({team, teamId}) => {

    return (
        <>
            {team.members?.map((member: MemberType, index: number) => (
                <Box sx={style} key={teamId + index + '-member'}>
                    <Typography variant="body1" sx={{transform: 'skewX(20deg)',}}>{member?.name}</Typography>
                </Box>
            ))}
        </>
    );
};
export default Member;

const style = {
    color: "white",
    backgroundColor: "#4A9AD5",
    p: 1,
    borderImage: 'linear-gradient(50deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%) 1',
    borderBottom: '5px solid',

};