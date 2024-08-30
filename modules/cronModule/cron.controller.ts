"use server"
import { CronJobData } from "@/app/types/cronType";
import { deleteCronByIdService, findAndUpdateCronService, getCronsDataService, insertSingleCronService, toggleStatusByIdService } from "./cron.service";
import HandleResponse from '@/helpers/serverResponse';
import { globalCronStore } from "@/lib/globalRef";
import { CronJob } from "cron";
import { excuteCronOffers, excuteCronOfferStatus, excuteCronStrores, executeCronCategories } from "@/lib/Actions/cronsActions";
import { ObjectId } from "mongodb";

export const getCronsDataController = async () => {
    try {
        const response = await getCronsDataService();
        return response
    } catch (error: any) {
        if (error instanceof Error) {
            return new HandleResponse(500, error.message, null)
        } else {
            return new HandleResponse(500, "An unknown error occurred", null)
        }
    }
}

export const addOrUpdateCronController = async (cronJob: CronJobData, warmUp?: boolean) => {
    try {
        let cronId = cronJob._id;
        let existingCron = false;
        if (!cronId) {
            const insertionRes = await insertSingleCronService(cronJob);
            if (insertionRes.status !== 200) return insertionRes;
            cronId = insertionRes.data!.toString();
        } else {
            if (!warmUp) {
                let cronTask = globalCronStore.get(cronId.toString());
                if (!cronTask) return new HandleResponse(404, "no cron task found for id " + cronId + " in global cron data", null);
                cronTask?.stop()
            }
            // Handle update
            const cronUpdateRes = await findAndUpdateCronService(cronId, cronJob ,warmUp);
            if (cronUpdateRes.status !== 200) return cronUpdateRes
            existingCron = true;
            globalCronStore.delete(cronId.toString());
        }
        // add cron task according to type !
        let cronTask;
        switch (cronJob.type) {
            case "Category":
                cronTask = new CronJob(
                    cronJob.pattern,
                    async function () {
                        await executeCronCategories();
                    },
                    null,
                    false,
                    process.env.TIMEZONE || 'Asia/Kolkata'
                );
                break;
            case "Offers":
                cronTask = new CronJob(
                    cronJob.pattern,
                    async function () {
                        // console.log("Offers cron is starting");
                        await excuteCronOffers();
                    },
                    null,
                    false,
                    process.env.TIMEZONE || 'Asia/Kolkata'
                );
                break;
            case "Stores":
                cronTask = new CronJob(
                    cronJob.pattern,
                    async function () {
                        // console.log("Stores cron is starting");
                        await excuteCronStrores();
                    },
                    null,
                    false,
                    process.env.TIMEZONE || 'Asia/Kolkata'
                );
                break;
            case "Offer Status Checker":
                cronTask = new CronJob(
                    cronJob.pattern,
                    async function () {
                        await excuteCronOfferStatus();
                    },
                    null,
                    false,
                    process.env.TIMEZONE || 'Asia/Kolkata'
                );
                break;
            default:
                return new HandleResponse(200, "Invalid cron type", null)
        }
        // set cron to global cron data
        globalCronStore.set(cronId.toString(), cronJob, cronTask);
        const addedCron = globalCronStore.get(cronId.toString());


        if (cronJob.status === "Active" && addedCron) {
            console.log("cron marked active")
            cronTask.start();
            return new HandleResponse(200, existingCron ? `Cron updated successfully: ${cronJob.description}` : `Cron set successfully: ${cronJob.description}, cronId`, cronId.toString())

        } else if (cronJob.status === "Inactive" && addedCron && existingCron) {
            cronTask.stop();
            return new HandleResponse(200, existingCron ? `Cron updated successfully: ${cronJob.description}` : `Cron updated successfully: ${cronJob.description}`, cronId.toString())
        } else {
            return new HandleResponse(500, "something went wrong ! origin = >cron.controller (fctn=>addNewCronController")
        }

    } catch (error: any) {
        if (error instanceof Error) {
            return new HandleResponse(500, error.message, null)
        } else {
            return new HandleResponse(500, "An unknown error occurred", null)
        }
    }
}

export const deleteCronByIdController = async (id: string | ObjectId) => {
    try {
        let idString: string = id.toString()
        const cronTask = globalCronStore.get(idString);
        if (!cronTask) return new HandleResponse(404, "Cron task not found for id: " + id, null);
        const deleteCronResponse = await deleteCronByIdService(id);
        if (deleteCronResponse.status !== 200) return deleteCronResponse;
        if (deleteCronResponse.data as number
            > 0
        ) {
            cronTask?.stop()
            globalCronStore.delete(idString)
        } else {
            return new HandleResponse(500, "Cron is not deleted deleted count val is 0", null);
        }
        return new HandleResponse(200, "Cron and cron Task From Map deleted Successfully!", null);
    } catch (error) {
        if (error instanceof Error) {
            return new HandleResponse(500, error.message, null)
        } else {
            return new HandleResponse(500, "An unknown error occurred", null)
        }
    }
}


export const toggleStatusByIdController = async (id: string, status: string) => {
    try {
        let cronTask = globalCronStore.get(id.toString());
        if (!cronTask) return new HandleResponse(404, "Cron task not found inside Map id is " + id, null);
        status === "Inactive" ? cronTask?.stop() : cronTask?.start();

        const dbRes = await toggleStatusByIdService(id, status);
        if (dbRes.status !== 200) return dbRes
        return new HandleResponse(200, `Cron db and Map status  changed to ${status} !`, null);
    } catch (error) {
        if (error instanceof Error) {
            return new HandleResponse(500, error.message, null)
        } else {
            return new HandleResponse(500, "An unknown error occurred", null)
        }
    }
}

