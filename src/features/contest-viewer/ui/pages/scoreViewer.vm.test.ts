import { Contest } from '@shared/model/Contest';
import { describe, expect, it } from 'vitest';

import { buildScoreViewerVM } from './scoreViewer.vm';

const contest = { id: 1, name: 'Tournoi du club' } as unknown as Contest;

describe('buildScoreViewerVM', () => {
  it('reports a contest as present', () => {
    expect(buildScoreViewerVM({ contest, loading: false, value: 0 })).toEqual({
      hasContest: true,
      isLoading: false,
      activeTab: 0,
    });
  });

  // GetContest resolves to `false` when IndexedDB holds no contest yet;
  // the page relies on hasContest to show its empty state.
  it('reports the "no contest yet" sentinel as absent', () => {
    expect(buildScoreViewerVM({ contest: false, loading: false, value: 2 }).hasContest).toBe(false);
  });

  it('keeps loading independent from the contest being present', () => {
    expect(buildScoreViewerVM({ contest: false, loading: true, value: 0 }).isLoading).toBe(true);
    expect(buildScoreViewerVM({ contest, loading: true, value: 0 }).isLoading).toBe(true);
  });

  it('passes the active tab through untouched', () => {
    for (const value of [0, 1, 2, 3, 4]) {
      expect(buildScoreViewerVM({ contest, loading: false, value }).activeTab).toBe(value);
    }
  });
});
