export interface CronJob {
    _id: string;
  type: string;
  pattern: string;
  description: string;
  status: 'Active' | 'Inactive';
  }


  // export type CronJobData=Partial<Pick<CronJob , "_id">> & Omit<CronJob , "_id">

  export interface CronJobData {
    _id?: string;
    description: string;
    pattern: string;
    status: 'Active' | 'Inactive';
    type: string;
  }