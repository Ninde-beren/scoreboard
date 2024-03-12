import React, {FC, useEffect, useState} from 'react';
import {Box, Divider, Stack, Typography, Zoom} from "@mui/material";
import {Stage} from "../../_types/Stage";
import {Contest} from "../../_types/Contest";
import {notSkew, stageHeaderStyle} from "../../_styles/Style";
import EditMatchScore from "./scoreBoardTournament/EditMatchScore";
import TabPanel from "../TabPanel";
import {StageType} from "../../_types/StageType";
import {SubContest} from "../../_types/SubContest";

const ScoreBoardTournament: FC<{ contest: Contest }> = ({contest}) => {
    const [value, setValue] = useState(0);
    const [checked, setChecked] = React.useState(true);

    useEffect(() => {
             setTimeout(() => {
                 setChecked(false)
                 setTimeout(() => {
                     setValue(value + 1)
                     if (value === 1) {
                         setValue(0)
                     }
                 }, 250)
             }, 20000)
             setChecked(true)
    }, [value]);

    return (
        <>
            {[SubContest.PRINCIPALE, SubContest.CONSOLANTE].map((subContest, index) => (
                <TabPanel key={index} value={value} index={index}>
                    <Zoom in={checked} timeout={250}>
                        <Box>
                            <Box sx={[stageHeaderStyle, {marginY:-5}]}>
                                <Typography variant="h3" sx={notSkew}>{subContest}</Typography>
                            </Box>
                            <Stack direction="row" spacing={20}>
                                {contest?.stages.map((stage: Stage, stageIndex: number) => (
                                    (stage.type !== StageType.POOL && stage.subContest === subContest) &&
                                    <Stack key={stageIndex + '-stage'} spacing={4} alignItems="center">
                                        <Box sx={[stageHeaderStyle, {mt:7, width: 285}]}>
                                            <Typography variant="h4" sx={notSkew}>{stage?.type}</Typography>
                                        </Box>
                                        <Stack spacing={2} alignItems="center">
                                            <EditMatchScore stage={stage}/>
                                        </Stack>
                                        <Divider/>
                                    </Stack>
                                ))}
                            </Stack>
                        </Box>
                    </Zoom>
                </TabPanel>
            ))}
        </>
    );
};

export default ScoreBoardTournament;
