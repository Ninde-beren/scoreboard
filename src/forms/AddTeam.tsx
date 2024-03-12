import React, {FC, useState} from 'react';
import Add from "../request/Add";
import Update from "../request/Update";
import {Button, TextField, Typography} from "@mui/material";
import {Contest} from "../_types/Contest";
import {contestObserver} from "../App";
import GetContest from "../request/GetContest";
import get from "../request/Get";

const AddTeam: FC<{ match: any, team: string, contest: any, openAction: any }> = ({match, team, openAction}) => {
    const [name, setName] = useState("");

    const add = () => {
        openAction(false)
        get('contest', 1).then(contest => {
            if (team === 'A') {
                Add('team', {name: name, members: []}).then(async newTeam => {
                    console.log(' update match', match.id)
                    await Update('match', match.id, {teamA: newTeam.id})
                    console.log(' update contest', contest.id, contest.teams)
                    await Update('contest', contest.id, {teams: [...contest.teams, newTeam.id]})
                    GetContest().then((contest: Contest) => {
                        localStorage.setItem("contest", JSON.stringify(contest));
                        contestObserver.next(contest)
                    })
                })
            } else {
                Add('team', {name: name, members: []}).then(async newTeam => {
                    console.log(' update match', match.id)
                    await Update('match', match.id, {teamB: newTeam.id})
                    console.log(' update contest', contest.id, 'teams ', contest.teams)
                    await Update('contest', contest.id, {teams: [...contest.teams, newTeam.id]})
            GetContest().then((contest: Contest) => {
                localStorage.setItem("contest", JSON.stringify(contest));
                contestObserver.next(contest)
            })
                })
            }
        })
    }

    return (
        <>
            <TextField
                label="Team name"
                type="text"
                value={name}
                onChange={ev => setName(ev.target.value)}
            />
            <Button variant="contained" onClick={add}>
                Ajouter
            </Button>
        </>
    );
};

export default AddTeam;
