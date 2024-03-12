import {Team} from "./Team";
import {Stage} from "./Stage";
import {Params} from "./Params";
export interface Contest {
    id: number;
    name: string;
    date: date;
    teams: Team[];
    stages: Stage[]
    winners: any[any]
    params: Params
}