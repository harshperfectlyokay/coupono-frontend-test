import Table from "@/app/components/admin/Tables";
import AddCronButton from '@/app/components/admin/AddCronBtn';
import { getAllCrons } from "@/app/app-service/cronService";
import { CronJob } from "@/app/types/cronType";
import { HandleResponseType } from "@/app/types";
import { headers } from "next/headers";
export const dynamic = "force-dynamic";



const Cron= async () => {
  const customData = headers().get('x-custom-data');
  const parsedData = customData ? JSON.parse(customData) : null;
  console.log("customData ",customData)
  let response:HandleResponseType<CronJob[] | []> =await getAllCrons();
  return (
    <>
      <div className="w-full p-1">
        <AddCronButton 
        />
        <Table
          columns={['Type', 'Pattern', 'Description']}
          cronJobs={response.data}
        />
      </div>
    </>
  );
};

export default Cron;
