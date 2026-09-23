import { ScoreboardPoolsProps } from '@features/contest-viewer/domain/model/scoreboardUi.model';
import { Box, Stack, Typography, Zoom } from '@mui/material';
import { poolName } from '@shared/lib/poolName';
import { useTimeouts } from '@shared/lib/useTimeouts';
import { Pool as PoolType } from '@shared/model/Pool';
import { Stage } from '@shared/model/Stage';
import { StageType } from '@shared/model/StageType';
import TabPanel from '@shared/ui/components/TabPanel';
import { notSkew, poolHeaderStyle, stageHeaderStyle } from '@shared/ui/styles/Style';
import { useEffect, useState } from 'react';

import Pool from './scoreBoardPools/Pool';

const ScoreboardPools = ({ contest }: ScoreboardPoolsProps) => {
  const { setSafeTimeout } = useTimeouts();
  const [value, setValue] = useState(0);
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    let innerTimeoutId: ReturnType<typeof setTimeout> | undefined;
    const outerTimeoutId = setSafeTimeout(() => {
      setChecked(false);
      innerTimeoutId = setSafeTimeout(() => {
        setValue((prev) => {
          const next = prev + 2;
          const max = contest.teams.length / contest.params.poolNumber / 2 + 2;
          return prev === max ? 0 : next;
        });
      }, 100);
    }, 20000);
    setChecked(true);
    return () => {
      if (innerTimeoutId !== undefined) clearTimeout(innerTimeoutId);
      clearTimeout(outerTimeoutId);
    };
  }, [contest.params.poolNumber, contest.teams.length, setSafeTimeout, value]);

  return (
    <>
      <Box sx={stageHeaderStyle}>
        <Typography variant="h4" sx={notSkew}>
          Parties de poules
        </Typography>
      </Box>
      <br />
      {contest?.stages.map(
        (stage: Stage, indexStage: number) =>
          stage.type === StageType.POOL && (
            <Box key={indexStage}>
              {stage.pools.map(
                (pool, indexPool) =>
                  (indexPool === 0 || indexPool % 2 === 0) && (
                    <TabPanel key={indexPool} value={value} index={indexPool}>
                      <Zoom in={checked} timeout={250}>
                        <Stack key={indexPool + '-stage'} direction="row" spacing={15}>
                          {stage?.pools
                            ?.slice(indexPool, indexPool + 2)
                            .map((pool: PoolType, index: number) => (
                              <Stack
                                key={index}
                                spacing={2}
                                justifyContent="center"
                                sx={[/*dataOnSide, */ { transform: 'skewX(-15deg)' }]}
                              >
                                <Box sx={poolHeaderStyle}>
                                  <Typography variant="h6" sx={notSkew}>
                                    Poule {poolName[pool.id - 1]}
                                  </Typography>
                                </Box>
                                <Pool key={pool.id + '-match'} pool={pool} />
                              </Stack>
                            ))}
                        </Stack>
                      </Zoom>
                    </TabPanel>
                  )
              )}
            </Box>
          )
      )}
    </>
  );
};

export default ScoreboardPools;
