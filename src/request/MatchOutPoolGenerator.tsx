import React, {FC, useEffect, useState} from 'react';
import {
    Alert,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";
import GetWhere from "./GetWhere";
import {modalStyle, popoverStyle} from "../_styles/Style";
import {Stage} from "../_types/Stage";
import {Pool} from "../_types/Pool";
import GetPool from "./GetPool";
import {contestObserver} from "../App";
import GetContest from "./GetContest";
import {Contest} from "../_types/Contest";
import Add from "./Add";
import Update from "./Update";
import {SubContest} from "../_types/SubContest";
import {StageType} from "../_types/StageType";
import get from "./Get";
import {displayError} from "../component/utils";
import {poolName} from "../component/scoreViewer/ScoreboardPools";

const MatchOutPoolGenerator: FC<{ step: any[], nextStep: any }> = ({step, nextStep}) => {
        const [poolAId, setpoolAId] = useState(0);
        const [poolA, setpoolA] = useState<Pool>();
        const [poolBId, setpoolBId] = useState(0);
        const [poolB, setpoolB] = useState<Pool>();
        const [open, setOpen] = React.useState(false);
        const [stage, setStage] = React.useState<Stage>();
        const [openSuccess, setOpenSuccess] = React.useState(false);
        const [openError, setOpenError] = React.useState(false);
        const [error, setError] = useState(false);
        const [errorText, setErrorText] = useState("");

        useEffect(() => {
            GetContest().then((contest: Contest) => {
                localStorage.setItem("contest", JSON.stringify(contest));
                contestObserver.next(contest)
            })
            GetWhere('stage', {
                'type': StageType.EIGHTER_FINAL,
                'subContest': SubContest.PRINCIPALE
            }).then((stage) => setStage(stage))
        }, []);

        useEffect(() => {
            GetPool(poolAId).then((pool) => setpoolA(pool))
            console.log(poolA)
        }, [poolAId]);

        useEffect(() => {
            GetPool(poolBId).then((pool) => setpoolB(pool))
            console.log(poolB)
        }, [poolBId]);

        const randomizer = async () => {
            let teamVictoryA: any = []
            let data: any = []
            let teamVictoryB: any[] = []
            setErrorText("")

            if (stage && poolA && poolB) {
                if (poolAId === poolBId) {
                    displayError(setOpenError, setErrorText, setError, "Même pool saisi")
                    return
                }
                let notWinner = false

                poolA.matchs.map((match, index) => {
                    if (!match.winner) {
                        notWinner = true
                    } else {
                        poolA.teams.map((team: any, index) => {
                            let teamData = {id: team, victory: 0, score: 0}
                            poolA.matchs.map((match, index) => {
                                if (team === match.winner.id) teamData.victory++
                                if (team === match.teamA.id || team === match.teamB.id)
                                    teamData.score = (team === match.teamA.id ?
                                        teamData.score + match.scoreTeamA
                                        : teamData.score + match.scoreTeamB)
                                data[team] = teamData
                            })
                        })
                    }
                })

               if (notWinner) {
                    displayError(setOpenError, setErrorText, setError, "Un des matchs de pool selectionnés n'a pas été rempli")
                    return
                }

                teamVictoryA = data.slice(0);
                teamVictoryA.sort(function (a: any, b: any) {
                    return b.victory - a.victory;
                });
                teamVictoryA.sort(function (a: any, b: any) {
                    return b.score - a.score;
                });

                //  console.log('A', teamVictoryA, Boolean(teamVictoryA.length))
                data = []
                poolB.matchs.map((match, index) => {
                    if (!match.winner) {
                        notWinner = true
                    } else {
                        poolB.teams.map((team: any, index) => {
                            let teamData = {id: team, victory: 0, score: 0}
                            poolB.matchs.map((match, index) => {
                                if (team === match.winner.id) teamData.victory++
                                if (team === match.teamA.id || team === match.teamB.id)
                                    teamData.score = (team === match.teamA.id ?
                                        teamData.score + match.scoreTeamA
                                        : teamData.score + match.scoreTeamB)
                                data[team] = teamData
                            })
                        })
                    }
                })

                teamVictoryB = data.slice(0);
                teamVictoryB.sort(function (a: any, b: any) {
                    return b.victory - a.victory;
                });
                console.log('B2', teamVictoryB)
                teamVictoryB.sort(function (a: any, b: any) {
                    return b.score - a.score;
                });
                console.log('B3', teamVictoryB)

                if (Boolean(teamVictoryA.length) && Boolean(teamVictoryB.length)) {
                    console.log('je passe par ici')
                    let teamPrincipaleVictoryA1 = Number(teamVictoryA[0].id)
                    let teamPrincipaleVictoryA2 = Number(teamVictoryA[1].id)
                    let teamPrincipaleVictoryB1 = Number(teamVictoryB[1].id)
                    let teamPrincipaleVictoryB2 = Number(teamVictoryB[0].id)
                    let teamConsolanteVictoryA1 = Number(teamVictoryA[2].id)
                    let teamConsolanteVictoryA2 = Number(teamVictoryA[3].id)
                    let teamConsolanteVictoryB1 = Number(teamVictoryB[3].id)
                    let teamConsolanteVictoryB2 = Number(teamVictoryB[2].id)
                    console.log('A', teamVictoryA)
                    let principaleMatch1 = await Add('match', {
                        scoreTeamA: 0,
                        scoreTeamB: 0,
                        teamA: teamPrincipaleVictoryA1,
                        teamB: teamPrincipaleVictoryB1
                    })
                    let principaleMatch2 = await Add('match', {
                        scoreTeamA: 0,
                        scoreTeamB: 0,
                        teamA: teamPrincipaleVictoryA2,
                        teamB: teamPrincipaleVictoryB2
                    })
                    let consolanteMatch1 = await Add('match', {
                        scoreTeamA: 0,
                        scoreTeamB: 0,
                        teamA: teamConsolanteVictoryA1,
                        teamB: teamConsolanteVictoryB1
                    })
                    let consolanteMatch2 = await Add('match', {
                        scoreTeamA: 0,
                        scoreTeamB: 0,
                        teamA: teamConsolanteVictoryA2,
                        teamB: teamConsolanteVictoryB2
                    })
                    let stage1 = await get('stage', stage.id)
                    await Update('stage', stage.id, {matchs: [...stage1.matchs, principaleMatch1.id, principaleMatch2.id]})
                    let stage2 = await get('stage', stage.id + 1)
                    await Update('stage', stage2.id, {matchs: [...stage2.matchs, consolanteMatch1.id, consolanteMatch2.id]})
                    GetContest().then((contest: Contest) => {
                        localStorage.setItem("contest", JSON.stringify(contest));
                        contestObserver.next(contest)
                    })
                    setOpenSuccess(true)
                    setTimeout(() => setOpenSuccess(false), 2000)
                    handleClose();
                    if (stage.matchs.length === stage.totalMatchs - 1) {
                        nextStep((e: any) => [e[0], false, false, true]);
                        localStorage.setItem('view', JSON.stringify(['pool', false, true, false]))
                    } else {
                        nextStep((e: any) => [e[0], false, true, true]);
                        localStorage.setItem('view', JSON.stringify(['tournament', false, true, false]))
                    }
                } else {
                    setOpenError(true)
                    setErrorText(errorText + "\n Les valeurs ne sont pas bonnes, veuillez selectionner des pools valides")
                    setError(true)
                    setTimeout(() => {
                        setOpenError(false);
                        setError(false);
                        setErrorText("")
                    }, 2000)
                }
            } else {
                displayError(setOpenError, setErrorText, setError, "Veuillez selectionner des pools")
            }
        }

        const handleClose = () => {
            setOpen(false);
        }
        const triche = async () => {
            await GetContest().then((contest: Contest) => {
                contest.stages.map((stage, index) => {
                    if (stage.type === StageType.POOL)
                        stage.pools.map(async (pool, index) => {
                            pool.matchs.map(async (match, index) => {
                                await Update('match', match.id, {
                                    scoreTeamA: 4,
                                    scoreTeamB: 6,
                                    winner: match.teamB.id
                                })
                            })
                        })
                })
            })
            await GetContest().then(contest => {
                localStorage.setItem("contest", JSON.stringify(contest));
                contestObserver.next(contest)
            })
        }

        return (
            <>
                {stage &&
                    <>
                        <Button variant="contained" onClick={triche}>score auto</Button>
                        <Button variant="contained" onClick={() => setOpen(true)}>Générer les matchs
                            de {stage?.type}</Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            keepMounted
                        >
                            <Paper sx={[modalStyle, popoverStyle]}>
                                <Stack alignItems="center" spacing={2}>
                                    <Typography variant="h5" padding={1}>Pools prêtes pour
                                        les {(stage) ? stage.type : ""} ? </Typography>
                                    <Stack direction="row" spacing={6}>
                                        <FormControl>
                                            <InputLabel id="demo-simple-select-standard-label">Pool</InputLabel>
                                            <Select
                                                labelId="select pool A"
                                                id="select pool A"
                                                sx={{width: 110, color: "white"}}
                                                value={String(poolAId)}
                                                label="Pool"
                                                onChange={(e) => setpoolAId(Number(e.target.value))}
                                            >
                                                {poolName.map((name, index) =>
                                                    <MenuItem key={index + 1} value={String(index+1)}>Poule {name}</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel id="demo-simple-select-standard-label">Pool</InputLabel>
                                            <Select
                                                labelId="select pool B"
                                                id="select pool B"
                                                sx={{width: 110, color: "white"}}
                                                value={String(poolBId)}
                                                label="Pool"
                                                onChange={(e) => setpoolBId(Number(e.target.value))}
                                            >
                                                {poolName.map((name, index) =>
                                                    <MenuItem key={index + 1} value={String(index+1)}>Poule {name}</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
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
                        {!error ?
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
                }
            </>
        );
    }
;

export default MatchOutPoolGenerator;
