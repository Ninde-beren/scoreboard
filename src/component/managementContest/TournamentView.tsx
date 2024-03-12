import React, {FC, useState} from 'react';
import {Box, Stack, Tab, Tabs} from "@mui/material";
import {SubContest} from "../../_types/SubContest";
import TabPanel from "../TabPanel";
import {StageType} from "../../_types/StageType";
import Podium from "./Podium";
import MatchGenerator from "../../request/MatchGenerator";
import {Contest} from "../../_types/Contest";
import Match from "./Match";
import {dataOnSide} from "../../_styles/Style";

const TournamentView: FC<{ contest: Contest, view:[], setView:any }> = ({contest,view, setView}) => {
    const [tournament, setTournament] = useState(0);
    const [tournamentContest, setTournamentContest] = useState(0);
    const types = [StageType.EIGHTER_FINAL, StageType.QUARTER_FINAL, StageType.SEMI_FINAL, StageType.FINAL]
    return (
        <>
            <Box sx={{borderBottom: 0.2, borderColor: 'divider', bgcolor: "#C32533"}}>
                <Tabs value={tournamentContest} onChange={(e, nv) => setTournamentContest(nv)}
                      variant="fullWidth" aria-label="basic tabs example">
                    <Tab label="Principale"/>
                    <Tab label="Consolante" sx={{color: "white !important"}}/>
                </Tabs>
            </Box>
            {[SubContest.PRINCIPALE, SubContest.CONSOLANTE].map((subContest, index) =>
                <TabPanel key={index +'-'+ subContest} value={tournamentContest} index={index}>
                    <Box sx={{borderBottom: 1, borderColor: 'divider', bgcolor: "#C32533"}}>
                        <Tabs value={tournament} onChange={(e, nv) => setTournament(nv)}
                              variant="fullWidth" aria-label="basic tabs example">
                            {types.map((type, index) =>
                                <Tab key={index} label={type}/>
                            )}
                        </Tabs>
                    </Box>
                    {types.map((type, index) =>
                        <TabPanel key={index+'-'+type+'-'+subContest} index={tournament} value={index}>
                            <Box>
                                {(type === StageType.FINAL) ?
                                    <Podium contest={contest} subContest={subContest} nextStep={setView}/>
                                    : <MatchGenerator subContest={subContest} stageType={type}
                                                      nextStageType={types[index + 1]}
                                                      step={view}
                                                      nextStep={setView}/>
                                }
                                <Box>
                                    <Stack spacing={2}>
                                        {contest.stages.map((stage, indexStage) =>
                                            <Box key={index+'-'+type+'-'+subContest+'-'+stage.id}>
                                                {(stage.type === type && stage.subContest === subContest) &&
                                                    <Box key={indexStage} sx={dataOnSide}>
                                                        {stage.matchs.map((match, index) =>
                                                            <Match key={index} match={match}/>
                                                        )}
                                                    </Box>
                                                }

                                            </Box>
                                        )}
                                    </Stack>
                                </Box>
                            </Box>
                        </TabPanel>
                    )}
                </TabPanel>
            )}
        </>
    );
};

export default TournamentView;
