
import { fetchStoreDetails } from "@/app/actions";
import { fetchStoreDetailsController } from "@/modules/storeModule/store.controller";
import { connectToDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";


// export async function GET(req: NextRequest) {
//     try {
//         const store_website = req.nextUrl?.searchParams.get("store_website");

//         if (!store_website) {
//             return NextResponse.json({
//                 success: false,
//                 message: 'Store Website is required',
//             }, { status: 400 });
//         }

//         const result = await fetchStoreDetails(store_website);

//         return NextResponse.json({
//             success: true,
//             store: result.store
//         });
//     }  catch (error : any) {
//         console.error(error);
//         return NextResponse.json({
//             success: false,
//             message: error.message,
//         });
//     }
// }


export async function GET(req: NextRequest) {
    try {
        const storeWebsite = req.nextUrl?.searchParams.get("store_website");

        if (!storeWebsite) {
            return NextResponse.json({
                success: false,
                message: 'Store Website is required',
            }, { status: 400 });
        }

        const result = await fetchStoreDetailsController({ storeWebsite });
        return NextResponse.json(result);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to fetch stores',
        });
    }
}