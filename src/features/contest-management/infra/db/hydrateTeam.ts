import { db } from '@shared/infra/db/db';
import { Team } from '@shared/model/Team';

export const hydrateTeamMembers = async (team?: Team | null) => {
  if (!team) return team;
  const rawMembers = Array.isArray(team.members) ? (team.members as unknown[]) : [];
  const memberIds = rawMembers
    .map((member) => (typeof member === 'number' ? member : (member as any)?.id))
    .filter((id): id is number => typeof id === 'number');

  if (memberIds.length) {
    team.members = await db.member.where('id').anyOf(memberIds).toArray();
  } else {
    team.members = [];
  }
  return team;
};

export const getTeamWithMembers = async (teamId?: number | null) => {
  if (!teamId) return undefined;
  const team = await db.team.get(teamId);
  return hydrateTeamMembers(team);
};
