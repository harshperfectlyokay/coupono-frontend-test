import { getAllRoutesAccess } from "@/app/actions";
import { NextResponse } from "next/server";

export async function GET(){
    try {
      const data = await getAllRoutesAccess()
      return NextResponse.json({
        data,
        success: true,
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json({
        success: false,
        status: 500,
      });
    }
  }