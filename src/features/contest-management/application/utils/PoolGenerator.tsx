import { refreshContestState } from '@features/contest-management/application/services/contestSync';
import { PoolGeneratorProps } from '@features/contest-management/domain/model/contestUi.model';
import Add from '@features/contest-management/infra/db/Add';
import GetWhere from '@features/contest-management/infra/db/GetWhere';
import Update from '@features/contest-management/infra/db/Update';
import { Alert, Button, Snackbar } from '@mui/material';
import { useTimeouts } from '@shared/lib/useTimeouts';
import { displayError } from '@shared/lib/utils';
import { StageType } from '@shared/model/StageType';
import React, { useEffect, useState } from 'react';

const PoolGenerator = ({ contest, nextStep }: PoolGeneratorProps) => {
  const { setSafeTimeout } = useTimeouts();
  const [teamsIds, setTeamsIds] = useState<any[]>();
  const [stage, setStage] = useState<any>();
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    let ids: any[] = [];
    GetWhere('stage', { type: StageType.POOL }).then((stage) => setStage(stage));
    contest.teams.forEach((team) => {
      ids = [...ids, team.id];
    });
    setTeamsIds(ids);
  }, [contest.teams]);

  const randomizer = async () => {
    if (teamsIds)
      if (teamsIds.length % 2 !== 0 || teamsIds.length === 0) {
        if (teamsIds.length % 2 !== 0)
          displayError(
            setOpenError,
            setErrorText,
            setError,
            "Le nombre d'équipe n'est pas de paire !",
            setSafeTimeout
          );
        if (teamsIds.length === 0)
          displayError(
            setOpenError,
            setErrorText,
            setError,
            "Il n'y a pas d'équipe",
            setSafeTimeout
          );
        return;
      } else {
        let teamsIdsLength: number = teamsIds?.length ?? 0;
        let matchIds: number[] = [];
        let poolIds: number[] = [];
        let value: number = 0;
        let poolTeamNumber: number = +contest.params.poolNumber;
        let poolTeam: any[] = [];

        let from = 0;
        let to = +poolTeamNumber;
        for (let i = 0; i < +teamsIdsLength / +poolTeamNumber; i++) {
          //tant que je n'ai pas le nombre de pool
          poolTeam = teamsIds.slice(from, to);

          poolTeam?.forEach((id: any) => {
            for (let i = id; i <= to; i++) {
              if (id !== i) {
                Add('match', {
                  scoreTeamA: 0,
                  scoreTeamB: 0,
                  teamA: id,
                  teamB: i,
                });
                value++;
                matchIds.push(value);
              }
            }
          });
          from += +poolTeamNumber;
          to += +poolTeamNumber;

          const pool = await Add('pool', { matchs: matchIds, stage: 1, teams: poolTeam });
          poolIds.push(pool.id);
          matchIds = [];
        }
        /* const pool = await Add('pool', {matchs: matchIds, stage: 1})*/
        // let lastId = matchIds.pop()
        // matchIds = (lastId) ? [lastId] : []

        await refreshContestState();
        Update('stage', stage.id, { pools: poolIds }).then(() => {
          setOpenSuccess(true);
          setSafeTimeout(() => setOpenSuccess(false), 2000);
        });
        nextStep((_e: any) => ['pool', false, true, false]);
        localStorage.setItem('view', JSON.stringify(['pool', false, true, false]));
      }
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccess(false);
    setOpenError(false);
  };

  return !error ? (
    <>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Les pools ont été générer avec success !
        </Alert>
      </Snackbar>
      <Button variant="contained" onClick={randomizer}>
        Générer les matchs de {StageType.POOL}
      </Button>
    </>
  ) : (
    <>
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errorText}
        </Alert>
      </Snackbar>
      <Button variant="contained" color="error">
        Générer les pools {StageType.POOL}
      </Button>
    </>
  );
};
export default PoolGenerator;
