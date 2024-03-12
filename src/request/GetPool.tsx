import {db} from "../db";

const GetPool = async (id: number) => {

    // Add the new friend!
    const pool: any = await db.table('pool').get(id);

    if (!pool) return

    [pool.matchs] = await Promise.all([db.match.where('id').anyOf(pool.matchs).toArray()])
    await Promise.all(pool.matchs?.map(async (match: any, index: number) => {
        if(match.winner){
        [match.winner] = await Promise.all([db.team.get(match.winner)]);
        }
        if (match.teamA) {
            [match.teamA] = await Promise.all([db.team.get(match.teamA)]);
            [match.teamA.members] = await Promise.all([db.member.where('id').anyOf(match.teamA.members).toArray()])
        }
        if (match.teamB) {
            [match.teamB] = await Promise.all([db.team.get(match.teamB)]);
            [match.teamB.members] = await Promise.all([db.member.where('id').anyOf(match.teamB.members).toArray()])
        }
    }))

    return pool
}
export default GetPool