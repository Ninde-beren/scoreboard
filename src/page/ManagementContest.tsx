import React, {FC, useEffect, useState, useTransition} from 'react';
import {Button, Divider, Stack} from "@mui/material";
import {Contest} from "../_types/Contest";
import GetContest from "../request/GetContest";
import {contestObserver} from "../App";
import {db} from "../db";
import PoolGenerator from "../request/PoolGenerator";
import AddTeam2 from "../forms/AddTeam2";
import TeamView from "../component/managementContest/TeamView";
import EditPoolScore from "../component/managementContest/EditPoolScore";
import MatchOutPoolGenerator from "../request/MatchOutPoolGenerator";
import AddContest from "../forms/AddContest";
import TournamentView from "../component/managementContest/TournamentView";

const ManagementContest: FC = () => {
    const [contest, setContest] = useState<Contest | false>();
    const [view, setView] = useState<any>();
    const [loading, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
            GetContest().then((contest: Contest) => {
                contestObserver.next(contest)
                setContest(contest)
            })
            setView(['team', true, false, false])
            let viewData = localStorage.getItem('view')
            if (viewData) {
                setView(JSON.parse(String(viewData)))
            }

        })
    }, []);

    useEffect(() => {
        const observer = contestObserver.subscribe((e) => setContest(e))
        return () => {
            observer.unsubscribe()
        };
    }, []);

    useEffect(() => {
        console.log('view', view)
    }, [view]);

    const reset = () => {
        setView(['team', true, false, false])
        localStorage.setItem('contest', 'undefined')
        localStorage.clear()
        db.delete()
        db.open()
        contestObserver.next(false)
    }

    // enlever les pub si don --> IP + adresse mail + code
    const newWindow = () => window.open(process.env.REACT_APP_BASE_URL + "/scoreboard");
    console.log('observable managementcontest', contest)

    return (
        !localStorage.getItem('contest') ?
            <>
                <AddContest/>
                <Button variant="contained" onClick={reset}>reset</Button>
            </>
            :
            contest ?
                <>
                    <Stack direction="row" spacing={2} padding={2} justifyContent="space-between">
                        <>
                            <Stack spacing={2} justifyContent="center">
                                <Button onClick={newWindow} variant="contained">open window</Button>
                                <Button variant="contained" onClick={reset}>reset</Button>
                            </Stack>
                        </>

                        {(view[1]) &&
                            <AddTeam2/>
                        }
                        <Stack direction="row" spacing={2} padding={2} justifyContent="space-evenly">
                            {(view[1]) &&
                                <PoolGenerator contest={contest} nextStep={setView}/>
                            }
                            {(view[2]) &&
                                <>
                                    <Button onClick={() => localStorage.setItem('viewerPage', '0')}>Equipes</Button>
                                    <Button onClick={() => localStorage.setItem('viewerPage', '1')}>Poules</Button>
                                    <Button onClick={() => localStorage.setItem('viewerPage', '3')}>Classement</Button>
                                    {view[0] === 'pool' &&
                                        <MatchOutPoolGenerator step={view}
                                                               nextStep={setView}/>}
                                </>
                            }
                            {(view[2] && view[3]) ?
                                <>
                                    <Button onClick={() => localStorage.setItem('viewerPage', '2')}>Tournois</Button>
                                    {((view[0] === 'team' || view[0] === 'pool') && view[3]) &&
                                        <Button variant="contained"
                                                onClick={() => setView(() => ['tournament', false, true, true])}>Tournoi</Button>}
                                    {(view[0] === 'pool' || view[0] === 'tournament') &&
                                        <Button variant="contained"
                                                onClick={() => setView(['team', false, true, true])}>Equipes</Button>}
                                    {((view[0] === 'team' || view[0] === 'tournament') && !view[1]) &&
                                        <Button variant="contained"
                                                onClick={() => setView(() => ['pool', false, true, true])}>Pool</Button>}
                                </>
                                : (!view[2] && view[3]) ?
                                    <>
                                        <Button onClick={() => localStorage.setItem('viewerPage', '2')}>Tournois</Button>
                                        <Button onClick={() => localStorage.setItem('viewerPage', '4')}>Podium</Button>
                                        {((view[0] === 'team' || view[0] === 'pool') && view[3]) &&
                                            <Button variant="contained"
                                                    onClick={() => setView(() => ['tournament', false, false, true])}>Tournoi</Button>}
                                        {(view[0] === 'pool' || view[0] === 'tournament') &&
                                            <Button variant="contained"
                                                    onClick={() => setView(['team', false, false, true])}>Equipes</Button>}
                                        {((view[0] === 'team' || view[0] === 'tournament') && !view[1]) &&
                                            <Button variant="contained"
                                                    onClick={() => setView(() => ['pool', false, false, true])}>Pool</Button>}
                                    </>
                                    :
                                    <>
                                        {((view[0] === 'team' || view[0] === 'pool') && view[3]) &&
                                            <Button variant="contained"
                                                    onClick={() => setView(() => ['tournament', false, true, false])}>Tournoi</Button>}
                                        {(view[0] === 'pool' || view[0] === 'tournament') &&
                                            <Button variant="contained"
                                                    onClick={() => setView(['team', false, true, false])}>Equipes</Button>}
                                        {((view[0] === 'team' || view[0] === 'tournament') && !view[1]) &&
                                            <Button variant="contained"
                                                    onClick={() => setView(() => ['pool', false, true, false])}>Pool</Button>}
                                    </>

                            }
                        </Stack>
                    </Stack>
                    <Divider
                        sx={{borderImage: 'linear-gradient(210deg, #4a9ad5, #ffffff, #C32533, #ffffff, #4a9ad5)1'}}/>
                    {
                        (view[0] === 'team') &&
                        <TeamView contest={contest}/>
                    }
                    {
                        (view[0] === 'pool') &&
                        <EditPoolScore contest={contest}/>
                    }
                    {
                        view[0] === 'tournament' &&
                        <TournamentView contest={contest} view={view} setView={setView}/>
                    }
                </>
                :
                <img className="logo" width={500} src="/sit_character.png" alt="logo"/>
    )
}

export default ManagementContest;
