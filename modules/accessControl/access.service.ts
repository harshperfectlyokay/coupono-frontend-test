"use server"

import HandleResponse from "@/helpers/serverResponse";
import { connectToDB } from "@/utils/db";

export const getAccessListController = async () => {
    try {
        const db = await connectToDB();
        const accessCollection =  db.collection("routes");
        const accessCursor = accessCollection.find()
        const result = await accessCursor.toArray()
        return new HandleResponse(200 , "AccessData fetched successfully!" , result)
    } catch (error) {
        if(error instanceof Error){
            return new HandleResponse(500 , error.message, null);
        }else{
            return new HandleResponse(500 , "An unknown error occurred" , null);
        }
    }
};