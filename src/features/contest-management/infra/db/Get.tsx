import { db } from '@shared/infra/db/db';

const Get = async (entity: any, id: number) => {
  try {
    return await db.table(entity).get(id);
  } catch {
    return undefined;
  }
};
export default Get;
