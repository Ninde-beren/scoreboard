import { db } from '@shared/infra/db/db';

import { hydrateMatchTeams } from './hydrateMatch';
import { hydrateTeamMembers } from './hydrateTeam';

const GetContest = async () => {
  // Add the new friend!
  const contest: any = await db.table('contest').get(1);

  if (!contest) return;
  const stageIds = Array.isArray(contest?.stages) ? contest.stages : [];
  const teamIds = Array.isArray(contest?.teams) ? contest.teams : [];
  contest.stages = stageIds.length ? await db.stage.where('id').anyOf(stageIds).toArray() : [];
  contest.teams = teamIds.length ? await db.team.where('id').anyOf(teamIds).toArray() : [];
  contest.params = await db.params.get(1);

  if (contest.teams.length > 0) {
    for (const team of contest.teams) {
      await hydrateTeamMembers(team);
    }
  }

  const teamById = new Map(contest.teams.map((team: any) => [team.id, team]));

  for (const stage of contest.stages) {
    if (Array.isArray(stage.pools)) {
      if (stage.pools.length) {
        stage.pools = await db.pool.where('id').anyOf(stage.pools).toArray();
        for (const pool of stage.pools) {
          if (
            Array.isArray(pool.teams) &&
            pool.teams.some((team: any) => typeof team === 'number')
          ) {
            pool.teams = pool.teams.map((teamId: number) => teamById.get(teamId)).filter(Boolean);
          }
          pool.matchs = await db.match.where('id').anyOf(pool.matchs).toArray();
          for (const match of pool.matchs) {
            await hydrateMatchTeams(match);
          }
        }
      } else {
        stage.pools = [];
      }
    }
    if (Array.isArray(stage.matchs)) {
      if (stage.matchs.length) {
        stage.matchs = await db.match.where('id').anyOf(stage.matchs).toArray();
        for (const match of stage.matchs) {
          await hydrateMatchTeams(match);
        }
      } else {
        stage.matchs = [];
      }
    }
  }

  return contest;
};
export default GetContest;
