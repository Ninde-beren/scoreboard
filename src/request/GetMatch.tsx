import {db} from "../db";

const GetMatch = async (id: number) => {

    const match: any = await db.table('match').get(id);

    if (!match) return
    if (match.teamA) {
        [match.teamA] = await Promise.all([db.team.get(match.teamA)]);
        [match.teamA.members] = await Promise.all([db.member.where('id').anyOf(match.teamA.members).toArray()])
    }
    if (match.teamB) {
        [match.teamB] = await Promise.all([db.team.get(match.teamB)]);
        [match.teamB.members] = await Promise.all([db.member.where('id').anyOf(match.teamB.members).toArray()])
    }

    return match
};

export default GetMatch;
