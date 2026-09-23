import {
  HeaderTab,
  TvModeAction,
  ViewState,
} from '@features/contest-management/domain/model/contestView.model';

export const buildManagementContestVM = (view: ViewState) => {
  const [mode, setupTeams, , tournamentMode] = view;
  const canPool = !setupTeams;
  const canTournament = tournamentMode;

  const tabs: HeaderTab[] = [
    { label: 'EQUIPE', value: 'team', selected: mode === 'team', disabled: false },
    {
      label: 'TOURNOI',
      value: 'tournament',
      selected: mode === 'tournament',
      disabled: !canTournament,
    },
    { label: 'POOL', value: 'pool', selected: mode === 'pool', disabled: !canPool },
    { label: 'PODIUM', value: 'podium', selected: mode === 'podium', disabled: !canTournament },
  ];

  const tvModes: TvModeAction[] = [
    { label: 'Le classement', value: 3 },
    { label: 'Le tournoi', value: 2 },
    { label: 'Les Equipes', value: 0 },
    { label: 'Les poules', value: 1 },
    { label: 'Le podium', value: 4 },
  ];

  return { tabs, tvModes, canPool, canTournament };
};
