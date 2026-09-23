import { Contest } from '@shared/model/Contest';
import { Match } from '@shared/model/Match';
import { Member } from '@shared/model/Member';
import { Params } from '@shared/model/Params';
import { Pool } from '@shared/model/Pool';
import { Stage } from '@shared/model/Stage';
import { Team } from '@shared/model/Team';
import Dexie, { Table } from 'dexie';
export class MyAppDatabase extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  contest!: Table<Contest>;
  params!: Table<Params>;
  stage!: Table<Stage>;
  pool!: Table<Pool>;
  match!: Table<Match>;
  team!: Table<Team>;
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
    });
  }
}

export const db = new MyAppDatabase();
