import { ViewState } from '@features/contest-management/domain/model/contestView.model';
import { describe, expect, it } from 'vitest';

import { buildManagementContestVM } from './managementContest.vm';

const tabOf = (view: ViewState, value: string) =>
  buildManagementContestVM(view).tabs.find((tab) => tab.value === value)!;

describe('buildManagementContestVM', () => {
  it('always exposes the four tabs in header order', () => {
    const { tabs } = buildManagementContestVM(['team', true, false, false]);

    expect(tabs.map((tab) => tab.value)).toEqual(['team', 'tournament', 'pool', 'podium']);
    expect(tabs.map((tab) => tab.label)).toEqual(['EQUIPE', 'TOURNOI', 'POOL', 'PODIUM']);
  });

  it('marks exactly the current mode as selected', () => {
    const { tabs } = buildManagementContestVM(['pool', false, true, false]);

    expect(tabs.filter((tab) => tab.selected).map((tab) => tab.value)).toEqual(['pool']);
  });

  // While teams are still being set up there is nothing to draw pools from.
  it('locks the pool tab during team setup and unlocks it afterwards', () => {
    expect(tabOf(['team', true, false, false], 'pool').disabled).toBe(true);
    expect(tabOf(['team', false, false, false], 'pool').disabled).toBe(false);
  });

  it('locks tournament and podium until tournament mode is on', () => {
    const off: ViewState = ['pool', false, true, false];
    expect(tabOf(off, 'tournament').disabled).toBe(true);
    expect(tabOf(off, 'podium').disabled).toBe(true);

    const on: ViewState = ['tournament', false, true, true];
    expect(tabOf(on, 'tournament').disabled).toBe(false);
    expect(tabOf(on, 'podium').disabled).toBe(false);
  });

  it('never disables the team tab, which is the entry point of the flow', () => {
    const views: ViewState[] = [
      ['team', true, false, false],
      ['pool', false, true, false],
      ['tournament', false, true, true],
      ['podium', false, true, true],
    ];

    for (const view of views) {
      expect(tabOf(view, 'team').disabled).toBe(false);
    }
  });

  // poolsReady (index 2) is deliberately not read by the view-model; only
  // setupTeams and tournamentMode drive what is reachable.
  it('ignores the poolsReady flag when computing availability', () => {
    expect(buildManagementContestVM(['pool', false, false, true])).toEqual(
      buildManagementContestVM(['pool', false, true, true])
    );
  });

  it('exposes the five TV modes with the values the viewer page expects', () => {
    const { tvModes } = buildManagementContestVM(['team', true, false, false]);

    expect(tvModes).toEqual([
      { label: 'Le classement', value: 3 },
      { label: 'Le tournoi', value: 2 },
      { label: 'Les Equipes', value: 0 },
      { label: 'Les poules', value: 1 },
      { label: 'Le podium', value: 4 },
    ]);
    expect(new Set(tvModes.map((mode) => mode.value)).size).toBe(tvModes.length);
  });
});
