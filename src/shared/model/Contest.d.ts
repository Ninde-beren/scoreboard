import { Params } from './Params';
import { Stage } from './Stage';
import { Team } from './Team';
export type Contest = {
  id: number;
  name: string;
  date: date;
  teams: Team[];
  stages: Stage[];
  winners: any[any];
  params: Params;
};
