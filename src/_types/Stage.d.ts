import {Match} from "./Match";
import {Pool} from "./Pool";
import {StageType} from "./StageType";
import {SubContest} from "./SubContest";

export interface Stage {
    id: number
    type: StageType
    matchs: Match[]
    pools: Pool[]
    subContest: SubContest
    totalMatchs: number
}