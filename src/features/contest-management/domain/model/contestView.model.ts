import type { Contest } from '@shared/model/Contest';
import type { Dispatch, SetStateAction } from 'react';

export type ViewMode = 'team' | 'pool' | 'tournament' | 'podium';
export type ViewState = [
  mode: ViewMode,
  setupTeams: boolean,
  poolsReady: boolean,
  tournamentMode: boolean,
];

export type HeaderTab = {
  label: string;
  value: ViewMode;
  selected: boolean;
  disabled: boolean;
};

export type TvModeAction = {
  label: string;
  value: 0 | 1 | 2 | 3 | 4;
};

export type ContestHeaderProps = {
  tabs: HeaderTab[];
  onTabChange: (mode: ViewMode) => void;
  tvModes: TvModeAction[];
  onReset: () => void;
  onOpenWindow: () => void;
  onSelectViewerPage: (viewerPage: 0 | 1 | 2 | 3 | 4) => void;
  view: ViewState;
  setView: Dispatch<SetStateAction<ViewState>>;
  contest: Contest;
};

export type TvModeDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (viewerPage: 0 | 1 | 2 | 3 | 4) => void;
  actions: TvModeAction[];
};
