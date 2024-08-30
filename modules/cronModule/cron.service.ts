"use server"

import { CronJob, CronJobData } from "@/app/types/cronType";
import HandleResponse from "../../helpers/serverResponse";
import { connectToDB } from "@/utils/db";
import { Document, ObjectId, WithId } from 'mongodb';
import { revalidatePath } from "next/cache";
import { globalCronStore } from "@/lib/globalRef";

// Convert MongoDB document to CronJobData
const mapToCronJobData = (doc: WithId<Document>): CronJob => ({
    _id: doc._id.toString(), // Convert ObjectId to string
    type: doc.type,
    pattern: doc.pattern,
    description: doc.description,
    status: doc.status
});

export const getCronsDataService = async() => {
    try {
        const db = await connectToDB();
        const cronsCollection = db.collection("crons");
        const cronsCursor = cronsCollection.find().limit(10);
        const crons = await cronsCursor.toArray();

        // Map MongoDB documents to CronJobData
        const cronJobData = crons.map((doc: WithId<Document>) => mapToCronJobData(doc));

        return new HandleResponse<CronJob[]>(200, "Cron data fetched successfully!",cronJobData);
    } catch (error:any) {
        console.log(error);
        return new HandleResponse(500, `Failed to fetch cron data: ${error.message}`,null);
    }
}

export const insertSingleCronService = async (cronJob : CronJobData)=>{
   try {
     const db = await connectToDB();
     const cronJobsCollection = db.collection("crons");
     const result =await cronJobsCollection.insertOne({
         pattern: cronJob.pattern, 
         description: cronJob.description ,
         status : cronJob.status,
         type : cronJob.type
     });
     return new HandleResponse(200, "Cron insertion To db Success", result.insertedId.toString())
   } catch (error) {
    if (error instanceof Error) {
        return new HandleResponse(500, error.message, null)
    } else {
        return new HandleResponse(500, "An unknown error occurred", null)
    }
   }
}

export const findAndUpdateCronService = async (cronId : string , cronJob :CronJobData ,warmUp?:boolean)=>{
   try {
     const db = await connectToDB();
     const cronJobsCollection = db.collection("crons");
     const existingCron = await cronJobsCollection.findOne({ _id: new ObjectId(cronId) });
     if(!existingCron) return new HandleResponse(404 , "no cron found for id " + cronId , null)
     if (existingCron.pattern !== cronJob.pattern || warmUp) {
        await cronJobsCollection.updateOne(
          { _id: new ObjectId(cronId) },
          { $set: { pattern: cronJob.pattern, description: cronJob.description } }
        );
       revalidatePath("/admin/cron")
        return new HandleResponse(200, "Cron updated successfully !", null)
      }else{
          return new HandleResponse(500, "Expected new Cron Pattern (try To modify same Time)", null)
      }
   } catch (error) {
    if (error instanceof Error) {
        return new HandleResponse(500, error.message, null)
    } else {
        return new HandleResponse(500, "An unknown error occurred", null)
    }
   }
}

export const deleteCronByIdService =async (id : ObjectId | string) =>{
    try {
        const db = await connectToDB();
        const cronsCollection = db.collection("crons");
        const result = await cronsCollection.deleteOne(
            { _id: new ObjectId(id) }
          );
       revalidatePath("/admin/cron")
          return new HandleResponse(200, "Cron deleted successfully",  result.deletedCount);
    } catch (error) {
        if (error instanceof Error) {
            return new HandleResponse(500, error.message, null)
        } else {
            return new HandleResponse(500, "An unknown error occurred", null)
        }
    }
}

export const toggleStatusByIdService = async (id: string , status : string) => {
    try {
        const db = await connectToDB();
        const cronsCollection = db.collection("crons");
        const result = await cronsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
          );
          if (result.modifiedCount > 0) {
            return new HandleResponse(200 ,`Cron job status changed to ${status} in db`,null)
          } else {
            return new HandleResponse(500 ,`Cron job status does not changed to ${status} in db`,null)
          }
    } catch (error) {
        if (error instanceof Error) {
            return new HandleResponse(500, error.message, null)
        } else {
            return new HandleResponse(500, "An unknown error occurred", null)
        }
    }
}
