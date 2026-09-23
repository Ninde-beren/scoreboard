import type { ButtonProps } from '@mui/material';
import type { Contest } from '@shared/model/Contest';
import type { Match } from '@shared/model/Match';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

import type { ViewState } from './contestView.model';

export type PoolGeneratorProps = {
  contest: Contest;
  nextStep: any;
};

export type HeaderBarProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

export type HeaderButtonProps = ButtonProps;
export type HeaderTVButtonProps = ButtonProps;

export type TabItem = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

export type EventTabsProps = {
  value: string | number;
  items: TabItem[];
  onChange?: (value: string | number) => void;
};

export type MatchOutPoolGeneratorProps = {
  step: any[];
  nextStep: any;
};

export type TeamViewProps = {
  contest: Contest;
};

export type PoolSummaryProps = {
  contest: Contest;
  setView: Dispatch<SetStateAction<ViewState>>;
};

export type TournamentViewProps = {
  contest: Contest;
  view: ViewState;
  setView: Dispatch<SetStateAction<ViewState>>;
};

export type MatchProps = {
  match: Match;
  noNumber?: boolean;
};

export type PodiumProps = {
  contest: Contest;
  subContest: any;
  nextStep: any;
  readOnly?: boolean;
};

export type AddMatchScoreProps = {
  match: Match;
  openAction: boolean;
  setOpenAction: any;
};

export type TvModeActionButtonProps = {
  label: string;
  value: 0 | 1 | 2 | 3 | 4;
  onSelect: (value: 0 | 1 | 2 | 3 | 4) => void;
  onClose: () => void;
};
