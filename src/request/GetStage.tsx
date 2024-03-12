import {db} from "../db";

const GetStage = async (where: any) => {

    const stage: any = await db.table('stage').get({...where});

    if (!stage) return
    if (stage.matchs) {
        [stage.matchs] = await Promise.all([db.match.where('id').anyOf(stage.matchs).toArray()])
        await Promise.all(stage.matchs?.map(async (match: any, index: number) => {
            if (match.winner) {
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
    }
    return stage
};

export default GetStage;
