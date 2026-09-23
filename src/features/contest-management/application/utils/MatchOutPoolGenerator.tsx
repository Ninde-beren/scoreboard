import { refreshContestState } from '@features/contest-management/application/services/contestSync';
import { MatchOutPoolGeneratorProps } from '@features/contest-management/domain/model/contestUi.model';
import GetContest from '@features/contest-management/infra/db/GetContest';
import GetWhere from '@features/contest-management/infra/db/GetWhere';
import Update from '@features/contest-management/infra/db/Update';
import { Alert, Button, Snackbar } from '@mui/material';
import { Stage } from '@shared/model/Stage';
import { StageType } from '@shared/model/StageType';
import { SubContest } from '@shared/model/SubContest';
import React, { useEffect, useState } from 'react';

const MatchOutPoolGenerator = ({ step: _step }: MatchOutPoolGeneratorProps) => {
  const [stage, setStage] = React.useState<Stage>();
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [error, _setError] = useState(false);
  const [errorText, _setErrorText] = useState('');

  useEffect(() => {
    void refreshContestState();
    GetWhere('stage', {
      type: StageType.EIGHTER_FINAL,
      subContest: SubContest.PRINCIPALE,
    }).then((stage) => setStage(stage));
  }, []);

  const triche = async () => {
    const contest = await GetContest();
    if (!contest) return;
    for (const stage of contest.stages ?? []) {
      if (stage.type !== StageType.POOL) continue;
      for (const pool of stage.pools ?? []) {
        for (const match of pool.matchs ?? []) {
          await Update('match', match.id, {
            scoreTeamA: 4,
            scoreTeamB: 6,
            winner: match.teamB.id,
          });
        }
      }
    }
    await refreshContestState();
  };

  return (
    <>
      {stage && (
        <>
          <Button variant="contained" onClick={triche}>
            score auto
          </Button>
          {!error ? (
            <Snackbar
              open={openSuccess}
              autoHideDuration={6000}
              onClose={() => setOpenSuccess(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <Alert
                onClose={() => setOpenSuccess(false)}
                severity="success"
                sx={{ width: '100%' }}
              >
                Les pools ont été générer avec success !
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
      )}
    </>
  );
};
export default MatchOutPoolGenerator;
