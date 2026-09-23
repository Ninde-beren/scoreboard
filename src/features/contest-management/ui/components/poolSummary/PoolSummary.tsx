import { refreshContestState } from '@features/contest-management/application/services/contestSync';
import { PoolSummaryProps } from '@features/contest-management/domain/model/contestUi.model';
import Add from '@features/contest-management/infra/db/Add';
import get from '@features/contest-management/infra/db/Get';
import GetPool from '@features/contest-management/infra/db/GetPool';
import GetWhere from '@features/contest-management/infra/db/GetWhere';
import Update from '@features/contest-management/infra/db/Update';
import Match from '@features/contest-management/ui/components/Match';
import { Alert, Box, Button, ButtonBase, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { poolName } from '@shared/lib/poolName';
import { useTimeouts } from '@shared/lib/useTimeouts';
import { displayError } from '@shared/lib/utils';
import type { Pool } from '@shared/model/Pool';
import { StageType } from '@shared/model/StageType';
import { SubContest } from '@shared/model/SubContest';
import { colors } from '@shared/ui/styles/colors';
import { itemListStyle } from '@shared/ui/styles/Style';
import { useCallback, useEffect, useMemo, useState } from 'react';

const PoolSummary = ({ contest, setView }: PoolSummaryProps) => {
  const { setSafeTimeout } = useTimeouts();
  const pools = useMemo(
    () =>
      contest.stages
        .filter((stage) => stage.type === StageType.POOL)
        .flatMap((stage) => stage.pools),
    [contest.stages]
  );
  const [selectedPoolId, setSelectedPoolId] = useState<number | null>(null);
  const [selectedPoolDetail, setSelectedPoolDetail] = useState<Pool | undefined>(undefined);
  const [selectedMatchPools, setSelectedMatchPools] = useState<number[]>([]);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const getTeamId = useCallback((team: any) => (typeof team === 'number' ? team : team?.id), []);
  const getPoolLabel = (pool: Pool) => poolName[pool.id - 1] ?? String(pool.id);

  const selectedPool =
    selectedPoolId === null ? undefined : pools.find((pool) => pool.id === selectedPoolId);
  const selectedLabel = selectedPool
    ? (poolName[selectedPool.id - 1] ?? String(selectedPool.id))
    : '';

  const eighterMatchTeamIds = useMemo(() => {
    const ids = new Set<number>();
    contest.stages
      .filter((stage) => stage.type === StageType.EIGHTER_FINAL)
      .forEach((stage) => {
        stage.matchs?.forEach((match: any) => {
          const teamAId = getTeamId(match.teamA);
          const teamBId = getTeamId(match.teamB);
          if (teamAId) ids.add(teamAId);
          if (teamBId) ids.add(teamBId);
        });
      });
    return ids;
  }, [contest.stages, getTeamId]);

  const isMatchPlayed = useCallback((match: any) => {
    if (!match) return false;
    if (typeof match.scoreTeamA !== 'number' || typeof match.scoreTeamB !== 'number') return false;
    return match.scoreTeamA !== 0 || match.scoreTeamB !== 0;
  }, []);

  const isPoolReady = useCallback(
    (pool: Pool) =>
      Array.isArray(pool.matchs) &&
      pool.matchs.length > 0 &&
      pool.matchs.every((match: any) => isMatchPlayed(match)),
    [isMatchPlayed]
  );

  const isPoolUsed = useCallback(
    (pool: Pool) => {
      const teamIds = (pool.teams ?? []).map(getTeamId).filter(Boolean);
      return teamIds.some((teamId: number) => eighterMatchTeamIds.has(teamId));
    },
    [eighterMatchTeamIds, getTeamId]
  );

  const { availablePools, pendingPools, qualifiedPools } = useMemo(() => {
    const available: Pool[] = [];
    const pending: Pool[] = [];
    const qualified: Pool[] = [];

    pools.forEach((pool) => {
      if (isPoolUsed(pool)) {
        qualified.push(pool);
      } else if (isPoolReady(pool)) {
        available.push(pool);
      } else {
        pending.push(pool);
      }
    });

    return { availablePools: available, pendingPools: pending, qualifiedPools: qualified };
  }, [isPoolReady, isPoolUsed, pools]);

  useEffect(() => {
    if (!pools.length) return;
    if (selectedPoolId !== null && !pools.some((pool) => pool.id === selectedPoolId)) {
      setSelectedPoolId(null);
    }
  }, [pools, selectedPoolId]);

  useEffect(() => {
    if (selectedPoolId === null) {
      setSelectedPoolDetail(undefined);
      return;
    }
    GetPool(selectedPoolId).then((pool) => setSelectedPoolDetail(pool));
  }, [contest, selectedPoolId]);

  useEffect(() => {
    setSelectedMatchPools((prev) => {
      const next = prev.filter((id) => availablePools.some((pool) => pool.id === id));
      return next.length === prev.length ? prev : next;
    });
  }, [availablePools]);

  const handleSelectPool = (poolId: number) => {
    setSelectedPoolId(poolId);
  };

  const handleToggleMatchPool = (poolId: number) => {
    setSelectedMatchPools((prev) => {
      if (prev.includes(poolId)) return prev.filter((id) => id !== poolId);
      if (prev.length >= 2) {
        displayError(
          setOpenError,
          setErrorText,
          setError,
          'Selectionnez seulement 2 pools',
          setSafeTimeout
        );
        return prev;
      }
      return [...prev, poolId];
    });
  };

  const buildTeamRanking = (pool: Pool) => {
    let data: any[] = [];
    let notWinner = false;

    pool.matchs.forEach((match: any) => {
      if (!match.winner) {
        notWinner = true;
      } else {
        pool.teams.forEach((team: any) => {
          const teamId = getTeamId(team);
          let teamData = { id: teamId, victory: 0, score: 0 };
          pool.matchs.forEach((match: any) => {
            const winnerId = getTeamId(match.winner);
            const teamAId = getTeamId(match.teamA);
            const teamBId = getTeamId(match.teamB);
            if (teamId === winnerId) teamData.victory++;
            if (teamId === teamAId || teamId === teamBId) {
              teamData.score =
                teamId === teamAId
                  ? teamData.score + match.scoreTeamA
                  : teamData.score + match.scoreTeamB;
            }
            data[teamId] = teamData;
          });
        });
      }
    });

    return { data, notWinner };
  };

  const handleGenerateMatch = async () => {
    if (selectedMatchPools.length !== 2) {
      displayError(setOpenError, setErrorText, setError, 'Selectionnez 2 pools', setSafeTimeout);
      return;
    }

    const [poolAId, poolBId] = selectedMatchPools;
    if (poolAId === poolBId) {
      displayError(setOpenError, setErrorText, setError, 'Même pool saisie', setSafeTimeout);
      return;
    }

    const stage = await GetWhere('stage', {
      type: StageType.EIGHTER_FINAL,
      subContest: SubContest.PRINCIPALE,
    });
    if (!stage) {
      displayError(setOpenError, setErrorText, setError, 'Stage introuvable', setSafeTimeout);
      return;
    }

    const poolA = await GetPool(poolAId);
    const poolB = await GetPool(poolBId);
    if (!poolA || !poolB) {
      displayError(setOpenError, setErrorText, setError, 'Pools introuvables', setSafeTimeout);
      return;
    }

    const rankingA = buildTeamRanking(poolA);
    if (rankingA.notWinner) {
      displayError(
        setOpenError,
        setErrorText,
        setError,
        "Un des matchs de pool selectionnés n'a pas été rempli",
        setSafeTimeout
      );
      return;
    }

    const rankingB = buildTeamRanking(poolB);
    if (rankingB.notWinner) {
      displayError(
        setOpenError,
        setErrorText,
        setError,
        "Un des matchs de pool selectionnés n'a pas été rempli",
        setSafeTimeout
      );
      return;
    }

    let teamVictoryA = rankingA.data.slice(0);
    teamVictoryA.sort(function (a: any, b: any) {
      return b.victory - a.victory;
    });
    teamVictoryA.sort(function (a: any, b: any) {
      return b.score - a.score;
    });

    let teamVictoryB = rankingB.data.slice(0);
    teamVictoryB.sort(function (a: any, b: any) {
      return b.victory - a.victory;
    });
    teamVictoryB.sort(function (a: any, b: any) {
      return b.score - a.score;
    });

    if (
      !teamVictoryA.length ||
      !teamVictoryB.length ||
      !teamVictoryA[0] ||
      !teamVictoryA[1] ||
      !teamVictoryA[2] ||
      !teamVictoryA[3] ||
      !teamVictoryB[0] ||
      !teamVictoryB[1] ||
      !teamVictoryB[2] ||
      !teamVictoryB[3]
    ) {
      displayError(
        setOpenError,
        setErrorText,
        setError,
        'Selectionnez des pools valides',
        setSafeTimeout
      );
      return;
    }

    let teamPrincipaleVictoryA1 = Number(teamVictoryA[0].id);
    let teamPrincipaleVictoryA2 = Number(teamVictoryA[1].id);
    let teamPrincipaleVictoryB1 = Number(teamVictoryB[1].id);
    let teamPrincipaleVictoryB2 = Number(teamVictoryB[0].id);
    let teamConsolanteVictoryA1 = Number(teamVictoryA[2].id);
    let teamConsolanteVictoryA2 = Number(teamVictoryA[3].id);
    let teamConsolanteVictoryB1 = Number(teamVictoryB[3].id);
    let teamConsolanteVictoryB2 = Number(teamVictoryB[2].id);

    let principaleMatch1 = await Add('match', {
      scoreTeamA: 0,
      scoreTeamB: 0,
      teamA: teamPrincipaleVictoryA1,
      teamB: teamPrincipaleVictoryB1,
    });
    let principaleMatch2 = await Add('match', {
      scoreTeamA: 0,
      scoreTeamB: 0,
      teamA: teamPrincipaleVictoryA2,
      teamB: teamPrincipaleVictoryB2,
    });
    let consolanteMatch1 = await Add('match', {
      scoreTeamA: 0,
      scoreTeamB: 0,
      teamA: teamConsolanteVictoryA1,
      teamB: teamConsolanteVictoryB1,
    });
    let consolanteMatch2 = await Add('match', {
      scoreTeamA: 0,
      scoreTeamB: 0,
      teamA: teamConsolanteVictoryA2,
      teamB: teamConsolanteVictoryB2,
    });

    let stage1 = await get('stage', stage.id);
    await Update('stage', stage.id, {
      matchs: [...stage1.matchs, principaleMatch1.id, principaleMatch2.id],
    });
    let stage2 = await get('stage', stage.id + 1);
    await Update('stage', stage2.id, {
      matchs: [...stage2.matchs, consolanteMatch1.id, consolanteMatch2.id],
    });

    await refreshContestState();

    setError(false);
    setOpenError(false);
    setOpenSuccess(true);
    setSafeTimeout(() => setOpenSuccess(false), 2000);
    setSelectedMatchPools([]);

    if (stage.matchs.length === stage.totalMatchs - 1) {
      setView((e: any) => [e[0], false, false, true]);
      localStorage.setItem('view', JSON.stringify(['pool', false, true, false]));
    } else {
      setView((e: any) => [e[0], false, true, true]);
      localStorage.setItem('view', JSON.stringify(['tournament', false, true, false]));
    }
  };

  const selectedMatchPoolSet = new Set(selectedMatchPools);
  const pendingColor = '#B0B0B0';
  const detailPool = selectedPoolDetail ?? selectedPool;

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

      <Stack direction="row" sx={{ height: '100%', minHeight: 0, backgroundColor: colors.red }}>
        <Stack sx={{ width: 140, p: 2, backgroundColor: colors.red }} spacing={1}>
          <Button
            onClick={() => setSelectedPoolId(null)}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 1,
              py: 0.6,
              backgroundColor: selectedPoolId === null ? colors.blueDark : colors.redDark,
              color: colors.white,
              '&:hover': { backgroundColor: colors.blueDark },
            }}
          >
            Liste
          </Button>
          {pools.map((pool) => {
            const label = poolName[pool.id - 1] ?? String(pool.id);
            const isSelected = selectedPoolId === pool.id;
            return (
              <Button
                key={pool.id}
                onClick={() => handleSelectPool(pool.id)}
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
                Pool {label}
              </Button>
            );
          })}
        </Stack>

        <Box sx={{ flex: 1, p: 3, backgroundColor: colors.blue }}>
          {selectedPoolId === null ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 3,
              }}
            >
              {pools.map((pool) => {
                const label = poolName[pool.id - 1] ?? String(pool.id);
                return (
                  <ButtonBase
                    key={pool.id}
                    onClick={() => handleSelectPool(pool.id)}
                    sx={{ width: '100%', textAlign: 'left', borderRadius: 2 }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box
                        sx={{
                          backgroundColor: colors.red,
                          color: colors.white,
                          textAlign: 'center',
                          py: 0.6,
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <Typography fontWeight={700}>Pool {label}</Typography>
                      </Box>
                      <Stack spacing={1}>
                        {pool.teams.map((team: any, index: number) => {
                          const teamId = getTeamId(team);
                          const teamName =
                            typeof team === 'number' ? `Equipe ${teamId}` : team.name;
                          return (
                            <Paper
                              key={teamId ?? `${pool.id}-team-${index}`}
                              sx={[itemListStyle, { px: 2, py: 0.6 }]}
                              elevation={5}
                            >
                              <Typography fontWeight={600} textAlign="center">
                                {teamName}
                              </Typography>
                            </Paper>
                          );
                        })}
                      </Stack>
                    </Box>
                  </ButtonBase>
                );
              })}
            </Box>
          ) : (
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
                <Typography fontWeight={700}>Pool {selectedLabel}</Typography>
              </Box>
              {detailPool ? (
                <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
                  {detailPool.matchs?.length ? (
                    detailPool.matchs.map((match: any, index: number) =>
                      typeof match === 'number' ? null : (
                        <Match key={match.id ?? `match-${index}`} match={match} noNumber />
                      )
                    )
                  ) : (
                    <Paper sx={[itemListStyle, { px: 2, py: 0.6 }]} elevation={5}>
                      <Typography fontWeight={600}>Aucun match</Typography>
                    </Paper>
                  )}
                </Stack>
              ) : (
                <Paper sx={[itemListStyle, { px: 2, py: 0.6 }]} elevation={5}>
                  <Typography fontWeight={600}>Aucune pool</Typography>
                </Paper>
              )}
            </Stack>
          )}
        </Box>

        <Stack
          sx={{ width: 220, p: 2, backgroundColor: colors.red }}
          spacing={2}
          alignItems="center"
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.white,
              fontWeight: 700,
              textAlign: 'center',
              whiteSpace: 'pre-line',
            }}
          >
            Pools disponibles
            {'\n'}pour les huitiemes
          </Typography>
          <Stack spacing={1} width="100%" alignItems="center">
            {availablePools.length ? (
              availablePools.map((pool) => {
                const label = getPoolLabel(pool);
                const isSelected = selectedMatchPoolSet.has(pool.id);
                return (
                  <Button
                    key={`available-${pool.id}`}
                    onClick={() => handleToggleMatchPool(pool.id)}
                    sx={{
                      px: 1.5,
                      py: 0.3,
                      width: '100%',
                      maxWidth: 130,
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
                    Pool {label}
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
            disabled={selectedMatchPools.length !== 2}
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
            Pools pas encore
            {'\n'}disponible pour les huitiemes
          </Typography>
          <Stack spacing={1} width="100%" alignItems="center">
            {pendingPools.length ? (
              pendingPools.map((pool) => {
                const label = getPoolLabel(pool);
                return (
                  <Box
                    key={`pending-${pool.id}`}
                    sx={{
                      px: 1.5,
                      py: 0.3,
                      width: '100%',
                      maxWidth: 130,
                      borderRadius: 999,
                      border: `2px solid ${pendingColor}`,
                      color: pendingColor,
                      fontWeight: 700,
                      textAlign: 'center',
                    }}
                  >
                    Pool {label}
                  </Box>
                );
              })
            ) : (
              <Typography variant="caption" sx={{ color: pendingColor }}>
                Aucune
              </Typography>
            )}
          </Stack>
          <Typography
            variant="body2"
            sx={{
              color: colors.white,
              fontWeight: 700,
              textAlign: 'center',
              whiteSpace: 'pre-line',
            }}
          >
            Pools deja
            {'\n'}ajoutees aux huitiemes
          </Typography>
          <Stack spacing={1} width="100%" alignItems="center">
            {qualifiedPools.length ? (
              qualifiedPools.map((pool) => {
                const label = getPoolLabel(pool);
                return (
                  <Box
                    key={`qualified-${pool.id}`}
                    sx={{
                      px: 1.5,
                      py: 0.3,
                      width: '100%',
                      maxWidth: 130,
                      borderRadius: 999,
                      border: `2px solid ${colors.white}`,
                      color: colors.white,
                      fontWeight: 700,
                      textAlign: 'center',
                    }}
                  >
                    Pool {label}
                  </Box>
                );
              })
            ) : (
              <Typography variant="caption" sx={{ color: colors.white }}>
                Aucune
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default PoolSummary;
