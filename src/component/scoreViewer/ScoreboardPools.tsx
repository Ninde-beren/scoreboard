import React, {FC, useEffect, useState} from 'react';
import {Contest} from "../../_types/Contest";
import {Box, Stack, Typography, Zoom} from "@mui/material";
import {Pool as PoolType} from "../../_types/Pool";
import {Stage} from "../../_types/Stage";
import Pool from "./scoreBoardPools/Pool";
import {StageType} from "../../_types/StageType";
import {notSkew, poolHeaderStyle, stageHeaderStyle} from "../../_styles/Style";
import TabPanel from "../TabPanel";

export const poolName = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC','AD', 'AE', 'AF', 'AG', 'AH']


const ScoreboardPools: FC<{ contest: Contest }> = ({contest}) => {
    const [value, setValue] = useState(0);
    const [checked, setChecked] = React.useState(true);


    useEffect(() => {
       setTimeout(() => {
           setChecked(false)
           setTimeout(() => {
               setValue(value + 2)
               if (value === ((contest.teams.length/contest.params.poolNumber)/2+2)) {
                   setValue(0)
               }
           }, 250)
       }, 20000)
        setChecked(true)
    }, [value]);

    return (
        <>
            <Box sx={stageHeaderStyle}>
                <Typography variant="h4" sx={notSkew}>Parties de poules</Typography>
            </Box>
            <br/>
            {contest?.stages.map((stage: Stage, indexStage: number) => (
                stage.type === StageType.POOL &&
                <Box key={indexStage}>
                    {stage.pools.map((pool, indexPool) =>
                        (indexPool === 0 || indexPool % 2 === 0) &&
                        <TabPanel key={indexPool} value={value} index={indexPool}>
                            <Zoom in={checked} timeout={250}>
                                <Stack key={indexPool + '-stage'} direction="row" spacing={15}>
                                    {stage?.pools?.slice(indexPool, indexPool + 2).map((pool: PoolType, index: number) => (
                                        <Stack key={index} spacing={2}
                                               justifyContent="center"
                                               sx={[/*dataOnSide, */ {transform: 'skewX(-15deg)'}]}>
                                            <Box sx={poolHeaderStyle}>
                                                <Typography variant="h6"
                                                            sx={notSkew}>Poule {poolName[pool.id - 1]}</Typography>
                                            </Box>
                                            <Pool key={pool.id + '-match'} pool={pool}/>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Zoom>
                        </TabPanel>
                    )}
                </Box>
            ))}
        </>
    )
}

export default ScoreboardPools;

