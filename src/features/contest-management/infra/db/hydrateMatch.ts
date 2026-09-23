import { db } from '@shared/infra/db/db';

import { getTeamWithMembers } from './hydrateTeam';

export const hydrateMatchTeams = async (match: any, options?: { withWinner?: boolean }) => {
  if (!match) return;
  if (options?.withWinner && match.winner) {
    match.winner = await db.team.get(match.winner);
  }
  if (match.teamA) {
    match.teamA = await getTeamWithMembers(match.teamA);
  }
  if (match.teamB) {
    match.teamB = await getTeamWithMembers(match.teamB);
  }
};
