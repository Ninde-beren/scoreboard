import { MatchProps } from '@features/contest-management/domain/model/contestUi.model';
import AddMatchScore from '@features/contest-management/ui/forms/AddMatchScore';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import MatchRowContent from '@shared/ui/components/MatchRowContent';
import { itemListStyle } from '@shared/ui/styles/Style';
import { useState } from 'react';

const Match = ({ match, noNumber }: MatchProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Paper sx={itemListStyle} elevation={5}>
          <Stack key={match.id + '-match'} direction="row" alignItems="center" spacing={2}>
            <MatchRowContent match={match} scoreSx={{ p: '0 14px' }} />
            {!noNumber && (
              <Paper>
                <Box justifyContent="center">
                  <Typography variant="h5">{match.id}</Typography>
                </Box>
              </Paper>
            )}
          </Stack>
        </Paper>
      </Button>
      <AddMatchScore match={match} openAction={open} setOpenAction={setOpen} />
    </>
  );
};
export default Match;
