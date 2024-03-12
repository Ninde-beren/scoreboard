import {db} from "../db";

const Update = async (entity: any, itemId: number, attributs: any) => {
    try {
        await db.table(entity).update(itemId, attributs)
        return await db.table(entity).get(itemId)
    } catch (error) {
        console.log(error)
    }
}
export default Update