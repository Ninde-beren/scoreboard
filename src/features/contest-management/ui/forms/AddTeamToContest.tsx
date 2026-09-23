import {
  addTeamToContest,
  seedTeamsFromPoolNames,
} from '@features/contest-management/application/services/contestTeamService';
import { Alert, Button, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useTimeouts } from '@shared/lib/useTimeouts';
import { colors } from '@shared/ui/styles/colors';
import React, { useState } from 'react';

const AddTeamToContest = () => {
  const { setSafeTimeout } = useTimeouts();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const add = () => {
    if (name === '') {
      setError(true);
      setOpen(true);
      setSafeTimeout(() => setError(false), 2000);
      return;
    }
    void addTeamToContest(name);
    setName('');
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const triche = () => {
    void seedTeamsFromPoolNames();
  };

  return (
    <>
      <Stack spacing={1} alignItems="center">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: colors.red,
            borderRadius: 3,
            px: { xs: 2.5, md: 4 },
            py: { xs: 2, md: 2.5 },
            boxShadow: '0 3px 0 rgba(0,0,0,0.25)',
          }}
        >
          <Typography variant="h6" sx={{ color: colors.white, fontWeight: 700 }}>
            Ajouter une équipe
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
            <TextField
              error={error}
              type="text"
              placeholder="Nom de l'équipe"
              value={name}
              size="small"
              onChange={(ev) => {
                setName(ev.target.value);
                setError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') add();
              }}
              sx={{
                backgroundColor: colors.white,
                borderRadius: 1,
                minWidth: { xs: 220, sm: 260 },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: colors.white },
              }}
            />
            <Button
              variant="contained"
              onClick={add}
              sx={{
                backgroundColor: colors.white,
                color: colors.redDark,
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 2px 0 rgba(0,0,0,0.2)',
                '&:hover': { backgroundColor: colors.white },
              }}
            >
              Ajouter
            </Button>
          </Stack>
          <Button
            onClick={triche}
            variant="contained"
            sx={{
              backgroundColor: colors.orange,
              color: colors.white,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 2px 0 rgba(0,0,0,0.2)',
              '&:hover': { backgroundColor: '#ec7e0b' },
            }}
          >
            auto équipe
          </Button>
        </Stack>
        {error && (
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="error">Vous devez spécifier un nom</Alert>
          </Snackbar>
        )}
      </Stack>
    </>
  );
};

export default AddTeamToContest;
