import type { Contest } from '@shared/model/Contest';
import type { Match } from '@shared/model/Match';
import type { Pool } from '@shared/model/Pool';
import type { Stage } from '@shared/model/Stage';
import type { Team } from '@shared/model/Team';

export type ScoreboardPoolsProps = {
  contest: Contest;
};

export type ScoreboardTournamentProps = {
  contest: Contest;
};

export type ScoreboardPodiumProps = {
  contest: Contest;
};

export type RankingProps = {
  contest: Contest;
};

export type TeamBuildingProps = {
  contest: Contest;
};

export type PoolProps = {
  pool: Pool;
};

export type TournamentMatchProps = {
  match: Match;
};

export type TournamentTeamProps = {
  team: Team;
  scoreTeam: number;
};

export type EditMatchScoreProps = {
  stage: Stage;
};

export type ItemRankingProps = {
  team: Team;
  index: number;
};
