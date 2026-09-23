import { contestObserver } from '@app/App';
import { env } from '@app/config/env.config';
import { refreshContestState } from '@features/contest-management/application/services/contestSync';
import { ViewMode, ViewState } from '@features/contest-management/domain/model/contestView.model';
import GetStage from '@features/contest-management/infra/db/GetStage';
import Update from '@features/contest-management/infra/db/Update';
import ContestHeader from '@features/contest-management/ui/components/ContestHeader';
import Podium from '@features/contest-management/ui/components/Podium';
import PoolSummary from '@features/contest-management/ui/components/poolSummary/PoolSummary';
import TeamView from '@features/contest-management/ui/components/TeamView';
import TournamentView from '@features/contest-management/ui/components/TournamentView';
import AddContest from '@features/contest-management/ui/forms/AddContest';
import { Box, Button, Divider, Stack } from '@mui/material';
import { db } from '@shared/infra/db/db';
import { safeJsonParse } from '@shared/lib/utils';
import { Contest } from '@shared/model/Contest';
import { StageType } from '@shared/model/StageType';
import { SubContest } from '@shared/model/SubContest';
import React, { useEffect, useMemo, useState, useTransition } from 'react';

import { buildManagementContestVM } from './managementContest.vm';

const ManagementContest = () => {
  const [contest, setContest] = useState<Contest | false>();
  const [view, setView] = useState<ViewState>(['team', true, false, false]);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      refreshContestState().then((contest) => {
        if (contest) {
          setContest(contest);
        }
      });
      const storedView = safeJsonParse<any>(localStorage.getItem('view'), null);
      if (Array.isArray(storedView) && storedView.length === 4) {
        setView(storedView as ViewState);
      }
    });
  }, []);

  useEffect(() => {
    const observer = contestObserver.subscribe((e) => setContest(e));
    return () => {
      observer.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!contest || !contest.stages?.length) return;
    let active = true;
    const isMatchPlayed = (match: any) => {
      if (!match) return false;
      if (typeof match.scoreTeamA !== 'number' || typeof match.scoreTeamB !== 'number')
        return false;
      return match.scoreTeamA !== 0 || match.scoreTeamB !== 0;
    };
    const resolveWinner = (match: any) => {
      if (match.winner) return match.winner;
      return match.scoreTeamA > match.scoreTeamB ? match.teamA : match.teamB;
    };
    const buildPodium = async (subContest: SubContest) => {
      if (contest.winners?.[subContest]) return null;
      const finalStage: any = await GetStage({ type: StageType.FINAL, subContest });
      const semiStage: any = await GetStage({ type: StageType.SEMI_FINAL, subContest });
      if (!finalStage || !semiStage) return null;
      const finalMatch = finalStage.matchs?.[0];
      if (!finalMatch || !isMatchPlayed(finalMatch)) return null;
      const one = resolveWinner(finalMatch);
      if (!one) return null;
      const two = finalMatch.teamA?.id === one.id ? finalMatch.teamB : finalMatch.teamA;
      if (!two) return null;

      const semi1 = semiStage.matchs?.[0];
      const semi2 = semiStage.matchs?.[1];
      if (!semi1 || !semi2) return null;
      const loser1 =
        semi1.teamA?.id === one.id || semi1.teamA?.id === two.id
          ? { team: semi1.teamB, score: semi1.scoreTeamB }
          : { team: semi1.teamA, score: semi1.scoreTeamA };
      const loser2 =
        semi2.teamA?.id === one.id || semi2.teamA?.id === two.id
          ? { team: semi2.teamB, score: semi2.scoreTeamB }
          : { team: semi2.teamA, score: semi2.scoreTeamA };
      if (!loser1.team || !loser2.team) return null;

      let three;
      if (loser1.score === loser2.score) {
        three = loser1.team.score > loser2.team.score ? loser1.team : loser2.team;
      } else {
        three = loser1.score > loser2.score ? loser1.team : loser2.team;
      }

      return { one, two, three };
    };
    const run = async () => {
      const principale = await buildPodium(SubContest.PRINCIPALE);
      const consolante = await buildPodium(SubContest.CONSOLANTE);
      const updates: any = {};
      if (principale) updates[SubContest.PRINCIPALE] = principale;
      if (consolante) updates[SubContest.CONSOLANTE] = consolante;
      if (!Object.keys(updates).length || !active) return;

      await Update('contest', 1, { winners: { ...contest.winners, ...updates } });
      const refreshed = await refreshContestState();
      if (!active || !refreshed) return;

      setView((prev) => {
        if (prev[0] === 'podium') return prev;
        const next: ViewState = ['podium', prev[1], prev[2], prev[3]];
        localStorage.setItem('view', JSON.stringify(next));
        return next;
      });
    };
    void run();
    return () => {
      active = false;
    };
  }, [contest, setView]);

  const reset = async () => {
    setView(['team', true, false, false]);
    localStorage.setItem('contest', 'undefined');
    localStorage.clear();
    await db.delete();
    await db.open();
    contestObserver.next(false);
  };

  // enlever les pub si don --> IP + adresse mail + code
  const onOpenWindow = () => window.open('/contest-viewer');

  const vm = useMemo(() => buildManagementContestVM(view), [view]);

  const onTabChange = (target: ViewMode) => {
    if (target === 'pool' && !vm.canPool) return;
    if (target === 'tournament' && !vm.canTournament) return;
    if (target === 'podium' && !vm.canTournament) return;

    if (view[3]) {
      if (view[2]) setView([target, false, true, true]);
      else setView([target, false, false, true]);
      return;
    }
    setView([target, false, true, false]);
  };

  const onSelectViewerPage = (value: 0 | 1 | 2 | 3 | 4) => {
    localStorage.setItem('viewerPage', String(value));
  };
  return !localStorage.getItem('contest') ? (
    <>
      <AddContest />
      <Button variant="contained" onClick={reset}>
        reset
      </Button>
    </>
  ) : contest ? (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ContestHeader
        tabs={vm.tabs}
        onTabChange={onTabChange}
        tvModes={vm.tvModes}
        onReset={reset}
        onOpenWindow={onOpenWindow}
        onSelectViewerPage={onSelectViewerPage}
        view={view}
        setView={setView}
        contest={contest}
      />
      <Divider
        sx={{
          borderImage: 'linear-gradient(210deg, #4a9ad5, #ffffff, #C32533, #ffffff, #4a9ad5)1',
        }}
      />
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {view[0] === 'team' && <TeamView contest={contest} />}
        {view[0] === 'pool' && <PoolSummary contest={contest} setView={setView} />}
        {view[0] === 'tournament' && (
          <TournamentView contest={contest} view={view} setView={setView} />
        )}
        {view[0] === 'podium' && (
          <Box sx={{ p: 3 }}>
            <Stack spacing={4}>
              <Podium
                contest={contest}
                subContest={SubContest.PRINCIPALE}
                nextStep={setView}
                readOnly
              />
              <Podium
                contest={contest}
                subContest={SubContest.CONSOLANTE}
                nextStep={setView}
                readOnly
              />
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  ) : (
    <img className="logo" width={500} src="/sit_character.png" alt="logo" />
  );
};

export default ManagementContest;
