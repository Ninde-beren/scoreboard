import Dexie, {Table} from 'dexie';
import {Contest} from "./_types/Contest";
import {Stage} from "./_types/Stage";
import {Match} from "./_types/Match";
import {Team} from "./_types/Team";
import {Member} from "./_types/Member";
import {Pool} from "./_types/Pool";
import {Params} from "./_types/Params";
export class MyAppDatabase extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    contest!:Table<Contest>;
    params!:Table<Params>;
    stage!:Table<Stage>;
    pool!:Table<Pool>;
    match!:Table<Match>;
    team!:Table<Team>;
    member!: Table<Member>;
    constructor() {
        super('scoreboard');
        this.version(1).stores({
            contest: '++id, name, date, *stages, *teams, winners, params', // Primary key and indexed props
            params: '++id, teamNumber, poolNumber', // Primary key and indexed props
            stage: '++id, type, *matchs, *pools, subContest, [type+subContest]', // Primary key and indexed props
            pool: '++id, *matchs, *teams, stage', // Primary key and indexed props
            match: '++id, teamA, teamB, scoreTeamA, scoreTeamB, winner', // Primary key and indexed props
            team: '++id, name, *members, color, [name+members+id+color]', // Primary key and indexed props
            member: '++id, name', // Primary key and indexed props
    })
}
}

export const db = new MyAppDatabase();