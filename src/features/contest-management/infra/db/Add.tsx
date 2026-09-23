import { db } from '@shared/infra/db/db';

const Add = async (entity: any, item: any) => {
  try {
    // Add the new friend!
    const id = await db.table(entity).add(item);
    return await db.table(entity).get(id);
  } catch {
    return undefined;
  }
};
export default Add;
