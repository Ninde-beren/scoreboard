import { db } from '@shared/infra/db/db';

import { hydrateMatchTeams } from './hydrateMatch';

const GetStage = async (where: any) => {
  const stage: any = await db.table('stage').get({ ...where });

  if (!stage) return;
  if (stage.matchs) {
    stage.matchs = await db.match.where('id').anyOf(stage.matchs).toArray();
    for (const match of stage.matchs) {
      await hydrateMatchTeams(match, { withWinner: true });
    }
  }
  return stage;
};

export default GetStage;
