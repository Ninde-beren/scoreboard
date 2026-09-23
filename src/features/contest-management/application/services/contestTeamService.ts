import { refreshContestState } from '@features/contest-management/application/services/contestSync';
import Add from '@features/contest-management/infra/db/Add';
import get from '@features/contest-management/infra/db/Get';
import GetContest from '@features/contest-management/infra/db/GetContest';
import Update from '@features/contest-management/infra/db/Update';
import { poolName } from '@shared/lib/poolName';

export const addTeamToContest = async (name: string) => {
  const contest = await get('contest', 1);
  const newTeam = await Add('team', { name, members: [], score: 0 });
  await Update('team', newTeam.id, { color: newTeam.id });
  await Update('contest', contest.id, { teams: [...contest.teams, newTeam.id] });

  await refreshContestState();
};

export const seedTeamsFromPoolNames = async () => {
  const contest = await GetContest();
  for (let i = 0; i < 32; i += 1) {
    await Add('team', { name: poolName[i], members: [], score: 0 }).then(async (newTeam) => {
      await Update('team', newTeam.id, { color: newTeam.id });
    });
    await Update('contest', contest.id, {
      teams: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        26, 27, 28, 29, 30, 31, 32,
      ],
    });
    await refreshContestState();
  }
};
