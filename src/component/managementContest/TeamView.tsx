import React, {FC, useState} from 'react';
import {Paper, Stack, Typography} from "@mui/material";
import {Team as TeamType} from "../../_types/Team";
import {paperMarginBottom, paperStyle} from "../../_styles/Style";
import Team from "../scoreViewer/teamBuilding/Team";
import FormPopover from "./FormPopover";
import AddMember from "../../forms/AddMember";
import {Contest} from "../../_types/Contest";

const TeamView: FC<{ contest: Contest }> = ({contest}) => {
    const [open, setOpen] = useState("");

    return (
        <Stack id='list-team' direction="row" spacing={15} flexWrap="wrap" justifyContent="center"
               alignItems="start"
               paddingTop={7.5} paddingX="5%">
            {contest.teams?.length > 0 ?
                contest.teams.map((team: TeamType, index: number) => (
                    <Stack key={index} sx={paperMarginBottom} spacing={1} alignItems="center">
                        <Paper sx={paperStyle}>
                            <Team team={team}/>
                        </Paper>
                        {team.members?.length < contest.params.teamNumber &&
                            <FormPopover open={open} setOpen={setOpen} index={index + team.name}>
                                <AddMember team={team} openAction={setOpen}/>
                            </FormPopover>
                        }
                    </Stack>
                ))
                : <Typography variant="h1">Ajouter des équipes</Typography>}
        </Stack>
    );
};

export default TeamView;
