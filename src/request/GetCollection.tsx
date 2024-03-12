import React from 'react';
import {db} from "../db";

const GetCollection = async (entity: any) => {
        try {
            // Add the new friend!
            return await db.table(entity).toArray()
        } catch (error) {
            console.log(error)
        }
};

export default GetCollection;
