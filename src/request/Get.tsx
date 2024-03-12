import {db} from "../db";

const Get = async (entity: any, id: number) => {
    try {
        return await db.table(entity).get(id)
    } catch (error) {
        console.log(error)
    }
}
export default Get