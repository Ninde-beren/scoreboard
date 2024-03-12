import React, {FC, useEffect, useState} from 'react';
import Update from "../../request/Update";
import {Alert, Box, Button, Snackbar, Stack, Typography} from "@mui/material";
import {Stage} from "../../_types/Stage";
import {StageType} from "../../_types/StageType";
import {Contest} from "../../_types/Contest";
import GetStage from "../../request/GetStage";
import {displayError} from "../utils";
import {SubContest} from "../../_types/SubContest";
import GetContest from "../../request/GetContest";

const Podium: FC<{ contest: Contest, subContest: any, nextStep: any }> = ({contest, subContest, nextStep}) => {

    const [final, setFinal] = React.useState<Stage>();
    const [semiFinal, setSemiFinal] = React.useState<Stage>();
    const [one, setOne] = useState<any>();
    const [two, setTwo] = useState<any>();
    const [three, setThree] = useState<any>();
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [openError, setOpenError] = React.useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        GetStage({'type': StageType.FINAL, 'subContest': subContest}).then((stage) => setFinal(stage))
        GetStage({'type': StageType.SEMI_FINAL, 'subContest': subContest}).then((stage) => setSemiFinal(stage))
    }, []);

    const podium = async () => {
        let newFinal = await GetStage({'type': StageType.FINAL, 'subContest': subContest});
        setFinal(newFinal)
        console.log('podium', final)
        if (final && !final.matchs[0].winner) {
            displayError(setOpenError, setErrorText, setError, "Veuillez remplir les scores")
            return
        }
        if (final && semiFinal) {
            await setOne(final.matchs[0].winner);
            if (one)
                await setTwo(final.matchs[0].teamA.id === one.id ? final.matchs[0].teamB : final.matchs[0].teamA);
            if (one && two) {
                let loserMatch1SemiFinal = (semiFinal.matchs[0].teamA.id === one.id || semiFinal.matchs[0].teamA.id === two.id) ?
                    {team: semiFinal.matchs[0].teamB, score: semiFinal.matchs[0].scoreTeamB}
                    : {team: semiFinal.matchs[0].teamA, score: semiFinal.matchs[0].scoreTeamA};
                let loserMatch2SemiFinal = (semiFinal.matchs[1].teamA.id === one.id || semiFinal.matchs[1].teamA.id === two.id) ?
                    {team: semiFinal.matchs[1].teamB, score: semiFinal.matchs[1].scoreTeamB}
                    : {team: semiFinal.matchs[1].teamA, score: semiFinal.matchs[1].scoreTeamA};
                console.log(semiFinal.matchs[0].teamA.id === one.id || semiFinal.matchs[0].teamA.id === two.id)
                if (loserMatch1SemiFinal.score === loserMatch2SemiFinal.score)
                    await setThree(loserMatch1SemiFinal.team.score > loserMatch2SemiFinal.team.score ? loserMatch1SemiFinal.team : loserMatch2SemiFinal.team)
                else
                    await setThree((loserMatch1SemiFinal.score > loserMatch2SemiFinal.score) ? loserMatch1SemiFinal.team : loserMatch2SemiFinal.team);
            }
            if (one && two && three) {
                let data = {[subContest]: {one: one, two: two, three: three}}
                GetContest().then((contest: Contest) => {
                    Update('contest', 1, {winners: {...contest.winners, ...data}}).then((contest: Contest) => {
                        localStorage.setItem("contest", JSON.stringify(contest));
                    })
                })
                setOpenSuccess(true)
                setTimeout(() => setOpenSuccess(false), 2000)
                nextStep(["tournament", false, false, true])
            }
        }
    }

    // @ts-ignore
    return (
        <>
            {(final && semiFinal && final.matchs[0]?.winner && contest.winners[subContest]) ?
                subContest === SubContest.CONSOLANTE ?
                    <Box>
                        <Stack spacing={2} justifyContent="center" alignItems="center">
                            <img className="cup2" src="/cups/fourth.svg" alt="logo"/>
                            <Typography variant="h3"> {contest.winners[subContest].one.name}</Typography>
                        </Stack>
                    </Box>
                    :
                    <Box>
                        <Stack direction="row" justifyContent="space-evenly" alignItems="flex-end">
                            <Stack spacing={2} justifyContent="center" alignItems="center">
                                <img className="cup2" src="/cups/second.svg" alt="logo"/>
                                <Typography variant="h3"> {contest.winners[subContest].two.name}</Typography>
                            </Stack>
                            <Stack spacing={2} justifyContent="center" alignItems="center">
                                <img className="cup" src="/cups/first.svg" alt="logo"/>
                                <Typography variant="h3">{contest.winners[subContest].one.name}</Typography>
                            </Stack>
                            <Stack spacing={2} justifyContent="center" alignItems="center">
                                <img className="cup2" src="/cups/third.svg" alt="logo"/>
                                <Typography variant="h3"> {contest.winners[subContest].three.name}</Typography>
                            </Stack>
                        </Stack>
                        <Button variant="contained" onClick={podium}>Générer le podium</Button>
                    </Box>
                :
                <Button variant="contained" onClick={podium}>Générer le podium</Button>
            }
            {!error ?
                <Snackbar open={openSuccess} autoHideDuration={6000} onClose={() => setOpenSuccess(false)}
                          anchorOrigin={{vertical: 'top', horizontal: 'left'}}>
                    <Alert onClose={() => setOpenSuccess(false)} severity="success" sx={{width: '100%'}}>
                        Le podium a été générer avec success !
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

export default Podium;
