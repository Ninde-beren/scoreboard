import { db } from '@shared/infra/db/db';

import { hydrateMatchTeams } from './hydrateMatch';

const GetPool = async (id: number) => {
  // Add the new friend!
  const pool: any = await db.table('pool').get(id);

  if (!pool) return;

  pool.matchs = await db.match.where('id').anyOf(pool.matchs).toArray();
  for (const match of pool.matchs) {
    await hydrateMatchTeams(match, { withWinner: true });
  }

  return pool;
};
export default GetPool;
