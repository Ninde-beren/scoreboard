import { refreshContestState } from '@features/contest-management/application/services/contestSync';
import { AddMatchScoreProps } from '@features/contest-management/domain/model/contestUi.model';
import Update from '@features/contest-management/infra/db/Update';
import {
  Alert,
  Button,
  FormHelperText,
  Modal,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTimeouts } from '@shared/lib/useTimeouts';
import { displayError } from '@shared/lib/utils';
import { modalStyle, popoverStyle } from '@shared/ui/styles/Style';
import React, { useEffect, useState } from 'react';

const AddMatchScore = ({ match, openAction, setOpenAction }: AddMatchScoreProps) => {
  const { setSafeTimeout } = useTimeouts();
  const [scoreTeamA, setScoreTeamA] = useState<number>();
  const [scoreTeamB, setScoreTeamB] = useState<number>();
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const add = async () => {
    if (typeof scoreTeamA === 'number' && typeof scoreTeamB === 'number') {
      if (scoreTeamA === 0 && scoreTeamB === 0) {
        displayError(setOpenError, setErrorText, setError, 'Score invalide', setSafeTimeout);
        return;
      }
      if (scoreTeamA > 20 || scoreTeamB > 20) {
        displayError(setOpenError, setErrorText, setError, 'Score trop élevé !', setSafeTimeout);
        return;
      }
      const winner = scoreTeamA > scoreTeamB ? match.teamA.id : match.teamB.id;
      await Update('team', match.teamA.id, { score: match.teamA.score + scoreTeamA });
      await Update('team', match.teamB.id, { score: match.teamB.score + scoreTeamB });
      await Update('match', match.id, {
        scoreTeamA: scoreTeamA,
        scoreTeamB: scoreTeamB,
        winner: winner,
      });
      await refreshContestState();
      setOpenSuccess(true);
      setSafeTimeout(() => setOpenSuccess(false), 2000);
      handleClose();
    } else {
      displayError(
        setOpenError,
        setErrorText,
        setError,
        'Veuillez saisir les scores',
        setSafeTimeout
      );
    }
  };

  const [open, setOpen] = React.useState(openAction);
  const handleClose = () => {
    setOpen(false);
    setOpenAction(false);
  };

  useEffect(() => {
    setOpen(openAction);
    if (openAction) {
      setScoreTeamA(match.scoreTeamA ?? 0);
      setScoreTeamB(match.scoreTeamB ?? 0);
    }
  }, [openAction, match]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        keepMounted
      >
        <Paper sx={[modalStyle, popoverStyle]}>
          <Typography variant="h3" textAlign="center">
            {' '}
            {match.teamA.name} vs {match.teamB.name}
          </Typography>
          <Stack alignItems="center" spacing={2}>
            <Typography variant="h5" padding={1}>
              Score des équipes ?{' '}
            </Typography>
            <Stack direction="row" spacing={6}>
              <TextField
                label={'Equipe ' + match.teamA.name}
                type="number"
                value={scoreTeamA ?? ''}
                slotProps={{ htmlInput: { inputMode: 'numeric', pattern: '[0-9]*', max: 13 } }}
                onChange={(e) => {
                  setScoreTeamA(e.target.value === '' ? undefined : Number(e.target.value));
                }}
              />
              <TextField
                label={'Equipe ' + match.teamB.name}
                type="number"
                value={scoreTeamB ?? ''}
                slotProps={{ htmlInput: { inputMode: 'numeric', pattern: '[0-9]*', max: 13 } }}
                onChange={(e) => {
                  setScoreTeamB(e.target.value === '' ? undefined : Number(e.target.value));
                }}
              />
            </Stack>
            {error && <FormHelperText error={error}>{errorText}</FormHelperText>}
            <Button variant="contained" onClick={add}>
              Ajouter
            </Button>
          </Stack>
        </Paper>
      </Modal>
      {!error ? (
        <Snackbar
          open={openSuccess}
          autoHideDuration={6000}
          onClose={() => setOpenSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Alert onClose={() => setOpenSuccess(false)} severity="success" sx={{ width: '100%' }}>
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
  );
};

export default AddMatchScore;
