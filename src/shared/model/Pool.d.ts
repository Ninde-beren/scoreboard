import { Match } from './Match';
import { Stage } from './Stage';
import { Team } from './Team';

export type Pool = {
  id: number;
  matchs: Match[];
  teams: Team[];
  stage: Stage;
};
