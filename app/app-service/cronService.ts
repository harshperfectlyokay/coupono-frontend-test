
import { getCronsDataController } from "@/modules/cronModule/cron.controller";
import { CronJob } from "../types/cronType";


export const deleteCron = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/private/cron`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    })
    let data = await res.json()
    return data
}

export const getAllCrons = async () => {
    let data = await getCronsDataController();
   return data;
}

export const addOrUpdateCron = async (cronJob: CronJob) => {
    const response = await fetch(`/api/private/cron`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({cronJob}),
      });
      return response.json();
}


export const updateCronStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/private/cron`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
    })
    let data = await res.json()
    return data
}