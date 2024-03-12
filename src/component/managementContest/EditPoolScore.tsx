import React, {FC} from 'react';
import {Contest} from "../../_types/Contest";
import {StageType} from "../../_types/StageType";
import Match from "./Match";
import {Box, Stack, Typography} from "@mui/material";
import {dataOnSide, notSkew, poolHeaderStyle} from "../../_styles/Style";
import {poolName} from "../scoreViewer/ScoreboardPools";

const EditPoolScore: FC<{ contest: Contest }> = ({contest}) => {
    return (
        <>
            {contest.stages.map((stage, indexStage) =>
                stage.type === StageType.POOL &&
                <Stack  key={indexStage} direction="row" flexWrap="wrap" justifyContent="space-evenly"spacing={15}>
                    {stage.pools.map((pool, indexPool) =>
                        <Stack key={indexPool}
                               justifyContent="center"
                               sx={[/*dataOnSide, */ {transform: 'skewX(-15deg)', p: 2}]}>
                            <Box sx={poolHeaderStyle}>
                                <Typography variant="h6"
                                            sx={notSkew}>Poule {poolName[pool.id - 1]}</Typography>
                            </Box>
                            {pool.matchs.map((match, index: number) =>
                                <Box key={indexPool + '-' + index} sx={dataOnSide}>
                                <Match match={match} noNumber/>
                                </Box>
                            )}
                        </Stack>
                    )}
                </Stack>
            )}
        </>
    )
};

export default EditPoolScore
