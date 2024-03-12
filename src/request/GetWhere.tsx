import {db} from "../db";

const GetWhere = async (entity: any, where: any) => {
    try {
        // Add the new friend!
        return await db.table(entity).get({...where})
    } catch (error) {
        console.log(error)
    }
}
export default GetWhere