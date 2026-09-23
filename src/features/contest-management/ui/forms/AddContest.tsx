import { refreshContestState } from '@features/contest-management/application/services/contestSync';
import Add from '@features/contest-management/infra/db/Add';
import Update from '@features/contest-management/infra/db/Update';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { StageType } from '@shared/model/StageType';
import { SubContest } from '@shared/model/SubContest';
import React, { useState } from 'react';

const AddContest = () => {
  const [name, setName] = useState('');
  const teamNumber = '2';
  const poolNumber = '4';
  const add = () => {
    Add('contest', { name: name, stages: [], teams: [], date: new Date("now"), winners: [] }).then(
      async (contest) => {
        const params = await Add('params', { teamNumber: teamNumber, poolNumber: poolNumber });
        const contestParam = await Update('contest', contest.id, { params: params.id });

        const stage = await Add('stage', { type: StageType.POOL, pools: [] });
        const contest1 = await Update('contest', contestParam.id, { stages: [stage.id] });

        const stage2 = await Add('stage', {
          type: StageType.EIGHTER_FINAL,
          matchs: [],
          subContest: SubContest.PRINCIPALE,
          totalMatchs: 8,
        });
        const stage21 = await Add('stage', {
          type: StageType.EIGHTER_FINAL,
          matchs: [],
          subContest: SubContest.CONSOLANTE,
          totalMatchs: 8,
        });
        const contest2 = await Update('contest', contest.id, {
          stages: [...contest1.stages, stage2.id, stage21.id],
        });

        const stage3 = await Add('stage', {
          type: StageType.QUARTER_FINAL,
          matchs: [],
          subContest: SubContest.PRINCIPALE,
          totalMatchs: 4,
        });
        const stage31 = await Add('stage', {
          type: StageType.QUARTER_FINAL,
          matchs: [],
          subContest: SubContest.CONSOLANTE,
          totalMatchs: 4,
        });
        const contest3 = await Update('contest', contest.id, {
          stages: [...contest2.stages, stage3.id, stage31.id],
        });

        const stage4 = await Add('stage', {
          type: StageType.SEMI_FINAL,
          matchs: [],
          subContest: SubContest.PRINCIPALE,
          totalMatchs: 2,
        });
        const stage41 = await Add('stage', {
          type: StageType.SEMI_FINAL,
          matchs: [],
          subContest: SubContest.CONSOLANTE,
          totalMatchs: 2,
        });
        const contest4 = await Update('contest', contest.id, {
          stages: [...contest3.stages, stage4.id, stage41.id],
        });

        const stage5 = await Add('stage', {
          type: StageType.FINAL,
          matchs: [],
          subContest: SubContest.PRINCIPALE,
          totalMatchs: 1,
        });
        const stage51 = await Add('stage', {
          type: StageType.FINAL,
          matchs: [],
          subContest: SubContest.CONSOLANTE,
          totalMatchs: 1,
        });
        await Update('contest', contest.id, {
          stages: [...contest4.stages, stage5.id, stage51.id],
        });

        await refreshContestState();
      }
    );
  };

  return (
    <Container>
      <Stack height="100vh" alignItems="center" justifyContent="center" spacing={2}>
        <Typography variant="h4" padding={1}>
          Quel est le nom de votre concours ?{' '}
        </Typography>
        <Paper>
          <TextField type="text" value={name} onChange={(ev) => setName(ev.target.value)} />
        </Paper>
        <Box width={450}>
          <Button sx={{ mt: 2, p: 1 }} variant="contained" fullWidth onClick={add}>
            Go !
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

const buttonColors = {
  color: '#4A9AD5',
  '&.Mui-checked': {
    color: '#C32533',
  },
};
export default AddContest;
