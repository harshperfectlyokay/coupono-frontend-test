"use server"

import HandleResponse from "@/helpers/serverResponse"

const getAccessListController = async ():Promise<any>=>{
    try {
        const response = await getAccessListController();
        return response;
    } catch (error) {
        if(error instanceof Error){
            return new HandleResponse(500 , error.message, null);
        }else{
            return new HandleResponse(500 , "An unknown error occurred" , null);
        }
    }
}