import HandleResponse, { handleNextResponse } from "@/helpers/serverResponse";
import { addOrUpdateCronController, deleteCronByIdController, getCronsDataController, toggleStatusByIdController } from "@/modules/cronModule/cron.controller";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from 'next/server';

type CronTask = () => void;

interface CronMap {
  [cronId: string]: CronTask;
}

export async function GET() {
  const res = await getCronsDataController();
  return handleNextResponse(res)
}

export async function POST(req: NextRequest) {
  const { cronJob ,warmUp} = await req.json();
  if (!cronJob) return handleNextResponse(new HandleResponse(404, "No Cron Job data available", null))
  const res = await addOrUpdateCronController(cronJob , warmUp);
  return handleNextResponse(res)
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  if(!id || !status) return handleNextResponse(new HandleResponse(404 , "either id or status is not found!",null))

    const res= await toggleStatusByIdController(id ,status);
    return handleNextResponse(res);

}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return handleNextResponse(new HandleResponse(404, "Corn Id not found To Delete Cron!"))
   const res =  await deleteCronByIdController(id);
  if(res.status === 200) {revalidatePath("/admin/cron")}
  return handleNextResponse(res);
}