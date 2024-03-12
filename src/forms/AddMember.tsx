import React, {FC, useState} from 'react';
import Add from "../request/Add";
import {Button, FormHelperText, Paper, Stack, TextField, Typography} from "@mui/material";
import {Team} from "../_types/Team";
import Update from "../request/Update";
import Get from "../request/Get";
import GetContest from "../request/GetContest";
import {Contest} from "../_types/Contest";
import {contestObserver} from "../App";

const AddMember: FC<{ team: Team, openAction: any}> = ({team, openAction}) => {
    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const add = () => {
        if (name === "") {
            setError(true)
            setTimeout(() => setError(false), 2000)
            return
        }
        openAction(false)
        Get('team', team.id).then(async team => {
            const member = await Add('member', {name: name})
            console.log(' update team', team.id)
            await Update('team', team.id, {members: [...team.members, member.id]})
            GetContest().then((contest: Contest) => {
                // setContest(contest)
                localStorage.setItem("contest", JSON.stringify(contest));
                contestObserver.next(contest)
            })
        })
    }

    return (
        <Stack alignItems="center" spacing={2}>
            <Typography variant="h5" padding={1}>Nom du joueur ? </Typography>
            <Stack>
                    <TextField
                        error={error}
                        label="Nom"
                        type="text"
                        value={name}
                        onChange={ev => {
                            setName(ev.target.value)
                            setError(false)
                        }}
                    />
                {error &&
                    <FormHelperText error={error}>Vous devez spécifier un nom</FormHelperText>
                }
            </Stack>
            <Button variant="contained" onClick={add}>
                Ajouter
            </Button>
        </Stack>
    )
};

export default AddMember;
