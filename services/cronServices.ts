"use server"

import { CronJobData } from "@/app/types/cronType";
import { revalidatePath } from "next/cache";


// export async function createCron() {
//   const response = await fetch(`${process.env.BASE_URL}/api/private/cron`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({cronJob}),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to create cron job');
//   }
//   revalidatePath("/admin/cron")
//   return response.json();
// }
export async function getCronsData(){
    const res = await fetch(`${process.env.BASE_URL}/api/private/cron`);
    let data = await res.json()
    if(!data.success){
        throw new Error('Failed to get cron job');
    }
    return data.crons
}

export const deleteCron = async(id: string) => {
    const res = await  fetch(`${process.env.BASE_URL}/api/private/cron`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id}),
    })
    let data = await res.json()
    if(!data.success){
        throw new Error('Failed delete the cron status');

    }
    revalidatePath("/admin/cron")
    return data
}
export async function updateCron(cronJobData: CronJobData) {
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/private/cron`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cronJob: cronJobData }),
      });
  
      const data = await response.json();
      revalidatePath('/admin/cron')
      return data;
    } catch (error) {
      console.error('Error updating cron job:', error);
      return { success: false, message: 'Error updating cron job' };
    }
  }
  export const addTaskInSchedule = async function (taskData:CronJobData, isWarmingUp=false)
  {
      if (!taskData) return;
 
        const response = await fetch(`${process.env.BASE_URL}/api/private/cron`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cronJob: taskData , warmup: isWarmingUp }),
          });
          if(!response.ok){
            throw new Error("Failed to created Cron")
          }
          const data = await response.json();
          
          return data
  }
