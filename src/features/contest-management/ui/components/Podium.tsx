import { refreshContestState } from '@features/contest-management/application/services/contestSync';
import { PodiumProps } from '@features/contest-management/domain/model/contestUi.model';
import GetStage from '@features/contest-management/infra/db/GetStage';
import Update from '@features/contest-management/infra/db/Update';
import { Alert, Box, Button, Snackbar, Stack, Typography } from '@mui/material';
import { useTimeouts } from '@shared/lib/useTimeouts';
import { displayError } from '@shared/lib/utils';
import { Stage } from '@shared/model/Stage';
import { StageType } from '@shared/model/StageType';
import { SubContest } from '@shared/model/SubContest';
import React, { useEffect, useState } from 'react';

const Podium = ({ contest, subContest, nextStep, readOnly }: PodiumProps) => {
  const { setSafeTimeout } = useTimeouts();
  const [final, setFinal] = React.useState<Stage>();
  const [semiFinal, setSemiFinal] = React.useState<Stage>();
  const [one, setOne] = useState<any>();
  const [two, setTwo] = useState<any>();
  const [three, setThree] = useState<any>();
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    GetStage({ type: StageType.FINAL, subContest: subContest }).then((stage) => setFinal(stage));
    GetStage({ type: StageType.SEMI_FINAL, subContest: subContest }).then((stage) =>
      setSemiFinal(stage)
    );
  }, [subContest]);

  const podium = async () => {
    let newFinal = await GetStage({ type: StageType.FINAL, subContest: subContest });
    setFinal(newFinal);
    if (final && !final.matchs[0].winner) {
      displayError(
        setOpenError,
        setErrorText,
        setError,
        'Veuillez remplir les scores',
        setSafeTimeout
      );
      return;
    }
    if (final && semiFinal) {
      setOne(final.matchs[0].winner);
      if (one)
        setTwo(final.matchs[0].teamA.id === one.id ? final.matchs[0].teamB : final.matchs[0].teamA);
      if (one && two) {
        let loserMatch1SemiFinal =
          semiFinal.matchs[0].teamA.id === one.id || semiFinal.matchs[0].teamA.id === two.id
            ? { team: semiFinal.matchs[0].teamB, score: semiFinal.matchs[0].scoreTeamB }
            : { team: semiFinal.matchs[0].teamA, score: semiFinal.matchs[0].scoreTeamA };
        let loserMatch2SemiFinal =
          semiFinal.matchs[1].teamA.id === one.id || semiFinal.matchs[1].teamA.id === two.id
            ? { team: semiFinal.matchs[1].teamB, score: semiFinal.matchs[1].scoreTeamB }
            : { team: semiFinal.matchs[1].teamA, score: semiFinal.matchs[1].scoreTeamA };
        if (loserMatch1SemiFinal.score === loserMatch2SemiFinal.score)
          setThree(
            loserMatch1SemiFinal.team.score > loserMatch2SemiFinal.team.score
              ? loserMatch1SemiFinal.team
              : loserMatch2SemiFinal.team
          );
        else
          setThree(
            loserMatch1SemiFinal.score > loserMatch2SemiFinal.score
              ? loserMatch1SemiFinal.team
              : loserMatch2SemiFinal.team
          );
      }
      if (one && two && three) {
        const data = { [subContest]: { one: one, two: two, three: three } };
        await Update('contest', 1, { winners: { ...contest.winners, ...data } });
        await refreshContestState();
        setOpenSuccess(true);
        setSafeTimeout(() => setOpenSuccess(false), 2000);
        nextStep(['tournament', false, false, true]);
      }
    }
  };

  return (
    <>
      {final && semiFinal && final.matchs[0]?.winner && contest.winners[subContest] ? (
        subContest === SubContest.CONSOLANTE ? (
          <Box>
            <Stack spacing={2} justifyContent="center" alignItems="center">
              <img className="cup2" src="/cups/fourth.svg" alt="logo" />
              <Typography variant="h3"> {contest.winners[subContest].one.name}</Typography>
            </Stack>
          </Box>
        ) : (
          <Box>
            <Stack direction="row" justifyContent="space-evenly" alignItems="flex-end">
              <Stack spacing={2} justifyContent="center" alignItems="center">
                <img className="cup2" src="/cups/second.svg" alt="logo" />
                <Typography variant="h3"> {contest.winners[subContest].two.name}</Typography>
              </Stack>
              <Stack spacing={2} justifyContent="center" alignItems="center">
                <img className="cup" src="/cups/first.svg" alt="logo" />
                <Typography variant="h3">{contest.winners[subContest].one.name}</Typography>
              </Stack>
              <Stack spacing={2} justifyContent="center" alignItems="center">
                <img className="cup2" src="/cups/third.svg" alt="logo" />
                <Typography variant="h3"> {contest.winners[subContest].three.name}</Typography>
              </Stack>
            </Stack>
            {!readOnly && (
              <Button variant="contained" onClick={podium}>
                Générer le podium
              </Button>
            )}
          </Box>
        )
      ) : (
        !readOnly && (
          <Button variant="contained" onClick={podium}>
            Générer le podium
          </Button>
        )
      )}
      {!error ? (
        <Snackbar
          open={openSuccess}
          autoHideDuration={6000}
          onClose={() => setOpenSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Alert onClose={() => setOpenSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Le podium a été générer avec success !
          </Alert>
        </Snackbar>
      ) : (
        <Snackbar
          open={openError}
          autoHideDuration={6000}
          onClose={() => setOpenError(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Alert onClose={() => setOpenError(false)} severity="error" sx={{ width: '100%' }}>
            {errorText}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Podium;
