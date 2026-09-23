import type { Team } from '@shared/model/Team';
import type { ReactNode } from 'react';

export type TabPanelProps = {
  children?: ReactNode;
  index: number;
  value: number;
};

export type TeamBuildingMemberProps = {
  team: Team;
  teamId: number;
};

export type TeamBuildingTeamProps = {
  team: Team;
};
