import {Stage} from "./Stage";
import {Match} from "./Match";
import {Team} from "./Team";

export interface Pool {
    id: number
    matchs: Match[]
    teams: Team[]
    stage: Stage
}