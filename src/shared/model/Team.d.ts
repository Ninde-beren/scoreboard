import { Member } from './Member';

export type Team = {
  id: number;
  name: string;
  score: number;
  members: Member[];
  color: number;
};
