import React, {FC, useEffect, useState} from 'react';
import Update from "../request/Update";
import {Alert, Button, FormHelperText, Modal, Paper, Snackbar, Stack, TextField, Typography} from "@mui/material";
import {Match} from "../_types/Match";
import {modalStyle, popoverStyle} from "../_styles/Style";
import GetContest from "../request/GetContest";
import {Contest} from "../_types/Contest";
import {contestObserver} from "../App";
import {displayError} from "../component/utils";

const AddMatchScore: FC<{ match: Match, openAction: boolean, setOpenAction: any }>
    = ({match, openAction, setOpenAction}) => {

    const [scoreTeamA, setScoreTeamA] = useState<number>();
    const [scoreTeamB, setScoreTeamB] = useState<number>();
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [openError, setOpenError] = React.useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const add = async () => {
            console.log(scoreTeamA, scoreTeamB)
        if ((scoreTeamA === 0 || scoreTeamA) && (scoreTeamB === 0 || scoreTeamB)) {
            console.log(scoreTeamA, scoreTeamB)
            if (scoreTeamA > 20 || scoreTeamB > 20) {
                displayError(setOpenError, setErrorText, setError, "Score trop élevé !")
                return
            }
            const winner = scoreTeamA > scoreTeamB ? match.teamA.id : match.teamB.id
            await Update('team', match.teamA.id, {score: match.teamA.score + scoreTeamA});
            await Update('team', match.teamB.id, {score: match.teamB.score + scoreTeamB});
            await Update('match', match.id, {scoreTeamA: scoreTeamA, scoreTeamB: scoreTeamB, winner: winner})
            GetContest().then((contest: Contest) => {
                localStorage.setItem("contest", JSON.stringify(contest));
                contestObserver.next(contest)
            })
            setOpenSuccess(true)
            setTimeout(() => setOpenSuccess(false), 2000)
            handleClose();
        }
    }

    const [open, setOpen] = React.useState(openAction);
    const handleClose = () => {
        setOpen(false);
        setOpenAction(false)
    }

    useEffect(() => {
        setOpen(openAction)
    }, [openAction]);

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                keepMounted
            >
                <Paper sx={[modalStyle, popoverStyle]}>
                    <Typography variant="h3" textAlign="center"> {match.teamA.name} vs {match.teamB.name}</Typography>
                    <Stack alignItems="center" spacing={2}>
                        <Typography variant="h5" padding={1}>Score des équipes ? </Typography>
                        <Stack direction="row" spacing={6}>
                            <TextField label={"Equipe " + match.teamA.name} type="number"
                                       defaultValue={match.scoreTeamA}
                                       inputProps={{inputMode: 'numeric', pattern: '[0-9]*', max: '13'}}
                                       onChange={(e) => setScoreTeamA(Number(e.target.value))}/>
                            <TextField label={"Equipe " + match.teamB.name} type="number"
                                       defaultValue={match.scoreTeamB}
                                       inputProps={{inputMode: 'numeric', pattern: '[0-9]*', max: '13'}}
                                       onChange={(e) => setScoreTeamB(Number(e.target.value))}/>
                        </Stack>
                        {error &&
                            <FormHelperText error={error}>{errorText}</FormHelperText>
                        }
                        <Button variant="contained" onClick={add}>
                            Ajouter
                        </Button>
                    </Stack>
                </Paper>
            </Modal>
            {
                !error ?
                    <Snackbar open={openSuccess} autoHideDuration={6000} onClose={() => setOpenSuccess(false)}
                              anchorOrigin={{vertical: 'top', horizontal: 'left'}}>
                        <Alert onClose={() => setOpenSuccess(false)} severity="success" sx={{width: '100%'}}>
                            Les pools ont été générer avec success !
                        </Alert>
                    </Snackbar>
                    :
                    <Snackbar open={openError} autoHideDuration={6000} onClose={() => setOpenError(false)}
                              anchorOrigin={{vertical: 'top', horizontal: 'left'}}>
                        <Alert onClose={() => setOpenError(false)} severity="error" sx={{width: '100%'}}>
                            {errorText}
                        </Alert>
                    </Snackbar>
            }
        </>
    );
};

export default AddMatchScore;
