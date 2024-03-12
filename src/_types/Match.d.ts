import {Team} from "./Team";

export interface Match {
    id: number;
    teamA: Team;
    teamB: Team;
    scoreTeamA: number;
    scoreTeamB: number;
    winner: Team
}