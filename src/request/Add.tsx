import {db} from "../db";

const Add = async (entity: any, item: any) => {
    try {
        // Add the new friend!
        const id = await db.table(entity).add(item);
        return await db.table(entity).get(id)
    } catch (error) {
        console.log(error)
    }
}
export default Add