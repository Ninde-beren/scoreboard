import { refreshContestState } from '@features/contest-management/application/services/contestSync';
import { TournamentViewProps } from '@features/contest-management/domain/model/contestUi.model';
import Add from '@features/contest-management/infra/db/Add';
import get from '@features/contest-management/infra/db/Get';
import GetStage from '@features/contest-management/infra/db/GetStage';
import Update from '@features/contest-management/infra/db/Update';
import { Alert, Box, Button, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { useTimeouts } from '@shared/lib/useTimeouts';
import { displayError } from '@shared/lib/utils';
import { StageType } from '@shared/model/StageType';
import { SubContest } from '@shared/model/SubContest';
import { colors } from '@shared/ui/styles/colors';
import { itemListStyle } from '@shared/ui/styles/Style';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Match from './Match';

const stageOptions = [
  { type: StageType.EIGHTER_FINAL, label: 'Huitieme de finale' },
  { type: StageType.QUARTER_FINAL, label: 'Quart de finale' },
  { type: StageType.SEMI_FINAL, label: 'Demi-finale' },
  { type: StageType.FINAL, label: 'Finale' },
];

const nextStageByType = {
  [StageType.EIGHTER_FINAL]: StageType.QUARTER_FINAL,
  [StageType.QUARTER_FINAL]: StageType.SEMI_FINAL,
  [StageType.SEMI_FINAL]: StageType.FINAL,
} as const;

const TournamentView = ({ contest }: TournamentViewProps) => {
  const { setSafeTimeout } = useTimeouts();
  const [selectedStageType, setSelectedStageType] = useState(stageOptions[0].type);
  const [selectedSubContest, setSelectedSubContest] = useState(SubContest.PRINCIPALE);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [currentStageDetail, setCurrentStageDetail] = useState<any>();
  const [nextStageDetail, setNextStageDetail] = useState<any>();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const stageLabels = useMemo(
    () => new Map(stageOptions.map((stage) => [stage.type, stage.label])),
    []
  );

  const teamById = useMemo(
    () => new Map(contest.teams.map((team) => [team.id, team])),
    [contest.teams]
  );

  const isMatchPlayed = useCallback((match: any) => {
    if (!match) return false;
    if (typeof match.scoreTeamA !== 'number' || typeof match.scoreTeamB !== 'number') return false;
    return match.scoreTeamA !== 0 || match.scoreTeamB !== 0;
  }, []);

  const getTeamId = useCallback((team: any) => (typeof team === 'number' ? team : team?.id), []);

  const getMatchWinnerId = useCallback(
    (match: any) => {
      if (!isMatchPlayed(match)) return undefined;
      if (match.winner) return typeof match.winner === 'number' ? match.winner : match.winner.id;
      const teamAId = getTeamId(match.teamA);
      const teamBId = getTeamId(match.teamB);
      if (!teamAId || !teamBId) return undefined;
      return match.scoreTeamA > match.scoreTeamB ? teamAId : teamBId;
    },
    [getTeamId, isMatchPlayed]
  );

  const getTeamLabel = useCallback(
    (teamId: number) => teamById.get(teamId)?.name ?? `Equipe ${teamId}`,
    [teamById]
  );

  const nextStageType = nextStageByType[selectedStageType as keyof typeof nextStageByType];
  const currentMatches = useMemo(
    () => (currentStageDetail?.matchs ?? []).filter((match: any) => typeof match !== 'number'),
    [currentStageDetail]
  );

  const { availableTeams, pendingTeams, qualifiedTeams } = useMemo(() => {
    const availableIds = new Set<number>();
    const pendingIds = new Set<number>();
    const qualifiedIds = new Set<number>();

    if (nextStageDetail?.matchs?.length) {
      nextStageDetail.matchs.forEach((match: any) => {
        if (typeof match === 'number') return;
        const teamAId = getTeamId(match.teamA);
        const teamBId = getTeamId(match.teamB);
        if (teamAId) qualifiedIds.add(teamAId);
        if (teamBId) qualifiedIds.add(teamBId);
      });
    }

    currentMatches.forEach((match: any) => {
      const teamAId = getTeamId(match.teamA);
      const teamBId = getTeamId(match.teamB);
      if (!isMatchPlayed(match)) {
        if (teamAId) pendingIds.add(teamAId);
        if (teamBId) pendingIds.add(teamBId);
        return;
      }
      const winnerId = getMatchWinnerId(match);
      if (winnerId && !qualifiedIds.has(winnerId)) {
        availableIds.add(winnerId);
      }
    });

    const available = Array.from(availableIds).map((id) => ({
      id,
      name: getTeamLabel(id),
    }));
    const pending = Array.from(pendingIds).map((id) => ({
      id,
      name: getTeamLabel(id),
    }));
    const qualified = Array.from(qualifiedIds).map((id) => ({
      id,
      name: getTeamLabel(id),
    }));

    return { availableTeams: available, pendingTeams: pending, qualifiedTeams: qualified };
  }, [currentMatches, getMatchWinnerId, getTeamId, getTeamLabel, isMatchPlayed, nextStageDetail]);

  useEffect(() => {
    setSelectedTeams((prev) => {
      const next = prev.filter((id) => availableTeams.some((team) => team.id === id));
      if (next.length !== prev.length) return next;
      return next.every((id, index) => id === prev[index]) ? prev : next;
    });
  }, [availableTeams]);

  useEffect(() => {
    setSelectedTeams([]);
  }, [selectedStageType, selectedSubContest]);

  useEffect(() => {
    let active = true;
    const loadStages = async () => {
      const stage = await GetStage({ type: selectedStageType, subContest: selectedSubContest });
      const nextStage = nextStageType
        ? await GetStage({ type: nextStageType, subContest: selectedSubContest })
        : undefined;
      if (!active) return;
      setCurrentStageDetail(stage);
      setNextStageDetail(nextStage);
    };
    void loadStages();
    return () => {
      active = false;
    };
  }, [contest, selectedStageType, selectedSubContest, nextStageType]);

  const handleToggleTeam = (teamId: number) => {
    setSelectedTeams((prev) => {
      if (prev.includes(teamId)) return prev.filter((id) => id !== teamId);
      if (prev.length >= 2) {
        displayError(
          setOpenError,
          setErrorText,
          setError,
          'Selectionnez seulement 2 equipes',
          setSafeTimeout
        );
        return prev;
      }
      return [...prev, teamId];
    });
  };

  const handleGenerateMatch = async () => {
    if (!nextStageDetail) {
      displayError(setOpenError, setErrorText, setError, 'Aucun tour suivant', setSafeTimeout);
      return;
    }
    if (selectedTeams.length !== 2) {
      displayError(setOpenError, setErrorText, setError, 'Selectionnez 2 equipes', setSafeTimeout);
      return;
    }
    const [teamAId, teamBId] = selectedTeams;
    if (teamAId === teamBId) {
      displayError(setOpenError, setErrorText, setError, 'Meme equipe saisie', setSafeTimeout);
      return;
    }
    if (!availableTeams.some((team) => team.id === teamAId)) {
      displayError(setOpenError, setErrorText, setError, 'Equipe non disponible', setSafeTimeout);
      return;
    }
    if (!availableTeams.some((team) => team.id === teamBId)) {
      displayError(setOpenError, setErrorText, setError, 'Equipe non disponible', setSafeTimeout);
      return;
    }

    const match = await Add('match', {
      scoreTeamA: 0,
      scoreTeamB: 0,
      teamA: teamAId,
      teamB: teamBId,
    });
    const stageUpdate = await get('stage', nextStageDetail.id);
    const existingMatchIds = Array.isArray(stageUpdate?.matchs) ? stageUpdate.matchs : [];
    const nextMatchIds =
      nextStageDetail.type === StageType.FINAL ? [match.id] : [...existingMatchIds, match.id];
    await Update('stage', nextStageDetail.id, { matchs: nextMatchIds });

    await refreshContestState();

    setError(false);
    setOpenError(false);
    setOpenSuccess(true);
    setSafeTimeout(() => setOpenSuccess(false), 2000);
    setSelectedTeams([]);
  };

  const selectedTeamSet = new Set(selectedTeams);
  const pendingColor = '#B0B0B0';
  const centerBg = selectedSubContest === SubContest.PRINCIPALE ? colors.blue : colors.blueDark;
  const nextStageLabel = nextStageType ? (stageLabels.get(nextStageType) ?? '') : '';

  return (
    <>
      {!error ? (
        <Snackbar
          open={openSuccess}
          autoHideDuration={6000}
          onClose={() => setOpenSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Alert onClose={() => setOpenSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Les matchs ont ete generes avec succes !
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

      <Stack direction="row" sx={{ height: '100%', minHeight: 0, backgroundColor: colors.red }}>
        <Stack sx={{ width: 160, p: 2, backgroundColor: colors.red }} spacing={1}>
          <Stack spacing={1}>
            <Button
              onClick={() => setSelectedSubContest(SubContest.PRINCIPALE)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 1,
                py: 0.6,
                backgroundColor:
                  selectedSubContest === SubContest.PRINCIPALE ? colors.blueDark : colors.redDark,
                color: colors.white,
                '&:hover': { backgroundColor: colors.blueDark },
              }}
            >
              Principale
            </Button>
            <Button
              onClick={() => setSelectedSubContest(SubContest.CONSOLANTE)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 1,
                py: 0.6,
                backgroundColor:
                  selectedSubContest === SubContest.CONSOLANTE ? colors.blueDark : colors.redDark,
                color: colors.white,
                '&:hover': { backgroundColor: colors.blueDark },
              }}
            >
              Consolante
            </Button>
          </Stack>
          <Box sx={{ borderTop: `1px solid ${colors.white}`, my: 1 }} />
          {stageOptions.map((stage) => {
            const isSelected = selectedStageType === stage.type;
            return (
              <Button
                key={stage.type}
                onClick={() => setSelectedStageType(stage.type)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 1,
                  py: 0.6,
                  backgroundColor: isSelected ? colors.blueDark : colors.redDark,
                  color: colors.white,
                  '&:hover': { backgroundColor: colors.blueDark },
                }}
              >
                {stage.label}
              </Button>
            );
          })}
        </Stack>

        <Box sx={{ flex: 1, p: 3, backgroundColor: centerBg }}>
          <Stack
            spacing={2.5}
            alignItems="center"
            sx={{ width: '100%', maxWidth: 720, mx: 'auto' }}
          >
            <Box
              sx={{
                backgroundColor: colors.red,
                color: colors.white,
                textAlign: 'center',
                py: 0.6,
                borderRadius: 1,
                px: 4,
              }}
            >
              <Typography fontWeight={700}>
                {stageLabels.get(selectedStageType) ?? selectedStageType}
              </Typography>
            </Box>
            {currentMatches.length ? (
              <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
                {currentMatches.map((match: any, index: number) => (
                  <Match key={match.id ?? `match-${index}`} match={match} noNumber />
                ))}
              </Stack>
            ) : (
              <Paper sx={[itemListStyle, { px: 2, py: 0.6 }]} elevation={5}>
                <Typography fontWeight={600}>Aucun match</Typography>
              </Paper>
            )}
          </Stack>
        </Box>

        <Stack
          sx={{ width: 220, p: 2, backgroundColor: colors.red }}
          spacing={2}
          alignItems="center"
        >
          {nextStageLabel ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: colors.white,
                  fontWeight: 700,
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                }}
              >
                Equipes disponibles
                {'\n'}pour la {nextStageLabel.toLowerCase()}
              </Typography>
              <Stack spacing={1} width="100%" alignItems="center">
                {availableTeams.length ? (
                  availableTeams.map((team) => {
                    const isSelected = selectedTeamSet.has(team.id);
                    return (
                      <Button
                        key={`available-${team.id}`}
                        onClick={() => handleToggleTeam(team.id)}
                        sx={{
                          px: 1.5,
                          py: 0.3,
                          width: '100%',
                          maxWidth: 140,
                          borderRadius: 999,
                          border: `2px solid ${colors.blueDark}`,
                          color: colors.white,
                          fontWeight: 700,
                          textAlign: 'center',
                          textTransform: 'none',
                          backgroundColor: isSelected ? colors.blueDark : 'transparent',
                          '&:hover': { backgroundColor: colors.blueDark },
                        }}
                        aria-pressed={isSelected}
                      >
                        {team.name}
                      </Button>
                    );
                  })
                ) : (
                  <Typography variant="caption" sx={{ color: colors.white }}>
                    Aucune
                  </Typography>
                )}
              </Stack>
              <Button
                variant="contained"
                onClick={handleGenerateMatch}
                disabled={selectedTeams.length !== 2}
                sx={{
                  backgroundColor: colors.orange,
                  color: colors.white,
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 3,
                  '&:hover': { backgroundColor: '#ec7e0b' },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(243, 154, 61, 0.5)',
                    color: 'rgba(255, 255, 255, 0.75)',
                  },
                }}
              >
                Match !
              </Button>
              <Typography
                variant="body2"
                sx={{
                  color: colors.white,
                  fontWeight: 700,
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                }}
              >
                Equipes pas encore
                {'\n'}disponibles pour la {nextStageLabel.toLowerCase()}
              </Typography>
              {pendingTeams.length ? (
                <Box
                  sx={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 1,
                    justifyItems: 'center',
                  }}
                >
                  {pendingTeams.map((team) => (
                    <Box
                      key={`pending-${team.id}`}
                      sx={{
                        px: 1.5,
                        py: 0.3,
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        borderRadius: 999,
                        border: `2px solid ${pendingColor}`,
                        color: pendingColor,
                        fontWeight: 700,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {team.name}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="caption" sx={{ color: pendingColor }}>
                  Aucune
                </Typography>
              )}
              <Typography
                variant="body2"
                sx={{
                  color: colors.white,
                  fontWeight: 700,
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                }}
              >
                Equipes deja
                {'\n'}qualifiees pour la {nextStageLabel.toLowerCase()}
              </Typography>
              <Stack spacing={1} width="100%" alignItems="center">
                {qualifiedTeams.length ? (
                  qualifiedTeams.map((team) => (
                    <Box
                      key={`qualified-${team.id}`}
                      sx={{
                        px: 1.5,
                        py: 0.3,
                        width: '100%',
                        maxWidth: 140,
                        borderRadius: 999,
                        border: `2px solid ${colors.white}`,
                        color: colors.white,
                        fontWeight: 700,
                        textAlign: 'center',
                      }}
                    >
                      {team.name}
                    </Box>
                  ))
                ) : (
                  <Typography variant="caption" sx={{ color: colors.white }}>
                    Aucune
                  </Typography>
                )}
              </Stack>
            </>
          ) : (
            <Typography variant="body2" sx={{ color: colors.white, fontWeight: 700 }}>
              Fin du tournoi
            </Typography>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default TournamentView;
