import { Contest } from '@shared/model/Contest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const next = vi.fn();
const getContest = vi.fn();

vi.mock('@app/App', () => ({ contestObserver: { next } }));
vi.mock('@features/contest-management/infra/db/GetContest', () => ({ default: getContest }));

const { broadcastContestUpdate, refreshContestState } = await import('./contestSync');

const contest = { id: 1, name: 'Tournoi du club', teams: [] } as unknown as Contest;

describe('broadcastContestUpdate', () => {
  beforeEach(() => {
    localStorage.clear();
    next.mockClear();
    getContest.mockReset();
  });

  it('mirrors the contest into localStorage under the "contest" key', () => {
    broadcastContestUpdate(contest);

    expect(JSON.parse(localStorage.getItem('contest')!)).toEqual({
      id: 1,
      name: 'Tournoi du club',
      teams: [],
    });
  });

  it('pushes the contest to subscribers', () => {
    broadcastContestUpdate(contest);

    expect(next).toHaveBeenCalledWith(contest);
  });

  it('overwrites the previous mirror rather than appending to it', () => {
    broadcastContestUpdate(contest);
    broadcastContestUpdate({ ...contest, name: 'Renommé' });

    expect(JSON.parse(localStorage.getItem('contest')!).name).toBe('Renommé');
  });
});

describe('refreshContestState', () => {
  beforeEach(() => {
    localStorage.clear();
    next.mockClear();
    getContest.mockReset();
  });

  it('re-reads the contest from the database and broadcasts it', async () => {
    getContest.mockResolvedValue(contest);

    await expect(refreshContestState()).resolves.toEqual(contest);
    expect(next).toHaveBeenCalledWith(contest);
    expect(localStorage.getItem('contest')).not.toBeNull();
  });

  // GetContest resolves to a falsy value when no contest exists; broadcasting it
  // would wipe the mirror and push `false` to every subscriber.
  it('does not broadcast when the database holds no contest', async () => {
    getContest.mockResolvedValue(false);

    await expect(refreshContestState()).resolves.toBe(false);
    expect(next).not.toHaveBeenCalled();
    expect(localStorage.getItem('contest')).toBeNull();
  });
});
