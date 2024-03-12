import {Member} from "./Member";

export interface Team {
    id: number
    name: string
    score: number
    members: Member[]
    color: number
}