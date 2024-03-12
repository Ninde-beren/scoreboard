import React, {FC, useEffect} from 'react';
import TeamBuilding from "../component/scoreViewer/TeamBuilding";
import ScoreboardPools from "../component/scoreViewer/ScoreboardPools";
import ScoreBoardTournament from "../component/scoreViewer/ScoreBoardTournament";
import {Box, Stack, Typography} from "@mui/material";
import Ranking from "../component/scoreViewer/Ranking";
import TabPanel from "../component/TabPanel";
import Podium from "../component/scoreViewer/Podium";

const ScoreViewer: FC = () => {

    const [loading, setLoading] = React.useState(true);
    const [value, setValue] = React.useState(1);

    const [contest, setContest] = React.useState<any>();

    // enlever les pub si don --> IP + adresse mail + code
    const onStorageUpdate = (e: any) => {
        const {key, newValue} = e;
        if (key === "contest") {
            (localStorage.getItem('contest') !== null) ?
                setContest(JSON.parse(newValue)) : setContest(false);
        }
    if (key === "viewerPage") {
        if (localStorage.getItem('viewerPage') !== null)
            setValue(Number(localStorage.getItem('viewerPage')) ?? 0);
    }
    };


    useEffect(() => {
        console.log(localStorage.getItem('contest'))
        if (localStorage.getItem('contest') !== null)
            setContest(JSON.parse(localStorage.getItem('contest') ?? ""));
        if (localStorage.getItem('viewerPage') !== null)
            setValue(Number(localStorage.getItem('viewerPage')) ?? 0);
        window.addEventListener("storage", onStorageUpdate);
        return () => {
            window.removeEventListener("storage", onStorageUpdate);
        };
    }, []);

    useEffect(() => {
        window.addEventListener("storage", onStorageUpdate);
        return () => {
            window.removeEventListener("storage", onStorageUpdate);
        };
    }, []);

    console.log('observable scoreviewer', contest)
   useEffect(() => {
   //  setTimeout(() => {
         setLoading(false)
   //      setTimeout(() => {
   //          setValue(value + 1)
   //          if (value === 4) setValue(0)
   //      }, 20000)
   //  }, 2000)
   //  setLoading(true)
    }, [value]);


    return (
        contest ?
            <>
                <Box sx={{p: 1, backgroundColor: '#C32533'}}>
                    <Typography variant="h2" fontWeight="bold">{contest?.name}</Typography>
                </Box>
                <Stack justifyContent="center" alignItems="center" spacing={1}>
                    {!loading ?
                        <>
                            <TabPanel value={value} index={0}>
                                <TeamBuilding contest={contest}/>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <ScoreboardPools contest={contest}/>
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <ScoreBoardTournament contest={contest}/>
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <Ranking contest={contest}/>
                            </TabPanel>
                            <TabPanel value={value} index={4}>
                                <Podium contest={contest}/>
                            </TabPanel>
                        </> :
                        <Box marginTop={30}>
                            <img className="logo" width={500} src="/sit_character.png" alt="logo"/>
                        </Box>
                    }
                </Stack>
            </>
            :
            <Stack sx={{height:'100vh'}} justifyContent="center">
            <Typography variant="h2" >Le concours n'est pas encore démarrer !</Typography>
            </Stack>
    )
}
export default ScoreViewer



