import React, {FC, useEffect, useState} from 'react';
import {Alert, Button, FormHelperText, Modal, Paper, Snackbar, Stack, TextField, Typography} from "@mui/material";
import GetWhere from "./GetWhere";
import {StageType} from "../_types/StageType";
import {modalStyle, popoverStyle} from "../_styles/Style";
import {Stage} from "../_types/Stage";
import {Match} from "../_types/Match";
import Get from "./Get";
import GetContest from "./GetContest";
import {Contest} from "../_types/Contest";
import {contestObserver} from "../App";
import Update from "./Update";
import Add from "./Add";
import {displayError} from "../component/utils";

const MatchGenerator: FC<{ stageType: string, nextStageType: string, subContest: string, step: any[], nextStep: any }>
    = ({stageType, nextStageType, subContest, step, nextStep}) => {

    const [matchAId, setMatchAId] = useState<any>(0);
    const [matchA, setMatchA] = useState<Match>();
    const [matchBId, setMatchBId] = useState<any>(0);
    const [matchB, setMatchB] = useState<Match>();
    const [open, setOpen] = React.useState(false);
    const [stage, setStage] = React.useState<Stage>();
    const [nextStage, setNextStage] = React.useState<Stage>();
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [openError, setOpenError] = React.useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [textButton, setTextButton] = useState("");

    useEffect(() => {
        GetContest().then((contest: Contest) => {
            localStorage.setItem("contest", JSON.stringify(contest));
            contestObserver.next(contest)
        })
    }, []);

    useEffect(() => {
        GetWhere('stage', {'type': stageType, 'subContest': subContest}).then((stage) => setStage(stage))
        GetWhere('stage', {'type': nextStageType, 'subContest': subContest}).then((stage) => setNextStage(stage))
    }, []);

    useEffect(() => {
        Get('match', matchAId).then((match) => setMatchA(match))
    }, [matchAId]);

    useEffect(() => {
        Get('match', matchBId).then((match) => setMatchB(match))
    }, [matchBId]);

    const randomizer = async () => {
        console.log('stage', stage)
        if (stage && nextStage) {
            if (stage.type === StageType.SEMI_FINAL) {
                await setMatchAId(stage.matchs[0])
                await setMatchBId(stage.matchs[1])
                setTextButton('Clique encore')
            }
            if (matchA && matchB) {

                if (matchAId === matchBId) {
                    displayError(setOpenError, setErrorText, setError, "Même match saisi")
                    return
                }

                if (!matchA.winner || !matchB.winner) {
                    displayError(setOpenError, setErrorText, setError, "Un des matchs n'a pas été rempli")
                    return
                } else {
                    let teamVictoryA = Number(matchA.winner)
                    let teamVictoryB = Number(matchB.winner)
                    let match = await Add('match', {
                        scoreTeamA: 0,
                        scoreTeamB: 0,
                        teamA: teamVictoryA,
                        teamB: teamVictoryB
                    })
                    if (stage.type === StageType.SEMI_FINAL)
                        await Update('stage', nextStage.id, {matchs: [match.id]})
                    else {
                        let stageUpdate = await Get('stage', nextStage.id)
                        await Update('stage', nextStage.id, {matchs: [...stageUpdate.matchs, match.id]})
                    }

                    GetContest().then((contest: Contest) => {
                        localStorage.setItem("contest", JSON.stringify(contest));
                        contestObserver.next(contest)
                    })
                    setOpenSuccess(true)
                    setTimeout(() => setOpenSuccess(false), 2000)
                    handleClose();
                }
            }
        } else {
            displayError(setOpenError, setErrorText, setError, "Veuillez selectionner des matchs")
            return
        }

        console.log('step', step)

    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            {(stage && stage.type !== StageType.FINAL) &&
                <>
                    {stage.type === StageType.SEMI_FINAL ?
                        <Button variant="contained" onClick={randomizer}> Générer les matchs
                            de {nextStageType}</Button>
                        :
                        <>
                            <Button variant="contained" onClick={() => setOpen(true)}> Générer les matchs
                                de {nextStageType}</Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                keepMounted
                            >
                                <Paper sx={[modalStyle, popoverStyle]}>
                                    <Stack alignItems="center" spacing={2}>
                                        {textButton !== "" ?
                                            <Typography variant="h5" padding={1}> {textButton} </Typography> :
                                            <Typography variant="h5" padding={1}> Match prêtes pour
                                                les {(stage) ? stage.type : ""} ? </Typography>}
                                        <Stack direction="row" spacing={6}>
                                            <TextField label="Match 1" type="number"
                                                       defaultValue={0}
                                                       inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
                                                       onChange={(e) => setMatchAId(Number(e.target.value))}/>
                                            <TextField label="Match 2" type="number"
                                                       defaultValue={0}
                                                       inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
                                                       onChange={(e) => setMatchBId(Number(e.target.value))}/>
                                        </Stack>
                                        {error &&
                                            <FormHelperText error={error}>{errorText}</FormHelperText>
                                        }
                                        <Button variant="contained" onClick={randomizer}>
                                            Ajouter
                                        </Button>
                                    </Stack>
                                </Paper>
                            </Modal>
                        </>
                    }
                </>
            }
            {!error ?
                <Snackbar open={openSuccess} autoHideDuration={6000} onClose={() => setOpenSuccess(false)}
                          anchorOrigin={{vertical: 'top', horizontal: 'left'}}>
                    <Alert onClose={() => setOpenSuccess(false)} severity="success" sx={{width: '100%'}}>
                        Les matchs ont été générer avec success !
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

export default MatchGenerator;
