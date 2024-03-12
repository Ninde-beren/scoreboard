import React, {FC, useEffect, useState} from 'react';
import {Alert, Button, Snackbar} from "@mui/material";
import Add from "./Add";
import Update from "./Update";
import {Contest} from "../_types/Contest";
import GetWhere from "./GetWhere";
import {Stage} from "../_types/Stage";
import GetContest from "./GetContest";
import {contestObserver} from "../App";
import {StageType} from "../_types/StageType";
import {displayError} from "../component/utils";

const PoolGenerator: FC<{ contest: Contest, nextStep: any }> = ({contest, nextStep}) => {
        const [teamsIds, setTeamsIds] = useState<any[]>();
        const [stage, setStage] = useState<any>();
        const [openSuccess, setOpenSuccess] = React.useState(false);
        const [openError, setOpenError] = React.useState(false);
        const [error, setError] = useState(false);
        const [errorText, setErrorText] = useState("");

        useEffect(() => {
            let ids: any[] = []
            GetWhere('stage', {'type': StageType.POOL}).then(stage => setStage(stage))
            contest.teams.map((team, index) => ids = [...ids, team.id])
            setTeamsIds(ids)
        }, [contest.teams]);

        const randomizer = async () => {
            if (teamsIds)
                if (teamsIds.length % 2 !== 0 || teamsIds.length === 0) {
                    if (teamsIds.length % 2 !== 0)
                        displayError(setOpenError, setErrorText, setError,"Le nombre d'équipe n'est pas de paire !");
                    if (teamsIds.length === 0)
                        displayError(setOpenError, setErrorText, setError,"Il n'y a pas d'équipe");
                    return
                } else {
                    let randomMatch: any[] = []
                    let teamsIdsLength: number = teamsIds?.length ?? 0
                    let matchIds: number[] = []
                    let poolIds: number[] = []
                    let value: number = 0
                    let poolTeamNumber: number = +contest.params.poolNumber
                    let poolTeam: any[] = []

                    let from = 0
                    let to = +poolTeamNumber
                    for (let i = 0; i < +teamsIdsLength / +poolTeamNumber; i++) {//tant que je n'ai pas le nombre de pool
                        console.log('pool', i)
                        poolTeam = teamsIds.slice(from, to)
                        console.log('  slice', from, '-', to)


                        // eslint-disable-next-line array-callback-return
                        poolTeam?.map((id: any, index) => {
                            for (let i = id; i <= to; i++) {
                                if (id !== i) {
                                    console.log('  match', id, '-', i)
                                    randomMatch.push([id, i])
                                    Add('match', {
                                        scoreTeamA: 0,
                                        scoreTeamB: 0,
                                        teamA: id,
                                        teamB: i
                                    })
                                    value++
                                    matchIds.push(value)
                                }
                            }

                        })
                        from += +poolTeamNumber
                        to += +poolTeamNumber

                        const pool = await Add('pool', {matchs: matchIds, stage: 1, teams :poolTeam})
                        poolIds.push(pool.id)
                        matchIds = []
                    }


                    console.log('random match', randomMatch)
                    randomMatch = []
                    /* const pool = await Add('pool', {matchs: matchIds, stage: 1})*/
                    // let lastId = matchIds.pop()
                    // matchIds = (lastId) ? [lastId] : []

                    GetContest().then((contest: Contest) => {
                        localStorage.setItem("contest", JSON.stringify(contest));
                        contestObserver.next(contest)
                    })
                    Update('stage', stage.id, {pools: poolIds}).then(() => {
                        setOpenSuccess(true);
                        setTimeout(() => setOpenSuccess(false), 2000)
                    })
                    nextStep((e:any) => ['pool', false, true, false])
                    localStorage.setItem('view', JSON.stringify(['pool', false, true, false]))
                }
        }


        const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
            if (reason === 'clickaway') {
                return;
            }

            setOpenSuccess(false);
            setOpenError(false);
        };

        return (
            !error ?
                <>
                    <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleClose}
                              anchorOrigin={{vertical: 'top', horizontal: 'left'}}>
                        <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                            Les pools ont été générer avec success !
                        </Alert>
                    </Snackbar>
                    <Button variant="contained" onClick={randomizer}>Générer les matchs de {StageType.POOL}</Button>
                </>
                :
                <>
                    <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}
                              anchorOrigin={{vertical: 'top', horizontal: 'left'}}>
                        <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                            {errorText}
                        </Alert>
                    </Snackbar>
                    <Button variant="contained" color="error">Générer les pools {StageType.POOL}</Button>
                </>
        );
    }
;

export default PoolGenerator;
