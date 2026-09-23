import { Team } from '@shared/model/Team';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const teamGet = vi.fn();
const memberToArray = vi.fn();
const anyOf = vi.fn(() => ({ toArray: memberToArray }));
const where = vi.fn(() => ({ anyOf }));

vi.mock('@shared/infra/db/db', () => ({
  db: { team: { get: teamGet }, member: { where } },
}));

const { getTeamWithMembers, hydrateTeamMembers } = await import('./hydrateTeam');

const team = (members: unknown) => ({ id: 7, name: 'Les bleus', members }) as unknown as Team;

describe('hydrateTeamMembers', () => {
  beforeEach(() => {
    teamGet.mockReset();
    memberToArray.mockReset();
    where.mockClear();
    anyOf.mockClear();
  });

  it('replaces member ids with the rows read from the database', async () => {
    memberToArray.mockResolvedValue([{ id: 1, name: 'Alice' }]);

    const result = await hydrateTeamMembers(team([1]));

    expect(where).toHaveBeenCalledWith('id');
    expect(anyOf).toHaveBeenCalledWith([1]);
    expect(result!.members).toEqual([{ id: 1, name: 'Alice' }]);
  });

  // Members can already be hydrated objects when a team comes back from a
  // previous hydration; their ids must still be resolvable.
  it('accepts members given as objects and reads their ids', async () => {
    memberToArray.mockResolvedValue([]);

    await hydrateTeamMembers(team([{ id: 4 }, { id: 9 }]));

    expect(anyOf).toHaveBeenCalledWith([4, 9]);
  });

  it('skips entries without a usable id', async () => {
    memberToArray.mockResolvedValue([]);

    await hydrateTeamMembers(team([2, null, undefined, {}, 5]));

    expect(anyOf).toHaveBeenCalledWith([2, 5]);
  });

  it('normalises an empty member list to [] without querying the database', async () => {
    const result = await hydrateTeamMembers(team([]));

    expect(where).not.toHaveBeenCalled();
    expect(result!.members).toEqual([]);
  });

  it('normalises a non-array members field to [] instead of throwing', async () => {
    const result = await hydrateTeamMembers(team(undefined));

    expect(where).not.toHaveBeenCalled();
    expect(result!.members).toEqual([]);
  });

  it('passes a missing team straight through', async () => {
    await expect(hydrateTeamMembers(null)).resolves.toBeNull();
    await expect(hydrateTeamMembers(undefined)).resolves.toBeUndefined();
  });
});

describe('getTeamWithMembers', () => {
  beforeEach(() => {
    teamGet.mockReset();
    memberToArray.mockReset();
    where.mockClear();
    anyOf.mockClear();
  });

  it('reads the team then hydrates its members', async () => {
    teamGet.mockResolvedValue(team([3]));
    memberToArray.mockResolvedValue([{ id: 3, name: 'Chloé' }]);

    const result = await getTeamWithMembers(7);

    expect(teamGet).toHaveBeenCalledWith(7);
    expect(result!.members).toEqual([{ id: 3, name: 'Chloé' }]);
  });

  // A match with no opponent yet carries teamB = undefined; hitting the
  // database with that would return the whole table's first row on some paths.
  it('returns undefined without touching the database when no id is given', async () => {
    await expect(getTeamWithMembers(undefined)).resolves.toBeUndefined();
    await expect(getTeamWithMembers(null)).resolves.toBeUndefined();
    expect(teamGet).not.toHaveBeenCalled();
  });

  // Dexie ids start at 1, so 0 is never a real team.
  it('treats the id 0 as absent', async () => {
    await expect(getTeamWithMembers(0)).resolves.toBeUndefined();
    expect(teamGet).not.toHaveBeenCalled();
  });
});
