import { db } from '@shared/infra/db/db';

const GetWhere = async (entity: any, where: any) => {
  try {
    // Add the new friend!
    return await db.table(entity).get({ ...where });
  } catch {
    return undefined;
  }
};
export default GetWhere;
