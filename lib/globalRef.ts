import { CronJobData } from '@/app/types/cronType';
import { CronJob } from 'cron';



declare global {
  var cronMap: Map<string, CronJob> | undefined;
  var cronDataMap: Map<string, CronJobData> | undefined;
}

class GlobalCronStore {
  constructor() {
    if (!global.cronMap) {
      global.cronMap = new Map<string, CronJob>();
    }
    if (!global.cronDataMap) {
      global.cronDataMap = new Map<string, CronJobData>();
    }
  }

  set(cronId: string, cronData: CronJobData, cronTask: CronJob): void {
    global.cronMap!.set(cronId, cronTask);
    global.cronDataMap!.set(cronId, cronData);
  }

  get(cronId: string): CronJob | undefined {
    return global.cronMap!.get(cronId);
  }

  getData(cronId: string): CronJobData | undefined {
    return global.cronDataMap!.get(cronId);
  }

  delete(cronId: string): boolean {
    global.cronDataMap!.delete(cronId);
    return global.cronMap!.delete(cronId);
  }

  getAll(): Map<string, CronJob> {
    return new Map(global.cronMap!);
  }

  getAllData(): Map<string, CronJobData> {
    return new Map(global.cronDataMap!);
  }
}

export const globalCronStore = new GlobalCronStore();