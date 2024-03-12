import {db} from "../db";

const GetContest = async () => {

    // Add the new friend!
    const contest: any = await db.table('contest').get(1);

    if (!contest) return
    [contest.stages] = await Promise.all([
        db.stage.where('id').anyOf(contest?.stages).toArray()
    ]);
    [contest.teams] = await Promise.all([
        db.team.where('id').anyOf(contest?.teams).toArray(),
    ]);
    [contest.params] = await Promise.all([
        db.params.get(1),
    ]);

    if (contest.teams.length > 0)
        await Promise.all(contest.teams?.map(async (team: any, index: number) =>
            [team.members] = await Promise.all([db.member.where('id').anyOf(team.members).toArray()])
        ))
    //  if (contest.stages.length > 0)
    await Promise.all(contest.stages?.map(async (stage: any, index: number) => {
            if (stage.pools) {
                [stage.pools] = await Promise.all([db.pool.where('id').anyOf(stage.pools).toArray()]);
                await Promise.all(stage.pools?.map(async (pool: any, index: number) => {
                    [pool.matchs] = await Promise.all([db.match.where('id').anyOf(pool.matchs).toArray()])
                    await Promise.all(pool.matchs?.map(async (match: any, index: number) => {
                        if (match.teamA) {
                            [match.teamA] = await Promise.all([db.team.get(match.teamA)]);
                            [match.teamA.members] = await Promise.all([db.member.where('id').anyOf(match.teamA.members).toArray()])
                        }
                        if (match.teamB) {
                            [match.teamB] = await Promise.all([db.team.get(match.teamB)]);
                            [match.teamB.members] = await Promise.all([db.member.where('id').anyOf(match.teamB.members).toArray()])
                        }
                    }))
                }))
            }
            if (stage.matchs) {
                console.log('je suis icic');
                [stage.matchs] = await Promise.all([db.match.where('id').anyOf(stage.matchs).toArray()])
                await Promise.all(stage.matchs?.map(async (match: any, index: number) => {
                        if (match.teamA) {
                            [match.teamA] = await Promise.all([db.team.get(match.teamA)]);
                            [match.teamA.members] = await Promise.all([db.member.where('id').anyOf(match.teamA.members).toArray()])
                        }
                        if (match.teamB) {
                            [match.teamB] = await Promise.all([db.team.get(match.teamB)]);
                            [match.teamB.members] = await Promise.all([db.member.where('id').anyOf(match.teamB.members).toArray()])
                        }
                    }
                ))
            }
        }
    ))

    localStorage.setItem('contest', JSON.stringify(contest))
    return contest
}
export default GetContest