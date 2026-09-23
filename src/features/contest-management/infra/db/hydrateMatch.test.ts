import { beforeEach, describe, expect, it, vi } from 'vitest';

const teamGet = vi.fn();
const getTeamWithMembers = vi.fn();

vi.mock('@shared/infra/db/db', () => ({ db: { team: { get: teamGet } } }));
vi.mock('./hydrateTeam', () => ({ getTeamWithMembers }));

const { hydrateMatchTeams } = await import('./hydrateMatch');

describe('hydrateMatchTeams', () => {
  beforeEach(() => {
    teamGet.mockReset();
    getTeamWithMembers.mockReset();
    getTeamWithMembers.mockImplementation(async (id: number) => ({ id, name: `team-${id}` }));
  });

  it('replaces both team ids with hydrated teams, in place', async () => {
    const match: any = { id: 1, teamA: 4, teamB: 9 };

    await hydrateMatchTeams(match);

    expect(match.teamA).toEqual({ id: 4, name: 'team-4' });
    expect(match.teamB).toEqual({ id: 9, name: 'team-9' });
  });

  // A tournament bracket holds matches whose second slot is still empty.
  it('leaves an unset opponent untouched', async () => {
    const match: any = { id: 1, teamA: 4, teamB: undefined };

    await hydrateMatchTeams(match);

    expect(getTeamWithMembers).toHaveBeenCalledTimes(1);
    expect(match.teamB).toBeUndefined();
  });

  it('ignores a missing match instead of throwing', async () => {
    await expect(hydrateMatchTeams(undefined)).resolves.toBeUndefined();
    expect(getTeamWithMembers).not.toHaveBeenCalled();
  });

  it('does not resolve the winner unless asked to', async () => {
    const match: any = { id: 1, teamA: 4, teamB: 9, winner: 4 };

    await hydrateMatchTeams(match);

    expect(teamGet).not.toHaveBeenCalled();
    expect(match.winner).toBe(4);
  });

  it('resolves the winner when the option is set', async () => {
    teamGet.mockResolvedValue({ id: 4, name: 'Les bleus' });
    const match: any = { id: 1, teamA: 4, teamB: 9, winner: 4 };

    await hydrateMatchTeams(match, { withWinner: true });

    expect(teamGet).toHaveBeenCalledWith(4);
    expect(match.winner).toEqual({ id: 4, name: 'Les bleus' });
  });

  // The winner is only known once a score has been entered.
  it('does not query for a winner that has not been decided yet', async () => {
    const match: any = { id: 1, teamA: 4, teamB: 9, winner: undefined };

    await hydrateMatchTeams(match, { withWinner: true });

    expect(teamGet).not.toHaveBeenCalled();
  });
});
