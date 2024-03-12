import React, {FC, useState} from 'react';
import Add from "../request/Add";
import Update from "../request/Update";
import {Alert, Button, Paper, Snackbar, Stack, TextField, Typography} from "@mui/material";
import {Contest} from "../_types/Contest";
import {contestObserver} from "../App";
import GetContest from "../request/GetContest";
import get from "../request/Get";
import {poolName} from "../component/scoreViewer/ScoreboardPools";

const AddTeam2: FC = () => {
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);

    const add = () => {
        if (name === "") {
            setError(true)
            setOpen(true)
            setTimeout(() => setError(false), 2000)
            return
        }
        get('contest', 1).then(contest => {
            Add('team', {name: name, members: [], score:0}).then(async newTeam => {
                await Update('team', newTeam.id, {color: newTeam.id})
                await Update('contest', contest.id, {teams: [...contest.teams, newTeam.id]})
                GetContest().then((contest: Contest) => {
                    localStorage.setItem("contest", JSON.stringify(contest));
                    contestObserver.next(contest)
                })
            })
        })
        setName("")
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const triche = () => {
        GetContest().then(async (contest: Contest) => {
            for (let i = 0; i < 32; i++) {
                await Add('team', {name: poolName[i], members: [], score:0}).then(async newTeam => {
                    await Update('team', newTeam.id, {color: newTeam.id})
                })
                await Update('contest', contest.id, {teams: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]})
                GetContest().then(contest => {
                    localStorage.setItem("contest", JSON.stringify(contest));
                    contestObserver.next(contest)
                })
            }
        })
    }

    return (
        <>
            <Button onClick={triche}>auto équipe</Button>
            <Stack direction="row" justifyContent="center">
                <Stack justifyContent="center">
                    <Stack direction="row" alignItems="center">
                        <Typography variant="h5" padding={1}>Ajouter une équipe : </Typography>
                        <Stack direction="row">
                            <Paper>
                                <TextField
                                    error={error}
                                    type="text"
                                    value={name}
                                    onChange={ev => {
                                        setName(ev.target.value)
                                        setError(false)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") add()
                                    }}

                                />
                            </Paper>
                            <Button variant="contained" onClick={add}
                            >
                                Ajouter
                            </Button>
                        </Stack>
                    </Stack>
                    {error &&
                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
                                  anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                            <Alert severity="error">Vous devez spécifier un nom</Alert>
                        </Snackbar>
                    }
                </Stack>
            </Stack>
        </>
    );
};

export default AddTeam2;
