import { Team } from './Team';

export type Match = {
  id: number;
  teamA: Team;
  teamB: Team;
  scoreTeamA: number;
  scoreTeamB: number;
  winner: Team;
};
